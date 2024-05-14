from pymongo import MongoClient
from dotenv import load_dotenv
from os import getenv
import time
import sys
from clothing_describer import ClothingDescriber

# get command line arguments
target_collection = sys.argv[1] # the collection to be targeted by this run
num_entries = int(sys.argv[2]) # how many entries to populate

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

c = db[target_collection]

# access all item in the collection which do not have the color array
all_c = c.find({'productColors': []})
print('Connected to collection', target_collection)

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

    if counter == num_entries:
        print('Updated', counter, target_collection, 'items in', time.time()-t0, 'seconds')
        break

client.close()
