const express = require("express");
const categories_router = require("./Routes/category-routes").router;

// init app and middleware
const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(categories_router);

// app listens
app.listen(3000, () => {
  console.log("App is running on port 3000.");
});
