const request = require("supertest");
const app = require("../app");
const Product = require("../models/Product");
require("../models");

let cartId;
let token;

beforeAll(async () => {
  const credentials = {
    email: "testsammy@gmail.com",
    password: "sammy1234",
  };
  const res = await request(app).post("/users/login").send(credentials);
  token = res.body.token;
});

test("POST /cart", async () => {
  const product = await Product.create({
    title: "test title",
    brand: "test brand",
    description: "test description",
    price: 1000,
  });
  const cart = {
    productId: product.id,
    quantity: 2,
  };
  const res = await request(app)
    .post("/cart")
    .send(cart)
    .set("Authorization", `Bearer ${token}`);
  await product.destroy();
  cartId = res.body.id;
  expect(res.status).toBe(201);
  expect(res.body.id).toBeDefined();
});

test("GET /cart", async () => {
  const res = await request(app)
    .get("/cart")
    .set("Authorization", `Bearer ${token}`);
  expect(res.status).toBe(200);
  expect(res.body).toHaveLength(1);
});

test("PUT /cart", async () => {
  const cartUpdated = {
    quantity: 4,
  };
  const res = await request(app)
    .put(`/cart/${cartId}`)
    .send(cartUpdated)
    .set("Authorization", `Bearer ${token}`);
  expect(res.status).toBe(200);
  expect(res.body.quantity).toBe(cartUpdated.quantity);
});

test("DELETE /cart/:id", async () => {
  const res = await request(app)
    .delete(`/cart/${cartId}`)
    .set("Authorization", `Bearer ${token}`);
  expect(res.status).toBe(204);
});
