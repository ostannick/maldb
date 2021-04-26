@extends('layouts.app')

@section('content')


<div class="container">
  <div id="job-app"></div>

</div>

<!-- MODALS -->
@include('layouts.partials.search-settings')
@include('layouts.partials.search-help')
@include('layouts.partials.mass-modifications')

@endsection
