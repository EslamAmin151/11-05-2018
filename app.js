
const express = require('express')
const mustacheExpress = require('mustache-express')
const bodyParser = require('body-parser')
const app = express()
// import the pg-promise library which is used to connect and execute SQL on a postgres database
const pgp = require('pg-promise')()
// connection string which is used to specify the location of the database
const connectionString = "postgres://localhost:5432/blogsdb"
// creating a new database object which will allow us to interact with the database
const db = pgp(connectionString)

app.use(bodyParser.urlencoded({ extended: false }))
app.engine('mustache',mustacheExpress())
app.set('views','./views')
app.set('view engine','mustache')
let blogs = [{dishId:1},{title:"technology"}, {author:"Amin"},{description:"story"}]
blogs =[]


app.get('/addBlog',function(req,res){
  res.render('addBlog')

})

app.post('/addBlog',function(req,res){
  let dishId =req.body.dishId
  let title = req.body.title
  let author = req.body.author
  let description = req.body.description
  let newPost = {dish: dishId, title: title, author: author, description: description}
  blogs.push(newPost)

  res.redirect("/blogs")

})

app.get('/blogs',function(req,res){
  res.render("blogs",{blogs:blogs})

})



app.listen(3000,function(){
  console.log(" Server is starting")
})
