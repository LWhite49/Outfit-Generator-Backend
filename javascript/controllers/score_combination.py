'''To be called as a child process for the purpose of serving ordered outfits to the backend.'''

import sys
import os

relative_path = os.path.join(os.path.dirname(__file__), '../../python/')
sys.path.append(os.path.abspath(relative_path))

import json
import ast
from recommendation_system.color_calculator import outfit_comparison
from recommendation_system.model_predict import Predictor
import random

def index_palettes(tops, bottoms, shoes, sex, n=20):
    '''Given sets of tops, bottoms, and shoes return n outfits predicted to be liked by the algorithm. 
    This takes the form of an array of n dictionaries, each with an index from each collection indicating which item from the original set should be in that outfit.'''
    model = Predictor() # instantiate predictor

    # we will reference lists by index to avoid problems with shifting indices
    top_idxs = set(range(len(tops)))
    bottom_idxs = set(range(len(bottoms)))
    shoe_idxs = set(range(len(shoes)))

    indexed_fits = []
    iter_count = 0
    # iterate until we have n outfits, or 100 iterations
    while len(indexed_fits) < n and iter_count < 100:
        if not top_idxs or not bottom_idxs or not shoe_idxs:
            break

        # select random indexes from the pool
        top_i = random.choice(list(top_idxs))
        bottom_i = random.choice(list(bottom_idxs))
        shoe_i = random.choice(list(shoe_idxs))

        # check if the algorithm predicts this outfit to be liked
        if model.predict(tops[top_i], bottoms[bottom_i], shoes[shoe_i], sex) == 1:
            # store items in a dictionary
            fit = {'top': top_i, 'bottom': bottom_i, 'shoe': shoe_i}
            # add to return array
            indexed_fits.append(fit)
            
            # drop indices from pool
            top_idxs.remove(top_i)
            bottom_idxs.remove(bottom_i)
            shoe_idxs.remove(shoe_i)
        
        iter_count += 1 # count iterations
    
    # if we did not get enough outfits
    if len(indexed_fits) < n:
        filler_fits = []
        for i in range(2 * (n - len(indexed_fits))):
            if not top_idxs or not bottom_idxs or not shoe_idxs:
                break

            # select random indexes from the pool
            top_i = random.choice(list(top_idxs))
            bottom_i = random.choice(list(bottom_idxs))
            shoe_i = random.choice(list(shoe_idxs))

            # get regression score of outfit
            score = model.regress(tops[top_i], bottoms[bottom_i], shoes[shoe_i], sex)
            # store items in a dictionary
            fit = {'top': top_i, 'bottom': bottom_i, 'shoe': shoe_i}
            filler_fits.append([score, fit])

            # drop indices from pool
            top_idxs.remove(top_i)
            bottom_idxs.remove(bottom_i)
            shoe_idxs.remove(shoe_i)

        sorted(filler_fits, key=lambda f: f[0]) # sort by score

        i = 0
        while len(indexed_fits) < n and i < len(filler_fits):
            indexed_fits.append(filler_fits[i][1])
            i += 1

    return indexed_fits

if __name__ == '__main__':
    # get clothes from javascript
    tops = ast.literal_eval(sys.argv[1])
    bottoms = ast.literal_eval(sys.argv[2])
    shoes = ast.literal_eval(sys.argv[3])

    sexes = [g[3] for g in sys.argv[4:]] # extracting first letter from sex string passed in
    sex = 'M' if sexes.count('m') > sexes.count('f') else 'F'

    # create outfits
    outfits = index_palettes(tops, bottoms, shoes, sex)
        
    print(json.dumps(outfits))
    sys.stdout.flush()