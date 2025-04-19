"use client"

import { useState, use } from "react"
import Image from "next/image"
import { Star, Clock, BookOpen, Calendar, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog"
import { mockBooks, mockReviews } from "@/lib/mock-data"
import ReviewCard from "@/components/review-card"
import { notFound } from "next/navigation"
import { BookDetails } from "@/components/book-details"
import { ReviewList } from "@/components/review-list"
import { Separator } from "@/components/ui/separator"

interface BookPageProps {
  params: Promise<{
    id: string
  }>
}

export default function BookPage({ params }: BookPageProps) {
  const resolvedParams = use(params)
  
  // Find the book by ID
  const book = mockBooks.find((book) => book.id === resolvedParams.id)

  // Get reviews for this book
  const bookReviews = mockReviews.filter((review) => review.bookId === resolvedParams.id)

  if (!book) {
    notFound()
  }

  return (
    <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="space-y-8">
        <BookDetails book={book} />
        <Separator className="my-8" />
        <div className="max-w-4xl mx-auto">
          <ReviewList reviews={bookReviews} />
        </div>
      </div>
    </div>
  )
}
