"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Image from "next/image";
import { authClient } from "@/lib/auth-client";

type User = {
  name: string;
  email: string;
  image?: string | null | undefined;
};

export function NavbarDropdownUser({ user }: { user: User }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button variant="ghost" className={"flex items-center gap-2"}>
            <Image
              src={user.image as string}
              alt={user.name}
              width={24}
              height={24}
              className="rounded-full"
            />
            <div className="flex flex-col items-start">
              <h5 className="text-xs font-bold">{user.name}</h5>
              <p className="text-xs text-accent-foreground">{user.email}</p>
            </div>
          </Button>
        }
      />
      <DropdownMenuContent className="w-40" align="start">
        <DropdownMenuGroup>
          <DropdownMenuLabel>My Account</DropdownMenuLabel>
          <DropdownMenuItem>
            Dashboard
            <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem>
            Billing
            <DropdownMenuShortcut>⌘B</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem>
            Settings
            <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem
            onClick={async () =>
              await authClient.signOut({
                fetchOptions: {
                  onSuccess: () => {
                    window.location.reload();
                  },
                },
              })
            }
          >
            Log out
            <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
