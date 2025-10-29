"use client";
import { signin } from "@/actions/auth.action";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { siginSchema } from "@/schema/auth.schema";
import Input from "@/components/Input";
import { signInFormData } from "@/interfaces/auth.interface";
import ErrorMessage from "@/components/ErrorMessage";
import { getProviders, signIn, useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { getUserLocation } from "@/utils/getLocation";
import { updateUserLocation } from "@/actions/constant.action";

const page = () => {
  const { data: session, status } = useSession();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<signInFormData>({
    resolver: zodResolver(siginSchema),
  });
  const [providers, setProviders] = useState<any>(null);

  const onSubmit = async (data: signInFormData) => {
    const schemaParse = siginSchema.safeParse(data);
    if (!schemaParse.success) {
      return;
    }
    const formData = new FormData();
    formData.append("email", data.email);
    formData.append("password", data.password);
    const result = await signin(formData);
    console.log(result,'result in frontend')
    if(!result){
      alert("invalid id/password");
      return;
    }
    if(result.success == true){
      const location = await getUserLocation();
      await updateUserLocation(String(location.lat), String(location.lon));
      localStorage.setItem('userLocation', JSON.stringify(location));
      window.location.href = '/trips'
    }
    //login to handle navigation
    reset();
  };

  const handleGoogleLogin = () => {
    signIn("google", {
      callbackUrl: "/trips",
    });
  };

  useEffect(() => {
    const fetchProviders = async () => {
      const res = await getProviders();
      setProviders(res);
    };
    fetchProviders();
  }, []);

  useEffect(() => {
    if (session?.user?.id) {
      redirect("/trips");
    }
  }, [session]);

  return (
    <div className="flex justify-center items-center h-screen bg-black">
      <div className="w-[430px] h-auto p-6 rounded-lg bg-black">
        <div className="mb-3 bg-black">
          <div className="text-white text-4xl font-bold">Login</div>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="mb-3">
              <Input
                label="Email"
                placeholder="Enter you registered email."
                type="text"
                name="email"
                register={register}
              />
              {errors.email && (
                <ErrorMessage text={errors.email.message || null} />
              )}
            </div>
            <div className="mb-3">
              <Input
                label="Password"
                placeholder="Enter Your Password."
                type="password"
                name="password"
                register={register}
              />
              {errors.password && (
                <ErrorMessage text={errors.password.message || null} />
              )}
            </div>
            <button type="submit">Sign In</button>
          </form>
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-gray-50 text-gray-500">
                  Or continue with
                </span>
              </div>
            </div>
          </div>
          {providers?.google && (
            <div className="mt-6">
              <button
                onClick={handleGoogleLogin}
                className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
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
                Sign in with Google
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default page;
