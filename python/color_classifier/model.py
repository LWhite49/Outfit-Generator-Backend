import pandas as pd
from sklearn.neighbors import KNeighborsClassifier
from sklearn.model_selection import train_test_split, GridSearchCV
from sklearn.metrics import accuracy_score

import grouping

class ColorPredictor():
    '''Implements the functionality of the categorization model in a simple object'''
    def __init__(self):
        # get the processed data
        colors = pd.read_csv('grouping\color_names_clustered.csv')
        
        y = colors.Label
        X = colors[['Red', 'Green', 'Blue']]

        # # splitting data seems to help with accuracy, probably mitigating overfitting
        # self.X_train, self.X_test, self.y_train, self.y_test = train_test_split(X, y, test_size=0.25, random_state=255)
        
        # train the model
        self.model = KNeighborsClassifier(n_neighbors=3, weights='distance', algorithm='ball_tree', metric='chebyshev')
        self.model.fit(self.X_train.values, self.y_train)
    def predict(self, rgb: list[int]) -> str:
        '''The object takes in a list of rgb values and returns the predicted label from its model'''
        return self.model.predict(rgb)

# code for testing
if __name__ == '__main__':
    colors = pd.read_csv('grouping\color_names_clustered.csv')
    
    y = colors.Label
    X = colors[['Red', 'Green', 'Blue']]
    
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.25, random_state=255)

    # predictor = KNeighborsClassifier(n_neighbors=3, weights='distance', algorithm='ball_tree', metric='chebyshev')
    predictor = KNeighborsClassifier(algorithm='ball_tree', metric='chebyshev', n_neighbors=3, weights='distance')
    predictor.fit(X_train.values, y_train)
    
    # used a grid search to find optimal parameters
    # params = {'n_neighbors': range(1, 23, 2), 'algorithm': ['ball_tree', 'kd_tree', 'brute', 'auto'], 'metric':['chebyshev', 'euclidean', 'cosine']}
    # model_grid = GridSearchCV(KNeighborsClassifier(weights='distance'), param_grid=params, n_jobs=-1)
    # model_grid.fit(X_train, y_train)
    # print(model_grid.best_estimator_)

    # checking accuracy of predictions
    # tested accuracy: 83%
    test_preds = predictor.predict(X_test.values)
    print(accuracy_score(y_test, test_preds))
