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
    return pool.query(queryStrings.getReviewsQuery, [
      product_id,
      count,
      offset,
      queryStrings.sortQueries[sort],
      page,
    ]);
  },
  getMetaByProductId: (product_id) => {
    return pool.query(queryStrings.getMetaQuery, [product_id]);
  },
  insertReview: (
    client,
    {
      product_id,
      rating,
      name: reviewer_name,
      email,
      summary,
      body,
      response,
      created_at,
      reported = false,
      recommend = false,
      helpfulness = 0,
    }
  ) => {
    let x = new Date();
    created_at = created_at || x.getTime();
    let values = [
      product_id,
      rating,
      reviewer_name,
      email,
      summary,
      body,
      response,
      created_at,
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
  reportReview: (product_id) => {
    return pool.query(queryStrings.reportReviewQuery, [product_id]);
  },
  incrementHelpful: (product_id) => {
    return pool.query(queryStrings.incrementHelpfulQuery, [product_id]);
  },
};
