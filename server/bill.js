const updateBill = (input) => {
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
      // res.status(200);
      // res.send("Hello World");
    }
  );
  console.log("Done with bill");
  console.log("++++++++++++++++++++++++++++++++++++++++++++");
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
    console.log("Hello" + array);
    /*res.status(200);
    res.send(array);*/
  });
  console.log(array);
  console.log(array.length + "nikhil");
  setTimeout(() => {}, 1000);
  array.forEach((ele) => {
    console.log("Hellosadhasdhsah" + ele);
    const updateTransactionQuery =
      "update transaction set final_amount=? where group_name=? and user_1=? or user_2=? and user_1=? or user_2=?";
    con.query(
      updateTransactionQuery,
      [amount / array.length, groupName, email, ele, ele, email],
      (err, result) => {
        if (err) throw err;
        console.log(result);
      }
    );
  });
  res.status(200);
  res.send("Hello World");
};
