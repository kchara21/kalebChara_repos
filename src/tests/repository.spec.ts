import request from "supertest";
import app from "../index";

describe("GET /tribe", () => {
  test("respond with json containing an repositories array",async ()=>{
      const res = await request(app).get('/tribe/:id/repositories').send();
      expect(res.statusCode).toBe(200);
  })

//   test("Probando metodo inedx", () => {
//     const expected = "Hola Service";
//     const res = "Hola Service";

//     expect(res).toStrictEqual(expected);
//   });
});
