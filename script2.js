/*
below code is used to reterive access token from response url
*/

let fragmentString=location.hash.substring(1);
let params={};
let regex=/([^&=]+)=([^&]*)/g, m;
while(m=regex.exec(fragmentString)) {
    params[decodeURIComponent(m[1])]=decodeURIComponent(m[2]);
}
if(Object.keys(params).length>0) {
    // storing the access token in localstoarge of window browser
    localStorage.setItem('oauth2-test-params', JSON.stringify(params));
}

let ApiKey='AIzaSyDXE82uTxUA2O9Vk6Gehwt5zKNySUjwA_w';


/* 
=================================== Reterive Channel Information ===================================================
*/


let ChannelInfoArray=[];
let ChannelID;

/* 
Below function fetches the user's(your's) youtube channel information 
*/
const fetchChannelInfo=async () => {
    let params=JSON.parse(localStorage.getItem('oauth2-test-params'));
    const url=`https://youtube.googleapis.com/youtube/v3/channels?part=snippet%2CcontentDetails%2Cstatistics%2CcontentOwnerDetails%2Clocalizations%2Cstatus&mine=true&key=${ApiKey}`;
    // fetching the channel info youtube api
    const response=await fetch(url, {
        headers: {
            Authorization: `Bearer ${params['access_token']}`,
            Accept: "application/json"
        }
    })
    // converting the response to json format
    let result=await response.json();
    ChannelID=result.items[0].id;
    // storing the json format result in an array for futher use
    ChannelInfoArray=[...result.items];
    console.log('ChannelInfo = ', result);
    //display the user's channel information into the web page
    renderChannelInfo(ChannelInfoArray);
    fetchUserPlaylists(ChannelID);
    fetchUserSubscriptions(ChannelID);
    fetchUserActivities(ChannelID);
    fetchTopicBasedSearch("soccer");
    fetchTopicBasedPlaylistSearch("news");
}

/*
function is called to fetch user's channel information
*/

fetchChannelInfo()

// Below function takes the user's channel information data
// displays on the web page
const renderChannelInfo=(data) => {
    let ChannelInfoDiv=document.getElementById('ChannelInfoDiv');
    ChannelInfoDiv.innerHTML='';
    data.map((element) => {
        let colDiv=document.createElement('div');
        colDiv.classList.add('col-12', 'my-2');
        colDiv.innerHTML = ` <div class="card mb-3 bg-dark cardChannelInfoDiv">
                            <div class="row g-0">
                                <div class="col-md-4">
                                        <img src="${element.snippet.thumbnails.medium.url}"
                                            class="img-fluid rounded-start rounded-end" alt='${element.snippet.title}'>
                                </div>
                                <div class="col">
                                    <div class="card-body">
                                        <h2 class="card-title">${element.snippet.title}</h2>
                                        <div class="card-text table-responsive">
                                            <table class="table table-sm">
                                                <tbody>
                                                    <tr>
                                                        <th scope="row">ChannelID</th>
                                                        <td>${element.id}</td>
                                                    </tr>
                                                    <tr>
                                                        <th scope="row">CustomUrl</th>
                                                        <td>${element.snippet.customUrl}</td>
                                                    </tr>
                                                    <tr>
                                                        <th scope="row">Join At</th>
                                                        <td>${new Date(element.snippet.publishedAt).toLocaleString().split(',')[0]}</td>
                                                    </tr>
                                                    <tr>
                                                        <th scope="row">Subscribers</th>
                                                        <td>${element.statistics.subscriberCount}</td>
                                                    </tr>
                                                    <tr>
                                                        <th scope="row">VideoCount</th>
                                                        <td>${element.statistics.videoCount}</td>
                                                    </tr>
                                                    <tr>
                                                        <th scope="row">ViewCount</th>
                                                        <td>${element.statistics.viewCount}</td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>`
        ChannelInfoDiv.append(colDiv);
    })
}




/* 
=================================== Reterive uses's playlist Information ===================================================
*/


