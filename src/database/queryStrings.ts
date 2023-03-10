import { getReviewsQueryParams } from "./models.js";

type queryStringsModule = {
  sortQueries: {
    helpful: string;
    newest: string;
    relevant: string;
  };
  getReviewsQuery: (sortMethod: getReviewsQueryParams["sort"]) => string;
  getMetaQuery: string;
  insertReviewQuery: string;
  insertPhotoQuery: string;
  insertCharReviewsQuery: string;
  incrementHelpfulQuery: string;
  reportReviewQuery: string;
};

const queryStrings: queryStringsModule = {
  sortQueries: {
    helpful: `helpfulness DESC`,
    newest: "created_at DESC",
    relevant: `helpfulness DESC, created_at DESC`,
  },
  // function to allow string interpolation for ORDER BY clause
  getReviewsQuery: function (sortMethod) {
    return `
    SELECT
      COUNT(results)::int,
      $4::int as page,
      $1::int as product_id,
      JSON_AGG(results) as results
    FROM
      (
        SELECT
          r.id,
          r.product_id,
          r.rating,
          r.reviewer_name AS name,
          r.email,
          r.summary,
          r.body,
          r.response,
          TO_TIMESTAMP(r.created_at/1000) AS date,
          r.reported,
          r.recommend,
          r.helpfulness,
          COALESCE(JSON_AGG(
            JSON_BUILD_OBJECT('id', p.id, 'url', p.url)) FILTER (WHERE p.id IS NOT NULL), '[]')
          as photos
        FROM
          reviews r
        LEFT JOIN
          photos p
        ON
          r.id = p.review_id
        WHERE
          r.product_id = $1
        GROUP BY
          r.id
        ORDER BY
          ${this.sortQueries[sortMethod]}
        LIMIT
          $2
        OFFSET
          $3
      ) results
  `;
  },
  getMetaQuery: `
  WITH
    ratings_table AS
      (
        SELECT
          rating,
          COUNT(rating) AS ratings_count
        FROM
          reviews r
        WHERE
          r.product_id = $1
        GROUP BY
          rating
      ),
    recommend_table AS
      (
        SELECT
          recommend,
          COUNT(recommend) AS recommend_count
        FROM
          reviews
        WHERE
          product_id = $1
        GROUP BY
        recommend
      ),
    characteristics_average_table AS
      (
        SELECT
          c.characteristic,
          char_id,
          avg(cr.char_value)
        FROM
          characteristics c
        INNER JOIN
          characteristic_reviews cr
        ON
          cr.char_id = c.id
        WHERE
          c.product_id = $1
        GROUP BY
          char_id,
          c.characteristic
      )
  SELECT
    $1 AS product_id,
    COALESCE(
      (
        SELECT
          JSON_OBJECT_AGG(
            characteristics_average_table.characteristic,
            JSON_BUILD_OBJECT('id', characteristics_average_table.char_id, 'value', characteristics_average_table.avg)
          )
        FROM
          characteristics_average_table),
        '{}'
      ) AS characteristics,
    JSON_BUILD_OBJECT(
      'true', COALESCE((SELECT recommend_count FROM recommend_table WHERE recommend = true), 0),
      'false', COALESCE((SELECT recommend_count FROM recommend_table WHERE recommend = false), 0)) AS recommend,
    JSON_BUILD_OBJECT(
      '1', COALESCE((SELECT ratings_count FROM ratings_table WHERE rating = 1), 0),
      '2', COALESCE((SELECT ratings_count FROM ratings_table WHERE rating = 2), 0),
      '3', COALESCE((SELECT ratings_count FROM ratings_table WHERE rating = 3), 0),
      '4', COALESCE((SELECT ratings_count FROM ratings_table WHERE rating = 4), 0),
      '5', COALESCE((SELECT ratings_count FROM ratings_table WHERE rating = 5), 0)
  ) AS rating;`,
  insertReviewQuery: `
  INSERT INTO
    reviews (
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
      helpfulness
    )
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
  RETURNING id`,
  insertPhotoQuery: `
  INSERT INTO
    photos (
      url,
      review_id
    )
  VALUES ($1, $2)`,
  insertCharReviewsQuery: `
  INSERT INTO
    characteristic_reviews (
      char_id,
      char_value,
      review_id
    )
  VALUES ($1, $2, $3)`,
  incrementHelpfulQuery: `
  UPDATE reviews
    SET helpfulness = helpfulness + 1
  WHERE
    id = $1;`,
  reportReviewQuery: `
  UPDATE reviews
    SET reported = true
  WHERE
    id = $1;`,
};

export default queryStrings;
