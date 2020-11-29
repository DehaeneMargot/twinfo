const init = function(){

    //document.querySelector(".c-refresh__holder").addEventListener("click", function(){
        // document.querySelector(".c-refresh__holder").style.transform = "rotate(30deg)"
        //document.querySelector(".c-refresh__holder").style.animation = "infinite-spinning 1s"
        //chart.data.datasets[0].data = [];
        //chart.data.labels = [];
        //chart.update();
        
        //setTimeout(function () {
            //document.querySelector(".c-refresh__holder").style.animation = ""
            //getNumbers(showData);
            // document.querySelector(".c-refresh__holder").style.transform = ""
        //}, 1000);
        
    //})

   
    console.log("😍 Works")
    //initCharts();
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
    html_userName = document.querySelector(".js-username");

    html_liveViewers = document.querySelector(".js-liveviewers");
    html_liveChannels = document.querySelector(".js-livechannels");
    html_gameName = document.querySelector(".js-gamename");
    html_gameName2 = document.querySelector(".js-gamename2");
    html_gameName3 = document.querySelector(".js-gamename3");
    html_image = document.querySelector(".js-image");
    html_image2 = document.querySelector(".js-image2");
    html_image3 = document.querySelector(".js-image2");

};

document.addEventListener("DOMContentLoaded", () => {
    getDOMElements();
    init();
});