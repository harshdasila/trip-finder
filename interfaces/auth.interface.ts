import { siginSchema, signupSchema } from "@/schema/auth.schema";
import z from "zod";

export type signInFormData = z.infer<typeof siginSchema>
export type signUpFormData = z.infer<typeof signupSchema>
export interface ProfileImageUploadProps {
  setProfileImageUrl?: (url: string | null) => void;
  currentImage?: string | null;
  size?: number; // Circle size in pixels
}