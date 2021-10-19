<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>OPCD</title>
    
    <!-- Favicon -->
    <link rel="shortcut icon" href="{{ asset('favicon.ico') }}">
    <!-- Styles -->
    <link href="{{ asset('css/app.css') }}" rel="stylesheet">
</head>

    <body>

        <!-- React root DOM -->
        <div id="root"></div>

        <!-- React JS -->
        <script src="{{ asset('js/app.js') }}" defer></script>
        <script type="text/javascript" src="{{ asset('seditor/js/service/HuskyEZCreator.js') }}" charset="utf-8" defer></script>
        <script src="//developers.kakao.com/sdk/js/kakao.min.js"></script>
        <script src="//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js"></script>
    </body>
</html>