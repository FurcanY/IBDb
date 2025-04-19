"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { X, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { mockBooks } from "@/lib/mock-data"
import type { Book } from "@/lib/types"

// Mock reading lists data
const mockReadingLists = [
  {
    id: "1",
    userId: "1",
    name: "Okunacaklar",
    books: mockBooks.slice(0, 3),
  },
  {
    id: "2",
    userId: "1",
    name: "Favoriler",
    books: mockBooks.slice(3, 5),
  },
]

export default function EditReadingListPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const listId = params.id

  // Find the reading list by ID
  const existingList = mockReadingLists.find((list) => list.id === listId)

  const [listName, setListName] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedBooks, setSelectedBooks] = useState<Book[]>([])
  const [searchResults, setSearchResults] = useState<Book[]>([])

  // Load existing list data
  useEffect(() => {
    if (existingList) {
      setListName(existingList.name)
      setSelectedBooks(existingList.books)
    } else {
      // Redirect if list not found
      router.push("/profile")
    }
  }, [existingList, router])

  const handleSearch = (e?: React.FormEvent) => {
    if (e) {
      e.preventDefault()
    }

    if (!searchQuery.trim()) {
      setSearchResults([])
      return
    }

    const query = searchQuery.toLowerCase()
    const results = mockBooks
      .filter(
        (book) =>
          (book.title.toLowerCase().includes(query) || book.author.toLowerCase().includes(query)) &&
          !selectedBooks.some((selectedBook) => selectedBook.id === book.id),
      )
      .slice(0, 5)

    setSearchResults(results)
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!listName.trim()) {
      alert("Lütfen okuma listeniz için bir isim girin")
      return
    }

    if (selectedBooks.length === 0) {
      alert("Lütfen okuma listenize en az bir kitap ekleyin")
      return
    }

    // In a real app, you would update the reading list in your backend
    console.log("Reading list updated:", {
      id: listId,
      name: listName,
      books: selectedBooks,
    })

    // Redirect back to profile page
    router.push("/profile?tab=lists")
  }

  if (!existingList) {
    return null // This will be handled by the useEffect redirect
  }

  return (
    <div className="container py-8 px-4 md:px-6">
      <div className="mx-auto max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle>Okuma Listesini Düzenle</CardTitle>
            <CardDescription>Okuma listenizin adını ve kitaplarını güncelleyin</CardDescription>
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
