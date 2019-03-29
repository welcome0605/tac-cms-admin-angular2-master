<!doctype html>
<html lang="{{ config('app.locale') }}">
    <head>
        <meta charset="utf-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1">

        <title>Laravel</title>
        <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0-beta.2/css/bootstrap.min.css" integrity="sha384-PsH8R72JQ3SOdhVi3uxftmaW6Vc51MKb0q5P2rRUpPvrszuE4W1povHYgTpBfshb" crossorigin="anonymous">
    </head>
    <body>
        <div class="container">
            <div class="row">
                <div class="col-md-6">
                    <!-- <button id="customButton">Checkout with {{$pkg_name}}</button>-->               
                </div>
            </div>
        </div>        
        <script src="https://checkout.stripe.com/checkout.js"></script>
        <script>
                    var handler = StripeCheckout.configure({
                    key: 'pk_test_Y86bGyUafOaq8DUBJMRoOrTA',
                    image: 'http://localhost:4300/assets/modules/dummy-assets/common/img/logo-inverse.png',
                    locale: 'auto',
                    token: function(token,args) {
                        // You can access the token ID with `token.id`.
                        // Get the token ID to your server-side code for use.
                        // console.log('token',token);
                        // console.log('arguments optional',args);
                    }
                    });

                    document.addEventListener('DOMContentLoaded', function(e) {
                    // Open Checkout with further options:
                    handler.open({
                        name: '{{$pkg_name}}',
                        description: '{{$pkg_name}}',
                        amount: {{$pkg_price}}*100
                    });
                    e.preventDefault();
                    },false);

                    // Close Checkout on page navigation:
                    window.addEventListener('popstate', function() {
                    handler.close();
                    });
        </script>
    </body>
</html>