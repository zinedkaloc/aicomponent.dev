"use client";
import useSearchParams from "@/hooks/useSearchParams";
import Modal from "@/components/Modal";
import { Product } from "@/types";
import Products from "@/components/Products";

export default function PricesModal({ products }: { products: Product[] }) {
  const { deleteByKey, has } = useSearchParams();

  function close() {
    deleteByKey("pricesModal");
  }

  return (
    <Modal
      className="p-6 sm:w-[850px]"
      close={close}
      isOpen={has("pricesModal")}
    >
      <Products products={products} />
    </Modal>
  );
}
