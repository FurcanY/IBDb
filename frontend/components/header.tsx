"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export default function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [user, setUser] = useState<{ name?: string; surname?: string; email?: string; profileImage?: string } | null>(null)
  const pathname = usePathname()
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [isSearching, setIsSearching] = useState(false)

  // URL'deki query parametresini kontrol et
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const query = urlParams.get("query")
    if (query) {
      setSearchQuery(query)
    }
  }, [])

  useEffect(() => {
    // Oturum kontrolü: localStorage'da token var mı?
    function syncAuthState() {
      const token = localStorage.getItem("token")
      const userData = localStorage.getItem("user")
      setIsLoggedIn(!!token)
      setUser(userData ? JSON.parse(userData) : null)
    }
    syncAuthState()
    window.addEventListener("storage", syncAuthState)
    window.addEventListener("focus", syncAuthState)
    window.addEventListener("authChanged", syncAuthState)
    return () => {
      window.removeEventListener("storage", syncAuthState)
      window.removeEventListener("focus", syncAuthState)
      window.removeEventListener("authChanged", syncAuthState)
    }
  }, [])

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!searchQuery.trim()) return

    setIsSearching(true)
    
    try {
      // Arama sayfasına yönlendir
      await router.push(`/search?query=${encodeURIComponent(searchQuery.trim())}`)
    } catch (error) {
      console.error("Yönlendirme hatası:", error)
    } finally {
      // Her durumda arama durumunu sıfırla
      setIsSearching(false)
    }
  }

  const handleKeyDown = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault()
      if (!searchQuery.trim()) return

      setIsSearching(true)
      
      try {
        // Arama sayfasına yönlendir
        await router.push(`/search?query=${encodeURIComponent(searchQuery.trim())}`)
      } catch (error) {
        console.error("Yönlendirme hatası:", error)
      } finally {
        // Her durumda arama durumunu sıfırla
        setIsSearching(false)
      }
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    setIsLoggedIn(false)
    setUser(null)
    router.push("/")
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-yellow-400">
      <div className="container flex h-16 items-center justify-between px-4 md:px-6">
        <div className="flex items-center gap-4">
          <Link href="/" className="flex items-center">
            <span className="text-2xl font-bold">IBDb</span>
          </Link>
          <nav className="hidden md:flex gap-6">
            <Link
              href="/"
              className={`text-sm font-medium ${pathname === "/" ? "text-black" : "text-gray-700 hover:text-black"}`}
            >
              Ana Sayfa
            </Link>
            <Link
              href="/popular"
              className={`text-sm font-medium ${
                pathname === "/popular" ? "text-black" : "text-gray-700 hover:text-black"
              }`}
            >
              Popüler
            </Link>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <form onSubmit={handleSearch} className="flex-1">
            <div className="flex w-full max-w-sm items-center space-x-2">
              <Input
                type="search"
                placeholder="Kitap ara..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={isSearching}
                className="bg-white text-black placeholder:text-gray-500"
              />
              <Button 
                type="submit" 
                size="icon" 
                disabled={isSearching}
                className="bg-black text-white hover:bg-gray-800"
              >
                <Search className="h-4 w-4" />
              </Button>
            </div>
          </form>
          {isLoggedIn ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user?.profileImage || "/placeholder.svg?height=32&width=32"} alt="Kullanıcı" />
                    <AvatarFallback>{user?.name?.[0] || "K"}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{user?.name} {user?.surname}</p>
                    <p className="text-xs leading-none text-muted-foreground">{user?.email}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/profile">Profil</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/profile/edit">Profili Düzenle</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>Çıkış Yap</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex gap-2">
              <Button asChild variant="outline" className="bg-white">
                <Link href="/login">Giriş Yap</Link>
              </Button>
              <Button asChild className="bg-black text-white hover:bg-gray-800">
                <Link href="/signup">Kayıt Ol</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
