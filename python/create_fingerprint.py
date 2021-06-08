import numpy as np
import argparse
import json

def Gaussian(x, intensity, center, stdev):
    
    return intensity * np.exp(-((x - center)**2 / (2 * stdev**2)))

parser = argparse.ArgumentParser(description='Create an artificial fingerprint using a mass list.')
parser.add_argument('mass_list', type=str, help="A comma-separated list of masses")
parser.add_argument('--detector_min', type=float, default=500)
parser.add_argument('--detector_max', type=float, default=4000)
parser.add_argument('--resolution', type=float, default=0.3)
parser.add_argument('--stdev', type=float, default=0.5)
parser.add_argument('--fixed', type=bool, default=True)
args = parser.parse_args()

x_series = np.arange(args.detector_min, args.detector_max, args.resolution)
y_series = np.random.uniform(0, 1, x_series.shape)

masses = np.asarray(args.mass_list.split(','));
masses = [int(numeric_string) for numeric_string in masses]
intensities = np.random.uniform(40, 100, len(masses))

for x in range(0, len(masses)):
    y_series += Gaussian(x_series, 50, masses[x], args.stdev)

paired_data = [];

for x in range(len(x_series)):
    paired_data.append([round(x_series[x],2), round(y_series[x])])

print(json.dumps(paired_data))