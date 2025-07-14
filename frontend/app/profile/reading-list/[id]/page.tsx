"use client"

import type React from "react"

import { use, useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { X, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { Book } from "@/lib/types"

// mockBooks ile ilgili kodlar kaldırıldı

export default function EditReadingListPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter()
  const { id: listId } = use(params)
  const [listName, setListName] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedBooks, setSelectedBooks] = useState<Book[]>([])
  const [searchResults, setSearchResults] = useState<Book[]>([])
  const [loading, setLoading] = useState(true)

  // Load existing list data
  useEffect(() => {
    async function fetchList() {
      setLoading(true)
      try {
        const token = localStorage.getItem("token")
        const res = await fetch(`http://localhost:5000/api/users/me`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        const data = await res.json()
        const list = data.readingLists.find((l: any) => l._id === listId)
        if (!list) {
          router.push("/profile")
          return
        }
        setListName(list.name)
        setSelectedBooks(list.books.map((book: any) => ({
          id: book._id,
          title: book.title,
          author: book.author,
          publishDate: book.publishDate,
          pageCount: book.pageCount,
          summary: book.summary,
          category: book.category,
          coverImage: book.coverImage,
          rating: book.averageRating || 0,
        })))
      } catch {
        router.push("/profile")
      }
      setLoading(false)
    }
    fetchList()
  }, [listId, router])

  const handleSearch = async (e?: React.FormEvent) => {
    if (e) {
      e.preventDefault()
    }
    if (!searchQuery.trim()) {
      setSearchResults([])
      return
    }
    try {
      const res = await fetch(`http://localhost:5000/api/books/search?query=${encodeURIComponent(searchQuery)}`)
      const data = await res.json()
      const books: Book[] = data.map((item: any) => ({
        id: item._id,
        title: item.title,
        author: item.author,
        publishDate: item.publishDate,
        pageCount: item.pageCount,
        summary: item.summary,
        category: item.category,
        coverImage: item.coverImage,
        rating: item.averageRating || 0,
      }))
      setSearchResults(books.filter((book) => !selectedBooks.some((b) => b.id === book.id)))
    } catch {
      setSearchResults([])
    }
  }

  const addBook = (book: Book) => {
    if (!selectedBooks.some((b) => b.id === book.id)) {
      setSelectedBooks([...selectedBooks, book])
    }
    setSearchQuery("")
    setSearchResults([])
  }

  const removeBook = (bookId: string) => {
    setSelectedBooks(selectedBooks.filter((book) => book.id !== bookId))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!listName.trim()) {
      alert("Lütfen okuma listeniz için bir isim girin")
      return
    }
    if (selectedBooks.length === 0) {
      alert("Lütfen okuma listenize en az bir kitap ekleyin")
      return
    }
    try {
      const token = localStorage.getItem("token")
      const res = await fetch(`http://localhost:5000/api/users/me/reading-lists/${listId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: listName,
          bookIds: selectedBooks.map((b) => b.id),
        }),
      })
      if (!res.ok) {
        const data = await res.json()
        alert(data.message || "Liste güncellenemedi")
        return
      }
      // Başarılı
      router.push("/profile?tab=lists")
    } catch {
      alert("Sunucu hatası")
    }
  }

  // Listeyi silme
  const handleDeleteList = async () => {
    try {
      const token = localStorage.getItem("token")
      const res = await fetch(`http://localhost:5000/api/users/me/reading-lists/${listId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      })
      if (res.ok) {
        router.push("/profile?tab=lists")
      }
      // Başarısız olursa sessizce kal
    } catch {}
  }

  if (loading) {
    return <div className="container py-8 px-4 md:px-6 text-center text-gray-500">Yükleniyor...</div>
  }

  return (
    <div className="container py-8 px-4 md:px-6">
      <div className="mx-auto max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle>Okuma Listesini Düzenle</CardTitle>
            <CardDescription>Okuma listenizin adını ve kitaplarını güncelleyin</CardDescription>
            <Button type="button" variant="destructive" className="mt-4" onClick={handleDeleteList}>
              Listeyi Sil
            </Button>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="listName">Liste Adı</Label>
                <Input
                  id="listName"
                  value={listName}
                  onChange={(e) => setListName(e.target.value)}
                  placeholder="örn., Yaz Okumaları, Bilim Kurgu Favorilerim"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="searchBooks">Kitap Ekle</Label>
                <div className="flex gap-2">
                  <Input
                    id="searchBooks"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Başlık veya yazara göre ara"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault()
                        handleSearch(e)
                      }
                    }}
                  />
                  <Button type="button" onClick={handleSearch} className="bg-yellow-400 text-black hover:bg-yellow-500">
                    <Search className="h-4 w-4 mr-2" />
                    Ara
                  </Button>
                </div>

                {searchResults.length > 0 && (
                  <div className="mt-2 rounded-md border">
                    <div className="p-2 text-sm font-medium">Arama Sonuçları</div>
                    <div className="divide-y">
                      {searchResults.map((book) => (
                        <div key={book.id} className="flex items-center gap-3 p-2 hover:bg-gray-50">
                          <Image
                            src={book.coverImage || `/placeholder.svg?height=60&width=40`}
                            alt={book.title}
                            width={40}
                            height={60}
                            className="rounded"
                          />
                          <div className="flex-1">
                            <p className="font-medium">{book.title}</p>
                            <p className="text-sm text-gray-500">Yazar: {book.author}</p>
                          </div>
                          <Button
                            type="button"
                            size="sm"
                            onClick={() => addBook(book)}
                            className="bg-yellow-400 text-black hover:bg-yellow-500"
                          >
                            Ekle
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>Listedeki Kitaplar</Label>
                  <p className="text-sm text-gray-500">{selectedBooks.length} kitap</p>
                </div>
                {selectedBooks.length > 0 ? (
                  <div className="space-y-2">
                    {selectedBooks.map((book) => (
                      <div key={book.id} className="flex items-center gap-3 rounded-md border p-2">
                        <Image
                          src={book.coverImage || `/placeholder.svg?height=60&width=40`}
                          alt={book.title}
                          width={40}
                          height={60}
                          className="rounded"
                        />
                        <div className="flex-1">
                          <p className="font-medium">{book.title}</p>
                          <p className="text-sm text-gray-500">Yazar: {book.author}</p>
                        </div>
                        <Button type="button" size="icon" variant="ghost" onClick={() => removeBook(book.id)}>
                          <X className="h-4 w-4" />
                          <span className="sr-only">Kaldır</span>
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="rounded-md border border-dashed p-6 text-center">
                    <p className="text-gray-500">Bu listede kitap yok. Yukarıdan kitap arayıp ekleyin.</p>
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button type="button" variant="outline" onClick={() => router.push("/profile")}>
                İptal
              </Button>
              <Button type="submit" className="bg-yellow-400 text-black hover:bg-yellow-500">
                Değişiklikleri Kaydet
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  )
}
