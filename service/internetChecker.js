const isOnline = import("is-online").then((module) => module.default);
const { exec } = require("child_process");
const fs = require("fs");

const logFilePath = "internet_checker.log"; // Specify the path for the log file

const checkConnectivity = async () => {
  try {
    const online = await isOnline();
    const logMessage = online ? "Internet is connected" : "Internet is disconnected";
    console.log(logMessage);
    fs.appendFileSync(logFilePath, `${new Date().toISOString()} - ${logMessage}\n`);
    // You can add logic here to handle disconnection
  } catch (error) {
    console.error("Error checking internet connectivity:", error);
    fs.appendFileSync(logFilePath, `${new Date().toISOString()} - Error: ${error.message}\n`);
  }
};

// Check connectivity every 1 minute
setInterval(checkConnectivity, 60000);
