# 12/4/24

# We will describe the shape and storage of data for the mobile Wardrobe Wizard app

Clothing Items:

-   We will be adding two attributes to each article of clothing:

    1.  Genre, storing an integer where each corresponds to the context of the clothing item
        e.g. 1 = sports, 2 = casual, 3 = formal

        - This will work under the hood as a feature for ML, no UI interactivity

    2.  Color Theme, where the colorizor will sort each item into one of a set of predefined color themes,
        defined by three hex values. This allows for themes by filling the pallet with clothing with colored theme selected by user
        e.g. pastel = #FF0CF4, #DCFFF8, #FFFFD8

            - This will work both under the hood and as a feature of the app:

                - When a color theme is selected, the entire pallet is filled with those clothes offsetting the feature vector

                - When a color theme is not selected, the ML will use it as another feature

-   We will be removing the brand attribute from storage, scraping, as well as the UI to make room for other features

Feature Vectors:

-   As mentioned above, the color theme and genre will both be added as feature vectors

-   Additionally, each user will have a feature vector specific to them trained by the graph of all the clothing they have reviewed:

    -   Generally this will look like a uniform length array, where each element represents an attribute

    -   This user vector will be stored as public metadata on Clerk, read and rewritten on each user like/dislike

Training Data:

-   Not much has to change with the data stored from like and dislike, other than that we will also store the userID for the given rating
