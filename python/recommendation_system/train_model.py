from pymongo import MongoClient
from dotenv import load_dotenv
from os import getenv
import pandas as pd
import numpy as np
import pickle
from color_calculator import outfit_comparison
from sklearn.linear_model import LinearRegression
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score

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

# function to flatten color array
def flatten_array(arr, name):
    arr = np.array(arr) # will need list as numpy array
    # build array of column names so that the expansion will go like item_color1, item_weight1, item_color2, ..., etc
    column_names = [f'{name}_{base}{i+1}' for i in range(arr.shape[0]) for base in ['color', 'weight']]
    return pd.Series(arr.flatten(), index=column_names)

# pull archival tables of items into dataframes
# tops
cursor = db['tops'].find(projection=['productColors']) # only project relevant column
tops = pd.DataFrame(list(cursor))
# rename _id column for merging, colors column for distinctness
tops = tops.rename(columns={'_id': 'top_id', 'productColors': 'top_colors'})
# expand color array into 8 columns
expanded = tops['top_colors'].apply(flatten_array, name='top') # get flattened series
# add new columns to dataframe
tops = pd.concat([tops, expanded], axis=1)

# bottoms
cursor = db['bottoms'].find(projection=['productColors'])
bottoms = pd.DataFrame(list(cursor))
bottoms = bottoms.rename(columns={'_id': 'bottom_id', 'productColors': 'bottom_colors'})
expanded = bottoms['bottom_colors'].apply(flatten_array, name='bottom')
bottoms = pd.concat([bottoms, expanded], axis=1)

# shoes
cursor = db['shoes'].find(projection=['productColors'])
shoes = pd.DataFrame(list(cursor))
shoes = shoes.rename(columns={'_id': 'shoe_id', 'productColors': 'shoe_colors'})
expanded = shoes['shoe_colors'].apply(flatten_array, name='shoe')
shoes = pd.concat([shoes, expanded], axis=1)

# inner merge item tables into the outfits dataframe
outfits = outfits.merge(tops, on='top_id')
outfits = outfits.merge(bottoms, on='bottom_id')
outfits = outfits.merge(shoes, on='shoe_id')

# modify column data types
float_cols = ['reaction', 'top_weight1', 'top_weight2', 'top_weight3', 'top_weight4', \
              'bottom_weight1', 'bottom_weight2', 'bottom_weight3', 'bottom_weight4', \
              'shoe_weight1', 'shoe_weight2', 'shoe_weight3', 'shoe_weight4']
outfits[float_cols] = outfits[float_cols].astype(float)
str_cols = ['top_color1', 'top_color2', 'top_color3', 'top_color4', \
            'bottom_color1', 'bottom_color2', 'bottom_color3', 'bottom_color4', \
            'shoe_color1', 'shoe_color2', 'shoe_color3', 'shoe_color4']
outfits[str_cols] = outfits[str_cols].astype('string')

# separate into 2 dataframes, one with expanded columns and one with color arrays
outfits_expanded = outfits.drop(columns=['top_id', 'bottom_id', 'shoe_id', 'top_colors', 'bottom_colors', 'shoe_colors'])
outfits = outfits[['reaction', 'top_colors', 'bottom_colors', 'shoe_colors']]

client.close()

#* ======= MODEL 1 ======= LINEAR REGRESSION =======
# get complementariness, similarity, and relative neutrality for each item combination
# split functionality for ease of application
def complementariness(item1, item2):
    return outfit_comparison(item1, item2)[0]

def similarity(item1, item2):
    return outfit_comparison(item1, item2)[1]

def neutrality(item1, item2):
    return outfit_comparison(item1, item2)[2]

# comparisons for top and bottom
outfits['TB_complementary'] = outfits.apply(lambda row: complementariness(row['top_colors'], row['bottom_colors']), axis=1)
outfits['TB_similarity'] = outfits.apply(lambda row: similarity(row['top_colors'], row['bottom_colors']), axis=1)
outfits['TB_neutrality'] = outfits.apply(lambda row: neutrality(row['top_colors'], row['bottom_colors']), axis=1)

# comparisons for top and shoe
outfits['TS_complementary'] = outfits.apply(lambda row: complementariness(row['top_colors'], row['shoe_colors']), axis=1)
outfits['TS_similarity'] = outfits.apply(lambda row: similarity(row['top_colors'], row['shoe_colors']), axis=1)
outfits['TS_neutrality'] = outfits.apply(lambda row: neutrality(row['top_colors'], row['shoe_colors']), axis=1)

# comparisons for bottom and shoe
outfits['BS_complementary'] = outfits.apply(lambda row: complementariness(row['bottom_colors'], row['shoe_colors']), axis=1)
outfits['BS_similarity'] = outfits.apply(lambda row: similarity(row['bottom_colors'], row['shoe_colors']), axis=1)
outfits['BS_neutrality'] = outfits.apply(lambda row: neutrality(row['bottom_colors'], row['shoe_colors']), axis=1)

# variables for fitting to the model
X = outfits[['TB_complementary', 'TB_similarity', 'TB_neutrality', \
     'TS_complementary', 'TS_similarity', 'TS_neutrality', \
     'BS_complementary', 'BS_similarity', 'BS_neutrality']]
y = outfits['reaction']

X_train, X_test, y_train, y_test = train_test_split(X, y)

model = LinearRegression()
model.fit(X_train, y_train)

preds = model.predict(X_test)
for i in range(len(preds)):
    if preds[i] >= 0.5:
        preds[i] = 1
    else:
        preds[i] = 0

print(accuracy_score(y_test, preds))

with open('linear_regression.txt', 'wb') as file:
    pickle.dump(model, file)

# print(model.score(outfits[X], outfits['reaction']))