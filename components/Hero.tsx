import Image from "next/image";

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
        <h1 className="text-4xl sm:text-5xl font-bold text-ellipsis tracking-tight">
          Create components easily <span className="font-normal">with ai</span>
        </h1>
        <p className="sm:text-lg text-gray-700 mt-4 tracking-tight">
          Experience the future of web design. With ai, creating a landing page
          is not only easy but also efficient, precise, and tailored to your
          needs.
        </p>
      </div>
    </div>
  );
}
