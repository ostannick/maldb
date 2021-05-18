@extends('layouts.app')

@section('content')
<div class="container">
    <div class="row justify-content-center">
        <div class="col-md-12">

          <div class="row">
            <div class="col-sm-6 mb-3">
              <div class="card">
                <div class="card-body">
                  <h5 class="card-title">Upload Proteomes</h5>
                  <p class="card-text">Upload and digest your protein sequences of interest to add to the database.</p>
                  <a href="/proteomes" class="btn btn-primary">Start Uploading</a>
                </div>
              </div>
            </div>
            <div class="col-sm-6">
              <div class="card">
                <div class="card-body">
                  <h5 class="card-title">Search malDB</h5>
                  <p class="card-text">Search your database using mass lists from experiment.</p>
                  <a href="/search" class="btn btn-primary">Start Searching</a>
                </div>
              </div>
            </div>
          </div>

          <div class="row mt-3">
            <div class="col-sm-6 mb-3">
              <div class="card">
                <div class="card-body">
                  <h5 class="card-title">Fingerprint Predictor</h5>
                  <p class="card-text">Predict peptide mass fingerprints from protein sequence.</p>
                  <a href="#" class="btn btn-primary">Start Training</a>
                </div>
              </div>
            </div>
            <div class="col-sm-6 mb-3">
              <div class="card">
                <div class="card-body">
                  <h5 class="card-title">Utilities</h5>
                  <p class="card-text">Other useful tools for MS analysis</p>
                  <a href="#" class="btn btn-primary">Utilities</a>
                </div>
              </div>
            </div>
          </div>

        </div>
    </div>
</div>
@endsection
