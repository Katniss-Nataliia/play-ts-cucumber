import {Given, When, Then, setDefaultTimeout} from "@cucumber/cucumber"
import{Page, Browser, chromium, expect} from "@playwright/test"
import { pageFixture } from "../../hooks/pageFixture";

setDefaultTimeout(60 * 1000 * 2)

Given("User navigates to the application", async function () {
    await pageFixture.page.goto("https://bookcart.azurewebsites.net/")
})

When('User click on the login link', async function () {
    await pageFixture.page.locator("//span[normalize-space(text())='Login']").click()
    await pageFixture.page.waitForLoadState();
    
});

Given('User enter the username as {string}', async function (username) {
    await pageFixture.page.locator("input[formcontrolname='username']").type(username)
});

Given('User enter the password as {string}', async function (password) {
    await pageFixture.page.locator("input[formcontrolname='password']").type(password)
});

When('User click on the login button', async function () {
    await pageFixture.page.locator("(//span[text()='Login']/following-sibling::span)[2]").click()
    await pageFixture.page.waitForTimeout(2000)
});

Then('Login should be success', async function () {
    const text = await pageFixture.page.locator("(//span[@class='mdc-button__label']//span)[1]").textContent()
    console.log("Username: " + text)
    
});
