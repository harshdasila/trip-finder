import React from "react";
import { auth } from "../api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";

const layout = async ({ children }: { children: React.ReactNode }) => {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  return (
    <div>
      {/* Add your authorized layout here (sidebar, navbar, etc.) */}
      <main>{children}</main>
    </div>
  );
};

export default layout;
