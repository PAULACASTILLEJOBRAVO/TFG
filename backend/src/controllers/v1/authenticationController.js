const debug = require('debug')('app:authenticationController');

// Import model
const User = require('../../models/User');

// Controller to login a user
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        if(!email || !password) return res.status(400).json({ message: 'Email and password are required'});

        console.log(email.length);
        console.log((await User.findOne({})).email.length);


        const user = await User.findOne({ email });
        if(!user) return res.status(404).json({ message: 'User does not exist'});
        // if(!user.password) return res.status(401).json({ message: 'User has no password set'});

        console.log("Password input:", password);
        console.log("Password hash:", user.password);
        const isMatch = await user.comparePassword(password);
        console.log("Direct bcrypt.compare:", isMatch);
        
        if(!isMatch) return res.status(401).json({ message: 'Invalid password'});

        const token = await user.generateAuthToken();

        res.status(200).json({
            message: 'Login successful',
            data: {
                _id: user._id,
                token,
                username: user.username,
                email: user.email,
                role: user.role
            }
        });
    }catch (error) {
        debug('Error logging in user:', error);
        res.status(500).json({
            message: 'Error logging in user',
            error: error.message
        });
    }
}

// Export the module
module.exports = {
    loginUser
};