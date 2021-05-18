import { gql } from '@apollo/client';

const loginQuery = gql`
  mutation login($email: String, $password: String) {
    login(email: $email, password: $password) {
      fullname
      email
      currency
    }
  }
`;

const signupQuery = gql`
  mutation signup($email: String, $password: String, $fullname: String) {
    signup(email: $email, password: $password, fullname: $fullname) {
      fullname
      email
      currency
    }
  }
`;

const profileUpdateQuery = gql`
  mutation updateprofile(
    $email: String
    $emailUpdate: String
    $fullnameUpdate: String
    $currencyUpdate: String
    $languageUpdate: String
  ) {
    updateprofile(
      email: $email
      emailUpdate: $emailUpdate
      fullnameUpdate: $fullnameUpdate
      currencyUpdate: $currencyUpdate
      languageUpdate: $languageUpdate
    ) {
      email
      fullname
      language
      currency
      phonenumber
      timezone
      photopath
    }
  }
`;

const createGroupQuery = gql`
  mutation creategroup($groupName: String, $email: String, $members: [String]) {
    creategroup(groupName: $groupName, email: $email, members: $members) {
      group_name
    }
  }
`;

const addbillQuery = gql`
  mutation addbill($email: String, $amount: Float, $descirption: String, $group: String) {
    addbill(email: $email, amount: $amount, descirption: $descirption, group: $group) {
      descirption
    }
  }
`;

const acceptinviteQuery = gql`
  mutation acceptinvite($emailId: String, $groupName: String) {
    acceptinvite(emailId: $emailId, groupName: $groupName) {
      group_name
    }
  }
`;

const settleupQuery = gql`
  mutation settleup($email: String, $friendSelected: String) {
    settleup(email: $email, friendSelected: $friendSelected) {
      user_1
      user_2
    }
  }
`;
export {
  loginQuery,
  signupQuery,
  profileUpdateQuery,
  createGroupQuery,
  addbillQuery,
  acceptinviteQuery,
  settleupQuery,
};
