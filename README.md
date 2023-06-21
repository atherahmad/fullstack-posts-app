Mongodb Relationship
There are two kinds of Relationships in Mongodb

1- Using References  (Normalization)


e.g. const studentsArray = ["Tom", "Mike",]

const newArray = studentsArray
const allStudents = newArray

studentsArray.pop() we will have only ["Tom"]

allStudents.pop() []


2- Embedded Documents (Denormalization)

// We want to develop an application:
// Through which we can store different users inside the database and then in the next days we will use the user details to log him in.
-What kind of data i want to store about a user:

- firstName
- lastName
- email
- password
- address
- posts

## Todo
- Create a collections /Model/Schema of courses (it could have properties like, courseName, duration, )
- Create controllers for courses e.g. addCourse, getCourseDetailss, allCourses
- Create Routes for courses e.g. create-course, course-details, all-courses
- Inside the User Schema Create  a new property of enrolledCourse
- enrolledCourse property must be of type mongoose.Schema.Types.Objectid
- create a One-To-One relation ship between User and Course
- So if we querry a user detail we can also see the details of the course to which he has been enrolled. Using Populate


## Todo:
- Create a basic express server
- No need to create the structure of routes, controllers or models but if you want to do you can.
- Create end points that will handle requests to:
    - Create User with username, email and password
        - email must be unique , before registering a user you must query the data base either a user is already registered with the same email or not
        - If a user is already registered with that email sent a response "This mail is already in use please try to login"
        - If email is not already in use create a new user and before storing its data on database "Hash" the password
    
    - Create an end point that will handle login request
        - that request will accept email and password from the client side
        - verify the password using compare method from bcrypt after fetching the data of the user for provided email
        - If comparison is success send response that successfully logged in
        - In other case send a response back "invalid Credentials"
    
    - Create another route to change the password of the user
        - In which you will get email, password and newPassword from the client in req.body
        - first compare the password with old hashed password
        - if it is valid then hash the newPassword and update the user document on database with newly hashed password
    
    Schema could have below properties : {
        email,
        username,
        hashedPassword
    }

## TODO for Authentication and Authorization:

- Give a look to the Today's live code again and try to understand it
- So far we are securing the all-posts end point but normally people can see the posts with out being logged in.
- So please remove the Authorization from all-posts end point
- And Implement Authorization while user is Creating a post using create-post end point
- If the user is already logged in and owns a token and sends it with headers then after validating he can create the new post
- Previously we were not adding the _id that we received from MongodDB inside the Payload while generating token
- Please include the _id in side the payload
- And in AuthorizationHandler( Authorization middle-ware) attach the userId property to the request object and value will be the MongoDB id: (_id)
- And use that userId in controllers or route Handlers to make queries to store some data or retrieve  data.

## TODO for Sending emails:
    - Create a new property of verified inside the User schema that must be by default set to false
- Please update your 'createUser' controller in such a way that:
    - When ever a new user register at your app send him a  welcome email 
         on the provided email address.
    - You can achieve it by using the send-grid package

## Uploading the Images to the Backend-Storage using Multer and Rendering them on Front-end
- With this method it is not only that we are uploading multiple images , we can upload a single image too.
- First we need to send few images from front-end to backend
- We need to develop a component on front end through which we can upload multiple images and post them to the backend
- We will use formData to send the files from FE to BE.
- On backend we will use Multer again to get access to the req.files / req.file
- We will store them locally that will happen automatically when the multer-middleware will be called
- Main point of this topic is to assign a specific name to each file that we are storing on the backend storage
- Second main point will be to set our backend server in such a way that it can send images to the front-end
- As you are very well aware that backend servers are very secure and they dont listen to any request who's route / end point is not defined
- We will modify or use a middleware for that and you have already learnt it and that is express.static middleware 
