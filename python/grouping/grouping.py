import pandas as pd 
from sklearn.cluster import KMeans
from sklearn.preprocessing import MinMaxScaler

from n_groups import n_groups
from rgb_to_hex import rgb_to_hex

def cluster_colors() -> None:
    '''Applies k-means clustering to .\color_names.csv and saves it into .\color_names_clustered.csv. Also saves cluster center information into .\cluster_centers.csv.'''
    # create dataframe
    colors = pd.read_csv('color_names.csv')
    # drop columns that won't be used
    colors.drop(columns=['Name', 'Hue (degrees)', 'HSL.S (%)', 'HSL.L (%), HSV.S (%), HSV.V (%)'], inplace=True)
    # rename relevant columns for usability
    colors.rename(columns={'Hex (24 bit)':'Hex', 'Red (8 bit)': 'Red', 'Green (8 bit)': 'Green', 'Blue (8 bit)':'Blue'}, inplace=True)
    X = ['Red', 'Green', 'Blue']

    # scaling values to [0, 1]
    # scaler = MinMaxScaler()
    # colors[X] = scaler.fit_transform(colors[X])

    # clustering colors and saving the labels into the dataframe
    kmeans = KMeans(n_clusters=n_groups(), random_state=255, n_init='auto', tol=1e-6)
    colors['Label'] = kmeans.fit_predict(colors[X])

    # unscaler = MinMaxScaler((0, 255))
    # colors[X] = unscaler.fit_transform(colors[X])

    # save dataframe to a new file
    colors.to_csv('color_names_clustered.csv')

    # get cluster centers
    centers = kmeans.cluster_centers_
    # save centers to a new dataframe with the label as the index
    clusters = pd.DataFrame({'Label': range(n_groups()), 'Red': centers[:,0], 'Green': centers[:,1], 'Blue': centers[:,2]})
    clusters.set_index('Label', inplace=True)

    # bring center values back to 0-255 range
    # unscaler = MinMaxScaler((0, 255))
    # clusters[X] = unscaler.fit_transform(clusters[X])

    # add hex value to the dataframe
    clusters['Hex'] = clusters.apply(lambda x: rgb_to_hex(x['Red'], x['Green'], x['Blue']), axis='columns')
    # save to file
    clusters.to_csv('cluster_centers.csv')

if __name__ == '__main__':
    cluster_colors()