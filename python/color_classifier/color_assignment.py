from pymongo import MongoClient
from dotenv import load_dotenv
from os import getenv

from clothing_describer import get_colors

# Initiailize ENV
load_dotenv()

# Source ENV
connectionString = getenv("DB_CONNECTION_JS")
# Connect to Mongo
client = MongoClient(connectionString)
# Connect to DB
db = client["test"]
print('Connected to database')
# Connect to Collections
collections = ['topmens', 'topwomens', 'bottommens', 'bottomwomens', 'shoemens', 'shoewomens']

# iterate collections
for name in collections:
    c = db[name]
    # access all item in the collection which do not have the color array
    all_c = c.find({'productColors': []})
    print('Connected to collection', name)
    
    counter = 0
    for item in all_c:
        # source image and item id
        img_url = item['productImg']
        id = item['_id']

        # get color array
        colors = get_colors(img_url)

        #!add removal for colors == -1

        # add color array to listing
        c.update_one({"_id": id}, {"$set": {"productColors": colors}})

        counter += 1
        if counter > 20:
            print('Accessed 200 items in collection')
            break

client.close()
