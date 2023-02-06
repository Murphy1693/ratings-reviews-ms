// const models = require("../database/models.js");
// const pool = require("../database");
import models, { getReviewsQueryParams } from "../database/models.js";
import db from "../database/index.js";
import { Request, Response, NextFunction } from "express";
import {
  GetMetaQuery,
  GetReviewsQuery,
  PostReviewBody,
  UpdateReview,
} from "./validators.js";

const controllers = {
  getReviews: (req: GetReviewsQuery, res: Response) => {
    console.log(req.query.product_id);
    models
      .getReviewsByProductId({
        product_id: parseInt(req.query.product_id),
        count: parseInt(req.query.count),
        sort: req.query.sort,
        page: parseInt(req.query.page),
      })
      .then((queryResult) => {
        res.status(200).send(queryResult.rows[0]);
      })
      .catch((err) => {
        console.log(err);
        res.status(500).send();
      });
  },

  getMeta: (req: GetMetaQuery, res: Response) => {
    console.log(req.query.product_id);
    models
      .getMetaByProductId(parseInt(req.query.product_id))
      .then((queryResult) => {
        res.status(200).send(queryResult.rows[0]);
      })
      .catch((err) => {
        console.log(err);
        res.status(500).end();
      });
  },

  postReview: async (req: PostReviewBody, res: Response) => {
    const client = await db.connect();
    try {
      await client.query("BEGIN");
      let queryResult = await models.insertReview(client, req.body);
      let review_id = queryResult.rows[0].id;
      await Promise.all([
        Promise.all(
          req.body.photos.map((url) => {
            return models.insertPhoto(client, url, review_id);
          })
        ),
        Promise.all(
          req.body.characteristics.map((charsObj) => {
            return models.insertCharReviews(client, {
              char_id: charsObj.char_id,
              char_value: charsObj.char_value,
              review_id,
            });
          })
        ),
      ]);
      await client.query("COMMIT");
      res.status(201);
    } catch (err) {
      console.log("fail", err);
      res.status(500);
      await client.query("ROLLBACK");
    } finally {
      client.release();
      res.send();
      return;
    }
  },

  reportReview: (req: UpdateReview, res: Response) => {
    models
      .reportReview(parseInt(req.params.review_id))
      .then(() => {
        console.log(req.params);
        res.status(204).end();
      })
      .catch((err) => {
        console.log(err);
        res.status(400).end();
      });
  },

  findReviewHelpful: (req: UpdateReview, res: Response) => {
    models
      .incrementHelpful(parseInt(req.params.review_id))
      .then(() => {
        res.status(204).end();
      })
      .catch((err) => {
        console.log(err);
        res.status(400).end();
      });
  },
};

export default controllers;
