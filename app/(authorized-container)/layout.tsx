import React from "react";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";

const layout = async ({ children }: { children: React.ReactNode }) => {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  return (
    <div>
      {/* Add your authorized layout here (sidebar, navbar, etc.) */}
      <main>{children}</main>
      <div className="flex justify-center item-center">Made with ❤️ by Harsh Dasila</div>
    </div>
  );
};

export default layout;
