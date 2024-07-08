class ErrorHandler extends Error {
    constructor(message, statusCode){
        super(message)
        this.statusCode = statusCode;
        Error.captureStackTrace(this, this.constructor)
    }
}
export default ErrorHandler

// this parent class to handle th error
// message in constructor is message in api calles "page is not found like that"
//status code means 200 500 like that
// capturestacktrace means where your mistake is found
