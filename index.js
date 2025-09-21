const express = require('express');
const mongoose = require('mongoose');
require("dotenv").config();


const app = express();

const uri = process.env.MONGO_URI;

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch(err => console.error("❌ MongoDB connection error:", err));

// Middleware & View Engine
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

const port = process.env.PORT 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

// Mongoose schema & model
const trySchema = new mongoose.Schema({
  name: String,
});
const Item = mongoose.model('task', trySchema);

// Routes
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
// Start server
app.listen(3000, function () {
  console.log("Server is running");
});

