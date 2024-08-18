import pickle
from train_model import flatten_array

file = open('linear_regression.txt', 'rb')
model = pickle.load(file)
file.close()

def predict(top: list[list[str, float]], bottom: list[list[str, float]], shoe: list[list[str, float]]):
    
    print(flatten_array(top, 'top'))

if __name__ == '__main__':
    bottom = [[39, 0.7626759825691902], [74, 0.9842073665159553], [94, 0.9927596179385189], [1, 0.826938610669784]]
    top = [[81, 0.04446910845485719], [80, 0.31393216907364074], [61, 0.1948204741327889], [21, 0.02505551032096842]]
    shoe = [[32, 0.18874528147337621], [10, 0.8188436866791314], [15, 0.032815546289438946], [73, 0.8232446951901217]]
    print(predict(top, bottom, shoe))