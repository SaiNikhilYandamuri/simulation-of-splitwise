import { gql } from '@apollo/client';

const dashboardQuery = gql`
  query getdashboarddetails($email: String) {
    getdashboarddetails(email: $email) {
      user_1
      user_2
      final_amount
      group_name
    }
  }
`;

const profileQuery = gql`
  query getprofile($email: String) {
    getprofile(email: $email) {
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

const inviteGroupsQuery = gql`
  query invitegroups($email: String) {
    invitegroups(email: "sai123@splitwise.com") {
      group_name
    }
  }
`;

const myGroupsQuery = gql`
  query mygroups($email: String) {
    mygroups(email: "sai123@splitwise.com") {
      group_name
    }
  }
`;

const usersQuery = gql`
  query users($email: String) {
    users(email: $email) {
      email
      fullname
    }
  }
`;

const getBillsQuery = gql`
  query getbillsofgroup($groupName: String) {
    getbillsofgroup(groupName: $groupName) {
      descirption
      total_amount
    }
  }
`;

export {
  dashboardQuery,
  profileQuery,
  inviteGroupsQuery,
  myGroupsQuery,
  usersQuery,
  getBillsQuery,
};
