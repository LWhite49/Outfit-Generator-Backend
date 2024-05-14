const mongoose = require('mongoose');
const dotenv = require('dotenv');
const process = require('process');
const connectMongoose = require('./connectMongoose.js');
dotenv.config();
const fsProm = require('fs').promises;
const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
const AnonymizeUAPlugin = require('puppeteer-extra-plugin-anonymize-ua');
// Import the DB collections
const TopMen = require('./mongo-config/Top-Men.js');
const BottomMen = require('./mongo-config/Bottom-Men.js');
const ShoeMen = require('./mongo-config/Shoe-Men.js');
const TopWomen = require('./mongo-config/Top-Women.js');
const BottomWomen = require('./mongo-config/Bottom-Women.js');
const ShoeWomen = require('./mongo-config/Shoe-Women.js');

// Define array of names of each collection
const collectionNames = ["TopMen", "BottomMen", "ShoeMen", "TopWomen", "BottomWomen", "ShoeWomen"];

// Define array of collection names
const collectionObjs = [TopMen, BottomMen, ShoeMen, TopWomen, BottomWomen, ShoeWomen];

// Define array of collection URL targetors
const elementTargetors = [
    "category/mens/tops/",
    "category/mens/bottoms/",
    "category/mens/shoes/",
    "category/womens/tops/",
    "category/womens/bottoms/",
    "category/womens/shoes/"
];

// Puppeteer middleware
puppeteer.use(StealthPlugin());
puppeteer.use(AnonymizeUAPlugin());

// Define function that initializes TTL for each collection
const initTTL = async () => {
    try {
        for (let collectionObj of collectionObjs) {
        // TTL so documents expire in 14 days
        collectionObj.collection.createIndex({createdAt: 1}, {expireAfterSeconds: 1210000});
        }
    } catch (err) { console.log(err); }

}
// Define function that accepts a page and scrolls to the bottom of the content window
const scrollToBottom = async (page) => {
    try {
        let bodyHandle = await page.$('body');
        let lastHeight = await bodyHandle.evaluate(e => e.scrollHeight);
        let newHeight = lastHeight;
        while (true) {
            // Scroll to the bottom of the page
            await page.evaluate(() => { window.scrollBy(0, 2500 + 500 * Math.random()); });
            // Wait for a short delay after scrolling
            await page.waitForTimeout(1500 + Math.random() * 500); // Adjust this delay as needed
            // Get the new height of the page
            bodyHandle = await page.$('body')
            newHeight = await bodyHandle.evaluate(e => e.scrollHeight);
            // Break the loop if no additional content is loaded
            if (newHeight === lastHeight) break;
            lastHeight = newHeight;
        }
        await page.waitForTimeout(1000 * Math.random() + 1000);
    } catch (err) {
        console.error("Error while scrolling:", err);
    }
};
// Define the GrailedScraper function that scrapes the Grailed website and returns an array of listings for the passed collection name. 
// It accepts a puppeteer page generated for the cluster task, since this will be used in cluster.task().
const scrapeCollectionListings = async (page, collectionObj, elementTargetor) => {
    try {
        // Source URL and declare the array to store the listings
        let scrapeUrl = process.env.SCRAPE_URL + elementTargetor;
        let listings = [];
        // Page config with cookies
        let c = await fsProm.readFile('./cookies/cookies.json');
        c = JSON.parse(c);
        await page.setCookie(...c);
        // Go to the Depop subpage for colleciton
        await page.goto(scrapeUrl);
        await page.waitForTimeout(500 * Math.random() + 1000);
        // Accept cookies
        const popup = await page.$('button[data-testid="cookieBanner__acceptAllButton"]');
        if (popup) {
            await page.click('button[data-testid="cookieBanner__acceptAllButton"]');
            await page.waitForTimeout(500 * Math.random() + 1000);
            console.log('Accepted cookies');
        }
        // Save cookies
        const cookies = await page.cookies();
        await fsProm.writeFile('./cookies/cookies.json', JSON.stringify(cookies, null, 2));

        // Scroll to bottom of the page
        await page.waitForTimeout(500 * Math.random() + 500);
        await scrollToBottom(page);
        await page.waitForTimeout(1000 * Math.random() + 500);

        // Get the product pods

        // Grab container
        const container = await page.$('ul[class="styles__ProductListGrid-sc-4aad5806-1 hGGFgp"]');
        if (!container) { console.log('No container found'); return; }

        // Get listings from container
        listings = await container.evaluate((c) =>{
            // Map each product pod to an array of listings
            return Array.from(c.querySelectorAll('li')).map(pod => {
                let tempDate = new Date();
                tempDate.setDate(tempDate.getDate() + 28);
                tempDate = tempDate.toISOString();
                
                // Define the targetors for each listing attribute
                const imgTarget = 'sc-htehQK fmdgqI'; 
                const brandTarget = 'sc-eDnWTT styles__StyledBrandNameText-sc-4aad5806-21 kcKICQ gGqiYg';
                const sizeTarget = 'sc-eDnWTT styles__StyledSizeText-sc-4aad5806-12 kcKICQ cuCvzt';

                return {
                    productListing: "https://www.depop.com" + pod.querySelector('a').getAttribute('href'),
                    productImg: pod.querySelector(`img[class="${imgTarget}"]`)?.getAttribute('src'),
                    productBrand: pod.querySelector(`p[class="${brandTarget}"]`)?.innerText.toLowerCase(),
                    productSize: pod.querySelector(`p[class="${sizeTarget}"]`)?.innerText,
                    productColors: [],
                    createdAt: new Date().toISOString()
                }
            });
        });

        // Log the number of listings scraped
        console.log(`Got listings - ${listings.length}`);
        
        // Update DB with the listings, formating and (lightly) validating each listing

        // Validate, format, and add each listing to the DB
        let invalid = 0;
        let repeats = 0;
        for (let listing of listings) {
            // Validate listing
            if (!listing.productListing || !listing.productImg || !listing.productBrand) {
                invalid += 1;
                continue;
            }

            // Check for "other" size
            if (listing.productSize?.toLowerCase() == "other" || listing.productSize?.toLowerCase() == "one size") {
                 invalid += 1;
                continue;}
            
            // Check if listing already exists in DB and skip if it does
            if (await collectionObj.findOne({productListing: listing.productListing})) { 
                repeats += 1;
                continue }
            
            // Format listing
            listing.productBrand = listing.productBrand?.trim();
            let tempProductSize = listing.productSize?.trim(' ');
            tempProductSize = tempProductSize?.replace('"',"");
            tempProductSize = tempProductSize?.replace('US',"");
            tempProductSize = tempProductSize?.replace('UK',"");
            tempProductSize = tempProductSize?.replace('EU',"");
            tempProductSize = tempProductSize?.replace(' ',"");
            listing.productSize = tempProductSize;
            
            // If the prodcut size is still longer than 6 characters, skip the listing
            if (listing.productSize?.length > 4) {
                invalid += 1;
                continue;
            }
            // Add listing to DB
            await collectionObj.create(listing);
        }
        // Log the number of invalid and repeated listings
        console.log(`Invalid listings: ${invalid}`);
        console.log(`Repeated listings: ${repeats}`);
        console.log(`New listings: ${listings.length - invalid - repeats}`);
    } catch (err) { console.log(err);}
}

