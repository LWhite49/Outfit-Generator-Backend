'''Trains models based on past like and dislike data, pickling resulting objects for fast recall.'''

import sys
import os

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
sys.path.append(os.path.dirname(SCRIPT_DIR))

from pymongo import MongoClient
from dotenv import load_dotenv
import pandas as pd
import numpy as np
import pickle
from color_calculator import outfit_comparison
from sklearn.ensemble import RandomForestClassifier
from sklearn.ensemble import RandomForestRegressor
from sklearn.model_selection import train_test_split
from sklearn.model_selection import GridSearchCV
from sklearn.metrics import accuracy_score
from sklearn.metrics import r2_score
from conversions import hex_to_rgb

if __name__ == '__main__':

    # Initialize ENV
    load_dotenv()

    # Source ENV
    connectionString = os.getenv('DB_CONNECTION_PY')
    # Connect to Mongo
    client = MongoClient(connectionString)
    # Connect to DB
    db = client['archive']
    print('Connected to database')

    # connect to set of reacted outfits
    cursor = db['reacted_sets'].find({'sex': "M"})
    # convert mongo cursor into dataframe
    outfits = pd.DataFrame(list(cursor))

    # drop currently irrelevant columns
    outfits = outfits[['top_id', 'bottom_id', 'shoe_id', 'reaction']]

    # function to flatten color array
    def flatten_array(arr, name):
        '''Takes in a color array and returns its expansion as a pandas series'''
        arr = np.array(arr) # will need list as numpy array for flattening
        # build array of column names so that the expansion will go like item_color1, item_weight1, item_color2, ..., etc
        column_names = [f'{name}_{base}{i}' for i in range(1, 5) for base in ['color', 'weight']]
        return pd.Series(arr.flatten(), index=column_names)

    # pull archival tables of items into dataframes
    #* tops
    cursor = db['tops'].find(projection=['productColors']) # only project relevant column
    tops = pd.DataFrame(list(cursor))
    # rename _id column for merging, colors column for distinctness
    tops = tops.rename(columns={'_id': 'top_id', 'productColors': 'top_colors'})
    # expand color array into 8 columns
    expanded = tops['top_colors'].apply(flatten_array, name='top') # get flattened series
    # add new columns to dataframe
    tops = pd.concat([tops, expanded], axis=1)

    #* bottoms
    cursor = db['bottoms'].find(projection=['productColors'])
    bottoms = pd.DataFrame(list(cursor))
    bottoms = bottoms.rename(columns={'_id': 'bottom_id', 'productColors': 'bottom_colors'})
    expanded = bottoms['bottom_colors'].apply(flatten_array, name='bottom')
    bottoms = pd.concat([bottoms, expanded], axis=1)

    #* shoes
    cursor = db['shoes'].find(projection=['productColors'])
    shoes = pd.DataFrame(list(cursor))
    shoes = shoes.rename(columns={'_id': 'shoe_id', 'productColors': 'shoe_colors'})
    expanded = shoes['shoe_colors'].apply(flatten_array, name='shoe')
    shoes = pd.concat([shoes, expanded], axis=1)

    # close client
    client.close()

    # inner join item tables into the outfits dataframe
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

    # separate into 2 dataframes, one with color arrays (i.e., all the colors in one array) and one with separate columns for each color
    outfits_expanded = outfits.drop(columns=['top_id', 'bottom_id', 'shoe_id', 'top_colors', 'bottom_colors', 'shoe_colors'])

    #* currently unused
    # function for breaking hex values into columns of r, g, and b
    # def expand_to_rgb(arr, name):

    #     for i in range(1,5):
    #         # build column names given item category (name)
    #         # item_color1_r, item_color1_g, item_color1_b, item_color2_r ... etc
    #         columns = []
    #         for dim in ['r', 'g', 'b']:
    #             column_name = f'{name}_color{i}'
    #             column_name += f'_{dim}'
    #             columns.append(column_name)

    #         rgb = pd.Series(outfits_expanded[f'{name}_color{i}'].apply(hex_to_rgb), index=columns)

    #         pd.concat([outfits_expanded, rgb], axis=1)
    #         return outfits

    # for name in ['top', 'bottom', 'shoe']:
    #     for i in range(1, 5):
    #         try:
    #             outfits_expanded[f'{name}_color{i}'] = outfits_expanded[f'{name}_color{i}'].apply(hex_to_rgb)
    #         except:
    #             raise Exception(f'Error for column {name}_color{i}')

    # outfits_expanded = outfits_expanded.join(pd.DataFrame(list()))

    outfits = outfits[['reaction', 'top_colors', 'bottom_colors', 'shoe_colors']]

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

    #* ======= MODEL 1 ======= RANDOM FOREST =======
    # variables for fitting to the model
    X = outfits[['TB_complementary', 'TB_similarity', 'TB_neutrality', \
        'TS_complementary', 'TS_similarity', 'TS_neutrality', \
        'BS_complementary', 'BS_similarity', 'BS_neutrality']]
    y = outfits['reaction']

    # train model
    X_train, X_test, y_train, y_test = train_test_split(X, y)

    # grid search for finding parameters
    # params = {'n_estimators': range(50,501,50), 'criterion': ['gini', 'entropy', 'log_loss'], 'max_features': ['sqrt', 'log2', None], 'min_samples_split': range(2,21)}
    # rfc = RandomForestClassifier()
    # clf = GridSearchCV(rfc, params, n_jobs=-1, verbose=1)
    # clf.fit(X_train, y_train)
    # print(clf.best_params_)

    model = RandomForestClassifier(500, criterion='entropy', max_features='sqrt')
    model.fit(X_train, y_train)

    print(model.feature_importances_)

    # with open('random_forest.txt', 'wb') as file:
    #     pickle.dump(model, file)

    preds = model.predict(X_test)

    print("Random forest accuracy:", accuracy_score(y_test, preds))

    #* ======= MODEL 2 ======= REGRESSOR =======
    # using same X and y as previous
    X_train, X_test, y_train, y_test = train_test_split(X, y)

    # grid search for finding parameters
    # params = {'n_estimators': range(50,501,50), 'criterion': ['squared_error', 'absolute_error', 'poisson'], 'max_features': ['sqrt', 'log2', None], 'min_samples_split': range(2,21)}
    # rfr = RandomForestRegressor()
    # clf = GridSearchCV(rfr, params, n_jobs=-1, verbose=1)
    # clf.fit(X_train, y_train)
    # print(clf.best_params_)

    model = RandomForestRegressor(criterion='squared_error', max_features='sqrt', min_samples_split=19, n_estimators=50)
    model.fit(X_train.values, y_train)

    # check r^2 value for the fit
    preds = model.predict(X_test.values)
    print("R2 value: ", r2_score(y_test, preds))

    # test accuracy by rounding to like or dislike
    midp = max(preds) / 2
    print('Regression midpoint:', midp)
    for i in range(len(preds)):
        if preds[i] >= midp:
            preds[i] = 1
        else:
            preds[i] = 0

    print("Regression accuracy:", accuracy_score(y_test, preds))

    # save trained model to pickle file
    with open('regression.txt', 'wb') as file:
        pickle.dump(model, file)