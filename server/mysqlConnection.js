const mysql = require("mysql");

const con = mysql.createConnection({
  connectionLimit: 10,
  host: "splitwise.cxfc1pmp6ndg.us-east-2.rds.amazonaws.com",
  user: "admin",
  password: "password123",
  ssl: true,
  database: "splitwise",
});

con.connect((err) => {
  if (err) {
    throw "Error Occured: " + err;
  } else {
    console.log("MySQL Database Connected");
  }
});
module.exports = con;
