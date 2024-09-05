from pymongo import MongoClient
from dotenv import load_dotenv
from os import getenv

# Initialize ENV
load_dotenv()

# Source ENV
connectionString = getenv('DB_CONNECTION_PY')
# Connect to Mongo
client = MongoClient(connectionString)
# Connect to DB
db = client['test']
print('Connected to database')

collections = ['topwomens', 'topmens', 'bottomwomens', 'bottommens', 'shoewomens', 'shoemens']
# iterate through collections
for collection_name in collections:
    c = db[collection_name]

    # access all item in the collection
    all_c = c.find()
    for item in all_c:
        id = item['_id'] # pull item id
        c.update_one({'_id': id}, {'$set': {'productColors': []}}) # set colors to an empty array
    
client.close()
print('All color arrays cleared.')