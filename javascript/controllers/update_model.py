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

new_data = pd.DataFrame(columns=[f'{x}ID', f'{x}_Color1', f'{x}_Color1_Area', f'{x}_Color2', f'{x}_Color2_Area', \
                                f'{x}_Color3', f'{x}_Color3_Area', f'{x}_Color4', f'{x}_Color4_Area'] for x in ['Top', 'Bottom', 'Shoe'])
data_row = [top_id, top[0][0], top[0][1], top[1][0], top[1][1], top]
for i in range(4):
    data_row.extend(top[i])

print(data_row)

# [[39, 0.7626759825691902], [74, 0.9842073665159553], [94, 0.9927596179385189], [1, 0.826938610669784]]
# [[81, 0.04446910845485719], [80, 0.31393216907364074], [61, 0.1948204741327889], [21, 0.02505551032096842]]
# [[32, 0.18874528147337621], [10, 0.8188436866791314], [15, 0.032815546289438946], [73, 0.8232446951901217]]
