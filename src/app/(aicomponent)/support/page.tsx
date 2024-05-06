import { Book, Mail, Phone, Text } from "lucide-react";
import Link from "next/link";

export default function Component() {
  return (
    <section className="w-full px-4 py-12 sm:py-40 md:px-6">
      <div className="container space-y-6 px-4 text-center md:px-6">
        <div className="space-y-3">
          <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
            Get the Help You Need
          </h1>
          <p className="mx-auto max-w-[700px] text-gray-500 dark:text-gray-400 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
            Our team is here to assist you with any questions or issues you may
            have. Choose the support option that works best for you.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <div className="flex flex-col items-center justify-center space-y-3 rounded-lg border border-gray-200 p-6 shadow-sm dark:border-gray-800">
            <Mail className="h-8 w-8 text-gray-500 dark:text-gray-400" />
            <h3 className="text-lg font-semibold">Email Support</h3>
            <p className="text-center text-sm text-gray-500 dark:text-gray-400">
              Get in touch with our support team via email. We'll respond as
              soon as possible.
            </p>
            <Link
              className="inline-flex h-9 items-center justify-center rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-gray-50 shadow transition-colors hover:bg-gray-900/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 disabled:pointer-events-none disabled:opacity-50 dark:bg-gray-50 dark:text-gray-900 dark:hover:bg-gray-50/90 dark:focus-visible:ring-gray-300"
              href="mailto:support@aipage.dev"
            >
              Email Us
            </Link>
          </div>
          <div className="flex flex-col items-center justify-center space-y-3 rounded-lg border border-gray-200 p-6 shadow-sm dark:border-gray-800">
            <Phone className="h-8 w-8 text-gray-500 dark:text-gray-400" />
            <h3 className="text-lg font-semibold">Phone Support</h3>
            <p className="text-center text-sm text-gray-500 dark:text-gray-400">
              Speak with one of our support representatives over the phone.
            </p>
            <Link
              className="inline-flex h-9 items-center justify-center rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-gray-50 shadow transition-colors hover:bg-gray-900/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 disabled:pointer-events-none disabled:opacity-50 dark:bg-gray-50 dark:text-gray-900 dark:hover:bg-gray-50/90 dark:focus-visible:ring-gray-300"
              href="tel:+905375813636"
            >
              Call Us
            </Link>
          </div>
          <div className="flex flex-col items-center justify-center space-y-3 rounded-lg border border-gray-200 p-6 shadow-sm dark:border-gray-800">
            <Text className="h-8 w-8 text-gray-500 dark:text-gray-400" />
            <h3 className="text-lg font-semibold">Live Chat</h3>
            <p className="text-center text-sm text-gray-500 dark:text-gray-400">
              Chat with our support team in real-time for immediate assistance.
            </p>
            <Link
              className="inline-flex h-9 items-center justify-center rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-gray-50 shadow transition-colors hover:bg-gray-900/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 disabled:pointer-events-none disabled:opacity-50 dark:bg-gray-50 dark:text-gray-900 dark:hover:bg-gray-50/90 dark:focus-visible:ring-gray-300"
              href="https://discord.gg/ANrcYGYhP9"
            >
              Chat with Us
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
