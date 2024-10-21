'''Class for predicting the like/dislike label of a given outfit (in the form of the items' color arrays).'''

import pickle
import pandas as pd
import numpy as np
from .color_calculator import outfit_comparison
from time import time

# functions for ease of implementing color relationship functionality

def complementariness(item1, item2):
    return outfit_comparison(item1, item2)[0]

def similarity(item1, item2):
    return outfit_comparison(item1, item2)[1]

def neutrality(item1, item2):
    return outfit_comparison(item1, item2)[2]


class Predictor():
    def __init__(self):
        '''Load trained models.'''
        file = open('../python/recommendation_system/regression.txt', 'rb')
        self.rfr = pickle.load(file)
        file.close()
        file = open('../python/recommendation_system/random_forest.txt', 'rb')
        self.rfc = pickle.load(file)
        file.close()

    def reformat(self, top: list[list[str, float]], bottom: list[list[str, float]], shoe: list[list[str, float]]) -> np.ndarray:
        '''Manipulate input items into necessary format for applying to the models.'''
        # calculate item relationships as a Pandas series
        outfit = pd.Series({
                'TB_complementary': complementariness(top, bottom),
                'TB_similarity': similarity(top, bottom),
                'TB_neutrality': neutrality(top, bottom),
                'BS_complementary': complementariness(shoe, bottom),
                'BS_similarity': similarity(shoe, bottom),
                'BS_neutrality': neutrality(shoe, bottom),
                'TS_complementary': complementariness(top, shoe),
                'TS_similarity': similarity(top, shoe),
                'TS_neutrality': neutrality(top, shoe)
            })

        # pull just values and shape into a single row
        X = outfit[['TB_complementary', 'TB_similarity', 'TB_neutrality',
                    'TS_complementary', 'TS_similarity', 'TS_neutrality',
                    'BS_complementary', 'BS_similarity', 'BS_neutrality']].values.reshape(1, -1)
        
        return X

    def predict(self, top: list[list[str, float]], bottom: list[list[str, float]], shoe: list[list[str, float]]) -> int:
        '''Given three color arrays (top, bottom, and shoe), predict whether the outfit will be liked (1) or disliked (0).'''
        X = self.reformat(top, bottom, shoe)
        return self.rfc.predict(X)[0]
    
    def regress(self, top: list[list[str, float]], bottom: list[list[str, float]], shoe: list[list[str, float]]) -> float:
        '''Given three color arrays (top, bottom, and shoe), estimate a score (from 0 to 1, roughly) reflecting how likely it is to be liked.'''
        X = self.reformat(top, bottom, shoe)
        return self.rfr.predict(X)[0]

if __name__ == '__main__':
    # code for testing
    bottom = [['aeb7b9', 0.38050385837494327], ['8b949b', 0.3521334543803904], ['666c72', 0.17782569223785746], ['0e0d0d', 0.0895369950068089]]
    top = [['dcbc36', 0.865478841870824], ['1b180d', 0.06369710467706013], ['d9c36a', 0.042093541202672606], ['7f6f31', 0.02873051224944321]]
    shoe = [['fbfafa', 0.5259423164962612], ['312e31', 0.1661071265069434], ['bfc2bd', 0.15496719059972533], ['a27254', 0.15298336639707005]]
    t0 = time()
    print(predict(top, bottom, shoe))
    print(time() - t0)