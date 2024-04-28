"use client";

import Spinner from "@/components/Spinner";
import { Button } from "@/components/ui/button";
import { cn, moneyFormat, numberFormat, stripePrice } from "@/lib/utils";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";
import { Price, PriceMetadata } from "@/types";
import { actionWrapper, createCheckoutSession } from "@/lib/actions";
import useSearchParams from "@/hooks/useSearchParams";

function getMetadata(price: Price) {
  return price.metadata as unknown as PriceMetadata;
}

export default function PriceItem({ price }: { price: Price }) {
  const { user } = useAuth();
  const isAuthenticated = !!user;
  const { set } = useSearchParams();
  const { push } = useRouter();

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
