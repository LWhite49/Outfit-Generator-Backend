from pymongo import MongoClient
from dotenv import load_dotenv
from os import getenv
import pandas as pd

# Initialize ENV
load_dotenv()

# Source ENV
connectionString = getenv('DB_CONNECTION_PY')
# Connect to Mongo
client = MongoClient(connectionString)
# Connect to DB
db = client['archive']
print('Connected to database')

# connect to set of reacted outfits
cursor = db['reacted_sets'].find()
# convert mongo cursor into dataframe
outfits = pd.DataFrame(list(cursor))

# drop currently irrelevant columns
outfits = outfits[['top_id', 'bottom_id', 'shoe_id', 'reaction']]

print(outfits.head())