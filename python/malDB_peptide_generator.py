# Import Libraries

import numpy as np
import pandas as pd
import re
import json
import sys
from pyopenms import *
from Bio.SeqUtils import molecular_weight
from Bio import SeqIO
import operator
from msPeptide import *
from createDatabase import *
from variableModifications import *

# -----------------Settings--------------------- #
tolerance = 2.0
instrumentLower = 0.000
instrumentUpper = 20000.000

# Define the variable modifications
vm = [
varMod_MethionineOxidation
]

# Input protein sequence from command line
proteome = sys.argv[1] #proteome in fasta format
protease = sys.argv[2] #enzyme to digest with
outfile  = sys.argv[3] #outfile


sql_table = []

for record in SeqIO.parse(proteome, "fasta"):
    protein_name = record.id
    protein_sequence = record.seq

    try:
        # Generate the database
        db = peptideDatabase(str(protein_sequence), protease, protein_name)
        db.generate(iodo=True, variableModifications=vm)
        # Send to PHP
        sql_table.append(db.get_as_list())
    except ValueError:
        pass
        #print("A non-AA character was found in the sequence. Couldn't calculate MW.")

f = open(outfile, "w")
f.write(json.dumps(sql_table))
f.close()
