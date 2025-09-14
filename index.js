const express = require('express');
const bodyParser = require('body-parser');
var app = express();

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// Use array instead of MongoDB
let todos = [
    { id: 1, name: "Create a video" },
    { id: 2, name: "Learn DSA" },
    { id: 3, name: "Learn React" },
    { id: 4, name: "Take some rest" }
];
let nextId = 5;

// Routes
app.get("/", function (req, res) {
    res.render("list", { dayej: todos });
});

app.post("/", function (req, res) {
    const itemName = req.body.ele1;
    if (itemName && itemName.trim() !== "") {
        todos.push({ id: nextId++, name: itemName });
    }
    res.redirect("/");
});

app.post("/delete", function (req, res) {
    const checked = parseInt(req.body.checkbox1);
    todos = todos.filter(item => item.id !== checked);
    res.redirect("/");
});

app.listen(3000, function () {
    console.log("Server is running");
});
