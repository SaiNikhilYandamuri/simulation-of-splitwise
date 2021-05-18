const graphql = require("graphql");
const bcrypt = require("bcrypt");
const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLSchema,
  GraphQLInt,
  GraphQLFloat,
  GraphQLList,
} = graphql;
const con = require("../mysqlConnection");

const saltRounds = 10;

const UserType = new GraphQLObjectType({
  name: "User",
  fields: () => ({
    email: { type: GraphQLString },
    fullname: { type: GraphQLString },
    currency: { type: GraphQLString },
    phonenumber: { type: GraphQLString },
    timezone: { type: GraphQLString },
    language: { type: GraphQLString },
    photopath: { type: GraphQLString },
  }),
});

const GroupType = new GraphQLObjectType({
  name: "Group",
  fields: () => ({
    group_name: { type: GraphQLString },
    group_pic: { type: GraphQLString },
  }),
});

const UsergroupType = new GraphQLObjectType({
  name: "Usergroup",
  fields: () => ({
    email: { type: GraphQLString },
    group_name: { type: GraphQLString },
    inviteacceptance: { type: GraphQLInt },
  }),
});

const BillType = new GraphQLObjectType({
  name: "Bill",
  fields: () => ({
    descirption: { type: GraphQLString },
    group_name: { type: GraphQLString },
    total_amount: { type: GraphQLFloat },
    email: { type: GraphQLString },
    date: { type: GraphQLString },
  }),
});

const TransactionType = new GraphQLObjectType({
  name: "Transaction",
  fields: () => ({
    user_1: { type: GraphQLString },
    user_2: { type: GraphQLString },
    final_amount: { type: GraphQLFloat },
    group_name: { type: GraphQLString },
  }),
});

const RootQuery = new GraphQLObjectType({
  name: "RootQueryType",
  description: "Root Query",
  fields: {
    invitegroups: {
      type: new GraphQLList(UsergroupType),
      args: {
        email: { type: GraphQLString },
      },
      async resolve(parent, args) {
        const result = await queryForInviteGroups(args);
        console.log(result);
        return result;
      },
    },
    mygroups: {
      type: new GraphQLList(UsergroupType),
      args: {
        email: { type: GraphQLString },
      },
      async resolve(parent, args) {
        const result = await queryForMyGroups(args);
        console.log(result);
        return result;
      },
    },
    users: {
      type: new GraphQLList(UserType),
      args: {
        email: { type: GraphQLString },
      },
      async resolve(parent, args) {
        const result = await queryForUsers(args);
        console.log(result);
        return result;
      },
    },
    getbillsofgroup: {
      type: new GraphQLList(BillType),
      args: {
        groupName: { type: GraphQLString },
      },
      async resolve(parent, args) {
        const result = await queryForGetBillsOfGroup(args);
        return result;
      },
    },
    getdashboarddetails: {
      type: new GraphQLList(TransactionType),
      args: {
        email: { type: GraphQLString },
      },
      async resolve(parent, args) {
        const result = await queryForDashboard(args);
        console.log("Inside getdashboard", result);
        return result;
      },
    },
    getprofile: {
      type: UserType,
      args: {
        email: { type: GraphQLString },
      },
      async resolve(parent, args) {
        return queryForProfile(args);
      },
    },
    // getrecentactivity: {
    //   type: GraphQLList,
    //   args: {
    //     email: { type: GraphQLString },
    //   },
    //   async resolve(parent, args) {
    //     return queryForRecentActivity(args);
    //   },
    // },
    getmembersofgroup: {
      type: new GraphQLList(TransactionType),
      args: {
        groupName: { type: GraphQLString },
        email: { type: GraphQLString },
      },
      async resolve(parent, args) {
        const result = await queryForGetMembersOfGroup(args);
        console.log("Inside getdashboard", result);
        return result;
      },
    },
  },
});

