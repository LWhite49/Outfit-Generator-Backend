const mongoose = require('mongoose');
const dotenv = require('dotenv');
const connectMongoose = require('./mongo-config/connectMongoose');
dotenv.config();
const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
const { Cluster } = require('puppeteer-cluster');
// Import the DB collections
const TopMen = require('./mongo-config/Top-Men.js');
const BottomMen = require('./mongo-config/Bottom-Men.js');
const ShoeMen = require('./mongo-config/Shoe-Men.js');

// Define array of collection names
const collectionNames = ['topmens', 'bottommens', 'shoemens'];

// Puppeteer middleware
puppeteer.use(StealthPlugin());

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
        let urlExtension = "";
        switch(collectionName) {
            case 'topmens':
                urlExtension = "/categories/tops"
                break;
            case 'bottommens':
                urlExtension = "/categories/bottoms"
                break;
            case 'shoemens':
                urlExtension = "/categories/footwear"
                break;
            default:
                console.log('Invalid collection name');
                return;
        }
        // Source URL and declare the array to store the listings
        let scrapeUrl = process.env.SCRAPE_URL;
        scrapeUrl += urlExtension;

        const listings = [];
        // Page config
        await page.setViewport({width: 2560, height: 1440});
        await page.setExtraHTTPHeaders({ 
            'user-agent': 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36', 
            'upgrade-insecure-requests': '1', 
            'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8', 
            'accept-encoding': 'gzip, deflate, br', 
            'accept-language': 'en-US,en;q=0.9,en;q=0.8' 
        });
        // Go to the Grailed homepage
        await page.goto(scrapeUrl);
        await page.waitForTimeout(1500 * Math.random() + 3000);
        // Navigate popup
        await page.click('.Page-Header-CategoriesNavigation');
        await page.waitForTimeout(1500 * Math.random() + 3000);
        await jiggleMouse(page);
        await page.keyboard.down('Escape');
        await page.waitForTimeout(10);
        await page.keyboard.up('Escape');
        await jiggleMouse(page);
        await page.waitForTimeout(1500 * Math.random() + 2000);
        await scrollToBottom(page);
        // Scroll to bottom of page


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
            puppeteerOptions: {headless: false}
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