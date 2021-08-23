

# # #  Enzymatic digestion functions
enzymes = {
    'alp':'(?<=[TASVX])', 'arg-c':'(?<=[RX])(?!P)', 'arg-c_P':'(?<=[RX])', 'asp-n':'(?=[DBX])', 'asp-n_ambic':'(?=[DBEZX])', 'chymotrypsin':'(?<=[FYWLJX])(?!P)', 'chymotrypsin_P':'(?<=[FYWLJX])', 'chymotrypsin_precise':'(?<=[FYWLMHJX])(?![P+]) - complex', 'cnbr':'(?<=[MX])', 'elastase':'(?<=[ALIJVX])(?!P)', 'el-tr-cy':'(?<=[ALIVKRWFYX])(?!P)', 'glu-c':'(?<=[DBEZX])(?!P)', 'glu-c_P':'(?<=[DBEZX])', 'ibz':'(?<=[WX])', 'lys-c':'(?<=[KX])(?!P)', 'lys-c_P':'(?<=[KX])', 'lys-n':'(?=[KX])', 'pepsin':'(?<=[FLJX])(?!P)', 'pepsin_P':'(?<=[FLJX])', 'trypsin':'(?<=[KRX])(?!P)', 'trypsin_P':'(?<=[KRX])', 'trypchymo':'(?<=[FYWLJKRX])(?!P)'
}
def get_function(enzyme, ambiguous_cuts=False):
    # 'sites' should be a set containing upper case amino acid symbols defining the cut site
    # 'conditional_sites' should be a dict containing upper case amino acid keys defining the cut site, whose values are a set of upper case amino acid symbols that block digestion.
    # Specificity taken from http://www.matrixscience.com/help/enzyme_help.html, https://web.expasy.org/peptide_cutter/peptidecutter_enzymes.html, and OpenMS
    # Haven't implemented formic acid, proline endopeptidase, as they have recognition sites > 1AA long. Can implement easily enough if useful.
    def trypsin(sequence):
        # Respects the "Keil rule" where it cuts after R/K but not in front of a proline
        conditional_sites = {'R':set('P'), 'K':set('P')}
        if ambiguous_cuts:
            conditional_sites['X'] = set('P')
        return digest_after_conditional(sequence, conditional_sites)
    def trypsin_P(sequence):
        # Does not respect the "Keil rule", cutting after all R/K. Some research suggests this is more realistic.
        sites = set(['R','K'])
        if ambiguous_cuts:
            sites.add('X')
        return digest_after(sequence, sites)
    def chymotrypsin(sequence):
        # Cuts after large hydrophobic AA (F/Y/W/L), blocked by P
        conditional_sites = {'F':set('P'), 'Y':set('P'), 'W':set('P'), 'L':set('P')}
        if ambiguous_cuts:
            conditional_sites.update({'J':set('P'), 'X':set('P')})
        return digest_after_conditional(sequence, conditional_sites)
    def chymotrypsin_P(sequence):
        sites = set(['F', 'Y', 'W', 'L'])
        if ambiguous_cuts:
            sites.update(['J', 'X'])
        return digest_after(sequence, sites)
    def chymotrypsin_precise(sequence):
        # Cuts after more large hydrophobic AA, blocked by P and some other specific AA.
        conditional_sites = {'F':set('P'), 'Y':set('P'), 'W':set(['P','M']), 'L':set('P'), 'M':set(['P','Y']), 'H':set(['P','D','M','W'])}
        if ambiguous_cuts:
            conditional_sites.update({'J':set('P'), 'X':set('P')})
        return digest_after_conditional(sequence, conditional_sites)
    def trypchymo(sequence):
        # A combination of trypsin + chymotrypsin, cuts after R/K + large hydrophobic AA, blocked by P
        conditional_sites = {'R':set('P'), 'K':set('P'), 'F':set('P'), 'Y':set('P'), 'W':set('P'), 'L':set('P')}
        if ambiguous_cuts:
            conditional_sites.update({'J':set('P'), 'X':set('P')})
        return digest_after_conditional(sequence, conditional_sites)
    def glutamyl_endopeptidase(sequence):
        conditional_sites = {'D':set('P'), 'E':set('P')}
        if ambiguous_cuts:
            conditional_sites.update({'B':set('P'), 'Z':set('P'), 'X':set('P')})
        return digest_after_conditional(sequence, conditional_sites)
    def glutamyl_endopeptidase_P(sequence):
        sites = set(['D', 'E'])
        if ambiguous_cuts:
            sites.update(['B', 'Z', 'X'])
        return digest_after(sequence, sites)
    def pepsin(sequence):
        conditional_sites = {'F':set('P'), 'L':set('P')}
        if ambiguous_cuts:
            conditional_sites.update({'J':set('P'), 'X':set('P')})
        return digest_after_conditional(sequence, conditional_sites)
    def pepsin_P(sequence):
        sites = set(['F', 'L'])
        if ambiguous_cuts:
            sites.update(['J', 'X'])
        return digest_after(sequence, sites)
    def arg_c(sequence):
        conditional_sites = {'R':set('P')}
        if ambiguous_cuts:
            conditional_sites['X'] = set('P')
        return digest_after_conditional(sequence, conditional_sites)
    def arg_c_P(sequence):
        sites = set('R')
        if ambiguous_cuts:
            sites.add('X')
        return digest_after(sequence, sites)
    def asp_n(sequence):
        sites = set('D')
        if ambiguous_cuts:
            sites.update(['B', 'X'])
        return digest_before(sequence, sites)
    def asp_n_ambic(sequence):
        sites = set(['D', 'E'])
        if ambiguous_cuts:
            sites.update(['B', 'Z', 'X'])
        return digest_before(sequence, sites)
    def cyanogen_bromide(sequence):
        sites = set('M')
        if ambiguous_cuts:
            sites.add('X')
        return digest_after(sequence, sites)
    def lys_c(sequence):
        conditional_sites = {'K':set('P')}
        if ambiguous_cuts:
            conditional_sites['X'] = set('P')
        return digest_after_conditional(sequence, conditional_sites)
    def lys_c_P(sequence):
        sites = set('K')
        if ambiguous_cuts:
            sites.add('X')
        return digest_after(sequence, sites)
    def lys_n(sequence):
        sites = set('K')
        if ambiguous_cuts:
            sites.add('X')
        return digest_before(sequence, sites)
    # #  Less used enzymes
    def elastase(sequence):
        conditional_sites = {'A':set('P'), 'L':set('P'), 'I':set('P'), 'V':set('P')}
        if ambiguous_cuts:
            conditional_sites.update({'J':set('P'), 'X':set('P')})
        return digest_after_conditional(sequence, conditional_sites)
    def elastase_trypsin_chymotrypsin(sequence):
        conditional_sites = {'A':set('P'), 'L':set('P'), 'I':set('P'), 'V':set('P'), 'K':set('P'), 'R':set('P'), 'W':set('P'), 'F':set('P'), 'Y':set('P')}
        if ambiguous_cuts:
            conditional_sites.update({'J':set('P'), 'X':set('P')})
        return digest_after_conditional(sequence, conditional_sites)
    def alpha_lytic_protease(sequence):
        sites = set(['T', 'A', 'S', 'V'])
        if ambiguous_cuts:
            sites.add('X')
        return digest_after(sequence, sites)
    def iodobenzoate(sequence):
        sites = set('W')
        if ambiguous_cuts:
            sites.add('X')
        return digest_after(sequence, sites)
    # #  Name-to-function map
    digest_functions = {
        'alp':alpha_lytic_protease, 'arg-c':arg_c, 'arg-c_P':arg_c_P, 'asp-n':asp_n, 'asp-n_ambic':asp_n_ambic, 'chymotrypsin':chymotrypsin, 'chymotrypsin_P':chymotrypsin_P, 'chymotrypsin_precise':chymotrypsin_precise, 'cnbr':cyanogen_bromide, 'elastase':elastase, 'el-tr-cy':elastase_trypsin_chymotrypsin, 'glu-c':glutamyl_endopeptidase, 'glu-c_P':glutamyl_endopeptidase_P, 'ibz':iodobenzoate, 'lys-c':lys_c, 'lys-c_P':lys_c_P, 'lys-n':lys_n, 'pepsin':pepsin, 'pepsin_P':pepsin_P, 'trypsin':trypsin, 'trypsin_P':trypsin_P, 'trypchymo':trypchymo
    }
    return digest_functions[enzyme]


