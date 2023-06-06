const request = require("supertest");
const app = require("../app");

let cateogryId;
let token;

beforeAll(async () => {
  const credentials = {
    email: "testsammy@gmail.com",
    password: "sammy1234",
  };
  const res = await request(app).post("/users/login").send(credentials);
  token = res.body.token;
});

test("POST /categories", async () => {
  const category = {
    name: "Cellphones",
  };
  const res = await request(app)
    .post("/categories")
    .send(category)
    .set("Authorization", `Bearer ${token}`);
  cateogryId = res.body.id;
  expect(res.status).toBe(201);
  expect(res.body.id).toBeDefined();
});

test("GET /categories", async () => {
  const res = await request(app)
    .get("/categories")
    .set("Authorization", `Bearer ${token}`);
  expect(res.status).toBe(200);
  expect(res.body).toHaveLength(1);
});

test("PUT /categories/:id", async () => {
  const categoryUpdate = {
    name: "Cellphones-Update",
  };
  const res = await request(app)
    .put(`/categories/${cateogryId}`)
    .send(categoryUpdate)
    .set("Authorization", `Bearer ${token}`);
  expect(res.status).toBe(200);
  expect(res.body.name).toBe(categoryUpdate.name);
});

test("DELETE /categories/:id", async () => {
  const res = await request(app)
    .delete(`/categories/${cateogryId}`)
    .set("Authorization", `Bearer ${token}`);
  expect(res.status).toBe(204);
});
