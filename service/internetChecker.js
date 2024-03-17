const fs = require("fs");
let logFilePath = "internet_checker.log"; // Specify the path for the log file

const checkConnectivity = async () => {
  try {
    let logMessage = "Google Sunucusna istek atiyorum";
    fs.appendFileSync(logFilePath, `${new Date().toISOString()} - ${logMessage}\n`);
    require("dns").resolve("www.google.com", function (err) {
      if (err) {
        console.log("No connection");
      } else {
        console.log("Connected");
      }

      logMessage = err ? "Internet is disconnected" : "Internet is connected";

      fs.appendFileSync(logFilePath, `${new Date().toISOString()} - ${logMessage}\n`);
    });

    // You can add logic here to handle disconnection
  } catch (error) {
    console.error("Error checking internet connectivity:", error);
    fs.appendFileSync(logFilePath, `${new Date().toISOString()} - Error: ${error.message}\n`);
  }
};

// Check connectivity every 1 minute
setInterval(checkConnectivity, 30000);
