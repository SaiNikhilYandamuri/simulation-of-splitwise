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
            '{"fullname":"Yandamuri Sai Nikhil","email":"sainikhil@splitwise.com","currency":"GBP"}'
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
            email: "newuser1@splitwise.com",
            password: "password",
            fullname: "new user",
          })
          .then(function (res) {
            expect(res.text).to.equal(
              '{"fullname":"new user","email":"newuser1@splitwise.com"}'
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

      describe("Bills Test", function () {
        it("Get Bills of a Group", () => {
          agent
            .get("/getBillsOfGroup/lol")
            .then(function (res) {
              console.log(res.text);
              expect(res.text).to.equal(
                '[{"descirption":"Hello Worl","total_amount":500,"email":"nithya@splitwise.com"},{"descirption":"Rice","total_amount":500,"email":"sainikhil@splitwise.com"}]'
              );
            })
            .catch((error) => {
              console.log(error);
            });
        });
      });

      describe("Groups Test", function () {
        it("Get Groups of a User", () => {
          agent
            .get("/mygroups/sainikhil@splitwise.com")
            .then(function (res) {
              console.log(res.text);
              expect(res.text).to.equal(
                '["Bros","Family","Killer","Lasning","lol","Popular"]'
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
