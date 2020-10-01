@extends('layouts.app')

@section('content')


<div class="container">
    <div class="row justify-content-center">
        <div class="col-md-3">
            <div class="card">
                <div class="card-header">{{ __('Experimental Setup') }}</div>

                <div class="card-body">

                  <!--FORM-->
                  <div class="row">

                    <div class="col-12">
                      <div class="form-group">
                        <label for="enzymeSelect">Enzyme</label>
                        <select name="enzyme" class="form-control" id="enzymeSelect">
                          <option value="Trypsin">Trypsin</option>
                          <option value="Chymotrypsin">Chymotrypsin</option>
                        </select>
                      </div>
                    </div>

                    <div class="col-12">
                      <div class="form-group">
                        <label for="missedCleavages">Missed Cleavages</label>
                        <select name="missedCleavages" class="form-control" id="missedCleavages">
                          <option value="0">0</option>
                          <option selected value="0">1</option>
                          <option value="0">2</option>
                        </select>
                      </div>
                    </div>

                    <div class="col-12">
                      <div class="form-group">
                        <div class="input-group">
                          <div class="input-group-prepend">
                            <span class="input-group-text" id="inputGroupPrepend2"><i class="fal fa-fw fa-arrows-h"></i></span>
                          </div>
                          <input type="text" class="form-control" id="validationDefaultUsername" placeholder="Tolerance" value="1.2" required>
                        </div>
                      </div>
                    </div>

                    <div class="col-12">
                      <div class="form-group">
                        <div class="input-group">
                          <div class="input-group-prepend">
                            <span class="input-group-text" id="inputGroupPrepend2"><i class="fal fa-fw fa-plus"></i></span>
                          </div>
                          <input type="text" class="form-control open-settings" id="validationDefaultUsername" placeholder="Modifications" aria-describedby="inputGroupPrepend2" required>
                        </div>
                      </div>
                    </div>

                    <div class="col-12">
                      <div class="form-group">
                        <div class="input-group">
                          <div class="input-group-prepend">
                            <span class="input-group-text" id="inputGroupPrepend2"><i class="fal fa-fw fa-bacterium"></i></span>
                          </div>
                          <input type="text" class="form-control open-settings" id="validationDefaultUsername" placeholder="Organisms" aria-describedby="inputGroupPrepend2" required>
                        </div>
                      </div>
                    </div>

                    <div class="col-12">
                      <div class="form-group">
                        <label for="tolerance">Dataset</label>
                        <textarea class="form-control" id="massList" rows="3" placeholder="Mass List"></textarea>
                      </div>
                    </div>

                    <hr/>

                    <div class="col-12">
                      <button class="btn btn-secondary"><i class="fas fa-fw fa-question"></i></button>
                      <button class="btn btn-primary float-right"><i class="fas fa-fw fa-play"></i></button>
                    </div>


                  </div>

                </div>
            </div>
        </div>

        <div class="col-md-9">
          <div class="card">
              <div class="card-header">{{ __('Result Summary') }}</div>

              <div class="card-body">


                <div id="summarychart"></div>

              </div>
          </div>
        </div>
    </div>
</div>

@include('layouts.partials.search-settings')

@endsection
