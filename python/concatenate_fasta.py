import sys, os
from glob import glob

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

def save_fasta_file(seqs, out_file):
    buff = []
    for seq in seqs:
        seq_text = '>{}\n{}\n'.format(seq.name, seq.seq)
        buff.append(seq_text)
    with open(out_file, 'w') as f:
        f.write('\n'.join(buff))

class Sequence(object):
    def __init__(self, name, sequence):
        self.name = name
        self.sequence = sequence.upper()
        self.seq = self.sequence


# # #  Run code
args = sys.argv[1:]
if len(args) < 2:
    print('Error: must supply at least 2 input files followed by a name for the concatenated output. Wildcards in file names are supported.')
    print('Usage: python {} INPUT_1.fa *.faa OUTPUT.fa')
    exit()

out_file = args[-1]
filenames = set()
for fname in args[:-1]:
    if os.path.isfile(fname):
        filenames.add(fname)
    else:
        for fnam in glob(fname):
            if os.path.isfile(fnam):
                filenames.add(fnam)
if len(filenames) < 2:
    print('Error: must supply at least 2 input files followed by a name for the concatenated output. Wildcards in file names are supported.')
    print('Usage: python {} INPUT_1.fa *.faa OUTPUT.fa')
    exit()

sequences = []
for fname in filenames:
    seqs = parse_fasta_file(fname)
    sequences.extend(seqs)
print('Parsed {} sequences from {} files...'.format(len(sequences), len(filenames)))
save_fasta_file(sequences, out_file)
print('Saved sequences to {}'.format(out_file))
