import pickle

file = open('linear_regression.txt', 'rb')
model = pickle.load(file)
file.close()


def random_item(collection):
    '''Returns the color array of a random item selected from the database.'''
    c = db[collection] 
    # sample a random item with a nonempty color array
    pipeline = [{'$match': {'productColors': {'$ne': []}}}, {'$sample': {'size': 1}}]
    result = list(c.aggregate(pipeline))
    if result:
        random_item = result[0]
        # access and return the image as a np array
        img_link = random_item['productImg']
        f = urllib.request.urlopen(img_link)
        return plt.imread(f)
    else:
        print('No items available with color array.')
        return None


print(model.predict(random_item('topmens')))