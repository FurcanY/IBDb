const amqp = require('amqplib');
const mongoose = require('mongoose');
require('dotenv').config();
console.log('MONGODB_URI:', process.env.MONGODB_URI);

const Review = require('./models/Review');

async function start() {
  // MongoDB bağlantısı
  await mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  console.log('Moderation worker MongoDB bağlantısı başarılı');

  // RabbitMQ bağlantısı
  const conn = await amqp.connect(process.env.RABBITMQ_URL || 'amqp://localhost');
  const channel = await conn.createChannel();
  const queue = 'review_created';
  await channel.assertQueue(queue, { durable: true });
  console.log('Moderation worker RabbitMQ kuyruğu dinliyor:', queue);

  channel.consume(queue, async (msg) => {
    if (msg !== null) {
      const data = JSON.parse(msg.content.toString());
      console.log('Yeni inceleme moderasyona alındı:', data);
      // Küfür denetimi ve sansürleme
      const forbiddenWords = ["kötü", "spam", "yasak", "salak", "aptal", "küfür1", "küfür2"];
      let censored = data.content;
      let hasBadWord = false;
      for (const word of forbiddenWords) {
        // Kelime başı/sonu ve harf duyarsız tam eşleşme için regex'i güncelle
        const regex = new RegExp(`\\b${word}\\b`, 'gi');
        if (regex.test(censored)) {
          hasBadWord = true;
          censored = censored.replace(regex, '*'.repeat(word.length));
        }
      }
      console.log('Sansürlenmiş içerik:', censored);
      let status = 'approved';
      // Eğer çok ağır bir kelime varsa tamamen reddet (örnek: "yasak")
      if (/yasak/i.test(data.content)) {
        status = 'rejected';
      }
      await Review.findByIdAndUpdate(data.reviewId, { status, content: censored });
      console.log(`İnceleme ${data.reviewId} moderasyon sonucu: ${status}`);
      channel.ack(msg);
    }
  });
}

start().catch(err => {
  console.error('Moderation worker hata:', err);
  process.exit(1);
}); 