"""Script to digest a proteome into peptides that may be detected by mass spectrometry.

Two JSON files are generated, a sequence file and a peptide file. In the peptide file, all mass values (fields "mz1" and "avg") are strings as they are represented here by Decimal objects, not floats, in order to maintain precision and prevent floating point error propagation during calculations. The peptide indices are 0-based, but unlike standard Python indices both the start and end are inclusive (meaning start=4, end=9 represents a peptide of length 6 that maps to positions 4, 5, 6, 7, 8, 9 in the protein; the next peptide would have start=10). The peptide file contains one JSON list of 5000 peptide dicts per line, where that value is modifiable by a command line option.

Fields in the peptide file:
- seq_id: integer used as an internal ID
- seq: string of the amino acid sequence
- start: integer of the peptide's first position in the sequence; 0-based and inclusive
- end: integer of the peptide's last position in the sequence; 0-based and inclusive
- mz1: string of the monoisotopic mass of the peptide
- avg: string of the average molecular mass of the peptide
- mc: integer of the number of missed cleavage sites required to generate this peptide
- mso: integer of the number of oxidized methionines in this peptide

Fields in the sequence file:
- seq_id: integer used as an internal ID
- name: string of the sequence name from the proteome file
- seq: string of the amino acid sequence
- peptides: integer of the number of peptides generated from the sequence

Fields in the summary file:
- num_peptides: integer of the number of peptides in the peptide database file
- num_sequences: integer of the number of sequences in the sequence file
- enzyme: string of the digestion enzyme chosen by the user
- proteome_file: string of the file path to the FASTA proteome file
- database_created: string of the time and date the database files were created
- database_version: string of the version number of this script used to create the database files
"""
import argparse, os, json
from decimal import Decimal
from datetime import datetime

database_format_version = '0.5.0'


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


# # #  Mass modifications
def apply_mass_modifications(base_pep, sequence):
    mod_peps = []
    # generate additional peptides to account for variable oxidation of methionine
    if args.no_met_ox == False:
        m_count = sequence.count('M')
        for m_num in range(1, m_count+1):
            mso_pep = base_pep.copy()
            mso_pep['mso'] = m_num
            mso_pep['mz1'] += (atomic_masses['O_mono'] * m_num)
            mso_pep['avg'] += (atomic_masses['O_avg'] * m_num)
            mod_peps.append(mso_pep)
    return mod_peps


# # #  Molecular weight functions and attributes
aa_letters = 'ACDEFGHIKLMNPQRSTVWY'
# Masses taken from https://proteomicsresource.washington.edu/protocols06/masses.php
aa_mono_masses = {
    'A':Decimal('71.037113805'), 'C':Decimal('103.009184505'), 'D':Decimal('115.026943065'), 'E':Decimal('129.042593135'), 'F':Decimal('147.068413945'), 'G':Decimal('57.021463735'), 'H':Decimal('137.058911875'), 'I':Decimal('113.084064015'), 'K':Decimal('128.094963050'), 'L':Decimal('113.084064015'), 'M':Decimal('131.040484645'), 'N':Decimal('114.042927470'), 'P':Decimal('97.052763875'), 'Q':Decimal('128.058577540'), 'R':Decimal('156.101111050'), 'S':Decimal('87.032028435'), 'T':Decimal('101.047678505'), 'U':Decimal('150.953633405'), 'V':Decimal('99.068413945'), 'W':Decimal('186.079312980'), 'Y':Decimal('163.063328575')
}
aa_avg_masses = {
    'A':Decimal('71.0779'), 'C':Decimal('103.1429'), 'D':Decimal('115.0874'), 'E':Decimal('129.11398'), 'F':Decimal('147.17386'), 'G':Decimal('57.05132'), 'H':Decimal('137.13928'), 'I':Decimal('113.15764'), 'K':Decimal('128.17228'), 'L':Decimal('113.15764'), 'M':Decimal('131.19606'), 'N':Decimal('114.10264'), 'P':Decimal('97.11518'), 'Q':Decimal('128.12922'), 'R':Decimal('156.18568'), 'S':Decimal('87.0773'), 'T':Decimal('101.10388'), 'U':Decimal('150.3079'), 'V':Decimal('99.13106'), 'W':Decimal('186.2099'), 'Y':Decimal('163.17326')
}
# Masses taken from https://www.unimod.org/masses.html
atomic_masses = {
    'H_mono':Decimal('1.007825035'), 'H_avg':Decimal('1.00794'), 'O_mono':Decimal('15.99491463'), 'O_avg':Decimal('15.9994')
}
# Other weight calculators http://web.thu.edu.tw/fdlung/www/peptidemass.html https://www.peptidesynthetics.co.uk/tools/
def calculate_mz1(sequence):
    # The returned weight includes an N-terminus H, a C-terminus OH, and one MALDI-induced extra H
    proton, oxygen = atomic_masses['H_mono'], atomic_masses['O_mono']
    return peptide_molecular_weight(sequence) + 3*proton + oxygen
