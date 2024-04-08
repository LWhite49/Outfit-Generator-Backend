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
        
        # # calculate the probability that two rgb colors are complementary
        # # calculate the Euclidean distance between the sum of the RGB components and 255
        # distance = np.linalg.norm((np.array(c_row) + np.array(c_col)) - 255)

        # # normalize the distance to get a probability between 0 and 1
        # complementary_prob = 1 - (distance / np.sqrt(3 * (255**2)))

        # # call a function that will handle the probability of two colors being analogous
        # analogous_prob = analogous_probability(c_row, c_col)

        # # call a function that will compute the three probabilities into a bayes theorem
        # finalized_prob = bayes_theorem(complementary_prob, analogous_prob, cos_sim)
        
        # mx[row][column] = finalized_prob

        mx[row][column] = cos_sim






pd.DataFrame(mx).to_csv('color_matrix.csv')