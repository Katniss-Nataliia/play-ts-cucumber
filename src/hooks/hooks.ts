import { BeforeAll, AfterAll, After, Before, AfterStep, BeforeStep, Status } from "@cucumber/cucumber";
import{Page, Browser, chromium, BrowserContext} from "@playwright/test"
import { fixture } from "./pageFixture";
import { invokeBrowser } from "../helper/browsers/browserManager";
import { getEnv } from "../helper/env/env";
import { createLogger } from "winston";
import { options } from "../helper/util/logger";

let browser:Browser;
let context: BrowserContext; //Кожен тест має чисту сесію без кешу, куків і локальних даних.

BeforeAll(async function (){
    getEnv()
    browser = await invokeBrowser()
})

Before(async function({pickle}){
    const scenarioName = pickle.name + pickle.id
    context = await browser.newContext()
    const page = await context.newPage()
    fixture.page = page
    fixture.logger = createLogger(options(scenarioName))
})

// AfterStep(async function({pickle, result}){
//     const img = await pageFixture.page.screenshot({path:`./test-result/screenshots/${pickle.name}`, type:"png"})
//     this.attach(img, "image/png") //це Cucumber-метод, щоб прикріпити дані до репорту. "image/png" — вказуєш, що це саме зображення у форматі PNG.

// })

After(async function({pickle, result}){     // pickle = scenario name
    console.log(result?.status)
    //screenshot
    if (result?.status == Status.FAILED){
        const img = await fixture.page.screenshot({path:`./test-reports/screenshots/${pickle.name}.png`, type:"png"})
        this.attach(img, "image/png") //це Cucumber-метод, щоб прикріпити дані до репорту. "image/png" — вказуєш, що це саме зображення у форматі PNG.
    }
    await fixture.page.close()
    await context.close()
})

AfterAll(async function(){
    await browser.close()
    fixture.logger.close()
})