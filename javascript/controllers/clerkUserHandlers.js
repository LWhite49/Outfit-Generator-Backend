const { clerkClient } = require("@clerk/express");

// Function to initialize Clerk user metadata
const initializeUser = async (req, res) => {
	try {
		console.log("Initializing user with ID: ", req.body.id);
		await clerkClient.users.updateUser(req.body.id, {
			public_metadata: {
				user_vector: [0, 0, 0],
				saved_outfits: [],
				size_data: {
					top_sizes: [],
					bottom_sizes: [],
					shoe_sizes: [],
				},
				gender_data: {
					top: 0,
					bottom: 0,
					shoe: 0,
				},
			},
		});
		console.log("User initialized");
		res.json({ message: "User initialized" });
	} catch (error) {
		console.log(`User not found: ${error}`);
		res.json({ message: `User not found: ${error}` });
	}
};
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

module.exports = { deleteUser, initializeUser };
