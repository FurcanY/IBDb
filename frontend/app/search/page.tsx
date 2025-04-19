"use client"

import { useState, useEffect, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { Book } from "@/lib/types"
import { mockBooks } from "@/lib/mock-data"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, Loader2 } from "lucide-react"
import Link from "next/link"

function SearchContent() {
  const searchParams = useSearchParams()
  const [searchQuery, setSearchQuery] = useState("")
  const [results, setResults] = useState<Book[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [activeTab, setActiveTab] = useState("all")

  useEffect(() => {
    const query = searchParams.get("query")
    if (query) {
      setSearchQuery(query)
      performSearch(query)
    }
  }, [searchParams])

  const performSearch = async (query: string) => {
    setIsLoading(true)

    // Yapay gecikme ekle
    await new Promise(resolve => setTimeout(resolve, 500))

    const filteredBooks = mockBooks.filter(book => {
      const searchTerm = query.toLowerCase()
      const bookTitle = book.title.toLowerCase()
      const bookAuthor = book.author.toLowerCase()
      const bookCategory = book.category.toLowerCase()
      
      return (
        bookTitle.includes(searchTerm) ||
        bookAuthor.includes(searchTerm) ||
        bookCategory.includes(searchTerm)
      )
    })

    setResults(filteredBooks)
    setIsLoading(false)
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (!searchQuery.trim()) return
    performSearch(searchQuery)
  }

  const filteredResults = activeTab === "all" 
    ? results 
    : results.filter(book => book.category.toLowerCase() === activeTab)

  return (
    <div className="container mx-auto px-4 py-8">
      <form onSubmit={handleSearch} className="mb-8">
        <div className="flex w-full max-w-2xl mx-auto gap-2">
          <Input
            type="search"
            placeholder="Kitap, yazar veya kategori ara..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1"
          />
          <Button type="submit" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Aranıyor...
              </>
            ) : (
              <>
                <Search className="mr-2 h-4 w-4" />
                Ara
              </>
            )}
          </Button>
        </div>
      </form>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      ) : results.length > 0 ? (
        <>
          <div className="flex gap-4 mb-6">
            <Button
              variant={activeTab === "all" ? "default" : "outline"}
              onClick={() => setActiveTab("all")}
            >
              Tümü
            </Button>
            <Button
              variant={activeTab === "edebiyat" ? "default" : "outline"}
              onClick={() => setActiveTab("edebiyat")}
            >
              Edebiyat
            </Button>
            <Button
              variant={activeTab === "bilim kurgu" ? "default" : "outline"}
              onClick={() => setActiveTab("bilim kurgu")}
            >
              Bilim Kurgu
            </Button>
            <Button
              variant={activeTab === "fantastik" ? "default" : "outline"}
              onClick={() => setActiveTab("fantastik")}
            >
              Fantastik
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredResults.map((book) => (
              <Link href={`/book/${book.id}`} key={book.id}>
                <div className="border rounded-lg p-4 hover:shadow-lg transition-shadow">
                  <div className="aspect-[3/4] relative mb-4">
                    <img
                      src={book.coverImage}
                      alt={book.title}
                      className="object-cover rounded-md w-full h-full"
                    />
                  </div>
                  <h3 className="font-semibold text-lg mb-1">{book.title}</h3>
                  <p className="text-gray-600 mb-2">{book.author}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">{book.category}</span>
                    <span className="text-sm font-medium">⭐ {book.rating}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </>
      ) : searchQuery ? (
        <div className="text-center py-12">
          <p className="text-gray-600">Aramanızla eşleşen sonuç bulunamadı.</p>
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-600">Arama yapmak için yukarıdaki arama kutusunu kullanın.</p>
        </div>
      )}
    </div>
  )
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    }>
      <SearchContent />
    </Suspense>
  )
}
