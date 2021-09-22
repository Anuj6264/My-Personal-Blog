//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
var _=require('lodash');
const mongoose=require('mongoose');
mongoose.connect('mongodb://localhost:27017/blogWebsiteDB', {useNewUrlParser: true, useUnifiedTopology: true});

// let posts=[];
const homeStartingContent = "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

const app = express();

app.set('view engine', 'ejs');

// app.use(bodyParser.urlencoded({extended: true}));
// app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static("public"));

const postSchema = new mongoose.Schema({
  title : {
    type : String,
    required : [true,'Title to de de BSDK']
  },
  content : String
});

const Post = new mongoose.model("Post" , postSchema);


app.get("/",function(req,res){
  // console.log(posts);
  Post.find({} , function(err,posts){
    if(err){
      console.log(err);
    }
    else{
      res.render("home.ejs", {paragraph : homeStartingContent , posts : posts});
    }
  });
  
});



app.get("/about",function(req,res){
  res.render("about.ejs", { paragraph : aboutContent });
});


app.get("/contact",function(req,res){
  res.render("contact.ejs" , { paragraph : contactContent});
});

app.get("/compose" ,function(req,res){
  res.render("compose.ejs");
});


app.get("/post/:title",function(req,res){

  const calledTitle=req.params.title;
  lowerCalledTitle=_.lowerCase(calledTitle);

  Post.find({title : {$regex : lowerCalledTitle , $options : "i"}} , function(err,post){
    if(err){
      console.log(err);
    }
    else{
      console.log(post[0].title);
      res.render("post.ejs" , {postTitle : post[0].title , PostContent : post[0].content});
    }
  });

  // posts.forEach(function(i){
  //   const storedTitle=i.title;
  //   lowerStoredTitle=_.lowerCase(storedTitle);

  //   if(lowerStoredTitle===lowerCalledTitle){
  //     res.render("post.ejs" , {postTitle : storedTitle , PostContent : i.content});
  //     console.log("Match Found");
  //   }
  // })

  });
  // for(let i=0;i<posts.length;i++){
  //   if(posts[i].title===req.params.title){
  //     console.log("Match Found");
  //   }

  // console.log(req.params.title);

app.post("/compose" , function(req,res){
  const  PostObj={
    Title:req.body.PostTitle,
    Content:req.body.PostContent,
  };
  // posts.push(PostObj);
  const post = new Post({
    title : PostObj.Title,
    content : PostObj.Content
  });

  post.save();
  res.redirect("/");


app.post("/" , function(req,res){
  console.log("Button Pressed");
  res.redirect("/compose");
});
  
});





app.listen(3000, function() {
  console.log("Server started on port 3000");
});
