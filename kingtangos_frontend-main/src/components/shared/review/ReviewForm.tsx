"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Star } from "lucide-react"

interface ReviewModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: { comment: string; rating: number }) => void
}

export default function ReviewModal({ isOpen, onClose, onSubmit }: ReviewModalProps) {
  const [comment, setComment] = useState("")
  const [rating, setRating] = useState<number>(0)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (comment.trim() && rating > 0) {
      onSubmit({ comment, rating })
      setComment("")
      setRating(0)
      onClose()
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-card rounded-lg shadow-lg w-full max-w-md p-6">
        <h2 className="text-2xl font-bold mb-6 text-card-foreground">Write a Review</h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label htmlFor="comment" className="text-card-foreground font-medium">
              Comment
            </Label>
            <Textarea
              id="comment"
              placeholder="Share your thoughts about this product..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="mt-2 min-h-24"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-card-foreground font-medium">Rating</Label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className="focus:outline-none transition-transform hover:scale-110"
                  aria-label={`Rate ${star} stars`}
                >
                  <Star
                    size={32}
                    className={`${star <= rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"} transition-colors cursor-pointer`}
                  />
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-3 justify-end pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={!comment.trim() || rating <= 0}>
              Submit Review
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
