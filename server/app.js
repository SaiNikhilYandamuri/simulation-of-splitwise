const express = require("express");
const app = express();
const port = 4000;
const cors = require("cors");
const bodyParser = require("body-parser");
const mysql = require("mysql");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const bcrypt = require("bcrypt");
const fs = require("fs");
const { promisify } = require("util");
const pipeline = promisify(require("stream").pipeline);
const multer = require("multer");
const { graphqlHTTP } = require("express-graphql");
const schema = require("./schema/schema");
// const { pipeline } = require("stream");

const upload = multer();

const saltRounds = 10;

app.use(express.static(__dirname + "/public"));

app.use(
  cors({
    origin: ["http://localhost:3000"],
    methods: ["GET", "POST"],
    credentials: true,
  })
);

app.use(
  "/graphql",
  graphqlHTTP({
    schema,
    graphiql: true,
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
  host: "splitwise.cxfc1pmp6ndg.us-east-2.rds.amazonaws.com",
  user: "admin",
  password: "password123",
  ssl: true,
  database: "splitwise",
});

// const con = mysql.createPool({
//   connectionLimit: 10,
//   host: "splitwise.cxfc1pmp6ndg.us-east-2.rds.amazonaws.com",
//   user: "admin",
//   password: "password123",
//   ssl: true,
//   database: "splitwise",
// });

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

  // console.l(insertUserQuery);
  bcrypt.hash(password, saltRounds).then(function (hash) {
    con.query(insertUserQuery, [email, fullname, hash], (err, result) => {
      //console.log(err.code);
      if (err) {
        if (err.code === "ER_DUP_ENTRY") {
          // console.l("User already present!!");
          res.status(409).json({ message: "User already exists!" });
        }
      } else {
        // console.l("Inserted");
        res.cookie("cookie", "admin", {
          maxAge: 9000000,
          httpOnly: false,
          path: "/",
        });
        req.session.user = result;
        // console.l(req.session.user);
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
  // console.l(email);
  // console.l(password);
  const selectLoginQuery =
    "Select fullname,password,email,currency from user where email=?";

  // console.l(selectLoginQuery);
  con.query(selectLoginQuery, [email], (err, result) => {
    if (err) {
      throw err;
    } else {
      if (result.length > 0) {
        bcrypt
          .compare(password, result[0].password)
          .then(function (response) {
            // console.l(password);
            if (response) {
              res.cookie("cookie", "admin", {
                maxAge: 9000000,
                httpOnly: false,
                path: "/",
              });
              req.session.user = result;
              // console.l(req.session.user);
              res.status(200).json({
                fullname: result[0].fullname,
                email: result[0].email,
                currency: result[0].currency,
              });

              res.end("Successful Login");
            } else {
              res.status(404).json({ message: "Invalid credentials!" });
            }
          })
          .catch((response) => {
            res.status(404).json({ message: "Invalid credentials!" });
          });
      } else {
        res.status(404).json({ message: "Invalid credentials!" });
      }
    }
  });
});

app.get("/mygroups/:email", function (req, res) {
  // console.l(req.params.email);
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
      // console.l(row.group_name);
      array.push(row.group_name);
    });
    res.status(200);
    res.send(array);
  });
});

app.get("/invitegroups/:email", function (req, res) {
  // console.l(req.params.email);
  const useremail = req.params.email;
  const getGroupQuery =
    "select * from usergroup where email='" +
    useremail +
    "' and inviteacceptance=0";
  // console.l(getGroupQuery);
  const array = [];
  con.query(getGroupQuery, (err, result) => {
    if (err) throw err;
    Object.keys(result).forEach(function (key) {
      const row = result[key];
      //const rowName = { groups_name: row.group_name };
      // console.l(row.group_name);
      array.push(row.group_name);
    });
    res.status(200);
    res.send(array);
  });
});

