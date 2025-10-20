import { useEffect, useState, useCallback, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import { RealtimeChannel } from '@supabase/supabase-js';

interface Message {
  id: string;
  room_id: string;
  sender_id: string;
  sender_name: string;
  sender_image: string | null;
  content: string;
  created_at: string;
}

interface ChatUser {
  user_id: string;
  user_name: string;
  user_image: string | null;
}

export function useSupabaseChat(tripId: string, currentUser: ChatUser) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);
  const [typingUsers, setTypingUsers] = useState<Set<string>>(new Set());
  const channelRef = useRef<RealtimeChannel | null>(null);

  useEffect(() => {
    let mounted = true;

    const setupChat = async () => {
      // First, ensure chat room exists
      const { data: room } = await supabase
        .from('chat_rooms')
        .select('id')
        .eq('trip_id', tripId)
        .single();

      let roomId = room?.id;

      if (!roomId) {
        const { data: newRoom } = await supabase
          .from('chat_rooms')
          .insert({ trip_id: tripId })
          .select('id')
          .single();
        roomId = newRoom?.id;
      }

      if (!roomId || !mounted) return;

      // Load existing messages
      const { data: existingMessages } = await supabase
        .from('messages')
        .select('*')
        .eq('room_id', roomId)
        .order('created_at', { ascending: true });

      if (mounted && existingMessages) {
        setMessages(existingMessages);
        setLoading(false);
      }

      // Set up realtime subscription
      const channel = supabase.channel(`room:${roomId}`, {
        config: {
          presence: {
            key: currentUser.user_id,
          },
        },
      });

      // Handle new messages
      channel
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'messages',
            filter: `room_id=eq.${roomId}`,
          },
          (payload: any) => {
            if (mounted) {
              setMessages((prev) => [...prev, payload.new as Message]);
            }
          }
        )
        // Handle presence (online users)
        .on('presence', { event: 'sync' }, () => {
          if (!mounted) return;
          const state = channel.presenceState();
          const users = Object.keys(state);
          setOnlineUsers(users);
        })
        // Handle typing indicators
        .on('broadcast', { event: 'typing' }, ({ payload }: any) => {
          if (!mounted) return;
          setTypingUsers((prev) => {
            const newSet = new Set(prev);
            if (payload.isTyping) {
              newSet.add(payload.userId);
            } else {
              newSet.delete(payload.userId);
            }
            return newSet;
          });
        })
        .subscribe(async (status: any) => {
          if (status === 'SUBSCRIBED' && mounted) {
            // Track user presence
            await channel.track({
              user_id: currentUser.user_id,
              user_name: currentUser.user_name,
              online_at: new Date().toISOString(),
            });
          }
        });

      channelRef.current = channel;
    };

    setupChat();

    return () => {
      mounted = false;
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
      }
    };
  }, [tripId, currentUser]);

  const sendMessage = useCallback(
    async (content: string) => {
      // Get room_id first
      const { data: room } = await supabase
        .from('chat_rooms')
        .select('id')
        .eq('trip_id', tripId)
        .single();

      if (!room) throw new Error('Chat room not found');

      const { data, error } = await supabase.from('messages').insert({
        room_id: room.id,
        sender_id: currentUser.user_id,
        sender_name: currentUser.user_name,
        sender_image: currentUser.user_image,
        content,
      }).select().single();

      if (error) throw error;
      return data;
    },
    [tripId, currentUser]
  );

  const sendTypingIndicator = useCallback(
    (isTyping: boolean) => {
      if (channelRef.current) {
        channelRef.current.send({
          type: 'broadcast',
          event: 'typing',
          payload: {
            userId: currentUser.user_id,
            userName: currentUser.user_name,
            isTyping,
          },
        });
      }
    },
    [currentUser]
  );

  return {
    messages,
    loading,
    onlineUsers,
    typingUsers: Array.from(typingUsers).filter(id => id !== currentUser.user_id),
    sendMessage,
    sendTypingIndicator,
  };
}