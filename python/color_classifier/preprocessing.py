import pandas as pd

def data() -> pd.DataFrame:
    '''Manipulate the csv file of color names, preserving just the RGB values and simplifying the names into a limited number of categories.'''
    # create dataframe
    colors = pd.read_csv('color_classifier\color_names_clustered.csv')
    # drop columns that won't be used
    colors.drop(columns=['Hex (24 bit)', 'Hue (degrees)', 'HSL.S (%)','HSL.L (%), HSV.S (%), HSV.V (%)'], inplace=True)
    # rename relevant columns for usability
    colors.rename(columns={'Red (8 bit)': 'Red', 'Green (8 bit)': 'Green', 'Blue (8 bit)':'Blue'}, inplace=True)

    # reassign names to limited pool of simple color terms
    categories = ['red', 'orange', 'yellow', 'green', 'blue', 'purple', 'pink', 'brown', 'white', 'gray', 'black']
    bad_indices = []
    
    # iterate through the dataframe
    for i in range(len(colors)):
        name = colors.Name.iloc[i] # pull the color name
        
        # reconcile the variation in naming in the dataset
        if 'violet' in name:
            name = 'purple'
        elif 'grey' in name:
            name = 'gray'
        elif 'gold' in name:
            name = 'yellow'
        elif 'beige' in name or 'tan' in name:
            name = 'brown'

        # check if any of the simpler color terms appear in the color's name
        flag = 0
        for c in categories:
            if c in name:
                # rename the color
                colors.at[i, 'Name'] = c
                flag = 1
                # no break statement here, based on the intuition that the last term in a color's name is typically the dominant hue
        
        # if no match was found add this index to an array of indices to drop later
        if flag == 0:
            bad_indices.append(i)

    # drop bad indices and reset index
    colors.drop(index=bad_indices, inplace=True)
    colors.reset_index(drop=True, inplace=True)

    return colors

# this code was used to check accuracy of naming
# if __name__ == '__main__':
#     mean_rgb = data().groupby(['Name']).mean()
#     print(mean_rgb)
