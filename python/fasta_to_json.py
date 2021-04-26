import os
import argparse
import json

# Currently not keeping full composition matrix. Modify in make_peptide_dict()

# # #  Enzymatic digestions
def trypsin_digest(sequence):
    # Respects the "Keil rule" where it cuts after R/K but not in front of a proline
    return digest_after_blocked(sequence, {'R':set('P'), 'K':set('P')})
def trypsin_digest_lowspec(sequence):
    # Does not respect the "Keil rule", so cuts after all R/K. Some research suggests this is more realistic.
    return digest_after(sequence, set(['R','K']))
def chymotrypsin_digest(sequence):
    # Cuts after large hydrophobic aa (F/Y/W/L), blocked by P
    return digest_after_blocked(sequence, {'F':set('P'), 'Y':set('P'), 'W':set('P'), 'L':set('P')})
def chymotrypsin_digest_lowspec(sequence):
    # Cuts after more large hydrophobic aa, blocked by P and some other specific aa.
    return digest_after_blocked(sequence, {'F':set('P'), 'Y':set('P'), 'W':set(['P','M']), 'L':set('P'), 'M':set(['P','Y']), 'H':set(['P','D','M','W'])})

digest_fxns = {
    'trypsin':trypsin_digest, 'trypsin_lowspec':trypsin_digest_lowspec,
    'chymotrypsin':chymotrypsin_digest, 'chymotrypsin_lowspec':chymotrypsin_digest_lowspec
}

# Specificity taken from http://www.matrixscience.com/help/enzyme_help.html and https://web.expasy.org/peptide_cutter/peptidecutter_enzymes.html
# If I do want to use regex (doesn't join frag with cut aa):
#   tryp_re = re.compile(r'([RK]{1})(?=[^P]{1})'); re.split(tryp_re, sequence)
def digest_after(sequence, sites):
    # 'sites' should be a set/tuple containing upper case amino acid symbols to cut after.
    frags = []
    prev_ind = 0
    for cur_ind, aa in enumerate(sequence):
        if aa in sites:
            frags.append(sequence[prev_ind : cur_ind+1])
            prev_ind = cur_ind + 1
    if prev_ind <= cur_ind:
        frags.append(sequence[prev_ind :])
    return frags
def digest_after_blocked(sequence, sites):
    # 'sites' should be a dict containing upper case amino acid keys to cut after, whose values are a set/tuple of upper case amino acid symbols that block digestion.
    # EX {'W':set('M','P'), 'Y':set('P'), 'F':set()} indicates that digestion should happen after W unless the next aa is M or P; after Y unless the next aa is P; and after all F.
    frags = []
    prev_ind, max_ind = 0, len(sequence) - 1
    for cur_ind, aa in enumerate(sequence):
        if aa in sites and cur_ind < max_ind and sequence[cur_ind+1] not in sites[aa]:
            frags.append(sequence[prev_ind : cur_ind+1])
            prev_ind = cur_ind + 1
    if prev_ind <= cur_ind:
        frags.append(sequence[prev_ind :])
    return frags


# # #  Processing code
def digest_sequences(seqs, enzyme, missed_cleavages):
    enz_digest_fxn = digest_fxns[enzyme]
    peptide_db, seq_db = [], []
    for seq_id, seq in enumerate(seqs):
        peptides = seq_to_peptide_dicts(seq_id, seq.seq, enz_digest_fxn, missed_cleavages)
        peptide_db.extend(peptides)
        seq_db.append({'seq_id':seq_id, 'name':seq.name, 'fragments':len(peptides)})
    return peptide_db, seq_db

def seq_to_peptide_dicts(seq_id, sequence, enz_digest_fxn, missed_cleavages):
    # enz_digest_fxn is the cutting function for the enzyme of interest
    peptides = []
    raw_fragments = enz_digest_fxn(sequence)
    max_ind = len(raw_fragments) - 1
    for ind, frag in enumerate(raw_fragments):
        pep = make_peptide_dict(seq_id, frag)
        if pep == None:
            print('Warning: discarding peptide due to unknown character in "{}"'.format(frag))
            continue
        elif args.min_weight <= pep['mz1'] <= args.max_weight:
            peptides.append(pep)
        for offset in range(1, missed_cleavages+1):
            if ind+offset > max_ind:
                break
            frag += raw_fragments[ind+offset]
            pep = make_peptide_dict(seq_id, frag)
            if pep == None:
                print('Warning: discarding peptide due to unknown character in "{}"'.format(frag))
                break
            elif args.min_weight <= pep['mz1'] <= args.max_weight:
                peptides.append(pep)
    return peptides

def make_peptide_dict(seq_id, sequence):
    try:
        pep = {'seq_id':seq_id, 'seq':sequence, 'mz1':calculate_mz1(sequence), 'avg':calculate_average_weight(sequence)}
    except KeyError: # Thrown when there's a non-standard character in the sequence
        return None
    #for aa in aa_letters:
    #    pep[aa] = sequence.count(aa)
    return pep


