import pickle
from sklearn.preprocessing import MinMaxScaler
# from train_model import flatten_array
import pandas as pd
from color_calculator import outfit_comparison
from time import time
import sys

# file = open('linear_regression.txt', 'rb')
print(sys.path)
file = open('random_forest.txt', 'rb')
model = pickle.load(file)
file.close()
# print(model.classes_)
# file.close()

def complementariness(item1, item2):
    return outfit_comparison(item1, item2)[0]

def similarity(item1, item2):
    return outfit_comparison(item1, item2)[1]

def neutrality(item1, item2):
    return outfit_comparison(item1, item2)[2]

# comparisons for top and bottom


# # comparisons for top and shoe
# outfit['TS_complementary'] = outfit.apply(lambda row: complementariness(row['top_colors'], row['shoe_colors']), axis=1)
# outfit['TS_similarity'] = outfit.apply(lambda row: similarity(row['top_colors'], row['shoe_colors']), axis=1)
# outfit['TS_neutrality'] = outfit.apply(lambda row: neutrality(row['top_colors'], row['shoe_colors']), axis=1)

# # comparisons for bottom and shoe
# outfit['BS_complementary'] = outfit.apply(lambda row: complementariness(row['bottom_colors'], row['shoe_colors']), axis=1)
# outfit['BS_similarity'] = outfit.apply(lambda row: similarity(row['bottom_colors'], row['shoe_colors']), axis=1)
# outfit['BS_neutrality'] = outfit.apply(lambda row: neutrality(row['bottom_colors'], row['shoe_colors']), axis=1)

def predict(top: list[list[str, float]], bottom: list[list[str, float]], shoe: list[list[str, float]]):
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

    X = outfit[['TB_complementary', 'TB_similarity', 'TB_neutrality',
                'TS_complementary', 'TS_similarity', 'TS_neutrality',
                'BS_complementary', 'BS_similarity', 'BS_neutrality']].values.reshape(1, -1)
    
    # pull outfit items into series
    outfit = pd.Series({'top_colors': top, 'bottom_colors': bottom, 'shoe_colors': shoe})

    return model.predict(X)[0]

if __name__ == '__main__':
    bottom = [['aeb7b9', 0.38050385837494327], ['8b949b', 0.3521334543803904], ['666c72', 0.17782569223785746], ['0e0d0d', 0.0895369950068089]]
    top = [['dcbc36', 0.865478841870824], ['1b180d', 0.06369710467706013], ['d9c36a', 0.042093541202672606], ['7f6f31', 0.02873051224944321]]
    shoe = [['fbfafa', 0.5259423164962612], ['312e31', 0.1661071265069434], ['bfc2bd', 0.15496719059972533], ['a27254', 0.15298336639707005]]
    t0 = time()
    print(predict(top, bottom, shoe))
    print(time() - t0)