import {Given, When, Then, setDefaultTimeout} from "@cucumber/cucumber"
import{Page, Browser, chromium, expect} from "@playwright/test"
import { fixture } from "../../hooks/pageFixture";

setDefaultTimeout(60 * 1000 * 2)

Given("User navigates to the application", async function () {
    await fixture.page.goto(process.env.BASEURL)
})

When('User click on the login link', async function () {
    await fixture.page.locator("//span[normalize-space(text())='Login']").click()
    await fixture.page.waitForLoadState();
    
});

Given('User enter the username as {string}', async function (username) {
    await fixture.page.locator("input[formcontrolname='username']").type(username)
});

Given('User enter the password as {string}', async function (password) {
    await fixture.page.locator("input[formcontrolname='password']").type(password)
});

When('User click on the login button', async function () {
    await fixture.page.locator("(//span[text()='Login']/following-sibling::span)[2]").click()
    fixture.logger.info("waiting for 2 sec")
    await fixture.page.waitForTimeout(2000)
});

Then('Login should be success', async function () {
    const text = await fixture.page.locator("(//span[@class='mdc-button__label']//span)[1]").textContent()
    fixture.logger.info("Username: " + text)
    
});
