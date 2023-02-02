require("dotenv").config();
const express = require("express");
const path = require("path");
const db = require("./database");

const app = express();
app.use(express.json());
app.use(cors());

app.get("/reviews", db.getReviewsById);

app.get("/reviews/meta", db.getMeta);

app.post("/reviews", db.addReview);

app.put("/reviews/:review_id/report", db.reportReview);

app.put("/reviews/:review_id/helpful", db.findReviewHelpful);

app.listen(process.env.PORT);
console.log(`listening on port ${process.env.PORT}`);

module.exports = app;