app.get("/getBillsOfGroup/:groupName", function (req, res) {
  // console.l(req.params.groupName);
  const groupName = req.params.groupName;
  const getBillsQuery =
    "select descirption,total_amount,email from bill where group_name=? order by date desc";
  // console.l(getBillsQuery);
  const array = [];
  con.query(getBillsQuery, [groupName], (err, result) => {
    // console.l(result);
    if (err) throw err;
    Object.keys(result).forEach(function (key) {
      const row = result[key];
      //const rowName = { groups_name: row.group_name };
      // console.l(row);
      array.push(row);
    });
    res.status(200);
    res.send(array);
  });
});

app.post("/leaveGroup", function (req, res) {
  // console.l(req.body);
  const groupName = req.body.groupName;
  const email = req.body.email;
  const leaveGroupQuery =
    "update usergroup set inviteacceptance=-1 where email=? and group_name=?";
  con.query(leaveGroupQuery, [email, groupName], (err, result) => {
    if (err) throw err;
    // console.l(result);
    res.status(200).json({ message: "Left group" });
  });
});

app.get("/getMembersOfGroup/:groupName", function (req, res) {
  //// console.l(req.body);
  const params = req.params.groupName.split("&");
  //// console.l(params);
  const groupName = params[0];
  const email = params[1];
  const getMemberQueryFromTransaction =
    "select user_1, user_2, final_amount from splitwise.transaction where group_name=? and (user_1 = ? or user_2 = ?)";
  // console.l(groupName + email);
  //const getMembersQuery =
  //"select email from usergroup where group_name=? && inviteacceptance=1";
  //// console.l(getMembersQuery);
  const array = [];
  con.query(
    getMemberQueryFromTransaction,
    [groupName, email, email],
    (err, result) => {
      // console.l(result);
      if (err) throw err;
      Object.keys(result).forEach(function (key) {
        const row = result[key];
        //const rowName = { groups_name: row.group_name };
        // console.l(row);
        array.push(row);
      });
      // console.l(array);
      res.status(200);
      res.send(array);
    }
  );
});

app.post("/acceptInvite", function (req, res) {
  const email = req.body.emailId;
  const groupName = req.body.groupName;
  const acceptInviteQuery =
    "update usergroup SET inviteacceptance=1 where email=? && group_name=?";
  // console.l(acceptInviteQuery + email + groupName);
  con.query(acceptInviteQuery, [email, groupName], (err, result) => {
    // console.l(result);
    if (err) throw err;
    // console.l(result);
    res.status(200).json({ message: "Successfully Updated" });
  });
});

app.get("/users/:email", function (req, res) {
  const array = [];
  // console.l(req.params.email);
  con.query(
    "select email,fullname from user where email != ?",
    [req.params.email],
    (err, result) => {
      if (err) throw err;
      // console.l(result);
      for (let i = 0; i < result.length; i++) {
        array.push(result[i]);
      }
      // console.l(array);
      res.status(200).json({ users: array });
      //res.send(array);
    }
  );
});

