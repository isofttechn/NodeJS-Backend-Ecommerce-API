const express = require("express");
const colors = require("colors");
const app = express();
const morgan = require("morgan");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const expressValidator = require("express-validator");
const cors = require("cors");

const connectDB = require("./db");
require("dotenv").config();

//IMPORT ROUTES
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");
const categoryRoutes = require("./routes/category");
const subcategoryRoutes = require("./routes/subcategory");
const productRoutes = require("./routes/product");
//CONNECT TO DATABASE
connectDB();

const port = process.env.PORT || 8000;
//MIDDLEWARES
app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(expressValidator());
app.use(cors());

//ROUTES MIDDLEWARE
app.use("/api", authRoutes);
app.use("/api", userRoutes);
app.use("/api", categoryRoutes);
app.use("/api", subcategoryRoutes);
app.use("/api", productRoutes);
// APP LISTEN
const server = app.listen(port, () => {
  console.log(`App listening on port ${port}`.yellow.bold);
});

//HANDLE UNHANDLED REJECTIONS
process.on("unhandledRejection", (err, promise) => {
  console.log(`Error: ${err.message}`.red.bold);
  //CLOSE APP AND EXIT PROCESS
  server.close(() => process.exit(1));
});
