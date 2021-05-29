@extends('layouts.app')

@section('content')
<div class="container">
  <div class="row justify-content-center">
    <div class="col-md-12">

      <div class="row row-cols-1 row-cols-md-3 g-4">

        <div class="col">
          <div class="card h-100">
          <img src="https://picsum.photos/500/100" class="card-img-top">
            <div class="card-body">
              <h5 class="card-title">Launch malDB</h5>
              <p class="card-text">Launches the application. Upload and digest proteomes, then search through them with experimental data.</p>
            </div>
            <div class="card-footer d-flex flex-row-reverse">
              <a href="/spa" class="btn btn-primary">Launch</a>
            </div>
          </div>
        </div>

        <div class="col">
          <div class="card h-100">
            <img src="https://picsum.photos/500/100" class="card-img-top">
            <div class="card-body">
              <h5 class="card-title">Learn</h5>
              <p class="card-text">Learn how to perform peptide mass fingerprinting and use malDB.</p>
            </div>
            <div class="card-footer d-flex flex-row-reverse">
              <a href="/learn" class="btn btn-primary">Learn</a>
            </div>
          </div>
        </div>

        <div class="col">
          <div class="card h-100">
            <img src="https://picsum.photos/500/100" class="card-img-top">
            <div class="card-body">
              <h5 class="card-title">Administration</h5>
              <p class="card-text">Edit the global application settings.</p>
            </div>
            <div class="card-footer d-flex flex-row-reverse">
              <a href="/admin" class="btn btn-primary">Administration</a>
            </div>
          </div>
        </div>

      </div>

    </div>
  </div>
</div>
@endsection