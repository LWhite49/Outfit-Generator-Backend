import pandas as pd

centers = pd.read_csv('grouping\cluster_centers.csv')

def get_hex(label: int)->str:
    '''Returns the center hex value for a given color label.'''
    return centers.loc[label]['Hex'][1:]

def get_rgb(label: int)->tuple[float, float, float]:
    '''Returns the (red, green, blue) value of the center of a given label.'''
    return (centers.loc[label]['Red'], centers.loc[label]['Green'], centers.loc[label]['Blue'])