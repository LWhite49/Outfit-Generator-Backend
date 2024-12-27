import sys
import os

relative_path = os.path.join(os.path.dirname(__file__), '../../python/color_assignment')
sys.path.append(os.path.abspath(relative_path))

import json
import ast
import pandas as pd
from pymongo import MongoClient
from bson.objectid import ObjectId
from dotenv import load_dotenv
from os import getenv

#* inputs from site (not all are used currently)
# top = ast.literal_eval(sys.argv[1])
# bottom = ast.literal_eval(sys.argv[2])
# shoe = ast.literal_eval(sys.argv[3])
# outfit = [top, bottom, shoe]
# top_id = ast.literal_eval(sys.argv[4])
# bottom_id = ast.literal_eval(sys.argv[5])
# shoe_id = ast.literal_eval(sys.argv[6])
# reaction = ast.literal_eval(sys.argv[7])

# Initialize ENV
load_dotenv()

# Source ENV
connectionString = getenv('DB_CONNECTION_PY')
# Connect to Mongo
client = MongoClient(connectionString)
# Connect to DBs
db = client['test']
print('Connected to clothes database')
arcv = client['archive']
print('Connected to archive database')

# source outfit ids and reaction (like/dislike)
top_id = ObjectId(sys.argv[4][1:len(sys.argv[4]) - 1])
bottom_id = ObjectId(sys.argv[5][1:len(sys.argv[4]) - 1])
shoe_id = ObjectId(sys.argv[6][1:len(sys.argv[4]) - 1])
reaction = int(sys.argv[7])
userId = str(sys.argv[8])

# pull associated document from clothes database
#* right now there isn't a way to see what sex collection an item came from so we have to check the id against both

def get_and_copy(item_id, collection_type):
    '''Receives item id (passed from website) and collection type (a string 'top', 'bottom', or 'shoe' which indicates what collection this
    function is being performed on). Gets the item document from the main database and copies it into the archival database, returning the new
    archival id and the sex association of this item.'''
    sex = 'M' # initial assumption bc we check the mens collection first
    # connect to appropriate database
    collection = db[collection_type + 'mens']
    # pull document
    item = collection.find_one({'_id': item_id}, projection={'_id': False})
    # if this fails go to womens collection
    if not item:
        collection = db[collection_type + 'womens']
        item = collection.find_one({'_id': item_id}, projection={'_id': False})
        sex = 'F' # reassign sex

    # if this item doesn't have its color array, return None to indicate the outfit should not be archived
    if not item.get('productColors'):
        print(f'{collection_type.capitalize()} does not have a color array.')
        return None, None

    # insert item into archive
    collection = arcv[collection_type + 's']
    # check that this item hasn't already been archived
    existing_item = collection.find_one(item)
    if existing_item:
        print(f'{collection_type.capitalize()} already in archive.')
        arcv_id = existing_item['_id']
    else:
        result = collection.insert_one(item)
        arcv_id = result.inserted_id # get new, unique archival _id
    
    return arcv_id, sex

sexes = [None, None, None]
top_arcv_id, sexes[0] = get_and_copy(top_id, 'top')
bottom_arcv_id, sexes[1] = get_and_copy(bottom_id, 'bottom')
shoe_arcv_id, sexes[2] = get_and_copy(shoe_id, 'shoe')

# if any of the items returned None (i.e., missing color array), skip archiving the outfit
if not all([top_arcv_id, bottom_arcv_id, shoe_arcv_id]):
    print('One or more items lacked a color array. Outfit will not be archived.')
else:
    # create a new document to represent outfit set
    sex = 'M' if sexes.count('M') > sexes.count('F') else 'F' # get predominant sex association
    outfit = {'sex': sex, 'top_id': top_arcv_id, 'bottom_id': bottom_arcv_id, 'shoe_id': shoe_arcv_id, 'reaction': reaction, 'userId': userId}

    # add it to the database
    # TODO: don't include identical sets?
    collection = arcv['reacted_sets']
    collection.insert_one(outfit)

    print('Outfit reaction saved successfully.')

client.close()