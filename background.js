const MINUTES_BEFORE_CALL = 10;
const MAX_CACHE_SIZE = 6;

function getTokensPrices(){
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
                let currentTime = new Date();
                currentTime = currentTime.toLocaleTimeString("en-US", {hour:"numeric",minute:"2-digit",hour12:true})
                let currentEpoch = Date.now()
                chrome.storage.local.get("Crypto-tracker-cache", (items) => {
                    if(items.hasOwnProperty("Crypto-tracker-cache")){
                        //Values are recorded
                        let storedArray = items["Crypto-tracker-cache"];
                        let currentPairs = storedArray[0].pairs.length; //Ref is the BTC
                        if(currentPairs > MAX_CACHE_SIZE - 1){
                            chrome.storage.local.clear(() => {
                                let cachedArray = tokens.map(function(token){
                                    return {
                                        name:token.name,
                                        pairs:[{x:currentTime, y:token.current_price}]
                                    }
                                })
                                chrome.storage.local.set({"Crypto-tracker-cache":cachedArray})
                            })
                        }else{
                            storedArray.forEach(function(storedArrayItem){
                                tokens.forEach(function(tokenArrayItem){
                                    if(storedArrayItem.name === tokenArrayItem.name){
                                        storedArrayItem.pairs.push({x:currentTime,y:tokenArrayItem.current_price, z:currentEpoch});
                                    }
                                })
                            })
                            chrome.storage.local.set({"Crypto-tracker-cache":storedArray});
                        }
                    }else{
                        let cachedArray = tokens.map(function(token){
                            return {
                                name:token.name,
                                pairs:[{x:currentTime, y:token.current_price, z:currentEpoch}]
                            }
                        })
                        chrome.storage.local.set({"Crypto-tracker-cache":cachedArray})
                    }
                })
                return resolve(tokens)
            })
            .catch(function(error){
                reject(error)
            })
    })
}

function hasPreviousDaysValues(){
    let ls = chrome.storage.local
    ls.get("Crypto-tracker-cache", (items) => {
        let storedArrayPairs = items["Crypto-tracker-cache"][0].pairs;
        let storedEpochTimes = storedArrayPairs.map((pair) => pair.z);
        let currentTime = new Date();
        let todayStart = new Date(currentTime.getFullYear(), currentTime.getMonth(), currentTime.getDate()).getTime();
        for(let i = 0; i < storedEpochTimes.length; i ++){
            if(storedArrayPairs[i] < todayStart){
                return true
            }
        }
    })
    return false;
}

chrome.storage.local.get("Crypto-tracker-cache", (item) => {
    if(!item.hasOwnProperty("Crypto-tracker-cache")){
        getTokensPrices();
    }
})

chrome.alarms.create("api-call", {periodInMinutes:MINUTES_BEFORE_CALL});
chrome.alarms.onAlarm.addListener((alarm) =>{
    if(alarm.name === "api-call"){
        getTokensPrices();
    }
})