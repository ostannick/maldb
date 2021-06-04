from Bio.SeqUtils.ProtParam import ProteinAnalysis
import json
import math

f = open('coefficients.json')
all_features = json.load(f)

def get_aaindex_vector(seq):

    aa_totals = get_aa_count_dict(seq)

    vector = []

    for feature in all_features:

        vector.append(calc_feature(seq, aa_totals, feature))

    return vector

def calc_feature(seq, aa_dict, feat_dict, type="sum"):

    feature = 0

    if(type == "sum"):

        for k in aa_dict:
            feature += aa_dict[k] * feat_dict[k]
            
        return feature

    elif(type == "avg"):

        for k in aa_dict:
            feature += aa_dict[k] * feat_dict[k]
        
        return feature/len(seq)
        


def get_aa_count_dict(seq):

    p = ProteinAnalysis(seq)

    return {
        'A': p.count_amino_acids()['A'],
        'C': p.count_amino_acids()['C'],
        'D': p.count_amino_acids()['D'],
        'E': p.count_amino_acids()['E'],
        'F': p.count_amino_acids()['F'],
        'G': p.count_amino_acids()['G'],
        'H': p.count_amino_acids()['H'],
        'I': p.count_amino_acids()['I'],
        'K': p.count_amino_acids()['K'],
        'L': p.count_amino_acids()['L'],
        'M': p.count_amino_acids()['M'],
        'N': p.count_amino_acids()['N'],
        'P': p.count_amino_acids()['P'],
        'Q': p.count_amino_acids()['Q'],
        'R': p.count_amino_acids()['R'],
        'S': p.count_amino_acids()['S'],
        'T': p.count_amino_acids()['T'],
        'V': p.count_amino_acids()['V'],
        'W': p.count_amino_acids()['W'],
        'Y': p.count_amino_acids()['Y'],
    }