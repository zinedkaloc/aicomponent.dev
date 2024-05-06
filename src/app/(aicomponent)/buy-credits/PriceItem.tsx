"use client";

import Spinner from "@/components/Spinner";
import { Button } from "@/components/ui/button";
import { cn, moneyFormat, numberFormat } from "@/lib/utils";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";
import { Price, PriceMetadata } from "@/types";
import useSearchParams from "@/hooks/useSearchParams";
import { createCheckoutSession } from "@/lib/actions";
import actionWrapper from "@/lib/actions/actionWrapper";
import { CheckCircle2 } from "lucide-react";

function getMetadata(price: Price) {
  let data = price.metadata as any;
  if ("features" in data && typeof data.features === "string") {
    data.features = JSON.parse(data.features);
  }

  return data as PriceMetadata;
}

export default function PriceItem({ price }: { price: Price }) {
  const { user } = useAuth();
  const isAuthenticated = !!user;
  const { set } = useSearchParams();

  const { mutate, isPending } = useMutation<{ url: string }>({
    mutationKey: ["createCheckoutSession"],
    mutationFn: () =>
      actionWrapper(
        createCheckoutSession({ priceId: price.id, sessionMode: "payment" }),
      ),
    onSuccess({ url }) {
      location.href = url;
    },
    onError() {
      toast.error("Couldn't create checkout session, please try again later.");
    },
  });

  async function onClick() {
    if (!isAuthenticated) return set("authModal", "true");
    mutate();
  }

  return (
    <div
      className={cn(
        "relative flex h-fit flex-col rounded-2xl border bg-white shadow-lg",
        "border-gray-200",
      )}
    >
      <div className="p-5">
        <h3 className="font-display my-3 text-center text-3xl font-bold">
          {getMetadata(price).name}
        </h3>

        <p className="text-gray-500">
          <strong>{numberFormat(+getMetadata(price).amount)}</strong> Credits
        </p>

        <p className="font-display my-5 text-6xl font-semibold">
          {moneyFormat(price.unit_amount / 100)}
        </p>
      </div>
      <div className="flex h-20 items-center justify-center border-b border-t border-gray-200 bg-gray-50">
        <div className="flex flex-col items-center space-x-1">
          <p className="text-md font-normal text-gray-700">
            {getMetadata(price).description}
          </p>
        </div>
      </div>
      <ul className="my-10 space-y-3 px-8">
        {getMetadata(price)?.features?.map?.((feature, index) => (
          <li key={index} className="flex space-x-2.5">
            <div className="flex-shrink-0">
              <CheckCircle2 className="h-6 w-6 text-green-500" />
            </div>
            <div className="flex items-center">
              <p className="text-left text-gray-600">{feature}</p>
            </div>
          </li>
        ))}
      </ul>
      <div className="border-gray-200 p-5">
        <Button
          variant="pill"
          onClick={onClick}
          className={cn("relative", "w-full")}
        >
          <span className={cn(isPending && "opacity-0")}>Buy Now</span>
          {isPending && <Spinner className="absolute inset-0 m-auto h-5" />}
        </Button>
      </div>
    </div>
  );
}
