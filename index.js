const { MongoClient } = require("mongodb");
const express = require("express");
const app = express();

const uri =
  "mongodb+srv://root:root123@mycluster.flhjk.mongodb.net/?retryWrites=true&w=majority&appName=MyCluster";
let db = null;

async function main() {
  const client = new MongoClient(uri);
  try {
    await client.connect();
    db = client.db("massage-system");
    console.log("資料庫連線成功");
  } catch (err) {
    console.log(連線失敗, err);
  }
}

// 網站伺服器基礎設定
app.set("view engine", "ejs");
app.set("views", "./views");
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

//get負責載入頁面時，把資料庫的資料渲染出來
app.get("/", async (req, res) => {
  try {
    const collection = db.collection("msg");
    const result = await collection.find({}).toArray();
    res.render("index.ejs", { data: result });
  } catch (err) {
    console.error("加載數據失敗", err);
    res.status(500).send("服務器錯誤");
  }
});

// 按下按鈕後，將新資料傳送至資料庫，並渲染出來
app.post("/", async (req, res) => {
  const collection = db.collection("msg");
  const { name, msg } = req.body;
  try {
    if (name && msg) {
      await collection.insertOne({
        name,
        msg,
      });
    }

    const result = await collection.find({}).toArray();
    res.render("index.ejs", { data: result });
  } catch (err) {
    console.log("留言失敗", err);
    res.status(500).send("服務器錯誤");
  }
});

main().then(() => {
  app.listen(3000, function () {
    console.log("Server Started");
  });
});
