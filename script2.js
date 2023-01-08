let fragmentString=location.hash.substring(1);
var params={};
var regex=/([^&=]+)=([^&]*)/g, m;
while(m=regex.exec(fragmentString)) {
    params[decodeURIComponent(m[1])]=decodeURIComponent(m[2]);
}
if(Object.keys(params).length>0) {
    localStorage.setItem('oauth2-test-params', JSON.stringify(params));
    // if(params['state']&&params['state']=='try_sample_request') {
    //     console.log('if statement is true');
    //     }
}

let ApiKey='AIzaSyDXE82uTxUA2O9Vk6Gehwt5zKNySUjwA_w'


/* 
=================================== Reterive Channel Information ===================================================
*/
let ChannelInfoArray = []
let ChannelID
const fetchChannelInfo=async () => {
    let params=JSON.parse(localStorage.getItem('oauth2-test-params'));
    const url=`https://youtube.googleapis.com/youtube/v3/channels?part=snippet%2CcontentDetails%2Cstatistics%2CcontentOwnerDetails%2Clocalizations%2Cstatus&mine=true&key=${ApiKey}`
    const response=await fetch(url, {
        headers: {
            Authorization: `Bearer ${params['access_token']}`,
            Accept: "application/json"
        }
    })
    let result=await response.json()
    ChannelID=result.items[0].id
    ChannelInfoArray = [...result.items]
    console.log('ChannelInfo = ', result)
    renderChannelInfo(ChannelInfoArray)
    fetchUserPlaylists(ChannelID)
    fetchUserSubscriptions(ChannelID)
    fetchUserActivities(ChannelID)
    fetchTopicBasedSearch("soccer")
    fetchTopicBasedPlaylistSearch("news")
}

fetchChannelInfo()

const renderChannelInfo=(data) => {
    let ChannelInfoDiv=document.getElementById('ChannelInfoDiv')
    ChannelInfoDiv.innerHTML=''
    data.map((element) => {
         let colDiv=document.createElement('div')
        colDiv.classList.add('col', 'my-2')
            colDiv.innerHTML=  `<div class="card h-100">
                            <img src=${element.snippet.thumbnails.medium.url} class="card-img-top rounded my-1" alt='${element.snippet.title}'>
                            <div class="card-body text-center">
                                <h5 class="card-title">${element.snippet.title}</h5>
                                ${element.snippet.description!==""?`<p class="card-text">${element.snippet.description}</p>`:''}
                                <ul class="list-group list-group-flush">
                                    <li class="list-group-item"><span>ChannelID</span> : ${element.id}</li>
                                    <li class="list-group-item"><span>CustomUrl</span> : ${element.snippet.customUrl}</li>
                                    <li class="list-group-item"><span>PublishedAt</span> : ${new Date(element.snippet.publishedAt).toLocaleString()}</li>
                                    <li class="list-group-item"><span>Subscribers</span> : ${element.statistics.subscriberCount}</li>
                                    <li class="list-group-item"><span>VideoCount</span> : ${element.statistics.videoCount}</li>
                                    <li class="list-group-item"><span>VideoCount</span> : ${element.statistics.viewCount}</li>
                                </ul>
                            </div>
                        </div>`
            ChannelInfoDiv.append(colDiv)
    })
}




/* 
=================================== Reterive uses's playlist Information ===================================================
*/


let UserPlaylistsArray=[]
let pillsUsersPlaylistsTab=document.getElementById('pills-UsersPlaylists-tab')

pillsUsersPlaylistsTab.addEventListener('click', function(event) {
    renderUserPlaylists(UserPlaylistsArray)
})


const fetchUserPlaylists=async (channelID) => {
    let params=JSON.parse(localStorage.getItem('oauth2-test-params'));
    const url=`https://youtube.googleapis.com/youtube/v3/playlists?part=snippet%2CcontentDetails%2Cplayer&channelId=${channelID}&maxResults=50&key=${ApiKey}`
    const response=await fetch(url, {
        headers: {
            Authorization: `Bearer ${params['access_token']}`,
            Accept: "application/json"
        }
    })
    let result=await response.json()
    UserPlaylistsArray = [...result.items]
    console.log('UserPlaylists = ', result)
}

