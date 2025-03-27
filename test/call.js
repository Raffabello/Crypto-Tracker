//Simple call to coingecko API to know the price of the bitcoins USD
fetch("https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd")
.then(function(response){
    if(response.ok){ //this property of response allows us to check if the Server responded with a 200 range HTTP status code
        console.log(response.status)
        return response.json();
    }else{
        throw new Error("Could not contact the Server");
    }
})
.then(function(btcPrice){
    console.log(btcPrice);
})
.catch(function(error){
    console.log(error);
})

/*Note:
Maybe is not a good choice to not use anonymous functions, it makes the code a little messy
*/