let queries = {
  queries: {
    addEntity:
      'mutation m{addEntity(entity:{entityType:"Müşteriler",name:"Furkan N - 5302790647"}){name}}',
    updateEntityCustomData: [
      'mutation m {\n  updateEntityCustomData(entityTypeName: "Müşteriler", entityName: "Furkan N - 5302790647", name: "Adres", value: "5 Sk. no: 158-[ Apt. No: null][ Kat : null][ Kapı No: null] - Artuklu (Nur Mah.)[ - Açıklama: Nur mahallesi 24.sokak Devlet hastanesi arkası konbay sitesi altı number one fitness;]"){name}\n}',
      'mutation m {\n  updateEntityCustomData(entityTypeName: "Müşteriler", entityName: "Furkan N - 5302790647", name: "Telefon", value: "5302790647"){name}\n}',
      'mutation m {\n  updateEntityCustomData(entityTypeName: "Müşteriler", entityName: "Furkan N - 5302790647", name: "Ad Soyad", value: "Furkan N"){name}\n}',
    ],
    registerTerminal:
      'mutation m {registerTerminal(user: "Yemek Sepeti", ticketType: "Paket Servis", terminal: "Sunucu", department: "Restoran")}',
    createTerminalTicket:
      'mutation m {createTerminalTicket(terminalId:"{terminalId}"){uid}}',
    updateTerminalTicket:
      'mutation m {  updateTerminalTicket(terminalId: "{terminalId}", note: "Servis plastik çatal, peçete vs İSTEMİYORUM[ - Teslimat Saati: null]", states: [{"stateName":"Kaynak","state":"Yemek Sepeti"},{"stateName":"Ödeme Şekli","state":"Kredi Kartı"}], tags: [{"tagName":"Ödeme Şekli","tag":"Kredi Kartı (Sipariş tesliminde kredi kartı \\/ banka kartı ile ödeme) - Lütfen fiş getiriniz."},{"tagName":"ID","tag":"637fa607cd453680560f5ec6"}]){id}}',
    addOrderToTerminalTicket: [
      'mutation m {addOrderToTerminalTicket(terminalId:"{terminalId}",productId:115,price:54.00,quantity:1,portion:"Normal",orderTags:""){orders{uid}}}',
    ],
    addProduct: [
      'mutation m {\n                addProduct(name: "Muzlu Mualla - 425 cc.", groupCode: "Entegrasyon", portions: {name: "Normal", price:1}) {\n                  id\n                }\n              }',
    ],
    getProduct: [
      {
        name: 'Muzlu Mualla - 425 cc.',
      },
    ],
    addOrderToTerminalTicketWithProduct: [
      'mutation m {addOrderToTerminalTicket(terminalId:"{terminalId}",productId:{productId},price:54.00,quantity:1,portion:"Normal",orderTags:""){orders{uid}}}',
    ],
    addCalculationToTerminalTicket:
      'mutation m { addCalculationToTerminalTicket(terminalId:"{terminalId}",calculationName:"Joker İskonto",amount:0.00){id}}',
    changeEntityOfTerminalTicket:
      'mutation m {changeEntityOfTerminalTicket (terminalId:"{terminalId}",type:"Müşteriler",name:"Furkan N - 5302790647"){uid}}',
    closeTerminalTicket:
      'mutation m {closeTerminalTicket(terminalId:"{terminalId}")}',
    getTerminalTickets:
      'mutation m {getTerminalTickets (terminalId:"{terminalId}"){id,uid}}',
    unregisterTerminal:
      'mutation m {unregisterTerminal(terminalId:"{terminalId}")}',
    postTicketRefreshMessage:
      'mutation m {\n                        postTicketRefreshMessage(id: 0) {\n                          id\n                        }\n                      }',
    postBroadcastMessage:
      'mutation m { postBroadcastMessage(message: "ENT-YeniSiparis-ys") {\n                              message\n                            }\n                          }',
  },
}
const Query = require('./bin/lib/query')
async function main() {
  let query = new Query(queries)
  await query.init()
}
main()
