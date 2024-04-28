"use client";
import { Payment } from "@/types";
import { cn, moneyFormat, numberFormat } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react";
import useSearchParams from "@/hooks/useSearchParams";
import { useEffect } from "react";

export default function Payments({ payments }: { payments: Payment[] }) {
  const { has, deleteByKey } = useSearchParams();

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (has("status")) {
        deleteByKey("status");
      }
    }, 1_000);
    return () => clearTimeout(timeout);
  }, []);

  return (
    <>
      <div className="hidden md:block">
        <DesktopTable payments={payments} />
      </div>
      <div className="block md:hidden">
        <MobileTable payments={payments} />
      </div>
    </>
  );
}

function DesktopTable({ payments }: { payments: Payment[] }) {
  const { has } = useSearchParams();

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
                    Total amount
                  </th>
                  <th scope="col" className="relative px-6 py-3"></th>
                </tr>
              </thead>
              <tbody>
                {payments.map((payment, index) => (
                  <tr
                    key={payment.id}
                    className={cn(
                      index % 2 === 0 ? "bg-white" : "bg-gray-50",
                      index === 0 && has("status") && "bg-green-200",
                    )}
                  >
                    <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">
                      {numberFormat(+payment.metadata.amount)} Credits
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                      {new Date(payment.created_at).toLocaleDateString()}{" "}
                      {new Date(payment.created_at).toLocaleTimeString()}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                      {moneyFormat(payment.total_amount / 100)}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                      <div className="flex w-full justify-end">
                        <a
                          href={payment.hosted_invoice_url}
                          className="block w-full sm:w-auto"
                          target="_blank"
                        >
                          <Button
                            disabled={!payment.hosted_invoice_url}
                            className="w-full gap-2 sm:w-auto"
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

function MobileTable({ payments }: { payments: Payment[] }) {
  const { has } = useSearchParams();

  return (
    <div className="flex flex-col gap-2">
      {payments?.map((payment, index) => (
        <div
          key={payment.id}
          className={cn(
            "rounded-lg border border-gray-200 bg-white p-4 shadow-sm",
            index === 0 && has("status") && "bg-green-200",
          )}
        >
          <div className="flex flex-col gap-2 sm:flex-row sm:gap-0">
            <dl className="grid flex-1 gap-2 sm:grid-cols-2 md:grid-cols-4">
              <div>
                <dt className="font-medium text-gray-900">Product Name</dt>
                <dd className="mt-1 text-gray-500">
                  {payment.metadata.amount} Credits
                </dd>
              </div>
              <div>
                <dt className="font-medium text-gray-900">Order date</dt>
                <dd className="mt-1 text-gray-500">
                  <time dateTime={payment.created_at.toString()}>
                    {new Date(payment.created_at).toLocaleDateString()}{" "}
                    {new Date(payment.created_at).toLocaleTimeString()}
                  </time>
                </dd>
              </div>
              <div>
                <dt className="font-medium text-gray-900">Order status</dt>
                <dd className="mt-1 font-medium text-gray-500">status</dd>
              </div>
              <div>
                <dt className="font-medium text-gray-900">Total amount</dt>
                <dd className="mt-1 font-medium text-gray-500">
                  {moneyFormat(payment.total_amount / 100)}
                </dd>
              </div>
            </dl>
            <div className="flex justify-center gap-1 sm:items-center">
              <a
                href={payment.hosted_invoice_url}
                className="block w-full sm:w-auto"
                target="_blank"
              >
                <Button className="w-full gap-2 sm:w-auto">
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
