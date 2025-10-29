import { auth } from "@/app/api/auth/[...nextauth]/route";
import { TripChat } from "@/components/TripChat";
import { NEXT_AUTH } from "@/lib/auth";
import getServerSession  from "next-auth"
import { redirect } from "next/navigation";
import React from "react";

interface PageProps {
  params: Promise<{
    chatID: string;
  }>;
}

export default async function ChatPage({ params }: PageProps) {
  const { chatID } = await params;
  const session = await auth();
  if (!session?.user) {
    redirect("/login");
  }
  // Get user from database using email from session
  const user = await prisma?.user.findUnique({
    where: {
      user_email: session.user.email ?? undefined,
    },
    select: {
      user_id: true,
      user_name: true,
      user_email: true,
      user_image: true,
    },
  });
  
  if (!user) {
    redirect("/login");
  }
  
  const chatRoom = await prisma?.chatRoom.findUnique({
  where: {
    id: chatID,
  },
  include: {
    trip: {
      include: {
        tf_trip_participants: {
          where: {
            user_id: user.user_id,
          },
        },
        trip_owner: true,
      },
    },
  },
});
  
  if (!chatRoom) {
    redirect("/"); // or show error page
  }

  // Check if user is participant or owner
  const isParticipant = chatRoom.trip.tf_trip_participants.length > 0;
  // const isOwner = chatRoom.trip.trip_owner_id === user.user_id;

  if (!isParticipant) {
    redirect("/"); // User doesn't have access to this chat
  }

  return (
    <TripChat
      tripID={chatRoom?.trip_id}
      currentUser={{
        user_id: user.user_id,
        user_name: user.user_name,
        user_image: user.user_image,
      }}
    />
  );
}