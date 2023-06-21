// Install the bcrypt
import bcrypt from "bcrypt"

const password = "12345" 
const myPassword = "12345"

const passwordHasher = async (psw) =>{

    // First step is to generate the salt in hashing algorythim
    
    // we will use genSalt method to generate the salt
    // this method accepts the salt rounds as parameter.

    const saltRounds = 20

    const salt = await bcrypt.genSalt(saltRounds)

    // We will use hash method of bcrypt to generate a hashed password.
    // it accepts two parameters first one the plain text and second the salt that we have generated

    const hashdPassword = await bcrypt.hash(psw,salt)

    console.log(salt)
    console.log(hashdPassword)

    return hashdPassword
}

const hashedPsw = await passwordHasher(myPassword)
/* const hashedPswTwo = await passwordHasher(password) */

const plainTextPassword = "12345"


// To check the user provided plain text password either it is correct or incorrect
// We use compare method from bcrypt
// That accepts two parameters first one will be the user entered plain text password that he is providing while trying to login into his account
// and Second parameter will be the hashed password that we have stored in our data base when user registered with us first time
// This method will return true or false only, if it returned true that means user has entered the correct password and will allow him to access private routes
// or profile or what so ever important info.

const isValid = await bcrypt.compare(plainTextPassword, hashedPsw)
console.log(isValid)