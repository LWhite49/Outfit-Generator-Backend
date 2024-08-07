const mongoose = require("mongoose");
const dotenv = require("dotenv");
const process = require("process");
const connectMongoose = require("./connectMongoose.js");
dotenv.config();
const fsProm = require("fs").promises;
const puppeteer = require("puppeteer-extra");
const StealthPlugin = require("puppeteer-extra-plugin-stealth");
const AnonymizeUAPlugin = require("puppeteer-extra-plugin-anonymize-ua");
// Import the DB collections
const TopMen = require("./mongo-config/Top-Men.js");
const BottomMen = require("./mongo-config/Bottom-Men.js");
const ShoeMen = require("./mongo-config/Shoe-Men.js");
const TopWomen = require("./mongo-config/Top-Women.js");
const BottomWomen = require("./mongo-config/Bottom-Women.js");
const ShoeWomen = require("./mongo-config/Shoe-Women.js");

// Puppeteer middleware
puppeteer.use(StealthPlugin());
puppeteer.use(AnonymizeUAPlugin());

// Define function that initializes TTL for each collection
const initTTL = async () => {
	try {
		for (let collectionObj of collectionObjs) {
			// TTL so documents expire in 14 days
			collectionObj.collection.createIndex(
				{ createdAt: 1 },
				{ expireAfterSeconds: 1210000 }
			);
		}
	} catch (err) {
		console.log(err);
	}
};
// Define function that accepts a page and scrolls to the bottom of the content window or for 4 minutes, whichever comes first.
const scrollToBottom = async (page) => {
	try {
		const startTime = new Date().getTime();
		while (startTime + 30000 > new Date().getTime()) {
			// Scroll to the bottom of the page
			await page.evaluate(() => {
				window.scrollBy(0, 2500 + 500 * Math.random());
			});
			// Wait for a short delay after scrolling
			await page.waitForTimeout(1500 + Math.random() * 500); // Adjust this delay as needed
		}
		await page.waitForTimeout(1000 * Math.random() + 1000);
	} catch (err) {
		console.error("Error while scrolling:", err);
	}
};
// Define the GrailedScraper function that scrapes the Grailed website and returns an array of listings for the passed collection name.
// It accepts a puppeteer page generated for the cluster task, since this will be used in cluster.task().
const scrapeCollectionListings = async (page, targetorArr) => {
	try {
		// Source URL and declare the array to store the listings
		let scrapeUrl = process.env.SCRAPE_URL + targetorArr[0];
		let listings = [];
		// Page config with cookies
		let c = await fsProm.readFile("./cookies/cookies.json");
		c = JSON.parse(c);
		await page.setCookie(...c);
		// Go to the Depop subpage for colleciton
		await page.goto(scrapeUrl);
		await page.waitForTimeout(500 * Math.random() + 1000);
		// Accept cookies
		const popup = await page.$(
			'button[data-testid="cookieBanner__acceptAllButton"]'
		);
		if (popup) {
			await page.click(
				'button[data-testid="cookieBanner__acceptAllButton"]'
			);
			await page.waitForTimeout(500 * Math.random() + 1000);
			console.log("Accepted cookies");
		}
		// Save cookies
		const cookies = await page.cookies();
		await fsProm.writeFile(
			"./cookies/cookies.json",
			JSON.stringify(cookies, null, 2)
		);

		// Scroll to bottom of the page
		await page.waitForTimeout(500 * Math.random() + 500);
		await scrollToBottom(page);
		await page.waitForTimeout(1000 * Math.random() + 500);
		// Get the product pods

		// Grab container
		const container = await page.$('ol[class="styles_productGrid__Cpzyf"]');
		if (!container) {
			console.log("No container found");
			return;
		}

		// Get listings from container
		console.log("Getting listings...");
		listings = await container.evaluate((c, targetorArr) => {
			// Map each product pod to an array of listings
			return Array.from(c.querySelectorAll("li")).map((pod) => {
				let tempDate = new Date();
				tempDate.setDate(tempDate.getDate() + 28);
				tempDate = tempDate.toISOString();

				// Define the targetors for each listing attribute
				const imgTarget = "_mainImage_e5j9l_11";
				const brandTarget =
					"_text_bevez_41 _shared_bevez_6 _normal_bevez_51";

				return {
					productListing:
						"https://www.depop.com" +
						pod.querySelector("a").getAttribute("href"),
					productImg: pod
						.querySelector(`img[class="${imgTarget}"]`)
						?.getAttribute("src"),
					productBrand: pod
						.querySelector(`p[class="${brandTarget}"]`)
						?.innerText.toLowerCase(),
					productSize: targetorArr[1],
					productColors: [],
					createdAt: new Date().toISOString(),
				};
			});
		}, targetorArr);

		// Log the number of listings scraped
		console.log(`Got listings - ${listings.length}`);

		// Update DB with the listings, formating and (lightly) validating each listing

		// Validate, format, and add each listing to the DB
		let invalid = 0;
		let repeats = 0;
		for (let listing of listings) {
			// Validate listing
			if (
				!listing.productListing ||
				!listing.productImg ||
				!listing.productBrand
			) {
				invalid += 1;
				continue;
			}

			// Check if listing already exists in DB and skip if it does
			if (
				await targetorArr[2].findOne({
					productListing: listing.productListing,
				})
			) {
				repeats += 1;
				continue;
			}

			// Format listing
			listing.productBrand = listing.productBrand?.trim();

			// Add listing to DB
			await targetorArr[2].create(listing);
		}
		// Log the number of invalid and repeated listings
		console.log(`Invalid listings: ${invalid}`);
		console.log(`Repeated listings: ${repeats}`);
		console.log(`New listings: ${listings.length - invalid - repeats}`);
	} catch (err) {
		console.log(err);
	}
};

