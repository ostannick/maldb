@extends('layouts.app')

@section('content')

<div class="container">
    <div class="row justify-content-center">
        <div class="col-md-12">
            <div class="card">
                <div class="card-header">{{ __('My Proteomes') }}</div>

                <div class="card-body">
                    <!--User protein input-->

                    <div class="accordion" id="accordionExample">
                        @foreach($proteomes as $p)

                        <div class="accordion-item">
                          <h2 class="accordion-header" id="proteome_{{$p->id}}">
                            <button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#body_{{$p->id}}" aria-expanded="true" aria-controls="collapseOne">
                              {{$p->name}}, {{$p->organism}} (ID: {{$p->id}})
                            </button>
                          </h2>
                          <div id="body_{{$p->id}}" class="accordion-collapse collapse show" aria-labelledby="headingOne" data-bs-parent="#accordionExample">
                            <div class="accordion-body">



                              <div class="row">
                                <div class="col-lg-6">
                                  <h5>Generate Digest Table</h5>
                                  <div class="mb-3">
                                    <label for="enzyme" class="form-label">Enzyme:</label>
                                    <select id="enzyme" class="form-select">
                                      <option value="trypsin">Trypsin</option>
                                      <option value="chymotrypsin">Chymotrypsin</option>
                                    </select>
                                  </div>

                                  <div class="mb-3">
                                    <label for="enzyme" class="form-label">Include missed cleavages up to:</label>
                                    <select id="enzyme" class="form-select">
                                      <option value="0">0</option>
                                      <option value="1">1</option>
                                      <option value="2" selected>2</option>
                                      <option value="3">3</option>
                                      <option value="4">4</option>
                                      <option value="5">5</option>
                                    </select>
                                  </div>

                                  <div class="mb-3">
                                    <button type="button" class="btn btn-primary">Generate Digestion Table</button>
                                  </div>

                                  <div class="mb-3">
                                    <div class="progress">
                                      <div class="progress-bar progress-bar-striped progress-bar-animated" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" style="width: 0%"></div>
                                    </div>
                                  </div>

                                  <div class="mb-3">
                                    <div class="progress">
                                      <p class="font-monospace">Most recent job status</p>
                                    </div>
                                  </div>


                                </div>


                                <div class="col-lg-6">

                                  <h5>Existing Digest Tables</h5>

                                  <div class="list-group">

                                    <a href="#" class="list-group-item list-group-item-action" aria-current="true">
                                      <div class="d-flex w-100 justify-content-between">
                                        <h5 class="mb-1">242_Escherichia-coli_trypsin_dig</h5>
                                        <small><span class="badge rounded-pill bg-primary">665431 peptides</span></small>
                                      </div>
                                      <p class="mb-1">Trypsin</p>
                                      <small>And some small print.</small>
                                    </a>

                                    <a href="#" class="list-group-item list-group-item-action" aria-current="true">
                                      <div class="d-flex w-100 justify-content-between">
                                        <h5 class="mb-1">242_Escherichia-coli_chymotrypsin_dig</h5>
                                        <small><span class="badge rounded-pill bg-primary">885221 peptides</span></small>
                                      </div>
                                      <p class="mb-1">Trypsin</p>
                                      <small>And some small print.</small>
                                    </a>


                                </div>
                              </div>

                            </div>
                          </div>
                        </div>

                        @endforeach

                        <div class="accordion-item">
                          <h2 class="accordion-header" id="upload_new">
                            <button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
                              <span class="badge rounded-pill bg-light text-dark"><i class="fa fa-plus"></i> </span> Add Proteome
                            </button>
                          </h2>
                          <div id="collapseOne" class="accordion-collapse collapse show" aria-labelledby="headingOne" data-bs-parent="#accordionExample">
                            <div class="accordion-body">

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
            </div>
        </div>
    </div>
</div>
@endsection
