const graphql = require("graphql");
const bcrypt = require("bcrypt");
const { GraphQLObjectType, GraphQLString, GraphQLSchema } = graphql;
const con = require("../mysqlConnection");

const saltRounds = 10;

const UserType = new GraphQLObjectType({
  name: "User",
  fields: () => ({
    email: { type: GraphQLString },
    password: { type: GraphQLString },
    fullname: { type: GraphQLString },
    currency: { type: GraphQLString },
    phonenumber: { type: GraphQLString },
    timezone: { type: GraphQLString },
    language: { type: GraphQLString },
    photopath: { type: GraphQLString },
  }),
});

const RootQuery = new GraphQLObjectType({
  name: "RootQueryType",
  description: "Root Query",
  fields: {
    user: {
      type: UserType,
      args: {
        email: { type: GraphQLString },
        password: { type: GraphQLString },
      },
      async resolve(parent, args) {
        let result = await queryForLogin(args);

        // console.log(results);
        return result;
      },
    },
  },
});

const queryForLogin = (args) => {
  return new Promise(async (resolve, reject) => {
    console.log(args);
    let result123; //= { email: args.email }; // = {};
    const email = args.email;
    const password = args.password;
    // console.l(email);
    // console.l(password);
    const selectLoginQuery =
      "Select fullname,password,email,currency from user where email=?";

    // const { err, result } = await con.query(selectLoginQuery, [email]);

    //console.log(result);

    // console.l(selectLoginQuery);

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

const Mutation = new GraphQLObjectType({
  name: "Mutation",
  fields: {
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
  },
});

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

const schema = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation,
});

module.exports = schema;
