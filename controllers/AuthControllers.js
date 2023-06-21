import User, { userSchema } from "../models/UserModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { emailSender } from "../utils/emailSender.js";

export const loginHandler = async (req, res) => {
  try {
    // here we are storing the email and password that we received from front end.
    const { email, password } = req.body;

    // then we will search for that user inside the database to get his profile information by his Email

    const userDataFromDB = await User.findOne(
      { email },
      { firstName: 1, email: 1, hashedPassword: 1, verified: 1, avatar: 1 }
    );
    if (userDataFromDB === null) {
      return res.status(400).send("Invalid Credentials");
    }

    // We got hashed password from data base after getting the user object
    const hashedPassword = userDataFromDB.hashedPassword;

    // As now we have both hashedPassword and plain text password
    // Now we can compare them to see either user has provided the correct plaintext password or not
    // To do this comparison we need to call compare method from bcrypt

    const isValid = await bcrypt.compare(password, hashedPassword);

    // Checking either the user has confirmed his email address or not

    if (!userDataFromDB.verified)
      return res.status(400).send("Please confirm your email first!");

    if (isValid) {
      const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;

      const payload = {
        email: email,
        firstName: userDataFromDB.firstName,
        userId: userDataFromDB._id,
      };

      const token = jwt.sign(payload, JWT_SECRET_KEY, { expiresIn: 3600 });

      res
        .status(201)
        .json({
          message: "logged in successfully",
          token: token,
          userName: userDataFromDB.firstName,
          userId: userDataFromDB._id,
          avatar: userDataFromDB.avatar
        });
    } else res.status(400).send("Invalid Credentials");
  
  } catch (err) {
    console.log(err.message);
  }
};

export const passwordChangeHandler = async (req, res, next) => {
  try {
    const userId = req.userId;
    const { currentPassword, confirmPassword, newPassword } = req.body;

    if (confirmPassword !== newPassword) {
      const err = new Error("Password and confirm Password must be same.");
      err.statusCode = 400;
      throw err;
    }
    const userRecord = await User.findById(userId);
    if (userRecord === null) {
      const err = new Error("Invalid Credentials, Record not found");
      err.statusCode = 400;
      throw err;
    }
    const isValid = await bcrypt.compare(
      currentPassword,
      userRecord.hashedPassword
    );

    if (!isValid) {
      const err = new Error("Invalid Credentials");
      err.statusCode = 400;
      throw err;
    }
    const salt = await bcrypt.genSalt(11);
    const newHashedPassword = await bcrypt.hash(newPassword, salt);

    const result = await User.findByIdAndUpdate(userId, {
      hashedPassword: newHashedPassword,
    });

    res.status(202).send("Password Changed Successfully");
  } catch (err) {
    next(err);
  }
};

export const authorizeUser = async (req, res, next) => {
  try {
    const userId = req.userId;
    console.log(userId);
    const user = await User.findById(userId, { firstName: 1, avatar: 1 });

    res.status(201).json({ userName: user.firstName, userId: user._id , avatar: user.avatar});

  } catch (err) {
    next(err)
  }
};

export const emailConfirmationHandler = async (req, res) => {
  try {
    const { token } = req.params;
    const decodedData = jwt.verify(token, process.env.JWT_SECRET_KEY);
    const result = await User.findByIdAndUpdate(decodedData.userId, {
      verified: true,
    });
    res.status(200).send("Email verified successfully");
  } catch (err) {
    res.status(401).send("Invalid Credentials");
  }
};

export const passwordReset = async (req, res) => {
  try {
    const { email } = req.body;
    const currentUser = await User.findOne({ email });
    if (currentUser === null) {
      const err = new Error("Invalid Email Address");
      throw err;
    }

    const payload = {
      email: currentUser.email,
      userId: currentUser._id,
      firstName: currentUser.firstName,
    };

    const PRIVATE_KEY = currentUser.hashedPassword;

    // First we generate token that we want to send to the user in email as params

    const token = jwt.sign(payload, PRIVATE_KEY, { expiresIn: 3600 });

    // After generating the token we are sending email using send-grid

    const subject = "Password Reset";
    const plainText = `  Dear ${currentUser.firstName} ! We have received your request to reset the password. Please follow
        the link to reset your password http://localhost:3000/password-reset/${currentUser.email}/${token}`;

    const htmlText = `
            <h2>Dear ${currentUser.firstName}!</h2>
            <p>We have received your request to reset the password. Please follow
            the link to reset your password 
                <a href= "http://localhost:3000/password-reset/${currentUser.email}/${token}">Click Here! </a>
            </p>`;

    const emailSent = await emailSender(
      currentUser.email,
      subject,
      plainText,
      htmlText
    );
    if (!emailSent) {
      const err = new Error("Something went wrong please try again");
      throw err;
    }
    res
      .status(200)
      .send(
        "Email sent on your registered email address , please follow the instructions"
      );
  } catch (error) {
    console.log(error.message);
    res.status(401).send(error.message);
  }
};

export const passwordRecovery = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    const { password, confirmPassword, email } = req.body;

    if (password !== confirmPassword) {
      const error = new Error("Password and Confirm Password must be same");
      throw error;
    }

    const userObject = await User.findOne({ email }, { hashedPassword: 1 });
    const PRIVATE_KEY = userObject.hashedPassword;

    const decodedData = jwt.verify(token, PRIVATE_KEY);

    // As we are going to store a new password in data base
    // And we keep only hashed passwords in our data base
    // That is why we need to Hash the password that user has provided to us

    const saltRounds = 11;
    const salt = await bcrypt.genSalt(saltRounds);
    const hashedPassword = await bcrypt.hash(password, salt);

    const currentUser = await User.findByIdAndUpdate(decodedData.userId, {
      hashedPassword,
    });
    res.status(201).send("Password changed successfully");
  } catch (err) {
    res.status(400).send(err.message);
  }
};
