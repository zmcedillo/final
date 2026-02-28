function getProduct(req, res) {
    res.status(200).json({ name: "Tablet" });
  }
  describe("User Controller", () => {
    it("Debe devolver un usuario con estado 200", () => {
      const req = {};
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
  
      getProduct(req, res);
  
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ name: "Tablet" });
    });
  });