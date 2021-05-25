@extends('layouts.app')

@section('content')
<div class="container">
  <div class="row justify-content-center">
    <div class="col-md-12">

      <div class="row row-cols-1 row-cols-md-3 g-4">

        <div class="col">
          <div class="card h-100">
            <img src="..." class="card-img-top" alt="...">
            <div class="card-body">
              <h5 class="card-title">Perform Search</h5>
              <p class="card-text">Search your digest tables using mass lists obtained from your MALDI instrument.</p>
            </div>
            <div class="card-footer d-flex flex-row-reverse">
              <a href="/search" class="btn btn-primary">Start Searching</a>
            </div>
          </div>
        </div>

        <div class="col">
          <div class="card h-100">
            <img src="..." class="card-img-top" alt="...">
            <div class="card-body">
              <h5 class="card-title">Digest Proteomes</h5>
              <p class="card-text">Upload a collection of any proteins in .FASTA format, and begin generating digestion tables.</p>
            </div>
            <div class="card-footer d-flex flex-row-reverse">
              <a href="/proteomes" class="btn btn-primary">Manage Proteomes</a>
            </div>
          </div>
        </div>

        <div class="col">
          <div class="card h-100">
            <img src="..." class="card-img-top" alt="...">
            <div class="card-body">
              <h5 class="card-title">Manage Modifications</h5>
              <p class="card-text">View, delete, and define new mass modifications.</p>
            </div>
            <div class="card-footer d-flex flex-row-reverse">
              <a href="/modifications" class="btn btn-primary">Manage Modifications</a>
            </div>
          </div>
        </div>

        <div class="col">
          <div class="card h-100">
            <img src="..." class="card-img-top" alt="...">
            <div class="card-body">
              <h5 class="card-title">Neural Network Interface</h5>
              <p class="card-text">Inspect and curate your training data to improve neural network prediction capability.</p>
            </div>
            <div class="card-footer d-flex flex-row-reverse">
              <a href="/nn" class="btn btn-primary">Neural Network Manager</a>
            </div>
          </div>
        </div>

        <div class="col">
          <div class="card h-100">
            <img src="..." class="card-img-top" alt="...">
            <div class="card-body">
              <h5 class="card-title">Job Queue</h5>
              <p class="card-text">View the Job Queue</p>
            </div>
            <div class="card-footer d-flex flex-row-reverse">
              <a href="/queue" class="btn btn-primary">Job Queue</a>
            </div>
          </div>
        </div>

        <div class="col">
          <div class="card h-100">
            <img src="..." class="card-img-top" alt="...">
            <div class="card-body">
              <h5 class="card-title">Learn</h5>
              <p class="card-text">Read and watch tutorials on how to perform peptide mass fingerprinting and use malDB.</p>
            </div>
            <div class="card-footer d-flex flex-row-reverse">
              <a href="/learn" class="btn btn-primary">Learn</a>
            </div>
          </div>
        </div>

        <div class="col">
          <div class="card h-100">
            <img src="..." class="card-img-top" alt="...">
            <div class="card-body">
              <h5 class="card-title">Application Settings</h5>
              <p class="card-text">Edit the server's application settings.</p>
            </div>
            <div class="card-footer d-flex flex-row-reverse">
              <a href="/settings" class="btn btn-primary">Edit Settings</a>
            </div>
          </div>
        </div>


      </div>

    </div>
  </div>
</div>
@endsection