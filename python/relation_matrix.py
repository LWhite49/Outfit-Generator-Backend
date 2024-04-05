import pandas as pd
import numpy as np
from grouping.cluster_access import *
from grouping.n_groups import n_groups

# define a matrix of size n x n
mx = np.ndarray((n_groups(), n_groups()))
# the entry (row, column) will contain a score for how well label row pairs with label column

# iterate matrix
for row in range(n_groups()):
    c_row = get_rgb(row) # get rgb of row color
    for column in range(n_groups()):
        c_col = get_rgb(column) # get rbg of column color
        # calculate cosine similarity and assign that to the matrix spot
        cos_sim = np.dot(c_row, c_col)/(np.linalg.norm(c_row) * np.linalg.norm(c_col))
        mx[row][column] = cos_sim

pd.DataFrame(mx).to_csv('color_matrix.csv')