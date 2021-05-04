# createDatabase.py
import re
import copy
import json
import operator
from pyopenms import *
from msPeptide import *
from variableModifications import *

def varMod(pepObj, mod=None, aaString=None, massShift=None, name=None):
    # Supply this function with a peptide, the amino acids to be
    # modified, and the mass shift, and this will return an array
    # of masses corresponding to each population. The actual
    # distribution of these masses in the experiment can inform
    # which residues are getting modified (Pascal's Triangle)
    pepList = []

    #For modifications from variableModifications.py
    if mod is not None:
        rexp = mod['targets']
        sites = len(re.findall(rexp, pepObj.sequence()))
        # print('Found ' + str(sites) + ' ' + mod['name'] + ' sites')

        for x in range(1, sites + 1):
            pep = copy.deepcopy(pepObj)
            pep.addCustomMassShift(x * mod['massShift'])
            pep.modificationLog.append(str(x) + ' ' + mod['name'] + ' mods')
            pepList.append(pep)

    #For hard-coded custom modifications
    else:
        rexp = "[" + aaString + "]"
        sites = len(re.findall(rexp, pepObj.sequence()))

        for x in range(1, sites):
            pep = msPeptide(pepObj.sequence())
            pep.addCustomMassShift(x * massShift)
            pep.modificationLog.append(str(x) + ' ' + modName + ' modifications')
            pepList.append(pep)

    # print(pepList)
    return pepList

class peptideDatabase:
    def __init__(self, sequence, enzyme, protein_name):
        self.protein_name = protein_name
        self.sequence = AASequence.fromString(sequence)
        self.enzyme = enzyme
        self.msPeptides = []
        self.db = []

        # Create the digest object
        dig = ProteaseDigestion()

        # Set the protease
        dig.setEnzyme(self.enzyme)

        #Perform digestion
        tempList = []
        dig.digest(self.sequence, tempList)

        for pep in tempList:
            self.msPeptides.append(msPeptide(str(pep)))


    def getPeptides(self):
        return self.msPeptides

    def availableEnzymes(self):
        enzymes = []
        ProteaseDB().getAllNames(enzymes)
        return enzymes

    def trim(self, lower, upper):
        toBeDeleted = []
        for x in range(0, len(self.msPeptides)):
            if(self.msPeptides[x].mz1() < lower or self.msPeptides[x].mz1() > upper):
                toBeDeleted.append(x)  # Removes this index from the list

        toBeDeleted.sort(reverse = True)
        for x in toBeDeleted:
            self.msPeptides.pop(x)

    def generate(self, iodo=False, variableModifications=None):
        masterList = []

        for pep in self.msPeptides:
            if(iodo):
                pep.iodoacetamide()

            masterList.append(pep)

        for mod in variableModifications:
            tempList = []
            for pep in masterList:
                tempList.extend(varMod(pep, mod))
            masterList.extend(tempList)

        self.msPeptides = masterList

        for x in range(len(self.msPeptides)):
            self.db.append({
            "id": x,
            "parent": self.protein_name,
            "sequence": self.msPeptides[x].sequence(),
            "mz": self.msPeptides[x].mz(),
            "mz1": self.msPeptides[x].mz1(),
            "length": self.msPeptides[x].len(),
            "massShift": self.msPeptides[x].massShift,
            "modf_cys": "iodoacetamide",
            "modv_mso": self.msPeptides[x].mso,
            })

        return self

    def get_as_list(self):
        return self.db

    def serializeDatabase(self):
        return json.dumps(self.db)

    def sort(self):

        self.msPeptides = sorted(self.msPeptides, key=lambda obj: obj.mz1())
        return

    def precursorSpectralCrowdingTolerance(self, tol):

        for x in range(len(self.msPeptides)):
            for y in range(len(self.msPeptides)):
                if(abs(self.msPeptides[x].mz1() - self.msPeptides[y].mz1()) <= tol and x != y):
                    self.msPeptides[x].toleranceConflicts += 1

        return
