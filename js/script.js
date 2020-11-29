const init = function(){

    document.querySelector(".js-refresh").addEventListener("click", function(){
        document.querySelector(".js-refresh").style.animation = "refresh 1s"

        setTimeout(function () {
            document.querySelector(".js-refresh").style.animation = ""
            getStreams();
            getLiveChannels();
            getCategories();
        }, 1000);
    })

    document.querySelector(".js-darkmodebutton").addEventListener("click", function(){
        setTimeout(function(){
            document.getElementById("js-darkmode").classList.add('c-dark');
            document.getElementById("js-lightmodeicon").classList.add('o-hide-accessible');
            document.getElementById('js-darkmodeicon').classList.remove('o-hide-accessible');
        }, 500);
        
    })

    document.querySelector(".js-lightmodebutton").addEventListener("click", function(){
        setTimeout(function(){
            document.getElementById('js-darkmode').classList.remove('c-dark');
            document.getElementById('js-darkmodeicon').classList.add('o-hide-accessible');
            document.getElementById('js-lightmodeicon').classList.remove('o-hide-accessible');

        }, 500);

    })

    getStreams();
    getLiveChannels();
    getCategories();
};

const getLiveChannels = function(){
    fetch("https://api.twitch.tv/kraken/streams/summary", {headers: {'Client-Id': 'ax1wpua2jp4np4p8azvnn9zhqg2mxy', 'Authorization': 'Bearer t8c1v6qcbh8aym9s6s73pv3o1byqy1', 'Accept': 'application/vnd.twitchtv.v5+json'}})
	.then(res => res.json())
	.then(data => {
        console.log(data)
        liveViewers = data["viewers"]
        liveChannels = data["channels"]
        html_liveViewers.innerHTML = liveViewers;
        html_liveChannels.innerHTML = liveChannels
    });    
}

const getTrendingChannels = function(streamsData){
    const table = document.querySelector(".js-trendingchannels");
    let tableHTML = ``
    for(i=0; i<3; i++){
        channel = streamsData[i]["channel"]
        userName = channel["display_name"];
        image = channel["logo"]
        gameName = streamsData[i]["game"];
        viewers = streamsData[i]["viewers"];
        console.log(userName);
        console.log(gameName);
        console.log(image)
        tableHTML += `
        <div class="c-card">
            <div class="c-cardview">
                <div class="c-cardview__image-container">
                    <img class="c-cardview__image" src="${image}" alt="Channel Image">
                </div>
                <div>
                    <h3>
                        ${userName}
                    </h3>
                    <h5>
                        Playing: ${gameName}
                    </h5>
                </div>
                <div>
                    <h4>
                        ${viewers} viewers
                    </h4>
                </div>
            </div>
        </div>
        `
    }
    table.innerHTML = tableHTML;
};

const getTrendingCategories = function(categoriesData){
    const table = document.querySelector(".js-trendingcategories");
    let tableHTML = ``
    for(i=0; i<3; i++){
        category = categoriesData[i]["game"]
        categoryName = category["name"];
        images = category["box"]
        image = images["medium"]

        viewers = categoriesData[i]["viewers"]
        tableHTML += `
        <div class="c-card">
            <div class="c-cardview">
                <div class="c-cardview__image-container">
                    <img class="c-cardview__image" src="${image}" alt="Channel Image">
                </div>
                <div>
                    <h3>
                        ${categoryName}
                    </h3>
                </div>
                <div>
                    <h4>
                        ${viewers} viewers
                    </h4>
                </div>
            </div>
        </div>
        `
    }
    table.innerHTML = tableHTML;
};

const getStreams = function(){
    fetch("https://api.twitch.tv/kraken/streams/", {headers: {'Client-Id': 'ax1wpua2jp4np4p8azvnn9zhqg2mxy', 'Authorization': 'Bearer t8c1v6qcbh8aym9s6s73pv3o1byqy1', 'Accept': 'application/vnd.twitchtv.v5+json'}})
	.then(res => res.json())
	.then(data => {
		console.log(data);
        streamsData = data["streams"];
        getTrendingChannels(streamsData);
	});
     
};

const getCategories = function() {
    fetch("https://api.twitch.tv/kraken/games/top", {headers: {'Client-Id': 'ax1wpua2jp4np4p8azvnn9zhqg2mxy', 'Authorization': 'Bearer t8c1v6qcbh8aym9s6s73pv3o1byqy1', 'Accept': 'application/vnd.twitchtv.v5+json'}})
	.then(res => res.json())
	.then(data => {
		console.log(data);
        categoriesData = data["top"];
        getTrendingCategories(categoriesData);
	});
}

const getDOMElements = function () {
    html_liveViewers = document.querySelector(".js-liveviewers");
    html_liveChannels = document.querySelector(".js-livechannels");
};

document.addEventListener("DOMContentLoaded", () => {
    getDOMElements();
    init();
});