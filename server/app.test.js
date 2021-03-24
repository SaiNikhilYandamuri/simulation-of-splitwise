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
            '{"fullname":"Yandamuri Sai Nikhil","email":"sainikhil@splitwise.com","currency":"USD"}'
          );
        })
        .catch((error) => {
          console.log(error);
        });
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
          email: "newuser2@splitwise.com",
          password: "password",
          fullname: "new user",
        })
        .then(function (res) {
          expect(res.text).to.equal(
            '{"fullname":"new user","email":"newuser2@splitwise.com"}'
          );
        })
        .catch((error) => {
          console.log(error);
        });
    });
  });

  describe("Profile Test", function () {
    it("Customer Profile", () => {
      agent
        .get("/profile/madhavi@splitwise.com")
        .then(function (res) {
          expect(res.text).to.equal(
            '{"email":"madhavi@splitwise.com","fullname":"Madhavi","phonenumber":1234567890,"currency":"USD","timezone":"(GMT-08:00) Pacific Time","language":"English","image":"default.jpg"}'
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
          // console.log(res.text);
          expect(res.text).to.equal(
            '[{"descirption":"Yep","total_amount":400,"email":"nithya@splitwise.com"},{"descirption":"Hello Worl","total_amount":500,"email":"nithya@splitwise.com"},{"descirption":"Rice","total_amount":500,"email":"sainikhil@splitwise.com"}]'
          );
        })
        .catch((error) => {
          console.log(error);
        });
    });

    it("Get Bills of a Group", () => {
      agent
        .get("/getBillsOfGroup/Family")
        .then(function (res) {
          // console.log(res.text);
          expect(res.text).to.equal(
            '[{"descirption":"sadasdas","total_amount":500,"email":"sainikhil@splitwise.com"},{"descirption":"Popekd","total_amount":500,"email":"sainikhil@splitwise.com"},{"descirption":"Hello World","total_amount":400,"email":"chakri@splitwise.com"},{"descirption":"Ticket","total_amount":500,"email":"sainikhil@splitwise.com"},{"descirption":"LOL","total_amount":500,"email":"sainikhil@splitwise.com"},{"descirption":"Yelp","total_amount":500,"email":"sainikhil@splitwise.com"},{"descirption":"Bill","total_amount":500,"email":"sainikhil@splitwise.com"},{"descirption":"Danesh","total_amount":400,"email":"sainikhil@splitwise.com"}]'
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
          // console.log(res.text);
          expect(res.text).to.equal(
            '["33 South","Bros","Family","Farewell party","Football","Killer","Lasning","lol","Popular"]'
          );
        })
        .catch((error) => {
          console.log(error);
        });
    });

    it("Get Groups of a User", () => {
      agent
        .get("/mygroups/chakri@splitwise.com")
        .then(function (res) {
          // console.log(res.text);
          expect(res.text).to.equal(
            '["asjdkasdkaks","Bros","Family","Hello1234","Killer","Lasning","Popular","werp"]'
          );
        })
        .catch((error) => {
          console.log(error);
        });
    });
  });
});
