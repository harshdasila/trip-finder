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
import { signIn } from "next-auth/react";
import { redirect } from "next/navigation";
import Link from "next/link";

const page = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<signUpFormData>({
    resolver: zodResolver(signupSchema),
  });

  const handleGoogleLogin = () => {
    signIn("google", {
      callbackUrl: "/trips",
    });
  };

  const onSubmit = async (data: signUpFormData) => {
    console.log(data, "data");
    const schemaParse = signupSchema.safeParse(data);
    if (!schemaParse.success) {
      return;
    }
    const formData = new FormData();
    formData.append("email", data.email);
    formData.append("password", data.password);
    formData.append("name", data.name);
    formData.append("gender", data.gender);
    const result = await signup(formData);
    reset();
    console.log(result);
  };

  return (
    <>
      <div className="main-container">
        <div className="signup-image-container hidden md:flex">
          <div className="signup-overlay-text">
            Friends that <br /> travel together,
            <br /> stays together.
          </div>
        </div>
        <div className="signup-form-container">
          <div className="signup-form-box max-w-md">
            <div className="signup-title">
              <div className="left-1 mb-6">
                <svg
                  width="30"
                  height="29"
                  viewBox="0 0 38 37"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <ellipse cx="19" cy="18.5" rx="19" ry="18.5" fill="#D9D9D9" />
                </svg>
              </div>
              <div className="font-poppins font-bold text-[40px] leading-[40px] tracking-normal text-white text-left">
                Join the <span className="text-[#4CAF50]">Journey</span>
              </div>
              <div className="font-poppins font-normal text-[16px] text-white text-left mb-2">
                Sign up and let the world unfold before you
              </div>
            </div>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="input-containers">
                <div className="mb-3 ">
                  <Input
                    label="Name"
                    placeholder="Enter your full name."
                    type="text"
                    name="name"
                    register={register}
                    required={false}
                  />
                  {errors.name && (
                    <ErrorMessage text={errors.name.message || null} />
                  )}
                </div>
                <div className="mb-3">
                  <Input
                    label="Email"
                    placeholder="Enter your email address."
                    type="text"
                    name="email"
                    register={register}
                    required={true}
                  />
                  {errors.email && (
                    <ErrorMessage text={errors.email.message || null} />
                  )}
                </div>
                <div className="mb-3">
                  <label className="block text-sm font-medium text-white mb-1">
                    Gender
                  </label>
                  <select
                    {...register("gender")}
                    className="w-full px-3 py-2 bg-black text-sm text-[#fff] border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#4CAF50] focus:border-[#4CAF50]"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                  <br></br>
                  {errors.gender && (
                    <ErrorMessage text={errors.gender.message || null} />
                  )}
                </div>
                <div className="mb-3">
                  <Input
                    label="Password"
                    placeholder="Enter your Password"
                    type="password"
                    name="password"
                    register={register}
                    required={true}
                  />
                  {errors.password && (
                    <ErrorMessage text={errors.password.message || null} />
                  )}
                </div>
                <div className="mb-3">
                  <Input
                    label="Confirm Password"
                    placeholder="Re-enter your Password"
                    type="password"
                    name="cnfPassword"
                    register={register}
                    required={true}
                  />
                  {errors.cnfPassword && (
                    <ErrorMessage text={errors.cnfPassword.message || null} />
                  )}
                </div>
              </div>
              <button className="w-full py-3 mt-2 bg-white text-black font-semibold rounded-md shadow hover:bg-gray-200 transition cursor-pointer" type="submit">
                Sign Up
              </button>
              <div className="mt-6">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-[#686677]" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-black text-white">Or</span>
                  </div>
                </div>
              </div>
              <div className="mt-6">
                <button
                  type="button"
                  onClick={handleGoogleLogin}
                  className="cursor-pointer w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                >
                  <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                  Register with Google
                </button>
              </div>
              <div className="text-[#9794AA] mt-2 text-sm">
                Already have an account?{" "}
                <Link
                  href="/login"
                  className="underline text-blue-500 hover:text-blue-600"
                >
                  Log in
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default page;
