import csv
import colorsys
import random
# this is code generated from chatgpt that creates a rough outline on how to make the csv file
def generate_random_color():
    """
    Generate a random RGB color.
    
    Returns:
        tuple: RGB values of the generated color.
    """
    r = random.randint(0, 255)
    g = random.randint(0, 255)
    b = random.randint(0, 255)
    return (r, g, b)

def rgb_to_hsl(rgb):
    """
    Convert RGB color to HSL color.
    
    Parameters:
        rgb (tuple): RGB values of the color.
    
    Returns:
        tuple: HSL values of the color.
    """
    r = rgb[0] / 255
    g = rgb[1] / 255
    b = rgb[2] / 255
    h, l, s = colorsys.rgb_to_hsv(r, g, b)
    h *= 360
    return (h, s * 100, l * 100)

def save_colors_to_csv(filename, num_colors):
    """
    Generate random RGB colors, convert them to HSL, and save to a CSV file.
    
    Parameters:
        filename (str): Name of the CSV file to save.
        num_colors (int): Number of colors to generate and save.
    """
    with open(filename, 'w', newline='') as csvfile:
        fieldnames = ['Red', 'Green', 'Blue', 'Hue', 'Saturation', 'Lightness']
        writer = csv.DictWriter(csvfile, fieldnames=fieldnames)
        writer.writeheader()
        
        for _ in range(num_colors):
            rgb_color = generate_random_color()
            hsl_color = rgb_to_hsl(rgb_color)
            writer.writerow({
                'Red': rgb_color[0],
                'Green': rgb_color[1],
                'Blue': rgb_color[2],
                'Hue': hsl_color[0],
                'Saturation': hsl_color[1],
                'Lightness': hsl_color[2]
            })

# Example usage:
save_colors_to_csv('random_colors.csv', 10)  # Generate and save 10 random colors
