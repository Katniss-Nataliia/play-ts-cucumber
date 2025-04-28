const fs = require("fs-extra");

try {
    fs.ensureDir("test-reports");
    fs.emptyDir("test-reports")
} catch (error) {
    console.log("Folder not created! "+error)
}