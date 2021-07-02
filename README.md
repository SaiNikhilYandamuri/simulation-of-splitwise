# Splitwise

<p align="center">  
  <img  align="center" src="https://github.com/Yusuf-Juzar-Soni/CMPE-273-Splitwise-V1/blob/main/Frontend/src/Components/assets/splitwise_logo.png">
</p>

To better understand the architecture, workings and technologies required to develop a MERN stack distributed system. 

## Features
The following features from the original application were simulated
* A new user would be able to sign up using an unique email address.
* Existing users can log in using the email address and password used while signing up the user.
*	Validations were done wherever necessary.
*	Sign up and login on success redirect to Dashboard consisting of the amounts the user is owed and user owes along with the list of other users the user owes and user is owed. 
*	Groups information page shows the groups which the user is part or along with the groups the user is invited to. 
*	User will be able to click the invited group and accept/reject the invitation to the group.
*	User will be able to open the required group homepage by clicking on the group name.
*	Recent activity page can be used to see all the latest activity happening across the groups that the user is part of.
*	A new unique group can be created between users registered in the app through new group creation page.
*	User has the ability to settle up with other users who owe the user and who the user owes. 
*	Profile page gives the option edit the details.
*	Users part of group can add comments on the bills added in that group. Only the user added comments can be deleted. 

## Technologies used
React.js,Node.js,Redux,MySQL,MongoDB,Kafka,Mocha,AWS EC2,Passport.js

<details>
  
<summary>Steps to deploy the application</summary>

#### Front End

1. Clone the repository's front end folder "client" into any machine having node.js installed on it.
2. Open the terminal in the folder "client".
3. Execute "npm install" to install all the dependencies.
4. Update the Config.js file in client/src folder with the backend server's IP address and port.
5. Execute "npm start" to run the front end server.

#### Backend

1. Clone the repository's front end folder "server" into any machine having node.js installed on it.
2. Open the terminal in the folder "server".
3. Execute "npm install" to install all the dependencies.
4. Update the index.js file in server folder with frontend server's IP address and port.
5. Execute "node index" to run the backend server.

#### Launch the application

1. Open the browser and navigate to Front end server's IP address with Port number (Eg: 127.0.0.1:3000) to find the landing page.

  </details>
