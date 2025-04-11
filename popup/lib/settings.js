//Other settings
let settingsButton = document.getElementById("settings-button");
let settingsWindow = document.getElementById("settings");

settingsButton.addEventListener("click", function(){
    if(settingsWindow.classList.contains("settings-hidden")){
        settingsWindow.classList.remove("settings-hidden");
        settingsWindow.classList.add("settings-visible");
    }else{
        settingsWindow.classList.remove("settings-visible");
        settingsWindow.classList.add("settings-hidden");
    }
})

let applySettingButton = document.getElementById("settings-confirm-button");

let settingsMap = {
    currency:"usd"
}

//Options
let currencySetting = document.getElementById("settings-choose-currency-select");
currencySetting.addEventListener("change", function(event){
    settingsMap["currency"] = event.target.value;
})

applySettingButton.addEventListener("click", function(){
    const cachedSettingsName = "Crypto-currency-tracker-settings";
    //Apply to the session
    for(key of Object.keys(settingsMap)){
        if(key === "currency"){
            //Apply currency settings
            loadTokensMarketData(displayTokensMarketData)
        }
    }
})