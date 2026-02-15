"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Image from "next/image";
import { authClient } from "@/lib/auth-client";
import Link from "next/link";
import { CreditCard, Library, LogOut, SlidersHorizontal } from "lucide-react";

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
          <DropdownMenuItem
            render={
              <Link href={"/dashboard"}>
                <Library />
                Dashboard
              </Link>
            }
          />

          <DropdownMenuItem
            render={
              <Link href={"/dashboard/billing"}>
                <CreditCard />
                Billing
              </Link>
            }
          />
          <DropdownMenuItem
            render={
              <Link href={"/settings"}>
                <SlidersHorizontal />
                Settings
              </Link>
            }
          />
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem
            className={"text-destructive"}
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
            <LogOut />
            Log out
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
