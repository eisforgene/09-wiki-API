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

// request targeting all articles
app.route('/articles')

    .get((req, res) => {

        Article.find({}, (err, foundArticles) => {
            if (!err) {
                res.send(foundArticles)
            } else {
                res.send(err);
            }
        });
    })

    .post((req, res) => {
        const newArticle = new Article({
            title: req.body.title,
            content: req.body.content
        })

        newArticle.save((err) => {
            if (!err) {
                res.send('Successfully added a new article.');
            } else {
                res.send(err);
            }
        });
    })

    .delete((req, res) => {
        Article.deleteMany({}, (err) => {
            if (!err) {
                res.send('Successfully deleted all articles');
            } else {
                res.send(err);
            }
        });
    });
// requests targeting a single article
app.route('/articles/:articleTitle')
    .get((req, res) => {
        Article.findOne({ title: req.params.articleTitle }, (err, foundArticle) => {
            if (foundArticle) {
                res.send(foundArticle);
            } else {
                res.send("No articles matching that title was found.");
            }
        });
    })
    .put((req, res) => {
        Article.replaceOne(
            { title: req.params.articleTitle }, req.body, (err) => {
                if (!err) {
                    res.send('Successfully updated article.')
                }
            }
        );
    })
    .patch((req, res) => {
        Article.updateOne({ title: req.params.articleTitle }, // find document with same title as :articleTitle
            req.body,
            (err, updatedResults) => { // req.body will only pass information that is provided upon the request
                console.log(req.body);
                if (!err) {
                    console.log(req.body);
                    console.log(updatedResults)
                    res.send('Successfully updated article.');
                } else {
                    res.send(err);
                }
            });
    })
    .delete((req, res) => {
        Article.deleteOne({ title: req.params.articleTitle }, (err) => {
            if (err) {
                res.send(err);
            } else {
                res.send('Successfully deleted article.');
            }
        });
    });


app.listen(3000, () => {
    console.log("Server is running on port 3000.");
})
