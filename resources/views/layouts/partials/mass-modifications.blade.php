<!-- Modal -->
<div class="modal fade" id="mass-mods-modal" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
  <div class="modal-dialog modal-dialog-centered" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="exampleModalLongTitle">Mass Modifications</h5>
        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="modal-body">
        <div class="row">
          <div class="col-md-12">

          </div>
          <div class="col-md-12">
            <h6>Fixed Mass Modifications</h6>

            <div class="custom-control custom-switch">
              <input type="checkbox" class="custom-control-input" id="fix_carbamidomethyl_cys" checked>
              <label class="custom-control-label" for="fix_carbamidomethyl_cys">Carbamidomethylation of Cysteines</label>
            </div>

            <hr>

            <h6>Variable Mass Modifications</h6>

            <div class="custom-control custom-switch">
              <input type="checkbox" class="custom-control-input" id="var_oxidation_met" checked>
              <label class="custom-control-label" for="var_oxidation_met">Oxidation of Methionines</label>
            </div>

          </div>
        </div>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
        <button type="button" class="btn btn-primary">Save changes</button>
      </div>
    </div>
  </div>
</div>
