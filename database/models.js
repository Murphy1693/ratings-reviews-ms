const pool = require("./index.js");
const queryStrings = require("./queryStrings.js");

module.exports = {
  getReviewsByProductId: ({
    product_id,
    count = 5,
    sort = "newest",
    page = 1,
    offset = page * count - count,
  }) => {
    return pool.query(queryStrings.getReviewsQuery(sort), [
      product_id,
      count,
      offset,
      page,
    ]);
  },
  getMetaByProductId: (product_id) => {
    return pool.query(queryStrings.getMetaQuery, [product_id]);
  },
  insertReview: (client, review) => {
    let x = new Date();
    let time = review.created_at || x.getTime();
    let reported = review.reported || false;
    let recommend = review.recommend || false;
    let helpfulness = review.helpfulness || 0;
    let values = [
      review.product_id,
      review.rating,
      review.name,
      review.email,
      review.summary,
      review.body,
      review.response,
      time,
      reported,
      recommend,
      helpfulness,
    ];
    if (client) {
      return client.query(queryStrings.insertReviewQuery, values);
    } else {
      return pool.query(queryStrings.insertReviewQuery, values);
    }
  },
  insertPhoto: (client, url, review_id) => {
    let values = [url, review_id];
    if (client) {
      return client.query(queryStrings.insertPhotoQuery, values);
    } else {
      return pool.query(queryStrings.insertPhotoQuery, values);
    }
  },
  insertCharReviews: (client, { char_id, char_value, review_id }) => {
    let values = [char_id, char_value, review_id];
    if (client) {
      return client.query(queryStrings.insertCharReviewsQuery, values);
    } else {
      return pool.query(queryStrings.insertCharReviewsQuery, values);
    }
  },
  reportReview: (review_id) => {
    return pool.query(queryStrings.reportReviewQuery, [review_id]);
  },
  incrementHelpful: (review_id) => {
    return pool.query(queryStrings.incrementHelpfulQuery, [review_id]);
  },
};
