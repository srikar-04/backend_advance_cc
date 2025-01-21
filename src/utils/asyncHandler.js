// EXPLANATION
// asyncHandler is a higherOrder function(it takes function as an argument and also return a function)
// the requestHandler function is an asynchronous function which returns a promise
// the asyncHandler returns a "middleware function" which has acess to req, res, next objects
// the promise returned by the requestHandler is resolved in this asyncHandler, without writing try-catch syntax for all the await tasks in the requestHandler

const asyncHandler = (requestHandler) => {
    return (req, res, next)  => {
        Promise
        .resolve(requestHandler(req, res, next))
        .catch((err) => next(err))
    }
}

export {asyncHandler}


// const asyncHandler = (fn) => async (req, res, next) => {
//     try {
//         await fn(req, res, next)
//     } catch (error) {
//         res.status(error.code || 500).json({
//             success: false,
//             message: error.message
//         })
//     }
// }