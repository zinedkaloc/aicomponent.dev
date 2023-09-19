import dynamic from "next/dynamic";

const TweetButton = dynamic(() => import("@/components/tweetButton"), {
  ssr: false,
});

export default function Socials() {
  return (
    <>
      <section>
        <div className="fixed bottom-16 right-6 cursor-pointer transition-colors group">
          <div className="tooltip opacity-0 group-hover:opacity-100 bg-gray-700 text-white text-xs rounded py-1 px-2 absolute right-8 bottom-4 transform translate-y-2 w-64">
            Help spread the word! 📢 Post a tweet of your creation on Twitter
            and tag @aipagedev for early access to our exclusive beta—packed
            with stunning features. 🚀
          </div>
          <TweetButton />
        </div>
      </section>

      <section>
        <div className="fixed bottom-6 right-6 cursor-pointer transition-colors group">
          <div className="tooltip opacity-0 group-hover:opacity-100 bg-gray-700 text-white text-xs rounded py-1 px-2 absolute  right-8 bottom-4 transform translate-y-2 w-48">
            Star us on Github to show your support
          </div>
          <a
            href="https://github.com/zinedkaloc/aipage.dev"
            target="_blank"
            rel="noreferrer"
            className="text-2xl"
          >
            ⭐️
          </a>
        </div>
      </section>
    </>
  );
}
