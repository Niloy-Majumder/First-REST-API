const express= require("express");
const mongoose = require("mongoose");
const ejs = require("ejs");

const app = express();
app.use(express.urlencoded({extended:true}));

app.set('view engine', 'ejs')

app.use(express.static("./public"));

const url="mongodb://localhost:27017/wikiDB";

mongoose.connect(url)
    .then(()=>{
        console.log("Connected Successfully")
    })  
    .catch(()=>{
        console.log("Error")
    });

const articleSchema= new mongoose.Schema({
    title:String,
    content:String
});

const Article= new mongoose.model("Article",articleSchema);

app.route("/articles")
.get((req,res)=>{
    Article.find({},(err,foundarticles)=>{
        if(!err) res.send(foundarticles);
        else res.send(err);
        
    })
})
.post((req,res)=>{
    const newArticle= new Article({
        title:req.body.title,
        content:req.body.content
    })
    newArticle.save((err)=>{
        if(!err) res.send("Successfully Added");
        else res.send(err);
    })
})
.delete((req,res)=>{
    Article.deleteMany({},(err)=>{
        if (!err) {
            res.send("Deleted Successfully");
        }
        else{
            res.send(err);
        }
    })
});

app.route("/articles/:articleTitle")
.get((req,res)=>{
    Article.findOne({title:req.params.articleTitle},(err,foundArticle)=>{
        if(foundArticle){
            res.send(foundArticle);
        }else{
            res.send("No articles found")
        }
    })
})

.put((req,res)=>{
    Article.findOneAndUpdate(
        {title:req.params.articleTitle},
        {title:req.body.title,content:req.body.content},
        {overwrite:true},
        (err)=>{
            if (!err) {
                res.send("Successfully Updated");
            }else{
                res.send(err);
            }
        })
})

.patch((req,res)=>{
    Article.findOneAndUpdate(
        {title:req.params.articleTitle},
        {title:req.body.title,content:req.body.content},
        (err)=>{
            if (!err) {
                res.send("Successfully Updated");
            }else{
                res.send(err);
            }
        })
})

.delete((req,res)=>{
    Article.deleteOne(
        {title:req.params.articleTitle},
        (err)=>{
            if(!err) res.send("Successfully deleted");
            else res.send(err);
        }
    )
})

app.listen(3000,()=>{
    console.log("Connected to port 3000");
})