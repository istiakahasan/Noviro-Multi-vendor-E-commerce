import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Star, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

interface ReviewFormData {
  rating: number;
  comment: string;
}

interface ReviewModalProps {
  consultationId: string;
  onSubmit: (data: { rating: number; comment: string }) => Promise<void>;
}

export default function ConsultaionReviewModal({ onSubmit }: ReviewModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<ReviewFormData>({
    defaultValues: {
      rating: 0,
      comment: '',
    },
  });

  const selectedRating = watch('rating');

  const handleFormSubmit = async (data: ReviewFormData) => {
    if (data.rating === 0) {
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit({
        rating: data.rating,
        comment: data.comment,
      });
      setIsOpen(false);
      reset();
    } catch (error) {
      console.error('Failed to submit review:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRatingClick = (rating: number) => {
    setValue('rating', rating, { shouldValidate: true });
  };

  const getRatingText = (rating: number) => {
    const texts = ['', 'Poor', 'Fair', 'Good', 'Very Good', 'Excellent'];
    return texts[rating];
  };

  return (
    <>
      <Button
        className="rounded-xl py-5 text-primary bg-transparent border border-primary shadow-none mt-2 hover:bg-primary hover:text-white transition-all duration-300"
        variant="outline"
        onClick={() => setIsOpen(true)}
      >
        Write a customer review
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[550px] p-0 overflow-hidden rounded border-0 shadow-2xl">
          {/* Header with gradient background */}
          <div className="bg-gradient-to-br from-gray-800 to-gray-100 p-6 pb-8">
            <DialogHeader>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <div>
                  <DialogTitle className="text-2xl font-bold text-white mb-1">
                    Share Your Experience
                  </DialogTitle>
                  <p className="text-white/80 text-sm">Help others make informed decisions</p>
                </div>
              </div>
            </DialogHeader>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6 bg-white">
            {/* Rating Section */}
            <div className="space-y-3">
              <Label className="text-base font-semibold text-gray-700">
                How would you rate this product?
              </Label>
              <div className="flex mt-3 flex-col items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-6  border-0">
                <div className="flex items-center gap-2 mb-3">
                  {Array.from({ length: 5 }, (_, i) => {
                    const starValue = i + 1;
                    return (
                      <button
                        key={i}
                        type="button"
                        onClick={() => handleRatingClick(starValue)}
                        onMouseEnter={() => setHoveredRating(starValue)}
                        onMouseLeave={() => setHoveredRating(0)}
                        className="transition-all duration-200 hover:scale-125 focus:outline-none transform"
                      >
                        <Star
                          className={`w-10 h-10 transition-all duration-200 ${
                            starValue <= (hoveredRating || selectedRating)
                              ? 'text-yellow-400 fill-yellow-400 drop-shadow-lg scale-110'
                              : 'text-gray-300 hover:text-yellow-200'
                          }`}
                        />
                      </button>
                    );
                  })}
                </div>
                {selectedRating > 0 && (
                  <div className="text-center">
                    <p className="text-2xl font-bold text-gray-800 mb-1">
                      {getRatingText(selectedRating)}
                    </p>
                    <p className="text-sm text-gray-500">
                      {selectedRating} out of 5 stars
                    </p>
                  </div>
                )}
                {selectedRating === 0 && (
                  <p className="text-gray-400 text-sm">Click to rate</p>
                )}
              </div>
              {selectedRating === 0 && errors.rating && (
                <p className="text-sm text-red-500 flex items-center gap-1">
                  <span className="w-4 h-4 rounded-full bg-red-100 flex items-center justify-center text-xs">!</span>
                  Please select a rating
                </p>
              )}
            </div>

            {/* Comment Section */}
            <div className="space-y-3">
              <Label htmlFor="comment" className="text-base font-semibold text-gray-700">
                Tell us more about your experience
              </Label>
              <div className="relative">
                <Textarea
                  id="comment"
                  placeholder="What did you like or dislike? How did this consultation meet your expectations?"
                  className="min-h-[140px] resize-none border-2 border-gray-200 focus:border-primary rounded-xl p-4 text-sm leading-relaxed transition-all duration-200"
                  {...register('comment', {
                    required: 'Please write a review',
                    minLength: {
                      value: 10,
                      message: 'Review must be at least 10 characters',
                    },
                  })}
                />
                <div className="absolute bottom-3 right-3 text-xs text-gray-400">
                  {watch('comment')?.length || 0} characters
                </div>
              </div>
              {errors.comment && (
                <p className="text-sm text-red-500 flex items-center gap-1">
                  <span className="w-4 h-4 rounded-full bg-red-100 flex items-center justify-center text-xs">!</span>
                  {errors.comment.message}
                </p>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setIsOpen(false);
                  reset();
                }}
                disabled={isSubmitting}
                className="flex-1 rounded-xl py-6 border-2 hover:bg-gray-50 transition-all duration-200"
              >
                Cancel
              </Button>
              <Button
                type="button"
                onClick={() => handleSubmit(handleFormSubmit)()}
                disabled={isSubmitting || selectedRating === 0}
                className="flex-1 rounded-xl py-6 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Submitting...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4" />
                    Submit Review
                  </span>
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}