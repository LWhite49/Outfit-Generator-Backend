import sys
import os

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
sys.path.append(os.path.dirname(SCRIPT_DIR))

from dotenv import load_dotenv
from pymongo import MongoClient
from random import choice
import matplotlib.pyplot as plt
import pandas as pd
import keyboard
import threading
from color_assignment.grouping.conversions import hex_to_rgb

# initialize and source env
load_dotenv(os.path.dirname(SCRIPT_DIR) + '\color_assignment\.env')
connectionString = os.getenv('DB_CONNECTION_PY')

# connect to database
client = MongoClient(connectionString)

db = client['test']
collections = ['topmens', 'topwomens', 'bottommens', 'bottomwomens', 'shoemens', 'shoewomens']

def random_item():
    '''Returns the color array of a random item selected from the database.'''
    c = db[choice(collections)] # select a random collection
    # sample a random item with a nonempty color array
    pipeline = [{'$match': {'productColors': {'$ne': []}}}, {'$sample': {'size': 1}}]
    result = list(c.aggregate(pipeline))
    if result:
        random_item = result[0]
        # access and return the colors
        colors = random_item['productColors']
        return colors
    else:
        return None

# create an empty dataframe that will hold data results
# each row will have the four labels and the percentage of the image they take up for the two images compared, as well as the score given by the user
training_data = pd.DataFrame(columns=['Img1_Label1', 'Img1_Area%1', 'Img1_Label2', 'Img1_Area%2', 'Img1_Label3', 'Img1_Area%3', 'Img1_Label4', 'Img1_Area%4', \
                                      'Img2_Label1', 'Img2_Area%1', 'Img2_Label2', 'Img2_Area%2', 'Img2_Label3', 'Img2_Area%3', 'Img2_Label4', 'Img2_Area%4', \
                                        'Score'])

while True:
    # get random colors
    colors1 = random_item()
    while not colors1 or len(colors1) < 4:
        colors1 = random_item()
    
    colors2 = random_item()
    while not colors2 or len(colors2) < 4:
        colors2 = random_item()
    
    # create an image which will be a 1000*1000 matrix of the image colors, proportioned according to their percentage
    # simultaneously build the row to add to the dataframe
    row = []
    df_row = []
    for i in range(len(colors1)):
        row += [hex_to_rgb(colors1[i][2])] * round(1000 * colors1[i][1])
        # add color label and percentage to dataframe row
        df_row.append(colors1[i][0])
        df_row.append(colors1[i][1])

    img1 = [row] * 1000

    row = []
    for i in range(len(colors2)):
        row += [hex_to_rgb(colors2[i][2])] * round(1000 * colors2[i][1])
        df_row.append(colors1[i][0])
        df_row.append(colors1[i][1])

    img2 = [row] * 1000

    # plt.figure()
    f, axarr = plt.subplots(1,2)
    axarr[0].imshow(img1)
    axarr[1].imshow(img2)
    plt.show()
    
    key = keyboard.read_event()
    if key.name == 'q':
        break
    elif key.is_keypad:
        if key.name == '0':
            df_row.append(10)
        else:
            df_row.append(int(key.name))

    
    training_data = pd.concat([pd.DataFrame([df_row], columns=training_data.columns), training_data], ignore_index=1)

training_data.to_csv('training_data.csv', mode='a', index=False, header=False)