const renderUserPlaylists=(data) => {
     let UsersPlaylistsDiv=document.getElementById('UsersPlaylistsDiv')
    UsersPlaylistsDiv.innerHTML=''
    data.map((element,playListIndex) => {
         let colDiv=document.createElement('div')
        colDiv.classList.add('col', 'my-2')
        colDiv.innerHTML=  `<div class="card text-center">
                        <img src=${element.snippet.thumbnails.medium.url} class="card-img-top" alt=${element.snippet.title}>
                        <div class="card-body">
                            <h5 class="card-title" id="card-title-${element.id}">${element.snippet.title}</h5>
                            <input class="form-control" style="display:none;" id="playlist-title-input-${element.id}" value="${element.snippet.title}" >
                             <input class="form-control" style="display:none;" id="playlist-desc-input-${element.id}" value="${element.snippet.description}">
                                <ul class="list-group list-group-flush">
                                    <li class="list-group-item"><span>PlaylistID</span> : ${element.id}</li>
                                    <li class="list-group-item"><span>PublishedAt</span> : ${new Date(element.snippet.publishedAt).toLocaleString()}</li>
                                    <li class="list-group-item"><span>PlaylistContent</span> : ${element.contentDetails.itemCount}</li>
                                     <li class="list-group-item">
                                        <button class="btn btn-primary" id="edit-${element.id}" onclick="startEditPlayList('${element.id}')">Edit</button>
                                     </li>
                                      <li class="list-group-item">
                                        <button class="btn btn-danger" id="delete-${element.id}" onclick="deletePlayList('${element.id}')">Delete</button>
                                      </li>
                                      <li class="list-group-item">
                                        <button class="btn btn-secondary" id="cancel-${element.id}" style="display:none;" onclick="cancelEditPlayList('${element.id}')">Cancel</button>
                                      </li>
                                      <li class="list-group-item">
                                        <button class="btn btn-success" id="save-${element.id}" style="display:none;" onclick="updatePlayList('${element.id}', ${playListIndex})">Save</button>
                                      </li>
                                </ul>
                        </div>
                    </div>`
            UsersPlaylistsDiv.append(colDiv)
    })
}


/* 
=================================== Reterive user's subscription Information ===================================================
*/


let UserSubscriptionArray=[]
let pillsUserSubscriptionTab=document.getElementById('pills-UserSubscription-tab')

pillsUserSubscriptionTab.addEventListener('click', function() {
    renderUserSubScriptions(UserSubscriptionArray)
})


const fetchUserSubscriptions=async (channelID) => {
    let params=JSON.parse(localStorage.getItem('oauth2-test-params'));
    const url=`https://youtube.googleapis.com/youtube/v3/subscriptions?part=snippet%2CcontentDetails&channelId=${channelID}&maxResults=50&key=${ApiKey}`
    const response=await fetch(url, {
        headers: {
            Authorization: `Bearer ${params['access_token']}`,
            Accept: "application/json"
        }
    })
    let result=await response.json()
    UserSubscriptionArray = [...result.items]
    console.log('UserSubScriptions = ', result)
}


const renderUserSubScriptions=(data) => {
    let UsersSubscriptionsDiv=document.getElementById('UsersSubscriptionsDiv')
    UsersSubscriptionsDiv.innerHTML=''
    data.map((element) => {
         let colDiv=document.createElement('div')
        colDiv.classList.add('col', 'my-2')
            colDiv.innerHTML=  `<div class="card text-center">
                        <img src=${element.snippet.thumbnails.medium.url} class="card-img-top" alt=${element.snippet.title}>
                        <div class="card-body">
                            <h5 class="card-title">${element.snippet.title}</h5>
                                <ul class="list-group list-group-flush">
                                    <li class="list-group-item"><span>ChannelID</span> : ${element.snippet.resourceId?.channelId}</li>
                                    <li class="list-group-item"><span>Subscribed Date</span> : ${new Date(element.snippet.publishedAt).toLocaleString()}</li>
                                    <li class="list-group-item"><span>TotalItemCount</span> : ${element.contentDetails.totalItemCount}</li>
                                </ul>
                        </div>
                    </div>`
            UsersSubscriptionsDiv.append(colDiv)
    })
}


