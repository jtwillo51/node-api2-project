const express = require("express")
const db = require("../data/db")

const router = express.Router();

router.post("/api/posts", (req, res)=>{
    if(!req.body.title||!req.body.contents){
        res.status(400).json({ errorMessage: "Please probide title and contents for the post."})
    } else if(req.body.title||req.body.contents){
        const newPost = {
            title: req.body.title,
            contents: req.body.contents,
            created_at: Date.now(),
            updated_at: Date.now()
        }
        db.insert(newPost)
       return res.status(201).json(newPost)
    } else{
       res.status(500).json({
            error: "There was an error while saving the post to the database."
        })
    }

})

router.post("/api/posts/:id/comments", (req, res)=>{
    const post = db.findById(req.params.id)
    if(!post){
        res.status(404).json({ message: "The post with the specified ID does not exist." })
    } else if(!req.body.text){
        res.status(400).json({ errorMessage: "Please provide text for the comment." })
    } else if(req.body.text){
        db.insertComment(req.body.text)
        res.status(201).json(req.body.text)
    } else {
        res.status(500).json({ error: "There was an error while saving the comment to the database" })
    }
    
})

router.get("/api/posts", (req, res)=>{
    const posts = db.find();
    if(!posts){
        res.status(500).json({ error: "The posts information could not be retrieved." })
    }else{
        res.json(posts)
    }
    
})

router.get("/api/posts/:id", (req, res)=>{
    const post = db.findById(req.params.id)
    if(!post){
        res.status(404).json({
            message: "The post with the specified ID does not exist."
        })
    } else if(post){
        res.json(post)
    } else{
        res.status(500).json({ error: "The posts information could not be retrieved." })
    }
    
})

router.get("/api/posts/:id/comments", (req, res)=>{
    const post = db.findById(req.params.id)
    const comments = db.findPostComments(req.params.id)
    if(!post){
        res.status(404).json({message: "The post with the specified ID does not exist."})
    } else if(!comments){
        res.status(500).json({ error: "The comments information could not be retrieved." })
    } else{
        res.json(comments)
    }
    
})

router.delete("/api/posts/:id", (req, res)=>{
    const post = db.findById(req.params.id)
    if(!post){
        res.status(404).json({message: "The post with the specified ID does not exist."})
    } else if (post) {
        db.remove(post)
        res.json({message: "The post has been deleted"})
    } else {
        res.status(500).json({ error: "The post could not be removed" })
    }
    
})

router.put("/api/posts/:id", (req, res)=>{
    const post = db.findById(req.params.id)
    if(!post){
        res.status(404).json({message: "The post with the specified ID does not exist."})
    } else if(!req.body.title || !req.body.contents){
        res.status(400).json({ errorMessage: "Please provide title and contents for the post." })
    } else if(post && req.body.title && req.body.contents){
        db.update(req.params.id, req.body)
    } else{
        res.status(500).json({ error: "The post information could not be modified." })
    }
})