let UserPlaylistsArray=[];
let UserPlaylistsItemsArray = []
let pillsUsersPlaylistsTab=document.getElementById('pills-UsersPlaylists-tab');

// user's youtube channel playlists are display on the webpage
// if and only if , user clicks the "UsersPlaylist Button" in navbar
pillsUsersPlaylistsTab.addEventListener('click', function(event) {
    renderUserPlaylists(UserPlaylistsArray);
})

// Below function fetches users youtube channel playlist data

const fetchUserPlaylists=async (channelID) => {
    let params=JSON.parse(localStorage.getItem('oauth2-test-params'));
    const url=`https://youtube.googleapis.com/youtube/v3/playlists?part=snippet%2CcontentDetails%2Cplayer&channelId=${channelID}&maxResults=50&key=${ApiKey}`;
    // fetching the user's youtube channel playlist data
    const response=await fetch(url, {
        headers: {
            Authorization: `Bearer ${params['access_token']}`,
            Accept: "application/json"
        }
    })
    //converting the response to json format
    let result=await response.json();
    // storing the result into an array for futher use
    UserPlaylistsArray=[...result.items];
    console.log('UserPlaylists = ', result);
}


//below function takes user's playlist data
// and displays on the webpage
const renderUserPlaylists=(data) => {
    let UsersPlaylistsDiv=document.getElementById('UsersPlaylistsDiv');
    UsersPlaylistsDiv.innerHTML='';
    data.map(async (element, playListIndex) => {
            let params=JSON.parse(localStorage.getItem('oauth2-test-params'));
            const url=`https://youtube.googleapis.com/youtube/v3/playlistItems?part=contentDetails%2Csnippet&playlistId=${element.id}&key=${ApiKey}`;
            // fetching the user's youtube channel playlist data
            const response=await fetch(url, {
                headers: {
                    Authorization: `Bearer ${params['access_token']}`,
                    Accept: "application/json"
                }
            })
            //converting the response to json format
            let result=await response.json();
            // storing the result into an array for futher use
        let playlistObj=await result.items.find((ele) => {
            return ele.snippet.playlistId === element.id
        })
        let colDiv=document.createElement('div');
        colDiv.classList.add('col', 'my-2');
        colDiv.innerHTML=`<div class="card bg-dark">
                            <a href="https://www.youtube.com/watch?v=${playlistObj?.snippet.resourceId.videoId}&list=${element?.id}&start_radio=1" target="_blank">
                                <img src="${element?.snippet.thumbnails.medium.url}" class="card-img-top" alt=${element.snippet.title}>
                            </a>
                            <div class="card-body">
                                <h5 class="card-title" id="card-title-${element.id}">${element.snippet.title}</h5>
                                <div class="d-flex justify-content-between">
                                    <h6 class="card-subtitle mb-2">Content:${element?.contentDetails.itemCount}</h6>
                                    <h6 class="card-subtitle mb-2">Date:${new Date(element?.snippet.publishedAt).toLocaleString().split(',')[0]}</h6>
                                </div>
                                <div class="d-flex justify-content-around mb-2">
                                    <button type="button" id="edit-${element.id}" data-bs-toggle="modal" data-bs-target="#PlaylistEditModal" onclick="startEditPlayList('${element.id}',${playListIndex},'${element.snippet.title}','${element.snippet.description}')" class="btn btn-outline-primary btn-sm">Edit</button>
                                    <button type="button" id="delete-${element.id}" onclick="deletePlayList('${element.id}')" class="btn btn-outline-danger btn-sm">Delete</button>
                                </div>
                            </div>
                        </div>`;
        // colDiv.innerHTML=`<div class="card text-center">
        //                 <img src=${element.snippet.thumbnails.medium.url} class="card-img-top" alt=${element.snippet.title}>
        //                 <div class="card-body">
        //                     <h5 class="card-title" id="card-title-${element.id}">${element.snippet.title}</h5>
        //                     <input class="form-control" style="display:none;" id="playlist-title-input-${element.id}" value="${element.snippet.title}" >
        //                      <input class="form-control" style="display:none;" id="playlist-desc-input-${element.id}" value="${element.snippet.description}">
        //                         <ul class="list-group list-group-flush">
        //                             <li class="list-group-item"><span>PlaylistID</span> : ${element.id}</li>
        //                             <li class="list-group-item"><span>PublishedAt</span> : ${new Date(element.snippet.publishedAt).toLocaleString()}</li>
        //                             <li class="list-group-item"><span>PlaylistContent</span> : ${element.contentDetails.itemCount}</li>
        //                              <li class="list-group-item">
        //                                 <button class="btn btn-primary" id="edit-${element.id}" onclick="startEditPlayList('${element.id}')">Edit</button>
        //                              </li>
        //                               <li class="list-group-item">
        //                                 <button class="btn btn-danger" id="delete-${element.id}" onclick="deletePlayList('${element.id}')">Delete</button>
        //                               </li>
        //                               <li class="list-group-item">
        //                                 <button class="btn btn-secondary" style="display:none;" id="cancel-${element.id}" onclick="cancelEditPlayList('${element.id}')">Cancel</button>
        //                               </li>
        //                               <li class="list-group-item">
        //                                 <button class="btn btn-success" style="display:none;" id="save-${element.id}" onclick="updatePlayList('${element.id}', ${playListIndex})">Save</button>
        //                               </li>
        //                         </ul>
        //                 </div>
        //             </div>`;
        UsersPlaylistsDiv.append(colDiv);
    })
}


