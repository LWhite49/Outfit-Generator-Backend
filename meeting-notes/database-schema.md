# 2/2/24

# Mongo Database Schema 

# General Ideas for Database

- We will have separate collections for each type of clothing. We will start with collections for tops, bottoms, and shoes.

- The main limitation of our scraper is that we do not want to click on each item individually, so we are limited to information available on the feed.

- The documents will be scraped from Depop. When searching for a general catagory like "men's tops", an endless feed of products will render when scrolling down, where each product pod is a div with the class "feed-item". The fields in our collection will be determined by the information we can extract from these product pods, which includes:

    - A link to the product listing, found as the href attribute of the anchor tag with class "listing-item-link". This link is relative to the homepage, so "depop.com" will have to be added to the front of this link before displaying it on the frontend.

    - A link to an image of the clothing, found as the src attribute of the img tag inside of the div tag with class "listing-cover-photo".

    - A string summarizing the details of the listing like "Napapijri Vintage Long Sleeve Shirt". We could possibly search this for keywords like "long sleeve" or "graphic tee". This is found in the p tag with class "ListingMetadata-module__title___Rsj55", though this may change from page to page.

    - An array of keywords derived from the above string.

    - A string detailing the size of a listing like "M" or "36". This is found in the p tag with class "ListingMetadata-module__size___e9naE". Note that this class as well as the format of the data for this field may change form page to page.

- We can set up an index on MongoDB so that listings will be deleted from the collection every 14 days.


