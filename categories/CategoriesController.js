const express = require("express");
const router = express.Router();
const Category = require("./Category");
const slugify = require("slugify");

router.get("/admin/categories/new",(req, res) => {
    res.render("admin/categories/new");
});

router.post("/categories/save", (req,res) => {
    const title = req.body.title;
    console.log("Título recebido:", title);

    if (title != undefined && title.trim() !== "") {
        Category.create({
            title: title,
            slug: slugify(title)
        }).then(Category => {
            console.log("Categoria salva:", Category);
            res.redirect("/admin/categories");
        }).catch(err => {
            console.error("Erro ao salvar categoria:", err);
            res.redirect("/admin/categories/new")
        });
    } else {
        res.redirect("/admin/categories/new")
    }
});

router.get("/admin/categories", (req, res) => {
    Category.findAll().then(categories => {
        console.log("Categorias encontradas:", categories);
        res.render("admin/categories/index", {categories});
    }).catch(err => {
        console.error("Erro ao buscar categorias", err);
        res.redirect("/")
    });
});

router.post("/categories/delete", (req, res) => {
    const id = req.body.id;

    if (id != undefined && !isNaN(id) && title.trim() !== "") {
        Category.destroy({
            where: { id: id }
        }).then(() => {
            console.log("Categoria deletada, ID:", id);
            res.redirect("/admin/categories");
        }).catch(err => {
            console.error("Erro ao deletar categoria:", err);
            res.redirect("/admin/categories");
        });
    } else {
        res.redirect("/admin/categories");
    }
});

router.post("/categories/update", (req, res) => {
    const id = req.body.id;
    const title = req.body.title;

    if (id != undefined && !isNaN(id)) {
        Category.update({
            title: title,
            slug: slugify(title)}, {
                where: { id: id }
            }).then(() => {
            console.log("Categoria atualizada. ID:", id);
            res.redirect("/admin/categories");
        }).catch(err => {
            console.error("Erro ao atualizar categoria:", err);
            res.redirect("/admin/categories");
        });
    } else {
        res.redirect("/admin/categories");
    }
});



router.get("/admin/categories/edit/:id", (req, res) => {
    const id = req.params.id;

    if (!isNaN(id)) {
        Category.findAll({
            where: { id: id }
        }).then(categories => {
            if (categories.length > 0) {
                const category = categories[0];
                res.render("admin/categories/edit", {category});
            } else {
                res.redirect("/admin/categories");
            }}).catch(err => {
                console.error("Erro ao buscar categoria para edição:", err);
                res.redirect("/admin/categories");
            });
    } else {
        res.redirect("/admin/categories");
    }
});


module.exports = router;