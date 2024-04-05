def value(r: int, g: int, b: int) -> float:
    '''Takes in red, green, and blue value of a color and returns its value.'''
    r, g, b = r/255, g/255, b/255
    cmax = max(r, g, b)
    return cmax * 100