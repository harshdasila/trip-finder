"use client";
import { signup } from "@/actions/auth.action";
import { ProfileImageUpload } from "@/components/ProfileImageUpload";
import Input from "@/components/Input";
import { signUpFormData } from "@/interfaces/auth.interface";
import { signupSchema } from "@/schema/auth.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import ErrorMessage from "@/components/ErrorMessage";

const page = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<signUpFormData>({
    resolver: zodResolver(signupSchema),
  });

//  const [profileImageUrl, setProfileImageUrl] = useState<string|any>(null);

  const onSubmit = async (data: signUpFormData) => {
    const schemaParse = signupSchema.safeParse(data);
    if (!schemaParse.success) {
      return;
    }
    const formData = new FormData();
    formData.append("email", data.email);
    formData.append("password", data.password);
    formData.append("name", data.name);
    // formData.append("profileImageUrl", profileImageUrl);
    const result = await signup(formData);
    reset();
    console.log(result);
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="w-[430px] h-auto bg-white p-6 rounded-lg">
        <div className="text-center mb-3">
          <div className="font-sans text-4xl font-bold">Signup</div>
          {/* <ProfileImageUpload setProfileImageUrl={setProfileImageUrl}/> */}
          <form onSubmit={handleSubmit(onSubmit)}>
            <Input
              label="Name"
              placeholder="Harsh Dasila"
              type="text"
              name="name"
              register={register}
            />
            {errors.name && (
              <ErrorMessage text={errors.name.message || null}/>
            )}
            <Input
              label="Email"
              placeholder="Enter your email address."
              type="text"
              name="email"
              register={register}
            />
            {errors.email && (
              <ErrorMessage text={errors.email.message || null}/>
            )}
            <Input
              label="Password"
              placeholder="Enter your Password"
              type="password"
              name="password"
              register={register}
            />
            {errors.password && (
              <ErrorMessage text={errors.password.message || null}/>
            )}
            <Input
              label="Confirm Password"
              placeholder="Re-enter your Password"
              type="password"
              name="cnfPassword"
              register={register}
            />
            {errors.cnfPassword && (
              <ErrorMessage text={errors.cnfPassword.message || null}/>
            )}
            <button type="submit">Sign Up</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default page;
