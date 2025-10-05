const express = require('express');
const mongoose = require('mongoose');
require("dotenv").config();

const app = express();

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log(" MongoDB connected"))
  .catch(err => console.error(" MongoDB connection error:", err));

// Middleware & View Engine
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// Mongoose schema & model
const trySchema = new mongoose.Schema({
  name: String,
});
const Item = mongoose.model('task', trySchema);

// Routes

// Display Items - 
app.get("/", async (req, res) => {
  try {
    const foundItems = await Item.find({});
    res.render("list", { dayej: foundItems });
  } catch (err) {
    console.log(err);
    res.status(500).send("Something went wrong.");
  }
});



app.post("/", async (req, res) => {
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

// Add Items

app.post("/delete", async (req, res) => {
  const checked = req.body.checkbox1;
  if (!mongoose.Types.ObjectId.isValid(checked)) {
    return res.status(400).send("Invalid ID");
  }

  try {
    await Item.findByIdAndDelete(checked);
    res.redirect("/");
  } catch (err) {
    console.error("Failed to delete:", err);
    res.status(500).send("Failed to delete the record.");
  }
});

// Update Item -
app.put("/", async (req, res) => {
  const id = req.body.id;
  const updatedName = req.body.ele1;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send("Invalid ID");
  }

  try {
    await Item.findByIdAndUpdate(id, { name: updatedName });
    res.redirect("/");
  } catch (err) {
    console.log(err);
    res.status(500).send("Failed to update the item.");
  }
});

// Delete Item -

app.delete("/", async (req, res) => {
  const id = req.body.id;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send("Invalid ID");
  }

  try {
    await Item.findByIdAndDelete(id);
    res.redirect("/");
  } catch (err) {
    console.error("Failed to delete:", err);
    res.status(500).send("Failed to delete the record.");
  }
});

// Start server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
