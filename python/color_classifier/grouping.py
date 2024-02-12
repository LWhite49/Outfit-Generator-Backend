# import matplotlib as mpl 
import matplotlib.pyplot as plt 
import pandas as pd 
from sklearn.cluster import KMeans
from sklearn.model_selection import train_test_split
from sklearn.neighbors import KNeighborsClassifier

# create dataframe
colors = pd.read_csv('color_names.csv')
# drop columns that won't be used
colors.drop(columns=['Hex (24 bit)', 'Hue (degrees)', 'HSL.S (%)','HSL.L (%), HSV.S (%), HSV.V (%)'], inplace=True)
# rename relevant columns for usability
colors.rename(columns={'Red (8 bit)': 'Red', 'Green (8 bit)': 'Green', 'Blue (8 bit)':'Blue'}, inplace=True)

# fit, trans = train_test_split(colors[['Red', 'Green', 'Blue']], random_state=42)

N_COLORS = 64

kmeans = KMeans(n_clusters=N_COLORS, random_state=0)
kmeans.fit(colors[['Red', 'Green', 'Blue']])
labels = kmeans.labels_
centers = kmeans.cluster_centers_

colors['Label'] = labels
colors.to_csv('color_names_clustered.csv')

clusters = pd.DataFrame({'Label': range(centers.shape[0]), 'Red': centers[:,0], 'Green': centers[:,1], 'Blue': centers[:,2]})
clusters.set_index('Label', inplace=True)
clusters.to_csv('cluster_centers.csv')

# fig = plt.figure()
# og = fig.add_subplot(1, 2, 1, projection='3d', azim=48)
# cl = fig.add_subplot(1, 2, 2, projection='3d', azim=48)

# og.scatter(colors.Red, colors.Green, colors.Blue, c=colors[['Red', 'Green', 'Blue']]/255)
# og.set_xlabel('R')
# og.set_ylabel('G')
# og.set_zlabel('B')

# cl.scatter(colors.Red, colors.Green, colors.Blue, c=[centers[i]/255 for i in labels])
# cl.set_xlabel('R')
# cl.set_ylabel('G')
# cl.set_zlabel('B')

# plt.show()