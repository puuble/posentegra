let text = `mutation m {  updateTerminalTicket(terminalId: {terminalId}, note:     , states: [{stateName:Kaynak,state:Getir Yemek},{stateName:Ödeme Şekli,state:}], tags: [{tagName:ID,tag:65d26c7dd75982e242098aa6},{tagName:Adres,tag:Yazır - Yazır, Sultan Caddesi, Bina No: no22/10 ABlok, Kat: 3, Daire No: 10, Selçuklu, Konya, Türkiye- Apt. No: 4 Kat : 5 Kapı No: 7 -  - Açıklama: arda},{tagName:Sipariş No,tag:g300},{tagName:Ödeme Şekli,tag:Kapıda Nakit ile Ödeme}]){id}}`;

function removeSpecialChar(text) {
  text.replace(/[&\/\\#,+$~%*?<>]/g, "");
  text = text.replace(/\\\\,/g, "\\,");
  return text;
}

let result = removeSpecialChar(text);
console.log(result, "res");
