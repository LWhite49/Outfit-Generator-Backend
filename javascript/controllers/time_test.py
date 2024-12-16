import sys
import os

os.chdir('../../python')

import time
from score_combination import index_palettes
from dotenv import load_dotenv
from pymongo import MongoClient
from os import getenv
import matplotlib.pyplot as plt
import numpy as np

# Initialize ENV
load_dotenv()

# Source ENV
connectionString = getenv('DB_CONNECTION_PY')
# Connect to Mongo
client = MongoClient(connectionString)
# Connect to DB
db = client['test']
print('Connected to database')

def get_items(collection, n=40):
    return [list(db[f'{collection}mens'].aggregate([{'$sample': {'size': n}}]))[i]['productColors'] for i in range(n)]


def graph1():
    '''Shows graph of time vs. number of outfits returned.'''
    tops = get_items('top')
    bottoms = get_items('bottom')
    shoes = get_items('shoe')

    X = np.array(range(1, 40))
    times = []

    for i in range(1,40):
        t0 = time.time()
        index_palettes(tops, bottoms, shoes, sex='M', n=i)
        times.append(time.time() - t0)

    m, b = np.polyfit(X, times, 1)

    plt.scatter(X, times)
    plt.plot(X, m*X + b)
    plt.show()

def graph2():
    '''Shows graph of time vs. size of palette.'''
    X = np.array(range(10, 40))
    times = []
    for i in range(10,40):
        tops = get_items('top', i)
        bottoms = get_items('bottom', i)
        shoes = get_items('shoe', i)
        t0 = time.time()
        index_palettes(tops, bottoms, shoes, sex='M', n=10)
        times.append(time.time() - t0)

    m, b = np.polyfit(X, times, 1)

    plt.scatter(X, times)
    plt.plot(X, m*X + b)
    plt.show()

# graph1()
graph2()

client.close()