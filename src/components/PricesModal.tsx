"use client";
import useSearchParams from "@/hooks/useSearchParams";
import Modal from "@/components/Modal";
import Products from "@/components/Products";

export default function PricesModal({ products }: { products: any[] }) {
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
