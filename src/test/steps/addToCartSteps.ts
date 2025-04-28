import {Given, When, Then, setDefaultTimeout} from "@cucumber/cucumber"
import{ expect} from "@playwright/test"
import { fixture } from "../../hooks/pageFixture";

setDefaultTimeout(60 * 1000 * 2)

Given('user search for a {string}', async function (book) {
    fixture.logger.info("user searches for a book")
    await fixture.page.locator("input[type='search']").fill(book)
    await fixture.page.waitForTimeout(2000)
    await fixture.page.locator("mat-option[role='option'] span").click()
});

When('user add the book to the cart', async function () {
    await fixture.page.locator("(//button[contains(@class,'mdc-button mdc-button--raised')]//span)[1]").click()
});



Then('the cart badge should get updated', async function () {
    await fixture.page.waitForTimeout(2000)
    const badgeCount = await fixture.page.locator("#mat-badge-content-0").textContent();
    expect(Number(badgeCount)).toBeGreaterThan(0)
});