/* 
=================================== Reterive user's Activity Information ===================================================
*/

let UserChannelActivityArray=[]
let pillsUserActivitesTab = document.getElementById('pills-UserActivites-tab')

pillsUserActivitesTab.addEventListener('click', function() {
    renderUserActivity(UserChannelActivityArray)
})


const fetchUserActivities=async (channelID) => {
    let params=JSON.parse(localStorage.getItem('oauth2-test-params'));
    const url=`https://youtube.googleapis.com/youtube/v3/activities?part=snippet%2CcontentDetails&channelId=${channelID}&maxResults=45&key=${ApiKey}`
    const response=await fetch(url, {
        headers: {
            Authorization: `Bearer ${params['access_token']}`,
            Accept: "application/json"
        }
    })
    let result=await response.json()
    UserChannelActivityArray = [...result.items]
    console.log('UserActivities = ', result)
}


const renderUserActivity=(data) => {
    let UsersChannelActivityDiv=document.getElementById('UsersChannelActivityDiv')
    UsersChannelActivityDiv.innerHTML=''
    data.map((element) => {
         let colDiv=document.createElement('div')
        colDiv.classList.add('col', 'my-2')
            colDiv.innerHTML=  `<div class="card text-center">
                        <img src='${element.snippet.thumbnails.medium.url}' class="card-img-top" alt='${element.snippet.channelTitle}'>
                        <div class="card-body">
                            <h5 class="card-title">${element.snippet.channelTitle}</h5>
                                <ul class="list-group list-group-flush">
                                    <li class="list-group-item"><span>ChannelID</span> : ${element.contentDetails.subscription.resourceId.channelId}</li>
                                    <li class="list-group-item"><span>Activity Date</span> : ${new Date(element.snippet.publishedAt).toLocaleString()}</li>
                                    <li class="list-group-item"><span>Activity Type</span> : ${element.snippet.type}</li>
                                </ul>
                        </div>
                    </div>`
            UsersChannelActivityDiv.append(colDiv)
    })
}


/* 
=================================== Reterive topic based search Information ===================================================
*/

let TopicBasedSearchArray=[]
let pillsTopicBasedSearchTab=document.getElementById('pills-TopicBasedSearch-tab')
let TopicBasedSearchInput=document.getElementById('TopicBasedSearchInput')
let TopicBasedSearchButton=document.getElementById('TopicBasedSearchButton')

TopicBasedSearchButton.addEventListener('click', function(event) {
    event.preventDefault()
    console.log(TopicBasedSearchInput.value);
    fetchTopicBasedSearch(TopicBasedSearchInput.value)
    TopicBasedSearchInput.value = ''
})

pillsTopicBasedSearchTab.addEventListener('click', function() {
  fetchTopicBasedSearch('RRR')   
})


const fetchTopicBasedSearch=async (querySearch) => {
    let params=JSON.parse(localStorage.getItem('oauth2-test-params'));
    const url=`https://youtube.googleapis.com/youtube/v3/search?part=snippet&maxResults=25&q=${querySearch}&key=${ApiKey}`
    const response=await fetch(url, {
        headers: {
            Authorization: `Bearer ${params['access_token']}`,
            Accept: "application/json"
        }
    })
    let result=await response.json()
    TopicBasedSearchArray = [...result.items]
    console.log('TopicBasedSearch = ', result)
    renderTopicBasedSearch(TopicBasedSearchArray)
}


const renderTopicBasedSearch=(data) => {
    let TopicBasedSearchDiv=document.getElementById('TopicBasedSearchDiv')
    TopicBasedSearchDiv.innerHTML=''
    data.map((element) => {
         let colDiv=document.createElement('div')
        colDiv.classList.add('col', 'my-2')
            colDiv.innerHTML=  `<div class="card text-center">
                        <div class="card-body">
                            <h5 class="card-title">${element.snippet.title}</h5>
                                <ul class="list-group list-group-flush">
                                    <li class="list-group-item"><span>VideoID</span> : ${element.id.videoId}</li>
                                    <li class="list-group-item"><span>Published Date</span> : ${new Date(element.snippet.publishedAt).toLocaleString()}</li>
                                    <li class="list-group-item"><span>ChannelID</span> : ${element.snippet.channelId}</li>
                                </ul>
                        </div>
                    </div>`
            TopicBasedSearchDiv.append(colDiv)
    })
}