app.post("/creategroup", function (req, res) {
  const groupName = req.body.groupName;
  const form = req.body.value;
  const email = req.body.email;
  // console.l("Hello");
  // console.l(form);
  let executeValue = true;
  const insertGroup =
    "insert into groupinfo(group_name, group_pic) values(?,?)";
  con.query(insertGroup, [groupName, "picture"], (err, result) => {
    if (err) {
      if (err.code === "ER_DUP_ENTRY") {
        // console.l("User already present!!");
        res.status(409).json({ message: "Group already exists!" });
      }
    } else {
      // console.l(result);
      const usergroupQueryCreator =
        "insert into usergroup(email,group_name,inviteacceptance) values(?,?,?)";
      con.query(usergroupQueryCreator, [email, groupName, 1], (err, result) => {
        if (err) throw err;
        // console.l(result);
      });
      // console.l("Usergroup info 1");
      form.forEach((ele) => {
        const emailOfUser = ele.label;
        // console.l(emailOfUser);

        const usergroupQuery =
          "insert into usergroup(email,group_name,inviteacceptance) values(?,?,?)";
        con.query(
          usergroupQuery,
          [emailOfUser, groupName, 0],
          (err, result) => {
            if (err) throw err;
            // console.l(result);
          }
        );
      });

      form.push({ value: "hello", label: email });
      for (let i = 0; i < form.length; i++) {
        for (let j = i + 1; j < form.length; j++) {
          const updateTransactionTable =
            "insert into transaction(user_1,user_2,final_amount,group_name) values(?,?,?,?)";
          con.query(
            updateTransactionTable,
            [form[i].label, form[j].label, 0, groupName],
            (err, result) => {
              if (err) throw err;
              // console.l(result);
              res.status(200);
              res.end("Successful");
            }
          );
        }
      }
    }
  });
  // console.l("Group Creation Done");
  if (executeValue) {
  }

  // console.l("Usergroup info 2");

  // console.l("Successful");
});

app.post("/addBill", function (req, res) {
  // console.l(req.body.group);
  const groupName = req.body.group;
  const email = req.body.email;
  const amount = req.body.amount;
  const description = req.body.description;

  const insertBill =
    "insert into bill(group_name, total_amount, descirption, email) values(?,?,?,?)";

  // console.l(insertBill);
  con.query(
    insertBill,
    [groupName, amount, description, email],
    (err, result) => {
      if (err) throw err;
      // console.l(result);
    }
  );
  // console.l("Done with bill");

  const getMembersQuery =
    "select email from usergroup where group_name=? && inviteacceptance=1 && email!=?";
  // console.l(getMembersQuery);
  const array = [];
  con.query(getMembersQuery, [groupName, email], (err, result) => {
    // console.l(result);
    if (err) throw err;
    Object.keys(result).forEach(function (key) {
      const row = result[key];
      //const rowName = { groups_name: row.group_name };
      // console.l(row);
      array.push(row);
    });
    // console.l("Hello" + array);
    array.forEach((ele) => {
      // console.l("Hellosadhasdhsah" + ele);

      const getAmount =
        "select final_amount, user_1, user_2 from transaction where group_name=? and user_1 in (?, ?) and user_2 in (?, ?)";
      con.query(
        getAmount,
        [groupName, email, ele.email, ele.email, email],
        (err, result) => {
          if (err) throw err;
          // console.l(result);
          let amountDB = result[0].final_amount;
          if (result[0].user_1 === email) {
            amountDB = amountDB + amount / (array.length + 1);
          } else {
            amountDB = amountDB - amount / (array.length + 1);
          }
          const updateTransactionQuery =
            "update transaction set final_amount=? where group_name=? and user_1 in (?, ?) and user_2 in (?, ?)";
          con.query(
            updateTransactionQuery,
            [amountDB, groupName, email, ele.email, ele.email, email],
            (err, result) => {
              if (err) throw err;
              // console.l(result);
              amountDB = 0;
            }
          );
        }
      );
    });
    res.status(200);
    res.send("Hello World");
  });
});

app.get("/totalAmount/:email", function (req, res) {
  const email = req.params.email;
  // console.l(email);
  const getAmountQuery =
    "select user_1,user_2,final_amount,group_name from transaction where user_1=? or user_2=?";
  con.query(getAmountQuery, [email, email], (err, result) => {
    if (err) throw err;
    // console.l(result[0]);
    res.status(200);
    res.send(result);
  });
});

app.post("/settleUp", function (req, res) {
  // console.l(req.body);
  const email = req.body.email;
  const friend = req.body.friendSelected;

  const updateTransactionQuery =
    "update transaction set final_amount=0 where user_1 in (?, ?) and user_2 in (?, ?)";
  // console.l(updateTransactionQuery);
  con.query(
    updateTransactionQuery,
    [email, friend, friend, email],
    (err, result) => {
      if (err) throw err;
      // console.l(result);
    }
  );
  res.status(200).json({ message: "Successful" });
});

