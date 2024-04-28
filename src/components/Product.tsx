"use client";
import { cn, moneyFormat, stripePrice } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";
import useSearchParams from "@/hooks/useSearchParams";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import Spinner from "@/components/Spinner";
import { actionWrapper, createCheckoutSession } from "@/lib/actions";

interface ProductProps {
  product: any;
  className?: string;
}
export default function Product({ product, className }: ProductProps) {
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const { set } = useSearchParams();

  async function getPaymentLink(priceId: string) {
    if (!user) return set("authModal", "true");

    const data = await actionWrapper(
      createCheckoutSession({
        priceId,
        sessionMode: "payment",
      }),
    );

    console.log(data);
  }

  return (
    <div
      className={cn(
        "divide-y divide-gray-200 rounded-lg border border-gray-200 shadow-sm",
        className,
      )}
    >
      <div className="flex h-72 flex-col gap-5">
        <div className="px-4 pt-4">
          <div className="flex flex-col items-center justify-center gap-2 text-center">
            <p className="py-2 text-center text-xs text-gray-600">
              {product.metadata.description}
            </p>
            <span className="font-display text-4xl font-semibold text-gray-900">
              {moneyFormat(stripePrice(product.unit_amount))}
            </span>
            <span className="text-xs text-gray-500">
              {product.nickname} Credits
            </span>
          </div>
        </div>
        <div className="flex flex-1 flex-col">
          <div className="flex h-14 w-full items-center justify-center border-b border-t border-gray-200 bg-gray-50">
            <p className="text-center text-xs text-gray-600">
              {product.metadata.info.replace("landing pages", "components")}
            </p>
          </div>
          <div className="flex w-full flex-1 items-center justify-center px-4">
            <Button
              disabled={loading}
              className="auth-btn w-full"
              variant="pill"
              onClick={() => getPaymentLink(product.id)}
            >
              {loading ? <Spinner /> : "Buy"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
