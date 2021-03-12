const express = require("express");
const app = express();
const port = 4000;
const cors = require("cors");
const bodyParser = require("body-parser");
const mysql = require("mysql");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const bcrypt = require("bcrypt");
const saltRounds = 10;

app.use(
  cors({
    origin: ["http://localhost:3000"],
    methods: ["GET", "POST"],
    credentials: true,
  })
);

app.use(cookieParser());

app.use(bodyParser.json());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(
  session({
    key: "userid",
    secret: "compe273_lab1_splitwise",
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 60 * 60 * 24 * 1000,
    },
  })
);

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
    "INSERT INTO user (email, fullname, password) VALUES (?,?,?)";

  console.log(insertUserQuery);
  bcrypt.hash(password, saltRounds).then(function (hash) {
    con.query(insertUserQuery, [email, fullname, hash], (err, result) => {
      //console.log(err.code);
      if (err) {
        if (err.code === "ER_DUP_ENTRY") {
          console.log("User already present!!");
          res.status(409).json({ message: "User already exists!" });
        }
      } else {
        console.log("Inserted");

        res
          .status(200)
          .json({ fullname: req.body.fullname, email: req.body.email });
      }
    });
  });
});

app.get("/login", (req, res) => {
  if (req.session.user) {
    res.send({ loggedIn: true, user: req.session.user });
  } else {
    res.send({ loggedIn: false });
  }
});

app.post("/login", function (req, res) {
  //console.log(req.body);
  const email = req.body.email;
  const password = req.body.password;
  const selectLoginQuery =
    "Select fullname,password,email from user where email=?";

  console.log(selectLoginQuery);
  con.query(selectLoginQuery, [email], (err, result) => {
    if (err) throw err;
    if (result) {
      if (result.length) {
        console.log(result[0] + "Hello");

        bcrypt.compare(password, result[0].password).then(function (response) {
          res.cookie("cookie", "admin", {
            maxAge: 900000,
            httpOnly: false,
            path: "/",
          });
          req.session.user = result;
          console.log(req.session.user);
          res
            .status(200)
            .json({ fullname: result[0].fullname, email: result[0].email });

          res.end("Successful Login");
        });
        const user = { username: req.body.email, password: req.body.password };
        console.log("Inside login if");
        req.session.user = user;

        //console.log(res);
        //console.log(req.session);
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

app.get("/getMembersOfGroup/:groupName", function (req, res) {
  console.log(req.params.groupName);
  const groupName = req.params.groupName;
  const getMembersQuery =
    "select email from usergroup where group_name=? && inviteacceptance=1";
  console.log(getMembersQuery);
  const array = [];
  con.query(getMembersQuery, [groupName], (err, result) => {
    console.log(result);
    if (err) throw err;
    Object.keys(result).forEach(function (key) {
      const row = result[key];
      //const rowName = { groups_name: row.group_name };
      console.log(row);
      array.push(row);
    });
    console.log(array);
    res.status(200);
    res.send(array);
  });
});

app.post("/acceptInvite", function (req, res) {
  const email = req.body.emailId;
  const groupName = req.body.groupSelected;
  const acceptInviteQuery =
    "update usergroup SET inviteacceptance=1 where email=? && group_name=?";
  console.log(acceptInviteQuery + email + groupName);
  con.query(acceptInviteQuery, [email, groupName], (err, result) => {
    console.log(result);
    if (err) throw err;
    console.log(result);
    res.status(200).json({ message: "Successfully Updated" });
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
  console.log("Group Creation Done");
  const usergroupQueryCreator =
    "insert into usergroup(email,group_name,inviteacceptance) values(?,?,?)";
  con.query(usergroupQueryCreator, [email, groupName, 1], (err, result) => {
    if (err) throw err;
    console.log(result);
  });
  console.log("Usergroup info 1");
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

  console.log("Usergroup info 2");

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
