@extends('layouts.app')

@section('content')


<div class="container">
  <div id="job-app"></div>
  <div id="toast"></div>
</div>

<!-- MODALS -->
@include('layouts.partials.search-help')
@include('layouts.partials.mass-modifications')

@endsection
