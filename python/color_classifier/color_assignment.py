from pymongo import MongoClient
from dotenv import load_dotenv
from os import getenv
import time

from clothing_describer import ClothingDescriber

# Initiailize ENV
load_dotenv()

# Source ENV
connectionString = getenv('DB_CONNECTION_PY')
# Connect to Mongo
client = MongoClient(connectionString)
# Connect to DB
db = client['test']
print('Connected to database')
# Connect to Collections
collections = ['topmens', 'topwomens', 'bottommens', 'bottomwomens', 'shoemens', 'shoewomens']

cd = ClothingDescriber()

# iterate collections
for name in collections:
    c = db[name]
    # access all item in the collection which do not have the color array
    all_c = c.find({'productColors': []})
    print('Connected to collection', name)
    
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
        # if counter > 100:
        #     print('100 items updated in ', time.time()-t0, ' seconds')
        #     break
    print('Updated', counter, 'items in', time.time()-t0, 'seconds')


client.close()
