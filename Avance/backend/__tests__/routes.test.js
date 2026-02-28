const request = require("supertest");
const express = require("express");
const app = express();
app.use(express.json());
// Aquí defines tu ruta de login
app.post("/login", (req, res) => {
  const { username, password } = req.body;
  if (username === "Utest" && password === "Ptest") {
    return res.status(200).json({ message: "Login successful" });
  }
  res.status(401).json({ message: "Invalid credentials" });
});

// Test para la ruta de login
describe("POST /login", () => {
  it("Debe responder con 200 cuando las credenciales son correctas", async () => {
    const res = await request(app)
      .post("/login")
      .send({ username: "Utest", password: "Ptest" });

    expect(res.status).toBe(200);
    expect(res.body.message).toBe("Login successful");
  });

  it("Debe responder con 401 cuando las credenciales son incorrectas", async () => {
    const res = await request(app)
      .post("/login")
      .send({ username: "Utest", password: "wrongpassword" });

    expect(res.status).toBe(401);
    expect(res.body.message).toBe("Invalid credentials");
  });
});
