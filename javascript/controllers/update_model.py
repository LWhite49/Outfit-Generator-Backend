# Hello patrick ;) 

# First three inputs are arrays of 4 colors as extracted from productColors
# three obect ids
# Seventh input is a 0 or 1, where 0 is dislike and 1 is like

# This doesn't actually have to return anything, maybe send a simple string if there was a failure for debugging purposes

import sys
import os

relative_path = os.path.join(os.path.dirname(__file__), '../../python/recommendation_system')
sys.path.append(os.path.abspath(relative_path))

import json
import ast
import pandas as pd

# read inputs from site
top = ast.literal_eval(sys.argv[1])
bottom = ast.literal_eval(sys.argv[2])
shoe = ast.literal_eval(sys.argv[3])
top_id = ast.literal_eval(sys.argv[4])
bottom_id = ast.literal_eval(sys.argv[5])
shoe_id = ast.literal_eval(sys.argv[6])
reaction = ast.literal_eval(sys.argv[7])

# new_data = pd.DataFrame(columns=[f'{x}ID', f'{x}_Color1', f'{x}_Color1_Area', f'{x}_Color2', f'{x}_Color2_Area', \
                                # f'{x}_Color3', f'{x}_Color3_Area', f'{x}_Color4', f'{x}_Color4_Area'] for x in ['Top', 'Bottom', 'Shoe'])
# data_row = [top_id, top[0][0], top[0][1], top[1][0], top[1][1]]
data_row = [top_id, top, bottom_id, bottom, shoe_id, shoe, reaction]
new_data = pd.DataFrame(data_row, columns=range(7))
new_data.to_csv('test.csv')