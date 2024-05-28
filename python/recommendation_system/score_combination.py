import sys
import json
import ast
from color_calculator import outfit_comparison

def score(item1, item2) -> float:
    _, similarity, _, _ = outfit_comparison(item1, item2)
    return similarity

try:
    if len(sys.argv) == 3:
        colors1 = ast.literal_eval(sys.argv[1])
        colors2 = ast.literal_eval(sys.argv[2])

        print(json.dumps(str(score(colors1, colors2))))

    elif len(sys.argv) == 4: 
        colors1 = ast.literal_eval(sys.argv[1])
        colors2 = ast.literal_eval(sys.argv[2])
        colors3 = ast.literal_eval(sys.argv[3])
        
        score1 = score(colors1, colors2)
        score2 = score(colors1, colors3)
        score3 = score(colors2, colors3)

        print(json.dumps(str((score1 + score2 + score3) / 3)))

except:
    print(json.dumps('-0.5'))