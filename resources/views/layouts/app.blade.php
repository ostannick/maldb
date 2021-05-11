<!doctype html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <!-- CSRF Token -->
    <meta name="csrf-token" content="{{ csrf_token() }}">

    <title>{{ config('app.name', 'malDB') }}</title>

    <!-- Scripts -->
    <script src="{{ asset('js/app.js') }}" defer></script>

    <!-- Fonts -->
    <link rel="dns-prefetch" href="//fonts.gstatic.com">
    <link href="https://fonts.googleapis.com/css?family=Nunito" rel="stylesheet">
    <link rel="stylesheet" href="https://pro.fontawesome.com/releases/v5.14.0/css/all.css" integrity="sha384-VhBcF/php0Z/P5ZxlxaEx1GwqTQVIBu4G4giRWxTKOCjTxsPFETUDdVL5B6vYvOt" crossorigin="anonymous">

    <!-- Styles -->
    <link href="{{ asset('css/app.css') }}" rel="stylesheet">
</head>
<body style="background-color: #330f4d">
    <div id="app">

      <nav class="navbar navbar-expand-lg navbar-light bg-light">
        <div class="container">
          <a class="navbar-brand" href="{{ url('/home') }}">  {{ config('app.name', 'malDB') }} <i class="fal fa-chart-bar"></i> </a>
          <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavDropdown" aria-controls="navbarNavDropdown" aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
          </button>
          <div class="collapse navbar-collapse" id="navbarNavDropdown">
            <ul class="navbar-nav">
              <li class="nav-item">
                <a class="nav-link active" aria-current="page" href="/home">Dashboard</a>
              </li>
              <li class="nav-item">
                <a class="nav-link" href="/maldb">Perform Search</a>
              </li>
              <li class="nav-item dropdown">
                <a class="nav-link dropdown-toggle" href="#" id="navbarDropdownMenuLink" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                  Account
                </a>
                <ul class="dropdown-menu" aria-labelledby="navbarDropdownMenuLink">
                  @guest
                      <li><a class="dropdown-item" href="{{ route('login') }}">{{ __('Login') }}</a></li>
                      <li><a class="dropdown-item" href="{{ route('register') }}">{{ __('Register') }}</a></li>
                  @else
                      <li><a class="dropdown-item disabled" href="#">{{ Auth::user()->name }}</a></li>
                      <li><a class="dropdown-item" href="/proteomes">Proteome Manager</a></li>
                      <li><a class="dropdown-item" href="/logout">Log Out</a></li>
                  @endguest
                </ul>
              </li>
            </ul>
          </div>
        </div>
      </nav>

        <main class="py-4">

          <div class="container">
            @if(session()->has('success'))
                <div class="alert alert-success">
                    {{ session()->get('success') }}
                </div>
            @endif

            @if(session()->has('failure'))
                <div class="alert alert-success">
                    {{ session()->get('failure') }}
                </div>
            @endif
          </div>

            @yield('content')
        </main>
    </div>
</body>

</html>
