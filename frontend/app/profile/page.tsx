"use client"
import { useEffect, useState, Suspense } from "react"
import Image from "next/image"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { Pencil, Plus, Star } from "lucide-react"
import { useRef } from "react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import BookCard from "@/components/book-card"

function ProfileContent() {
  const searchParams = useSearchParams()
  const tabParam = searchParams.get("tab")
  const [activeTab, setActiveTab] = useState(tabParam || "about")
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [isRatingDialogOpen, setIsRatingDialogOpen] = useState(false)
  const [editingRating, setEditingRating] = useState<any>(null)
  const [newRating, setNewRating] = useState(0)
  const [isReviewDialogOpen, setIsReviewDialogOpen] = useState(false)
  const [editingReview, setEditingReview] = useState<any>(null)
  const [reviewContent, setReviewContent] = useState("")

  useEffect(() => {
    async function fetchProfile() {
      setLoading(true)
      try {
        const token = localStorage.getItem("token")
        const res = await fetch("http://localhost:5000/api/users/me", {
          headers: { Authorization: `Bearer ${token}` },
        })
        const data = await res.json()
        setProfile(data)
      } catch {
        setProfile(null)
      }
      setLoading(false)
    }
    fetchProfile()
  }, [])

  const handleOpenRatingDialog = (rating: any) => {
    setEditingRating(rating)
    setNewRating(rating.value)
    setIsRatingDialogOpen(true)
  }

  const handleRatingSubmit = async () => {
    if (!editingRating) return
    try {
      const token = localStorage.getItem("token")
      const res = await fetch(`http://localhost:5000/api/books/${editingRating.book._id}/rate`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ value: newRating }),
      })
      if (!res.ok) {
        const data = await res.json()
        return
      }
      setIsRatingDialogOpen(false)
      setEditingRating(null)
      setNewRating(0)
      window.location.reload()
    } catch {
      // Hata durumunda sessizce devam et
    }
  }

  const handleOpenReviewDialog = (review: any) => {
    setEditingReview(review)
    setReviewContent(review.content)
    setIsReviewDialogOpen(true)
  }

  const handleReviewSubmit = async () => {
    if (!editingReview || !reviewContent.trim()) return
    try {
      const token = localStorage.getItem("token")
      const res = await fetch(`http://localhost:5000/api/books/${editingReview.book._id}/reviews/${editingReview._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ content: reviewContent }),
      })
      if (!res.ok) {
        return
      }
      setIsReviewDialogOpen(false)
      setEditingReview(null)
      setReviewContent("")
      window.location.reload()
    } catch {
      // Hata durumunda sessizce devam et
    }
  }

  const handleDeleteReview = async (review: any) => {
    try {
      const token = localStorage.getItem("token")
      const res = await fetch(`http://localhost:5000/api/books/${review.book._id}/reviews/${review._id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      })
      if (!res.ok) {
        return
      }
      window.location.reload()
    } catch {
      // Hata durumunda sessizce devam et
    }
  }

  if (loading) {
    return <div className="container py-8 px-4 md:px-6 text-center text-gray-500">Yükleniyor...</div>
  }
  if (!profile) {
    return <div className="container py-8 px-4 md:px-6 text-center text-gray-500">Profil bilgisi bulunamadı.</div>
  }
  const { user, ratings, reviews, readingLists } = profile

  return (
    <div className="container py-8 px-4 md:px-6">
      <div className="grid grid-cols-1 gap-8 md:grid-cols-3 lg:grid-cols-4">
        {/* Profile Sidebar */}
        <div className="md:col-span-1">
          <div className="sticky top-24 space-y-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="relative">
                <Image
                  src={user.profileImage || "/images/profiles/default-profile.svg"}
                  alt={user.name}
                  width={150}
                  height={150}
                  className="rounded-full"
                />
              </div>
              <div>
                <h1 className="text-2xl font-bold">{user.name} {user.surname}</h1>
                <p className="text-gray-500">{user.email}</p>
              </div>
            </div>
            <div className="space-y-2">
              <Button asChild className="w-full bg-yellow-400 text-black hover:bg-yellow-500">
                <Link href="/profile/edit">Profili Düzenle</Link>
              </Button>
              <Button asChild variant="outline" className="w-full">
                <Link href="/profile/reading-list/new">
                  <Plus className="mr-2 h-4 w-4" />
                  Okuma Listesi Oluştur
                </Link>
              </Button>
            </div>
          </div>
        </div>
        {/* Profile Content */}
        <div className="md:col-span-2 lg:col-span-3">
          <Tabs defaultValue="about" value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="about">Hakkımda</TabsTrigger>
              <TabsTrigger value="ratings">Puanlarım</TabsTrigger>
              <TabsTrigger value="reviews">İncelemelerim</TabsTrigger>
              <TabsTrigger value="lists">Okuma Listelerim</TabsTrigger>
            </TabsList>
            <TabsContent value="about" className="py-6">
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-semibold">Hakkımda</h2>
                  <p className="mt-2 text-gray-700">{user.about || "Bilgi girilmemiş."}</p>
                </div>
                <div>
                  <h2 className="text-xl font-semibold">Aktivite Özeti</h2>
                  <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
                    <Card>
                      <CardContent className="flex flex-col items-center justify-center p-6">
                        <p className="text-3xl font-bold">{ratings.length}</p>
                        <p className="text-sm text-gray-500">Puanlanan Kitap</p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="flex flex-col items-center justify-center p-6">
                        <p className="text-3xl font-bold">{reviews.length}</p>
                        <p className="text-sm text-gray-500">Yazılan İnceleme</p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="flex flex-col items-center justify-center p-6">
                        <p className="text-3xl font-bold">{readingLists.length}</p>
                        <p className="text-sm text-gray-500">Okuma Listesi</p>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="ratings" className="py-6">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold">Puanlarım</h2>
                </div>
                {ratings.length > 0 ? (
                  <div className="space-y-4">
                    {ratings.map((rating: any) => (
                      <div key={rating._id} className="flex items-center gap-4 rounded-lg border p-4">
                        <Image
                          src={rating.book.coverImage || "/images/books/default-book.svg"}
                          alt={rating.book.title}
                          width={60}
                          height={80}
                          className="rounded"
                        />
                        <div className="flex-1">
                          <Link href={`/book/${rating.book._id}`} className="font-medium hover:underline">
                            {rating.book.title}
                          </Link>
                          <p className="text-sm text-gray-500">Yazar: {rating.book.author}</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                          <span className="font-medium">{rating.value}</span>
                          <Button size="sm" variant="outline" className="ml-2" onClick={() => handleOpenRatingDialog(rating)}>
                            <Pencil className="w-4 h-4 mr-1" /> Düzenle
                          </Button>
                        </div>
                      </div>
                    ))}
                          </div>
                ) : (
                  <div className="text-gray-500">Hiç puanlanmış kitap yok.</div>
                )}
                {/* Puan düzenleme dialogu */}
                <Dialog open={isRatingDialogOpen} onOpenChange={setIsRatingDialogOpen}>
                            <DialogContent>
                              <DialogHeader>
                      <DialogTitle>Kitap Puanını Düzenle</DialogTitle>
                                <DialogDescription>
                                  Bu kitabı nasıl puanlarsınız? Puanınız diğer okuyuculara yardımcı olur.
                                </DialogDescription>
                              </DialogHeader>
                              <div className="flex justify-center py-4">
                                {[1, 2, 3, 4, 5].map((star) => (
                        <button key={star} type="button" onClick={() => setNewRating(star)} className="p-1">
                                    <Star
                            className={`h-8 w-8 ${newRating >= star ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
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
                        disabled={newRating === 0}
                                >
                        Kaydet
                                </Button>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>
              </div>
            </TabsContent>
            <TabsContent value="reviews" className="py-6">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold">İncelemelerim</h2>
                </div>
                {reviews.length > 0 ? (
                  <div className="space-y-6">
                    {reviews.map((review: any) => (
                      <div key={review._id} className="space-y-2 rounded-lg border p-4">
                          <div className="flex items-center gap-3">
                            <Image
                            src={review.book.coverImage || "/images/books/default-book.svg"}
                            alt={review.book.title}
                              width={40}
                              height={60}
                              className="rounded"
                            />
                          <div className="flex-1">
                            <Link href={`/book/${review.book._id}`} className="font-medium hover:underline">
                              {review.book.title}
                              </Link>
                            <p className="text-sm text-gray-500">Yazar: {review.book.author}</p>
                          </div>
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline" onClick={() => handleOpenReviewDialog(review)}>
                              <Pencil className="w-4 h-4 mr-1" /> Düzenle
                            </Button>
                            <Button size="sm" variant="destructive" onClick={() => handleDeleteReview(review)}>
                              Sil
                            </Button>
                            </div>
                          </div>
                          <p className="text-gray-700">{review.content}</p>
                          <p className="text-sm text-gray-500">
                            Yayınlanma: {new Date(review.date).toLocaleDateString()}
                          </p>
                        </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-gray-500">Hiç inceleme yok.</div>
                )}
                {/* İnceleme düzenleme dialogu */}
                <Dialog open={isReviewDialogOpen} onOpenChange={setIsReviewDialogOpen}>
                  <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                      <DialogTitle>İncelemeyi Düzenle</DialogTitle>
                      <DialogDescription>
                        İncelemenizi düzenleyin.
                      </DialogDescription>
                    </DialogHeader>
                    <Textarea
                      placeholder="İncelemenizi buraya yazın..."
                      className="min-h-[150px]"
                      value={reviewContent}
                      onChange={(e) => setReviewContent(e.target.value)}
                    />
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setIsReviewDialogOpen(false)}>
                        İptal
                      </Button>
                      <Button
                        onClick={handleReviewSubmit}
                        className="bg-yellow-400 text-black hover:bg-yellow-500"
                        disabled={!reviewContent.trim()}
                      >
                        Güncelle
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </TabsContent>

            <TabsContent value="lists" className="py-6">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold">Okuma Listelerim</h2>
                </div>
                {readingLists.length > 0 ? (
                  <div className="space-y-8">
                    {readingLists.map((list: any) => (
                      <div key={list._id} className="space-y-4">
                        <div className="flex items-center justify-between">
                          <h3 className="text-lg font-medium">{list.name}</h3>
                          <Button asChild variant="outline" size="sm">
                            <Link href={`/profile/reading-list/${list._id}`}>Listeyi Düzenle</Link>
                          </Button>
                        </div>
                        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                          {list.books.map((book: any) => (
                            <BookCard key={book._id} book={{
                              id: book._id,
                              title: book.title,
                              author: book.author,
                              publishDate: book.publishDate,
                              pageCount: book.pageCount,
                              summary: book.summary,
                              category: book.category,
                              coverImage: book.coverImage,
                              rating: book.averageRating || 0,
                            }} />
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-gray-500">Hiç okuma listesi yok.</div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}

export default function ProfilePage() {
  return (
    <Suspense fallback={<div>Yükleniyor...</div>}>
      <ProfileContent />
    </Suspense>
  )
}
