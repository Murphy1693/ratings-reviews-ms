import { Request, Response, NextFunction, request } from "express";
import controllers from "./controllers.js";

export interface GetReviewsQuery extends Request {
  query: {
    product_id: string;
    count: string;
    sort: "newest" | "relevant" | "helpful";
    page: string;
  };
}

export interface GetMetaQuery extends Request {
  query: {
    product_id: string;
  };
}

interface Characteristics {
  char_id: number;
  char_value: number;
  review_id: number;
}

export interface Review {
  product_id: number;
  rating: number;
  name: string;
  email: string;
  summary: string;
  body: string | null;
  response: string | null;
  reported: boolean;
  recommend: boolean;
  helpfulness: number;
  created_at: number;
  photos: string[];
  characteristics: Characteristics[];
}

export interface PostReviewBody extends Request {
  body: Review;
}

export interface UpdateReview extends Request {
  params: {
    review_id: string;
  };
}

const validators = {
  getReviews: (req: Request, res: Response, next: NextFunction) => {
    if (
      typeof req.query.product_id !== "string" ||
      Number.isNaN(parseInt(req.query.product_id))
    ) {
      res.status(500).end();
      return;
    }
    if (
      typeof req.query.count !== "string" ||
      Number.isNaN(parseInt(req.query.count))
    ) {
      req.query.count = "5";
    }
    if (
      typeof req.query.sort !== "string" ||
      !["newest", "relevant", "helpful"].includes(req.query.sort)
    ) {
      req.query.sort = "newest";
    }
    if (
      typeof req.query.page !== "string" ||
      Number.isNaN(parseInt(req.query.page))
    ) {
      req.query.page = "1";
    }
    controllers.getReviews(req as GetReviewsQuery, res);
  },

  getMeta: (req: Request, res: Response, next: NextFunction) => {
    if (
      typeof req.query.product_id !== "string" ||
      Number.isNaN(parseInt(req.query.product_id))
    ) {
      res.status(500).end();
      return;
    }
    controllers.getMeta(req as GetMetaQuery, res);
  },

  postReview: (req: Request, res: Response, next: NextFunction) => {
    if (typeof req.body.product_id !== "number") {
      res.status(500).end();
      return;
    }
    if (typeof req.body.rating !== "number") {
      res.status(500).end();
      return;
    }
    if (typeof req.body.name !== "string") {
      res.status(500).end();
      return;
    }
    if (typeof req.body.email !== "string") {
      res.status(500).end();
      return;
    }
    if (typeof req.body.summary !== "string") {
      req.body.summary = null;
    }
    if (typeof req.body.body !== "string") {
      res.status(500).end();
      return;
    }
    if (typeof req.body.response !== "string") {
      req.body.response = null;
    }
    if (typeof req.body.reported !== "boolean") {
      req.body.reported = false;
    }
    if (typeof req.body.recommend !== "boolean") {
      req.body.recommend = false;
    }
    if (typeof req.body.helpfulness !== "number") {
      req.body.helpfulness = 0;
    }
    if (typeof req.body.created_at !== "number") {
      let x = new Date();
      req.body.created_at = x.getTime();
    }
    if (req.body.photos === undefined) {
      req.body.photos = [];
    }
    if (!Array.isArray(req.body.photos)) {
      res.status(500).end();
      return;
    } else if (req.body.photos.length) {
      for (let i = 0; i < req.body.photos.length; i++) {
        if (typeof req.body.photos[i] !== "string") {
          res.status(500).end();
          return;
        }
      }
    }
    if (!Array.isArray(req.body.characteristics)) {
      res.status(500).end();
      return;
    } else if (req.body.characteristics.length) {
      for (let i = 0; i < req.body.characteristics.length; i++) {
        if (
          typeof req.body.characteristics[i].char_id !== "number" ||
          typeof req.body.characteristics[i].char_value !== "number"
        ) {
          res.status(500).end();
          return;
        }
        for (const k in req.body.characteristics[i]) {
          if (typeof req.body.characteristics[i][k] !== "number") {
            res.status(500).end();
            return;
          }
        }
      }
    }

    controllers.postReview(req as PostReviewBody, res);
  },

  reportReview: (req: Request, res: Response, next: NextFunction) => {
    if (Number.isNaN(parseInt(req.params.review_id))) {
      res.status(500).end();
      return;
    }
    controllers.reportReview(req as UpdateReview, res);
  },

  findReviewHelpful: (req: Request, res: Response, next: NextFunction) => {
    if (Number.isNaN(parseInt(req.params.review_id))) {
      res.status(500).end();
      return;
    }
    controllers.findReviewHelpful(req as UpdateReview, res);
  },
};

export default validators;
