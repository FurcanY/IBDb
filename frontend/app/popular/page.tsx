"use client"
import { useEffect, useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import BookCard from "@/components/book-card"
import { Book } from "@/lib/types"

export default function PopularBooksPage() {
  const [books, setBooks] = useState<Book[]>([])
  const [loading, setLoading] = useState(true)
  const categories = ["Edebiyat", "Felsefe", "Bilim Kurgu", "Çocuk Edebiyatı", "Fantastik","Polisiye","Tarih"]
  const [activeTab, setActiveTab] = useState("top-rated")

  useEffect(() => {
    async function fetchBooks() {
      setLoading(true)
      try {
        let url = "http://localhost:5000/api/books/popular"
        if (activeTab !== "top-rated") {
          url += `?category=${encodeURIComponent(categories.find(c => c.toLowerCase().replace(" ", "-") === activeTab) || "")}`
        }
        const res = await fetch(url)
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
        setBooks(books)
      } catch {
        setBooks([])
      }
      setLoading(false)
    }
    fetchBooks()
  }, [activeTab])

  return (
    <div className="container py-8 px-4 md:px-6">
      <div className="mb-8 space-y-2">
        <h1 className="text-3xl font-bold">Popüler Kitaplar</h1>
        <p className="text-gray-500">IBDb'de en popüler ve en yüksek puanlı kitapları keşfedin</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="top-rated">En Yüksek Puanlı</TabsTrigger>
          {categories.map((category) => (
            <TabsTrigger key={category} value={category.toLowerCase().replace(" ", "-")}>
              {category}
            </TabsTrigger>
          ))}
        </TabsList>
        <TabsContent value={activeTab} className="mt-0">
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
            {loading ? (
              <div className="col-span-full text-center text-gray-500">Yükleniyor...</div>
            ) : books.length > 0 ? (
              books.map((book) => <BookCard key={book.id} book={book} />)
            ) : (
              <div className="col-span-full text-center text-gray-500">Kitap bulunamadı.</div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
