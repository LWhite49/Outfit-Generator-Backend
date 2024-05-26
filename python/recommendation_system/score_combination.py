from color_calculator import outfit_comparison

def score(item1, item2) -> float:
    _, similarity, _, _ = outfit_comparison(item1, item2)
    return similarity