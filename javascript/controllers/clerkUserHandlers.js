const { clerkClient } = require("@clerk/express");

// Function to delete user given their ID
const deleteUser = async (req, res) => {
	try {
		console.log("Deleting user with ID: ", req.body.id);
		await clerkClient.users.deleteUser(req.body.id);
		console.log("User deleted");
		res.json({ message: "User deleted" });
	} catch (error) {
		console.log(`User not found: ${error}`);
		res.json({ message: `User not found: ${error}` });
	}
};

module.exports = { deleteUser };
