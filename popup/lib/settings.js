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