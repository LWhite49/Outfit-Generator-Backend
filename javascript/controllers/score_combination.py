import sys
import os

relative_path = os.path.join(os.path.dirname(__file__), '../../python/recommendation_system')
sys.path.append(os.path.abspath(relative_path))

import sys
import json
import ast
from numpy.random import randint
from color_calculator import outfit_comparison

def score(item1, item2, item3 = None) -> float:
    _, similarity, _, _ = outfit_comparison(item1, item2)
    if not item3:
        return similarity
    else:
        _, similarity2, _, _ = outfit_comparison(item1, item3)
        _, similarity3, _, _ = outfit_comparison(item2, item3)
        return (similarity + similarity2 + similarity3) / 3

def index_palettes(tops: list[list[str, float]], bottoms: list[list[str, float]], shoes: list[list[str, float]]) -> list[dict[str: int]]:
    # will rotate through the arrays for seed item collection
    item_roto = [tops, bottoms, shoes]
    roto_idx = 0

    indexed_fits = [] # final array to be returned
    selected_items = [[-1],[-1],[-1]] # keeps track of indices selected for seeding so that the same seed isn't picked twice
    while len(indexed_fits) <= 20:
        outfit_dict = {'top': -1, 'bottom': -1, 'shoe': -1}
        
        seed_array = item_roto[roto_idx]
        
        seed_idx = randint(0, len(seed_array)) # get a random item to seed the selection process
        while seed_idx in selected_items[roto_idx]:
            seed_idx = randint(0, len(seed_array))
        seed_colors = seed_array[seed_idx]

        outfit_dict[list(outfit_dict.keys())[roto_idx]] = seed_idx
        
        # get a certain number of items from the next set for comparison
        rand_indices = randint(0, len(seed_array), size=6)
        # compare all these indices to the seed, selecting the best one
        best_idx = rand_indices[0]
        best_score = score(seed_colors, item_roto[roto_idx + 1][0])
        for i in rand_indices[1:]:
            comparison = score(seed_colors, item_roto[roto_idx + 1][i])
            if comparison > best_score:
                best_score = comparison
                best_idx = i
        
        outfit_dict[list(outfit_dict.keys())[roto_idx + 1]] = best_idx
        
        # repeat this process for the final set
        rand_indices = randint(0, len(seed_array), size=10)
        best_idx = rand_indices[0]
        best_score = score(seed_colors, item_roto[roto_idx + 2][0])
        for i in rand_indices[1:]:
            comparison = score(seed_colors, item_roto[roto_idx + 2][i])
            if comparison > best_score:
                best_score = comparison
                best_idx = i
        
        outfit_dict[list(outfit_dict.keys())[roto_idx + 2]] = best_idx

        indexed_fits.append(outfit_array)
        roto_idx = (roto_idx + 1) % 2 # increment rotation index
    
    return indexed_fits

tops = ast.literal_eval(sys.argv[1])
bottoms = ast.literal_eval(sys.argv[2])
shoes = ast.literal_eval(sys.argv[3])

outfits = index_palettes(tops, bottoms, shoes)

print(json.dumps(outfits))
sys.stdout.flush()