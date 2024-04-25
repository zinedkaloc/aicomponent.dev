"use client";
import useSearchParams from "@/hooks/useSearchParams";
import Modal from "@/components/Modal";
import { Rating as ReactRating } from "@smastrom/react-rating";
import { FormEvent, useState } from "react";
import { Button } from "@/components/ui/button";
import { Star } from "@smastrom/react-rating";
import LoadingSpinner from "@/components/loadingSpinner";

interface RatingModalProps {
  onRateSubmit?: (rating: number, ratingText: string) => void;
}

export default function RateModal(props: RatingModalProps) {
  const { deleteByKey, has } = useSearchParams();
  const [rating, setRating] = useState(5);
  const [ratingText, setRatingText] = useState("");
  const [loading, setLoading] = useState(false);
  const [hasError, setHasError] = useState(false);

  function close() {
    deleteByKey("rateModal");
    setRating(0);
    setRatingText("");
  }

  async function submitHandler(event: FormEvent) {
    event.preventDefault();
    setLoading(true);
    setHasError(false);
    try {
      const res = await fetch("/api/message", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          rating,
          ratingText,
        }),
      });
      if (res.ok) {
        props.onRateSubmit?.(rating, ratingText);
        close();
      } else {
        setHasError(true);
      }
    } catch (e) {
      setHasError(true);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Modal
      close={close}
      isOpen={has("rateModal")}
      className="w-[96%] p-0 sm:w-[500px]"
    >
      <form onSubmit={submitHandler}>
        <div className="space-y-4 p-4">
          <h2 className="pt-6 text-center text-2xl font-medium">
            <span className="block pb-3 text-6xl">🎉</span>
            Rate your experience
          </h2>
          <div className="flex items-center justify-center">
            <ReactRating
              itemStyles={{
                itemShapes: Star,
                activeFillColor: "#ffdc17",
                activeBoxBorderColor: "#faaf00",
                itemStrokeWidth: 1,
                activeStrokeColor: "transparent",
                inactiveFillColor: "#d7d7d7",
                inactiveStrokeColor: "transparent",
              }}
              className="mb-1 !w-3/5"
              value={rating}
              onChange={setRating}
            />
          </div>
        </div>
        <div className="space-y-4 border-t bg-gray-50 p-4">
          <p className="text-sm text-gray-500">
            Your feedback matters! Let us know how your experience was while
            crafting your components with AI
          </p>
          <textarea
            rows={3}
            name="feedback"
            value={ratingText}
            onChange={(e) => setRatingText(e.target.value)}
            className="w-full resize-none rounded border !border-gray-200 p-2 !outline-none focus:ring-2 focus:ring-gray-500"
            placeholder="Tell us more about your experience..."
          />
          {hasError && (
            <h2 className="text-center text-sm text-red-500">
              There was an error submitting your feedback. Please try again
              later.
            </h2>
          )}
          <div className="flex justify-end gap-2">
            <Button type="button" variant="light" onClick={close}>
              Cancel
            </Button>
            <Button
              className="gap-2"
              type="submit"
              disabled={loading}
              variant="default"
            >
              {loading && <LoadingSpinner className="h-4 w-4" />}
              Submit
            </Button>
          </div>
        </div>
      </form>
    </Modal>
  );
}
