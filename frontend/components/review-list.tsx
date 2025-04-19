'use client'

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import ReviewCard from "@/components/review-card"
import type { Review } from "@/lib/types"

interface ReviewListProps {
  reviews: Review[]
}

export function ReviewList({ reviews }: ReviewListProps) {
  const [isReviewDialogOpen, setIsReviewDialogOpen] = useState(false)
  const [review, setReview] = useState("")

  const handleReviewSubmit = () => {
    // TODO: Implement review submission
    setIsReviewDialogOpen(false)
    setReview("")
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Okuyucu İncelemeleri</h2>
        <Dialog open={isReviewDialogOpen} onOpenChange={setIsReviewDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-yellow-400 text-black hover:bg-yellow-500">İnceleme yaz</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Kitabı inceleyin</DialogTitle>
              <DialogDescription>
                Bu kitap hakkındaki düşüncelerinizi diğer okuyucularla paylaşın.
              </DialogDescription>
            </DialogHeader>
            <Textarea
              placeholder="İncelemenizi buraya yazın..."
              className="min-h-[150px]"
              value={review}
              onChange={(e) => setReview(e.target.value)}
            />
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsReviewDialogOpen(false)}>
                İptal
              </Button>
              <Button
                onClick={handleReviewSubmit}
                className="bg-yellow-400 text-black hover:bg-yellow-500"
                disabled={!review.trim()}
              >
                İncelemeyi Gönder
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {reviews.length > 0 ? (
        <div className="space-y-4">
          {reviews.map((review) => (
            <ReviewCard key={review.id} review={review} />
          ))}
        </div>
      ) : (
        <div className="rounded-lg border border-dashed p-6 text-center">
          <p className="text-gray-500">Henüz inceleme yok. Bu kitabı inceleyen ilk kişi olun!</p>
        </div>
      )}
    </div>
  )
} 