- We are having a basic react app with signup, login, posts and other components.
- We implemented the functionality inside the signup component that it can make a post request to over API
    To register a new user.
- We implemented the functionality inside the login Component to make a post request to the API to Authenticate a user.
- API was sending back token and firstName details of the user after successful login and we were storing that token into the local storage.
- We updated our Navbar that it will behave differently if a user is logged in and differently if user is not logged in.
- In Posts component we are making a get request using Axios to fetch all posts from our API
- All post route was changed to public so it can be accessible by every user even if he is not logged in.
- In Create Post component, we made private so it will be only accessible when one user is logged inf, because only registered users can create new Posts.
- In our create-post end point inside OUR API we declared it as Private. So it will be only accessible when the user provides a valid token
- Because in our Post schema 'owner' property of was set Required true, that means it must be provided. And it was of type of Mongoose ObjectId
- To accomplish this validation of Post Schema what we did?
    - When were generating a new token as user reached to auth/login end point , we also used  _id provided to us from MongoDB as payload.
    - Because of it when ever user was sending a new post with token we were decoding / verifying the token. As a result we were getting the userId
        out of it.
    - And we attached that userId to the request object in side the AuthorizationHandler , so we can have access to userId inside our controller where it is required. with code req.userId = payload._id

    - As Post schema was looking for property of owner , so in side the create post controller we did const owner = req.userId
    - Then we used it to create a New Post to avoid errors.

    ### Todo for 5th June, 2023
    - Develop a react component for change password that must contain old Password, new Password and confirm Password inputs
    - Create a router for it inside your App.jsj
    - Connect it to the backend to change a user's password.
    - Improve the Post update Handler (Controller)
    - If the user is changing only the title of the post , we must only send updated title to the backend
    - So the document (Post ) stored on the database must be only updated with title in case title is received from front end . vice versa
    

## Task to Do 
- Move the bcrypt password compare and JWT token generation out of loginHandler to the pre or post hook which ever is required

- What kind of values we have inside the login Controller
 - email 
 - password

 - Which query we are making to data base is findOne
 -  We will not have access to the user document in side the Pre - Hook but we will have access to password and email fields
 - In side the post middleware we will have access to the user Document coming from the data base but we will not have access to the plain password


 - To verify a password from bcrypt we need both plain text password and Hashed password , is it correct?