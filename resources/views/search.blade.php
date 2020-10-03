@extends('layouts.app')

@section('content')


<div class="container">
    <div class="row justify-content-center">
        <div class="col-md-3">
            <div class="card">
                <div class="card-header">{{ __('Experimental Setup') }}</div>

                <div class="card-body">
                  <div id="search-form"></div>
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

<!-- MODALS -->
@include('layouts.partials.search-settings')
@include('layouts.partials.search-help')

@endsection
