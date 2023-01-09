
let SignInButton=document.getElementById('SignInButton')
let YOUR_CLIENT_ID='222100007430-g366vm0jle1ajs3deifng7okd7jpolgb.apps.googleusercontent.com';
//var YOUR_REDIRECT_URI='https://b41-we-first-webcode.netlify.app/oauth2callback';
let YOUR_REDIRECT_URI = 'http://localhost:5000/oauth2callback'



/*
 Google oAuth Authetication starts, when SignIn button is clicked
*/
SignInButton.addEventListener('click', function() {
    oauth2SignIn()
})


/*
Create form to request access token from Google's OAuth 2.0 server.
upon successfull , we receive the access token to use google Api's to read and update the data
*/
function oauth2SignIn() {
    // Google's OAuth 2.0 endpoint for requesting an access token
    let oauth2Endpoint='https://accounts.google.com/o/oauth2/v2/auth';

    // creating the form element to open OAuth 2.0 endpoint in new window.
    let form=document.createElement('form');
    form.setAttribute('method', 'GET'); // Send as a GET request.
    form.setAttribute('action', oauth2Endpoint);

    // Parameters to pass to OAuth 2.0 endpoint.
    let params={
        'client_id': YOUR_CLIENT_ID,
        'redirect_uri': YOUR_REDIRECT_URI,
        'scope': 'https://www.googleapis.com/auth/youtube.force-ssl',
        'state': 'try_sample_request',
        'include_granted_scopes': 'true',
        'response_type': 'token'
    };

    // Add form parameters as hidden input values.
    for(let p in params) {
        let input=document.createElement('input');
        input.setAttribute('type', 'hidden');
        input.setAttribute('name', p);
        input.setAttribute('value', params[p]);
        form.appendChild(input);
    }

    // Add form to page and submit it to open the OAuth 2.0 endpoint.
    document.body.appendChild(form);
    form.submit();
}