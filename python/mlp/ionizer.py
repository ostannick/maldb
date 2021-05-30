import aaindex 
import pandas as pd
import numpy as np
from Bio.SeqUtils.ProtParam import ProteinAnalysis as pa

class Ionizer:
    def __init__(self, seq, label):
        self.seq = seq
        self.s = pa(self.seq)
        self.label = label
        self.feature_vector = self.calculate_feature_vector()

    def fv_length(self):
        return len(self.seq)
    
    def fv_mw(self):
        return self.s.molecular_weight()

    def fv_aromaticity(self):
        return self.s.aromaticity()

    def fv_ii(self):
        return self.s.instability_index();

    def fv_pI(self):
        return self.s.isoelectric_point()

    def fv_helicity(self):
        return self.s.secondary_structure_fraction()[0]

    def fv_charge(self):
        return self.s.charge_at_pH(7)
    
    def fv_gravy(self):
        return self.s.gravy()
    
    def fv_aa_freq(self, aa):
        return self.s.get_amino_acids_percent()[aa]

    def calculate_feature_vector(self):

        fv = [
            self.fv_length(),
            self.fv_mw(),
            self.fv_aromaticity(),
            self.fv_ii(),
            self.fv_pI(),
            self.fv_charge(),

            self.fv_aa_freq('A'),
            self.fv_aa_freq('C'),
            self.fv_aa_freq('D'),
            self.fv_aa_freq('E'),
            self.fv_aa_freq('F'),
            self.fv_aa_freq('G'),
            self.fv_aa_freq('H'),
            self.fv_aa_freq('I'),
            self.fv_aa_freq('K'),
            self.fv_aa_freq('L'),
            self.fv_aa_freq('M'),
            self.fv_aa_freq('N'),
            self.fv_aa_freq('P'),
            self.fv_aa_freq('Q'),
            self.fv_aa_freq('R'),
            self.fv_aa_freq('S'),
            self.fv_aa_freq('T'),
            self.fv_aa_freq('V'),
            self.fv_aa_freq('W'),
            self.fv_aa_freq('Y'),
        ]

        fv += aaindex.get_aaindex_vector(self.seq)

        return fv

def get_ionizer_training_data(path):

    df = pd.read_csv(path)

    train_data = []
    train_labels = []

    for index, row in df.iterrows():  
        train_data.append(Ionizer(row['sequence'], row['ionized']).calculate_feature_vector())
        train_labels.append(int(row['ionized']))

    return np.array(train_data), np.array(train_labels)


print(Ionizer('ACYYWFRKK', 1).calculate_feature_vector())