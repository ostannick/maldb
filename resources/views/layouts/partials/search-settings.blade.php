<!-- Modal -->
<div class="modal fade" id="settings-modal" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
  <div class="modal-dialog modal-dialog-centered" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="exampleModalLongTitle">Search Space Settings</h5>
        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="modal-body">
        <div class="row">
          <div class="col-md-12">

          </div>
          <div class="col-md-6">
            <h6>My Proteomes</h6>
            @foreach($proteomes as $p)
            <div class="custom-control custom-switch">
              <input type="checkbox" class="custom-control-input" id="{{$p->name}}">
              <label class="custom-control-label" for="{{$p->name}}">{{$p->name}}</label>
            </div>

            @endforeach
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
