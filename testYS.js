let json = {
  queries: {
    addEntity:
      'mutation m{addEntity(entity:{entityType:"Müşteriler",name:"nur g. - 534 834 07 67"}){name}}',
    updateEntityCustomData: [
      'mutation m {\n  updateEntityCustomData(entityTypeName: "Müşteriler", entityName: "nur g. - 534 834 07 67", name: "Adres", value: "Koşuyolu Cd. no:64 daire no:64/2 HHK kat:1[ - Açıklama: 64/2 | HHK legal yazan kırmızı tabela Dominos pizza yani;]"){name}\n}',
      'mutation m {\n  updateEntityCustomData(entityTypeName: "Müşteriler", entityName: "nur g. - 534 834 07 67", name: "Telefon", value: "534 834 07 67"){name}\n}',
    ],
    registerTerminal:
      'mutation m {registerTerminal(user: "Yemek Sepeti", ticketType: "Paket Servis", terminal: "Sunucu", department: "Restoran")}',
    createTerminalTicket:
      'mutation m {createTerminalTicket(terminalId:"{terminalId}"){uid}}',
    updateTerminalTicket:
      'mutation m {  updateTerminalTicket(terminalId: "{terminalId}", note: "Servis (plastik çatal, peçete vs.) İSTEMİYORUM. | Mobil Ödeme", states: [{"stateName":"Kaynak","state":"Yemek Sepeti"},{"stateName":"Ödeme Şekli","state":"Sodexo"}], tags: [{"tagName":"Ödeme Şekli","tag":"Sodexo Restaurant Pass Mobil Ödeme (Mobil uygulamadan alınacak kod ile ödeme)"},{"tagName":"ID","tag":"6357f59b7cd642721f077c18"}]){id}}',
    addProduct: [
      'mutation m {\n                addProduct(name: "*Promosyon* Seçilmiş Menü (Cheeseburger (140 gr.))", groupCode: "Entegrasyon", portions: {name: "Normal", price:1}) {\n                  id\n                }\n              }',
      'mutation m {\n                addProduct(name: "*Promosyon* Seçilmiş Menü (Cheeseburger (140 gr.))", groupCode: "Entegrasyon", portions: {name: "Normal", price:1}) {\n                  id\n                }\n              }',
      'mutation m {\n                addProduct(name: "*Promosyon* Seçilmiş Menü (Cheeseburger (140 gr.))", groupCode: "Entegrasyon", portions: {name: "Normal", price:1}) {\n                  id\n                }\n              }',
    ],
    getProduct: [
      { name: '*Promosyon* Seçilmiş Menü (Cheeseburger (140 gr.))' },
      { name: '*Promosyon* Seçilmiş Menü (Cheeseburger (140 gr.))' },
      { name: '*Promosyon* Seçilmiş Menü (Cheeseburger (140 gr.))' },
    ],
    addOrderToTerminalTicket: [
      'mutation m {addOrderToTerminalTicket(terminalId:"{terminalId}",productId:{productId},price:84.64,quantity:2,portion:"Normal",orderTags:"Yemeksepeti Etiketi=Cheeseburger,Yemeksepeti Etiketi=140 gr.,Yemeksepeti Etiketi=İyi Pişmiş,Yemeksepeti Etiketi=Coca-Cola (33 cl.)"){orders{uid}}}',
      'mutation m {addOrderToTerminalTicket(terminalId:"{terminalId}",productId:{productId},price:84.64,quantity:1,portion:"Normal",orderTags:"Yemeksepeti Etiketi=Cheeseburger,Yemeksepeti Etiketi=140 gr.,Yemeksepeti Etiketi=İyi Pişmiş,Yemeksepeti Etiketi=Coca-Cola Zero Sugar (33 cl.)"){orders{uid}}}',
      'mutation m {addOrderToTerminalTicket(terminalId:"{terminalId}",productId:{productId},price:84.64,quantity:1,portion:"Normal",orderTags:"Yemeksepeti Etiketi=Cheeseburger,Yemeksepeti Etiketi=140 gr.,Yemeksepeti Etiketi=Orta Pişmiş,Yemeksepeti Etiketi=Coca-Cola (33 cl.)"){orders{uid}}}',
      'mutation m {addOrderToTerminalTicket(terminalId:"{terminalId}",productId:32,price:84.64,quantity:1,portion:"Normal",orderTags:"Yemeksepeti Etiketi=140 gr.,Yemeksepeti Etiketi=Patates Kızartması (170 gr.),Yemeksepeti Etiketi=Orta Pişmiş,Yemeksepeti Etiketi=Kepek Ekmeği,Yemeksepeti Etiketi=Coca-Cola Şekersiz (33 cl.)"){orders{uid}}}',
    ],
    addCalculationToTerminalTicket:
      'mutation m { addCalculationToTerminalTicket(terminalId:"{terminalId}",calculationName:"Joker İskonto",amount:0.00){id}}',
    changeEntityOfTerminalTicket:
      'mutation m {changeEntityOfTerminalTicket (terminalId:"{terminalId}",type:"Müşteriler",name:"nur g. - 534 834 07 67"){uid}}',
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
  order: {
    id: '1551295594',
    pid: '1551295594',
    slug: 'ys',
    restaurantId: '634effaece54b03fe79a14f0',
  },
}
const Query = require('./bin/lib/query')

async function run(message) {
  const q = new Query(message)
  let pos_ticket = await q.init()
  console.log(pos_ticket, 'pos')
}
async function main() {
  run(json)
}
main()
