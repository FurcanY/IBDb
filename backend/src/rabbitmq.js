const amqp = require('amqplib');

let channel = null;
let connection = null;

async function connectRabbitMQ() {
  if (channel) return channel;
  try {
    connection = await amqp.connect(process.env.RABBITMQ_URL || 'amqp://localhost');
    channel = await connection.createChannel();
    console.log('RabbitMQ bağlantısı başarılı');
    return channel;
  } catch (err) {
    console.error('RabbitMQ bağlantı hatası:', err);
    throw err;
  }
}

async function sendToQueue(queue, message) {
  try {
    const ch = await connectRabbitMQ();
    await ch.assertQueue(queue, { durable: true });
    ch.sendToQueue(queue, Buffer.from(JSON.stringify(message)), { persistent: true });
    console.log('RabbitMQ kuyruğuna mesaj gönderildi:', queue, message);
  } catch (err) {
    console.error('RabbitMQ kuyruğuna mesaj gönderilemedi:', err);
    throw err;
  }
}

module.exports = {
  connectRabbitMQ,
  sendToQueue,
}; 