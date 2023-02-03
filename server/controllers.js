const models = require("../database/models.js");
const pool = require("../database");

module.exports = {
  getReviews: (req, res) => {
    models
      .getReviewsByProductId(req.query)
      .then((queryResult) => {
        res.status(200).send(queryResult.rows[0].data);
      })
      .catch((err) => {
        console.log(err);
        res.status(500).send();
      });
  },

  getMeta: (req, res) => {
    models
      .getMetaByProductId(req.query.product_id)
      .then((queryResult) => {
        res.status(200).send(queryResult.rows[0].data);
      })
      .catch((err) => {
        console.log(err);
        res.status(500).end();
      });
  },

  postReview: async (req, res) => {
    const client = await pool.connect();
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

  reportReview: (req, res) => {
    models
      .reportReview(req.params.review_id)
      .then(() => {
        console.log(req.params);
        res.status(204).end();
      })
      .catch((err) => {
        console.log(err);
        res.status(400).end();
      });
  },

  findReviewHelpful: function (req, res) {
    models
      .incrementHelpful(req.params.review_id)
      .then(() => {
        res.status(204).end();
      })
      .catch((err) => {
        console.log(err);
        res.status(400).end();
      });
  },
};
