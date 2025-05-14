const express = require ("express");
const app = express();
const bodyParser = require("body-parser")
const connection = require("./database/database")

const categoriesController = require("./categories/CategoriesController");
const articlesController = require("./articles/ArticlesController")

const Article = require("./articles/Articles")
const Category = require("./categories/Category")
app.set('view engine', 'ejs');

app.use(express.static('public'));

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json())

app.use((req, res, next) => {
    Category.findAll()
        .then(categories => {
            res.locals.categories = categories;
            next();
        })
        .catch(err => {
            console.error("Erro ao carregar categorias no middleware:", err);
            res.locals.categories = [];
            next();
        });
});

connection
    .authenticate()
    .then(() => {
        console.log('conexão feita com sucesso');
    }).catch((error) => {
        console.log(error);
    })

app.use("/", categoriesController);
app.use("/", articlesController);


app.get("/", (req, res) => {
    Article.findAll({
        order: [['id', 'DESC']]
    }).then(articles => {
        Category.findAll().then(categories => {  // Buscando categorias
            res.render("index", { 
                articles: articles,
                categories: categories // Passando as categorias para a view
            });
        }).catch(err => {
            console.log("Erro ao buscar categorias:", err);
            res.redirect("/"); 
        });
    }).catch(err => {
        console.log("Erro ao buscar artigos:", err);
        res.redirect("/"); 
    });
});



app.get("/:slug", (req,res) => {
    var slug = req.params.slug;
    Article.findOne({
        where : {
            slug: slug
        }
    }).then(article => {
        if(article != undefined){
            Category.findAll().then(categories => {
                res.render("article", {article: article, categories: categories});
            });
        }else{
            res.redirect("/");
        }
    }).catch(err => {
        res.redirect("/");
    });
})

app.get("/category/:slug", (req, res) => {
    const slug = req.params.slug;
    Category.findOne({
        where: { slug },
        include: [{ model: Article }]
    }).then(category => {
        if (category) {
            res.render("index", { articles: category.articles });
        } else {
            res.redirect("/");
        }
    }).catch(err => {
        res.redirect("/");
    });
});

app.listen(4000, () => {
    console.log("o servidor está rodando")
})