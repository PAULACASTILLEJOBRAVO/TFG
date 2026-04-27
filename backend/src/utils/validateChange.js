const bcrypt = require('bcryptjs');

// Function to validate the password change
const validatePasswordChange = async ({isSelf, currentUserRole, oldPassword, userPasswordHash}) => {
    // If the user is changing their own password, verify the old password
    if(isSelf) {
        if(!oldPassword) throw new Error('Old password is required to change your own password');

        const isValid = await bcrypt.compare(oldPassword, userPasswordHash);
        if(!isValid) throw new Error('Old password is incorrect');

        return true;
    }

    // If an admin is changing another user's password, no need to verify old password
    if(currentUserRole === 'admin') {
        return true;
    }

    // For other roles, deny permission
    throw new Error('You do not have permission to change this password');
}

// Export the function
module.exports = {
    validatePasswordChange
};