def peptide_molecular_weight(sequence):
    # The monoisotopic mass, not including N- or C-terminus atoms
    return sum(aa_mono_masses[aa] for aa in sequence)
def calculate_average_weight(sequence):
    # The returned weight includes an N-terminus H, a C-terminus OH, and one MALDI-induced extra H
    proton, oxygen = atomic_masses['H_avg'], atomic_masses['O_avg']
    return average_peptide_molecular_weight(sequence) + 3*proton + oxygen
def average_peptide_molecular_weight(sequence):
    # The average mass, not including N- or C-terminus atoms
    return sum(aa_avg_masses[aa] for aa in sequence)


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


# # #  Processing code
def digest_sequences(seqs, enzyme, missed_cleavages):
    enz_digest_fxn = digest_fxns[enzyme]
    peptide_db, seq_db = [], []
    for seq_id, seq in enumerate(seqs):
        peptides = seq_to_peptide_dicts(seq_id, seq.seq, enz_digest_fxn, missed_cleavages)
        if len(peptides) == 0:
            continue
        peptide_db.extend(peptides)
        seq_dict = make_sequence_dict(seq_id, seq, len(peptides))
        seq_db.append(seq_dict)
    return peptide_db, seq_db
def seq_to_peptide_dicts(seq_id, sequence, enz_digest_fxn, missed_cleavages):
    # enz_digest_fxn is the cutting function for the enzyme of interest
    raw_fragments = enz_digest_fxn(sequence)
    max_ind = len(raw_fragments) - 1
    seq_end_ind = 0
    peptides = []
    for ind, frag in enumerate(raw_fragments):
        seq_start_ind = seq_end_ind
        seq_end_ind += len(frag)
        peps = make_peptide_dicts(seq_id, seq_start_ind, frag, 0)
        if peps == None:
            continue # Unknown character, can't use frag or its derivitives
        peptides.extend(peps)
        for offset in range(1, missed_cleavages+1):
            if ind+offset > max_ind:
                break
            frag += raw_fragments[ind+offset]
            peps = make_peptide_dicts(seq_id, seq_start_ind, frag, offset)
            if peps == None:
                break # Unknown character, can't use frag or its derivitives
            peptides.extend(peps)
    # sort peptides by start index, then missed cleavages, then mz1 mass
    peptides.sort(key=lambda pep: (pep['start'], pep['mc'], pep['mz1']))
    # convert Decimal values to strings so they're JSON-able
    for pep in peptides:
        pep['mz1'] = str(pep['mz1'])
        pep['avg'] = str(pep['avg'])
    return peptides
def make_peptide_dicts(seq_id, seq_start_ind, sequence, missed_cleavages):
    # Generates the required attributes for each peptide. Applies the mass modifications, and respects the min and max peptide mass limits.
    # The sequence indices are 0-based, but unlike Python indices they are both inclusive. So (start=4, end=9) would represent a peptide of length 6, covering amino acid positions 4, 5, 6, 7, 8, and 9. The next peptide would have (start=10).
    peps = []
    try:
        pep = {'seq_id':seq_id, 'seq':sequence, 'start':seq_start_ind, 'end':seq_start_ind+len(sequence)-1, 'mc':missed_cleavages, 'mso':0, 'mz1':calculate_mz1(sequence), 'avg':calculate_average_weight(sequence)}
    except KeyError: # Thrown when there's a non-standard character in the sequence
        print('Warning: discarding peptide due to unknown character in "{}"'.format(sequence))
        return None
    if args.min_weight <= pep['mz1'] <= args.max_weight:
        peps.append(pep)
    for mod_pep in apply_mass_modifications(pep, sequence):
        if args.min_weight <= mod_pep['mz1'] <= args.max_weight:
            peps.append(mod_pep)
    return peps
