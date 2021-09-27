  //Obtain price from Coingecko Coindata-Json
  export const getPrice = (coinData, coinId) => {
    if ( coinData.coinData) {
      var coinArray = Object.values(coinData.coinData)
    if (coinArray) {
      for (const el of coinArray) {
        if (el.id === coinId) {
          return el.current_price;
        }
      }
    }
  }
}