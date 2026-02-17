"use client";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

export default function LockedLottie() {
  return (
    <div className="w-1/2">
      <DotLottieReact
        src="/locked.lottie"
        loop
        autoplay
        renderConfig={{
          devicePixelRatio: 1,
        }}
      />
    </div>
  );
}
