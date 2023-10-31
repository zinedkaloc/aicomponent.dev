import Image from "next/image";
import Link from "next/link";

export default function Hero() {
  return (
    <div className="relative py-6 flex flex-col justify-center">
      <Image
        src="/logoa.png"
        alt="AIPage.dev logo"
        width={200}
        height={200}
        className="mx-auto h-32 w-32"
      />
      <div className="text-center sm:w-11/12 md:w-[800px]">
        <h1 className="text-5xl font-bold text-ellipsis tracking-tight">
          🚧 Under Renovation 🚧
        </h1>

        <p className="text-lg text-gray-700 mt-4 tracking-tight">
          A refreshed experience is on the horizon. <br /> Follow us on
          <Link href="https://x.com/aipagedev">
            <b> X</b>
          </Link>{" "}
          to stay updated!
        </p>
      </div>
    </div>
  );
}
