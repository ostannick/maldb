import itertools
import json

def parse_coefficient_entry(name, coefficients):
    
    sep = coefficients.split()

    vals = {
        'name': name
    }

    for entry in sep:
        x = entry.split(':')
        vals[x[0]] = float(x[1])

    return vals

all_features = []

with open('coefficients.txt') as f:
    for line1, line2 in itertools.zip_longest(*[f]*2):
        all_features.append(parse_coefficient_entry(line1, line2))

f = open('coefficients.json', 'w')
f.write(json.dumps(all_features))