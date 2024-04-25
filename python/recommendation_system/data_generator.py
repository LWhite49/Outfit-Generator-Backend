import sys
import os

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
sys.path.append(os.path.dirname(SCRIPT_DIR))

from dotenv import load_dotenv
# from color_assignment import env
from pymongo import MongoClient
from random import choice
import matplotlib.pyplot as plt
from color_assignment.grouping.conversions import hex_to_rgb

load_dotenv('python\color_assignment\.env')
connectionString = os.getenv('DB_CONNECTION_PY')

client = MongoClient(connectionString)

db = client['test']
collections = ['topmens', 'topwomens', 'bottommens', 'bottomwomens', 'shoemens', 'shoewomens']

def random_item():
    c = db[choice(collections)]
    colored = c.find({'productColors': {'$ne': []}})

# row = []
# for i in range(4):
#     row += [hex_to_rgb(compressed[i][2])] * round(1000 * compressed[i][1])

row = [[255, 0, 0]] * 1000

new_img = [row] * 1000
# print(np.array(new_img).shape)
plt.imshow(new_img)
plt.show()