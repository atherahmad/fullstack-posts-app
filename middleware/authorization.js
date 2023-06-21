import jwt from 'jsonwebtoken'

export const authorizationHandler = (req, res, next) =>{
    try{
    const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY
    const token = req.headers.authorization?.split(" ")[1]
    if(!token){
        const error = new Error("Not Authorized")
        error.statusCode = 401
        throw error
    } 
    const payload = jwt.verify(token, JWT_SECRET_KEY)

    req.email = payload.email
    req.userId = payload.userId
    next()
}
catch(err){
    next(err)
}
}