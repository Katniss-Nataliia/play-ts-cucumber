import { BeforeAll, AfterAll, After, Before } from "@cucumber/cucumber";
import{Page, Browser, chromium} from "@playwright/test"
import { pageFixture } from "./pageFixture";

let browser:Browser;


Before(async function(){
    browser = await chromium.launch({headless:false})
    const page = await browser.newPage()
    pageFixture.page = page
})
After(async function(){
    await pageFixture.page.close()
    await browser.close()
})