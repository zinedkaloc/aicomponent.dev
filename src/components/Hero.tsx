import Image from "next/image";

export default function Hero() {
  return (
    <div className="relative flex flex-col justify-center py-6">
      <Image
        src="/logoa.png"
        alt="AIPage.dev logo"
        width={200}
        height={200}
        className="mx-auto h-32 w-32"
      />
      <div className="text-center sm:w-11/12 md:w-[800px]">
        <h1 className="text-ellipsis text-4xl font-bold tracking-tight sm:text-5xl">
          Create components easily <span className="font-normal">with ai</span>
        </h1>
      </div>
    </div>
  );
}