def make_sequence_dict(seq_id, seq, num_peptides):
    # Generates the required attributes for each sequence.
    seq_dict = {'seq_id':seq_id, 'name':seq.name, 'seq':seq.seq, 'peptides':num_peptides}
    return seq_dict
def make_summary_dict(peptide_db, seq_db, args):
    # Generates the summary attributes for the proteome digestion.
    now = datetime.now()
    datetime_str = now.strftime('%H:%M:%S - %B %d, %Y')
    summary_db = {'num_peptides':len(peptide_db), 'num_sequences':len(seq_db), 'enzyme':args.enzyme[0], 'proteome_file':args.fasta_file, 'database_created':datetime_str, 'database_version':database_format_version}
    return summary_db


# # #  Command line options
def setup_parser():
    prog_descrip = 'A script to take a protein sequence file in FASTA format, digest it into peptides, and save the corresponding peptide and sequence database files in JSON format.'
    prog_epilog = '' # probably a couple example usages
    parser = argparse.ArgumentParser(description=prog_descrip, epilog=prog_epilog)
    add_arguments(parser)
    return parser
def add_arguments(parser):
    # #  Positional arguments
    parser.add_argument("fasta_file", metavar="FASTA_FILE", help="The proteome sequences in FASTA format")
    parser.add_argument("peptides_out", metavar="PEPTIDES_OUT", help="The location to save the peptides database")
    parser.add_argument("sequences_out", metavar="SEQUENCES_OUT", help="The location to save the sequences database")
    parser.add_argument("summary_out", metavar="SUMMARY_OUT", help="The location to save the summary database")
    parser.add_argument("enzyme", metavar="ENZYME", choices=sorted(digest_fxns.keys()), nargs=1, help="The enzyme to digest the sequences. Must be one of: %(choices)s")
    # #  Optional arguments
    parser.add_argument("-c", "--cleavages", type=int, default=1, help="Specify the number of missed cleavage sites allowed (default: %(default)s)")
    parser.add_argument("-n", "--min_weight", type=float, default=650.0, help="Discard peptides below this molecular weight threshold (default: %(default)s)")
    parser.add_argument("-x", "--max_weight", type=float, default=3800.0, help="Discard peptides above this molecular weight threshold (default: %(default)s)")
    parser.add_argument("-j", "--json_lines", type=int, default=50000, help="Format the peptides database file to have this many peptide JSON entries per line (default: %(default)s)")
    parser.add_argument("-o", "--no_met_ox", action='store_true', help="Use this flag to prevent the generation of additional peptides from the variable oxidation of methionine (default: %(default)s)")
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
    if args.json_lines <= 0:
        parser.error('-j/--json_lines must be a strictly positive integer')
    return args


# # #  Run the code
if __name__ == '__main__':
    parser = setup_parser()
    args = get_and_validate_arguments(parser)
    seqs = parse_fasta_file(args.fasta_file)
    peptide_db, seq_db = digest_sequences(seqs, args.enzyme[0], args.cleavages)
    summary_db = make_summary_dict(peptide_db, seq_db, args)
    # #  Write the peptide database to file in chunks
    linesize = args.json_lines
    with open(args.peptides_out, 'w') as f:
        f.write('\n'.join(json.dumps(peptide_db[ind : ind+linesize]) for ind in range(0, len(peptide_db), linesize)))
    # #  Write the sequence database to file
    with open(args.sequences_out, 'w') as f:
        f.write(json.dumps(seq_db))
    # #  Write the summary database to file
    with open(args.summary_out, 'w') as f:
        f.write(json.dumps(summary_db))
