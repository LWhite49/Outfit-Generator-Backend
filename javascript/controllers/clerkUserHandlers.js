const { clerkClient } = require("@clerk/express");

// Route to get all users
const getUsers = async (req, res) => {
	const users = await clerkClient.users.getUserList();
	res.json(users);
};

module.exports = { getUsers };
