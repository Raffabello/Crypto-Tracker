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

        tr.appendChild(tokenImageTd);
        tr.appendChild(tokenName)
        tr.appendChild(tokenPrice)
        tr.appendChild(tokenMarketCap)

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

function cacheTokenPrice(tokenArray){

}



getTokens2(populateTable);