let graph;
let chart;

const init = function(){
    toggleSearch();

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
            document.getElementById("js-lightmodelogo").classList.add('o-hide-accessible');
            document.getElementById('js-darkmodelogo').classList.remove('o-hide-accessible');
        }, 500);
        
    })

    document.querySelector(".js-lightmodebutton").addEventListener("click", function(){
        setTimeout(function(){
            document.getElementById('js-darkmode').classList.remove('c-dark');
            document.getElementById('js-darkmodeicon').classList.add('o-hide-accessible');
            document.getElementById('js-lightmodeicon').classList.remove('o-hide-accessible');
            document.getElementById('js-darkmodelogo').classList.add('o-hide-accessible');
            document.getElementById("js-lightmodelogo").classList.remove('o-hide-accessible');
        }, 500);

    })

    getStreams();
    getLiveChannels();
    getCategories();   
};

function toggleSearch() {
    let toggleTrigger = document.querySelectorAll(".js-searchicon");
    for (let i = 0; i < toggleTrigger.length; i++) {
        toggleTrigger[i].addEventListener("click", function() {
        document.querySelector("body").classList.toggle("has-search-bar");
        })
    }
    document.querySelector(".js-searchbutton").addEventListener("click", function(){ 
            let input = document.getElementById('searchbar').value 
            input = input.toLowerCase(); 
            getSearchResults(input);
        })
    
    document.querySelector(".js-returnbutton").addEventListener("click", function(){ 
        const table = document.querySelector(".js-searchresults");
        document.querySelector("body").classList.remove("has-search-bar");
        let tableHTML = ``
        table.innerHTML = tableHTML; 
    })
}

const getSearchResults = async function(input) {
    const table = document.querySelector(".js-searchresults");
    let tableHTML = ``
    fetch(`https://api.twitch.tv/helix/search/channels?query=${input}`, {headers: {'Client-Id': 'ax1wpua2jp4np4p8azvnn9zhqg2mxy', 'Authorization': 'Bearer t8c1v6qcbh8aym9s6s73pv3o1byqy1'}})
    .then(res => res.json())
    .then(data => {
        console.log(data)
        resultData = data["data"]
        channelResult = resultData[0];
        userName = channelResult["display_name"];
        image = channelResult["thumbnail_url"];
        gameId = channelResult["game_id"];
        userId = channelResult["id"];

        fetch(`https://api.twitch.tv/helix/streams?user_id=${userId}`, {headers: {'Client-Id': 'ax1wpua2jp4np4p8azvnn9zhqg2mxy', 'Authorization': 'Bearer t8c1v6qcbh8aym9s6s73pv3o1byqy1', 'Accept': 'application/vnd.twitchtv.v5+json'}})
        .then(res => res.json())
        .then(extraData => {
            console.log(extraData);
            liveChannelData = extraData["data"];
            isLiveBool = channelResult["is_live"];
            liveChannelData = liveChannelData[0];
            if (isLiveBool == true){
                gameName = liveChannelData["game_name"];
                viewers = liveChannelData["viewer_count"];
                title = liveChannelData["title"];
                isLive = `Now streaming ${gameName}`;
            }
            else {
                gameName = "";
                viewers = 0;
                title = "";
                isLive = "Now offline";
            }
            tableHTML += `
            <div class="c-card" id="js-cardresult">
                <div class="c-cardview">
                    <div class="c-cardview__image-container">
                        <img class="c-cardview__image" src="${image}" alt="Channel Image">
                    </div>
                    <div>
                        <h3  class="u-mb-clear">
                            ${userName}
                        </h3>
                        <h6>
                            ${isLive} 
                        </h6>
                        <h5>
                            ${title} 
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
            table.innerHTML = tableHTML; 
        })
    }); 
}


const getLiveChannels = function(){
    fetch("https://api.twitch.tv/kraken/streams/summary", {headers: {'Client-Id': 'ax1wpua2jp4np4p8azvnn9zhqg2mxy', 'Authorization': 'Bearer t8c1v6qcbh8aym9s6s73pv3o1byqy1', 'Accept': 'application/vnd.twitchtv.v5+json'}})
	.then(res => res.json())
	.then(data => {
        console.log(data);
        liveViewers = data["viewers"];
        liveChannels = data["channels"];
        html_liveViewers.innerHTML = liveViewers;
        html_liveChannels.innerHTML = liveChannels;
    });    
}

const getTrendingChannels = function(streamsData){
    const table = document.querySelector(".js-trendingchannels");
    let tableHTML = ``
    for(i=0; i<3; i++){
        channel = streamsData[i]["channel"];
        userName = channel["display_name"];
        image = channel["logo"];
        gameName = streamsData[i]["game"];
        viewers = streamsData[i]["viewers"];
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
                    <p><h5>Playing</h5> 
                    <h6>${gameName}</h6></p>
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
        category = categoriesData[i]["game"];
        categoryName = category["name"];
        images = category["box"];
        image = images["medium"];

        viewers = categoriesData[i]["viewers"];
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

const showDataCategories = function(categoriesData) {
    console.log("hi")
    console.log(categoriesData)
    let converted_labels = [];
    let converted_data = [];
    
    for(i=0; i<10; i++) {
        game = categoriesData[i]["game"]
        converted_labels.push(game['name']);
        converted_data.push(categoriesData[i]['viewers']);
    }
    drawChartCategories(converted_labels, converted_data) //x en y
}

const drawChartCategories = function (labels, data) {

    var ctx = document.getElementById("chartCategories").getContext('2d');
    var myChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                data: data,
                backgroundColor:'rgb(162, 0, 255)'
            }]
        },
        options: {
            title: {
                display: true,
                text: "Trending categories",
                fontSize: 14,
                padding: 20
            },
            legend: {
                display: false,
                scales: {
                    yAxes: [{
                        stacked: false,
                        beginAtZero: true,
                        ticks: {
                            autoSkip: false
                        }
                    }],
                    xAxes: [{
                        stacked: false,
                        beginAtZero: true,
                        scaleLabel: {
                            labelString: 'Month'
                        },
                        ticks: {
                            stepSize: 1,
                            min: 0,
                            autoSkip: false
                        }
                    }]
                }
            },
            responsive: true,
        }
    });
}

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
        showDataCategories(categoriesData);
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