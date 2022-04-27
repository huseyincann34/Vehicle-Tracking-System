
const amqp = require("amqplib");
const queueName = process.argv[2] || "jobsQueue";
const data = require("./data.json")
const redis = require("redis")
const client = redis.createClient({
  host:'127.0.0.1',
  redis});
connect_rabbitmq();
async function connect_rabbitmq() {
  try {
    const connection = await amqp.connect("amqp://localhost:5672");
    const channel = await connection.createChannel();
    const assertion = await channel.assertQueue(queueName);
    channel.consume(queueName, message => {
        const messageInfo = JSON.parse(message.content.toString())
        
  
        const userInfo = data.find(u => u.date == messageInfo.description )
        if(userInfo){
            console.log("İşlenen Kayıt", userInfo);
            client.set(`user_${userInfo.id}_${userInfo.date}`, JSON.stringify(userInfo), (err,status) => {
              
              if(!err) {
                channel.ack(message);
              }
            });           
        }
    });                   
  } catch (error) {
    console.log("Error", error);
  }
  
}