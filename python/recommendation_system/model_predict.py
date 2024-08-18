import pickle
from train_model import flatten_array

file = open('linear_regression.txt', 'rb')
model = pickle.load(file)
file.close()

def predict(top: list[list[str, float]], bottom: list[list[str, float]], shoe: list[list[str, float]]):
    print(flatten_array(top, 'top'))