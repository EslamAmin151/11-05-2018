const express = require('express')
const mustacheExpress = require('mustache-express')
const port = 3000
const bodyParser = require('body-parser')
const app = express()
const pgp = require('pg-promise')()
const connectionString = "postgres://localhost:5432/blogdb"
const db = pgp(connectionString)


app.engine('mustache', mustacheExpress())
app.set('views', './views')
app.set('view engine', 'mustache')
app.use(bodyParser.urlencoded({ extended: false }))


app.post('/add-blog', function (req, res) {

    let blogtitle = req.body.blogtitle
    let blogauthor = req.body.blogauthor
    let blogdescription = req.body.blogdescription
    let bloglikes = req.body.bloglikes

    db.none('INSERT INTO blogs(blogtitle,blogauthor,blogdescription, bloglikes) VALUES($1,$2,$3,$4)', [blogtitle, blogauthor, blogdescription, bloglikes])
        .then(function () {
            res.redirect('/blogs')
        })
        .catch(function (error) {
            console.log(error)
        })

})

app.post('/like-blog', function (req, res) {

    let bloglikes = parseInt(req.body.bloglikes)
    console.log(bloglikes)
    let blogId = req.body.blogId
    bloglikes += 1

    db.none('UPDATE blogs SET bloglikes = $1 WHERE blogid = $2',[bloglikes, blogId])
        .then(function () {
            res.redirect('/blogs')
        })
        .catch(function (error) {
            console.log(error)
        })

})

app.get('/blogs/update/:blogId', function (req, res) {

    let blogId = req.params.blogId

    db.one('SELECT blogid,blogtitle,blogauthor,blogdescription FROM blogs WHERE blogid = $1', [blogId])
        .then(function (result) {
            res.render('update-blog', result)
        })

})

app.post('/update-blog', function (req, res) {

    let blogtitle = req.body.blogtitle
    let blogdescription = req.body.blogdescription
    let blogauthor = req.body.blogauthor
    let blogId = req.body.blogId

    db.none('UPDATE blogs SET blogtitle = $1, blogdescription = $2, blogauthor = $3 WHERE blogid = $4', [blogtitle, blogdescription, blogauthor, blogId])
        .then(function () {
            res.redirect('/blogs')
        })
        .catch(function (error) {
            console.log(error)
        })

})

app.post('/delete-blog', function (req, res) {

    let blogId = req.body.blogId

    db.none('DELETE FROM blogs WHERE blogid = $1;', [blogId])
        .then(function () {
            res.redirect('/blogs')
        })
        .catch(function (error) {
            console.log(error)
        })

})

app.get('/blogs', function (req, res) {
    db.any('SELECT blogid,blogtitle,blogauthor,blogdescription,bloglikes FROM blogs ORDER BY blogid;')
        .then(function (result) {
            res.render('blogs', { blogs: result })
        })
})

app.get('/blogs/new', function (req, res) {
    res.render('new-blog')
})

app.listen(port, function () {

    console.log(`Server Running...`)
})
