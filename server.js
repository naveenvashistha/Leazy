require('dotenv').config();
const express = require('express');
const app = express();
const cheerio = require("cheerio");
const fetch = require("node-fetch");
const _ = require("lodash");
const mongoose = require('mongoose');
const Links = require('./model/links.model');
const Request = require("./model/request.model")
app.use(express.urlencoded());
app.use(express.json());

mongoose.connect("mongodb+srv://"+process.env.MONGO_USERNAME+":"+process.env.MONGO_PASSWORD+"@cluster0.qvyqx.mongodb.net/linksDB",{useNewUrlParser: true, useUnifiedTopology: true});

app.post("/searchMovie",async (req,res)=>{
  try{
   let movies=[];
   // get html text from reddit
   const url = 'https://yts-subs.com/search/'+req.body.subtitle;
   const response = await fetch(url);
   // using await to ensure that the promise resolves
   const body = await response.text();
   // parse the html text and extract titles
   const $ = cheerio.load(body);
   const list = $(".media-movie-clickable");
   list.each((i,ele)=>{
    let link = $(ele).find("a").attr("href");
    let name = $(ele).find("a h3").text();
    let details = _.trim($(ele).find(".movinfo-section").text());
    details = details.replace(/\s+/g," ");
    let movieObj = {link:link,
                     name:name,
                     details:details
                    };
    movies.push(movieObj);
   });
   res.send({data:movies});
  }
  catch(error){
    console.log(error);
    res.send();
  }
  });

  app.post("/selectLanguage",async (req,res)=>{
    try{
      language = [];
     const response = await fetch('https://yts-subs.com'+req.body.movieChoice);
     const body = await response.text();
     console.log(body);
     const $ = cheerio.load(body);
     const list = $(".high-rating");
     list.each((i,ele)=>{
      let rating = _.trim($(ele).find(".rating-cell").text());

      let lang = $(ele).find(".sub-lang").text();
      let link = $(ele).find(".download-cell a").attr("href");
      let subObj = {rating:rating,
                       lang:lang,
                       link:link
                      };
      language.push(subObj);
     });
     res.send({data:language});
    }
    catch(error){
      console.log(error);
      res.send();
    }
    });

    
  app.post("/downloadLink",async (req,res)=>{
    try{
     const response = await fetch('https://yts-subs.com'+req.body.langChoice);
     const body = await response.text();
     console.log(body);
     const $ = cheerio.load(body);
     const finalLink = $(".download-subtitle").attr("href");
     res.send({data:finalLink});
    }
    catch(error){
      console.log(error);
      res.send();
    }
    });

    app.get("/getLinks",async (req,res)=>{
      try{
      var links = await Links.find({});
      res.send({data:links});
      }
      catch{
        res.send();
      }
    });

    app.post("/request",(req,res)=>{
      try{
      const request  =  new Request({email:req.body.email,movie:req.body.movie});
      request.save(function(err){
         res.send();
         });
        }
        catch{
          res.send();
        }  
    });
    
    if (process.env.NODE_ENV === "production"){
      app.use(express.static("client/build"));
      const path = require("path");
      app.get("*",(req,res)=>{
         res.sendFile(path.resolve(__dirname,"client","build","index.html"));
      });
      
  }

app.listen(process.env.PORT || 5000, () => {
    console.log("app is running");
  });