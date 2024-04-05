def rgb_to_hex(r: float, g: float, b: float) -> str:
    '''Takes in red, green, and blue values of a color and returns the hexadecimal coding as a string.'''
    return '#{:02x}{:02x}{:02x}'.format(round(r), round(g), round(b))