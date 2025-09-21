 const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// Database connection
mongoose.connect('mongodb://localhost:27017/todo');

// Mongoose schema & model
const trySchema = new mongoose.Schema({
  name: String,
});

const Item = mongoose.model('task', trySchema);

// Sample items (not saved by default)
// const todo = new Item({ name: "Create a video" });
// const todo2 = new Item({ name: "Learn DSA" });
// const todo3 = new Item({ name: "Learn React" });
// const todo4 = new Item({ name: "Take some rest" });
// todo2.save(); todo3.save(); todo4.save();


// GET /
app.get("/", async function (req, res) {
  try {
    const foundItems = await Item.find({});
    res.render("list", { dayej: foundItems });
  } catch (err) {
    console.log(err);
    res.status(500).send("Something went wrong.");
  }
});

// POST /
app.post("/", async function (req, res) {
  const ItemName = req.body.ele1;
  const newItem = new Item({ name: ItemName });

  try {
    await newItem.save();
    res.redirect("/");
  } catch (err) {
    console.log(err);
    res.status(500).send("Failed to save the item.");
  }
});

// POST /delete
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

// Start serve
app.listen(3000, function () {
  console.log("Server is running");
});

