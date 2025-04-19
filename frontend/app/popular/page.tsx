import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { mockBooks } from "@/lib/mock-data"
import BookCard from "@/components/book-card"

export default function PopularBooksPage() {
  // Get top rated books
  const topRatedBooks = [...mockBooks].sort((a, b) => b.rating - a.rating)

  // Get books by category
  const categories = ["Edebiyat", "Felsefe", "Bilim Kurgu", "Çocuk Edebiyatı", "Fantastik","Polisiye","Tarih"]

  return (
    <div className="container py-8 px-4 md:px-6">
      <div className="mb-8 space-y-2">
        <h1 className="text-3xl font-bold">Popüler Kitaplar</h1>
        <p className="text-gray-500">IBDb'de en popüler ve en yüksek puanlı kitapları keşfedin</p>
      </div>

      <Tabs defaultValue="top-rated" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="top-rated">En Yüksek Puanlı</TabsTrigger>
          {categories.map((category) => (
            <TabsTrigger key={category} value={category.toLowerCase().replace(" ", "-")}>
              {category}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="top-rated" className="mt-0">
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
            {topRatedBooks.map((book) => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>
        </TabsContent>

        {categories.map((category) => (
          <TabsContent key={category} value={category.toLowerCase().replace(" ", "-")} className="mt-0">
            <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
              {mockBooks
                .filter((book) => book.category === category)
                .sort((a, b) => b.rating - a.rating)
                .map((book) => (
                  <BookCard key={book.id} book={book} />
                ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}
