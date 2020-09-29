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
                          <th scope="col">Organism</th>
                          <th scope="col">Size</th>
                          <th scope="col">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        @foreach($proteomes as $p)
                        <tr>
                          <th scope="row">{{$p->id}}</th>
                          <td>{{$p->name}}</td>
                          <td>{{$p->organism}}</td>
                          <td>36MB</td>
                          <td>
                            <div class="d-flex flex-row">
                            <form class="mr-2" method="POST" action="proteomes/{{$p->id}}">
                              <input type="hidden" name="_method" value="delete" />
                              @csrf

                              <button class="btn btn-primary" type="submit">
                                <i class="fas fa-ban"></i>
                              </button>

                            </form>

                            <form method="POST" action="proteomes/{{$p->id}}">
                              <input type="hidden" name="_method" value="patch" />

                              @csrf

                              <button class="btn btn-primary" type="submit">
                                <i class="fas fa-pencil"></i></td>
                              </button>

                            </form>
                          </div>
                          </td>
                        </tr>
                        @endforeach
                      </tbody>
                    </table>

                </div>
            </div>

            <div class="card mt-3">
                <div class="card-header">{{ __('Upload New Proteomes & Sequences') }}</div>

                <div class="card-body">


                  <form method="POST" action="/proteomes" enctype="multipart/form-data">
                    @csrf

                    <div class="col-md-12 mb-3">
                      <div class="form-row">
                        <input type="text" name="name" class="form-control" placeholder="Protein collection name">
                      </div>
                    </div>

                    <div class="col-md-12 mb-3">
                      <div class="form-row">
                        <input type="text" name="organism" class="form-control" placeholder="Organism (if relevant)">
                      </div>
                    </div>

                    <div class="col-md-12 mb-3">
                      <div class="form-row">
                        <textarea class="form-control" name="description" rows="5" placeholder="Description (optional)"></textarea>
                      </div>
                    </div>

                    <div class="col-md-12 mb-3">
                      <div class="input-group">
                        <div class="custom-file">
                          <input type="file" name="file" class="custom-file-input" id="inputGroupFile01">
                          <label class="custom-file-label" for="inputGroupFile01">Choose file</label>
                        </div>
                      </div>
                    </div>

                    <div class="col-md-12 mb-3">
                      <button type="submit" class="btn btn-primary">Submit</button>
                    </div>




                  </form>



                </div>
            </div>
        </div>
    </div>
</div>
@endsection
