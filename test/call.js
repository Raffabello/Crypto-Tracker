//Coded this way is better as I can generalize the API Call for different cryptos, also more control over parameters
function getBTCInfo(){
    return new Promise((resolve,reject) => {
        let getMarketCap = false;
        let precision = 0;
        let currency = "usd";
        let URL = "https://api.coingecko.com/api/v3/simple/price?" +
            "ids=bitcoin" //This can be changed, the function itself can be made general so to get information from different tokens
            + "&vs_currencies=" + currency
            + "&include_market_cap=" + getMarketCap
            + "&precision=" + precision;

        fetch(URL)
            .then((data) => {return data.json()})
            .then((data) => console.log(data))
            .catch((error) => console.log(error))
    })
}

function getTokens(){
    return fetch("https://api.coingecko.com/api/v3/coins/list")
        .then((data) => data.json())
        .then((coins) => {return coins})
        .catch((error) => {return error})
}

//Function to get tokens but with market data
function getTokens2(callback){
    let tokens = new Promise((resolve,reject) => {
        let URL = "https://api.coingecko.com/api/v3/coins/markets?order=market_cap_desc&vs_currency=usd&per_page=5";
        let xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function(){
            if(xhttp.readyState == xhttp.DONE){
                if(xhttp.status === 200){
                    let data = JSON.parse(xhttp.responseText);
                    //I want the image, the name, the price and the market cap
                    //I can extract manually
                    let tokenArray = extractTokenInfo(data);
                    return resolve(tokenArray)
                }else{
                    reject("Tokens could not be retrieved")
                }
            }
        }
        xhttp.open("GET", URL);
        xhttp.send();
    })

    tokens
        .then((tokens) => {return callback(tokens)})
        .then((tokenArray) => cacheTokenPrice(tokenArray))
        .catch((error) => {return new Error(error)})
}

function extractTokenInfo(tokenList){
    let tokenArray = [];
    for(tokenData of tokenList){
        let token = {
            image:tokenData.image,
            name:tokenData.name,
            price:tokenData.current_price,
            market_cap:tokenData.market_cap,
        };
        tokenArray.push(token);
    }
    return tokenArray;
}

function populateTable(tokenArray){
    let coinTable = document.querySelector(".token-market-data");
    for(let i = 0; i < tokenArray.length; i ++){
        let tr = document.createElement("tr");
        tr.classList.add("token-market-data");
        tokenImage = document.createElement("img");
        tokenImage.style.height = "32px";
        tokenImage.style.width = "32px";
        tokenImage.src = tokenArray[i].image;
        tokenImageTd = document.createElement("td");
        tokenImageTd.appendChild(tokenImage);

        tokenName = document.createElement("td");
        tokenName.innerText = tokenArray[i].name;
        tokenPrice = document.createElement("td");
        tokenPrice.innerText = tokenArray[i].price + "$";
        tokenMarketCap = document.createElement("td");
        tokenMarketCap.innerText = tokenArray[i].market_cap + "$";

        let tokenPlot = document.createElement("td");
        let tokenPlotBtn = document.createElement("button");
        tokenPlotBtn.innerHTML = "View Plot"
        tokenPlotBtn.addEventListener("click", function(){
            drawPlot(tokenArray[i].name)
        })
        tokenPlot.appendChild(tokenPlotBtn)

        tr.appendChild(tokenImageTd);
        tr.appendChild(tokenName)
        tr.appendChild(tokenPrice)
        tr.appendChild(tokenMarketCap)
        tr.appendChild(tokenPlot)

        coinTable.appendChild(tr);
    }
    return tokenArray;
}

function test(){
    alert("I am an alert")
}

/*
    How cache works
    Whenever the user clicks the chrome extension make an API request:
    1)The API request is made
    2)Save price, and save the time when the API request was made, both in the local storage [{time,price}]
    3)When the next API call is made, just save it into the local Storage again with the push method

    Tip:It could be useful to have a check when API calls are made, so if two API calls are made within 2 - 3 seconds or anyway
    A short timespan, then just show the latest cached value (For better performance)
*/

//

//Do not look this function for too long, it can blow your soul out
function cacheTokenPrice(tokenArray){
    const LS_KEY = "Crypto-tracker-cache";
    let ls = localStorage;
    let timestamp = new Date();
    timestamp = timestamp.getTime();
    if(ls.getItem(LS_KEY) != null){
        let tokenArrayCached = JSON.parse(ls.getItem(LS_KEY));
        tokenArray.forEach(function(tokenArrayItem){
            tokenArrayCached.forEach(function(tokenArrayCachedItem){
                if(tokenArrayItem.name === tokenArrayCachedItem.name){
                    tokenArrayCachedItem.pairs.push({x:timestamp, y:tokenArrayItem.price});
                }
            })
        })
        ls.setItem(LS_KEY, JSON.stringify(tokenArrayCached));
    }else{
        let tokenArrayMap = tokenArray.map((function(token){
        return {
            name:token.name,
            pairs:[{x:timestamp, y:token.price}],
        }})) 
        ls.setItem(LS_KEY,JSON.stringify(tokenArrayMap));
    }
}

let myChart;
function drawPlot(tokenName){
    /*
    get the JSON parsed array from the localStorage
    filter the token and extract two arrays:array of time and array of price
    */
    let ls = localStorage;
    let tokenArray = JSON.parse(ls.getItem("Crypto-tracker-cache"));
    if(tokenArray !== null){
        let token = tokenArray.filter(function(token){
            if(token.name === tokenName){
                return token
            }
        });
        token = token[0];
        let timeArray = token.pairs.map(function(pair){
            let unixTime = pair.x;
            let date = new Date(unixTime); //from Unix time get hh:mm dd-mm-yyyy
            return formatDate(date);
        })
        let priceArray = token.pairs.map(function(pair){
            return pair.y;
        })
        const ctx = document.getElementById("token-chart-plot").getContext("2d");
        if(myChart){
            myChart.destroy();
        }
        myChart = new Chart(ctx, {
            type: 'line',
            data: {
              labels: timeArray, // X-axis labels, time hh:mm dd-mm-yyyy
              datasets: [{
                label: 'Price',
                data: priceArray, // Y-axis values, token price
                borderColor: 'green',
                backgroundColor: 'rgba(0, 0, 255, 0.1)',
                borderWidth: 2
              }]
            },
            options: {
              responsive: true,
              maintainAspectRatio: false
            }
          });
    }
 }

function formatDate(unixDate){
    let date = new Date(unixDate);
    return date.toLocaleString();
}



getTokens2(populateTable);