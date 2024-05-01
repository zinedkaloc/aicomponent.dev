import { getPayments } from "@/lib/actions";
import Payments from "@/app/(aicomponent)/profile/invoices/payments";
import actionWrapper from "@/lib/actions/actionWrapper";

export default async function InvoicesPage() {
  const payments = await actionWrapper(getPayments());
  const hasInvoices = payments.length > 0;

  return (
    <section className="flex h-full w-full flex-1 flex-col px-6 py-6">
      <div className="mx-auto w-full space-y-4 sm:max-w-screen-2xl sm:px-2.5 lg:px-20">
        {hasInvoices && (
          <div>
            <h2 className="text-lg font-medium leading-6 text-gray-900">
              Invoices
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Check the invoices for your purchases.
            </p>
          </div>
        )}
        {!hasInvoices ? (
          <div className="flex flex-1 flex-col items-center justify-center rounded-md border border-gray-200 bg-white py-12">
            <h2 className="z-10 text-xl font-semibold text-gray-700">
              You don't have any invoices yet!
            </h2>
            <img
              alt="No domains yet"
              loading="lazy"
              width={500}
              className="pointer-events-none blur-0"
              src="/no-project.png"
            />
          </div>
        ) : (
          <Payments payments={payments} />
        )}
      </div>
    </section>
  );
}
