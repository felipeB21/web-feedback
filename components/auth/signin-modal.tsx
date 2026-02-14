"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { authClient } from "@/lib/auth-client";

export function SignInModal() {
  return (
    <Dialog>
      <div>
        <DialogTrigger
          render={<Button className={"bg-black font-bold"}>Get Started</Button>}
        />
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Sign in</DialogTitle>
            <DialogDescription>
              Make changes to your profile here. Click save when you&apos;re
              done.
            </DialogDescription>
          </DialogHeader>
          <div className="w-full flex flex-col gap-4">
            <Button className={"w-full"} variant={"secondary"}>
              Sign in with Google
            </Button>
            <Button
              className={"w-full bg-black"}
              onClick={async () =>
                await authClient.signIn.social({
                  provider: "github",
                })
              }
            >
              Sign in with GitHub
            </Button>
          </div>
        </DialogContent>
      </div>
    </Dialog>
  );
}
