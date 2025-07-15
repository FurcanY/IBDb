'use client'

import { useState } from "react"
import Image from "next/image"
import { Star, Clock, BookOpen, Calendar, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import type { Book } from "@/lib/types"
import { useEffect } from "react"

interface BookDetailsProps {
  book: Book
  userRating?: number | null
}

export function BookDetails({ book, userRating, onReviewAdded }: BookDetailsProps & { onReviewAdded?: (review: any) => void }) {
  const [activeTab, setActiveTab] = useState("overview")
  const [isRatingDialogOpen, setIsRatingDialogOpen] = useState(false)
  const [isReviewDialogOpen, setIsReviewDialogOpen] = useState(false)
  const [rating, setRating] = useState(userRating || 0)
  const [review, setReview] = useState("")

  // Okuma listesi için
  const [isListDialogOpen, setIsListDialogOpen] = useState(false)
  const [readingLists, setReadingLists] = useState<any[]>([])
  const [selectedListId, setSelectedListId] = useState<string>("")
  const [adding, setAdding] = useState(false)

  useEffect(() => {
    async function fetchLists() {
      const token = localStorage.getItem("token")
      if (!token) return
      const res = await fetch("http://localhost:5000/api/users/me", {
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await res.json()
      setReadingLists(data.readingLists || [])
    }
    if (isListDialogOpen) fetchLists()
  }, [isListDialogOpen])

  const handleAddToList = async () => {
    if (!selectedListId) return
    setAdding(true)
    const selectedList = readingLists.find((l: any) => l._id === selectedListId || l.id === selectedListId)
    try {
      const token = localStorage.getItem("token")
      const res = await fetch(`http://localhost:5000/api/users/me/reading-lists/${selectedListId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: selectedList?.name || "",
          bookIds: [book.id]
        }),
      })
      if (!res.ok) {
        const data = await res.json()
        setAdding(false)
        return
      }
      setIsListDialogOpen(false)
      setSelectedListId("")
    } catch {
      // Hata durumunda sessizce devam et
    }
    setAdding(false)
  }

  // Dialog açıldığında rating'i userRating ile başlat
  const handleOpenRatingDialog = (open: boolean) => {
    setIsRatingDialogOpen(open)
    if (open) {
      setRating(userRating || 0)
    }
  }

  const handleReviewSubmit = async () => {
    if (!review.trim()) return
    try {
      const token = localStorage.getItem("token")
      const res = await fetch(`http://localhost:5000/api/books/${book.id}/reviews`, {
        method: "POST",
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
      const newReview = await res.json();
    setIsReviewDialogOpen(false)
    setReview("")
      if (onReviewAdded) onReviewAdded(newReview)
    } catch {
      // Hata durumunda sessizce devam et
    }
  }

  const handleRatingSubmit = async () => {
    if (!rating) return
    try {
      const token = localStorage.getItem("token")
      const method = userRating ? "PUT" : "POST"
      const res = await fetch(`http://localhost:5000/api/books/${book.id}/rate`, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ value: rating }),
      })
      if (!res.ok) {
        const data = await res.json()
        return
      }
      setIsRatingDialogOpen(false)
      setRating(rating)
      window.location.reload()
    } catch {
      // Hata durumunda sessizce devam et
    }
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
            <Dialog open={isRatingDialogOpen} onOpenChange={handleOpenRatingDialog}>
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

            <Dialog open={isListDialogOpen} onOpenChange={setIsListDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" className="w-full">Okuma listesine ekle</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Okuma Listesine Ekle</DialogTitle>
                  <DialogDescription>Kitabı eklemek istediğiniz okuma listesini seçin.</DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  {readingLists.length === 0 ? (
                    <div className="text-gray-500">Hiç okuma listeniz yok. Profilinizden yeni bir liste oluşturabilirsiniz.</div>
                  ) : (
                    <select
                      className="w-full border rounded p-2"
                      value={selectedListId}
                      onChange={e => setSelectedListId(e.target.value)}
                    >
                      <option value="">Liste seçin</option>
                      {readingLists.map((list: any) => (
                        <option key={list._id || list.id} value={list._id || list.id}>{list.name}</option>
                      ))}
                    </select>
                  )}
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsListDialogOpen(false)}>İptal</Button>
                  <Button
                    onClick={handleAddToList}
                    className="bg-yellow-400 text-black hover:bg-yellow-500"
                    disabled={!selectedListId || adding}
                  >
                    Ekle
            </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
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
              <span className="ml-1 font-medium">{typeof book.rating === "number" ? book.rating.toFixed(1) : "-"}</span>
            </div>
          </div>

          <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="overview">Genel Bakış</TabsTrigger>
              <TabsTrigger value="details">Detaylar</TabsTrigger>
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