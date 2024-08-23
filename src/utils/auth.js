
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
