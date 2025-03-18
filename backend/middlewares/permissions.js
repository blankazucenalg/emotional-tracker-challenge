const User = require('../models/userModel');


async function therapistSeePatientData(req, res, next) {
    const authenticatedUser = req.user._id;
    const selectedUserId = req.params.id;

    try {
        const selectedUser = await User.findOneById(selectedUserId, { therapistId: 1 });

        if (!selectedUser) {
            res.status(404).json({ message: 'User not found.' });
        }
        if (selectedUserId !== authenticatedUser && selectedUser.therapistId !== authenticatedUser) {
            res.status(403).json({ message: `You don't have permission to see this.` })
        }
        next();

    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
}

// TODO: Add authorization methods
// Are user basic profiles visible for any authenticated user? 
module.exports = {
    therapistSeePatientData
}