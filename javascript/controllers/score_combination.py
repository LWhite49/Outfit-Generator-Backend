import sys
import os

relative_path = os.path.join(os.path.dirname(__file__), '../../python/recommendation_system')
sys.path.append(os.path.abspath(relative_path))

import json
import ast
from numpy.random import randint
from color_calculator import outfit_comparison
from random import shuffle

def score(item1, item2, item3 = None) -> float:
    _, similarity, n1, n2 = outfit_comparison(item1, item2)
    if not item3:
        rel_neutrality = n1 + n2 - (0.2 * n1 * n2)

        return (0.7 * similarity) + (0.3 * rel_neutrality)
    else:
        _, similarity2, n1_2, n2_2 = outfit_comparison(item1, item3)
        _, similarity3, n1_3, n2_3 = outfit_comparison(item2, item3)

        score1 = (0.7 * similarity) + (0.3 * (n1 + n2 - (0.2 * n1 * n2)))
        score2 = (0.7 * similarity2) + (0.3 * (n1_2 + n2_2 - (0.2 * n1_2 * n2_2)))
        score3 = (0.7 * similarity3) + (0.3 * (n1_3 + n2_3 - (0.2 * n1_3 * n2_3)))

        return (similarity + similarity2 + similarity3) / 3

# def index_palettes(tops: list[list[str, float]], bottoms: list[list[str, float]], shoes: list[list[str, float]]) -> list[dict[str: int]]:
#     outfits_returned = 20
#     max_appearances = 2
#     pool_size = 6
    
#     # will rotate through the arrays for seed item collection
#     item_roto = [tops, bottoms, shoes]
#     roto_idx = 0

#     indexed_fits = [] # final array to be returned
#     selected_items = [[-1],[-1],[-1]] # keeps track of indices selected for seeding so that the same seed isn't picked twice
#     times_selected = {key: 0 for key in range(len(tops))} # initialize a dictionary that will keep track of how many times each item is chosen
#     times_selected[-1] = max_appearances
#     while len(indexed_fits) <= outfits_returned:
#         outfit_dict = {'top': -1, 'bottom': -1, 'shoe': -1}
        
#         seed_array = item_roto[roto_idx]
        
#         seed_idx = randint(0, len(seed_array)) # get a random item to seed the selection process
#         while seed_idx in selected_items[roto_idx] or times_selected[seed_idx] >= max_appearances:
#             seed_idx = randint(0, len(seed_array))
#         seed_colors = seed_array[seed_idx]

#         outfit_dict[list(outfit_dict.keys())[roto_idx]] = int(seed_idx)
#         times_selected[int(seed_idx)] += 1
        
#         # get a certain number of items from the next set for comparison
#         rand_indices = randint(0, len(seed_array), size=pool_size)
#         # compare all these indices to the seed, selecting the best one
#         best_idx = -1
#         while times_selected[best_idx] >= max_appearances:
#             best_idx = rand_indices[0]
#             best_score = score(seed_colors, item_roto[(roto_idx + 1) % 3][0])
#             for i in rand_indices[1:]:
#                 comparison = score(seed_colors, item_roto[(roto_idx + 1) % 3][i])
#                 if comparison > best_score:
#                     best_score = comparison
#                     best_idx = i
        
#         outfit_dict[list(outfit_dict.keys())[(roto_idx + 1) % 3]] = int(best_idx)
#         times_selected[int(best_idx)] += 1
        
#         # repeat this process for the final set
#         rand_indices = randint(0, len(seed_array), size=pool_size * 2)
#         best_idx = -1
#         while times_selected[best_idx] >= max_appearances:
#             best_idx = rand_indices[0]
#             best_score = score(seed_colors, item_roto[(roto_idx + 2) % 3][0])
#             for i in rand_indices[1:]:
#                 comparison = score(seed_colors, item_roto[(roto_idx + 2) % 3][i])
#                 if comparison > best_score:
#                     best_score = comparison
#                     best_idx = i
        