/* 
=================================== Reterive user's subscription Information ===================================================
*/


let UserSubscriptionArray=[];
let pillsUserSubscriptionTab=document.getElementById('pills-UserSubscription-tab');

//user's youtube channel subscriptions are displayed on the webpage
//if and only if, user clicks "Subscribers Info" button in navbar
pillsUserSubscriptionTab.addEventListener('click', function() {
    renderUserSubScriptions(UserSubscriptionArray);
})

/*
Below function fetches user's youtube channel subscriptions information
*/
const fetchUserSubscriptions=async (channelID) => {
    let params=JSON.parse(localStorage.getItem('oauth2-test-params'));
    const url=`https://youtube.googleapis.com/youtube/v3/subscriptions?part=snippet%2CcontentDetails&channelId=${channelID}&maxResults=50&key=${ApiKey}`;
    // fetching the user's youtube channel subscriptions data
    const response=await fetch(url, {
        headers: {
            Authorization: `Bearer ${params['access_token']}`,
            Accept: "application/json"
        }
    })
    // converting the response to json format
    let result=await response.json();
    UserSubscriptionArray=[...result.items];
    console.log('UserSubScriptions = ', result);
}

/*
Below function takes user's channel subscriptions data
and displays onto the webpage
*/
const renderUserSubScriptions=(data) => {
    let UsersSubscriptionsDiv=document.getElementById('UsersSubscriptionsDiv');
    UsersSubscriptionsDiv.innerHTML='';
    data.map((element) => {
        let title=element.snippet.title
        let colDiv=document.createElement('div');
        colDiv.classList.add('col', 'my-2');
        colDiv.innerHTML = ` <div class="card bg-dark cardSubscriptionDiv" >
                            <a href="https://www.youtube.com/@${title.split(' ').join('')}" target="_blank">
                                <img src="${element.snippet.thumbnails.medium.url}" class="card-img-top"
                                    alt='${element.snippet.title}'>
                            </a>
                            <div class="card-body text-center">
                                <h5 class="card-title">${element.snippet.title}</h5>
                                    <h6 class="card-subtitle mb-2">Content:${element.contentDetails.totalItemCount}</h6>
                                    <h6 class="card-subtitle mb-2">Date:${new Date(element.snippet.publishedAt).toLocaleString().split(',')[0]}</h6>
                            </div>
                        </div>`
        UsersSubscriptionsDiv.append(colDiv);
    })
}


/* 
=================================== Reterive user's Activity Information ===================================================
*/

