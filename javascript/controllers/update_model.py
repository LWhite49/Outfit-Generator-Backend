'''To be called as a child process implementing like/dislike functionality.'''

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
from clothing_describer import ClothingDescriber

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

# pull associated document from clothes database
#* right now there isn't a way to see what sex collection an item came from so we have to check the id against both

color_assigner = ClothingDescriber()
def get_and_copy(item_id, collection_type, colorizer=color_assigner):
    '''Receives item id (passed from website) and collection type (a string 'top', 'bottom', or 'shoe' which indicates what collection this
    function is being performed on). Gets the item document from the main database and copies it into the archival database, returning the new
    archival id and the sex association of this item.'''
    sex = 'M' # initial assumption bc we check the mens collection first
    # connect to appropriate database
    collection = db[collection_type + 'mens']
    # pull document
    item = collection.find_one({'_id': item_id}, projection={'_id': False})
    # if this fails go to womens collection
    if not top:
        collection = db[collection_type + 'womens']
        top = collection.find_one({'_id': item_id}, projection={'_id': False})
        sex = 'F' # reassign sex
    
    # if this item doesn't have its color array assigned we will generate it
    if not(item['productColors']):
        item['productColors'] = colorizer.get_colors(item['productImg'])

    # insert item into archive
    collection = arcv[collection_type + 's']
    # check that this item hasn't already been archived
    existing_item = collection.find_one(item)
    if existing_item:
        print(f'{collection_type.upper()} already in archive.')
        top_arcv_id = existing_item['_id']
    else:
        result = collection.insert_one(top)
        top_arcv_id = result.inserted_id # save new, unique archival _id

# top
sex_vote = 'M' # we will also attach a sex indicator to outfit sets
collection = db['topmens']
top = collection.find_one({'_id': top_id}, projection={'_id': False})
 # _id will be excluded from the returned document, as we will rely on new _id when inserting it into the archive
if not top:
    collection = db['topwomens']
    top = collection.find_one({'_id': top_id}, projection={'_id': False})
    sex_vote = 'F' # reassign sex

sexes = [sex_vote] # keep an array of the sex of each item, with the more prevalent one being assigned to the set

# if any item doesn't have colors assigned we will get them
color_assigner = ClothingDescriber()
if not(top['productColors']):
    top['productColors'] = color_assigner.get_colors(top['productImg'])

# insert top into archive
collection = arcv['tops']
# check that this item hasn't already been archived
existing_item = collection.find_one(top)
if existing_item:
    print('Top already in archive.')
    top_arcv_id = existing_item['_id']
else:
    result = collection.insert_one(top)
    top_arcv_id = result.inserted_id # save new, unique archival _id

# bottom
sex_vote = 'M' 
collection = db['bottommens']
bottom = collection.find_one({'_id': bottom_id}, projection={'_id': False})
if not bottom:
    collection = db['bottomwomens']
    bottom = collection.find_one({'_id': bottom_id}, projection={'_id': False})
    sex_vote = 'F'

sexes.append(sex_vote)

# check for bottom colors
if not(bottom['productColors']):
    bottom['productColors'] = color_assigner.get_colors(bottom['productImg'])

# insert bottom into archive
collection = arcv['bottoms']
existing_item = collection.find_one(bottom)
if existing_item:
    print('Bottom already in archive.')
    bottom_arcv_id = existing_item['_id']
else:
    result = collection.insert_one(bottom)
    bottom_arcv_id = result.inserted_id

# shoe
sex_vote = 'M'
collection = db['shoemens']
shoe = collection.find_one({'_id': shoe_id}, projection={'_id': False})
if not shoe:
    collection = db['shoewomens']
    shoe = collection.find_one({'_id': shoe_id}, projection={'_id': False})
    sex_vote = 'F'

sexes.append(sex_vote)

# check for shoe colors
if not(shoe['productColors']):
    shoe['productColors'] = color_assigner.get_colors(shoe['productImg'])

# insert shoe into archive
collection = arcv['shoes']
existing_item = collection.find_one(shoe)
if existing_item:
    print('Shoe already in archive.')
    shoe_arcv_id = existing_item['_id']
else:
    result = collection.insert_one(shoe)
    shoe_arcv_id = result.inserted_id

# todo: if an item wasn't found we can get by just on the colors passed and make an object from that

# create a new document to represent outfit set
sex = 'M' if sexes.count('M') > sexes.count('F') else 'F' # get predominant sex association
outfit = {'sex': sex, 'top_id': top_arcv_id, 'bottom_id': bottom_arcv_id, 'shoe_id': shoe_arcv_id, 'reaction': reaction}

# add it to the database
# TODO: don't include identical sets?
collection = arcv['reacted_sets']
collection.insert_one(outfit)

client.close()