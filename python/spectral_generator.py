import numpy as np
import random
import json

#Standard 1D gaussian
def Gaussian(x, intensity, center, stdev):
    
    return intensity * np.exp(-((x - center)**2 / (2 * stdev**2)))

#Settings

grain = 0.3         #fineness of x-series. 
stdev = 0.3         #sharpness of gaussians
noise_level = random.randint(3, 5)   #height of noise/baseline

x_lim_min = 650   #lower detector boundary
x_lim_max = 3600  #upper detector boundary

#Generate arrays for the series
x_series = np.arange(x_lim_min, x_lim_max, grain)
y_series = np.random.uniform(0, noise_level, x_series.shape)

#small peaks
for x in range(0, 60):
    
    y_series += Gaussian(x_series, random.randint(1, 25), random.randint(650, 3600), random.random() * 3)
    
#medium peaks
for x in range(0, 8):
    
    y_series += Gaussian(x_series, random.randint(40, 80), random.randint(650, 3600), random.random() * 3)

#large peaks
main_peaks = [];
for x in range(0, 12):
    
    main_peaks.append(random.randint(650, 3600));
    y_series += Gaussian(x_series, random.randint(120, 260), main_peaks[x], random.random() * 3)

#fat gaussians
for x in range(0, len(main_peaks)):
    
    y_series += Gaussian(x_series, random.randint(5, 10), main_peaks[x], random.random() * 30)

paired_data = []
for x in range(len(x_series)):
    if(y_series[x] > 0): #skip negative numbers
        paired_data.append([round(x_series[x],2), round(y_series[x])])

spectra = ""
for x in range(len(paired_data)):
    print((str(paired_data[x][0]) + ' ' + str(paired_data[x][1])))
