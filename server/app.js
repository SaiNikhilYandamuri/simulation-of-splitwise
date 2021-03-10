const express = require("express");
const app = express();
const port = 4000;
const cors = require("cors");
const bodyParser = require("body-parser");
const mysql = require("mysql");
const session = require("express-session");
const cookieParser = require("cookie-parser");

app.use(cors({ origin: "http://localhost:3000", credentials: true }));

app.use(
  session({
    secret: "compe273_lab1_splitwise",
    resave: false,
    saveUninitialized: false,
    duration: 60 * 60 * 1000,
    activeDuration: 5 * 60 * 1000,
  })
);

app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const con = mysql.createConnection({
  host: "splitwise-instance.cxfc1pmp6ndg.us-east-2.rds.amazonaws.com",
  user: "admin",
  password: "chakri96",
  ssl: true,
  database: "splitwise",
});

con.connect((err) => {
  if (err) {
    console.log(err);
  }
  console.log("Connected!");
  //con.end();
});

//Allow Access Control

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.post("/signup", function (req, res) {
  console.log(req.body);
  const fullname = req.body.fullname;
  const email = req.body.email;
  const password = req.body.password;
  const insertUserQuery =
    "INSERT INTO user (email, fullname, password) VALUES ('" +
    email +
    "', '" +
    fullname +
    "', '" +
    password +
    "')";

  console.log(insertUserQuery);

  con.query(insertUserQuery, (err, result) => {
    //console.log(err.code);
    if (err) {
      if (err.code === "ER_DUP_ENTRY") {
        console.log("User already present!!");
        res.status(409).json({ message: "User already exists!" });
      }
    } else {
      console.log("Inserted");
      /*res.cookie("cookie", "admin", {
        maxAge: 900000,
        httpOnly: false,
        path: "/",
      });*/
      const user = { username: req.body.email, password: req.body.password };
      req.session.user = user;
      res
        .status(200)
        .json({ fullname: req.body.fullname, email: req.body.email });

      //res.status(200).json({ message: "Inserted" });
    }
  });
});

app.post("/login", function (req, res) {
  //console.log(req.body);
  const email = req.body.email;
  const password = req.body.password;
  const selectLoginQuery =
    "Select * from user where email='" +
    email +
    "' and password='" +
    password +
    "'";
  console.log(selectLoginQuery);
  con.query(selectLoginQuery, (err, result) => {
    if (err) throw err;
    if (result) {
      if (result.length) {
        /*res.cookie("cookie", "admin", {
          maxAge: 900000,
          httpOnly: false,
          path: "/",
        });*/
        const user = { username: req.body.email, password: req.body.password };
        console.log("Inside login if");
        req.session.user = user;
        res
          .status(200)
          .json({ fullname: result[0].fullname, email: result[0].email });

        res.end("Successful Login");
        //console.log(res);
        console.log(req.session);
      } else if (result.length === 0) {
        res.status(404).json({ message: "Invalid credentials!" });
      }

      console.log(result);
    }
  });
});

app.get("/mygroups/:email", function (req, res) {
  console.log(req.params.email);
  const useremail = req.params.email;
  const getGroupQuery =
    "select * from usergroup where email='" +
    useremail +
    "' and inviteacceptance=1";
  const array = [];
  con.query(getGroupQuery, (err, result) => {
    if (err) throw err;
    Object.keys(result).forEach(function (key) {
      const row = result[key];
      //const rowName = { groups_name: row.group_name };
      console.log(row.group_name);
      array.push(row.group_name);
    });
    res.status(200);
    res.send(array);
  });
});

app.get("/invitegroups/:email", function (req, res) {
  console.log(req.params.email);
  const useremail = req.params.email;
  const getGroupQuery =
    "select * from usergroup where email='" +
    useremail +
    "' and inviteacceptance=0";
  console.log(getGroupQuery);
  const array = [];
  con.query(getGroupQuery, (err, result) => {
    if (err) throw err;
    Object.keys(result).forEach(function (key) {
      const row = result[key];
      //const rowName = { groups_name: row.group_name };
      console.log(row.group_name);
      array.push(row.group_name);
    });
    res.status(200);
    res.send(array);
  });
});

app.get("/getBillsOfGroup/:groupName", function (req, res) {
  console.log(req.params.groupName);
  const groupName = req.params.groupName;
  const getBillsQuery =
    "select descirption,total_amount,email from bill where group_name='" +
    groupName +
    "'";
  console.log(getBillsQuery);
  const array = [];
  con.query(getBillsQuery, (err, result) => {
    console.log(result);
    if (err) throw err;
    Object.keys(result).forEach(function (key) {
      const row = result[key];
      //const rowName = { groups_name: row.group_name };
      console.log(row);
      array.push(row);
    });
    res.status(200);
    res.send(array);
  });
});

app.post("/creategroup", function (req, res) {
  const groupName = req.body.groupName;
  const form = req.body.form;
  const email = req.body.email;
  console.log("Hello");
  console.log(form);

  const insertGroup =
    "insert into groupinfo(group_name, group_pic) values(?,?)";
  con.query(insertGroup, [groupName, "picture"], (err, result) => {
    if (err) throw err;
    console.log(result);
  });
  const usergroupQueryCreator =
    "insert into usergroup(email,group_name,inviteacceptance) values(?,?,?)";
  con.query(usergroupQueryCreator, [email, groupName, 1], (err, result) => {
    if (err) throw err;
    console.log(result);
  });

  form.forEach((ele) => {
    const emailOfUser = ele.Email;
    console.log(emailOfUser);

    const usergroupQuery =
      "insert into usergroup(email,group_name,inviteacceptance) values(?,?,?)";
    con.query(usergroupQuery, [emailOfUser, groupName, 0], (err, result) => {
      if (err) throw err;
      console.log(result);
    });
  });

  res.status(200);
  res.end("Successful");

  console.log("Successful");
});

app.post("/addBill", function (req, res) {
  const groupName = req.body.group;
  const email = req.body.email;
  const amount = req.body.amount;
  const description = req.body.description;
  const insertBill =
    "insert into bill(group_name, total_amount, descirption, email) values(?,?,?,?)";

  console.log(insertBill);
  con.query(
    insertBill,
    [groupName, amount, description, email],
    (err, result) => {
      if (err) throw err;
      console.log(result);
      res.status(200);
      res.send("Hello World");
    }
  );
});

app.listen(port, () => {
  console.log("Server connected to port 4000");
});
