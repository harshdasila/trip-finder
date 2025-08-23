"use client";
import { signup } from "@/actions/auth.action";
import Input from "@/components/Input";
import { signUpFormData } from "@/interfaces/auth.interface";
import { signupSchema } from "@/schema/auth.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm } from "react-hook-form";

const page = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<signUpFormData>({
    resolver: zodResolver(signupSchema),
  });

  const onSubmit = async (data: signUpFormData) => {
    const schemaParse = signupSchema.safeParse(data);
    console.log(schemaParse,'schemaparse')
    if (!schemaParse.success) {
      return;
    }
    const formData = new FormData();
    formData.append("email", data.email);
    formData.append("password", data.password);
    formData.append("name", data.name);
    return;
    const result = await signup(formData);
    console.log(result);
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="w-[430px] h-auto bg-white p-6 rounded-lg">
        <div className="text-center mb-3">
          <div className="font-sans text-4xl font-bold">Signup</div>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Input
              label="Name"
              placeholder="Harsh Dasila"
              type="text"
              name="name"
              register={register}
            />
            {errors.name && (
              <p style={{ color: "red" }}>{errors.name.message}</p>
            )}
            <Input
              label="Email"
              placeholder="h@gmail.com"
              type="text"
              name="email"
              register={register}
            />
            {errors.email && (
              <p style={{ color: "red" }}>{errors.email.message}</p>
            )}
            <Input
              label="Password"
              placeholder="Enter your Password"
              type="password"
              name="password"
              register={register}
            />
            {errors.password && (
              <p style={{ color: "red" }}>{errors.password.message}</p>
            )}
            <Input
              label="Confirm Password"
              placeholder="Re-enter your Password"
              type="password"
              name="cnfPassword"
              register={register}
            />
            {errors.cnfPassword && (
              <p style={{ color: "red" }}>{errors.cnfPassword.message}</p>
            )}
            <button type="submit">Sign Up</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default page;
