# import matplotlib as mpl 
import matplotlib.pyplot as plt 
import pandas as pd 

# create dataframe
colors = pd.read_csv('color_names.csv')
# drop columns that won't be used
colors.drop(columns=['Hex (24 bit)', 'Hue (degrees)', 'HSL.S (%)','HSL.L (%), HSV.S (%), HSV.V (%)'], inplace=True)
# rename relevant columns for usability
colors.rename(columns={'Red (8 bit)': 'Red', 'Green (8 bit)': 'Green', 'Blue (8 bit)':'Blue'}, inplace=True)

fig = plt.figure()
axes = fig.add_subplot(projection='3d')

axes.scatter(colors.Red, colors.Green, colors.Blue, c=colors[['Red', 'Green', 'Blue']]/255)
axes.set_xlabel('R')
axes.set_ylabel('G')
axes.set_zlabel('B')

plt.show()