/* 
=================================== Reterive topic based playlist search Information ===================================================
*/

let TopicBasedSearchPlaylistArray=[]
let pillsTopicBasedPlaylistSearchTab=document.getElementById('pills-TopicBasedPlaylistSearch-tab')
let TopicBasedPlaylistSearchInput=document.getElementById('TopicBasedPlaylistSearchInput')
let TopicBasedPlaylistSearchButton=document.getElementById('TopicBasedPlaylistSearchButton')

TopicBasedPlaylistSearchButton.addEventListener('click', function(event) {
    event.preventDefault()
    console.log(TopicBasedPlaylistSearchInput.value);
    fetchTopicBasedPlaylistSearch(TopicBasedPlaylistSearchInput.value)
    TopicBasedPlaylistSearchInput.value = ''
})


pillsTopicBasedPlaylistSearchTab.addEventListener('click', function() {
    fetchTopicBasedPlaylistSearch('songs')
})

const fetchTopicBasedPlaylistSearch=async (querySearch) => {
    let params=JSON.parse(localStorage.getItem('oauth2-test-params'));
    const url=`https://youtube.googleapis.com/youtube/v3/search?part=snippet&maxResults=25&q=${querySearch}&type=playlist&key=${ApiKey}`
    const response=await fetch(url, {
        headers: {
            Authorization: `Bearer ${params['access_token']}`,
            Accept: "application/json"
        }
    })
    let result=await response.json()
    TopicBasedSearchPlaylistArray = [...result.items]
    console.log('TopicBasedPlaylistSearch = ', result)
    renderTopicBasedPlaylistSearch(TopicBasedSearchPlaylistArray)
}


const renderTopicBasedPlaylistSearch=(data) => {
    let TopicBasedPlaylistSearchDiv=document.getElementById('TopicBasedPlaylistSearchDiv')
    TopicBasedPlaylistSearchDiv.innerHTML=''
    data.map((element) => {
         let colDiv=document.createElement('div')
        colDiv.classList.add('col', 'my-2')
            colDiv.innerHTML=  `<div class="card text-center">
                        <div class="card-body">
                            <h5 class="card-title">${element.snippet.title}</h5>
                            <ul class="list-group list-group-flush">
                                    <li class="list-group-item"><span>PlaylistID</span> : ${element.id.playlistId}</li>
                                    <li class="list-group-item"><span>Published Date</span> : ${new Date(element.snippet.publishedAt).toLocaleString()}</li>
                                    <li class="list-group-item"><span>ChannelID</span> : ${element.snippet.channelId}</li>
                                </ul>
                        </div>
                    </div>`
            TopicBasedPlaylistSearchDiv.append(colDiv)
    })
}



/* 
=================================== Create Playlist Information ===================================================
*/


let PlayListCreateForm=document.getElementById('playlist-create')
let pillsCreatePlaylistTab=document.getElementById('pills-CreatePlaylist-tab')
let UsersPlaylistModify = document.getElementById('UsersPlaylistModify')

pillsCreatePlaylistTab.addEventListener('click', function() {
    UsersPlaylistModify.style.display='block';
})

const displayCreatedPlaylist=() => {
    pillsCreatePlaylistTab.classList.remove('active', 'show')
    pillsCreatePlaylistTab.ariaSelected = "false"
    let pillsCreatePlaylist=document.getElementById('pills-CreatePlaylist')
    pillsCreatePlaylist.classList.remove('active')

    let pillsUsersPlaylists=document.getElementById('pills-UsersPlaylists')
    pillsUsersPlaylists.classList.add('active', 'show')
    let pillsUsersPlayliststab=document.getElementById('pills-UsersPlaylists-tab')
    pillsUsersPlayliststab.classList.add('active')
    pillsUsersPlayliststab.ariaSelected = "true"
}

