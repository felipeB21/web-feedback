import { session } from "@/lib/server";
import { SignInModal } from "./signin-modal";
import { NavbarDropdownUser } from "./navbar-dropdown-user";

export default async function NavbarAuth() {
  const user = await session().then((session) => session?.user);
  return (
    <div className="font-sans">
      {user ? <NavbarDropdownUser user={user} /> : <SignInModal />}
    </div>
  );
}
