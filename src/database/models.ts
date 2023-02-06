// const db = require("./index.js");
// const queryStrings = require("./queryStrings.js");
import db from "./index.js";
import queryStrings from "./queryStrings.js";
import { Pool, PoolClient, QueryArrayResult, QueryResult } from "pg";
import { Review } from "../server/validators.js";

export type getReviewsQueryParams = {
  product_id: number;
  count: number;
  sort: "newest" | "helpful" | "relevant";
  page: number;
};

type reviewSchema = {
  id: number;
  product_id: number;
  rating: number;
  reviewer_name: string;
  email: string;
  summary: string;
  body: string | null;
  response: string | null;
  created_at: number;
  reported: boolean;
  recommend: boolean;
  helpfulness: number;
};

type photoSchema = {
  id: number;
  url: string;
  review_id: number;
};

type getReviewsQueryResult = {
  count: number;
  page: number;
  product_id: number;
  results: reviewSchema &
    {
      photos: photoSchema[];
    }[];
};

type getMetaQueryResult = {
  product_id: number;
  characteristics: {
    [key: string]: number;
  };
  recommend: {
    true: number;
    false: number;
  };
  rating: {
    1: number;
    2: number;
    3: number;
    4: number;
    5: number;
  };
};

interface CharReviewsParams {
  char_id: number;
  char_value: number;
  review_id: number;
}

type modelsModule = {
  getReviewsByProductId: (
    review: getReviewsQueryParams
  ) => Promise<QueryResult<getReviewsQueryResult>>;
  getMetaByProductId: (
    product_id: number
  ) => Promise<QueryResult<getMetaQueryResult>>;
  insertReview: (
    client: PoolClient | null,
    review: Review
  ) => Promise<QueryResult<{ id: number }>>;
  insertPhoto: (
    client: PoolClient | null,
    url: string,
    review_id: number
  ) => Promise<QueryResult>;
  insertCharReviews: (
    client: PoolClient,
    { char_id, char_value, review_id }: CharReviewsParams
  ) => Promise<QueryResult>;
  reportReview: (review_id: number) => Promise<QueryResult>;
  incrementHelpful: (review_id: number) => Promise<QueryResult>;
};

const models: modelsModule = {
  getReviewsByProductId: ({ product_id, count, sort, page }) => {
    let offset = page * count - count;
    return db.query(queryStrings.getReviewsQuery(sort), [
      product_id,
      count,
      offset,
      page,
    ]);
  },

  getMetaByProductId: (product_id) => {
    return db.query(queryStrings.getMetaQuery, [product_id]);
  },

  insertReview: (client, review) => {
    let time = review.created_at;
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
      return db.query(queryStrings.insertReviewQuery, values);
    }
  },

  insertPhoto: (client, url, review_id) => {
    let values = [url, review_id];
    if (client) {
      return client.query(queryStrings.insertPhotoQuery, values);
    } else {
      return db.query(queryStrings.insertPhotoQuery, values);
    }
  },

  insertCharReviews: (client, { char_id, char_value, review_id }) => {
    let values = [char_id, char_value, review_id];
    if (client) {
      return client.query(queryStrings.insertCharReviewsQuery, values);
    } else {
      return db.query(queryStrings.insertCharReviewsQuery, values);
    }
  },

  reportReview: (review_id) => {
    return db.query(queryStrings.reportReviewQuery, [review_id]);
  },

  incrementHelpful: (review_id) => {
    return db.query(queryStrings.incrementHelpfulQuery, [review_id]);
  },
};
export default models;
