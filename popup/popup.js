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

function displayTokensMarketData(tokens){
        let tokenInfoFrame = document.querySelector(".token-info-frame");
        for(let i = 0; i < tokens.length; i++){
            console.log(tokens[i])
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
        callback(tokens)
}


function showTokenPriceWindow(callback, token){
    let graphWindow = document.querySelector(".token-graph-window");
    graphWindow.classList.remove("token-graph-window-closed");
    graphWindow.classList.add("token-graph-window-open");
    callback(token);
}

function closeTokenPriceWindow(){
    let graphWindow = document.querySelector(".token-graph-window");
    graphWindow.classList.remove("token-graph-window-open");
    graphWindow.classList.add("token-graph-window-closed");
}

function getTokenPricePlot(token){
    console.log(token)
}

function cacheTokensPrice(tokenArray){
    let currentTime = (new Date()).toLocaleTimeString();
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

//test function
function getAllCachedValues(){
    chrome.storage.local.get(null, (items) => {
        console.log(items);
    })
}

//test function
function clearLocalStorage(){
    chrome.storage.local.clear(() => {
        console.log("All values all cleared")
    })
}

loadTokensMarketData()
    .then((tokens) => displayTokensMarketData(tokens,cacheTokensPrice))