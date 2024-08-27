from dotenv import load_dotenv
from os import getenv
from model_predict import predict
from pymongo import MongoClient
from random import choice
from scipy import stats
import numpy as np
import random

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
    pipeline = [{'$match': {'productColors': {'$ne': []}}}, {'$sample': {'size': 30}}]
    result = list(collection.aggregate(pipeline))
    if result:
        result = [item['productColors'] for item in result] # pull just colors
        return result
    # throw an error if the pipeline failed
    raise Exception(f'Problem accumulating items from collection {collectionName}')

# def random_item(collectionName):
#     '''Returns the color array of a random item selected from the database.'''
#     collection = db[collectionName] 
#     # sample a random item with a nonempty color array
#     pipeline = [{'$match': {'productColors': {'$ne': []}}}, {'$sample': {'size': 1}}]
#     result = list(collection.aggregate(pipeline))
#     if result:
#         return result[0]['productColors']
#     else:
#         print(f'No items available from {collectionName} with color array.')
#         return None

def permutationNumberFinder(confidenceLevel, acceptedError = 0.05):
#     '''Estimates the number of permutations needed to achieve a high average score.'''
#     ''' This function is based on the monte carlo simulation method. '''
    
    tops = random_items(random.choice(['topmens', 'topwomens']))
    bottoms = random_items(random.choice(['bottommens', 'bottomwomens']))
    shoes = random_items(random.choice(['shoemens', 'shoewomens']))

    highScoreCount = 0 # number of high scoring outfits found
    simulationAmount = 0 # the amounnt of simulations ran until the target confidence level is reached
    targetConfidenceReached = False # initially set to false
    highScoreThreshold = 0.8 # our threshold score for what we consider a good outfit

    highestScore = 0

    outfitScores = []

    for i in range(500):
        simulationAmount += 1
        setOutfitScore = 0

        outfits = []
        # Generate 20 random outfits and calculate the average score
        for _ in range(20):
            # Generate random top, bottom, and shoe
            top = choice(tops)
            bottom = choice(bottoms)
            shoe = choice(shoes)

            outfits.append([top, bottom, shoe])
            setOutfitScore += predict(top, bottom, shoe)

            # if top and bottom and shoe:
            #     setOutfitScore += predict(top, bottom, shoe)
            # else:
            #     print('Something went wrong with the random outfit generation.')
            #     return

        
        # Calculate the average score
        setOutfitScore /= 20
        
        if setOutfitScore > highestScore:
            highestScore = setOutfitScore

        outfitScores.append(setOutfitScore)

        # Check if the averaged score is above the threshold specified
        if setOutfitScore > highScoreThreshold:
            highScoreCount += 1

        # Update the probability after each iteration
        current_confidence = highScoreCount / simulationAmount

        # Check if the current confidence level meets or exceeds the target confidence level
        if current_confidence >= confidenceLevel:
            targetConfidenceReached = True
    
    variance = np.var(outfitScores) # get sample standard deviation
    print(f"Variance of outfit scores: {variance}")
    z = stats.norm.ppf(confidenceLevel)
    n = ((z ** 2) * variance) / (acceptedError ** 2)
    print(f"Highest score found: {highestScore}")

    # Print the number of permutations required to reach the target confidence level
    print(f"Number of permutations required to reach {confidenceLevel * 100}% confidence: {n}")

if __name__ == '__main__':
    permutationNumberFinder(0.95, 0.03)