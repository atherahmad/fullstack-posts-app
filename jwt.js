import jwt from 'jsonwebtoken'
import dotenv from "dotenv"

dotenv.config()
// What is Authentication and what is Authorization.

const student = {
    name: "Ather",
    role: 'Student'
}

/* console.log(student)
 */
student.className = 'FBE-09'

/* console.log(student)
 */
// What are two main objects when we access an API

// 1. Request
// 2. Response

// As we have talked that Request is an object 
// Can we add a new property to this Object? Yes

const request = {
    Headers :'Headers of the Object'
}

request.newProperty = "New Property Value"

/* console.log(request)
 */
// Payload
//Payload is just data that we want to pass, nothing special . this data could be of type Object or AN Array or Number or  String


// For Authorization we will use JWT(JSONWebToken)

/* 
Which two methods we are going to use from jwt
1- sign , and it wil be used to generate a token
2. verify, to verify a token either it valid or invalid or expired
 */

const payload = {
    email: 'ather@gmail.com',
    fullName: 'Ather Ahmad'
}
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY

// To generate a token we will call sign method from jwt

const token = jwt.sign(payload, JWT_SECRET_KEY, {expiresIn:60 * 60})
const secondToken = jwt.sign(payload, JWT_SECRET_KEY)

console.log("First Token", token)



// TO verify a token we will use  verify method out of jwt

const decodedPayload = jwt.verify(token, JWT_SECRET_KEY)

console.log(decodedPayload)