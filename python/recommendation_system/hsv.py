import sys
import os

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
sys.path.append(os.path.dirname(SCRIPT_DIR))

from colorsys import rgb_to_hsv
from color_assignment.grouping.conversions import hex_to_rgb

def hue(color: str)->float:
    '''Return the Hue of a given rgb color.'''
    r, g, b = hex_to_rgb(color)
    return rgb_to_hsv(r, g, b)[0] * 360

def saturation(color: str)->float:
    '''Return the Saturation of a given rgb color.'''
    r, g, b = hex_to_rgb(color)
    return rgb_to_hsv(r, g, b)[1] * 100

def value(color: str)->float:
    '''Return the Value (as in the HSV color space) of a given rgb color.'''
    r, g, b = hex_to_rgb(color)
    return (rgb_to_hsv(r, g, b)[2] / 255) * 100