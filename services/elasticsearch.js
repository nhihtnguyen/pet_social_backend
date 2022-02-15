import { Client } from "@elastic/elasticsearch";
import dotenv from "dotenv";
dotenv.config();

const id =
  process.env.ELASTIC_SEARCH_CLOUD_ID ||
  "pet-social:dXMtZWFzdDQuZ2NwLmVsYXN0aWMtY2xvdWQuY29tJDc2M2ZhNjc0Nzg3ZjQxNWU4ZjExNzM5MzFiMDFjOWZhJGEzMTE2OGI5ZmQ1YjRhZjQ4NDdjMmJjYmFiNTZkOGY3";
const password =
  process.env.ELASTIC_SEARCH_AUTH_PASSWORD || "wrvfjcVQupzDqx2HFYqwHcB3";
const username = process.env.ELASTIC_SEARCH_AUTH_USERNAME || "elastic";
console.log(id, password, username);
const client = new Client({
  cloud: {
    id,
  },
  auth: {
    username,
    password,
  },
});

client.on("error", function (error) {
  console.log("Error encountered: ", error);
});
client.on("connect", function () {
  console.log("Elasticsearch Connected");
});
export default client;
