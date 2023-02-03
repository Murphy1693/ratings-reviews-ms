require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const controllers = require("./controllers.js");

const app = express();
app.use(express.json());
app.use(cors());

app.get("/reviews", controllers.getReviews);

app.get("/reviews/meta", controllers.getMeta);

app.post("/reviews", controllers.postReview);

app.put("/reviews/:review_id/report", controllers.reportReview);

app.put("/reviews/:review_id/helpful", controllers.findReviewHelpful);

app.listen(process.env.PORT);
console.log(`listening on port ${process.env.PORT}`);

module.exports = app;
