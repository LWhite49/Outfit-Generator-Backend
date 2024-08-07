import sys
import os

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
sys.path.append(os.path.dirname(SCRIPT_DIR))

from dotenv import load_dotenv
from pymongo import MongoClient
from random import choice
import matplotlib.pyplot as plt
from matplotlib.widgets import Button, Slider
import pandas as pd
import numpy as np
from color_assignment.conversions import hex_to_rgb
from color_calculator import outfit_comparison
import time
import urllib.request

# global variables
stop_flag = False

# # Function to update the plot when the slider value changes
# def update(val):
#     global user_score
#     user_score = round(slider.val, 1)

# Functions to handle button clicks
# def on_button_click(event):
#     global user_score 
#     user_score = round(slider.val, 1)
#     print(f"Slider value selected: {user_score}")
#     plt.close()

def on_like_click(event, outfit_array):
    # TODO: send this outfit to the archive
    # outfit array is received in order top-bottom-shoe
    
    pass

def on_stop_click(event):
    print("Loop stopped.")
    stop_flag = True
    plt.close()

# initialize and source env
load_dotenv(os.path.dirname(SCRIPT_DIR) + '\color_assignment\.env')
connectionString = os.getenv('DB_CONNECTION_PY')

# connect to database
client = MongoClient(connectionString)

db = client['test']
arcv = client['archive']

def random_item(collection):
    '''Returns the color array of a random item selected from the database.'''
    c = db[collection] 
    # sample a random item with a nonempty color array
    pipeline = [{'$match': {'productColors': {'$ne': []}}}, {'$sample': {'size': 1}}]
    result = list(c.aggregate(pipeline))
    if result:
        random_item = result[0]
        # access and return the image as a np array
        img_link = random_item['productImg']
        f = urllib.request.urlopen(img_link)
        return plt.imread(f)
    else:
        print('No items available with color array.')
        return None

if __name__ == '__main__':
    m_sets = ['topmens', 'bottommens', 'shoemens']
    f_sets = ['topwomens', 'bottomwomens', 'shoewomens']

    while not stop_flag:
        # get set of clothes from random sex
        outfit = []
        for c in choice([m_sets, f_sets]):
            outfit.append(random_item(c))

        # display images side by side
        f, axarr = plt.subplots(1, 3)
        for i in range(3):
            axarr[i].imshow(outfit[i])

        # Create button widgets
        ax_button = plt.axes([0.02, 0.02, 0.1, 0.05])  # [left, bottom, width, height]
        like = Button(ax_button, 'Like')
        like.on_clicked(lambda event: on_like_click(event, outfit))
        # TODO: use this syntax ^ for other functions to pass in outfit array

        ax_button = plt.axes([0.28, 0.02, 0.1, 0.05])  # [left, bottom, width, height]
        dislike = Button(ax_button, 'Dislike')
        dislike.on_clicked(on_dislike_click)

        ax_button = plt.axes([0.15, 0.02, 0.1, 0.05])  # [left, bottom, width, height]
        skip = Button(ax_button, 'Skip')
        skip.on_clicked(on_skip_click)

        # Create a button widget for "Stop"
        ax_button_stop = plt.axes([0.41, 0.02, 0.1, 0.05])  # [left, bottom, width, height]
        button_stop = Button(ax_button_stop, 'Stop')
        button_stop.on_clicked(on_stop_click)

        plt.show()

        if stop_flag:
            break
    

# if __name__ == "__main__":

#     # create an empty dataframe that will hold data results
#     # each row will have the four rgb values and the percentage of the image they take up for the two images compared, as well as the score given by the user
#     # training_data = pd.DataFrame(columns=['Img1_R1','Img1_G1','Img1_B1','Img1_%1','Img1_R2','Img1_G2','Img1_B2','Img1_%2',\
#     #                                       'Img1_R3','Img1_G3','Img1_B3','Img1_%3','Img1_R4','Img1_G4','Img1_B4','Img1_%4',\
#     #                                       'Img2_R1','Img2_G1','Img2_B1','Img2_%1','Img2_R2','Img2_G2','Img2_B2','Img2_%2',\
#     #                                       'Img2_R3','Img2_G3','Img2_B3','Img2_%3','Img2_R4','Img2_G4','Img2_B4','Img2_%4',\
#     #                                       'Img1_Neutrality','Img2_Neutrality','Similarity','Complementariness','User_Score'])
#     stop_flag = False
#     while not stop_flag and random_item(choice(collections)):
#         # get random colors
#         colors1 = random_item()
#         while not colors1 or len(colors1) < 4:
#             colors1 = random_item()
        
#         colors2 = random_item()
#         while not colors2 or len(colors2) < 4:
#             colors2 = random_item()
        
#         # create an image which will be a 1000*1000 matrix of the image colors, proportioned according to their percentage
#         # simultaneously build the row to add to the dataframe
#         row = []
#         df_row = []
#         user_score = None
#         for i in range(len(colors1)):
#             rgb = hex_to_rgb(colors1[i][0])
#             row += [rgb] * round(1000 * colors1[i][1])
#             # add color values and percentage to dataframe row
#             df_row.extend(rgb)
#             df_row.append(colors1[i][1])

#         img1 = [row] * 1000

#         # repeat for second set of colors
#         row = []
#         for i in range(len(colors2)):
#             rgb = hex_to_rgb(colors2[i][0])
#             row += [rgb] * round(1000 * colors2[i][1])
#             df_row.extend(rgb)
#             df_row.append(colors2[i][1])

#         img2 = [row] * 1000

#         # display colors side by side
#         f, axarr = plt.subplots(1,2)
#         axarr[0].imshow(img1)
#         axarr[1].imshow(img2)

#         # Adjust layout to accommodate the slider and button
#         plt.subplots_adjust(bottom=0.3)
#         # plt.subplots_adjust(top=0.2)

#         # Create a slider widget
#         ax_slider = plt.axes([0.2, 0.1, 0.6, 0.03])  # [left, bottom, width, height]
#         slider = Slider(ax_slider, 'Slider', 0, 10, valinit=5, valstep=0.1)  # A slider from 1 to 10
#         slider.on_changed(update)

#         # Create a button widget
#         ax_button = plt.axes([0.02, 0.02, 0.1, 0.05])  # [left, bottom, width, height]
#         button = Button(ax_button, 'Submit')
#         button.on_clicked(on_button_click)

#         # Create a button widget for "Stop"
#         ax_button_stop = plt.axes([0.15, 0.02, 0.1, 0.05])  # [left, bottom, width, height]
#         button_stop = Button(ax_button_stop, 'Stop')
#         button_stop.on_clicked(on_stop_click)

#         # calculate outfit comparison criteria
#         t0 = time.time()
#         complementariness, similarity, neutrality1, neutrality2 = outfit_comparison(colors1, colors2)
#         print(time.time() - t0)

#         # print('Palette 1 neutrality: ', neutrality1)
#         # print('Palette 2 neutrality: ', neutrality2)
#         # print('Complementariness: ', complementariness)
#         # print('Similarity: ', similarity)

#         plt.show()

#         if stop_flag:
#             break
        
#         # add outfit comparison details to the dataframe
#         df_row.extend([neutrality1, neutrality2, similarity, complementariness, user_score])
#         # print(df_row)
#         training_data = pd.concat([pd.DataFrame([df_row], columns=training_data.columns), training_data], ignore_index=1)
    
#     # add new training data to the csv
#     training_data.to_csv('training_data.csv', mode='a', index=False, header=False)
client.close()