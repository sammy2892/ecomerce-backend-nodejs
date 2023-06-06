const request = require("supertest");
const app = require("../app");
const ProductImg = require("../models/ProductImg");
require("../models");

let token;
let productsId;

beforeAll(async () => {
  const credentials = {
    email: "testsammy@gmail.com",
    password: "sammy1234",
  };
  const res = await request(app).post("/users/login").send(credentials);
  token = res.body.token;
});

test("POST /products", async () => {
  const products = {
    title: "iPhone Pro Max 14",
    description: "iPhone Pro Max 14",
    brand: "Apple",
    price: "1000",
  };
  const res = await request(app)
    .post("/products")
    .send(products)
    .set("Authorization", `Bearer ${token}`);
  productsId = res.body.id;
  await products.destroy;
  expect(res.status).toBe(201);
  expect(res.body.id).toBeDefined();
});

test("GET /products", async () => {
  const res = await request(app)
    .get("/products")
    .set("Authorization", `Bearer ${token}`);
  expect(res.status).toBe(200);
  expect(res.body).toHaveLength(1);
});

test("PUT /produtcs/:id", async () => {
  const productUpdate = {
    title: "iPhone Pro Max 14",
  };
  const res = await request(app)
    .put(`/products/${productsId}`)
    .send(productUpdate)
    .set("Authorization", `Bearer ${token}`);
  expect(res.status).toBe(200);
  expect(res.body.title).toBe(productUpdate.title);
});

test("POST /products/:id/images should set the products images", async () => {
  const image = await ProductImg.create({
    url: "http://falseurl.com",
    publicId: "false id",
  });
  const res = await request(app)
    .post(`/products/${productsId}/images`)
    .send([image.id])
    .set("Authorization", `Bearer ${token}`);
  await image.destroy();
  expect(res.status).toBe(200);
  expect(res.body).toHaveLength(1);
});

test("DELETE /products/:id", async () => {
  const res = await request(app)
    .delete(`/products/${productsId}`)
    .set("Authorization", `Bearer ${token}`);
  expect(res.status).toBe(204);
});
