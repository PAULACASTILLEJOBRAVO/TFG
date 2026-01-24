const debug = require('debug')('app:authenticationController');

// Import model
const User = require('../../models/User');
const { checkExists } = require('../../utils/checkExists');

// Import services
const authenticationServices = require('../../services/v1/authenticationService');

// Controller to login an user
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        if(!email || !password) return res.status(400).json({ message: 'Email and password are required'});

        const user = await User.findOne({ email });
        if(!user) return res.status(404).json({ message: 'User does not exist'});
        if(user.isDeleted) return res.status(403).json({ message: 'User account is deleted'});
        if(!user.isActive) return res.status(403).json({ message: 'User account is not active'});
        // if(!user.password) return res.status(401).json({ message: 'User has no password set'});

        const isMatch = await user.comparePassword(password);
        
        if(!isMatch) return res.status(401).json({ message: 'Invalid password'});

        await user.markOnline();

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

// Controller to logout an user
const logoutUser = async (req, res) => {
    try{
        const userLoggin = req.user;

        if(!userLoggin) return res.status(403).json({message: "Unauthorized"});

        const user = await User.findById(userLoggin._id);

        await user.markOffline();

        res.status(200).json({
            message: 'Logout successful'
        });
    } catch (error) {
        res.status(500).json({
            message: 'Error logging out user',
            error: error.message
        });
    }
}

// Controller to register an user
const registerUser = async (req, res) => {
    const { body } = req;
    const { email, username, password } = req.body;

    // Si no hay body, devuelve 400
    if (!body) return res.status(400).json({ message: 'Username, email and password are required' });

    // Check required fields
    if (!email || !username || !password) return res.status(400).json({ message: 'Username, email and password are required' });

    try{
        if (await checkExists(User, 'email', email)) {
            return res.status(409).json({ message: 'The user alredy exists' });
        }

        const newUser = await authenticationServices.registerUser({email, username, password});

        res.status(201).json({
            message: 'User registered successfully', 
            data: newUser
        });    
    } catch(error){
        res.status(500).json({ 
            message: 'Error registering user', 
            error: error.message 
        });
    }

}

// Export the module
module.exports = {
    loginUser,
    logoutUser,
    registerUser
};