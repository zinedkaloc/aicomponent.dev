"use client";
import { Github } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/Tooltip";
import TwitterLogo from "@/components/TwitterLogo";
import { useState } from "react";

const tweetIntents = [
  "Just used AI to craft an EPIC landing page in minutes with AIpage.dev ! 🤖 This is the future of web design! Check it out 👉 @aipagedev",
  "Creating a stunning webpage has never been easier thanks to AIpage.dev! 🚀 Give it a try 👉 @aipagedev",
  "Web design will never be the same after you try AIpage.dev! 🛠️ A whole new level of creativity unleashed! Check it out 👉 @aipagedev",
  "Revolutionize your web design process with AIpage.dev. The future is here! 👉 @aipagedev",
  "I just built an amazing webpage with AIpage.dev in minutes! 🌟 You have to try this 👉 @aipagedev",
  "AIpage.dev is a game-changer for web design! Say hello to efficiency 👋 @aipagedev",
  "Why spend hours on web design when AIpage.dev can do it in minutes? 🕒 Check it out! 👉 @aipagedev",
  "Impressed by the power of AI in web design with AIpage.dev! This is incredible 👀 @aipagedev",
  "I used AIpage.dev and it completely transformed how I approach web design. You need to try this! 🎉 @aipagedev",
  "Just when I thought web design couldn’t get any easier, I found AIpage.dev! 🎊 Try it now 👉 @aipagedev",
  "Unleashing my inner designer with the help of AIpage.dev. This is next level! 🚀 Check it out 👉 @aipagedev",
  "With AIpage.dev, I can focus on creativity while AI handles the coding. It’s amazing! 💥 @aipagedev",
];

export default function Socials() {
  const getRandomIndex = () => {
    return Math.floor(Math.random() * tweetIntents.length);
  };

  const [tweet, setTweet] = useState(tweetIntents[getRandomIndex()]);

  const handleClick = () => {
    setTweet(tweetIntents[getRandomIndex()]);
  };

  return (
    <section className="fixed bottom-6 right-6 flex items-center gap-3 flex-col">
      <TooltipProvider>
        <Tooltip delayDuration={0}>
          <TooltipTrigger>
            <a
              onClick={handleClick}
              href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(
                tweet,
              )}`}
              target="_blank"
              rel="noreferrer"
              className="text-2xl"
            >
              <TwitterLogo className="h-5 w-5 fill-current" />
            </a>
          </TooltipTrigger>
          <TooltipContent align="end" side="top" className="w-[300px]">
            Help spread the word! 📢 Post a tweet of your creation on Twitter
            and tag @aipagedev for early access to our exclusive beta—packed
            with stunning features. 🚀
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <TooltipProvider>
        <Tooltip delayDuration={0}>
          <TooltipTrigger>
            <a
              href="https://github.com/zinedkaloc/aicomponent.dev"
              target="_blank"
              rel="noreferrer"
              className="text-2xl"
            >
              <Github />
            </a>
          </TooltipTrigger>
          <TooltipContent align="end" side="left">
            Star us on Github to show your support
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </section>
  );
}
