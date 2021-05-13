@extends('layouts.app')

@section('content')
<div class="container">
    <div class="row justify-content-center">
        <div class="col-md-12">

        <div class="card mb-3">
          <div class="card-header">Jobs in Queue</div>

          <div class="card-body">

            <div class="list-group">

              @foreach($jobs as $job)

                <a href="#" class="list-group-item list-group-item-action" aria-current="true">
                  <div class="d-flex w-100 justify-content-between">
                    <h5 class="mb-1"><span class="badge rounded-pill bg-primary">{{$job->id}}</span> {{$job->payload->displayName}}</h5>
                    <small>{{$job->created_at}}</small>
                  </div>
                  <p class="mb-1"></p>
                  <small>QUEUE: {{$job->queue}}</small>
                </a>

              @endforeach

            </div>
            

          </div>

        </div>






        <div class="card mb-3">
          <div class="card-header">Failed Jobs</div>

          <div class="card-body">

            <div class="list-group">

              @foreach($failed_jobs as $job)

                <a href="#" class="list-group-item list-group-item-action" aria-current="true">
                  <div class="d-flex w-100 justify-content-between">
                    <h5 class="mb-1">{{$job->id}}</h5>
                    <small>{{$job->failed_at}}</small>
                  </div>
                  <p class="mb-1">{{$job->exception}}</p>
                  <small>QUEUE: {{$job->queue}}</small>
                </a>

              @endforeach

            </div>
            

          </div>

        </div>

        </div>
    </div>
</div>
@endsection