let UserChannelActivityArray=[];
let pillsUserActivitesTab=document.getElementById('pills-UserActivites-tab');

/*
    user's Activity data are displayed on the webpage, iff
    user clicks the "Activity Info" button in navbar
*/
pillsUserActivitesTab.addEventListener('click', function() {
    renderUserActivity(UserChannelActivityArray);
})

/*
    below function fetches user's Activity data
*/

const fetchUserActivities=async (channelID) => {
    let params=JSON.parse(localStorage.getItem('oauth2-test-params'));
    const url=`https://youtube.googleapis.com/youtube/v3/activities?part=snippet%2CcontentDetails&channelId=${channelID}&maxResults=45&key=${ApiKey}`;
    //fetching user's youtube channel Activity data
    const response=await fetch(url, {
        headers: {
            Authorization: `Bearer ${params['access_token']}`,
            Accept: "application/json"
        }
    })
    // converting the response to json format and storing into an array
    let result=await response.json();
    UserChannelActivityArray=[...result.items];
    console.log('UserActivities = ', result);
}

/*
below function takes user's activity data
and display onto the webpage
*/
const renderUserActivity=(data) => {
    let UsersChannelActivityDiv=document.getElementById('UsersChannelActivityDiv');
    UsersChannelActivityDiv.innerHTML='';
    data.map((element) => {
        let colDiv=document.createElement('div');
        colDiv.classList.add('col', 'my-2');
        colDiv.innerHTML = ` <div class="card bg-dark cardActivityDiv">
                                <img src="${element.snippet.thumbnails.medium.url}"
                                    class="card-img-top" alt=${element.snippet.channelTitle}>
                            <div class="card-body text-center">
                                <h5 class="card-title">${element.snippet.channelTitle}</h5>
                                <h6 class="card-subtitle mb-2">Date:${new Date(element.snippet.publishedAt).toLocaleString().split(',')[0]}</h6>
                                <h6 class="card-subtitle mb-2">Type: ${element.snippet.type}</h6>
                            </div>
                        </div>`
        UsersChannelActivityDiv.append(colDiv);
    })
}


/* 
=================================== Reterive topic based search Information ===================================================
*/

let TopicBasedSearchArray=[];
let pillsTopicBasedSearchTab=document.getElementById('pills-TopicBasedSearch-tab');
let TopicBasedSearchInput=document.getElementById('TopicBasedSearchInput');
let TopicBasedSearchButton=document.getElementById('TopicBasedSearchButton');

/*
    user's can access search input tag and button
    and search information,iff user click the "serach" button in navbar
*/
TopicBasedSearchButton.addEventListener('click', function(event) {
    event.preventDefault();
    console.log(TopicBasedSearchInput.value);
    fetchTopicBasedSearch(TopicBasedSearchInput.value);
    TopicBasedSearchInput.value='';
})

/*
    user's can access search input tag and button
    and search information,iff user click the "serach" button in navbar
*/
pillsTopicBasedSearchTab.addEventListener('click', function() {
    fetchTopicBasedSearch('RRR');
})

/*
    below function fetches the user's search information by providing any search query
*/
const fetchTopicBasedSearch=async (querySearch) => {
    let params=JSON.parse(localStorage.getItem('oauth2-test-params'));
    const url=`https://youtube.googleapis.com/youtube/v3/search?part=snippet&maxResults=25&q=${querySearch}&key=${ApiKey}`;
    // fetches the videos,shorts,channels,playlists according to the search query we provided
    const response=await fetch(url, {
        headers: {
            Authorization: `Bearer ${params['access_token']}`,
            Accept: "application/json"
        }
    })
    // convert the response to json format and stores in an array
    let result=await response.json();
    TopicBasedSearchArray=[...result.items];
    console.log('TopicBasedSearch = ', result);
    renderTopicBasedSearch(TopicBasedSearchArray);
}

