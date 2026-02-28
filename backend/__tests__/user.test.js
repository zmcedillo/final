function getUser(req, res) {
  res.status(200).json({ username: "Utest" });
}
describe("User Controller", () => {
  it("Debe devolver un usuario con estado 200", () => {
    const req = {};
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    getUser(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ username: "Utest" });
  });
});