PlayListCreateForm.addEventListener('submit', async e => {
    e.preventDefault();
    const formData = new FormData(PlayListCreateForm);
    console.log(formData)
    for(const formKeyVal of formData.entries()) {
        console.log(formKeyVal[0], formKeyVal[1])
    }
    const response = await createPlayList(ChannelID, {title: formData.get('playlist-title'), description: formData.get('playlist-description')}) 
    const result=await response.json()
    console.log('create playlist result = ',result)
    UserPlaylistsArray.unshift(result)
    displayCreatedPlaylist()
    renderUserPlaylists(UserPlaylistsArray)
})


const startEditPlayList = elementId => {
    togglePlayListUpdate(elementId, true)
    resetPlayListInputValues(elementId)
}

const cancelEditPlayList = elementId => {
    togglePlayListUpdate(elementId)
    resetPlayListInputValues(elementId)
}


const togglePlayListUpdate = (elementId, edit) => {
    const editEle = document.querySelector(`#edit-${elementId}`)
    const deleteEle = document.querySelector(`#delete-${elementId}`)
    const cancelEle = document.querySelector(`#cancel-${elementId}`)
    const saveEle = document.querySelector(`#save-${elementId}`)
    const playListTitle = document.querySelector(`#card-title-${elementId}`)
    const playListTitleInput = document.querySelector(`#playlist-title-input-${elementId}`)
    //const playListDesc = document.querySelector(`#card-desc-${elementId}`)
    const playListDescInput = document.querySelector(`#playlist-desc-input-${elementId}`)
    editEle.style.display = edit ? 'none' : 'block'
    deleteEle.style.display = edit ? 'none' : 'block'
    cancelEle.style.display = edit ? 'block' : 'none'
    saveEle.style.display = edit ? 'block' : 'none'
    playListTitle.style.display = edit ? 'none' : 'block'
    playListTitleInput.style.display = edit ? 'block' : 'none'
    //playListDesc.style.display = edit ? 'none' : 'block'
    playListDescInput.style.display = edit ? 'block' : 'none'
}

const resetPlayListInputValues = elementId => {
    const playListTitleInput = document.querySelector(`#playlist-title-input-${elementId}`)
    const playListDescInput = document.querySelector(`#playlist-desc-input-${elementId}`)
    const playListObj = UserPlaylistsArray.find((playList) => playList.id === elementId)
    playListTitleInput.value = playListObj.snippet.title
    playListDescInput.value = playListObj.snippet.description
}


const createPlayList = async (channelId, playListData) => {
    let params=JSON.parse(localStorage.getItem('oauth2-test-params'));
    const url=`https://youtube.googleapis.com/youtube/v3/playlists?part=snippet%2CcontentDetails%2Cplayer&channelId=${channelId}&key=${ApiKey}`
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


const updatePlayList = async (playListId, playListIndex) => {
    const playListTitleInput = document.querySelector(`#playlist-title-input-${playListId}`)
    const playListDescInput = document.querySelector(`#playlist-desc-input-${playListId}`)
    const updatedTitle = playListTitleInput.value;
    const updatedDescription = playListDescInput.value;
    togglePlayListUpdate(playListId)
    let params=JSON.parse(localStorage.getItem('oauth2-test-params'));
    const url=`https://youtube.googleapis.com/youtube/v3/playlists?part=snippet%2CcontentDetails%2Cplayer%2Cid&channelId=${ChannelID}&key=${ApiKey}`
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
    const result = await response.json()
    UserPlaylistsArray[playListIndex] = result;
    renderUserPlaylists(UserPlaylistsArray)
}


const deletePlayList = async (elementId) => {
    const url = 'https://www.googleapis.com/youtube/v3/playlists'
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
        UserPlaylistsArray = UserPlaylistsArray.filter(playListObj => playListObj.id !== elementId)
        renderUserPlaylists(UserPlaylistsArray)
        return;
    }
    console.warn("Deleting playlist failed")
}













































