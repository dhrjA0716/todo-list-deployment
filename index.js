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



app.get("/", async function (req, res) {
    try {
        const foundItems = await Item.find({});
        res.render("list", { dayej: foundItems });
    } catch (err) {
        console.log(err);
        res.status(500).send("Something went wrong.");
    }
});

app.post("/", async function (req, res) {
    const ItemName = req.body.ele1;
    const todo4 = new Item({
        name: ItemName
    });
    try {
        await todo4.save();
        res.redirect("/");
    } catch (err) {
        console.log(err);
        res.status(500).send("Failed to save the item.");
    }
});

app.post("/delete", async function (req, res) {
    const checked = req.body.checkbox1;
    console.log("Checkbox value:", checked);

    if (!mongoose.Types.ObjectId.isValid(checked)) {
        console.log("Invalid ObjectId:", checked);
        return res.status(400).send("Invalid ID");
    }

    try {
        const result = await Item.findByIdAndDelete(checked);
        if (result) {
            console.log("Deleted successfully");
            res.redirect("/");
        } else {
            console.log("Item not found");
            res.status(404).send("Item not found");
        }
    } catch (err) {
        console.error("Failed to delete:", err);
        res.status(500).send("Failed to delete the record.");
    }
}); 
app.listen(3000, function () {
    console.log("Server is running");
});


// This code sets up a simple Express server with MongoDB integration for a to-do list application.
// It allows users to view, add, and delete tasks from the list.
