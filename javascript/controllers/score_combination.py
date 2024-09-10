'''To be called as a child process for the purpose of serving ordered outfits to the backend.'''

import sys
import os

relative_path = os.path.join(os.path.dirname(__file__), '../../python/')
sys.path.append(os.path.abspath(relative_path))

import json
import ast
from numpy.random import randint
from recommendation_system.color_calculator import outfit_comparison
from recommendation_system.model_predict import Predictor
import random

def index_palettes(tops, bottoms, shoes, n=20):
    '''Given sets of tops, bottoms, and shoes return n outfits predicted to be liked by the algorithm. This takes the form of an array of 
    n dictionaries, each with an index from each collection indicating which item from the original set should be in that outfit.'''
    rfc = Predictor() # instantiate predictor

    # we will reference lists by index to avoid problems with shifting indices
    top_idxs = list(range(len(tops)))
    bottom_idxs = list(range(len(bottoms)))
    shoe_idxs = list(range(len(shoes)))

    #! add break condition for if we run out of items before we get good outfits
    #! use linear regression to find best ones with a couple iterations?
    indexed_fits = []
    # iterate until we have n outfits
    while len(indexed_fits) < n:
        # select random indexes from the pool
        top_i = random.choice(top_idxs)
        bottom_i = random.choice(bottom_idxs)
        shoe_i = random.choice(shoe_idxs)
        
        # check if the algorithm predicts this outfit to be liked
        if rfc.predict(tops[top_i], bottoms[bottom_i], shoes[shoe_i]) == 1:
            # store items in a dictionary
            fit = {'top': top_i, 'bottom': bottom_i, 'shoe': shoe_i}
            # add to return array
            indexed_fits.append(fit)
            
            # drop indices from pool
            top_idxs.remove(top_i)
            bottom_idxs.remove(bottom_i)
            shoe_idxs.remove(shoe_i)

    return indexed_fits

if __name__ == '__main__':
    # get clothes from javascript
    tops = ast.literal_eval(sys.argv[1])
    bottoms = ast.literal_eval(sys.argv[2])
    shoes = ast.literal_eval(sys.argv[3])

    # create outfits
    outfits = index_palettes(tops, bottoms, shoes)

    # send ordered set back to javascript
    print(json.dumps(outfits))
    sys.stdout.flush()