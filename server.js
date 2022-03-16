require("dotenv").config();
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const fileUpload = require("express-fileupload");

const app = express();
//Handling cors
app.use(cors());
app.options("*", cors());
//Handling json data from body
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//Urls
const userRouter = require("./routes/users");
const productRouter = require("./routes/product");
const cartRouter = require("./routes/carts");

const uriString = process.env.MONGO_URL_STRING;

mongoose.connect(
  uriString,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  () => {}
);

mongoose.connection
  .on("error", (err) => {
    console.log("Error: ", err);
  })
  .on("connected", (err, res) => {
    console.log("Mongodb connected!");
  });

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(
  fileUpload({
    createParentPath: true,
  })
);

app.use("/api/users", userRouter);
app.use("/api/products", productRouter);
app.use("/api/carts", cartRouter);

app.listen(8000);

module.exports = app;
