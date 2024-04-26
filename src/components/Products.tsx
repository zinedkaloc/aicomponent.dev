"use client";
import Product from "@/components/Product";
import { cn } from "@/lib/utils";

export default function Products({ products }: { products: any[] }) {
  return (
    <div className="space-y-10 px-4 py-10 sm:px-6 lg:px-8">
      <div className="sm:align-center sm:flex sm:flex-col">
        <h1 className="text-center text-4xl font-extrabold text-gray-900 sm:text-center">
          Support Our Mission
        </h1>
        <p className="mt-5 text-center text-lg text-gray-500 sm:text-center">
          By choosing a plan, you’re not just building beautiful components —
          you’re becoming a cherished part of our journey and mission. Fuel our
          work so we can continue empowering your digital dreams. Every credit
          counts!
        </p>
      </div>
      <div className="grid gap-6 sm:grid-cols-3">
        {products
          .sort((a, b) => a.unit_amount - b.unit_amount)
          .map((product, index) => (
            <Product
              className={cn(index === 1 && "scale-110")}
              key={product.id}
              product={product}
            />
          ))}
      </div>
    </div>
  );
}
