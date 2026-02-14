"use client";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

export default function FeedBackLottie() {
  return (
    <div className="w-1/2">
      <DotLottieReact
        src="/feedback.lottie"
        loop
        autoplay
        renderConfig={{
          devicePixelRatio: 1,
        }}
      />
    </div>
  );
}
