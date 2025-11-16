import React from "react";
import { auth } from "../api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";

const layout = ({ children }: { children: React.ReactNode }) => {

  return (
    <div>
      <main>{children}</main>
      <div className="flex justify-center item-center">Made with ❤️ by Harsh Dasila</div>
    </div>
  );
};

export default layout;
