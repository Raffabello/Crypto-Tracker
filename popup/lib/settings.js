let applySettingButton = document.getElementById("settings-confirm-button");
let currencySetting = document.getElementById("settings-choose-currency-select");
let settingsButton = document.getElementById("settings-button");
let settingsWindow = document.getElementById("settings");
let settingsMap = {};

function getSettings(){
    return new Promise((resolve) => {
        chrome.storage.local.get("Crypto-currency-tracker-settings", (cachedSettings) =>{
            resolve(cachedSettings);
        })
    })
}

async function loadSettings(){
    try {
        let settings = await getSettings();
        if(Object.keys(settings).length === 0){
            settingsMap = {
                currency:"usd"
            }
        }else{
            //The setting map exists
            settingsMap = {
                currency:settings["Crypto-currency-tracker-settings"]["currency"]
            }
            Array.from(currencySetting).forEach((node) => {
                if(node.innerText.toLowerCase() === settings["Crypto-currency-tracker-settings"]["currency"]){
                    node.selected = true;
                }
            })
        }
    }
    catch(error){
        return error; //小几率
    }
}

//Other settings

settingsButton.addEventListener("click", function(){
    if(settingsWindow.classList.contains("settings-hidden")){
        settingsWindow.classList.remove("settings-hidden");
        settingsWindow.classList.add("settings-visible");
    }else{
        settingsWindow.classList.remove("settings-visible");
        settingsWindow.classList.add("settings-hidden");
    }
})

currencySetting.addEventListener("change", function(event){
    settingsMap["currency"] = event.target.value;
})

applySettingButton.addEventListener("click", function(){
    //Apply to the session
    //TODO:因为settingsMap可以改变，我不要让这个函数每次呼API,有时间的时候我要赶上
    for(key of Object.keys(settingsMap)){
        if(key === "currency"){
            loadTokensMarketData(displayTokensMarketData);
        }
    }
    chrome.storage.local.set({"Crypto-currency-tracker-settings":settingsMap});

    //Close window
    settingsWindow.classList.remove("settings-visible");
    settingsWindow.classList.add("settings-hidden");
})