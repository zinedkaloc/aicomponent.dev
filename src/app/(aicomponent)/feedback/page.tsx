'use client';
import { createFeedback } from '@/actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Rating as ReactRating, RoundedStar } from '@smastrom/react-rating';
import { FormEvent, useState } from 'react';
import { toast } from 'sonner';

export default function Feedback() {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [feedback, setFeedback] = useState('');
  const [rating, setRating] = useState(3);

  const [loading, setLoading] = useState(false);

  function resetForm() {
    setEmail('');
    setName('');
    setFeedback('');
    setRating(3);
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (loading) return;
    setLoading(true);
    try {
      await createFeedback({
        email,
        name,
        feedback,
        rating,
      });
      toast.success('Feedback submitted successfully');
      resetForm();
    } catch {
      toast.error('Failed to submit feedback, please try again');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-8 py-12 sm:py-20 px-4 md:px-6">
      <div className="space-y-2 text-center w-full">
        <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Give us your feedback</h1>
        <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
          Help us improve our product by sharing your thoughts and experiences.
        </p>
      </div>
      <form className="space-y-6 max-w-2xl mx-auto" onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              placeholder="Enter your name"
              type="text"
              required
              value={name}
              onChange={e => setName(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              placeholder="Enter your email"
              type="email"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="feedback">Feedback</Label>
          <Textarea
            className="min-h-[120px]"
            value={feedback}
            onChange={e => setFeedback(e.target.value)}
            placeholder="Share your feedback"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="rating">Rating</Label>
          <div className="flex gap-2">
            <ReactRating
              itemStyles={{
                itemShapes: RoundedStar,
                activeFillColor: '#0f172a',
                activeBoxBorderColor: '#0f172a',
                itemStrokeWidth: 1,
                activeStrokeColor: 'transparent',
                inactiveFillColor: '#d7d7d7',
                inactiveStrokeColor: 'transparent',
              }}
              className="!w-[200px] !outline-none"
              value={rating}
              onChange={setRating}
              isRequired={true}
            />
          </div>
        </div>
        <Button disabled={loading} className="w-full" type="submit">
          Submit Feedback
        </Button>
      </form>
    </div>
  );
}
