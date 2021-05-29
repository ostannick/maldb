from Bio.SeqUtils.ProtParam import ProteinAnalysis as pa

class Ionizer:
    def __init__(self, seq, label):
        self.seq = seq
        self.s = pa(self.seq)
        self.label = label
        self.featureVector = []

    def fv_length(self):
        return len(self.seq)
    
    def fv_mw(self):
        return self.s.molecular_weight()
    
    def fv_aa_freq(self, aa):
        return self.s.get_amino_acids_percent()[aa]

    def calculate_feature_vector(self):

        return [
            self.fv_length(),
            self.fv_mw(),



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



print(Ionizer('ACYWRRTYF', 1).calculate_feature_vector())
    
