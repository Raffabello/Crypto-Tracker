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
                        reject("Server successfully answered, but the data was not retrievable\nThe status code received is " + response.status);
                    }
                }
            })
            .then(function(tokens){
                resolve(tokens);
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