import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react";
import { Invoice } from "@/types";
import { moneyFormat, stripePrice } from "@/lib/utils";

export default async function InvoicesPage() {
  const invoices = await fetchInvoices();
  const hasInvoices = invoices?.length > 0;

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
          <>
            <div className="hidden md:block">
              <DesktopTable invoices={invoices} />
            </div>
            <div className="block md:hidden">
              <MobileTable invoices={invoices} />
            </div>
          </>
        )}
      </div>
    </section>
  );
}

function DesktopTable({ invoices }: { invoices: Invoice[] }) {
  return (
    <div className="flex flex-col">
      <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
          <div className="overflow-hidden rounded-lg border">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                  >
                    Product name
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                  >
                    Order date
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                  >
                    Status
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                  >
                    Total amount
                  </th>
                  <th scope="col" className="relative px-6 py-3"></th>
                </tr>
              </thead>
              <tbody>
                {invoices.map((invoice, index) => (
                  <tr
                    key={index}
                    className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
                  >
                    <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">
                      {invoice.lines.data[0]?.price?.nickname ?? "Unknown"}{" "}
                      Credits
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                      {new Date(invoice.created * 1000).toLocaleDateString()}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                      {invoice.status.toUpperCase()}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                      {moneyFormat(stripePrice(invoice.total))}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                      <div className="flex w-full justify-end">
                        <a
                          href={invoice.hosted_invoice_url}
                          className="block w-full sm:w-auto"
                          target="_blank"
                        >
                          <Button
                            disabled={!invoice.hosted_invoice_url}
                            className="w-full gap-2 sm:w-auto [&:not(:hover)]:text-gray-500"
                          >
                            <FileText className="h-4 w-4" />
                            View Invoice
                          </Button>
                        </a>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

function MobileTable({ invoices }: { invoices: Invoice[] }) {
  return (
    <div className="flex flex-col gap-2">
      {invoices?.map((invoice) => (
        <div
          key={invoice.id}
          className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm"
        >
          <div className="flex flex-col gap-2 sm:flex-row sm:gap-0">
            <dl className="grid flex-1 gap-2 sm:grid-cols-2 md:grid-cols-4">
              <div>
                <dt className="font-medium text-gray-900">Product Name</dt>
                <dd className="mt-1 text-gray-500">
                  {invoice.lines.data[0]?.price?.nickname ?? "Unknown"} Credits
                </dd>
              </div>
              <div>
                <dt className="font-medium text-gray-900">Order date</dt>
                <dd className="mt-1 text-gray-500">
                  <time dateTime={invoice.created.toString()}>
                    {new Date(invoice.created * 1000).toLocaleDateString()}
                  </time>
                </dd>
              </div>
              <div>
                <dt className="font-medium text-gray-900">Order status</dt>
                <dd className="mt-1 font-medium text-gray-500">
                  {invoice.status}
                </dd>
              </div>
              <div>
                <dt className="font-medium text-gray-900">Total amount</dt>
                <dd className="mt-1 font-medium text-gray-500">
                  {moneyFormat(stripePrice(invoice.total))}
                </dd>
              </div>
            </dl>
            <div className="flex justify-center gap-1 sm:items-center">
              <a
                href={invoice.hosted_invoice_url}
                className="block w-full sm:w-auto"
                target="_blank"
              >
                <Button className="w-full gap-2 sm:w-auto [&:not(:hover)]:text-gray-500">
                  <FileText className="h-4 w-4" />
                  View Invoice
                </Button>
              </a>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
