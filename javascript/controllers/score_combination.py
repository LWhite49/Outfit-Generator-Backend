import sys
import os

relative_path = os.path.join(os.path.dirname(__file__), '../../python/')
sys.path.append(os.path.abspath(relative_path))

import json
import ast
from numpy.random import randint
from recommendation_system.color_calculator import outfit_comparison
from recommendation_system.model_predict import predict
import random

# def score(item1, item2, item3 = None) -> float:
#     sim_weight = 0.75
#     neut_weight = 0.25

#     _, similarity, neutrality = outfit_comparison(item1, item2)
#     if not item3:
#         return (sim_weight * similarity) + (neut_weight * neutrality)
#     else:
#         _, similarity2, neutrality2 = outfit_comparison(item1, item3)
#         _, similarity3, neutrality3 = outfit_comparison(item2, item3)

#         score1 = (sim_weight * similarity) + (neut_weight * neutrality)
#         score2 = (sim_weight * similarity2) + (neut_weight * neutrality2)
#         score3 = (sim_weight * similarity3) + (neut_weight * neutrality3)

#         return (score1 + score2 + score3) / 3

# def index_palettes(tops: list[list[str, float]], bottoms: list[list[str, float]], shoes: list[list[str, float]]) -> list[dict[str: int]]:
#     outfits_returned = 20
#     # max_appearances = 1
#     pool_size = 6
    
#     # will rotate through the arrays for seed item collection
#     item_roto = [tops, bottoms, shoes]
#     roto_idx = randint(0,3)

#     indexed_fits = [] # final array to be returned
#     selected_items = [[-1],[-1],[-1]] # keeps track of indices selected for seeding so that the same seed isn't picked twice
#     # initialize a dictionary that will keep track of how many times each item is chosen
#     # times_selected = [{key: 0 for key in range(len(tops))},{key: 0 for key in range(len(bottoms))},{key: 0 for key in range(len(shoes))}] 
#     while len(indexed_fits) <= outfits_returned:
#         outfit_dict = {'top': -1, 'bottom': -1, 'shoe': -1}
        
#         seed_array = item_roto[roto_idx]
        
#         seed_idx = randint(low=0, high=len(seed_array)) # get a random item to seed the selection process
#         while seed_idx in selected_items[roto_idx]: #times_selected[roto_idx][seed_idx] >= max_appearances:
#             seed_idx = randint(low=0, high=len(seed_array))
#         seed_colors = seed_array[seed_idx]
#         # times_selected[roto_idx][seed_idx] += 1 # update list of map of times selected
#         selected_items[roto_idx].append(seed_idx)

#         outfit_dict[list(outfit_dict.keys())[roto_idx]] = int(seed_idx)
        
#         # function for repeatability
#         def find_best(flag=1, colors2=None):
#             # get a certain number of items from the next set for comparison
#             rand_indices = randint(low=0, high=len(seed_array), size=pool_size*flag)
#             # compare all these indices to the seed, selecting the best one
#             best_idx = -1
#             best_score = -1
#             # iterate through pool of random items
#             for i in rand_indices:
#                 # score this item either in relation to just the seed or to both the seed and second item
#                 if flag == 1:
#                     comparison = score(seed_colors, item_roto[(roto_idx + 1) % 3][i])
#                 else:
#                     comparison = score(seed_colors, colors2, item_roto[(roto_idx + 2) % 3][i])
#                 # if it has the best score thus far, save it 
#                 if comparison > best_score:
#                     best_score = comparison
#                     best_idx = i
            
#             return best_idx if (best_idx != -1 and best_idx not in selected_items[(roto_idx + flag) % 3]) else find_best() #times_selected[(roto_idx + 1) % 3][best_idx] < max_appearances else find_best()

#         # find best item from next set
#         best_idx = find_best()
#         item2_colors = item_roto[(roto_idx + 1) % 3][best_idx] # save item colors
#         # times_selected[(roto_idx + 1) % 3][best_idx] += 1 # update map of selections
#         selected_items[(roto_idx + 1) % 3].append(best_idx)
        
#         outfit_dict[list(outfit_dict.keys())[(roto_idx + 1) % 3]] = int(best_idx) # store item in the outfit dictionary
        
#         # repeat this process for the final set
#         best_idx = find_best(2, item2_colors)
#         # times_selected[(roto_idx + 2) % 3][best_idx] += 1 # update map of selections
#         selected_items[(roto_idx + 2) % 3].append(best_idx)
        
#         outfit_dict[list(outfit_dict.keys())[(roto_idx + 2) % 3]] = int(best_idx) # store item in the outfit dictionary

#         indexed_fits.append(outfit_dict) # add the completed outfit to the list
#         roto_idx = (roto_idx + 1) % 3 # increment rotation index
    
#     return indexed_fits

def index_palettes(tops, bottoms, shoes, n=20):
    top_idxs = range(len(tops))
    bottom_idxs = range(len(bottoms))
    shoe_idxs = range(len(shoes))

    #! add break condition for if we run out of items before we get good outfits
    #! use linear regression to find best ones with a couple iterations?
    indexed_fits = []
    while len(indexed_fits) < n:
        # select random indexes from the pool
        top_i = random.choice(top_idxs)
        bottom_i = random.choice(bottom_idxs)
        shoe_i = random.choice(shoe_idxs)
        
        # check if the algorithm predicts this outfit to be liked
        if predict(tops[top_i], bottoms[bottom_i], shoes[shoe_i]) == 1:
            # store items in a dictionary
            fit = {'top': top_i, 'bottom': bottom_i, 'shoe': shoe_i}
            # add to return array
            indexed_fits.append(fit)
            
            # drop indices from pool
            top_idxs.pop(top_i)
            bottom_idxs.pop(bottom_i)
            shoe_idxs.pop(shoe_i)

    return indexed_fits

tops = ast.literal_eval(sys.argv[1])
bottoms = ast.literal_eval(sys.argv[2])
shoes = ast.literal_eval(sys.argv[3])

outfits = index_palettes(tops, bottoms, shoes)
# shuffle(outfits)

print(json.dumps(outfits))
sys.stdout.flush()