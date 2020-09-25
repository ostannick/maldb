@extends('layouts.app')

@section('content')
<div class="container">
    <div class="row justify-content-center">
        <div class="col-md-12">
            <div class="card">
                <div class="card-header">{{ __('Search malDB') }}</div>

                <div class="card-body">

                  <div class="row">
                    <div class="col-12">
                      <form>
                        <div class="form-row">
                          <div class="col">
                            <input type="text" class="form-control" placeholder="First name">
                          </div>
                          <div class="col">
                            <input type="text" class="form-control" placeholder="Last name">
                          </div>
                        </div>
                      </form>
                    </div>
                  </div>

                  <div class="row">
                    <div class="col-12">
                      <form>
                        <div class="form-group">
                          <textarea class="form-control" id="massList" rows="3" placeholder="Mass List"></textarea>
                        </div>
                      </form>
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
