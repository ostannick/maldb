@extends('layouts.app')

@section('content')
<div class="container">
    <div class="row justify-content-center">
        <div class="col-md-12">
            <div class="card">
                <div class="card-header">{{ __('My Proteomes') }}</div>

                <div class="card-body">
                    <!--User protein input-->


                    <table class="table">
                      <thead>
                        <tr>
                          <th scope="col">#</th>
                          <th scope="col">Filename</th>
                          <th scope="col">Size</th>
                          <th scope="col">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <th scope="row">1</th>
                          <td>ecoli_k12.fasta</td>
                          <td>36MB</td>
                          <td><i class="fas fa-ban"></i></td>
                        </tr>
                      </tbody>
                    </table>

                </div>
            </div>

            <div class="card mt-3">
                <div class="card-header">{{ __('Upload New Proteomes & Sequences') }}</div>

                <div class="card-body">
                  <form>
                    <div class="form-group">
                      <label for="exampleFormControlFile1">Upload new proteome</label>
                      <input type="file" class="form-control-file" id="exampleFormControlFile1">
                    </div>
                  </form>



                </div>
            </div>
        </div>
    </div>
</div>
@endsection
