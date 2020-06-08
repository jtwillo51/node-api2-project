const express = require("express")

const postRouter = require("./posts/postsRouter")

const server = express();
const port = 4000;

server.use(express.json())
server.use(cors())

server.listen(port, ()=>{
    console.log(`Server is running at http://localhost:${port}`)
})