// Define cluster scraping function that utlizes the functions defined above to scrape the website for each collection, simultaneously.
// Each thread of the collection will also update the DB with the listings it has scraped.
const scrapeAllCollections = async () => {
	try {
		for (let targetorArr of sizeTargetors) {
			const browser = await puppeteer.launch({ headless: "new" });
			const page = await browser.newPage();
			await page.setDefaultNavigationTimeout(0);
			await page.setDefaultTimeout(0);

			// Scrape array of listings for passed collection name
			await scrapeCollectionListings(page, targetorArr);

			// Close browser instance
			await page.waitForTimeout(750);
			await page.close();
			await browser.close();
		}
		console.log(`Scraping complete!!!`);
		// Stop runtimer and output runtime
		console.timeEnd("runtime");
		mongoose.connection.close();
		return 0;
	} catch (err) {
		console.log(err);
		return 1;
	}
};

// Main function
// Define array of collection URL targetors
const sizeTargetors = [
	["category/mens/tops/?sizes=2-54.1-US%2C2-54.2-US", "XS", TopMen],
	["category/mens/tops/?sizes=2-54.1-US%2C2-54.3-US", "S", TopMen],
	["category/mens/tops/?sizes=2-54.1-US%2C2-54.4-US", "M", TopMen],
	["category/mens/tops/?sizes=2-54.1-US%2C2-54.5-US", "L", TopMen],
	["category/mens/tops/?sizes=2-54.1-US%2C2-54.6-US", "XL", TopMen],
	["category/mens/tops/?sizes=2-54.1-US%2C2-54.7-US", "XXL", TopMen],
	["category/womens/tops/?sizes=9-4.1-US%2C9-4.15-US", "XS", TopWomen],
	["category/womens/tops/?sizes=9-4.1-US%2C9-4.16-US", "S", TopWomen],
	["category/womens/tops/?sizes=9-4.1-US%2C9-4.17-US", "M", TopWomen],
	["category/womens/tops/?sizes=9-4.1-US%2C9-4.18-US", "L", TopWomen],
	["category/womens/tops/?sizes=9-4.1-US%2C9-4.19-US", "XL", TopWomen],
	["category/womens/tops/?sizes=9-4.1-US%2C9-4.20-US", "XXL", TopWomen],
	[
		"category/mens/bottoms/?sizes=9-4.1-US%2C3-60.1-US%2C3-60.2-US",
		"XS",
		BottomMen,
	],
	[
		"category/mens/bottoms/?sizes=9-4.1-US%2C3-60.1-US%2C3-60.3-US",
		"S",
		BottomMen,
	],
	[
		"category/mens/bottoms/?sizes=9-4.1-US%2C3-60.1-US%2C3-60.4-US",
		"M",
		BottomMen,
	],
	[
		"category/mens/bottoms/?sizes=9-4.1-US%2C3-60.1-US%2C3-60.5-US",
		"L",
		BottomMen,
	],
	[
		"category/mens/bottoms/?sizes=9-4.1-US%2C3-60.1-US%2C3-60.6-US",
		"XL",
		BottomMen,
	],
	[
		"category/mens/bottoms/?sizes=9-4.1-US%2C3-60.1-US%2C3-60.7-US",
		"XXL",
		BottomMen,
	],
	[
		"category/mens/bottoms/?sizes=9-4.1-US%2C3-60.1-US%2C3-60.11-US",
		"28",
		BottomMen,
	],
	[
		"category/mens/bottoms/?sizes=9-4.1-US%2C3-60.1-US%2C3-60.13-US",
		"30",
		BottomMen,
	],
	[
		"category/mens/bottoms/?sizes=9-4.1-US%2C3-60.1-US%2C3-60.15-US",
		BottomMen,
		"32",
	],
	[
		"category/mens/bottoms/?sizes=9-4.1-US%2C3-60.1-US%2C3-60.17-US",
		"34",
		BottomMen,
	],
	[
		"category/mens/bottoms/?sizes=9-4.1-US%2C3-60.1-US%2C3-60.19-US",
		"36",
		BottomMen,
	],
	[
		"category/mens/bottoms/?sizes=9-4.1-US%2C3-60.1-US%2C3-60.21-US",
		"38",
		BottomMen,
	],
	[
		"category/mens/bottoms/?sizes=9-4.1-US%2C3-60.1-US%2C3-60.23-US",
		"40",
		BottomMen,
	],
	[
		"category/mens/bottoms/?sizes=9-4.1-US%2C3-60.1-US%2C3-60.25-US",
		"42",
		BottomMen,
	],
	[
		"category/mens/bottoms/?sizes=9-4.1-US%2C3-60.1-US%2C3-60.29-US",
		"44",
		BottomMen,
	],
	[
		"category/womens/bottoms/?sort=relevance&sizes=10-22.1-US%2C10-22.27-US",
		"XS",
		BottomWomen,
	],
	[
		"category/womens/bottoms/?sort=relevance&sizes=10-22.1-US%2C10-22.38-US",
		"S",
		BottomWomen,
	],
	[
		"category/womens/bottoms/?sort=relevance&sizes=10-22.1-US%2C10-22.39-US",
		"M",
		BottomWomen,
	],
	[
		"category/womens/bottoms/?sort=relevance&sizes=10-22.1-US%2C10-22.30-US",
		"L",
		BottomWomen,
	],
	[
		"category/womens/bottoms/?sort=relevance&sizes=10-22.1-US%2C10-22.31-US",
		"XL",
		BottomWomen,
	],
	[
		"category/womens/bottoms/?sort=relevance&sizes=10-22.1-US%2C10-22.32-US",
		"XXL",
		BottomWomen,
	],
	[
		"category/womens/bottoms/?sort=relevance&sizes=10-22.1-US%2C10-22.19-US",
		"28",
		BottomWomen,
	],
	[
		"category/womens/bottoms/?sort=relevance&sizes=10-22.1-US%2C10-22.21-US",
		"30",
		BottomWomen,
	],
	[
		"category/womens/bottoms/?sort=relevance&sizes=10-22.1-US%2C10-22.23-US",
		"32",
		BottomWomen,
	],
	[
		"category/womens/bottoms/?sort=relevance&sizes=10-22.1-US%2C10-22.25-US",
		"34",
		BottomWomen,
	],
	[
		"category/womens/bottoms/?sort=relevance&sizes=10-22.1-US%2C10-22.50-US",
		"36",
		BottomWomen,
	],
	[
		"category/womens/bottoms/?sort=relevance&sizes=10-22.1-US%2C10-22.52-US",
		"38",
		BottomWomen,
	],
	[
		"category/womens/bottoms/?sort=relevance&sizes=10-22.1-US%2C10-22.54-US",
		"40",
		BottomWomen,
	],
	[
		"category/womens/bottoms/?sort=relevance&sizes=10-22.1-US%2C10-22.55-US",
		"42",
		BottomWomen,
	],
	[
		"category/womens/bottoms/?sort=relevance&sizes=10-22.1-US%2C10-22.56-US",
		"44",
		BottomWomen,
	],
	[
		"category/mens/shoes/?moduleOrigin=meganav&sizes=6-77.1-US%2C6-77.23-US",
		"6.0",
		ShoeMen,
	],
	[
		"category/mens/shoes/?moduleOrigin=meganav&sizes=6-77.1-US%2C6-77.24-US",
		"6.5",
		ShoeMen,
	],
	[
		"category/mens/shoes/?moduleOrigin=meganav&sizes=6-77.1-US%2C6-77.2-US",
		"7.0",
		ShoeMen,
	],
	[
		"category/mens/shoes/?moduleOrigin=meganav&sizes=6-77.1-US%2C6-77.3-US",
		"7.5",
		ShoeMen,
	],
	[
		"category/mens/shoes/?moduleOrigin=meganav&sizes=6-77.1-US%2C6-77.4-US",
		"8.0",
		ShoeMen,
	],
	[
		"category/mens/shoes/?moduleOrigin=meganav&sizes=6-77.1-US%2C6-77.5-US",
		"8.5",
		ShoeMen,
	],
	[
		"category/mens/shoes/?moduleOrigin=meganav&sizes=6-77.1-US%2C6-77.6-US",
		"9.0",
		ShoeMen,
	],
	[
		"category/mens/shoes/?moduleOrigin=meganav&sizes=6-77.1-US%2C6-77.7-US",
		"9.5",
		ShoeMen,
	],
	[
		"category/mens/shoes/?moduleOrigin=meganav&sizes=6-77.1-US%2C6-77.8-US",
		"10.0",
		ShoeMen,
	],
	[
		"category/mens/shoes/?moduleOrigin=meganav&sizes=6-77.1-US%2C6-77.9-US",
		"10.5",
		ShoeMen,
	],
	[
		"category/mens/shoes/?moduleOrigin=meganav&sizes=6-77.1-US%2C6-77.10-US",
		"11.0",
		ShoeMen,
	],
	[
		"category/mens/shoes/?moduleOrigin=meganav&sizes=6-77.1-US%2C6-77.11-US",
		"11.5",
		ShoeMen,
	],
	[
		"category/mens/shoes/?moduleOrigin=meganav&sizes=6-77.1-US%2C6-77.12-US",
		"12.0",
		ShoeMen,
	],
	[
		"category/mens/shoes/?moduleOrigin=meganav&sizes=6-77.1-US%2C6-77.13-US",
		"12.5",
		ShoeMen,
	],
	[
		"category/mens/shoes/?moduleOrigin=meganav&sizes=6-77.1-US%2C6-77.14-US",
		"13.0",
		ShoeMen,
	],
	[
		"category/mens/shoes/?moduleOrigin=meganav&sizes=6-77.1-US%2C6-77.15-US",
		"13.5",
		ShoeMen,
	],
	[
		"category/mens/shoes/?moduleOrigin=meganav&sizes=6-77.1-US%2C6-77.16-US",
		"14.0",
		ShoeMen,
	],
	[
		"category/mens/shoes/?moduleOrigin=meganav&sizes=6-77.1-US%2C6-77.17-US",
		"14.5",
		ShoeMen,
	],
	[
		"category/mens/shoes/?moduleOrigin=meganav&sizes=6-77.1-US%2C6-77.18-US",
		"15.0",
		ShoeMen,
	],
	[
		"category/womens/shoes/?moduleOrigin=meganav&sizes=14-46.1-US%2C14-46.4-US",
		"6.0",
		ShoeWomen,
	],
	[
		"category/womens/shoes/?moduleOrigin=meganav&sizes=14-46.1-US%2C14-46.5-US",
		"6.5",
		ShoeWomen,
	],
	[
		"category/womens/shoes/?moduleOrigin=meganav&sizes=14-46.1-US%2C14-46.6-US",
		"7.0",
		ShoeWomen,
	],
	[
		"category/womens/shoes/?moduleOrigin=meganav&sizes=14-46.1-US%2C14-46.7-US",
		"7.5",
		ShoeWomen,
	],
	[
		"category/womens/shoes/?moduleOrigin=meganav&sizes=14-46.1-US%2C14-46.8-US",
		"8.0",
		ShoeWomen,
	],
	[
		"category/womens/shoes/?moduleOrigin=meganav&sizes=14-46.1-US%2C14-46.9-US",
		"8.5",
		ShoeWomen,
	],
	[
		"category/womens/shoes/?moduleOrigin=meganav&sizes=14-46.1-US%2C14-46.10-US",
		"9.0",
		ShoeWomen,
	],
	[
		"category/womens/shoes/?moduleOrigin=meganav&sizes=14-46.1-US%2C14-46.11-US",
		"9.5",
		ShoeWomen,
	],
	[
		"category/womens/shoes/?moduleOrigin=meganav&sizes=14-46.1-US%2C14-46.12-US",
		"10.0",
		ShoeWomen,
	],
	[
		"category/womens/shoes/?moduleOrigin=meganav&sizes=14-46.1-US%2C14-46.13-US",
		"10.5",
		ShoeWomen,
	],
	[
		"category/womens/shoes/?moduleOrigin=meganav&sizes=14-46.1-US%2C14-46.14-US",
		"11.0",
		ShoeWomen,
	],
	[
		"category/womens/shoes/?moduleOrigin=meganav&sizes=14-46.1-US%2C14-46.15-US",
		"11.5",
		ShoeWomen,
	],
	[
		"category/womens/shoes/?moduleOrigin=meganav&sizes=14-46.1-US%2C14-46.16-US",
		"12.0",
		ShoeWomen,
	],
	[
		"category/womens/shoes/?moduleOrigin=meganav&sizes=14-46.1-US%2C14-46.17-US",
		"12.5",
		ShoeWomen,
	],
	[
		"category/womens/shoes/?moduleOrigin=meganav&sizes=14-46.1-US%2C14-46.18-US",
		"13.0",
		ShoeWomen,
	],
	[
		"category/womens/shoes/?moduleOrigin=meganav&sizes=14-46.1-US%2C14-46.19-US",
		"13.5",
		ShoeWomen,
	],
	[
		"category/womens/shoes/?moduleOrigin=meganav&sizes=14-46.1-US%2C14-46.20-US",
		"14.0",
		ShoeWomen,
	],
];
// Start runtimer
console.time("runtime");
// Connect to DB
connectMongoose();

// Initialize TTL for each collection
// initTTL();

// Scrape the collections from l to u
scrapeAllCollections(sizeTargetors);
