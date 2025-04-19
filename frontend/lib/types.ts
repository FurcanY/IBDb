export interface User {
    id: string
    name: string
    surname: string
    email: string
    about?: string
    profileImage?: string
  }
  
  export interface Book {
    id: string
    title: string
    author: string
    publishDate: string
    pageCount: number
    summary: string
    category: string
    coverImage?: string
    rating: number
  }
  
  export interface Review {
    id: string
    userId: string
    bookId: string
    userName: string
    userImage?: string
    content: string
    date: string
  }
  
  export interface Rating {
    id: string
    userId: string
    bookId: string
    rating: number
  }
  
  export interface ReadingList {
    id: string
    userId: string
    name: string
    books: Book[]
  }
  