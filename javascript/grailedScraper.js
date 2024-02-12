const mongoose = require('mongoose');
const dotenv = require('dotenv');
const connectMongoose = require('./mongo-config/connectMongoose');
dotenv.config();
const fsProm = require('fs').promises;
const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
const AnonymizeUAPlugin = require('puppeteer-extra-plugin-anonymize-ua');
const { Cluster } = require('puppeteer-cluster');
// Import the DB collections
const TopMen = require('./mongo-config/Top-Men.js');
const BottomMen = require('./mongo-config/Bottom-Men.js');
const ShoeMen = require('./mongo-config/Shoe-Men.js');

// Define array of collection names
const collectionNames = ['topmens', 'bottommens', 'shoemens'];

// Puppeteer middleware
puppeteer.use(StealthPlugin());
puppeteer.use(AnonymizeUAPlugin());

// Define function that accepts a page and jiggles the mouse
const jiggleMouse = async (page) => {
    try {
        await page.evaluate(async () => {
            try {
                window.scrollBy(400 * Math.random() + 50,-400 * Math.random() - 50);
                await page.waitForTimeout(1000 * Math.random() + 300);
                window.scrollBy(-400 * Math.random() - 50, 400 * Math.random() + 50);
            } catch (err) { console.log(err); }
        });
    } catch (err) { console.log(err); }
}

// Define function that accepts a page and scrolls to the bottom of the content window
const scrollToBottom = async (page) => {
    try {
        // Get current page height
        const LastHeight = await page.evaluate(() => {return document.body.scrollHeight;});
        // Scroll a couple times
        await page.evaluate(() => {window.scrollBy(0, 400 * Math.random() + 1400);});
        await page.waitForTimeout(500 * Math.random() + 300);
        await page.evaluate(() => {window.scrollBy(0, 400 * Math.random() + 1400);});
        await page.waitForTimeout(500 * Math.random() + 300);
        // While loop that scrolls until the page height does not change
        while (LastHeight !== await page.evaluate(() => {return document.body.scrollHeight;})) {
            LastHeight = await page.evaluate(() => {return document.body.scrollHeight;});
            await page.evaluate(() => {window.scrollBy(0, 400 * Math.random() + 1400);});
            await page.waitForTimeout(500 * Math.random() + 300);
            await page.evaluate(() => {window.scrollBy(0, 400 * Math.random() + 1400);});
            await page.waitForTimeout(500 * Math.random() + 300);
            await jiggleMouse(page);
        }
    } catch (err) { console.log(err);}
}
// Define the GrailedScraper function that scrapes the Grailed website and returns an array of listings for the passed collection name. 
// It accepts a puppeteer page generated for the cluster task, since this will be used in cluster.task().
const scrapeCollectionListings = async (page, collectionName) => {
    try {
        // Get the collection targetors
        let elementTargetors = {};
        switch(collectionName) {
            case 'topmens':
                elementTargetors = {
                    dropdownTargetor: 'menswear',
                    dropdownElemTargetor: 'tops'
                }
                break;
            case 'bottommens':
                elementTargetors = {
                    dropdownTargetor: 'menswear',
                    dropdownElemTargetor: 'bottoms'
                }
                break;
            case 'shoemens':
                elementTargetors = {
                    dropdownTargetor: 'menswear',
                    dropdownElemTargetor: 'shoes'
                }
                break;
            default:
                console.log('Invalid collection name');
                return;
        }
        // Source URL and declare the array to store the listings
        let scrapeUrl = process.env.SCRAPE_URL;
        const listings = [];
        // Page config with cookies
        let c = await fsProm.readFile('./cookies/cookies.json');
        c = JSON.parse(c);
        await page.setCookie(...c);
        // Go to the Depop homepage
        await page.goto(scrapeUrl);
        await page.waitForTimeout(1500 * Math.random() + 3000);
        await jiggleMouse(page);
        await page.waitForTimeout(1500 * Math.random() + 1000);
        // Accept cookies
        const popup = await page.$('button[data-testid="cookieBanner__acceptAllButton"]');
        if (popup) {
            await page.click('button[data-testid="cookieBanner__acceptAllButton"]');
            await jiggleMouse(page);
        }
        // Save cookies
        const cookies = await page.cookies();
        await fsProm.writeFile('./cookies/cookies.json', JSON.stringify(cookies, null, 2));
        // Hover relevant dropdown
        await jiggleMouse(page);
        await page.waitForTimeout(1000 * Math.random() + 1000);
        const dropdowns = await page.$$('button[type="button"]');
        for (let dropdown of dropdowns) {
            let dropdownText = await dropdown.evaluate(e => e.innerText);
            dropdownText = dropdownText.toLowerCase()
            if (dropdownText == elementTargetors.dropdownTargetor) {
                await dropdown.hover();
                await page.waitForTimeout(1000 * Math.random() + 1000);
                console.log('Hovered over dropdown');
                break;
            }
        }
        await page.waitForTimeout(1000 * Math.random() + 1000);

        // Click the dropdown element
        const dropdownElems = await page.$$('p[class="sc-eDnWTT NavigationCategoryList-styles__CategoryListItemText-sc-5e15d078-4 kcKICQ kjOAJZ"]');
        for (let dropdownElem of dropdownElems) {
            let dropdownElemText = await dropdownElem.evaluate(e => e.innerText);
            dropdownElemText = dropdownElemText.toLowerCase();
            if (dropdownElemText == elementTargetors.dropdownElemTargetor) {
                await dropdownElem.click();
                await page.waitForTimeout(1000 * Math.random() + 1000);
                console.log('Navigated to new page');
                break;
            }
        }
        await page.waitForTimeout(1000 * Math.random() + 5000);

    } catch (err) { console.log(err);}
}

// Define cluster scraping function that utlizes the functions defined above to scrape the website for each collection, simultaneously. 
// Each thread of the collection will also update the DB with the listings it has scraped.
const scrapeWithClusters = async () => {
    try {
        // Create cluster
        const cluster = await Cluster.launch({
            concurrency: Cluster.CONCURRENCY_CONTEXT,
            maxConcurrency: 1,
            puppeteerOptions: {
                headless: false
            }
        });
        // Define cluster task
        cluster.task( async ( {page, data} ) => {
            try {
                // Scrape array of listings for passed collection name
                let collectionName = data.collectionName;
                const listings = await scrapeCollectionListings(page, collectionName);
                console.log(listings);

                // Update DB with new listings
            } catch (err) { console.log(err); }
        });
        // Iterate through collection names to queue threads
        for (let collectionName of collectionNames) { cluster.queue({collectionName: collectionName}); }
        // Wait for threads to idel and close cluster
        await cluster.idle();
        await cluster.close();

    } catch (err) { console.log(err); }
}
// Connect to DB
connectMongoose();
scrapeWithClusters();