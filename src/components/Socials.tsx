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
  "Just used AI to craft an EPIC components in minutes with https://www.aicomponent.dev ! 🤖 This is the future of component design! Check it out 👉 @aicomponentdev",
  "Creating a stunning components has never been easier thanks to https://www.aicomponent.dev ! 🚀 Give it a try 👉 @aicomponentdev",
  "Web design will never be the same after you try https://www.aicomponent.dev ! 🛠️ A whole new level of creativity unleashed! Check it out 👉 @aicomponentdev",
  "Revolutionize your component design process with https://www.aicomponent.dev . The future is here! 👉 @aicomponentdev",
  "I just built an amazing components with https://www.aicomponent.dev in minutes! 🌟 You have to try this 👉 @aicomponentdev",
  "https://www.aicomponent.dev is a game-changer for component design! Say hello to efficiency 👋 @aicomponentdev",
  "Why spend hours on component design when https://www.aicomponent.dev can do it in minutes? 🕒 Check it out! 👉 @aicomponentdev",
  "Impressed by the power of AI in component design with https://www.aicomponent.dev ! This is incredible 👀 @aicomponentdev",
  "I used https://www.aicomponent.dev and it completely transformed how I approach component design. You need to try this! 🎉 @aicomponentdev",
  "Just when I thought component design couldn’t get any easier, I found https://www.aicomponent.dev ! 🎊 Try it now 👉 @aicomponentdev",
  "Unleashing my inner designer with the help of https://www.aicomponent.dev. This is next level! 🚀 Check it out 👉 @aicomponentdev",
  "With https://www.aicomponent.dev , I can focus on creativity while AI handles the coding. It’s amazing! 💥 @aicomponentdev",
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
    <section className="fixed bottom-6 right-6 z-50 flex flex-col items-center gap-3">
      <TooltipProvider>
        <Tooltip delayDuration={0}>
          <TooltipTrigger>
            <a
              onClick={handleClick}
              href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(
                tweet?.toString() ?? "",
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
            and tag @aicomponentdev for early access to our exclusive
            beta—packed with stunning features. 🚀
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
