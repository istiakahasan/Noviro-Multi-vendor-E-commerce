"use client";

import React, { useState, useEffect } from 'react';
import { Star } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

interface EditReviewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentRating: number;
  currentComment: string;
  reviewId: string;
  onSave?: (reviewId: string, rating: number, comment: string) => void;
}

const EditReviewDialog: React.FC<EditReviewDialogProps> = ({
  open,
  onOpenChange,
  currentRating,
  currentComment,
//   reviewId,
//   onSave,
}) => {
  const [rating, setRating] = useState(currentRating);
  const [comment, setComment] = useState(currentComment);
  const [hoveredRating, setHoveredRating] = useState(0);

  // Update state when props change
  useEffect(() => {
    setRating(currentRating);
    setComment(currentComment);
  }, [currentRating, currentComment]);

  const handleSave = () => {
    // onSave(reviewId, rating, comment);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Edit Review</DialogTitle>
          <DialogDescription>
            Update your rating and comment. Click save when you&rsquo;re done.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Rating */}
          <div className="space-y-2">
            <Label>Rating</Label>
            <div className="flex items-center gap-2">
              {Array.from({ length: 5 }).map((_, index) => {
                const starValue = index + 1;
                return (
                  <button
                    key={index}
                    type="button"
                    onClick={() => setRating(starValue)}
                    onMouseEnter={() => setHoveredRating(starValue)}
                    onMouseLeave={() => setHoveredRating(0)}
                    className="transition-transform hover:scale-110"
                  >
                    <Star
                      className={`w-8 h-8 cursor-pointer transition-colors ${
                        starValue <= (hoveredRating || rating)
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'fill-gray-200 text-gray-200'
                      }`}
                    />
                  </button>
                );
              })}
              <span className="ml-2 text-sm font-medium text-gray-700">
                {rating}.0
              </span>
            </div>
          </div>

          {/* Comment */}
          <div className="space-y-2">
            <Label htmlFor="comment">Comment</Label>
            <Textarea
              id="comment"
              placeholder="Share your experience..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="min-h-[120px] resize-none"
            />
            <p className="text-xs text-gray-500">
              {comment.length} characters
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleSave}
            disabled={!comment.trim()}
          >
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditReviewDialog;