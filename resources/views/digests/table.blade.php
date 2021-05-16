@extends('layouts.app')

@section('content')

<div class="container">

  <div class="row justify-content-center">

  <div class="col-lg-12">

  <div class="card mb-3">
      <div class="card-header">Digest Table</div>

      <div class="card-body">

      <table class="table">
        <thead>
          <tr>
            <th scope="col">ID</th>
            <th scope="col">Parent</th>
            <th scope="col">Sequence</th>
            <th scope="col">Mass Mono</th>
            <th scope="col">Mass Avg</th>
            <th scope="col">Missed Cleavages</th>
            <th scope="col">MSO</th>
          </tr>
        </thead>
        <tbody>
          @foreach($peptides as $p)
            <tr>
              <td>{{$p->id}}</td>
              <td>{{$p->parent}}</td>
              <td>{{$p->sequence}}</td>
              <td>{{$p->mz1_monoisotopic}}</td>
              <td>{{$p->mz1_average}}</td>
              <td>{{$p->missed_cleavages}}</td>
              <td>{{$p->met_ox_count}}</td>
            </tr>
          @endforeach
        </tbody>
      </table>

      </div>

    </div>
  
  </div>

  </div>

</div>
@endsection
