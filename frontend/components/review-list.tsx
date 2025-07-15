'use client'

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import ReviewCard from "@/components/review-card"
import type { Review } from "@/lib/types"
import { jwtDecode } from "jwt-decode"
import { useEffect } from "react"

interface ReviewListProps {
  reviews: Review[]
  bookId: string
}

export function ReviewList({ reviews, bookId }: ReviewListProps) {
  const [isReviewDialogOpen, setIsReviewDialogOpen] = useState(false)
  const [review, setReview] = useState("")
  const [editingReview, setEditingReview] = useState<any>(null)
  const [userId, setUserId] = useState<string | null>(null)

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (token) {
      try {
        const decoded: any = jwtDecode(token)
        setUserId(decoded.id)
      } catch {}
    }
  }, [])

  const myReview = userId ? reviews.find(r => r.userId === userId) : null

  const handleReviewSubmit = async () => {
    if (!review.trim() || !bookId) return
    try {
      const token = localStorage.getItem("token")
      let url = `http://localhost:5000/api/books/${bookId}/reviews`
      let method = "POST"
      if (editingReview) {
        url += `/${editingReview.id}`
        method = "PUT"
      }
      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ content: review }),
      })
      if (!res.ok) {
        // Hata durumunda sessizce devam et
        return
      }
    setIsReviewDialogOpen(false)
    setReview("")
      setEditingReview(null)
      window.location.reload()
    } catch {
      // Hata durumunda sessizce devam et
    }
  }

  const handleEdit = (r: any) => {
    setEditingReview(r)
    setReview(r.content)
    setIsReviewDialogOpen(true)
  }

  const handleDelete = async (r: any) => {
    if (!bookId || !r.id) return
    try {
      const token = localStorage.getItem("token")
      const res = await fetch(`http://localhost:5000/api/books/${bookId}/reviews/${r.id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      })
      if (!res.ok) {
        // Hata durumunda sessizce devam et
        return
      }
      window.location.reload()
    } catch {
      // Hata durumunda sessizce devam et
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Okuyucu İncelemeleri</h2>
        <Dialog open={isReviewDialogOpen} onOpenChange={(open) => {
          setIsReviewDialogOpen(open)
          if (!open) {
            setEditingReview(null)
            setReview("")
          }
        }}>
          <DialogTrigger asChild>
            <Button className="bg-yellow-400 text-black hover:bg-yellow-500">
              {myReview ? "İncelememi Düzenle" : "İnceleme yaz"}
            </Button>
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
                {editingReview ? "İncelemeyi Güncelle" : "İncelemeyi Gönder"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {reviews.length > 0 ? (
        <div className="space-y-4">
          {reviews.map((review) => (
            <div key={review.id} className="relative group">
              <ReviewCard review={review} />
              {userId && review.userId === userId && (
                <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button size="sm" variant="outline" onClick={() => handleEdit(review)}>Düzenle</Button>
                  <Button size="sm" variant="destructive" onClick={() => handleDelete(review)}>Sil</Button>
                </div>
              )}
            </div>
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