#         outfit_dict[list(outfit_dict.keys())[(roto_idx + 2) % 3]] = int(best_idx)
#         times_selected[int(best_idx)] += 1

#         indexed_fits.append(outfit_dict)
#         roto_idx = (roto_idx + 1) % 3 # increment rotation index
    
#     return indexed_fits

def index_palettes(tops: list[list[str, float]], bottoms: list[list[str, float]], shoes: list[list[str, float]]) -> list[dict[str: int]]:
    outfits_returned = 20
    max_appearances = 1
    pool_size = 6
    
    # will rotate through the arrays for seed item collection
    item_roto = [tops, bottoms, shoes]
    roto_idx = randint(0,3)

    indexed_fits = [] # final array to be returned
    selected_items = [[-1],[-1],[-1]] # keeps track of indices selected for seeding so that the same seed isn't picked twice
    # initialize a dictionary that will keep track of how many times each item is chosen
    times_selected = [{key: 0 for key in range(len(tops))},{key: 0 for key in range(len(bottoms))},{key: 0 for key in range(len(shoes))}] 
    while len(indexed_fits) <= outfits_returned:
        outfit_dict = {'top': -1, 'bottom': -1, 'shoe': -1}
        
        seed_array = item_roto[roto_idx]
        
        seed_idx = randint(low=0, high=len(seed_array)) # get a random item to seed the selection process
        while times_selected[roto_idx][seed_idx] >= max_appearances: #selected_items[roto_idx]:
            seed_idx = randint(low=0, high=len(seed_array))
        seed_colors = seed_array[seed_idx]
        times_selected[roto_idx][seed_idx] += 1 # update list of map of times selected

        outfit_dict[list(outfit_dict.keys())[roto_idx]] = int(seed_idx)
        
        # function for repeatability
        def find_best(flag=1, colors2=None):
            # get a certain number of items from the next set for comparison
            rand_indices = randint(low=0, high=len(seed_array), size=pool_size*flag)
            # compare all these indices to the seed, selecting the best one
            best_idx = -1
            best_score = -1
            # iterate through pool of random items
            for i in rand_indices:
                # score this item either in relation to just the seed or to both the seed and second item
                if flag == 1:
                    comparison = score(seed_colors, item_roto[(roto_idx + 1) % 3][i])
                else:
                    comparison = score(seed_colors, colors2, item_roto[(roto_idx + 2) % 3][i])
                # if it has the best score thus far, save it 
                if comparison > best_score:
                    best_score = comparison
                    best_idx = i
            
            return best_idx if best_idx != -1 and times_selected[(roto_idx + 1) % 3][best_idx] < max_appearances else find_best()

        # find best item from next set
        best_idx = find_best()

        item2_colors = item_roto[(roto_idx + 1) % 3][best_idx] # save item colors
        times_selected[(roto_idx + 1) % 3][best_idx] += 1 # update map of selections
        
        outfit_dict[list(outfit_dict.keys())[(roto_idx + 1) % 3]] = int(best_idx) # store item in the outfit dictionary
        
        # repeat this process for the final set
        best_idx = find_best(2, item2_colors)

        times_selected[(roto_idx + 2) % 3][best_idx] += 1 # update map of selections
        
        outfit_dict[list(outfit_dict.keys())[(roto_idx + 2) % 3]] = int(best_idx) # store item in the outfit dictionary

        indexed_fits.append(outfit_dict) # add the completed outfit to the list
        roto_idx = (roto_idx + 1) % 3 # increment rotation index
    
    return indexed_fits

tops = ast.literal_eval(sys.argv[1])
bottoms = ast.literal_eval(sys.argv[2])
shoes = ast.literal_eval(sys.argv[3])

outfits = index_palettes(tops, bottoms, shoes)
shuffle(outfits)

print(json.dumps(outfits))
sys.stdout.flush()