# # #  Private functions
def digest_before(sequence, sites):
    return digest_sequence(sequence, sites, offset=0)
def digest_after(sequence, sites):
    return digest_sequence(sequence, sites, offset=1)
def digest_before_conditional(sequence, conditional_sites):
    return digest_sequence_conditional(sequence, conditional_sites, offset=0)
def digest_after_conditional(sequence, conditional_sites):
    return digest_sequence_conditional(sequence, conditional_sites, offset=1)

def digest_sequence(sequence, sites, offset):
    # 'sites' should be a set containing upper case amino acid symbols defining the cut site
    # 'offset' at 0 will cut before the first cut site AA, at 1 will cut after the first AA, etc
    frags = []
    prev_ind = 0
    for cur_ind, aa in enumerate(sequence):
        if aa in sites:
            frags.append(sequence[prev_ind : cur_ind+offset])
            prev_ind = cur_ind + offset
    if prev_ind <= cur_ind:
        frags.append(sequence[prev_ind :])
    return frags
def digest_sequence_conditional(sequence, conditional_sites, offset):
    # 'conditional_sites' should be a dict containing upper case amino acid keys defining the cut site, whose values are a set of upper case amino acid symbols that block digestion.
    # 'offset' at 0 will cut before the first cut site AA, at 1 will cut after the first AA, etc
    # EX {'W':set('M','P'), 'Y':set('P'), 'F':set()} & offset=1 indicates that digestion should happen after W unless the next AA is M or P; after Y unless the next AA is P; and after all F.
    frags = []
    prev_ind, max_ind = 0, len(sequence) - 1
    for cur_ind, aa in enumerate(sequence):
        if aa in conditional_sites:
            if cur_ind < max_ind and sequence[cur_ind+1] in conditional_sites[aa]:
                continue
            frags.append(sequence[prev_ind : cur_ind+offset])
            prev_ind = cur_ind + offset
    if prev_ind <= cur_ind:
        frags.append(sequence[prev_ind :])
    return frags
