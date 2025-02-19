// Import the app created in app.js
const app = require("./src/app"); // Ensure this path is correct

// Define the port
const port = process.env.PORT || 5000;

// Start the server
app.listen(port, () => {
  console.log(`✅ Server running on port ${port}`);
});
