"use client"

import { useState, Suspense } from "react"
import Image from "next/image"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { Pencil, Plus, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { mockBooks, mockReviews, mockUsers } from "@/lib/mock-data"
import BookCard from "@/components/book-card"

function ProfileContent() {
  const searchParams = useSearchParams()
  const tabParam = searchParams.get("tab")
  const [activeTab, setActiveTab] = useState(tabParam || "about")
  const [selectedBook, setSelectedBook] = useState<typeof mockBooks[0] | null>(null)
  const [rating, setRating] = useState(0)
  const [isRatingDialogOpen, setIsRatingDialogOpen] = useState(false)

  // Mock user data - in a real app, this would come from authentication
  const user = mockUsers[0]

  // Mock user's rated books
  const ratedBooks = mockBooks.slice(0, 4)

  // Mock user's reviews
  const userReviews = mockReviews.filter((review) => review.userId === user.id)

  // Mock user's reading lists
  const readingLists = [
    {
      id: "1",
      name: "Okunacaklar",
      books: mockBooks.slice(0, 3),
    },
    {
      id: "2",
      name: "Favoriler",
      books: mockBooks.slice(3, 5),
    },
  ]

  const handleRatingSubmit = () => {
    if (selectedBook && rating > 0) {
      // Burada gerçek bir API çağrısı yapılacak
      console.log(`Kitap ${selectedBook.id} için yeni puan: ${rating}`)
      setIsRatingDialogOpen(false)
      setRating(0)
      setSelectedBook(null)
    }
  }

  return (
    <div className="container py-8 px-4 md:px-6">
      <div className="grid grid-cols-1 gap-8 md:grid-cols-3 lg:grid-cols-4">
        {/* Profile Sidebar */}
        <div className="md:col-span-1">
          <div className="sticky top-24 space-y-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="relative">
                <Image
                  src={user.profileImage || "/placeholder.svg?height=150&width=150"}
                  alt={`${user.name} ${user.surname}`}
                  width={150}
                  height={150}
                  className="rounded-full"
                />
                <Button
                  size="icon"
                  variant="outline"
                  className="absolute bottom-0 right-0 h-8 w-8 rounded-full bg-white"
                  asChild
                >
                  <Link href="/profile/edit">
                    <Pencil className="h-4 w-4" />
                    <span className="sr-only">Profili düzenle</span>
                  </Link>
                </Button>
              </div>
              <div>
                <h1 className="text-2xl font-bold">
                  {user.name} {user.surname}
                </h1>
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
                        <p className="text-3xl font-bold">{ratedBooks.length}</p>
                        <p className="text-sm text-gray-500">Puanlanan Kitap</p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="flex flex-col items-center justify-center p-6">
                        <p className="text-3xl font-bold">{userReviews.length}</p>
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

                {ratedBooks.length > 0 ? (
                  <div className="space-y-4">
                    {ratedBooks.map((book) => (
                      <div key={book.id} className="flex items-center gap-4 rounded-lg border p-4">
                        <Image
                          src={book.coverImage || `/placeholder.svg?height=80&width=60`}
                          alt={book.title}
                          width={60}
                          height={80}
                          className="rounded"
                        />
                        <div className="flex-1">
                          <Link href={`/book/${book.id}`} className="font-medium hover:underline">
                            {book.title}
                          </Link>
                          <p className="text-sm text-gray-500">Yazar: {book.author}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="flex items-center gap-1">
                            <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                            <span className="font-medium">{(Math.random() * 3 + 2).toFixed(1)}</span>
                          </div>
                          <Dialog open={isRatingDialogOpen && selectedBook?.id === book.id} onOpenChange={setIsRatingDialogOpen}>
                            <DialogTrigger asChild>
                              <Button
                                variant="outline"
                                size="icon"
                                onClick={() => {
                                  setSelectedBook(book)
                                  setRating(0)
                                  setIsRatingDialogOpen(true)
                                }}
                              >
                                <Pencil className="h-4 w-4" />
                              </Button>
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
                                  Puanı Güncelle
                                </Button>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="rounded-lg border border-dashed p-6 text-center">
                    <p className="text-gray-500">Henüz hiç kitap puanlamadınız.</p>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="reviews" className="py-6">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold">İncelemelerim</h2>
                </div>

                {userReviews.length > 0 ? (
                  <div className="space-y-6">
                    {userReviews.map((review) => {
                      const book = mockBooks.find((b) => b.id === review.bookId)
                      return (
                        <div key={review.id} className="space-y-2 rounded-lg border p-4">
                          <div className="flex items-center gap-3">
                            <Image
                              src={book?.coverImage || `/placeholder.svg?height=60&width=40`}
                              alt={book?.title || "Kitap kapağı"}
                              width={40}
                              height={60}
                              className="rounded"
                            />
                            <div>
                              <Link href={`/book/${book?.id}`} className="font-medium hover:underline">
                                {book?.title}
                              </Link>
                              <p className="text-sm text-gray-500">Yazar: {book?.author}</p>
                            </div>
                          </div>
                          <p className="text-gray-700">{review.content}</p>
                          <p className="text-sm text-gray-500">
                            Yayınlanma: {new Date(review.date).toLocaleDateString()}
                          </p>
                        </div>
                      )
                    })}
                  </div>
                ) : (
                  <div className="rounded-lg border border-dashed p-6 text-center">
                    <p className="text-gray-500">Henüz hiç inceleme yazmadınız.</p>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="lists" className="py-6">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold">Okuma Listelerim</h2>
                  <Button asChild className="bg-yellow-400 text-black hover:bg-yellow-500">
                    <Link href="/profile/reading-list/new">
                      <Plus className="mr-2 h-4 w-4" />
                      Liste Oluştur
                    </Link>
                  </Button>
                </div>

                {readingLists.length > 0 ? (
                  <div className="space-y-8">
                    {readingLists.map((list) => (
                      <div key={list.id} className="space-y-4">
                        <div className="flex items-center justify-between">
                          <h3 className="text-lg font-medium">{list.name}</h3>
                          <Button asChild variant="outline" size="sm">
                            <Link href={`/profile/reading-list/${list.id}`}>Listeyi Düzenle</Link>
                          </Button>
                        </div>
                        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                          {list.books.map((book) => (
                            <BookCard key={book.id} book={book} />
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="rounded-lg border border-dashed p-6 text-center">
                    <p className="text-gray-500">Henüz hiç okuma listesi oluşturmadınız.</p>
                  </div>
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
