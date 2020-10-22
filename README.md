# Task Manager Api
> This is a full featured Task Management REST API back-end built with Node.js and MongoDB.


Various features of the API :
- Full CRUD features for User and Task instances.
- Pagination and filtering of server responses to avoid slow page load times.
- Hash encryption of passwords and access management with JWT tokens and Bcrypt.  
- Restricted user access to CRUD operations based on JWT tokens.
- Send Email to user to welcome and goodbye email to user's using Sendgrid .

![](header.png)

## Software Packages and Tools used:

* Express(for Restful API and manage routers).
* Mongoose(NoSql database).
* validation(validating some data).
* Async-Await (for waitting until the process done!).
* promises(write a cleaner code, instead of callbacks mess).
* JWT(authentication layer).
* multer(image uploading).
* sharp(croping and image formatter).
* sendGrid/email.
* heroku (deployment).
* POSTMAN to make the HTTP request 


## Development Setup

To use this code you will require an account with [SendGrid](https://signup.sendgrid.com/).  Sign-up is free and no credit card is required to access a free-tier API Key.

Node.js version 12+ and npm must be installed on your machine.  In terminal type the following commands:
```
git clone https://github.com/pgmorgan/task-manager-api.git
cd task-manger-api
sudo npm install
mkdir config
cd config
touch dev.env
vim dev.env
```

Insert the following lines in `dev.env`, replacing all `<content>` with your own information:

```
PORT=<port number>
SGMAIL_EMAIL=<your email address>
MONGODB_URL=<mongodb connection string>
SENDGRID_API_KEY=<api key>
JWT_SECRET=<unique key of your choice to generate JSON web tokens>
```

To run the web server return to the root of the repository and type:
```
npm run dev
```
Alternatively you may name `config/prod.env` or `config/staging.env` and appropriately run the web server with `npm run prod` or `npm run staging`.

## Example http requests

#### Create User 


```
POST https://singh-task-app.herokuapp.com/users
```

#### Login User

```
POST https://singh-task-app.herokuapp.com/users/login
```
#### Logout User 

```
POST https://singh-task-app.herokuapp.com/users/logout
```
#### Create Task 

```
POST https://singh-task-app.herokuapp.com/tasks
```
#### Create Avatar

```
POST https://singh-task-app.herokuapp.com/users/me/avatar
```
#### User Profile

```
GET https://singh-task-app.herokuapp.com/users/me
```
#### Read Task 

```
GET https://singh-task-app.herokuapp.com/tasks
```

and alot more you can find all routes at routers folder.
