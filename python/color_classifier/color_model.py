import pandas as pd
from sklearn.neighbors import KNeighborsClassifier
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
        X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.25, random_state=255)
        
        # train the model
        self.model = KNeighborsClassifier(n_neighbors=3, weights='distance', algorithm='ball_tree', metric='chebyshev')
        self.model.fit(X_train.values, y_train)

        # allow access to cluster center info
        self.centers = pd.read_csv('grouping\cluster_centers.csv')
    def predict(self, rgb: list[int]) -> str:
        '''The object takes in a list of rgb values and returns the predicted label from its model'''
        return self.model.predict(rgb)
    def get_center_hex(self, label: int) -> str:
        '''Returns the hex value for the given cluster label'''
        return self.centers.loc[label]['Hex'][1:]

# code for testing
if __name__ == '__main__':    
    c = ColorPredictor()
    h = c.get_center_hex(0)
    c0 = (int(h[:2], 16), int(h[2:4], 16), int(h[4:], 16))
    # colors = pd.read_csv('grouping\color_names_clustered.csv')
    
    # y = colors.Label
    # X = colors[['Red', 'Green', 'Blue']]
    
    # X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.25, random_state=255)

    # # predictor = KNeighborsClassifier(n_neighbors=3, weights='distance', algorithm='ball_tree', metric='chebyshev')
    # # predictor = KNeighborsClassifier(algorithm='ball_tree', metric='chebyshev', n_neighbors=3, weights='distance')
    # predictor = SVC(C=11, kernel='rbf', gamma='scale', degree=1, class_weight='balanced', tol=1e-3, max_iter=-1)
    # predictor.fit(X_train.values, y_train)
    
    # # used a grid search to find optimal parameters
    # # params = {'n_neighbors': range(1, 23, 2), 'algorithm': ['ball_tree', 'kd_tree', 'brute'], 'metric':['chebyshev', 'euclidean', 'cosine']}
    # # model_grid = GridSearchCV(KNeighborsClassifier(weights='distance'), param_grid=params, n_jobs=-1)
    # # model_grid.fit(X_train, y_train)
    # # print(model_grid.best_estimator_)
    # # params = {\
    # #     'C': [7,8,9,10], \
    # #           'tol': [1e-3,1e-4,1e-5], \
    # #             'kernel':['linear', 'poly', 'rbf', 'sigmoid'] , \
    # #                 'degree':[0,1,2], \
    # #                     # 'class_weight':['balanced', None], \
    # #                         # 'gamma':['scale', 'auto']\
    # #                         }
    # # model_grid = GridSearchCV(SVC(kernel='rbf', gamma='scale', class_weight='balanced'), param_grid=params, n_jobs=-1)
    # # model_grid.fit(X_train, y_train)
    # # print(model_grid.best_params_)

    # # checking accuracy of predictions
    # # tested accuracy: 83%
    # test_preds = predictor.predict(X_test.values)
    # print(accuracy_score(y_test, test_preds))
