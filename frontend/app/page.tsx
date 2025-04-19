import Link from "next/link"
import { Button } from "@/components/ui/button"
import BookCard from "@/components/book-card"
import { mockBooks } from "@/lib/mock-data"

export default function Home() {
  // Get top rated books
  const topRatedBooks = [...mockBooks].sort((a, b) => b.rating - a.rating).slice(0, 6)

  // Get popular books by category
  const categories = ["Edebiyat", "Felsefe", "Bilim Kurgu", "Çocuk Edebiyatı", "Fantastik", "Polisiye", "Tarih"]

  return (
    <div className="flex flex-col gap-8 py-8">
      {/* Hero Section */}
      <section className="container px-4 md:px-6">
        <div className="relative overflow-hidden rounded-lg bg-gray-900 px-6 py-16 text-center md:px-12 md:py-24">
          <div className="relative z-10 mx-auto max-w-3xl">
            <h1 className="mb-4 text-4xl font-bold text-white md:text-5xl">IBDb'ye Hoş Geldiniz</h1>
            <p className="mb-6 text-lg text-gray-300">
              Favori kitaplarınızı keşfedin, puanlayın ve inceleyin. Kitap severler topluluğumuza bugün katılın!
            </p>
            <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
              <Button asChild size="lg" className="bg-yellow-400 text-black hover:bg-yellow-500">
                <Link href="/signup">Şimdi Katıl</Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="bg-black text-yellow-400 border-yellow-400 hover:bg-black/80"
              >
                <Link href="/popular">Kitapları Keşfet</Link>
              </Button>
            </div>
          </div>
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 opacity-50" />
        </div>
      </section>

      {/* Top Rated Books */}
      <section className="container px-4 md:px-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">En Yüksek Puanlı Kitaplar</h2>
          <Button asChild variant="link">
            <Link href="/popular">Tümünü Gör</Link>
          </Button>
        </div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          {topRatedBooks.map((book) => (
            <BookCard key={book.id} book={book} />
          ))}
        </div>
      </section>

      {/* Popular by Category */}
      {categories.map((category) => (
        <section key={category} className="container px-4 md:px-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">{category} Kategorisinde Popüler</h2>
            <Button asChild variant="link">
              <Link href="/popular">Tümünü Gör</Link>
            </Button>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
            {mockBooks
              .filter((book) => book.category === category)
              .slice(0, 6)
              .map((book) => (
                <BookCard key={book.id} book={book} />
              ))}
          </div>
        </section>
      ))}
    </div>
  )
}
