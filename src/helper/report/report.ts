const report = require("multiple-cucumber-html-reporter");

report.generate({
    jsonDir: "test-reports",
    reportPath: "test-reports/reports/",
    reportName: "Playwright Automation Report",
    embeddedScreenshots: true,
    pageTitle: "BookCart App test report",
    displayDuration: false,
    metadata: {
        browser: {
            name: "chrome",
            version: "112",
        },
        device: "Nataliia Boiko - PC",
        platform: {
            name: "Windows",
            version: "11",
        },
    },
    customData: {
        title: "Test Info",
        data: [
            { label: "Project", value: "Book Cart Application" },
            { label: "Release", value: "1.2.3" },
            { label: "Cycle", value: "Smoke-1" }
        ],
    },
});