# # #  Molecular weight functions and attributes
aa_letters = 'ACDEFGHIKLMNPQRSTVWY'
# Weights taken from https://proteomicsresource.washington.edu/protocols06/masses.php
aa_mono_weights = {
    'A':71.037113805, 'C':103.009184505, 'D':115.026943065, 'E':129.042593135, 'F':147.068413945, 'G':57.021463735, 'H':137.058911875, 'I':113.084064015, 'K':128.094963050, 'L':113.084064015, 'M':131.040484645, 'N':114.042927470, 'P':97.052763875, 'Q':128.058577540, 'R':156.101111050, 'S':87.032028435, 'T':101.047678505, 'U':150.953633405, 'V':99.068413945, 'W':186.079312980, 'Y':163.063328575
}
aa_avg_weights = {
    'A':71.0779, 'C':103.1429, 'D':115.0874, 'E':129.11398, 'F':147.17386, 'G':57.05132, 'H':137.13928, 'I':113.15764, 'K':128.17228, 'L':113.15764, 'M':131.19606, 'N':114.10264, 'P':97.11518, 'Q':128.12922, 'R':156.18568, 'S':87.0773, 'T':101.10388, 'U':150.3079, 'V':99.13106, 'W':186.2099, 'Y':163.17326
}
# Other weight calculators http://web.thu.edu.tw/fdlung/www/peptidemass.html https://www.peptidesynthetics.co.uk/tools/
# Atom-level values, if needed, can be found at https://www.unimod.org/masses.html
def calculate_mz1(sequence):
    # The returned weight includes an N-terminus H, a C-terminus OH, and one MALDI-induced extra H
    proton, oxygen = 1.007825035, 15.99491463
    return peptide_molecular_weight(sequence) + 3*proton + oxygen
def calculate_average_weight(sequence):
    # The returned weight includes an N-terminus H, a C-terminus OH, and one MALDI-induced extra H
    proton, oxygen = 1.00794, 15.9994
    return average_peptide_molecular_weight(sequence) + 3*proton + oxygen
def peptide_molecular_weight(sequence):
    # The monoisotopic mass, not including N- or C-terminus atoms
    return sum(aa_mono_weights[aa] for aa in sequence)
def average_peptide_molecular_weight(sequence):
    # The average mass, not including N- or C-terminus atoms
    return sum(aa_avg_weights[aa] for aa in sequence)


# # #  FASTA file parsing
def parse_fasta_file(fasta_file):
    # Returns a list of Sequence objects
    with open(fasta_file, 'r') as f:
        seqs = parse_fasta_lines(f)
    return seqs
def parse_fasta_lines(f_obj):
    # Returns a list of Sequence objects. Can be called on an open file, or a list of lines
    seqs, buff, cur_name = [], [], None
    for line in f_obj:
        if not line:
            continue
        if line[0] == '>':
            if buff:
                seqs.append(Sequence(name=cur_name, sequence=''.join(buff)))
                buff = []
            cur_name = line[1:].strip()
        else:
            if not cur_name:
                continue # Skips lines above the first ">"
            line = line.strip()
            if line.isalpha(): # True if not empty, and contains no spaces or numbers
                buff.append(line)
            else: # Filters out all spaces, numbers, or any other non-alpha character
                buff.append(''.join(c for c in line if c.isalpha()))
    if buff and cur_name:
        seqs.append(Sequence(name=cur_name, sequence=''.join(buff)))
    return seqs
class Sequence(object):
    def __init__(self, name, sequence):
        self.name = name
        self.sequence = sequence.upper()
        self.seq = self.sequence


# # #  Command line options
def setup_parser():
    prog_descrip = 'A script to take a protein sequence file in FASTA format, digest it into peptides, and save a peptide and sequence database file in JSON format.'
    prog_epilog = '' # probably a couple example usages
    parser = argparse.ArgumentParser(description=prog_descrip, epilog=prog_epilog)
    add_arguments(parser)
    return parser
def add_arguments(parser):
    # #  Positional arguments
    parser.add_argument("fasta_file", metavar="FASTA_FILE", help="The proteome sequences in FASTA format")
    parser.add_argument("peptides_out", metavar="PEPTIDES_OUT", help="The location to save the peptides database")
    parser.add_argument("sequences_out", metavar="SEQUENCES_OUT", help="The location to save the sequences database")
    parser.add_argument("enzyme", metavar="ENZYME", choices=sorted(digest_fxns.keys()), nargs=1, help="The enzyme to digest the sequences. Must be one of: %(choices)s")
    # #  Optional arguments
    parser.add_argument("-c", "--cleavages", type=int, default=1, help="Specify the number of missed cleavage sites allowed (default: %(default)s)")
    parser.add_argument("-n", "--min_weight", type=float, default=500.0, help="Discard peptides below this molecular weight threshold (default: %(default)s)")
    parser.add_argument("-x", "--max_weight", type=float, default=5000.0, help="Discard peptides above this molecular weight threshold (default: %(default)s)")
def get_and_validate_arguments(parser):
    args = parser.parse_args()
    # #  Positional arguments
    if not os.path.isfile(args.fasta_file):
        parser.error('unable to locate FASTA file at {}'.format(args.fasta_file))
    # #  Optional arguments
    if not 0 <= args.cleavages <= 9:
        parser.error('-c/--cleavages must be an integer between 0 and 9')
    if args.min_weight < 0:
        parser.error('-n/--min_weight must be an integer greater than 0')
    if args.max_weight < 0:
        parser.error('-x/--max_weight must be an integer greater than 0')
    if args.min_weight >= args.max_weight:
        parser.error('-n/--min_weight must be lower than -x/--max_weight')
    return args


# # #  Run the code
if __name__ == '__main__':
    parser = setup_parser()
    args = get_and_validate_arguments(parser)

    seqs = parse_fasta_file(args.fasta_file)
    peptide_db, seq_db = digest_sequences(seqs, args.enzyme[0], args.cleavages)
    with open(args.peptides_out, 'w') as f:
        f.write(json.dumps(peptide_db))
    with open(args.sequences_out, 'w') as f:
        f.write(json.dumps(seq_db))
