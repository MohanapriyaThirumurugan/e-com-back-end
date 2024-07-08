// const sendtoken=(user,statuscode,res)=>{


//     // creating jwt token
//     const token =user.getJwtToken()
//     // setting cookie
//     const option={
//         expires:new Date(
//             Date.now()+process.env.cokkieexp*24*60*60*1000
//         ),
//         httpOnly:true,

//     }
//     res.status(statuscode)
//     .cookie('token',token,option)
//     .json({
//         success:true,
//         token,
//         user
//     })
// }
// export default sendtoken
    
const sendToken = (user, statusCode, res) => {
    // Creating JWT token
    const token = user.getJwtToken()

    // Sending response with token in the authorization header
    res.status(statusCode)
        .header('Authorization', `Bearer ${token}`)
        .json({
            success: true,
            token,
            user
        })
}

export default sendToken
