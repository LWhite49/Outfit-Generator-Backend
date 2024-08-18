from model_predict import predict
from pymongo import MongoClient

# Initialize ENV
load_dotenv()

# Source ENV
connectionString = os.getenv('DB_CONNECTION_PY')
# Connect to Mongo
client = MongoClient(connectionString)
# Connect to DB
db = client['archive']



def permutationNumberFinder():
#     '''Estimates the number of permutations needed to achieve a high average score.'''
#     ''' This function is based on the monte carlo simulation method. '''

    highScoreCount = 0 # number of high scoring outfits found
    simulationAmount = 0 # the amounnt of simulations ran until the target confidence level is reached
    confidenceLevel = 0.95 # the target confidence level
    targetConfidenceReached = False # initially set to false
    highScoreThreshold = 0.8 # our threshold score for what we consider a good outfit

    while not targetConfidenceReached:
        simulationAmount += 1
        setOutfitScore = 0

        # Generate 20 random outfits and calculate the average score
        for _ in range(20):
            # Generate random top, bottom, and shoe
            top = random_item('top')
            bottom = random_item('bottom')
            shoe = random_item('shoe')

            if top and bottom and shoe:
                setOutfitScore += predict(top, bottom, shoe)
            else:
                print('Something went wrong with the random outfit generation.')
                return
        # Calculate the average score
        setOutfitScore /= 20

        # Check if the averaged score is above the threshold specified
        if setOutfitScore > highScoreThreshold:
            highScoreCount += 1

        # Update the probability after each iteration
        current_confidence = highScoreCount / simulationAmount

        # Check if the current confidence level meets or exceeds the target confidence level
        if current_confidence >= confidenceLevel:
            targetConfidenceReached = True

    # Print the number of permutations required to reach the target confidence level
    print(f"Number of permutations required to reach {confidenceLevel * 100}% confidence: {simulationAmount}")

            


def random_item(collection):
    '''Returns the color array of a random item selected from the database.'''
    collection = db[collection] 
    # sample a random item with a nonempty color array
    pipeline = [{'$match': {'productColors': {'$ne': []}}}, {'$sample': {'size': 1}}]
    result = list(collection.aggregate(pipeline))
    if result:
        return result[0]
    else:
        print('No items available with color array.')
        return None

