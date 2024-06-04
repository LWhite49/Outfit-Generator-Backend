import sys
import os

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
sys.path.append(os.path.dirname(SCRIPT_DIR))

import numpy as np
from colormath.color_objects import XYZColor, sRGBColor, LabColor
from colormath.color_conversions import convert_color
from colormath.color_diff import delta_e_cie2000

# code to fix an problem with colormath that hasn't been updated
def patch_asscalar(a):
    return a.item()
setattr(np, 'asscalar', patch_asscalar)

from hsv import *
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

    # score will be the hue difference normalized by 180 degrees, because perfectly complementary colors 
    complementariness = hue_diff / 180.0
    return round(complementariness, 1)

def similarity(color1: str, color2: str)->float:
    '''Return a value indicating how similar two colors are from 0 to 1 (indicating identical colors).'''
    rgb_list1 = np.array(hex_to_rgb(color1)) / 255
    rgb_list2 = np.array(hex_to_rgb(color2)) / 255
    rgb1 = sRGBColor(rgb_list1[0], rgb_list1[1], rgb_list1[2])
    rgb2 = sRGBColor(rgb_list2[0], rgb_list2[1], rgb_list2[2])

    lab1 = convert_color(convert_color(rgb1, XYZColor), LabColor)
    lab2 = convert_color(convert_color(rgb2, XYZColor), LabColor)

    dist = delta_e_cie2000(lab1, lab2)

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

    for subset1 in palette1:
        hex1 = subset1[0]  # Get the hex value from the first array
        area1 = subset1[1] # get the pixel percentage of this color
        ratio = 10 * area1 # because we are scoring based on 10, we partition the maximum score of 10 based on the color percentage

        neutrality_score1 += neutrality(hex1) * ratio

        for subset2 in palette2:
            hex2 = subset2[0]  # Get the hex value from the second array
            area2 = subset2[1] # get the pixel percentage of this color

            # Calculate the complementariness score, based on the relative percentages which the two colors take up
            complementary_prob = ratio * area2 * complementariness(hex1, hex2)
            # Calulate the similarity in the same way
            similarity_prob = ratio * area2 * similarity(hex1, hex2)
            
            # add these scores to the running score
            complementary_score += complementary_prob
            similarity_score += similarity_prob

    # calculate neutrality score of outfit 2
    for subset2 in palette2:
        hex2 = subset2[0] 
        area2 = subset2[1]
        ratio = 10 * area2
        neutrality_score2 += neutrality(hex2) * ratio

    return complementary_score, similarity_score, neutrality_score1, neutrality_score2

if __name__ == "__main__":
    print(similarity('#287280', '#286e80'))
    # print(similarity('#ff0000', '#00ff00'))
    # print(similarity('#aaaaaa', '#ffffff'))
    # print(complementariness('#9740bf', '#bf4240'))