'use client'

import { useState } from "react"
import Image from "next/image"
import { Star, Clock, BookOpen, Calendar, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import type { Book } from "@/lib/types"

interface BookDetailsProps {
  book: Book
}

export function BookDetails({ book }: BookDetailsProps) {
  const [activeTab, setActiveTab] = useState("overview")
  const [isRatingDialogOpen, setIsRatingDialogOpen] = useState(false)
  const [isReviewDialogOpen, setIsReviewDialogOpen] = useState(false)
  const [rating, setRating] = useState(0)
  const [review, setReview] = useState("")

  const handleRatingSubmit = () => {
    // TODO: Implement rating submission
    setIsRatingDialogOpen(false)
    setRating(0)
  }

  const handleReviewSubmit = () => {
    // TODO: Implement review submission
    setIsReviewDialogOpen(false)
    setReview("")
  }

  return (
    <div className="grid grid-cols-1 gap-8 md:grid-cols-3 lg:grid-cols-4">
      {/* Book Cover and Actions */}
      <div className="md:col-span-1">
        <div className="sticky top-24 space-y-4">
          <div className="overflow-hidden rounded-lg border">
            <Image
              src={book.coverImage || "/images/books/default-book.svg"}
              alt={book.title}
              width={300}
              height={450}
              className="w-full object-cover"
            />
          </div>
          <div className="flex flex-col gap-2">
            <Dialog open={isRatingDialogOpen} onOpenChange={setIsRatingDialogOpen}>
              <DialogTrigger asChild>
                <Button className="w-full bg-yellow-400 text-black hover:bg-yellow-500">Bu kitabı puanla</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>"{book.title}" kitabını puanlayın</DialogTitle>
                  <DialogDescription>
                    Bu kitabı nasıl puanlarsınız? Puanınız diğer okuyuculara yardımcı olur.
                  </DialogDescription>
                </DialogHeader>
                <div className="flex justify-center py-4">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button key={star} type="button" onClick={() => setRating(star)} className="p-1">
                      <Star
                        className={`h-8 w-8 ${rating >= star ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
                      />
                    </button>
                  ))}
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsRatingDialogOpen(false)}>
                    İptal
                  </Button>
                  <Button
                    onClick={handleRatingSubmit}
                    className="bg-yellow-400 text-black hover:bg-yellow-500"
                    disabled={rating === 0}
                  >
                    Puanı Gönder
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            <Dialog open={isReviewDialogOpen} onOpenChange={setIsReviewDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" className="w-full">
                  İnceleme yaz
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle>"{book.title}" kitabını inceleyin</DialogTitle>
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

            <Button variant="outline" className="w-full">
              Okuma listesine ekle
            </Button>
          </div>
        </div>
      </div>

      {/* Book Details */}
      <div className="md:col-span-2 lg:col-span-3">
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold">{book.title}</h1>
            <p className="text-lg text-gray-500">Yazar: {book.author}</p>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center">
              <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
              <span className="ml-1 font-medium">{book.rating.toFixed(1)}</span>
              <span className="ml-1 text-gray-500">(500 puan)</span>
            </div>
          </div>

          <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="overview">Genel Bakış</TabsTrigger>
              <TabsTrigger value="details">Detaylar</TabsTrigger>
              <TabsTrigger value="reviews">İncelemeler</TabsTrigger>
            </TabsList>
            <TabsContent value="overview" className="py-4">
              <div className="space-y-4">
                <h2 className="text-xl font-semibold">Özet</h2>
                <p className="text-gray-700">{book.summary}</p>
              </div>
            </TabsContent>
            <TabsContent value="details" className="py-4">
              <div className="space-y-4">
                <h2 className="text-xl font-semibold">Kitap Detayları</h2>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-500">Yayın Tarihi</p>
                      <p>{new Date(book.publishDate).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5 text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-500">Sayfa Sayısı</p>
                      <p>{book.pageCount} sayfa</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <User className="h-5 w-5 text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-500">Yazar</p>
                      <p>{book.author}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-500">Kategori</p>
                      <p>{book.category}</p>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
} 