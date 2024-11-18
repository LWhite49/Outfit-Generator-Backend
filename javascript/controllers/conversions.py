def rgb_to_hex(r: float, g: float, b: float) -> str:
    '''Takes in red, green, and blue values of a color and returns the hexadecimal coding as a string.'''
    return '#{:02x}{:02x}{:02x}'.format(round(r), round(g), round(b))

def hex_to_rgb(hex: str) -> list[int, int, int]:
    '''Takes in a hexadecimal string and returns its rgb values.'''
    if hex[0] == '#':
        hex = hex[1:]
    rgb = [hex[i:i+2] for i in [0, 2, 4]]
    rgb = list(map(lambda x: int(x, 16), rgb))
    return rgb