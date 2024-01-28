# 1/26/24

# Project Compoents

Clothing Database: The clothing database will be hosted on MongoDB, and updated periodically by a NodeJS puppeteer cluster webscraping program. The clothing database will ideally be comprised of resale clothing, where the inital scrape grabs:

- A type of clothing e.g. "Top" "Bottom" "Shoe" "Accessory"

- A link to the piece of clothing

- A price for the piece of clothing

- An image of the clothing

- Outfit Sizing

Color Identifier: The color identifier will be written in Python and will utilize SciKit-Learn and OpenCV to scan the mongoDB periodically. Any element in the MongoDB that does not already have a list of colors as an attribute will have its image analyzed, and update the element to contain a list of, at most, 4 prominent colors from the piece of clothing.

- The colors assigned to a piece of clothing will be based on a minimized list obtained by K-Means Clustering a parent list of around 1300 colors.

- There will have to be some means of ignoring the background of the image when running this process.

Color Pair Rankings: For each of the color catagorizations, we will need to make a dictionary where each other color has their compatability represetned by a number between 0 and 1. For now, this will simply act as a static database that gets referenced when selecting clothes to match eachother. We do not have any solid leads on how to approach this, but here are some ideas:

- Use the colormind.io API to generate lots of color pallets, and use this as a "voting system" of sorts.

- Use color theory concepts (e.g. triadic, tetradic, etc.) in combination with geometry of the color wheel and geometric relativity of color classifications to make inferences about their compatability.

Backend Server / Matching Algorithm: The backend for the server will be built with Python Django. The vast majority of its purpose will be to serve a list of clothing item elements from the mongoDB based on a matching algorithm. The backend will use PyMongo to communicate with the Database. The routes that the server will have to handle are:

- Generating an outfit with no paramaters (Generally, an outfit will be a top, bottom, and shoe/accessory)

- Generating an outfit with a user selected color

- Generating an outfit with a specific type of clothing (e.g. sweatshirt, shorts)

- Generating an outfit with a specific sizing range for tops and bottoms

Things to consider for the matching algorithm:

- We can inform the process of picking which colors to add to an existing outfit color pallet by averaging the color rank indices of all the colors that have already added.
    - For example, Our outfit has colors A and B and we need to consider color C. If A-C has a color match index of .8, and B-C has a color match index of .9, we would consider color C to have a color match index of .85 with out outfit.

- If an outfit has more than three colors, generally prioritize direct matching when selecting new pieces instead of adding new colors that compliment eachother.

- To avoid making the same outfit over and over again, start by picking a random piece of clothing, and then select other parts of the outfit in a random order.
    - For example: One outfit starts by selecting a random top, then matching accessory, then matching pants.
    - Then: A second outfit starts by selecting a random accessory, then matching pants, then matching top.

- If one part of an outfit has several colors, consider keeping the other parts of the outfit monochrome

- Only select clothing based inside the sizing range inputted by user

Frontend Website / Outfit Generator: The frontend for this website will be made with ReactJS. It will communicate with the Backend server to generate outfits based on a users query:

- The frontend needs a means of using forms to handle endpoints when making requests to the backend.

- The frontend could need a means of parsing an image upload.


# Component Access 

It is useful to map out which compoents will depend on eachother, and what needs to work together

Web Scraper:
    - Modifies the Clothing Database directly

    - Accessed by nothing, generally works isolated from the rest of the project to inform the database.

    - Modified by nothing

    - Informed by Grailed / Depop

    - Written in NodeJS

Clothing Database:
    - Modifies the behavior of the Backend Server and Matching Algorithms indirectly when the pool of clothing changes.

    - Accessed by Backend Server

    - Modified by the Web Scraper and Color Identifier

    - Hosted on MongoDB

Color Identifier:
    - Modifies the Clothing Database directly

    - Accessed by nothing, generally works isolated from the rest of the project to inform the database.

    - Modified by nothing

    - Written in Python

Color Ranking Database:
    - Modifiers the behavior of the Backend Server and Matching Algorithms indirectly if / when rankings change.

    - Accessed by the Backend Server and Matching Algorithm

    - Modified by nothing

    - Hosted on MongoDB

Backend Server / Matching Algorithm:
    - Modifies the frontend directly by serving responses to requests

    - Accessed by the Frontend Web App

    - Modified by nothing

    - Written in Python Django

Frontend Web App:
    - Modifies nothing since there are currently no plans for user accounts

    - Accessed by the internet

    - Modified by the Backend Server

    - Written in JSX / ReactJS


# Interactivity Map
![Interactivity Map](../images/interactivity-map.jpeg)
# Alternative Ideas

- Users upload an image (e.g. Famous painting, landscape etc.), that image has its most prominant colors extracted, and we return an outfit that features those colors making an outfit "inspired by" the image.

