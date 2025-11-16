import { NEXT_AUTH } from "@/lib/auth";
import getServerSession from "next-auth";
import { auth } from "./api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
async function getUser() {
  const session = await auth();
  return session;
}

export default async function Home() {
  const session = await getUser();
  // if (session?.user?.id) {
  //   redirect("/trips");
  // }
  // else{
  //   redirect("/login")
  // }
  redirect("/trips");

  // return <div>{JSON.stringify(session)}</div>;
}
