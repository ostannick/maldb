@extends('layouts.app')

@section('content')
<div class="container">
    <div class="row justify-content-center">
        <div class="col-md-12">
            <div class="card">
                <div class="card-header">{{ __('Experimental Setup') }}</div>

                <div class="card-body">

                  <!--FORM-->
                  <div class="row">

                    <div class="col-12">

                      <div class="row mb-2">

                        <div class="col">
                          <div class="form-group">
                            <label for="enzymeSelect">Enzyme</label>
                            <select name="enzyme" class="form-control" id="enzymeSelect">
                              <option value="Trypsin">Trypsin</option>
                            </select>
                          </div>
                        </div>

                        <div class="col">
                          <div class="form-group mb-2">
                            <label for="missedCleavages">Missed Cleavages</label>
                            <select name="missedCleavages" class="form-control" id="missedCleavages">
                              <option value="0">0</option>
                            </select>
                          </div>
                        </div>

                        <div class="col">
                          <div class="form-group mb-2">
                            <label for="tolerance">Tolerance (Da)</label>
                            <input class="form-control" id="tolerance" placeholder="(Da)" value="1.2">
                          </div>
                        </div>

                      </div>

                    </div>

                  </div>

                </div>
            </div>

            <div class="row mt-3">

              <div class="col-md-4">
                <div class="card">
                    <div class="card-header">{{ __('Protein Collections')}}</div>

                    <div class="card-body">
                      @auth
                        @foreach($proteomes as $p)
                        <div class="form-check">
                          <input class="form-check-input" type="checkbox" value="" id="defaultCheck1">
                          <label class="form-check-label" for="defaultCheck1">
                            {{$p->name}}
                          </label>
                        </div>
                        @endforeach
                      @endauth
                    </div>
                </div>
              </div>


              <div class="col-md-4">
                <div class="card">
                    <div class="card-header">{{ __('Modifications')}}</div>

                    <div class="card-body">

                    </div>
                </div>
              </div>



              <div class="col-md-4">
                <div class="card">
                    <div class="card-header">{{ __('Dataset')}}</div>

                    <div class="card-body">
                      <div class="form-group">
                        <textarea class="form-control" id="massList" rows="8" placeholder="Mass List"></textarea>
                      </div>
                    </div>
                </div>
              </div>


            </div>



            <div class="card mt-3">
                <div class="card-header">{{ __('Result Summary') }}</div>

                <div class="card-body">


                  <div id="summarychart"></div>

                </div>
            </div>
        </div>
    </div>
</div>
@endsection
