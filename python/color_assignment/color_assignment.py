'''Run this to assign colors to the database items. From command line, include collection names followed by an integer to limit application;
for example, python color_assignment.py topwomens topmens 10 will populate 10 items for just those two collections. Just include a number to 
do all collections a limited amount. Default is everything in all collections.'''

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
collections = ['topwomens', 'topmens', 'bottomwomens', 'bottommens', 'shoewomens', 'shoemens']

cd = ClothingDescriber()

def populate_collection(target_collection):
    c = db[target_collection]

    # access all item in the collection which do not have the color array
    all_c = c.find({'productColors': []})
    
    # exit if there aren't any to be updated
    if len(list(all_c.clone())) == 0:
        print('No unpopulated items in this collection.')
        return

    print('Connected to collection', target_collection)

    counter = 0
    t0 = time.time()
    # iterate through items
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

        if len(sys.argv) > 1 and counter == int(sys.argv[-1]): # allow setting a break number in the command line
            break

    print('Updated', counter, target_collection, 'items in', time.time()-t0, 'seconds')

if len(sys.argv) > 2:
    for name in sys.argv[1:-1]:
        populate_collection(name)
else:
    for name in collections:
        populate_collection(name)

client.close()