/*
    below function takes the search query data and 
    dispalys on to the webpage
*/
const renderTopicBasedSearch=(data) => {
    let TopicBasedSearchDiv=document.getElementById('TopicBasedSearchDiv');
    TopicBasedSearchDiv.innerHTML='';
    data.map((element) => {
        let colDiv=document.createElement('div');
        colDiv.classList.add('col-12', 'my-2');
        colDiv.innerHTML = `<div class="card mb-3 bg-dark cardSearchDiv">
                            <div class="row g-0">
                                <div class="col-4">
                                    <a href="https://www.youtube.com/watch?v=${element.id.videoId}" target="_blank">
                                    <img src="${element.snippet.thumbnails.medium.url}"
                                        class="img-fluid rounded-start rounded-end" alt='${element.snippet.title}'>
                                    </a>
                                    </div>
                                <div class="col">
                                    <div class="card-body">
                                        <h5 class="card-title">${element.snippet.title}</h5>
                                        <h6 class="card-subtitle mb-2">Date:${new Date(element.snippet.publishedAt).toLocaleString().split(',')[0]}</h6>
                                        <h6 class="card-subtitle mb-2">111456 views</h6>
                                    </div>
                                </div>
                            </div>
                        </div>`
        TopicBasedSearchDiv.append(colDiv);
    })
}



/* 
=================================== Reterive topic based playlist search Information ===================================================
*/
let TopicBasedSearchPlaylistArray2 = []
let TopicBasedSearchPlaylistArray=[];
let pillsTopicBasedPlaylistSearchTab=document.getElementById('pills-TopicBasedPlaylistSearch-tab');
let TopicBasedPlaylistSearchInput=document.getElementById('TopicBasedPlaylistSearchInput');
let TopicBasedPlaylistSearchButton=document.getElementById('TopicBasedPlaylistSearchButton');

/* 
    user's can access search input tag and button
    and search for playlist information,iff user click the "serach playlist" button in navbar
*/
TopicBasedPlaylistSearchButton.addEventListener('click', function(event) {
    event.preventDefault();
    console.log(TopicBasedPlaylistSearchInput.value);
    fetchTopicBasedPlaylistSearch(TopicBasedPlaylistSearchInput.value);
    TopicBasedPlaylistSearchInput.value='';
})

/*
    user's can access search input tag and button
    and search information,iff user click the "serach" button in navbar
*/
pillsTopicBasedPlaylistSearchTab.addEventListener('click', function() {
    fetchTopicBasedPlaylistSearch('songs');
})

/*
    below function fetches the list of playlists according to the search query
*/
const fetchTopicBasedPlaylistSearch=async (querySearch) => {
    let params=JSON.parse(localStorage.getItem('oauth2-test-params'));
    const url=`https://youtube.googleapis.com/youtube/v3/search?part=snippet&maxResults=25&q=${querySearch}&type=playlist&key=${ApiKey}`;
    // fetches the playlist information according to the search query
    const response=await fetch(url, {
        headers: {
            Authorization: `Bearer ${params['access_token']}`,
            Accept: "application/json"
        }
    })
    // converts the results into json format and stores into an array
    let result=await response.json();
    TopicBasedSearchPlaylistArray=[...result.items];
    console.log('TopicBasedPlaylistSearch = ', result);
    renderTopicBasedPlaylistSearch(TopicBasedSearchPlaylistArray);
}

