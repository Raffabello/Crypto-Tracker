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
    //TODO
    //If the user clicks the apply button, then the settings will be saved in the chrome storage as cache, so that
    //When the user opens the application again, the settings will be saved
    //When the user clicks the apply button, also apply the settings, in the current session.
    const cachedSettingsName = "Crypto-currency-tracker-settings";
})