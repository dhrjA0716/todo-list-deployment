const express = require('express');
const bodyParser = require('body-parser');
var app = express();
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/todo');
const trySchema = new mongoose.Schema({
    name: String,
});
const Item = mongoose.model('task', trySchema);
const todo = new Item({
    name: "Create a video"
});
const todo2 = new Item({
    name: "Learn DSA"
});
const todo3 = new Item({
    name: "Learn React"
});
const todo4 = new Item({
    name: "Take some rest"
});
// todo2.save();
// todo3.save();
// todo4.save();0


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