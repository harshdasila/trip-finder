import { auth } from "@/lib/auth";
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
