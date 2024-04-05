import pandas as pd
from pathlib import Path
from sklearn.svm import SVC
from sklearn.model_selection import train_test_split, GridSearchCV
from sklearn.metrics import accuracy_score

class ColorPredictor():
    '''Implements the functionality of the categorization model in a simple object'''
    def __init__(self):
        # get the processed data
        colors = pd.read_csv('grouping\color_names_clustered.csv')
        
        y = colors.Label
        X = colors[['Red', 'Green', 'Blue']]

        # # splitting data seems to help with accuracy, probably mitigating overfitting
        # X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.25, random_state=255)
        
        # train the model
        self.model = SVC(C=11, kernel='rbf', gamma='scale', degree=1, class_weight='balanced', tol=1e-3, max_iter=-1)
        # self.model.fit(X_train.values, y_train)
        self.model.fit(X.values, y)

    def predict(self, rgb: list[int]) -> str:
        '''The object takes in a list of rgb values and returns the predicted label from its model'''
        return self.model.predict(rgb)

# code for testing
if __name__ == '__main__':    
    # c = ColorPredictor()
    # h = c.get_center_hex(0)
    # c0 = (int(h[:2], 16), int(h[2:4], 16), int(h[4:], 16))
    
    colors = pd.read_csv('grouping\color_names_clustered.csv')
    
    y = colors.Label
    X = colors[['Red', 'Green', 'Blue']]
    
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.25)

    predictor = SVC(C=11, kernel='rbf', gamma='scale', degree=1, class_weight='balanced', tol=1e-3, max_iter=-1)
    predictor.fit(X_train.values, y_train)
    
    # used a grid search to find optimal parameters
    # params = {'C': range(5, 25), \
    #           'tol': [1e-2,1e-3,1e-4,1e-5], \
    #             'kernel':['linear', 'poly', 'rbf', 'sigmoid'] , \
    #                 'degree': range(0, 10), \
    #                     'class_weight':['balanced', None], \
    #                         'gamma':['scale', 'auto']\
    #                         }
    # model_grid = GridSearchCV(SVC(), param_grid=params, n_jobs=-1)
    # model_grid.fit(X_train, y_train)
    # print(model_grid.best_params_)

    # checking accuracy of predictions
    # tested accuracy: 87%
    test_preds = predictor.predict(X_test.values)
    print(accuracy_score(y_test, test_preds))
