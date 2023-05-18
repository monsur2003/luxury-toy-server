const express = require("express");
const cors = require("cors");
// const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 5000;

app.get("/", (req, res) => {
   res.send("teddyBear server is running");
});
app.listen(port, () => {
   console.log(`server listening on port ${port}`);
});
