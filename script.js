let SignInButton=document.getElementById('SignInButton')
var YOUR_CLIENT_ID='427638762174-p83o7vg71glf6486slhmt9r8sti2uk8l.apps.googleusercontent.com';
var YOUR_REDIRECT_URI='http://localhost:5000/oauth2callback/';

SignInButton.addEventListener('click', function() {
  trySampleRequest();  
})

// If there's an access token, try an API request.
// Otherwise, start OAuth 2.0 flow.
function trySampleRequest() {
    let params=JSON.parse(localStorage.getItem('oauth2-test-params'));
    if(params&&params['access_token']) {
        var xhr=new XMLHttpRequest();
        xhr.open('GET',
            'https://www.googleapis.com/youtube/v3/channels?part=snippet&mine=true&'+
            'access_token='+params['access_token']);
        xhr.onreadystatechange=function(e) {
            if(xhr.readyState===4&&xhr.status===200) {
                console.log(xhr.response);
            } else if(xhr.readyState===4&&xhr.status===401) {
                // Token invalid, so prompt for user permission.
                oauth2SignIn();
            }
        };
        xhr.send(null);
    } else {
        oauth2SignIn();
    }
}

    /*
     * Create form to request access token from Google's OAuth 2.0 server.
     */
function oauth2SignIn() {
    console.log('inside the oauth2SignIn function');
    // Google's OAuth 2.0 endpoint for requesting an access token
    var oauth2Endpoint='https://accounts.google.com/o/oauth2/v2/auth';

    // Create element to open OAuth 2.0 endpoint in new window.
    var form=document.createElement('form');
    form.setAttribute('method', 'GET'); // Send as a GET request.
    form.setAttribute('action', oauth2Endpoint);

    // Parameters to pass to OAuth 2.0 endpoint.
    var params={
        'client_id': YOUR_CLIENT_ID,
        'redirect_uri': YOUR_REDIRECT_URI,
        'scope': 'https://www.googleapis.com/auth/youtube.force-ssl',
        'state': 'try_sample_request',
        'include_granted_scopes': 'true',
        'response_type': 'token'
    };

    // Add form parameters as hidden input values.
    for(var p in params) {
        var input=document.createElement('input');
        input.setAttribute('type', 'hidden');
        input.setAttribute('name', p);
        input.setAttribute('value', params[p]);
        form.appendChild(input);
    }

    // Add form to page and submit it to open the OAuth 2.0 endpoint.
    document.body.appendChild(form);
    form.submit();
}