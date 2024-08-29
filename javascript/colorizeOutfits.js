// Import the child process so we can run py scripts
const { spawn } = require("child_process");
const path = require("path");

const coolFunction = () => {
	return new Promise((resolve, reject) => {
		// Start process
		const pyProcess = spawn("python", [
			path.join(__dirname, "/controllers", "color_assignment.py"),
		]);
		// Parse good output
		pyProcess.stdout.on("data", (data) => {
			console.log(data.toString());
			resolve("very nice");
		});
		// Parse error output
		pyProcess.stderr.on("data", (data) => {
			console.log(data.toString());
			reject("very bad");
		});
	});
};

coolFunction();