const queryForGetMembersOfGroup = (args) => {
  return new Promise(async (resolve, reject) => {
    // const params = req.params.groupName.split("&");
    //// console.l(params);
    const groupName = args.groupName;
    const email = args.email;
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
        console.log(result);
        if (err) throw err;
        Object.keys(result).forEach(function (key) {
          const row = result[key];
          //const rowName = { groups_name: row.group_name };
          // console.l(row);
          array.push(row);
        });
        // console.l(array);
        console.log(array);
        resolve(array);
      }
    );
  });
};

const queryForLogin = (args) => {
  return new Promise(async (resolve, reject) => {
    console.log(args);
    let result123; //= { email: args.email }; // = {};
    const email = args.email;
    const password = args.password;
    const selectLoginQuery =
      "Select fullname,password,email,currency from user where email=?";

    await con.query(selectLoginQuery, [email], (err, result) => {
      if (err) {
        throw err;
      } else {
        if (result.length > 0) {
          console.log("Inside query");
          bcrypt
            .compare(password, result[0].password)
            .then(function (response) {
              console.log(response);
              if (response) {
                console.log("inside Response");
                const user123 = {
                  fullname: result[0].fullname,
                  email: result[0].email,
                  currency: result[0].currency,
                };
                console.log(user123);
                result123 = user123;
                resolve(user123);
              } else {
                reject("Invalid Credentials");
              }
            })
            .catch((response) => {
              console.log(response);
              reject("Invalid Credentials");
            });
        } else {
          reject("Invalid Credentials");
        }
      }
    });
  });
};

const queryForInviteGroups = (args) => {
  return new Promise(async (resolve, reject) => {
    const useremail = args.email;
    const getGroupQuery =
      "select group_name from usergroup where email=? and inviteacceptance=0";
    // console.l(getGroupQuery);
    const array = [];
    con.query(getGroupQuery, [useremail], (err, result) => {
      if (err) throw err;
      Object.keys(result).forEach(function (key) {
        const row = result[key];
        array.push({ group_name: row.group_name });
      });
      console.log(array);
      resolve(array);
    });
  });
};

const queryForMyGroups = (args) => {
  return new Promise(async (resolve, reject) => {
    const useremail = args.email;
    const getGroupQuery =
      "select group_name from usergroup where email=? and inviteacceptance=1";
    // console.l(getGroupQuery);
    const array = [];
    con.query(getGroupQuery, [useremail], (err, result) => {
      if (err) throw err;
      Object.keys(result).forEach(function (key) {
        const row = result[key];
        array.push({ group_name: row.group_name });
      });
      console.log(array);
      resolve(array);
    });
  });
};

const queryForUsers = (args) => {
  return new Promise(async (resolve, reject) => {
    const array = [];
    con.query(
      "select email,fullname from user where email != ?",
      [args.email],
      (err, result) => {
        if (err) throw err;
        // console.l(result);
        for (let i = 0; i < result.length; i++) {
          array.push(result[i]);
        }
        console.log(array);
        resolve(array);
        //res.send(array);
      }
    );
  });
};

const queryForGetBillsOfGroup = (args) => {
  return new Promise(async (resolve, reject) => {
    const groupName = args.groupName;
    const getBillsQuery =
      "select descirption,total_amount,email from bill where group_name=? order by date desc";
    const array = [];
    con.query(getBillsQuery, [groupName], (err, result) => {
      if (err) throw err;
      console.log(err);
      Object.keys(result).forEach(function (key) {
        const row = result[key];
        array.push(row);
      });
      console.log(array);
      resolve(array);
    });
  });
};

const queryForDashboard = (args) => {
  return new Promise(async (resolve, reject) => {
    const email = args.email;
    // console.l(email);
    const getAmountQuery =
      "select user_1,user_2,final_amount,group_name from transaction where user_1=? or user_2=?";
    con.query(getAmountQuery, [email, email], (err, result) => {
      if (err) throw err;
      // console.l(result[0]);
      resolve(result);
    });
  });
};

