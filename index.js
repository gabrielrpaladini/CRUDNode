const bodyParser = require('body-parser');
const express = require('express');
const session = require('express-session');
const app = express();

const connection = require("./database/database");

const categoriesController = require("./categories/CategoriesController");
const articlesController = require("./article/ArticlesController");
const usersController = require("./user/usersController");

const Article = require("./article/Article");
const Category = require("./categories/Category");
const User = require("./user/User");

connection
    .authenticate()
    .then(() => {
        console.log("Conexão feita com sucesso");
    }).catch((error) => {
        console.log(error);
    });

const port = 3003;

app.set('view engine', 'ejs');

app.use(express.static('public'));

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.use(session({
    secret: Math.random(),
    cookie: {
        maxAge: 3000000
    }
}));

app.use("/", categoriesController);
app.use("/", articlesController);
app.use("/", usersController);

app.get("/", (req, res) => {
    Article.findAll({
        order: [
            ['id', 'DESC']
        ],
        limit: 4
    }).then(articles => {
        Category.findAll().then(categories => {
            res.render("index", {articles: articles, categories: categories});
        });
    });
    
});

app.get("/:slug", (req, res) => {
    let slug = req.params.slug;
    Article.findOne({
        where: {
            slug: slug
        }
    }).then(article => {
        if(article != undefined) {
            Category.findAll().then(categories => {
                res.render("articles", {article: article, categories: categories});
            });
        }
        else{
            res.redirect("/");
        }
    }).catch(err => {
        res.redirect("/");
    })
});

app.get("/category/:slug", (req, res) => {
    let slug = req.params.slug;

    Category.findOne({
        where: {
            slug: slug
        },
        include: [{model: Article}]
    }).then( category => {
        if(category != undefined) {
            Category.findAll().then(categories => {
                res.render("index", {articles: category.articles, categories: categories})
            })
        }
        else{
            res.redirect("/")
        }
    }).catch(err => {
        res.redirect("/");
    });

});

app.listen(port, () => {
    console.log('Servidor rodando na porta' + port);
})