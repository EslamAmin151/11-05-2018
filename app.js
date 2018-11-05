
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

app.post('/deleteBlog',function(req,res){

  let blogID = req.body.blogId

  db.none('DELETE FROM dishes WHERE blogId = $1;',[blogId])
  .then(function(){
    res.redirect('/blogs')
  })
  .catch(function(error){
    console.log(error)
  })

})


app.post('/blogs',function(req,res){

  let name = req.body.title
  let description = req.body.description

  db.none('INSERT INTO dishes(name,description) VALUES($1,$2$)',[name,description])
  .then(function(){
    res.redirect('/blogs')
  })
  .catch(function(error){
    console.log(error)
  })

})

app.get('/blogs/update/:blogId',function(req,res){

  let blogId = req.params.blogId

  db.one('SELECT name,course,description FROM dishes WHERE blogId = $1',[blogId])
  .then(function(result){
    console.log("result value")
    console.log(result)
    res.render('updateBlog',{blog : result })
  })

})

app.get('/blogs/new',function(req,res){
  res.render('newBlog')
})

app.get('/blogs',function(req,res){
db.any('SELECT dishid,name,course,description from dishes;')
  .then(function(result){
    res.render('blogs',{blogs : result})
  })
})

app.listen(3000,function(req,res){
  console.log("Server has started...")
})
