# Back-End

## Kullanılan Teknolojiler
- Node.js, Express.js
- MongoDB (Mongoose ODM)
- Redis (Cache)
- RabbitMQ (Queue)
- JWT (Kimlik Doğrulama)
- Docker & Docker Compose

## Temel Özellikler
- Kullanıcı kayıt & giriş (JWT ile)
- Kitap arama, detay, puanlama, inceleme
- Profil yönetimi, okuma listeleri
- Popüler kitaplar (Redis cache)
- İnceleme moderasyonu (RabbitMQ + Worker)

## Ana Endpointler
- `POST   /api/auth/register`   → Kayıt ol
- `POST   /api/auth/login`      → Giriş yap
- `GET    /api/books/search`    → Kitap arama
- `GET    /api/books/:id`       → Kitap detayı (+yorumlar)
- `POST   /api/books/:id/reviews` → İnceleme ekle (modere edilir)
- `GET    /api/users/me`        → Profil, puanlar, incelemeler, okuma listeleri

## Kimlik Doğrulama
- JWT tabanlı, `Authorization: Bearer <token>`
- Korumalı endpointlerde middleware ile kontrol

## Veri Tabanı
- MongoDB (User, Book, Review, Rating, ReadingList modelleri)

## Cache
- Redis ile popüler kitaplar önbelleğe alınır
- Yeni inceleme/puan eklenince cache temizlenir

## Queue & Moderasyon
- RabbitMQ ile inceleme eklenince mesaj kuyruğa atılır
- Moderation Worker, kuyruğu dinler ve küfür/profanity kontrolü yapar
- Uygunsuz içerik sansürlenir veya reddedilir

## Docker
- Tüm servisler (backend, moderation worker, frontend, mongo, redis, rabbitmq) docker-compose ile ayağa kalkar
- Ortam değişkenleriyle bağlantılar yönetilir (örn. `MONGODB_URI`, `REDIS_URL`, `RABBITMQ_URL`)

## Ortam Değişkenleri (Örnek)
- `MONGODB_URI=mongodb://mongo:27017/ibdb_temp`
- `REDIS_URL=redis://redis:6379`
- `RABBITMQ_URL=amqp://rabbitmq`
- `JWT_SECRET=...`
