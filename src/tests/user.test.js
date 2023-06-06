const request = require("supertest");
const app = require("../app");

let userId;
let token;

test("POST /users", async () => {
  const user = {
    firstName: "Sammy",
    lastName: "Rosa",
    email: "sammy@gmail.com",
    password: "sammy1234",
    phone: "8097787744",
  };
  const res = await request(app).post("/users").send(user);
  userId = res.body.id;
  expect(res.status).toBe(201);
  expect(res.body.id).toBeDefined();
});

test("POST /users/loggin", async () => {
  const credentials = {
    email: "sammy@gmail.com",
    password: "sammy1234",
  };
  const res = await request(app).post("/users/login").send(credentials);
  token = res.body.token;
  expect(res.status).toBe(200);
  expect(res.body.token).toBeDefined();
});

test("POST /users/login with invalid credentials should trwo an error", async () => {
  const credentials = {
    email: "sammy@gmail.com",
    password: "bad-password",
  };
  const res = await request(app).post("/users/login").send(credentials);
  expect(res.status).toBe(401);
});

test("GET /users", async () => {
  const res = await request(app)
    .get("/users")
    .set("Authorization", `Bearer ${token}`);
  expect(res.status).toBe(200);
  expect(res.body).toHaveLength(2);
});

test("PUT /users/id ", async () => {
  const userUpdated = {
    firstName: "Sammy Update",
  };
  const res = await request(app)
    .put(`/users/${userId}`)
    .send(userUpdated)
    .set("Authorization", `Bearer ${token}`);
  expect(res.status).toBe(200);
  expect(res.body.firstName).toBe(userUpdated.firstName);
});

test("DELETE /users/:id", async () => {
  const res = await request(app)
    .delete(`/users/${userId}`)
    .set("Authorization", `Bearer ${token}`);
  expect(res.status).toBe(204);
});