app.get("/profile/:email", function (req, res) {
  const email = req.params.email;
  const profileQuery =
    "select email, fullname, phonenumber, currency, timezone, language, photopath from user where email=?";
  con.query(profileQuery, [email], (err, result) => {
    if (err) throw err;
    res.status(200).json({
      email: result[0].email,
      fullname: result[0].fullname,
      phonenumber: result[0].phonenumber,
      currency: result[0].currency,
      timezone: result[0].timezone,
      language: result[0].language,
      image: result[0].photopath,
    });
  });
});

app.post(
  "/uploadPicture/:email",
  upload.single("file"),
  async function (req, res) {
    // console.l(req.params.email);
    const {
      file,
      body: { name },
    } = req;
    // console.l(file.detectedFileExtension);
    Math.floor(Math.random * 1000);
    const fileName = Math.floor(Math.random(100000) * 100000) + ".jpg";
    await pipeline(
      file.stream,
      fs.createWriteStream(`${__dirname}/public/${fileName}`)
    );

    // console.l(fileName);

    con.query(
      "update user set photopath=? where email=?",
      [fileName, req.params.email],
      (err, result) => {
        if (err != null || err != undefined) {
          res.status(400).json({ error: "failed to upload image" });
        } else {
          res.status(200).json({ message: "success", imagepath: fileName });
        }
      }
    );
  }
);

app.post("/updateProfile", function (req, res) {
  // console.l("In profile update");
  const emailId = req.body.emailId;
  const emailUpdate = req.body.emailUpdate;
  const fullnameUpdate = req.body.fullnameUpdate;
  const phonenumberUpdate = req.body.phonenumberUpdate;
  const currencyUpdate = req.body.currencyUpdate;
  const languageUpdate = req.body.languageUpdate;
  if (emailUpdate !== "") {
    if (emailUpdate !== emailId) {
      const updateAlias = "update user set alias=? where email=?";
      con.query(updateAlias, [emailUpdate, emailId], (err, result) => {
        if (err) throw err;
        // console.l(result);
      });
    }
  }

  if (fullnameUpdate !== "") {
    const updateAlias = "update user set fullname=? where email=?";
    con.query(updateAlias, [fullnameUpdate, emailId], (err, result) => {
      if (err) throw err;
      // console.l(result);
    });
  }

  if (phonenumberUpdate !== "") {
    const updateAlias = "update user set phonenumber=? where email=?";
    con.query(updateAlias, [phonenumberUpdate, emailId], (err, result) => {
      if (err) throw err;
      // console.l(result);
    });
  }

  if (currencyUpdate !== "") {
    const updateAlias = "update user set currency=? where email=?";
    con.query(updateAlias, [currencyUpdate, emailId], (err, result) => {
      if (err) throw err;
      // console.l(result);
    });
  }

  if (languageUpdate !== "") {
    const updateAlias = "update user set language=? where email=?";
    con.query(updateAlias, [languageUpdate, emailId], (err, result) => {
      if (err) throw err;
      // console.l(result);
    });
  }
  res.status(200).json({ message: "Updation Successful" });
});

app.get("/recentActivity/:email", function (req, res) {
  const email = req.params.email;
  const recentActivityQuery =
    "select grp.email as useremail, grp.group_name, bll.descirption, bll.total_amount, date_format(bll.date,'%d-%b-%Y') as date, bll.email as bill_added_by from splitwise.usergroup grp inner join splitwise.bill bll on grp.group_name = bll.group_name and grp.email != bll.email and grp.email=? order by date desc";
  con.query(recentActivityQuery, [email], (err, result) => {
    if (err) throw err;
    res.status(200);
    res.send(result);
  });
});

app.listen(port, () => {
  console.log("Server connected to port 4000");
});

module.exports = app;