// Define cluster scraping function that utlizes the functions defined above to scrape the website for each collection, simultaneously. 
// Each thread of the collection will also update the DB with the listings it has scraped.
const scrapeAllCollections = async (l, u) => {
    try {
        let i = l;
        let elementTargetor;
        let collectionObj;
        // Iterate each collection name and scrape the listings
        while (i < u) {        
            const browser = await puppeteer.launch({ headless: "new" });
            const page = await browser.newPage();
            console.log(`Launched browser to scrape ${collectionNames[i]}`);

            // Assign elementTargetor abd collectionObj from iteration
            elementTargetor = elementTargetors[i];
            collectionObj = collectionObjs[i];

            // Scrape array of listings for passed collection name
            await scrapeCollectionListings(page, collectionObj, elementTargetor);

            // Close browser instance
            await page.waitForTimeout(750);
            await page.close();
            await browser.close();

            // Increment index
            i += 1;
        }
        console.log(`Scraping complete!!!`);
        // Stop runtimer and output runtime
        console.timeEnd('runtime');
        mongoose.connection.close();
        return 0;


    } catch (err) { 
        console.log(err);
        return 1;}
}

// Main function

// Start runtimer
console.time('runtime');
// Connect to DB
connectMongoose();

// Get collection to scrape range from command line
const l = parseInt(process.argv[2]) || 0;
const u = parseInt(process.argv[3]) || collectionObjs.length;

// Initialize TTL for each collection
// initTTL();

// Scrape the collections from l to u
scrapeAllCollections(l, u);
