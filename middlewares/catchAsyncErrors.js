module.exports = fun => (req, res, next) => {
   // Waiting for the promise resolution
   Promise.resolve( fun(req,res,next))
    .catch(next);// If there is an error, it advances to the next middleware, which is the error handler.
    //.catch(error => console.log('error in Promise'));// if err next to the next middleware

}