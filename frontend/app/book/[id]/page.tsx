"use client"
import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { BookDetails } from "@/components/book-details"
import { ReviewList } from "@/components/review-list"
import { Separator } from "@/components/ui/separator"

export default function BookPage() {
  const params = useParams()
  const bookId = Array.isArray(params?.id) ? params.id[0] : params?.id
  const [book, setBook] = useState<any>(null)
  const [userRating, setUserRating] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!bookId) return
    async function fetchBook() {
      setLoading(true)
      try {
        const token = localStorage.getItem("token")
        const res = await fetch(`http://localhost:5000/api/books/${bookId}`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        })
        const data = await res.json()
        // reviews içindeki her elemana id: _id ve user bilgilerini ekle
        const reviews = (data.reviews || []).map((r: any) => ({ 
          ...r, 
          id: r._id,
          userId: r.user._id,
          userName: `${r.user.name} ${r.user.surname}`,
          userImage: r.user.profileImage || "/images/profiles/default-profile.svg"
        }))
        const bookData = { ...data, id: data._id, rating: data.averageRating, reviews }
        setBook(bookData)
        setUserRating(data.userRating ?? null)
      } catch {
        setBook(null)
        setUserRating(null)
      }
      setLoading(false)
    }
    fetchBook()
  }, [bookId])

  if (loading) {
    return <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center text-gray-500">Yükleniyor...</div>
  }
  if (!book) {
    return <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center text-gray-500">Kitap detayı bulunamadı.</div>
  }

  return (
    <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="space-y-8">
        <BookDetails book={book} userRating={userRating} onReviewAdded={(newReview) => setBook((prev: any) => ({ ...prev, reviews: [...(prev.reviews || []), { ...newReview, id: newReview._id }] }))} />
        <Separator className="my-8" />
        <div className="max-w-4xl mx-auto">
          <ReviewList reviews={book.reviews || []} bookId={book.id || bookId} />
        </div>
      </div>
    </div>
  )
}
