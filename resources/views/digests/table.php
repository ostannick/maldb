@extends('layouts.app')

@section('content')

<div class="container">

  <div id="digest-table">
  
    @foreach($peptides as $p)

      {{$p->name}}

    @endforeach
  
  </div>

</div>
@endsection
