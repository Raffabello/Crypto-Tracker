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

async function loadTokensMarketData(callback){
    try{
        let tokens = await getTokensInfo();
        callback(tokens)
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
}

loadTokensMarketData(displayTokensMarketData)

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