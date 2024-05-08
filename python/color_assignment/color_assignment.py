from pymongo import MongoClient
from dotenv import load_dotenv
from os import getenv
import time
import sys
from clothing_describer import ClothingDescriber

# Initialize ENV
load_dotenv()

# Source ENV
connectionString = getenv('DB_CONNECTION_PY')
# Connect to Mongo
client = MongoClient(connectionString)
# Connect to DB
db = client['test']
print('Connected to database')
# Connect to Collections
collections = ['shoemens', 'topwomens', 'topmens', 'bottomwomens', 'bottommens', 'shoewomens']

cd = ClothingDescriber()

def populate_collection(c_name):
    c = db[c_name]
    # access all item in the collection which do not have the color array
    all_c = c.find({'productColors': []})
    print('Connected to collection', c_name)
    
    counter = 0
    t0 = time.time()
    for item in all_c:
        # source image and item id
        img_url = item['productImg']
        id = item['_id']

        # get color array
        colors = cd.get_colors(img_url)

        if colors == -1:
            c.delete_one({'_id': id})

        # add color array to listing
        c.update_one({'_id': id}, {'$set': {'productColors': colors}})

        counter += 1
        
    print('Updated', counter, c_name, 'items in', time.time()-t0, 'seconds')


for c in collections:
    populate_collection(c)

client.close()
