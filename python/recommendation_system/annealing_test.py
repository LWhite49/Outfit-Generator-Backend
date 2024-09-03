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

def random_items(collectionName, n=30):
    '''Returns the color array of a random item selected from the database.'''
    collection = db[collectionName] 
    # sample a random item with a nonempty color array
    pipeline = [{'$match': {'productColors': {'$ne': []}}}, {'$sample': {'size': n}}]
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

def random_swaps(tops, bottoms, shoes, iterations=50):
    # save entire pallettes as sets
    all_tops = set(tops)
    all_bottoms = set(bottoms)
    all_shoes = set(shoes)
    
    # select initial random 10 outfits
    outfit_tops = random.sample(tops, 10)
    outfit_bottoms = random.sample(bottoms, 10)
    outfit_shoes = random.sample(shoes, 10)
    outfits = [[outfit_tops[i], outfit_bottoms[i], outfit_shoes[i]] for i in range(20)]
    
    # max_score = 
    for _ in range(iterations):
        outfit_tops = random.sample(tops, 20)
        outfit_bottoms = random.sample(bottoms, 20)
        outfit_shoes = random.sample(shoes, 20)
        outfits = [[outfit_tops[i], outfit_bottoms[i], outfit_shoes[i]] for i in range(20)]

        avg_score = np.mean([predict(*outfit) for outfit in outfits])
        if avg_score > max_score:
            max_score = avg_score
    return max_score

def top_x(tops, bottoms, shoes, n=20):
    top_idxs = list(range(len(tops)))
    bottom_idxs = list(range(len(bottoms)))
    shoe_idxs = list(range(len(shoes)))

    #! add break condition for if we run out of items before we get good outfits
    #! use linear regression to find best ones with a couple iterations?
    indexed_fits = []
    while len(indexed_fits) < n:
        # select random indexes from the pool
        top_i = random.choice(top_idxs)
        bottom_i = random.choice(bottom_idxs)
        shoe_i = random.choice(shoe_idxs)
        
        # check if the algorithm predicts this outfit to be liked
        if predict(tops[top_i], bottoms[bottom_i], shoes[shoe_i]) == 1:
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
    shirts = random_items(random.choice(['topmens', 'topwomens']), 40)
    bottoms = random_items(random.choice(['bottommens', 'bottomwomens']), 40)
    shoes = random_items(random.choice(['shoemens', 'shoewomens']), 40)
    # optimal_outfits, optimal_score = simulated_annealing(shirts, bottoms, shoes, iterations=100, cooling_rate=0.9)
    # optimal_score = random_swaps(shirts, bottoms, shoes)
    print(top_x(shirts, bottoms, shoes))
    # print(f"Optimal Average Score: {optimal_score}")

client.close()