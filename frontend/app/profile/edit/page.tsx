"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { mockUsers } from "@/lib/mock-data"

export default function EditProfilePage() {
  const router = useRouter()
  const user = mockUsers[0]

  const [formData, setFormData] = useState({
    firstName: user.name,
    lastName: user.surname,
    email: user.email,
    about: user.about || "",
    profileImage: user.profileImage || "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // In a real app, you would update the user profile in your backend
    console.log("Profile updated:", formData)

    // Redirect back to profile page
    router.push("/profile")
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
                    src={formData.profileImage || "/placeholder.svg?height=150&width=150"}
                    alt="Profil"
                    width={150}
                    height={150}
                    className="rounded-full"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="profileImage">Profil Resmi URL</Label>
                  <Input
                    id="profileImage"
                    name="profileImage"
                    value={formData.profileImage}
                    onChange={handleChange}
                    placeholder="https://ornek.com/profil.jpg"
                  />
                  <p className="text-xs text-gray-500">Profil resminiz için bir URL girin</p>
                </div>
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
                <Input id="email" name="email" type="email" value={formData.email} onChange={handleChange} required />
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
              <Button type="button" variant="outline" onClick={() => router.push("/profile")}>
                İptal
              </Button>
              <Button type="submit" className="bg-yellow-400 text-black hover:bg-yellow-500">
                Değişiklikleri Kaydet
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  )
}
