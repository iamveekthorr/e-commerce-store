<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://coveralls.io/github/nestjs/nest?branch=master" target="_blank"><img src="https://coveralls.io/repos/github/nestjs/nest/badge.svg?branch=master#9" alt="Coverage" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

This E-commerce API is designed for stores to have online presence and for online shopping. The platform allows users to browse products, add items to their cart, and proceed to checkout. It includes user authentication, role-based access control (e.g., RETAIL_ADMIN,SUPER_ADMIN and USER).

The application is built using modern web technologies, including, mongodb(mongoose) for data storage

Features

User Authentication: Secure user sign-up, login, and profile management using JWT.
Role-based Access Control: RETAIL_ADMIN can manage products in their respective store(s), while users can browse and purchase products.
Product Management: RETAIL_ADMIN can create, update, delete, and view products.
Shopping Cart: Users can add products to their cart and proceed to checkout.
Order Management: Users can view their order history, and admins can manage orders.

Routes Overview

User Authentication:
POST /auth/create-account: craete a new user.
POST /auth/login: User login and JWT generation.

Product routes:

POST /products: Add a new product to the store.
PATCH /products/:productId: Update a product's details.
DELETE /products/:productId: Delete a product.
GET /products/:productId: Get a product.
GET /products: View all products.
GET /products/my/:storeId: Allows a retail_admin view products in their store.

Cart routes:

POST /carts: Add product to cart.
GET /carts: View cart items.
DELETE /carts/:productId: Remove item from the cart.
POST /carts/checkout: Place an order.
PATCH /carts/ : update product quantity in cart.

Order routes:

GET /orders: View all orders.
GET /orders/:orderId: View order details.
PATCH /orders/:orderId/status: Update order status

Store routes:

GET /stores: View all stores.
GET /stores/my: View my store(RETAIL_ADMIN).
PATCH /stores/: Update my store
DELETE /stores/:storeId: Delete a store.

User routes:

GET /users: View all users.
GET /users/profile/me: View my profile.
GET /users/:id: Get a user.



[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Installation

```bash
$ yarn install
```

## Running the app

```bash
# development
$ yarn run start

# watch mode
$ yarn run start:dev

# production mode
$ yarn run start:prod
```

## Test

```bash
# unit tests
$ yarn run test

# e2e tests
$ yarn run test:e2e

# test coverage
$ yarn run test:cov
```

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://kamilmysliwiec.com)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](LICENSE).
