import { NEXT_AUTH } from "@/lib/auth";
import getServerSession  from "next-auth"
import { auth } from "./api/auth/[...nextauth]/route";

async function getUser() {
  const session = await auth();
  return session;
}

export default async function Home() {
  const session = await getUser();

  return (
    <div>
      {JSON.stringify(session)}
    </div>
  );
}