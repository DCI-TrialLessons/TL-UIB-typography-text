const puppeteer = require("puppeteer");
const path = require('path');

const browserOptions = {
    headless: true,
    ignoreHTTPSErrors: true,
    defaultViewport: null,
    devtools: false,
}
let browser;
let page;

beforeAll(async () => {
    browser = await puppeteer.launch(browserOptions);
    page = await browser.newPage();
    await page.goto('file://' + path.resolve('./index.html'));
}, 30000);

afterAll((done) => {
    try { 
        this.puppeteer.close(); 
    } catch (e) 
    {} 
    done();
});

describe("UIB Typography", () => {
    it("Index file should contain appropriate meta tags", async () => {
        const metaTags = await page.$$('meta');
        expect(metaTags.length).toBeGreaterThan(1);
    });

    it("Index file Should contain a title tag that is not empty", async () => {
        const title = await page.$eval('title', el => el.innerHTML);
        expect(title).not.toBe('');
    });

    it("Index file should contain an import font from Google fonts", async () => {
        const font = await page.$eval('link', el => el.href);
        expect(font).toContain('https://fonts.googleapis.com/');
    });

    it("Multiple font Weights should be imported", async () => {
        const font = await page.$eval('link', el => el.href);
        expect(font).toContain('300');
        expect(font).toContain('400');
        expect(font).toContain('700');
    });

    it("H1 tag should have a style of underlined", async () => {
        const h1 = await page.$eval('h1', el => getComputedStyle(el).textDecoration);
        expect(h1).toBe('underline solid rgb(0, 0, 0)');
    });

    it("All list items Should have a light font weight", async () => {
        const listItems = await page.$$('li');
        expect(listItems.length).toBeGreaterThan(1);
        for (let i = 0; i < listItems.length; i++) {
            const li = await page.$eval('li', el => getComputedStyle(el).fontWeight);
            expect(li).toBe('300');
        }
    });
    it("All Heading with the class of 'heading' Should have a shadow, and be Uppercase", async () => {
        const headings = await page.$$('.heading');
        expect(headings.length).toBeGreaterThan(1);
        for (let i = 0; i < headings.length; i++) {
            const shadow = await page.$eval('.heading', el => getComputedStyle(el).textShadow);
            expect(shadow).toBeTruthy();
            const headingUpper = await page.$eval('.heading', el => getComputedStyle(el).textTransform);
            expect(headingUpper).toBe('uppercase');

        }
    });

    it("Elements with the class of 'note' Should have a bold font weight, and be italic", async () => {
        const noteBold = await page.$eval('.note', el => getComputedStyle(el).fontWeight);
        expect(noteBold).toBe('700');
        const noteItalic = await page.$eval('.note', el => getComputedStyle(el).fontStyle);
        expect(noteItalic).toBe('italic');

    });

    it("Element with the class of 'todo-item' Should be striked through", async () => {
        const todoItem = await page.$eval('.todo-item', el => getComputedStyle(el).textDecoration);
        expect(todoItem).toBe('line-through solid rgb(0, 0, 0)');

    });
});