import numpy as np
import argparse
import json

def Gaussian(x, intensity, center, stdev):
    
    return intensity * np.exp(-((x - center)**2 / (2 * stdev**2)))

parser = argparse.ArgumentParser(description='Parse a spectra')
parser.add_argument('file', type=str, help="A temp file containing a JSON-encoded spectral string")
parser.add_argument('--detector_min', type=float, default=650)
parser.add_argument('--detector_max', type=float, default=3600)
parser.add_argument('--compression', type=int, default=10)
args = parser.parse_args()

file = open(args.file, 'r')
spectra = json.loads(file.read())
spectra = [float(numeric_string) for numeric_string in spectra]


x_series = spectra[0::2]
y_series = spectra[1::2]

x_series = x_series[::args.compression]
y_series = y_series[::args.compression]

paired_data = [];

for x in range(len(x_series)):
    if(y_series[x] > 0):
        paired_data.append([round(x_series[x],2), round(y_series[x])])

print(json.dumps(paired_data))