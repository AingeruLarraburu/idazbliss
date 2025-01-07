import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function getSession() {
  return await getServerSession(authOptions);
}

export function isadmin(email) {
  const autorized = [
    "amartinez@plaiaundi.com",
    "jconejero@plaiaundi.com",
    "mquesada@plaiaundi.com",
    "txemitorrontegi@eskurtze.net",
    "aintzane.ziarreta@easo.eus",
  ];
  return autorized.includes(email);
}
