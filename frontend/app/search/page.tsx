"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { mockBooks } from "@/lib/mock-data"
import BookCard from "@/components/book-card"

export default function SearchPage() {
  const searchParams = useSearchParams()
  const initialQuery = searchParams.get("query") || ""

  const [searchQuery, setSearchQuery] = useState(initialQuery)
  const [activeTab, setActiveTab] = useState("all")
  const [results, setResults] = useState<typeof mockBooks>([])
  const [hasSearched, setHasSearched] = useState(false)

  useEffect(() => {
    if (initialQuery) {
      performSearch(initialQuery)
    }
  }, [initialQuery])

  const performSearch = (query: string) => {
    setHasSearched(true)
    if (!query.trim()) {
      setResults([])
      return
    }

    const lowerQuery = query.toLowerCase()
    const filtered = mockBooks.filter(
      (book) =>
        book.title.toLowerCase().includes(lowerQuery) ||
        book.author.toLowerCase().includes(lowerQuery) ||
        book.category.toLowerCase().includes(lowerQuery),
    )

    setResults(filtered)
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    performSearch(searchQuery)
  }

  const filterByCategory = (category: string) => {
    if (category === "all") {
      performSearch(searchQuery)
    } else {
      const filtered = mockBooks.filter(
        (book) =>
          book.category.toLowerCase() === category &&
          (!searchQuery.trim() ||
            book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            book.author.toLowerCase().includes(searchQuery.toLowerCase())),
      )
      setResults(filtered)
    }
  }

  const handleTabChange = (value: string) => {
    setActiveTab(value)
    filterByCategory(value)
  }

  return (
    <div className="container py-8 px-4 md:px-6">
      <div className="mb-8 space-y-2">
        <h1 className="text-3xl font-bold">Kitap Ara</h1>
        <p className="text-gray-500">IBDb'de milyonlarca kitap arasında arama yapın</p>
      </div>

      <form onSubmit={handleSearch} className="mb-8">
        <div className="flex gap-4">
          <Input
            type="search"
            placeholder="Kitap adı, yazar veya kategori ara..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1"
          />
          <Button type="submit">Ara</Button>
        </div>
      </form>

      {hasSearched && (
        <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="all">Tümü</TabsTrigger>
            {["kurgu", "kurgu-dışı", "bilim-kurgu", "gizem", "romantik"].map((category) => (
              <TabsTrigger key={category} value={category}>
                {category.charAt(0).toUpperCase() + category.slice(1).replace("-", " ")}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value="all" className="mt-0">
            {results.length > 0 ? (
              <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
                {results.map((book) => (
                  <BookCard key={book.id} book={book} />
                ))}
              </div>
            ) : (
              <div className="rounded-lg border border-dashed p-8 text-center">
                <h2 className="text-xl font-semibold">Sonuç bulunamadı</h2>
                <p className="mt-2 text-gray-500">Arama kriterlerinizi değiştirerek tekrar deneyin.</p>
              </div>
            )}
          </TabsContent>

          {["kurgu", "kurgu-dışı", "bilim-kurgu", "gizem", "romantik"].map((category) => (
            <TabsContent key={category} value={category} className="mt-0">
              {results.length > 0 ? (
                <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
                  {results.map((book) => (
                    <BookCard key={book.id} book={book} />
                  ))}
                </div>
              ) : (
                <div className="rounded-lg border border-dashed p-8 text-center">
                  <h2 className="text-xl font-semibold">Sonuç bulunamadı</h2>
                  <p className="mt-2 text-gray-500">Arama kriterlerinizi değiştirerek tekrar deneyin.</p>
                </div>
              )}
            </TabsContent>
          ))}
        </Tabs>
      )}

      {!hasSearched && (
        <div className="rounded-lg border border-dashed p-8 text-center">
          <h2 className="text-xl font-semibold">Arama yapın</h2>
          <p className="mt-2 text-gray-500">Kitap adı, yazar veya kategori ile arama yapabilirsiniz.</p>
        </div>
      )}
    </div>
  )
}
