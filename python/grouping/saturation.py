def saturation(r: int, g: int, b: int) -> float:
    '''Takes in red, green, and blue value of a color and returns its saturation.'''
    r, g, b = r/255, g/255, b/255
    cmax = max(r, g, b)
    diff = cmax - min(r, g, b)
    return 0 if cmax == 0 else (diff / cmax) * 100