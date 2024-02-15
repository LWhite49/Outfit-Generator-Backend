# from . import preprocessing
import pandas as pd
from sklearn.neighbors import KNeighborsClassifier
from sklearn.model_selection import train_test_split, GridSearchCV
from sklearn.metrics import accuracy_score

class ColorPredictor():
    '''Implements the functionality of the categorization model in a simple object'''
    def __init__(self):
        # get the processed data
        colors = pd.read_csv('color_names_clustered.csv')
        y = colors.Label
        X = colors[['Red', 'Green', 'Blue', 'Hue']]

        # splitting data seems to help with accuracy, probably mitigating overfitting
        self.X_train, self.X_test, self.y_train, self.y_test = train_test_split(X, y, test_size=0.33, random_state=463)
        
        # train the model
        self.model = KNeighborsClassifier(n_neighbors=15, weights='distance', algorithm='ball_tree')
        self.model.fit(self.X_train.values, self.y_train)
    def predict(self, rgb: list[int], ) -> str:
        '''The object takes in a list of rgb values and returns the predicted label from its model'''
        return self.model.predict(rgb)

# code for testing
if __name__ == '__main__':
    predictor = ColorPredictor()

    # used a grid search to find optimal parameters
    # params = {'n_neighbors': range(1, 23, 2), 'algorithm': ['ball_tree', 'kd_tree', 'brute', 'auto']}
    # model_grid = GridSearchCV(KNeighborsClassifier(weights='distance'), param_grid=params, n_jobs=-1)
    # model_grid.fit(predictor.X_train, predictor.y_train)
    # print(model_grid.best_estimator_)

    # checking accuracy of predictions
    # tested value accuracy was 83.75%
    test_preds = predictor.predict(predictor.X_test.values)
    print(accuracy_score(predictor.y_test, test_preds))
