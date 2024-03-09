# 3/7/24

## No formal meetings in the last month, but so much progress! 


# The scraper is working so well!!! 

- Our scraper is able to parse around 1750 listings for six different catagories (Tops, Bottoms, Shoes for Men/Women) in around 20 minutes

- This comes out to an average of 525 listings parced per minute, which is as fast as any of us could have asked for.

- This rate also accounts for the validation of new entries (Ex. Throwing out something that is "One Size Fits All") and cross referencing the collection (Ex. Throwing out an listing if it already exists in the collection).

- The scraper has been tested and works reliably, and all information used to target HTML elements is sourced from a seprate file so they can be changed easily if the scraper ever becomes dated.

## How to use it

- For now, you have to be inside the "javascript" directory to use the scraper. From launch, you can navigate here with a simple "cd javascript".

- The command to run the scraper is "npm run scrape". Passing this will connect to the MongoDB, launch a headless browser (A "headless browser" is one that doesn't actually render anything on your computer. It runs in the background, which saves resources), and start scraping.

- As the scraper works, it will print status updates. It lets you know when it has established contact with the database. Then, it lets you know when it launches a new browser to scrape for a collection, specifying the collection. After it is done scrolling, it says how many total listings were found before parcing. After it is done parcing them, it gives a breakdown of how many were rejected, how many were duplicates, and how many were accepted.

- The command "npm run scrape" can accept two command line arguments, which are pointers for which collections to scrape for (Ex. npm run scrape 0 3 would scrape for the first three collections). The default values are 0 and 6, which scrapes for all six collections. You can target a specific collction by passing sequential indices (Ex. npm run scrape 0 1 would only scrape for the first collection)

- The index of each collection:
   - 0: Men's Tops
   - 1: Men's Bottoms
   - 2: Men's Shoes
   - 3: Women's Tops
   - 4 Women's Bottoms
   - 5: Women's Shoes


# Scanning images for colors!
