<!-- Modal -->
<div class="modal fade" id="help-modal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLongTitle" aria-hidden="true">
  <div class="modal-dialog" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="exampleModalLongTitle">Search Parameters</h5>
        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="modal-body">

        <h2>Enzyme</h2>
        <span class="badge badge-danger">Critical</span>

        <p>
          Select the enzyme that you used to digest your protein.
        </p>

        <p>
          malDB takes protein sequences in fasta format and virtually digests them to create a database of peptides.
          Different proteases have different recognition motifs, so it is critical that you select the right enzyme
          so malDB searches for the right peptides.
        </p>

        <h2>Missed Cleavages</h2>
        <span class="badge badge-warning">Flexible</span>

        <p>
          The number of extra peptides to include in the search space that originated from the enzyme not cleaving.
        </p>

        <p>
          Enzmyes are typically highly efficient and cleave at every site in an unfolded protein. Selecting
          '0' would tell malDB to assume all sites were properly cleaved. As the number of missed cleavages
          increases, so does the search space (dramatically). A safe number to select is '1'. If you have reason
          to suspect your enzyme cleaved with poor efficiency, you can increase this number.
        </p>

        <h2>Tolerance</h2>
        <span class="badge badge-warning">Flexible</span>

        <p>
          The error window for malDB to use in order to consider something a match.
        </p>

        <p>
          Although mass spectrometers are highly sensitive, they still have error associated with their measurements.
          If you observed a peak at 1000 Da in your mass spectrum, malDB needs to know if it should consider a peptide
          in the database with a mass of 1001 Da a hit. A tolerance window of 1 Da would consider this a match.
          The following are examples of tolerance windows:
        </p>

        <ul>
          <li>649.5 < x < 650.5 (0.5 Da)</li>
          <li>999 < x < 1001 (1 Da)</li>
          <li>1998 < x < 2002 (2 Da)</li>
        </ul>

        <p>
          Clearly, having a higher tolerance makes the algorithm more likely to accept a match, and this
          can lead to a high rate of false positives. Thus, it is good practice to keep the tolerance as
          low as possible. Use instrument calibration standards to determine the best value.
        </p>

        <h2>Modifications</h2>
        <span class="badge badge-primary">Important</span>

        <p>
          The chemical modifications that occured to the protein/peptide that will affect the peptide masses.
        </p>

        <p>
          Since matches are based exclusively off of mass, it is important that all chemical modifications be
          accounted for when searching. For example, it is common to treat proteins with iodoacetamide after
          reducing them in order to block cysteines with a carbamidomethyl group to prevent reformation
          of the bond and difficult downstream analysis. When the cysteine gets chemically modified, its mass
          increases by 58 Daltons, and this must be accounted for in the search.
        </p>

        <p>
          Fixed modifications are those that occur on 100% of chemically active sites, and thus do not contribute
          to computational overhead in the search. If it can be safely assumed that all cysteines became reduced
          and blocked, then you can consider this a fixed modification.
        </p>

        <p>
          Variable modifications are those that can occur on some, none, or all amino acids of a specific type.
          For example, methionines will often be found to be oxidized, shifting their mass by 16 Daltons. If a peptide
          with a mass of 1000 Da has three methionines, it is possible to observe a primary peak in the mass spectrum
          at 1000 Da, 1016 Da, 1032 Da, or 1048 Da. Including variable modifications also drastically opens up the
          search space and it is recommended you only include 1 or 2 (methionine oxidation is a standard, common one
          to account for).
        </p>

        <h2>Organisms (Protein Collections)</h2>
        <span class="badge badge-primary">Important</span>

        <p>
          The source of the proteins you would like to search through.
        </p>

        <p>
          In order for malDB to find your protein, it needs to have a FASTA record of it. First and foremost, it is
          crucial that you upload a sequence of your protein in the 'My Proteomes' page. From here, malDB will generate
          the necessary peptides to be searched through.
        </p>

        <p>
          If you are trying to ensure that a protein on a gel is what you think it is, and that protein was purified
          from heterologous expression in E. coli, it is good practice to include the E. coli proteome as a 'background'
          in the search. If you only include one protein in your search, your top hit will always be that one protein.
        </p>

        <h2>Dataset</h2>
        <span class="badge badge-danger">Critical</span>

        <p>
          The list of peaks (picked by a peak-picking algorithm) from your experiment.
        </p>

        <p>
          malDB accepts a list of masses either separated by spaces or commas. The following are examples of acceptable
          submissions
        </p>

        <p>
          1001.325, 1200.444, 1668.252, 1821.932, 2550.567
        </p>

        <p>
          1001.325<br/> 1200.444<br/> 1668.252<br/> 1821.932<br/> 2550.567<br/>
        </p>

        <p>
          It is common to simply copy + paste this data from a spreadsheet. malDB will try to parse the data.
        </p>




      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
      </div>
    </div>
  </div>
</div>
