const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const app = express();
const port = process.env.PORT || 3000;

const dotEnv = require("dotenv");
dotEnv.config();
// 连接到 MongoDB 数据库

mongoose.connect(process.env.DATABASE, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  // useCreateIndex: true,
});

mongoose.connection.on("connected", () => {
  console.log("Connected to MongoDB");
});

// 当连接出错时的回调函数
mongoose.connection.on("error", (err) => {
  console.error("MongoDB connection error:", err);
});

// 定义产品模型
const Product = mongoose.model("Product", {
  category: String,
  id: String,
  image: String,
  is_enabled: Number,
  origin_price: String,
  price: String,
  title: String,
  unit: String,
});

app.use(bodyParser.json());

// 获取所有产品
app.get("/products", async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).send(err);
  }
});

// 获取单个产品
app.get("/products/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const product = await Product.findOne({ id: id });
    if (product) {
      res.json(product);
    } else {
      res.status(404).send("Product not found");
    }
  } catch (err) {
    res.status(500).send(err);
  }
});

// 创建新产品
app.post("/products", async (req, res) => {
  try {
    const product = new Product(req.body);
    await product.save();
    res.status(201).send("Product added");
  } catch (err) {
    res.status(500).send(err);
  }
});

// 更新产品
app.put("/products/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const updatedProduct = req.body;
    await Product.findOneAndUpdate({ id: id }, updatedProduct);
    res.send("Product updated");
  } catch (err) {
    res.status(500).send(err);
  }
});

// 删除产品
app.delete("/products/:id", async (req, res) => {
  try {
    const id = req.params.id;
    await Product.findOneAndDelete({ id: id });
    res.send("Product deleted");
  } catch (err) {
    res.status(500).send(err);
  }
});

// 启动服务器
app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
