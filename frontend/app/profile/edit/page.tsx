"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Upload } from "lucide-react"

export default function EditProfilePage() {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    about: "",
    profileImage: "",
  })
  const [previewImage, setPreviewImage] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchProfile() {
      setLoading(true)
      try {
        const token = localStorage.getItem("token")
        const res = await fetch("http://localhost:5000/api/users/me", {
          headers: { Authorization: `Bearer ${token}` },
        })
        const data = await res.json()
        setFormData({
          firstName: data.user.name || "",
          lastName: data.user.surname || "",
          email: data.user.email || "",
          about: data.user.about || "",
          profileImage: data.user.profileImage || "",
        })
        setPreviewImage(data.user.profileImage || null)
      } catch {}
      setLoading(false)
    }
    fetchProfile()
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreviewImage(reader.result as string)
        setFormData((prev) => ({ ...prev, profileImage: reader.result as string }))
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const token = localStorage.getItem("token")
      const res = await fetch("http://localhost:5000/api/users/me", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: formData.firstName,
          surname: formData.lastName,
          about: formData.about,
          profileImage: formData.profileImage,
        }),
      })
      if (res.ok) {
        // Yeni kullanıcı bilgisini localStorage'a kaydet
        const updated = await res.json();
        localStorage.setItem("user", JSON.stringify(updated));
        window.dispatchEvent(new Event('authChanged'));
    router.push("/profile")
      }
      // Başarısız olursa sessizce kal
    } catch {}
  }

  if (loading) {
    return <div className="container py-8 px-4 md:px-6 text-center text-gray-500">Yükleniyor...</div>
  }
  return (
    <div className="container py-8 px-4 md:px-6">
      <div className="mx-auto max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle>Profili Düzenle</CardTitle>
            <CardDescription>Kişisel bilgilerinizi ve profil ayarlarınızı güncelleyin</CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-6">
              <div className="flex flex-col items-center space-y-4">
                <div className="relative">
                  <Image
                    src={previewImage || formData.profileImage || "/placeholder.svg?height=150&width=150"}
                    alt="Profil"
                    width={150}
                    height={150}
                    className="rounded-full"
                  />
                  <Button
                    size="icon"
                    variant="outline"
                    className="absolute bottom-0 right-0 h-8 w-8 rounded-full bg-white"
                    onClick={(e) => {
                      e.preventDefault()
                      fileInputRef.current?.click()
                    }}
                    type="button"
                  >
                    <Upload className="h-4 w-4" />
                    <span className="sr-only">Profil resmi yükle</span>
                  </Button>
                  <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    accept="image/*"
                    onChange={handleFileChange}
                  />
                </div>
                <p className="text-xs text-gray-500">Profil resminizi yüklemek için yukarıdaki butona tıklayın</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">Ad</Label>
                  <Input id="firstName" name="firstName" value={formData.firstName} onChange={handleChange} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Soyad</Label>
                  <Input id="lastName" name="lastName" value={formData.lastName} onChange={handleChange} required />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">E-posta</Label>
                <Input id="email" name="email" type="email" value={formData.email} onChange={handleChange} required disabled />
              </div>

              <div className="space-y-2">
                <Label htmlFor="about">Hakkımda</Label>
                <Textarea
                  id="about"
                  name="about"
                  value={formData.about}
                  onChange={handleChange}
                  placeholder="Kendiniz hakkında bilgi verin..."
                  className="min-h-[120px]"
                />
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button type="button" variant="outline" onClick={() => router.push("/profile")}>İptal</Button>
              <Button type="submit" className="bg-yellow-400 text-black hover:bg-yellow-500">Değişiklikleri Kaydet</Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  )
}
