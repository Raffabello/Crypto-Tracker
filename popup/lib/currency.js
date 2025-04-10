function getUSDFormat(price){
    let priceUSD = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
    }).format(price);
    return priceUSD;
}

//Test
function getEURFormat(price){
    let priceEUR = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'EUR',
    }).format(price);
    return priceEUR;
}