const queryForProfile = (args) => {
  return new Promise(async (resolve, reject) => {
    const email = args.email;
    const profileQuery =
      "select email, fullname, phonenumber, currency, timezone, language, photopath from user where email=?";
    con.query(profileQuery, [email], (err, result) => {
      if (err) throw err;
      console.log(result);
      resolve({
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
};

const queryForRecentActivity = (args) => {
  return new Promise(async (resolve, reject) => {
    const email = req.params.email;
    const recentActivityQuery =
      "select grp.email as useremail, grp.group_name, bll.descirption, bll.total_amount, date_format(bll.date,'%d-%b-%Y') as date, bll.email as bill_added_by from splitwise.usergroup grp inner join splitwise.bill bll on grp.group_name = bll.group_name and grp.email != bll.email and grp.email=? order by date desc";
    con.query(recentActivityQuery, [email], (err, result) => {
      if (err) throw err;
      resolve(result);
    });
  });
};

const Mutation = new GraphQLObjectType({
  name: "Mutation",
  fields: {
    login: {
      type: UserType,
      args: {
        email: { type: GraphQLString },
        password: { type: GraphQLString },
      },
      async resolve(parent, args) {
        let result = await queryForLogin(args);

        console.log(result);
        return result;
      },
    },
    signup: {
      type: UserType,
      args: {
        fullname: { type: GraphQLString },
        email: { type: GraphQLString },
        password: { type: GraphQLString },
      },
      async resolve(parent, args) {
        let result = await queryForSignup(args);
        return result;
      },
    },
    creategroup: {
      type: GroupType,
      args: {
        groupName: { type: GraphQLString },
        email: { type: GraphQLString },
        members: { type: GraphQLList(GraphQLString) },
      },
      async resolve(parent, args) {
        console.log(args);
        let result = await queryForCreateGroup(args);
        return result;
      },
    },
    acceptinvite: {
      type: UsergroupType,
      args: {
        emailId: { type: GraphQLString },
        groupName: { type: GraphQLString },
      },
      async resolve(parent, args) {
        let result = await queryForAcceptInvite(args);
        console.log(result);
        return result;
      },
    },
    addbill: {
      type: BillType,
      args: {
        email: { type: GraphQLString },
        group: { type: GraphQLString },
        amount: { type: GraphQLFloat },
        descirption: { type: GraphQLString },
      },
      async resolve(parent, args) {
        let result = await queryForAddBill(args);
        console.log(result);
        return result;
      },
    },
    leavegroup: {
      type: GroupType,
      args: {
        email: { type: GraphQLString },
        groupName: { type: GraphQLString },
      },
      async resolve(parent, args) {
        let result = await queryForLeaveGroup(args);
        console.log(result);
        return result;
      },
    },
    settleup: {
      type: TransactionType,
      args: {
        email: { type: GraphQLString },
        friendSelected: { type: GraphQLString },
      },
      async resolve(parent, args) {
        return queryForSettleUp(args);
      },
    },
    updateprofile: {
      type: UserType,
      args: {
        email: { type: GraphQLString },
        emailUpdate: { type: GraphQLString },
        fullnameUpdate: { type: GraphQLString },
        phonenumberUpdate: { type: GraphQLString },
        currencyUpdate: { type: GraphQLString },
        languageUpdate: { type: GraphQLString },
      },
      async resolve(parent, args) {
        console.log(args);
        return queryForUpdateProfile(args);
      },
    },
  },
});

const queryForUpdateProfile = (args) => {
  return new Promise(async (resolve, reject) => {
    const emailId = args.email;
    const emailUpdate = args.emailUpdate;
    const fullnameUpdate = args.fullnameUpdate;
    const phonenumberUpdate = args.phonenumberUpdate;
    const currencyUpdate = args.currencyUpdate;
    const languageUpdate = args.languageUpdate;
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
    resolve(queryForProfile(args));
  });
};

const queryForSettleUp = (args) => {
  return new Promise(async (resolve, reject) => {
    const email = args.email;
    const friend = args.friendSelected;

    const updateTransactionQuery =
      "update transaction set final_amount=0 where user_1 in (?, ?) and user_2 in (?, ?)";
    // console.l(updateTransactionQuery);
    con.query(
      updateTransactionQuery,
      [email, friend, friend, email],
      (err, result) => {
        if (err) throw err;
        console.log(result);
        resolve({ user_1: email, user_2: friend, final_amount: 0 });
      }
    );
    // resolve(result);
  });
};

const queryForLeaveGroup = (args) => {
  return new Promise(async (resolve, reject) => {
    const groupName = args.groupName;
    const email = args.email;
    const leaveGroupQuery =
      "update usergroup set inviteacceptance=-1 where email=? and group_name=?";
    con.query(leaveGroupQuery, [email, groupName], (err, result) => {
      if (err) throw err;
      // console.l(result);
      resolve({ group_name: groupName });
    });
  });
};

const queryForCreateGroup = (args) => {
  return new Promise(async (resolve, reject) => {
    console.log("Hello WOrld");
    const groupName = args.groupName;
    const form = args.members;
    const email = args.email;
    // console.l("Hello");
    console.log(form);
    // let executeValue = true;
    const insertGroup =
      "insert into groupinfo(group_name, group_pic) values(?,?)";
    con.query(insertGroup, [groupName, "picture"], (err, result) => {
      console.log("Inside Query");
      console.log(err);
      console.log(result);
      if (err) {
        if (err.code === "ER_DUP_ENTRY") {
          // console.l("User already present!!");
          resolve({ message: "Group already exists!" });
        }
      } else {
        console.log(result);
        const usergroupQueryCreator =
          "insert into usergroup(email,group_name,inviteacceptance) values(?,?,?)";
        con.query(
          usergroupQueryCreator,
          [email, groupName, 1],
          (err, result) => {
            if (err) throw err;
            // console.l(result);
          }
        );
        // console.l("Usergroup info 1");
        form.forEach((ele) => {
          const emailOfUser = ele;
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

        form.push(email);
        for (let i = 0; i < form.length; i++) {
          for (let j = i + 1; j < form.length; j++) {
            console.log(form[i]);
            console.log(form[j]);
            const updateTransactionTable =
              "insert into transaction(user_1,user_2,final_amount,group_name) values(?,?,?,?)";
            con.query(
              updateTransactionTable,
              [form[i], form[j], 0, groupName],
              (err, result) => {
                if (err) throw err;
                // console.l(result);
                resolve({ group_name: "successful" });
              }
            );
          }
        }
      }
    });
  });
};

const queryForSignup = (args) => {
  return new Promise(async (resolve, reject) => {
    const fullname = args.fullname;
    const email = args.email;
    const password = args.password;
    const insertUserQuery =
      "INSERT INTO user (email, fullname, password) VALUES (?,?,?)";

    // console.l(insertUserQuery);
    bcrypt.hash(password, saltRounds).then(function (hash) {
      con.query(insertUserQuery, [email, fullname, hash], (err, result) => {
        //console.log(err.code);
        if (err) {
          if (err.code === "ER_DUP_ENTRY") {
            // console.l("User already present!!");
            resolve({ message: "User already exists!" });
          }
        } else {
          // console.l("Inserted");

          resolve({ fullname: args.fullname, email: args.email });
        }
      });
    });
  });
};

const queryForAcceptInvite = (args) => {
  return new Promise(async (resolve, reject) => {
    const email = args.emailId;
    const groupName = args.groupName;
    const acceptInviteQuery =
      "update usergroup SET inviteacceptance=1 where email=? && group_name=?";
    // console.l(acceptInviteQuery + email + groupName);
    con.query(acceptInviteQuery, [email, groupName], (err, result) => {
      // console.l(result);
      if (err) throw err;
      // console.l(result);
      resolve({ group_name: groupName });
    });
  });
};

const queryForAddBill = (args) => {
  return new Promise(async (resolve, reject) => {
    const groupName = args.group;
    const email = args.email;
    const amount = args.amount;
    const description = args.descirption;

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
      resolve({ descirption: description });
    });
  });
};

const schema = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation,
});

module.exports = schema;
