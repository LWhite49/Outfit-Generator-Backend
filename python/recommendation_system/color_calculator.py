import sys
import os

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
sys.path.append(os.path.dirname(SCRIPT_DIR))

from hsv import *
from color_assignment.grouping.conversions import hex_to_rgb

def complementariness(color1: str, color2: str)->float:
    '''Return a value from 0-1 indicating how complementary two colors are.'''
    h1 = hue(color1)
    h2 = hue(color2)
    
    # compute absolute difference in Hue
    hue_diff = abs(h1 - h2)
    # score will be the hue difference normalized by 180 degrees, because perfectly complementary colors 
    complementariness = hue_diff / 180.0
    return round(complementariness, 1)

def similarity(color1: str, color2: str)->float:
    '''Return a value indicating how similar two colors are, from 0 (indicating perfectly complementary colors) to 1 (indicating identical colors).'''
    return 1 - complementariness(color1, color2)

def neutrality(color: str)->float:
    '''Returns the inverse of saturation, indicating how neutral a color is.'''
    return 1 - (saturation(color) / 100)

def outfit_comparison(palette1: list[list[int, float, str], list[int, float, str], list[int, float, str], list[int, float, str]], palette2: list[list[int, float, str], list[int, float, str], list[int, float, str], list[int, float, str]])->list[float, float, float]:
    '''Takes in the color arrays from two database items (which are formatted as [color label, pixel percentage, hex value]) and produce scores for their relative complementariness, similarity, and neutrality, in that order.'''
    complementary_score = 0
    similarity_score = 0
    neutrality_score1 = 0
    neutrality_score2 = 0

    for subset1 in palette1:
        hex1 = subset1[2]  # Get the hex value from the first array
        area1 = subset1[1] # get the pixel percentage of this color
        ratio = 10 * area1 # because we are scoring based on 10, we partition the maximum score of 10 based on the color percentage

        neutrality_score1 += neutrality(hex1) * ratio

        for subset2 in palette2:
            hex2 = subset2[2]  # Get the hex value from the second array
            area2 = subset2[1] # get the pixel percentage of this color

            # Calculate the complementariness score, based on the relative percentages which the two colors take up
            complementary_prob = ratio * area2 * complementariness(hex1, hex2)
            # Calulate the similarity in the same way
            similarity_prob = ratio * area2 * similarity(hex1, hex2)
            # add to the running neutrality score for the second palette
            ratio = 10 * area2
            neutrality_score2 += neutrality(hex2) * ratio

            # add these scores to the running score
            complementary_score += complementary_prob
            similarity_score += similarity_prob

    return complementary_score, similarity_score, max(neutrality_score1, neutrality_score2)

def calculate_weighted_average(similarity, neutrality, complementary, user_preference):
    # Define weighted percentages
    similarity_weight = 0.25
    neutrality_weight = 0.20
    complementary_weight = 0.25
    user_preference_weight = 0.30

    # Calculate weighted scores
    similarity_score = similarity * similarity_weight
    neutrality_score = neutrality * neutrality_weight
    complementary_score = complementary * complementary_weight
    user_preference_score = user_preference * user_preference_weight

    # Calculate total weighted score
    total_weighted_score = similarity_score + neutrality_score + complementary_score + user_preference_score

    # Round the weighted average to the nearest integer
    rounded_average = round(total_weighted_score)

    return rounded_average

def main():
    # Get input scores for each criterion
    similarity = int(input("Enter similarity score (1-10): "))
    neutrality = int(input("Enter neutrality score (1-10): "))
    complementary = int(input("Enter complementary score (1-10): "))
    user_preference = int(input("Enter user preference score (1-10): "))

    # Calculate weighted average
    weighted_average = calculate_weighted_average(similarity, neutrality, complementary, user_preference)

    # Output the rounded integer average
    print("Weighted Average Score:", weighted_average)

if __name__ == "__main__":
    print(neutrality('#708b8c'))
    # print(complementariness('#287280', '#803528'))
    # print(complementariness('#3DADC2', '#C2523D'))
    # print(complementariness('#ffffff', '#ffffff'))