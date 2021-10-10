export const currencyFormat = (amount) =>{
    var num = amount.replace(/\./g,'');
    num = num.toString().split('').reverse().join('').replace(/(?=\d*\.?)(\d{3})/g,'$1.');
    num = num.split('').reverse().join('').replace(/^[\.]/,'');        
    return num;
}