const router = require('express').Router();
const Todo = require('../models/Todo');


router.get("/", async (req, res) => {
    const allTodo = await Todo.find();
    res.render("index", {todo: allTodo});
});

router.get("/register", async (req, res) => {
    const allTodo = await Todo.find();
    res.render("register", {todo: allTodo});
});
router.get("/cors", async (req, res) => {
    res.render("cors");
});

router.get("/protected", async (req, res) => {
    if (req.session.userid) {
    const allTodo = await Todo.find();
    res.render("bloc", {todo: allTodo});
    }else{
        res.redirect('/')
    }
});

router.get("/logout", async (req, res) => {
    req.session.destroy();
   res.redirect('/')
});

module.exports = router;

