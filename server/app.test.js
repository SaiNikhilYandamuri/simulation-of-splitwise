const assert = require("chai").assert;
const index = require("./app");
const chai = require("chai");
chai.use(require("chai-http"));
const expect = require("chai").expect;
const agent = require("chai").request.agent(index);

describe("Splitwise", function () {
  describe("Login Test", function () {
    it("Incorrect Password", () => {
      agent
        .post("/login")
        .send({ email: "sainikhil@splitwise.com", password: "password" })
        .then(function (res) {
          expect(res.text).to.equal('{"message":"Invalid credentials!"}');
        })
        .catch((error) => {
          console.log(error);
        });
    });

    it("Incorrect User", () => {
      agent
        .post("/login")
        .send({ email: "customer@splitwise.com", password: "password" })
        .then(function (res) {
          expect(res.text).to.equal('{"message":"Invalid credentials!"}');
        })
        .catch((error) => {
          console.log(error);
        });
    });

    it("Successful Login", () => {
      agent
        .post("/login")
        .send({ email: "sainikhil@splitwise.com", password: "sainikhil" })
        .then(function (res) {
          expect(res.text).to.equal(
            '{"fullname":"Sai Nikhil","email":"sainikhil@splitwise.com","currency":"USD"}'
          );
        })
        .catch((error) => {
          console.log(error);
        });
    });

    describe("Signup Test", function () {
      it("User Already exists", () => {
        agent
          .post("/signup")
          .send({
            email: "sainikhil@splitwise.com",
            password: "password",
            fullname: "sainikhil",
          })
          .then(function (res) {
            expect(res.text).to.equal('{"message":"User already exists!"}');
          })
          .catch((error) => {
            console.log(error);
          });
      });

      it("Successful Signup", () => {
        agent
          .post("/signup")
          .send({
            email: "newuser@splitwise.com",
            password: "password",
            fullname: "new user",
          })
          .then(function (res) {
            expect(res.text).to.equal(
              '{"fullname":"new user","email":"newuser@splitwise.com"}'
            );
          })
          .catch((error) => {
            console.log(error);
          });
      });

      describe("Profile Test", function () {
        it("Customer Profile", () => {
          agent
            .get("/profile/madhavi@splitwise.com")
            .then(function (res) {
              console.log(res.text);
              expect(res.text).to.equal(
                '{"email":"madhavi@splitwise.com","fullname":"Madhavi","phonenumber":1234567890,"currency":"USD","timezone":"(GMT-08:00) Pacific Time","language":"English"}'
              );
            })
            .catch((error) => {
              console.log(error);
            });
        });
      });
    });
  });
});
