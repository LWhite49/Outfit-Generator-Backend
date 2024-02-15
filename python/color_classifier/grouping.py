# import matplotlib as mpl 
import matplotlib.pyplot as plt 
import pandas as pd 
from sklearn.cluster import KMeans
from sklearn.cluster import HDBSCAN
from sklearn.preprocessing import MinMaxScaler
import numpy as np

# create dataframe
colors = pd.read_csv('color_names.csv')
# drop columns that won't be used
colors.drop(columns=['HSL.S (%)','HSL.L (%), HSV.S (%), HSV.V (%)', 'Name'], inplace=True)
# rename relevant columns for usability
colors.rename(columns={'Hex (24 bit)':'Hex', 'Red (8 bit)': 'Red', 'Green (8 bit)': 'Green', 'Blue (8 bit)':'Blue', 'Hue (degrees)':'Hue'}, inplace=True)

# calculating saturation
def saturation(r, g, b):
    r, g, b = r/255, g/255, b/255
    cmax = max(r, g, b)
    diff = cmax - min(r, g, b)
    return 0 if cmax == 0 else (diff / cmax) * 100

# colors['Saturation'] = [saturation(rgb['Red'], rgb['Blue'], rgb['Green']) for i, rgb in colors.iterrows()]
colors['Saturation'] = colors.apply(lambda x: saturation(x['Red'], x['Green'], x['Blue']), axis='columns')

# calculating value
def value(r, g, b):
    r, g, b = r/255, g/255, b/255
    cmax = max(r, g, b)
    return cmax * 100

colors['Value'] = colors.apply(lambda x: value(x['Red'], x['Green'], x['Blue']), axis='columns')

# using cosine to scale hue
colors['Hue'] = np.cos(np.deg2rad(colors['Hue']))
# scaling rgb, saturation, value to fall on same range [-1, 1]
# colors[['Red', 'Green', 'Blue', 'Saturation', 'Value']] = colors[['Red', 'Green', 'Blue', 'Saturation', 'Value']].apply(lambda x: ((2 * (x - x.min()))/(x.max() - x.min())) - 1)

# clustering the colors
N_COLORS = 96

# normalization
# colors[['Red', 'Green', 'Blue', 'Value']] = normalize(colors[['Red', 'Green', 'Blue', 'Value']])
scaler = MinMaxScaler()
colors[['Red', 'Green', 'Blue', 'Saturation', 'Value', 'Hue']] = scaler.fit_transform(colors[['Red', 'Green', 'Blue', 'Saturation', 'Value', 'Hue']])

kmeans = KMeans(n_clusters=N_COLORS, random_state=0, n_init='auto')
colors['Label'] = kmeans.fit_predict(colors[['Red', 'Green', 'Blue', 'Hue']])
# hdb = HDBSCAN(min_cluster_size=3, max_cluster_size=20)
# colors['Label'] = hdb.fit_predict(colors[['Red', 'Green', 'Blue']])
# colors = colors.loc[colors['Label'] != -1]
labels = kmeans.labels_
centers = kmeans.cluster_centers_

# add labels to color data and save it to a new file
# colors['Label'] = labels
colors.to_csv('color_names_clustered.csv')

#!NONE OF BELOW WORKS PROPERLY RIGHT NOW

# keep track of cluster information in separate dataframe
clusters = pd.DataFrame({'Label': range(centers.shape[0]), 'Red': centers[:,0], 'Green': centers[:,1], 'Blue': centers[:,2]})

def rgb_to_hex(r, g, b):
    return '#{:02x}{:02x}{:02x}'.format(round(r), round(g), round(b))

clusters['Hex'] = clusters.apply(lambda x: rgb_to_hex(x['Red'], x['Green'], x['Blue']), axis='columns')

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