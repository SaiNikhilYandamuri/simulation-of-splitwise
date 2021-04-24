const assert = require("chai").assert;
const index = require("./index");
const chai = require("chai");
chai.use(require("chai-http"));
const expect = require("chai").expect;
const agent = require("chai").request.agent(index);

describe("Splitwise", function () {
  describe("Login Test", function () {
    it("Incorrect Password", () => {
      agent
        .post("/api/user/login")
        .send({ email: "nikhil@splitwise.com", password: "password" })
        .then(function (res) {
          expect(res.text).to.equal("Enter Valid Credentials!");
        })
        .catch((error) => {
          console.log(error);
        });
    });

    it("Incorrect User", () => {
      agent
        .post("/api/user/login")
        .send({ email: "customer@splitwise.com", password: "password" })
        .then(function (res) {
          expect(res.text).to.equal("Enter Valid Credentials!");
        })
        .catch((error) => {
          console.log(error);
        });
    });

    it("Successful Login", () => {
      agent
        .post("/api/user/login")
        .send({ email: "nikhil@splitwise.com", password: "nikhil" })
        .then(function (res) {
          expect(res.text).to.include('{"token"');
        })
        .catch((error) => {
          console.log(error);
        });
    });
  });

  describe("Signup Test", function () {
    it("User Already exists", () => {
      agent
        .post("/api/user/signup")
        .send({
          email: "nikhil@splitwise.com",
          password: "nikhil",
          fullname: "sainikhil",
        })
        .then(function (res) {
          expect(res.text).to.equal("Email already exists");
        })
        .catch((error) => {
          console.log(error);
        });
    });

    it("Successful Signup", () => {
      agent
        .post("/api/user/signup")
        .send({
          email: "newuser3@splitwise.com",
          password: "password",
          fullname: "new user",
        })
        .then(function (res) {
          expect(res.text).to.include('{"token"');
        })
        .catch((error) => {
          console.log(error);
        });
    });
  });

  describe("Profile Test", function () {
    it("Customer Profile", () => {
      agent
        .get("/api/user/profile/nikhil@splitwise.com")
        .set({
          Authorization: `jwt eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MDgzMjhhOTg5YjY3MDRmMmMxN2IxY2UiLCJmdWxsbmFtZSI6Im5ldyB1c2VyIiwiZW1haWwiOiJuZXd1c2VyMkBzcGxpdHdpc2UuY29tIiwiaWF0IjoxNjE5MjA4MzYzLCJleHAiOjE2MjAyMDgzNjN9.rv_CX6oAuTOgFChccJrc5IrqmdZz4e08alTXWJikK4c`,
        })
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
        .get("/api/user/getBillsOfGroup/Team Event")
        .then(function (res) {
          // console.log(res.text);
          expect(res.text).to.equal("Unauthorized");
        })
        .catch((error) => {
          console.log(error);
        });
    });

    it("Get Bills of a Group", () => {
      agent
        .get("/api/user/getBillsOfGroup/Team Event")
        .set({
          Authorization: `jwt eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MDgzMjhhOTg5YjY3MDRmMmMxN2IxY2UiLCJmdWxsbmFtZSI6Im5ldyB1c2VyIiwiZW1haWwiOiJuZXd1c2VyMkBzcGxpdHdpc2UuY29tIiwiaWF0IjoxNjE5MjA4MzYzLCJleHAiOjE2MjAyMDgzNjN9.rv_CX6oAuTOgFChccJrc5IrqmdZz4e08alTXWJikK4c`,
        })
        .then(function (res) {
          // console.log(res.text);
          expect(res.text).to.equal(
            '[{"descirption":"Event10","total_amount":64,"email":"Eddie Taylor","timestamp":"2021-04-23T18:32:37.683Z","id":"608312c57971e6d2ca8e17e8"},{"descirption":"Event","total_amount":120,"email":"Eddie Taylor","timestamp":"2021-04-23T18:32:24.219Z","id":"608312b87971e6d2ca8e17df"},{"descirption":"Event8","total_amount":100,"email":"Eddie Taylor","timestamp":"2021-04-23T18:32:16.119Z","id":"608312b07971e6d2ca8e17d6"},{"descirption":"Event7","total_amount":28,"email":"Eddie Taylor","timestamp":"2021-04-23T18:32:02.698Z","id":"608312a27971e6d2ca8e17cd"},{"descirption":"Event6","total_amount":48,"email":"Eddie Taylor","timestamp":"2021-04-23T18:31:53.198Z","id":"608312997971e6d2ca8e17c4"},{"descirption":"Event5","total_amount":8,"email":"Eddie Taylor","timestamp":"2021-04-23T18:31:43.490Z","id":"6083128f7971e6d2ca8e17bb"},{"descirption":"Event4","total_amount":12,"email":"Eddie Taylor","timestamp":"2021-04-23T18:31:32.968Z","id":"608312847971e6d2ca8e17b2"},{"descirption":"Event3","total_amount":40,"email":"Eddie Taylor","timestamp":"2021-04-23T18:31:24.190Z","id":"6083127c7971e6d2ca8e17a9"},{"descirption":"Event2","total_amount":36,"email":"Eddie Taylor","timestamp":"2021-04-23T18:31:10.964Z","id":"6083126e7971e6d2ca8e17a0"},{"descirption":"Event1","total_amount":20,"email":"Eddie Taylor","timestamp":"2021-04-23T18:31:02.984Z","id":"608312667971e6d2ca8e1797"}]'
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
        .get("/api/user/invitegroups/nikhil@splitwise.com")
        .then(function (res) {
          // console.log(res.text);
          expect(res.text).to.equal("Unauthorized");
        })
        .catch((error) => {
          console.log(error);
        });
    });

    it("Get Groups of a User", () => {
      agent
        .get("/api/user/invitegroups/newuser2@splitwise.com")
        .set({
          Authorization: `jwt eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MDgzMjhhOTg5YjY3MDRmMmMxN2IxY2UiLCJmdWxsbmFtZSI6Im5ldyB1c2VyIiwiZW1haWwiOiJuZXd1c2VyMkBzcGxpdHdpc2UuY29tIiwiaWF0IjoxNjE5MjA4MzYzLCJleHAiOjE2MjAyMDgzNjN9.rv_CX6oAuTOgFChccJrc5IrqmdZz4e08alTXWJikK4c`,
        })
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
