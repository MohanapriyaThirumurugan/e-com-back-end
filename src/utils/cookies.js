// import asyncerrorhandler from '../Common/Asyncerrorhandler.js'
// import ErrorHandler from '../Common/errorHandler.js'
// import jwt from 'jsonwebtoken'
// import userdatabase from '../Models/userDetails.js'

// const sendcookies=asyncerrorhandler(async(req,res,next)=>{
//     const {token}=req.cookies
//     if(!token){
//         return next(new ErrorHandler('you have to login first', 401))
// }
// const decoder=jwt.verify(token,process.env.sckey)
// req.user= await userdatabase.findById(decoder.id)
// next()

// })
// const authorizeRoles = (...roles) => {
//     return  (req, res, next) => {
//          if(!roles.includes(req.user.role)){
//              return next(new ErrorHandler(`Role ${req.user.role} is not allowed`, 401))
//          }
//          next()
//      }
//  }
// export default{
//     sendcookies,
//     authorizeRoles
// } 

import ErrorHandler from '../Common/errorHandler.js'
import jwt from 'jsonwebtoken'
import asyncerrorhandler from '../Common/Asyncerrorhandler.js'
import userdatabase from '../Models/userDetails.js'


const extractTokenFromHeader = (req) => {
    // Check if Authorization header is present
    const authHeader = req.headers.authorization

    // Check if authHeader is present and has the correct format
    if (authHeader && authHeader.startsWith('Bearer')) {
        // Return the token part of the header
        return authHeader.split(' ')[1]
    }
    return null
}

const sendTokenInHeader = asyncerrorhandler(async (req, res, next) => {
    // Extract JWT token from the authorization header
    const token = extractTokenFromHeader(req)

    if (!token) {
        return next(new ErrorHandler('Authorization token not found', 401))
    }

    try {
        // Verify the JWT token
        const decoded = jwt.verify(token, process.env.SCKEY)

        // Find user by id in the database
        const user = await userdatabase.findById(decoded.id)

        // Attach the user object to the request
        req.user = user

        next()
    } catch (error) {
        return next(new ErrorHandler('Invalid or expired token', 401))
    }
})

const authorizeRoles = (...roles) => {
    return (req, res, next) => {
        if (!req.user || !roles.includes(req.user.role)) {
            return next(new ErrorHandler(`Role ${req.user ? req.user.role : 'undefined'} is not allowed`, 401))
        }
        next()
    }
}

export default {
    sendTokenInHeader,
    authorizeRoles
}
