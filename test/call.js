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
function getTokens2(){
    let tokens = new Promise((resolve,reject) => {
        let URL = "https://api.coingecko.com/api/v3/coins/markets?order=market_cap_desc&vs_currency=usd";
        let xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function(){
            if(xhttp.readyState == xhttp.DONE){
                if(xhttp.status === 200){
                    return resolve(xhttp.response);
                }else{
                    reject("Tokens could not be retrieved")
                }
            }
        }
        xhttp.open("GET", URL);
        xhttp.send();
    })
}
