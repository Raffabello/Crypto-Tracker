let plotExitButton = document.getElementById("close-graph");
plotExitButton.addEventListener("click", function(){
        closeTokenPriceWindow();
})        

let plotNextButton = document.getElementById("next-graph");
plotNextButton.addEventListener("click", function(){
        showNextTokenPlot();
})

let plotPreviousButton = document.getElementById("previous-graph");
plotPreviousButton.addEventListener("click", function(){
        showPreviousTokenPlot();
})

function getTokensInfo(){
    const URL = "https://api.coingecko.com/api/v3/coins/markets?order=market_cap_desc&vs_currency=usd&per_page=5";
    return new Promise((resolve,reject) => {
        fetch(URL)
            .then(function(response){
                if(!response.ok){
                    reject("Network Error, could not retrieve Token Market Data");
                }else{
                    if(response.status === 200){
                        return response.json();
                    }else{
                        reject("Connected successfully , but the data was not retrievable\nThe status code received is " + response.status);
                    }
                }
            })
            .then(function(tokens){
                resolve(tokens);
            })
            .catch(function(error){
                reject(error)
            })
    })
}

async function loadTokensMarketData(){
    try{
        let tokens = await getTokensInfo();
        return tokens;
    }catch(error){
        console.log(error);
    }
}

function displayTokensMarketData(tokens, callback){
        let tokenInfoFrame = document.querySelector(".token-info-frame");
        for(let i = 0; i < tokens.length; i++){
            let tokenRow = document.createElement("div");
            tokenRow.classList.add("token-row");
            tokenRow.style.setProperty("--i", i);

            //token image
            let tokenImageBox = document.createElement("div");
            let tokenImage = document.createElement("img");
            tokenImage.src = tokens[i].image;
            tokenImage.style.height = "24px";
            tokenImage.style.width = "24px";
            tokenImageBox.appendChild(tokenImage);
            
            //token name
            let tokenName = document.createElement("div");
            tokenName.innerText = tokens[i].name;

            //token price
            let tokenPrice = document.createElement("div");
            tokenPrice.innerText = tokens[i].current_price;

            //Plot
            let plotTokenIcon = document.createElement("img");
            plotTokenIcon.src = "../icons/stockchart-svgrepo-com.svg"
            plotTokenIcon.style.height = "24px";
            plotTokenIcon.style.width = "24px";

            plotTokenIcon.addEventListener("click", function(){
                showTokenPriceWindow(getTokenPricePlot,tokens[i].name);
            })

            let plotTokenPrice = document.createElement("div");
            plotTokenPrice.appendChild(plotTokenIcon);
            
            tokenRow.appendChild(tokenImageBox);
            tokenRow.appendChild(tokenName);
            tokenRow.appendChild(tokenPrice);
            tokenRow.appendChild(plotTokenPrice);

            tokenInfoFrame.appendChild(tokenRow);
        }
        callback(tokens); //TODO: I would like to add a logic that only shows data within a 6 hours range (-3 hours / + 3 hours)
        
}


function showTokenPriceWindow(callback, token){
    let plotHeader = document.getElementById("token-graph-header");
    plotHeader.innerText = token;
    let graphWindow = document.querySelector(".token-graph-window");
    graphWindow.classList.remove("token-graph-window-closed");
    graphWindow.classList.add("token-graph-window-open");
    callback(token);
}

function showNextTokenPlot(){
    let currentToken = document.getElementById("token-graph-header");
    chrome.storage.local.get("Crypto-tracker-cache", (item) => {
        let cachedArray = item["Crypto-tracker-cache"];
        let cachedArrayNames = cachedArray.map((token) => token.name);
        
        let currentIndex = cachedArrayNames.indexOf(currentToken.innerText);
        if(currentIndex < cachedArray.length - 1){
            currentToken.innerText = cachedArrayNames[currentIndex + 1];
            getTokenPricePlot(cachedArrayNames[currentIndex + 1])
        }
    })
}

function showPreviousTokenPlot(){
    let currentToken = document.getElementById("token-graph-header");
    chrome.storage.local.get("Crypto-tracker-cache", (item) => {
        let cachedTokens =  Object.values(item)[0];
        let cachedArrayNames = cachedTokens.map((token) => token.name);
        let currentIndex = cachedArrayNames.indexOf(currentToken.innerText);
        if(currentIndex > 0){
            currentToken.innerText = cachedArrayNames[currentIndex - 1];
            getTokenPricePlot(cachedArrayNames[currentIndex - 1])
        }
    })
}

function closeTokenPriceWindow(){
    myChart.destroy();
    let graphWindow = document.querySelector(".token-graph-window");
    graphWindow.classList.remove("token-graph-window-open");
    graphWindow.classList.add("token-graph-window-closed");
}

let myChart;
function getTokenPricePlot(selectedToken){
    chrome.storage.local.get("Crypto-tracker-cache", (item) => {
        let cachedTokens = Object.values(item)[0];
        let tokenPricesVariation = cachedTokens.filter(function(cachedToken){
            if(cachedToken.name === selectedToken){
                return cachedToken.pairs;
            }
        })

        let timeArray = tokenPricesVariation[0].pairs.map((pair) => pair.x);
        let priceArray = tokenPricesVariation[0].pairs.map((pair) => pair.y);
        //Draw Plot
        const ctx = document.getElementById("graph").getContext("2d");
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
          });
    })
}

function cacheTokensPrice(tokenArray){
    let currentTime = new Date();
    let currentHour = currentTime.getHours().toString().padStart(2,"0");
    let currentMinute = currentTime.getMinutes().toString().padStart(2,"0");
    let ampm = currentHour >= 12 ? "PM" : "AM";
    currentTime = currentHour + ":" + currentMinute + ampm;
    chrome.storage.local.get("Crypto-tracker-cache", (items) => {
        if(items.hasOwnProperty("Crypto-tracker-cache")){
            //Values are recorded
            let storedArray = items["Crypto-tracker-cache"];
            storedArray.forEach(function(storedArrayItem){
                tokenArray.forEach(function(tokenArrayItem){
                    if(storedArrayItem.name === tokenArrayItem.name){
                        storedArrayItem.pairs.push({x:currentTime,y:tokenArrayItem.current_price});
                    }
                })
            })
            chrome.storage.local.set({"Crypto-tracker-cache":storedArray});
        }else{
            let cachedArray = tokenArray.map(function(token){
                return {
                    name:token.name,
                    pairs:[{x:currentTime, y:token.current_price}]
                }
            })
            chrome.storage.local.set({"Crypto-tracker-cache":cachedArray})
        }
    })
}

loadTokensMarketData()
    .then((tokens) => displayTokensMarketData(tokens,cacheTokensPrice))