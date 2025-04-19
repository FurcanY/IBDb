'use client'

import Link from "next/link"
import Image from "next/image"
import { Star } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import type { Book } from "@/lib/types"

interface BookCardProps {
  book: Book
}

export default function BookCard({ book }: BookCardProps) {
  return (
    <Link href={`/book/${book.id}`}>
      <Card className="overflow-hidden transition-all hover:shadow-lg">
        <div className="aspect-[2/3] relative">
          <Image
            src={book.coverImage || "/images/books/default-book.svg"}
            alt={book.title}
            fill
            className="object-cover"
            onError={(e) => {
              // Resim yüklenemezse varsayılan resmi göster
              const target = e.target as HTMLImageElement;
              target.src = "/images/books/default-book.svg";
            }}
          />
        </div>
        <CardContent className="p-4">
          <div className="flex items-center gap-1 mb-1">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            <span className="text-sm font-medium">{book.rating.toFixed(1)}</span>
          </div>
          <h3 className="font-semibold line-clamp-1">{book.title}</h3>
          <p className="text-sm text-gray-500 line-clamp-1">{book.author}</p>
        </CardContent>
      </Card>
    </Link>
  )
}
