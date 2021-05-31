import ionizer
import tensorflow
from tensorflow import keras

from argparse import ArgumentParser

parser = ArgumentParser()
parser.add_argument("-s", "--sequence", help="The protein sequence to predict a fingerprint for")
args = parser.parse_args()

model = keras.models.load_model('C:/maldb/python/mlp')

norm_mean = model._normalization_mean.numpy()
norm_std = model._normalization_std.numpy()

print(norm_mean)
print(norm_std)

#digest the sequence
#foreach pep in the seq array...



#pep = np.asarray([Ionizer(args[0], 0).calculate_feature_vector()])

#model.predict(pep)
 