const fetchUserPlaylistsSearchItems=async (PlaylistId) => {
    let params=JSON.parse(localStorage.getItem('oauth2-test-params'));
    const url=`https://youtube.googleapis.com/youtube/v3/playlistItems?part=contentDetails%2Csnippet&playlistId=${PlaylistId}&key=${ApiKey}`;
     // fetching the user's youtube channel playlist data
    const response=await fetch(url, {
        headers: {
            Authorization: `Bearer ${params['access_token']}`,
            Accept: "application/json"
        }
    })
    //converting the response to json format
    let result=await response.json();
    // storing the result into an array for futher use
    TopicBasedSearchPlaylistArray2 = [...result.items];
    console.log('UserPlaylistsItem = ', TopicBasedSearchPlaylistArray2);
}
/*
    below function takes the playlists inforamtion and
    dispaly's in the web page
*/
const renderTopicBasedPlaylistSearch=async(data) => {
    let TopicBasedPlaylistSearchDiv=document.getElementById('TopicBasedPlaylistSearchDiv');
    TopicBasedPlaylistSearchDiv.innerHTML='';
    data.map(async(element, playListIndex) => {
            let params=JSON.parse(localStorage.getItem('oauth2-test-params'));
            const url=`https://youtube.googleapis.com/youtube/v3/playlistItems?part=contentDetails%2Csnippet&playlistId=${element.id.playlistId}&key=${ApiKey}`;
            // fetching the user's youtube channel playlist data
            const response=await fetch(url, {
            headers: {
                Authorization: `Bearer ${params['access_token']}`,
                Accept: "application/json"
            }
        })
        //converting the response to json format
        let result=await response.json();
        const playlistObj= await result.items.find((ele) => {
            return ele.snippet.playlistId === element.id.playlistId
        })
        console.log('playlistObj = ',playlistObj)
        let colDiv=document.createElement('div');
        colDiv.classList.add('col-12', 'my-2');
        colDiv.innerHTML = ` <div class="card mb-3 bg-dark cardPlaylistSearchDiv">
                            <div class="row g-0">
                                <div class="col-4">
                                    <a href="https://www.youtube.com/watch?v=${playlistObj?.snippet?.resourceId?.videoId}&list=${element.id.playlistId}&start_radio=1" target="_blank">
                                        <img src="${element.snippet.thumbnails.medium.url}"
                                            class="img-fluid rounded-start rounded-end" alt='${element.snippet.title}'>
                                    </a>
                                </div>
                                <div class="col">
                                    <div class="card-body">
                                        <h5 class="card-title">${element.snippet.title}</h5>
                                        <h6 class="card-subtitle mb-2">Date:${new Date(element.snippet.publishedAt).toLocaleString().split(',')[0]}</h6>
                                        <h6 class="card-subtitle mb-2">111456 views</h6>
                                    </div>
                                </div>
                            </div>
                        </div>`
        TopicBasedPlaylistSearchDiv.append(colDiv);
    })
}



/* 
=================================== Create Playlist Information ===================================================
*/


let PlayListCreateForm=document.getElementById('playlist-create');
let pillsCreatePlaylistTab=document.getElementById('pills-CreatePlaylist-tab');
let UsersPlaylistModify=document.getElementById('UsersPlaylistModify');

/*
    to create a new playlist , user has to click "create playlist" button in navbar
*/
pillsCreatePlaylistTab.addEventListener('click', function() {
    UsersPlaylistModify.style.display='block';
})

/*
    by default the form is "display : none", to access the
    form below function is required which makes the form tab to display block
    and all other tabs to display none
*/
const displayCreatedPlaylist=() => {
    pillsCreatePlaylistTab.classList.remove('active', 'show');
    pillsCreatePlaylistTab.ariaSelected="false";
    let pillsCreatePlaylist=document.getElementById('pills-CreatePlaylist');
    pillsCreatePlaylist.classList.remove('active');

    let pillsUsersPlaylists=document.getElementById('pills-UsersPlaylists');
    pillsUsersPlaylists.classList.add('active', 'show');
    let pillsUsersPlayliststab=document.getElementById('pills-UsersPlaylists-tab');
    pillsUsersPlayliststab.classList.add('active');
    pillsUsersPlayliststab.ariaSelected="true";
}

/*
    below method creates a new playlist and adds to the existing user's playlist
*/
PlayListCreateForm.addEventListener('submit', async e => {
    e.preventDefault();
    const formData = new FormData(PlayListCreateForm);
    console.log(formData);
    for(const formKeyVal of formData.entries()) {
        console.log(formKeyVal[0], formKeyVal[1]);
    }
    const response=await createPlayList(ChannelID, {title: formData.get('playlist-title'), description: formData.get('playlist-description')});
    const result=await response.json();
    console.log('create playlist result = ', result);
    UserPlaylistsArray.unshift(result);
    displayCreatedPlaylist();
    renderUserPlaylists(UserPlaylistsArray);
})
let editingPlaylistId = null
/*
    below function is used to edit the details of a particular playlist 
*/
const startEditPlayList = (elementId,elementIdIndex, elementTitle,elementDesc,) => {
    //playlistData(elementTitle,elementDesc)
    editingPlaylistId = elementId
    resetPlayListInputValues(elementId);
}



