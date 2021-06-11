import numpy as np
import argparse
import json

def Gaussian(x, intensity, center, stdev):
    
    return intensity * np.exp(-((x - center)**2 / (2 * stdev**2)))

parser = argparse.ArgumentParser(description='Create an artificial fingerprint using a mass list.')
parser.add_argument('mass_list', type=str, help="A comma-separated list of masses")
parser.add_argument('--detector_min', type=float, default=650)
parser.add_argument('--detector_max', type=float, default=3600)
parser.add_argument('--resolution', type=float, default=0.6)
parser.add_argument('--stdev', type=float, default=1.5)
parser.add_argument('--fixed', type=bool, default=True)
args = parser.parse_args()

x_series = np.arange(args.detector_min, args.detector_max, args.resolution)
y_series = np.zeros(x_series.shape)

masses = np.asarray(args.mass_list.split(','));
masses = [float(numeric_string) for numeric_string in masses]
intensities = np.random.uniform(40, 100, len(masses))

for x in range(0, len(masses)):
    y_series += Gaussian(x_series, intensities[x], masses[x], args.stdev)

paired_data = [[650.0, 0]];

for x in range(len(x_series)):
    if(y_series[x] > 0):
        paired_data.append([round(x_series[x],2), round(y_series[x])])

print(json.dumps(paired_data))