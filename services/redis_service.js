import { createClient } from "redis";
import dotenv from "dotenv";
dotenv.config();

const client = createClient({
  host: "redis-19830.c251.east-us-mz.azure.cloud.redislabs.com",
  port: 19830,
  password: "8tEPck784Or0qhMDho1Fd1WwNiU8qxnQ",
});

client.on("error", function (error) {
  console.log("Error encountered: ", error);
});
client.on("connect", function () {
  console.log("Redis Connected");
});

export default client;
