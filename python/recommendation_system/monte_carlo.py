import pickle
from model_predict import score
from pymongo import MongoClient


if __name__ == "__main__":





    def permutationNumberFinder():
        highScoreCount = 0
        simulationAmount = 10000

        for _ in range(simulationAmount):
            top = random_item('top')
            bottom = random_item('bottom')
            shoe = random_item('shoe')

            setOutfitScore = predict(top, bottom, shoe)


    def random_item(collection):
        '''Returns the color array of a random item selected from the database.'''
        c = db[collection] 
        # sample a random item with a nonempty color array
        pipeline = [{'$match': {'productColors': {'$ne': []}}}, {'$sample': {'size': 1}}]
        result = list(c.aggregate(pipeline))
        if result:
            print(result)
        else:
            print('No items available with color array.')
            return None

    # file = open('linear_regression.txt', 'rb')
    # model = pickle.load(file)
    # file.close()

    # Initialize ENV
    load_dotenv()

    # Source ENV
    connectionString = os.getenv('DB_CONNECTION_PY')
    # Connect to Mongo
    client = MongoClient(connectionString)
    # Connect to DB
    db = client['archive']
    random_item(db['top'])
