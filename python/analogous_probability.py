import colorsys
# just some function to convert RGB to HSL generated from chatgpt
def rgb_to_hsl(rgb):
    """
    Convert RGB color to HSL color.
    
    Parameters:
        rgb (tuple): RGB values of the color.
    
    Returns:
        tuple: HSL values of the color.
    """
    # Normalize RGB values to range [0, 1]
    r = rgb[0] / 255
    g = rgb[1] / 255
    b = rgb[2] / 255
    
    # Convert RGB to HSL
    h, l, s = colorsys.rgb_to_hsv(r, g, b)
    
    # Convert hue from [0, 1] to [0, 360] degrees
    h *= 360
    
    return (h, s * 100, l * 100)  # Return HSL values

# Example usage:
rgb_color = (255, 0, 0)  # Red

# Convert RGB to HSL
hsl_color = rgb_to_hsl(rgb_color)
print("HSL color:", hsl_color)
