import { actionWrapper, getPricingData } from "@/lib/actions";
import PriceItem from "@/app/(aicomponent)/buy-credits/PriceItem";

export default async function Page() {
  const prices = await actionWrapper(getPricingData());

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
      {prices.data.map((price) => (
        <PriceItem key={price.id} price={price} />
      ))}
    </div>
  );
}
