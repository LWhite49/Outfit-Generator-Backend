const mongoose = require('mongoose');
const dotenv = require('dotenv');
const connectMongoose = require('./mongo-config/connectMongoose.js');
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

// Define array of collection names
const collectionObjs = [TopMen, BottomMen, ShoeMen, TopWomen, BottomWomen, ShoeWomen];
// Define array of element targetors
const elementTargetors = [
    {
        dropdownTargetor: 'menswear',
        dropdownElemTargetor: 'tops'
    },
    {
        dropdownTargetor: 'menswear',
        dropdownElemTargetor: 'bottoms'
    },
    {
        dropdownTargetor: 'menswear',
        dropdownElemTargetor: 'shoes'
    },
    {
        dropdownTargetor: 'womenswear',
        dropdownElemTargetor: 'tops'
    },
    {
        dropdownTargetor: 'womenswear',
        dropdownElemTargetor: 'bottoms'
    },
    {
        dropdownTargetor: 'womenswear',
        dropdownElemTargetor: 'shoes'
    }
]
// Puppeteer middleware
puppeteer.use(StealthPlugin());
puppeteer.use(AnonymizeUAPlugin());

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
        let scrapeUrl = process.env.SCRAPE_URL;
        let listings = [];
        // Page config with cookies
        let c = await fsProm.readFile('./cookies/cookies.json');
        c = JSON.parse(c);
        await page.setCookie(...c);
        // Go to the Depop homepage
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
        // Hover relevant dropdown and click relevant element
        await page.waitForTimeout(500 * Math.random() + 1000);
        const dropdowns = await page.$$('button[type="button"]');
        for (let dropdown of dropdowns) {
            let dropdownText = await dropdown.evaluate(e => e.innerText);
            dropdownText = dropdownText.toLowerCase()
            if (dropdownText == elementTargetor.dropdownTargetor) {
                await dropdown.hover();
                await page.waitForTimeout(500 * Math.random() + 1000);
                console.log('Hovered over dropdown');
                break;
            }
        }
        await page.waitForTimeout(1000 * Math.random() + 2000);

        // Click the dropdown element
        const dropdownElems = await page.$$('p[class="sc-eDnWTT NavigationCategoryList-styles__CategoryListItemText-sc-5e15d078-4 kcKICQ kjOAJZ"]');
        for (let dropdownElem of dropdownElems) {
            let dropdownElemText = await dropdownElem.evaluate(e => e.innerText);
            dropdownElemText = dropdownElemText.toLowerCase();
            if (dropdownElemText == elementTargetor.dropdownElemTargetor) {
                await dropdownElem.click();
                await page.waitForTimeout(1000 * Math.random() + 1000);
                console.log('Navigated to new page');
                await page.waitForTimeout(1000 * Math.random() + 1000);
                break;
            }
        }
        
        // Scroll to bottom of the page
        await page.waitForTimeout(500 * Math.random() + 500);
        await scrollToBottom(page);
        await page.waitForTimeout(1000 * Math.random() + 500);

        // Get the product pods
        listings = await page.evaluate(() => {
            let productPods = Array.from(document.querySelectorAll('li[class="styles__ProductCardContainer-sc-9691b5f-7 NKdpy"]'));
            console.log('Got product pods');
            return productPods.map(pod => {
                let tempDate = new Date();
                tempDate.setDate(tempDate.getDate() + 28);
                tempDate = tempDate.toISOString();
                return {
                    productListing: "https://www.depop.com" + pod.querySelector('a[data-testid="product__item"]').getAttribute('href'),
                    productImg: pod.querySelector('img[class="sc-htehQK fmdgqI"]')?.getAttribute('src'),
                    productBrand: pod.querySelector('p[class="sc-eDnWTT styles__StyledBrandNameText-sc-9691b5f-21 kcKICQ fAzsgR"]')?.innerText,
                    productSize: pod.querySelector('p[class="sc-eDnWTT styles__StyledSizeText-sc-9691b5f-12 kcKICQ glohkc"]')?.innerText,
                    productColors: [],
                    createdAt: new Date().toISOString()
                }
            });
        })

        console.log(`Got listings - ${listings.length}`);

        // Update DB with the listings, formating and (lightly) validating each listing
        // TTL so documents expire in one month
        collectionObj.collection.createIndex({createdAt: 1}, {expireAfterSeconds: 2592000});
        for (let listing of listings) {
            // Validate listing
            if (!listing.productListing || !listing.productImg || !listing.productBrand) {
                console.log('Invalid listing');
                continue;
            }

            // Check for "other" size
            if (listing.productSize?.toLowerCase() == "other" || listing.productSize?.toLowerCase() == "one size") { continue;}

            // Format listing
            listing.productBrand = listing.productBrand?.trim();
            listing.productSize = listing.productSize?.trim();
            listing.productSize = listing.productSize?.replace('"', '');

            // Check if listing already exists in DB and skip if it does
            if (await collectionObj.findOne({productListing: listing.productListing})) { continue }
            // Add listing to DB
            await collectionObj.create(listing);
        }
    } catch (err) { console.log(err);}
}

// Define cluster scraping function that utlizes the functions defined above to scrape the website for each collection, simultaneously. 
// Each thread of the collection will also update the DB with the listings it has scraped.
const scrapeAllCollections = async () => {
    try {
        let i = 0;
        let elementTargetor;
        // Iterate each collection name and scrape the listings
        for (let collectionObj of collectionObjs) {
            // Create a browser instance
            const browser = await puppeteer.launch({ headless: false});
            const page = await browser.newPage();
            console.log(`Launched browser to scrape ${elementTargetors[i].dropdownTargetor + elementTargetors[i].dropdownElemTargetor}`);
            // Assign elementTargetors
            elementTargetor = elementTargetors[i];
            // Scrape array of listings for passed collection name
            await scrapeCollectionListings(page, collectionObj, elementTargetor);
            // Increment index
            i += 1;
            // Close browser instance
            await page.close();
            await browser.close();
        }


    } catch (err) { console.log(err); }
}
// Connect to DB
connectMongoose();

// Scrape the collections
scrapeAllCollections();
process.exit(0);