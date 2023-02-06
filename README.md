## Ratings & Reviews Microservice

<div align="center" width="100%">
  <img src="https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB" />
  <img src="https://img.shields.io/badge/postgres-%23316192.svg?style=for-the-badge&logo=postgresql&logoColor=white" />
</div>

### Motivation

This is the API of a microservice for an e-commerce clothing and accessories website.  The routes and shape of responses were already expected by the front-end so I was tasked with molding an API and SQL database queries to fit.

There is virtually no processing aside from opt-in server-side validation in this repository.  All read queries are within a few milliseconds and write queries (transactions) in tens of milliseconds, accessing a database with tens of millions of records.  Query responses are assembled entirely through PostgreSQL.

#### API

##### /reviews

Query Params:
- `product_id: Number` (required)
- `count: Number` (default 5)
- `page: Number` (default 1)
- `sort: "newest" | "helpful" | "relevant"` (default "newest")

`.get(".../reviews?product_id=4&sort=helpful")`

```
{
  "count": 3,
  "page": 1,
  "product_id": 4,
  "results": [
      {
          "id": 10,
          "product_id": 4,
          "rating": 2,
          "name": "bigbrother",
          "email": "first.last@gmail.com",
          "summary": "These pants are ok!",
          "body": "A little tight on the waist.",
          "response": null,
          "date": "2020-06-23T22:45:54-07:00",
          "reported": false,
          "recommend": false,
          "helpfulness": 3,
          "photos": [
              {
                  "id": 8,
                  "url": "https://images.unsplash.com/photo-1560829675-11dec1d78930?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1652&q=80"
              },
              {
                  "id": 7,
                  "url": "https://images.unsplash.com/photo-1549812474-c3cbd9a42eb9?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=668&q=80"
              },
              {
                  "id": 9,
                  "url": "https://images.unsplash.com/photo-1559709319-3ae960cda614?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=668&q=80"
              }
          ]
      },
      {
          "id": 8,
          "product_id": 4,
          "rating": 4,
          "name": "shopaddict",
          "email": "first.last@gmail.com",
          "summary": "These pants are fine",
          "body": "I do like these pants",
          "response": null,
          "date": "2020-09-07T12:12:19-07:00",
          "reported": false,
          "recommend": true,
          "helpfulness": 2,
          "photos": []
      },
      {
          "id": 9,
          "product_id": 4,
          "rating": 5,
          "name": "figuringitout",
          "email": "first.last@gmail.com",
          "summary": "These pants are great!",
          "body": "I really like these pants. Best fit ever!",
          "response": null,
          "date": "2020-12-30T02:57:31-08:00",
          "reported": false,
          "recommend": true,
          "helpfulness": 2,
          "photos": [
              {
                  "id": 4,
                  "url": "https://images.unsplash.com/photo-1542574621-e088a4464f7e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=3028&q=80"
              },
              {
                  "id": 5,
                  "url": "https://images.unsplash.com/photo-1560294559-1774a164fb0a?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1650&q=80"
              },
              {
                  "id": 6,
                  "url": "https://images.unsplash.com/photo-1555689502-c4b22d76c56f?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=668&q=80"
              }
          ]
      }
  ]
}
```

##### reviews/meta

Query Params:
- `product_id: Number` (required)

`.get(".../reviews/meta?product_id=4")`

```{
  "product_id": 4,
  "characteristics": {
      "Quality": {
          "id": 13,
          "value": 3.6666666666666665
      },
      "Fit": {
          "id": 10,
          "value": 3.6666666666666665
      },
      "Comfort": {
          "id": 12,
          "value": 3.6666666666666665
      },
      "Length": {
          "id": 11,
          "value": 3.6666666666666665
      }
  },
  "recommend": {
      "true": 2,
      "false": 1
  },
  "rating": {
      "1": 0,
      "2": 1,
      "3": 0,
      "4": 1,
      "5": 1
  }
}
```
