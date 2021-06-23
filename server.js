const http = require("http");
const app = require("./app");

require("dotenv").config();

const [PORT, HOST] = [process.env.PORT, process.env.HOST];

const server = http.createServer(app);

server.listen(PORT, HOST, () => {
  console.log(`Server listening on http://${HOST}:${PORT}`);
});