function submitPlaylistData() {
    updatePlayList(editingPlaylistId)
}

/*
    below function is used to revoke the updated playlist info and display the previous playlist info
*/
const cancelEditPlayList = elementId => {
    //togglePlayListUpdate(elementId);
    resetPlayListInputValues(elementId);
}

/*
    below function is used to toggle between the edit, delete and save , cancel buttons
*/


/*
    below function is used to reset the playlist infotmation
*/
const resetPlayListInputValues = elementId => {
    const playListTitleInput=document.querySelector(`#playlistTitle`);
    const playListDescInput=document.querySelector(`#playlistDesc`);
    const playListObj=UserPlaylistsArray.find((playList) => playList.id===elementId);
    playListTitleInput.value=playListObj.snippet.title;
    playListDescInput.value=playListObj.snippet.description;
}

/*
    below function is used to create a new playlist
*/
const createPlayList = async (channelId, playListData) => {
    let params=JSON.parse(localStorage.getItem('oauth2-test-params'));
    const url=`https://youtube.googleapis.com/youtube/v3/playlists?part=snippet%2CcontentDetails%2Cplayer&channelId=${channelId}&key=${ApiKey}`;
    const response=await fetch(url, {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${params['access_token']}`,
            Accept: "application/json"
        },
        body: JSON.stringify({
            snippet: {
                title: playListData.title,
                description: playListData.description
            }
        })
    })
    return response;
}

/*
    below function is used to update the details of existing playlist information
*/
const updatePlayList=async (playListId) => {
    let PlaylistEditModalId=document.getElementById('PlaylistEditModal');
    const playListTitleInput=document.querySelector(`#playlistTitle`);
    const playListDescInput=document.querySelector(`#playlistDesc`);
    const updatedTitle = playListTitleInput.value;
    const updatedDescription=playListDescInput.value;
    //PlaylistEditModalId.classList.remove('show');
    //PlaylistEditModalId.style.display="none";
    let params=JSON.parse(localStorage.getItem('oauth2-test-params'));
    const url=`https://youtube.googleapis.com/youtube/v3/playlists?part=snippet%2CcontentDetails%2Cplayer%2Cid&channelId=${ChannelID}&key=${ApiKey}`;
    // sends the put request along with the updated details of a particular playlist
    const response=await fetch(url, {
        method: 'PUT',
        headers: {
            Authorization: `Bearer ${params['access_token']}`,
            Accept: "application/json"
        },
        body: JSON.stringify({
            id: playListId,
            snippet: {
                title: updatedTitle,
                description: updatedDescription
            }
        })
    })
    // converts the response to json format and stores into an array
    const result=await response.json();
    const playlistIndex=await UserPlaylistsArray.findIndex((ele) => {
        return ele.id === playListId
    })
    UserPlaylistsArray[playlistIndex]=result;
    editingPlaylistId = null
    renderUserPlaylists(UserPlaylistsArray);
}

/*
    below function takes the playlist id and deletes the existing playlist
*/
const deletePlayList = async (elementId) => {
    const url='https://www.googleapis.com/youtube/v3/playlists';
    const response = await fetch(url, {
        method: 'DELETE',
        headers: {
            Authorization: `Bearer ${params['access_token']}`,
            Accept: "application/json"
        },
        body: JSON.stringify({
            id: elementId
        })
    })
    if(response.status === 204) {
        UserPlaylistsArray=UserPlaylistsArray.filter(playListObj => playListObj.id!==elementId);
        renderUserPlaylists(UserPlaylistsArray);
        return;
    }
    console.warn("Deleting playlist failed");
}














































