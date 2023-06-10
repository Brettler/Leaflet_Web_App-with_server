# Advanced Programmin 2 - Task 2 With Server
Eden Berman & Liad Brettler

## Description
This project encompassed three primary components aimed at implementing a server-client application. Firstly, we made modifications to our code in order to establish communication with the server provided by the course. This involved adapting the code to interact with the Restful API the server performs, receiving JSON objects and tokens as input values, as well as transferring the logic to the server instead of keeping it locally. Secondly, once our code successfully interacted with the provided server, we proceeded to develop our own server using NodeJS, wherein we implemented the API and functionality of the original server. The server was constructed following the MVC architecture and utilized a MongoDB database to store data. Lastly, we integrated real-time communication by employing WebSockets, enabling active users to instantly exchange messages.

The application itself comprises a chat webpage featuring three distinct sections: a Login page, a Register page, and a Chats page. To design these pages, we utilized CSS and Bootstrap, while React was employed to implement the application's functionality.

## Instructions
This repository includes both the client and server sides implementation, If you wish to access the repository that exclusively contains the client-side, please click the following link: https://github.com/Brettler/Leaflet_Task2.git

To run the application using our client and server, follow these steps:

1. Redirect to the provided link and clone the repository.
2. Navigate to the directory where the files are located using your terminal.
3. Execute the command "npm install" to install the required dependencies.
4. Open your local MongoDB server and modify the URL section from 'localhost' to '127.0.0.1'.
5. Proceed to the 'config' folder and edit the 'env.local' file to set the URL for your local MongoDB database. Ensure that the port number matches the one specified in your MongoDB server configuration. If necessary, you can modify the port number used by our server.
6. Finally, enter the command "npm start" to start the application.

To launch the client with your own NodeJS server, follow these steps:

1. Navigate to the directory where the files are located using your terminal.
2. Execute the command "npm install" to install the required dependencies.
3. Run the command "npm run build" to generate the production-ready files.
4. Copy the contents of the 'build' folder to update the static files directory used by your NodeJS server. Ensure that you specify the correct folder name when serving static files in the 'express.static' middleware function, such as 'public'.
5. Finally, enter the command "npm start" to start the client application with your custom NodeJS server.

This will launch the app and open the login page in your browser. The login page is the main interface where you can enter your username and password. After clicking on the "Login" button, registered users will be directed to their personalized Chats page. If you haven't registered yet, click on the "Register" button, which will take you to the registration page where you can provide your information. Once you have filled in all the required fields, click on the "Register" button to redirect to the login page.
Once you are in the Chats page, you will see a split-screen interface. The left side displays your chats with your friends, while the right side shows the chat that you are currently viewing. To log out, click on the door icon on the top left bar. This will redirect you back to the login page.

To close the app, use the keyboard shortcut "Ctrl+C" and then type "Y" to confirm.

## Server

The server in this implementation adheres to the MVC (Model-View-Controller) architecture, comprising controllers, models, services, and routes. It handles the following requests, maintaining the same input and output formats of the original server:
* POST api/Users: Registers a new user by sending a POST request to this endpoint. The request should include a unique username, password, display name, and an image. If the registration is successful, the server responds with a status code of 200. Otherwise, an appropriate error message will be displayed to the client.
* POST api/Tokens: Generates a token for a registered user based on the provided username and password during login. This token is necessary for subsequent server requests.
* GET api/Users/:id : Retrieves the properties of a user, such as their username, display name, and profile picture, based on the provided id (username).
* GET api/Chats: Retrieves an array of the friend chats belonging to the current user. Each chat includes a unique id assigned by the MongoDB server, as well as properties of the friend and the last message exchanged in the chat.
* POST api/Chats: Creates a new chat with a selected friend. The server expects the current user's username and the new friend's username in the request. The server responds with the properties of the added friend.
* POST api/Chats/:id/Messages: Retrieves an array of all messages exchanged between the user and the friend associated with the specified chat id.
* GET api/Chats/:id/Messages: Sends the user's message to the server, which then forwards it to the friend based on the chat id.
* DELETE api/Chats/:id : Removes the chat with the specified id from the server.

## Client - Webpages
* Login - The main page of our app is the login page, which features a form with input boxes for the user's username and password. The page also includes buttons that allow users to access their personal chat page or the registration page. The username input box verifies whether the username is already registered, while the password box ensures that the entered password matches the username. If either of these fields is left blank or does not match, an error message will be displayed. Once the user enters the correct login credentials, they can access their personalized chat page by clicking on the "Login" button. If the user hasn't registered yet, they can click on the "Register" button, which will redirect them to the registration page.

* Register - The Register page of our app features a form that requires users to fill in mandatory fields such as username, password, password verification, and display name, while uploading a profile picture is optional. Certain fields have restrictions. The username must be unique in a case-insensitive manner. The password field must contain at least five characters, one digit, one uppercase letter, and one lowercase letter. Furthermore, the verify password field must match the password field. The display name field does not have any restrictions, but it is mandatory to fill it. Users can choose their profile picture, which will be previewed below as it would appear. If the user chooses not to upload an image, the default image will be displayed.
If any of the mandatory and restricted fields are not filled in properly, an appropriate error message will appear, and the user will not be able to register. Once the user completes the form, they can click on the Register button to be redirected to the login page. If the user has already registered, they can click on the right-hand link to be directed to the login page.

* Chats - The Chats page is personalized for each user and shows all of their ongoing conversations. Upon logging in, a welcome message from our team appears in the top right bar. The structure of the page is divided into two main sections.
    On the right side of the page, the chat window is displayed, with a bar above it and an input box below it. The top bar displays details of the friend the user is currently chatting with, including their profile picture and display name. Furthermore, it incorporates an icon specifically designed for the purpose of deleting the currently displayed chat. In the input box below, users can type their message and send it by clicking on the arrow button to the right. Once the user sends the message, it appears in a chat bubble in the chat window, along with the time it was sent.
    On the left side, users can see a list of friends they have ongoing conversations with. The top bar on this side displays the user's profile picture, display name, and features such as logging out and adding a new friend. Clicking on the 'Logout' icon redirects the user to the login page, while clicking on the 'Add Friend' icon brings up a modal where the user can enter another user's username (which is case-sensitive). Clicking 'Add Friend' will add the friend to the list. If the username is not registered, an error message appears. Clicking 'Close' closes the modal.
    Below this bar is the user's friend list, which initially appears empty. Once a friend is added, their profile picture and display name appear in the list. To start a conversation, users can simply click on the friend's box, which displays their details in the top bar on the right-hand side. From here, users can send a message to their friend. The last message sent will be displayed in the friend's details along with the time it was sent. Once a new message is received, the friend's name will be displayed in red indicating a new message has been sent.
    Between the user's details and the friend list is a search box that allows users to search for a specific friend within the list, in a case-insensitive manner. The list will only display friends whose display names contain the typed prefix, temporarily hiding the rest of the friends.

To ensure consistent and cohesive design throughout the app, each webpage has a corresponding CSS file that applies its unique design elements.

