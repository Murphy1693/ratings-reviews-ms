import * as dotenv from "dotenv";
dotenv.config({ path: ".env" });
import express from "express";
import cors from "cors";
import controllers from "./controllers.js";
import validators from "./validators.js";

const app = express();
app.use(express.json());
app.use(cors());

app.get("/reviews", validators.getReviews);
app.post("/reviews", validators.postReview);

app.get("/reviews/meta", validators.getMeta);

app.put("/reviews/:review_id/report", validators.reportReview);
app.put("/reviews/:review_id/helpful", validators.findReviewHelpful);

app.listen(process.env.PORT);
console.log(`listening on port ${process.env.PORT}`);

// module.exports = app;
