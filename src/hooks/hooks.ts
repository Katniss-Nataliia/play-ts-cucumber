import { BeforeAll, AfterAll, After, Before, AfterStep, BeforeStep, Status } from "@cucumber/cucumber";
import{Page, Browser, chromium, BrowserContext} from "@playwright/test"
import { fixture } from "./pageFixture";
import { invokeBrowser } from "../helper/browsers/browserManager";
import { getEnv } from "../helper/env/env";
import { createLogger } from "winston";
import { options } from "../helper/util/logger";
const fs = require("fs-extra");

let browser:Browser;
let context: BrowserContext; //Кожен тест має чисту сесію без кешу, куків і локальних даних.

BeforeAll(async function (){
    getEnv()
    browser = await invokeBrowser()
})

// It will trigger for not auth scenarios
Before({ tags: "not @auth" }, async function ({ pickle }) {
    const scenarioName = pickle.name + pickle.id
    context = await browser.newContext({
        recordVideo: {
            dir: "test-reports/videos",
        },
    });
    await context.tracing.start({
        name: scenarioName,
        title: pickle.name,
        sources: true,
        screenshots: true, snapshots: true
    });
    const page = await context.newPage();
    fixture.page = page;
    fixture.logger = createLogger(options(scenarioName));
});



// It will trigger for auth scenarios
Before({ tags: '@auth' }, async function ({ pickle }) {
    const scenarioName = pickle.name + pickle.id
    context = await browser.newContext({
        storageState: getStorageState(pickle.name),
        recordVideo: {
            dir: "test-reports/videos",
        },
    });
    await context.tracing.start({
        name: scenarioName,
        title: pickle.name,
        sources: true,
        screenshots: true, snapshots: true
    });
    const page = await context.newPage();
    fixture.page = page;
    fixture.logger = createLogger(options(scenarioName));
});
// AfterStep(async function({pickle, result}){
//     const img = await pageFixture.page.screenshot({path:`./test-result/screenshots/${pickle.name}`, type:"png"})
//     this.attach(img, "image/png") //це Cucumber-метод, щоб прикріпити дані до репорту. "image/png" — вказуєш, що це саме зображення у форматі PNG.

// })

// After(async function({pickle, result}){     // pickle = scenario name
//     console.log(result?.status)
//     let videoPath:string
//     let img: Buffer
//     //screenshot & video
//     if (result?.status == Status.FAILED){
//         img = await fixture.page.screenshot({path:`./test-reports/screenshots/${pickle.name}.png`, type:"png"})
//         videoPath = await fixture.page.video().path()
//     }
//     await fixture.page.close()
//     await context.close()
//     if(result?.status == Status.FAILED){
//         this.attach(img, "image/png") 
//         this.attach(
//            await fs.readFileSync(videoPath),
//             'video/webm'
//         )
//     }
// })
After(async function ({ pickle, result }) {
    let videoPath: string;
    let img: Buffer;
    const path = `./test-reports/trace/${pickle.id}.zip`;
    if (result?.status == Status.PASSED) {
        img = await fixture.page.screenshot(
            { path: `./test-reports/screenshots/${pickle.name}.png`, type: "png" })
        videoPath = await fixture.page.video().path();
    }
    await context.tracing.stop({ path: path });
    await fixture.page.close();
    await context.close();
    if (result?.status == Status.PASSED) {
        await this.attach(
            img, "image/png"
        );
        await this.attach(
            fs.readFileSync(videoPath),
            'video/webm'
        );
        const traceFileLink = `<a href="https://trace.playwright.dev/">Open ${path}</a>`
        await this.attach(`Trace file: ${traceFileLink}`, 'text/html');

    }

});

AfterAll(async function(){
    await browser.close()
    // fixture.logger.close()
})
function getStorageState(user: string): string | { cookies: { name: string; value: string; domain: string; path: string; expires: number; httpOnly: boolean; secure: boolean; sameSite: "Strict" | "Lax" | "None"; }[]; origins: { origin: string; localStorage: { name: string; value: string; }[]; }[]; } {
    if (user.endsWith("admin"))
        return "src/helper/auth/admin.json";
    else if (user.endsWith("lead"))
        return "src/helper/auth/lead.json";
}