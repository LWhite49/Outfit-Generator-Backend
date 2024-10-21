import sys
import os

relative_path = os.path.join(os.path.dirname(__file__), '../../python/')
sys.path.append(os.path.abspath(relative_path))

import numpy as np
from colormath.color_objects import XYZColor, sRGBColor, LabColor
from colormath.color_conversions import convert_color
from colormath.color_diff import delta_e_cie2000

# code to fix an problem with colormath that hasn't been updated
def patch_asscalar(a):
    return a.item()
setattr(np, 'asscalar', patch_asscalar)

from recommendation_system.hsv import *
from color_assignment.conversions import hex_to_rgb

def complementariness(color1: str, color2: str)->float:
    '''Return a value from 0-1 indicating how complementary two colors are.'''
    h1 = hue(color1)
    h2 = hue(color2)
    
    # compute absolute difference in Hue
    hue_diff = abs(h1 - h2)
    
    # if the hue difference exceeds 180, consider their difference when going the other way around the hue wheel (which will always be less than 180)
    if hue_diff > 180:
        hue_diff = 360 - hue_diff

    # score will be the hue difference normalized by 180 degrees, because perfectly complementary colors have opp
    complementariness = hue_diff / 180.0
    return round(complementariness, 1)

def similarity(color1: str, color2: str)->float:
    '''Return a value indicating how similar two colors are from 0 to 1 (indicating identical colors).'''
    # convert rgb on 255 range to 0-1 range
    rgb_list1 = np.array(hex_to_rgb(color1)) / 255
    rgb_list2 = np.array(hex_to_rgb(color2)) / 255

    # convert to colormath object
    rgb1 = sRGBColor(rgb_list1[0], rgb_list1[1], rgb_list1[2])
    rgb2 = sRGBColor(rgb_list2[0], rgb_list2[1], rgb_list2[2])

    # convert to XYZ space
    lab1 = convert_color(convert_color(rgb1, XYZColor), LabColor)
    lab2 = convert_color(convert_color(rgb2, XYZColor), LabColor)

    # calculate CIELAB color difference
    dist = delta_e_cie2000(lab1, lab2)

    # normalize and invert (most similar = 1, least = 0)
    return 1 - (dist / 100)

def neutrality(color: str)->float:
    '''Returns the inverse of saturation, indicating how neutral a color is.'''
    return 1 - (saturation(color) / 100)

def outfit_comparison(palette1: list[list[str, float]], palette2: list[list[str, float]])->list[float, float, float, float]:
    '''Takes in the color arrays from two database items (which are formatted as [color label, pixel percentage, hex value]) and produce scores for their relative complementariness, similarity, and neutrality, in that order.'''
    complementary_score = 0
    similarity_score = 0
    neutrality_score1 = 0
    neutrality_score2 = 0

    # iterate colors in palette
    for color1 in palette1:
        hex1 = color1[0]  # Get the hex value from the first array
        area1 = color1[1] # get the pixel percentage of this color

        neutrality_score1 += neutrality(hex1) * area1 # add the weighted neutrality of this color to its total
        # because of the weighting, the maximum score for any attribute will be 1 
        # e.g. if every color was perfectly neutral it would have a neutrality score of 1
        # for the relationships bw two colors, each color2 in the second palette will have a weight within the weight of color1
        # e.g. if color1 is 50% of item1 and color 2 is 50% of item2, their combined weight on the total will be 25%
        
        # iterate second palette
        for color2 in palette2:
            hex2 = color2[0]  # Get the hex value from the second array
            area2 = color2[1] # get the pixel percentage of this color

            # Calculate the complementariness score, based on the relative percentages which the two colors take up
            complementary_prob = area2 * complementariness(hex1, hex2)
            # Calulate the similarity in the same way
            similarity_prob = area2 * similarity(hex1, hex2)
            
            # add these scores to the running score
            complementary_score += complementary_prob
            similarity_score += similarity_prob

    # calculate neutrality score of outfit 2
    for color2 in palette2:
        hex2 = color2[0] 
        area2 = color2[1]
        neutrality_score2 += neutrality(hex2) * area2
    
    # relative neutrality is scored on a saddle function so that outfits are optimized to have one neutral one not
    # outfits where both are neutral or both not neutral receive a low relative neutrality
    relative_neutrality = neutrality_score1 + neutrality_score2 - ((2 * neutrality_score1 * neutrality_score2))

    return complementary_score, similarity_score, relative_neutrality

if __name__ == "__main__":
    # code for testing
    print(similarity('#287280', '#286e80'))
    # print(similarity('#ff0000', '#00ff00'))
    # print(similarity('#aaaaaa', '#ffffff'))
    # print(complementariness('#9740bf', '#bf4240'))