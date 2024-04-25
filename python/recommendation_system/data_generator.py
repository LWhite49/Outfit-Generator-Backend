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
from color_assignment.grouping.conversions import hex_to_rgb
import numpy as np


def on_stop_click(event):
    global stop_flag
    print("Loop stopped.")
    stop_flag = True
    plt.close()


# Function to update the plot when the slider value changes
def update(val):
    global user_score
    user_score = round(slider.val, 1)

# Function to handle button click event
def on_button_click(event):
    global user_score
    print(f"Slider value selected: {user_score}")
    plt.close()

def comp_sim_neut_probability(colors1, colors2):
    complementary_score = 0
    similar_score = 0
    neutral_score = 0
    # Iterate over each subset array in the first array
    for subset1 in colors1:
        rgb_value1 = hex_to_rgb(subset1[2])  # Get the hex value from the first array
        for subset2 in colors2:
            rgb_value2 = hex_to_rgb(subset2[2])  # Get the hex value from the second array

            # Calculate the probability that two rgb colors are complementary
            distance = np.linalg.norm((np.array(rgb_value1) + np.array(rgb_value2)) - 255)
            complementary_prob = 1 - (distance / np.sqrt(3 * (255 ** 2)))

            # Calulate the similarity between the two colors
            cos_sim = np.dot(rgb_value1, rgb_value2) / (np.linalg.norm(rgb_value1) * np.linalg.norm(rgb_value2))

            # Calculate the neutral probability
            neutral_prob = 1 - (np.linalg.norm(rgb_value1) - np.linalg.norm(rgb_value2)) / np.linalg.norm(rgb_value1)

            # Compare hex values
            complementary_score += 0.625 * complementary_prob
            similar_score += 0.625 * cos_sim
            neutral_score += 0.625 * neutral_prob

    return complementary_score, similar_score, neutral_score

    
def calm_lil_color_weighting(colors1, colors2, user_score):
    # get complementary, similarity, and relative neutrality scores
    complementary_score, similar_score, neutral_score = comp_sim_neut_probability(colors1, colors2)
    
    # assign the weight of the different factors
    complementary_weight = 0.25
    similar_weight = 0.25
    neutral_weight = 0.1
    user_score_weight = 0.4

    # Calculate the weighted sum of the scores
    weighted_sum = complementary_score * complementary_weight + similar_score * similar_weight + neutral_score * neutral_weight + user_score * user_score_weight

    return weighted_sum

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

stop_flag = False
while not stop_flag:
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
    user_score = None
    for i in range(len(colors1)):
        row += [hex_to_rgb(colors1[i][2])] * round(1000 * colors1[i][1])
        # add color label and percentage to dataframe row
        df_row.append(colors1[i][0])
        df_row.append(colors1[i][1])

    img1 = [row] * 1000

    # repeat for second set of colors
    row = []
    for i in range(len(colors2)):
        row += [hex_to_rgb(colors2[i][2])] * round(1000 * colors2[i][1])
        df_row.append(colors1[i][0])
        df_row.append(colors1[i][1])

    img2 = [row] * 1000

    # display colors side by side
    f, axarr = plt.subplots(1,2)
    axarr[0].imshow(img1)
    axarr[1].imshow(img2)

    # Adjust layout to accommodate the slider and button
    plt.subplots_adjust(bottom=0.3)
    # plt.subplots_adjust(top=0.2)

    # Create a slider widget
    ax_slider = plt.axes([0.2, 0.1, 0.6, 0.03])  # [left, bottom, width, height]
    slider = Slider(ax_slider, 'Slider', 0, 10, valinit=0.5, valstep=0.1)  # A slider from 1 to 10
    slider.on_changed(update)

    # Create a button widget
    ax_button = plt.axes([0.02, 0.02, 0.1, 0.05])  # [left, bottom, width, height]
    button = Button(ax_button, 'Submit')
    button.on_clicked(on_button_click)

    # Create a button widget for "Stop"
    ax_button_stop = plt.axes([0.15, 0.02, 0.1, 0.05])  # [left, bottom, width, height]
    button_stop = Button(ax_button_stop, 'Stop')
    button_stop.on_clicked(on_stop_click)

    plt.show()

    if stop_flag:
        break

    aesthetic_score = calm_lil_color_weighting(colors1, colors2, float(user_score))
    df_row.append(aesthetic_score)
    training_data = pd.concat([pd.DataFrame([df_row], columns=training_data.columns), training_data], ignore_index=1)

training_data.to_csv('training_data.csv', mode='a', index=False, header=False)
