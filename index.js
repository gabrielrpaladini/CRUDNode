const bodyParser = require('body-parser');
const express = require('express');
const app = express();

const connection = require("./database/database");

const categoriesController = require("./categories/CategoriesController");
const articlesController = require("./article/ArticlesController");

const Article = require("./article/Article");
const Category = require("./categories/Category");

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

app.use("/", categoriesController);
app.use("/", articlesController);

app.get("/", (req, res) => {
    res.render("index");
});

app.listen(port, () => {
    console.log('Servidor rodando na porta' + port);
})