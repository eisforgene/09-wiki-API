const express = require('express');
const mongoose = require('mongoose');
const ejs = require('ejs');

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.set('view engine', 'ejs');

mongoose.connect("mongodb://localhost:27017/wikiDB", {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const articleSchema = {
    title: String,
    content: String
};

const Article = mongoose.model("Article", articleSchema);

app.get('/articles', (req, res) => {

    Article.find({}, (err, foundArticles) => {
        if (!err) {
            res.send(foundArticles)
        } else {
            res.send(err);
        }
        

    })
})


app.listen(3000, () => {
    console.log("Server is running on port 3000.");
})
