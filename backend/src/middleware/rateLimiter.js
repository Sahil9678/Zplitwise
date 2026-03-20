import ratelimit from "../config/upstash.js";

const rateLimiter = async (req, res, next) => {
    try{
        //We will put the user id or the IP address in the limit function to identify the user and limit the requests based on that.
        const {success}= await ratelimit.limit("ratelimit-userid");

        if(!success){
            return res.status(429).json({message: "Too many requests, please try again later."});
        }

        next();

    } catch (error) {
        console.error("Error in rate limiter middleware: ", error);
        next(error);
    }
}

export default rateLimiter;