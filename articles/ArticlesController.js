const express = require("express");
const router = express.Router();
const Category = require("../categories/Category");
const Article = require("./Articles");
const slugify = require("slugify");
const { where } = require("sequelize");

router.get("/admin/articles", (req, res) => {
    Article.findAll({
        include: [Category]
    }).then(articles => {
        res.render("admin/articles/index", { articles });
    }).catch(err => {
        console.error("Erro ao buscar artigos:", err);
        res.redirect("/");
    });
});

router.get("/admin/articles/new", (req, res) => {
    Category.findAll().then(categories => {
        res.render("admin/articles/new", { categories });
    }).catch(err => {
        console.error("Erro ao carregar categorias:", err);
        res.redirect("/admin/articles");
    });
});

router.post("/articles/save", (req, res) => {
    const { title, body, category } = req.body;

    console.log("Dados recebidos:", title, body, category); // depuração

    if (title && body && category) {
        Article.create({
            title: title,
            slug: slugify(title),
            body: body,
            categoryId: category
        }).then(() => {
            res.redirect("/admin/articles");
        }).catch(err => {
            console.error("Erro ao salvar artigo:", err);
            res.redirect("/admin/articles/new");
        });
    } else {
        res.redirect("/admin/articles/new");
    }
});

router.post("/articles/delete", (req,res) => {
    var id = req.body.id;

    if (id != undefined && !isNaN(id)) {
        Article.destroy({
            where: {id: id}
        }).then(() => {
            console.log("Artigo deletado, ID:", id);
            res.redirect("/admin/articles");
        }).catch(err => {
            console.error("Erro ao deletar artigo:", err);
            res.redirect("/admin/articles");
        });
    } else {
        res.redirect("/admin/articles")
    }
});




// EDITAR
router.get("/admin/articles/edit/:id", (req, res) => {
    const id = req.params.id;

    Article.findByPk(id).then(article => {
        if (article) {
            Category.findAll().then(categories => {
                res.render("admin/articles/edit", {
                    article: article,
                    categories: categories
                });
            });
        } else {
            res.redirect("/admin/articles");
        }
    }).catch(err => {
        console.error("Erro ao carregar artigo:", err);
        res.redirect("/admin/articles");
    });
});

router.post("/articles/update", (req, res) => {
    const { id, title, body, category } = req.body;

    Article.update({
        title: title,
        slug: slugify(title),
        body: body,
        categoryId: category
    }, {
        where: { id: id }
    }).then(() => {
        res.redirect("/admin/articles");
    }).catch(err => {
        console.error("Erro ao atualizar artigo:", err);
        res.redirect("/admin/articles");
    });
});







module.exports = router;