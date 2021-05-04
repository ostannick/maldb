import re
import copy
from pyopenms import *
from Bio.SeqUtils import molecular_weight

class msPeptide:
    def __init__(self, seq, group=0):
        self.parent = "UnknownProtein"
        self.seq = seq
        self.massShift = 0
        self.modificationLog = []
        self.group = group
        self.toleranceConflicts = 0
        self.mso = False

    def sequence(self):
        return str(self.seq)

    def len(self):
        return len(self.seq)

    def mw(self):
        return molecular_weight(self.seq, 'protein')

    def aaCount(self, aa):
        return len(re.findall(aa, self.seq))

    def iodoacetamide(self):
        self.massShift += 57.0520 * len(re.findall('C', self.seq))
        self.modificationLog.append('Carbamidomethyl (C)')
        return self

    def varMethionineOxidation(self):
        potential_modifications = len(re.findall('M', self.seq))
        childPeptides = []
        for mod in range(0, potential_modifications):
            childPep = copy.deepcopy(self)
            childPep.massShift += (mod * 15.9994)
            childPep.mso = True
            childPeptides.append(childPep)
        return childPeptides

    def setCustomMassShift(self, shift):
        self.massShift = shift

    def addCustomMassShift(self, shift):
        self.massShift += shift

    def modLog(self):
        return self.modificationLog

    def mz(self):
        return (self.mw() + self.massShift)

    def mz1(self):
        return (self.mw() + self.massShift + 1.007276466879)

    def mzn(self, n = 1):
        return (self.mw() + self.massShift + (1.007276466879 * n))/n
