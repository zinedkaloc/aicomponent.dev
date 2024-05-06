import { getPricingData } from "@/lib/actions";
import PriceItem from "@/app/(aicomponent)/buy-credits/PriceItem";
import ErrorAlert from "@/components/ErrorAlert";

export default async function Page() {
  const status = await getPricingData();
  if (!status.success) {
    return (
      <div className="flex items-center justify-center">
        <ErrorAlert
          className="w-fit"
          alertTitle="Couldn't fetch pricing data. Please try again later"
        />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
      {status.data.data.map((price) => (
        <PriceItem key={price.id} price={price} />
      ))}
    </div>
  );
}
