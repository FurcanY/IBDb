import Image from "next/image"
import type { Review } from "@/lib/types"

interface ReviewCardProps {
  review: Review
}

export default function ReviewCard({ review }: ReviewCardProps) {
  return (
    <div className="rounded-lg border p-4">
      <div className="flex items-start gap-3">
        <Image
          src={review.userImage || "/placeholder.svg?height=40&width=40"}
          alt={review.userName}
          width={40}
          height={40}
          className="rounded-full"
        />
        <div className="flex-1">
          <div className="flex items-baseline justify-between">
            <h3 className="font-medium">{review.userName}</h3>
            <p className="text-sm text-gray-500">{new Date(review.date).toLocaleDateString()}</p>
          </div>
          <p className="mt-2 text-gray-700">{review.content}</p>
        </div>
      </div>
    </div>
  )
}
