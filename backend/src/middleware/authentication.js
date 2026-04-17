const jwt = require('jsonwebtoken');
const debug = require("debug")("backend:authentication");

// Load environment variables
const dotenv = require('dotenv');
dotenv.config();

// Import model
const User = require('../models/User');

// Middleware to authenticate requests using JWT
const authenticate = async (req, res, next) => {
    debug('Starting authentication middleware');
    
    const authHeader = req.headers.authorization;

    if(!authHeader || !authHeader.startsWith('Bearer ')) {
        debug('No token provided in Authorization header');
        return res.status(401).json({ message: 'No token provided' });
    }
    
    const token = authHeader.split(' ')[1];


    try{
        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Load user from database
        const user = await User.findById(decoded._id).select("_id role status");

        if(!user) return res.status(401).json({ message: 'Invalid user: user does not exist' });

        if(user.status === 'inactive') return res.status(403).json({ message: 'User is soft-deleted' });

        if(user.status !== 'active') return res.status(403).json({ message: 'User account is not active' });

        debug(`Authenticated user with role: ${user.role}`);

        // Attach the authenticated user to the request object
        req.user = {
            _id: user._id,
            role: user.role,
        }

        next();
    }catch(error){
        debug('Authentication error:', error);

        if(error.name === "TokenExpiredError") {
            const decodedToken = jwt.decode(token);
            const userId = decodedToken?._id;

            debug(`Token expired for userId: ${userId}`);
            
            try {
                await User.markUserOffline(userId);
            } catch (error) {
                debug('Error marking user offline:', error);
            }
        }

        return res.status(401).json({ 
            message: 'Invalid or expired token',
            error: error.message 
        });
    }
}

module.exports = {authenticate};