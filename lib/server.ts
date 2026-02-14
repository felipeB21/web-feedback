import { auth } from "./auth";
import { headers } from "next/headers";

export const session = async () => {
  return auth.api.getSession({
    headers: await headers(),
  });
};
