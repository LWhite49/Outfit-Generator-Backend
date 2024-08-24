import random
import numpy as np
from dotenv import load_dotenv
from os import getenv
from model_predict import predict
from pymongo import MongoClient
from matplotlib.pyplot import plot as plt

# Initialize ENV
load_dotenv()

# Source ENV
connectionString = getenv('DB_CONNECTION_PY')
# Connect to Mongo
client = MongoClient(connectionString)
# Connect to DB
db = client['test']

def random_items(collectionName):
    '''Returns the color array of a random item selected from the database.'''
    collection = db[collectionName] 
    # sample a random item with a nonempty color array
    pipeline = [{'$match': {'productColors': {'$ne': []}}}, {'$sample': {'size': 20}}]
    result = list(collection.aggregate(pipeline))
    if result:
        result = [item['productColors'] for item in result] # pull just colors
        return result
    # throw an error if the pipeline failed
    raise Exception(f'Problem accumulating items from collection {collectionName}')

def simulated_annealing(shirts, bottoms, shoes, iterations=1000, temperature=1.0, cooling_rate=0.99, threshold=0.8):
    def swap_items(outfits):
        # Swap an item between two outfits randomly
        i, j = random.sample(range(20), 2)
        k = random.choice([0, 1, 2])  # Choose to swap shirt, bottom, or shoe
        outfits[i][k], outfits[j][k] = outfits[j][k], outfits[i][k]
        return outfits

    # Initial random outfit selection
    outfits = [[shirts[i], bottoms[i], shoes[i]] for i in range(20)]
    current_score = np.mean([predict(*outfit) for outfit in outfits])

    best_outfits = outfits
    best_score = current_score

    for _ in range(iterations):
        new_outfits = swap_items([outfit[:] for outfit in outfits])
        new_score = np.mean([predict(*outfit) for outfit in new_outfits])

        if new_score > current_score or random.random() < np.exp((new_score - current_score) / temperature):
            outfits = new_outfits
            current_score = new_score

        if new_score > best_score:
            best_outfits = new_outfits
            best_score = new_score
        
        if best_score > threshold:
            break

        temperature *= cooling_rate

    return best_outfits, best_score

if __name__ == '__main__':
    shirts = random_items(random.choice(['topmens', 'topwomens']))
    bottoms = random_items(random.choice(['bottommens', 'bottomwomens']))
    shoes = random_items(random.choice(['shoemens', 'shoewomens']))
    optimal_outfits, optimal_score = simulated_annealing(shirts, bottoms, shoes)
    print(f"Optimal Average Score: {optimal_score}")