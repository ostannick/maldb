@extends('layouts.app')

@section('content')
<div class="container">
    <div class="row justify-content-center">
        <div class="col-md-12">

          <div class="card mb-3">
            <div class="card-header">

            <i class="fal fa-pencil"></i>
            &nbsp;
            <span class="badge rounded-pill bg-primary">{{$proteome->organism}}</span>
            &nbsp;
            <strong>{{$proteome->name}}</strong></div>

            <div class="card-body">
            <form>

              <div class="col-lg-12 mb-3 flex justify-content-right">
                <textarea class="form-control" id="exampleFormControlTextarea1" rows="20">{{$fasta}}</textarea>
              </div>
              
              <div class="col-lg-12 mb-1 d-flex justify-content-end">
                <button type="button" class="btn btn-light btn-sm">Discard Changes</button>
                <button type="button" class="btn btn-primary btn-sm">Save Changes</button>
              </div>

            </form>
            </div>
          </div>


        </div>
    </div>
</div>
@endsection
