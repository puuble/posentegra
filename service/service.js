const Service = require("node-windows").Service;

// Create a new service object
const svc = new Service({
  name: "PosEntegraInternetCheck",
  description: "Bu internetinizin var olup olmadigini kontrol eder",
  script: "C:\\peClientV3\\service\\internetChecker.js",
});

// Listen for the "install" event, which indicates the service is installed
svc.on("install", () => {
  svc.start();
});

// Install the service
svc.install();
