"use client";
import { signin } from "@/actions/auth.action";
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { siginSchema } from "@/schema/auth.schema";
import Input from "@/components/Input";
import { signInFormData } from "@/interfaces/auth.interface";

const page = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<signInFormData>({
    resolver: zodResolver(siginSchema),
  });

  const onSubmit = async (data: signInFormData) => {
    const schemaParse = siginSchema.safeParse(data);
    if(!schemaParse.success){
      return;
    }
    const formData = new FormData();
    formData.append("email", data.email);
    formData.append("password", data.password);
    const result = await signin(formData);
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="w-[430px] h-auto bg-white p-6 rounded-lg">
        <div className="text-center mb-3">
          <div className="font-sans text-4xl font-bold">Signup</div>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Input
              label="Email"
              placeholder="jow@example.com"
              type="text"
              name="email"
              register={register}
            />
            {errors.email && (
              <p style={{ color: "red" }}>{errors.email.message}</p>
            )}
            <Input
              label="Password"
              placeholder="Enter Your Password"
              type="password"
              name="password"
              register={register}
            />
            {errors.password && <p>{errors.password.message}</p>}
            <button type="submit">Sign In</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default page;
