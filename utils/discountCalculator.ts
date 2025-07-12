export const discountCalculator =(percent: number, price: number)=>{
    const discountprice = price - (price * (percent / 100))
    return discountprice.toFixed(2)
}