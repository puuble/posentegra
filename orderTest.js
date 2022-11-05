let queries = {
  queries: {
    addEntity:
      'mutation m{addEntity(entity:{entityType:"Müşteriler",name:"Çağla D - 544 977 57 87"}){name}}',
    updateEntityCustomData: [
      'mutation m {\n  updateEntityCustomData(entityTypeName: "Müşteriler", entityName: "Çağla D - 544 977 57 87", name: "Adres", value: "Malazgirt 1071 Cad. no:göksu relax sit. daire no:228 b blok kat:7-[ Apt. No: null][ Kat : null][ Kapı No: null] - Etimesgut (Şht Osman Avcı Mah.)[ - Açıklama: 228 | Goksu relax B blok kat:7 daire no:228; - ** ÇATAL-BIÇAK GÖNDERMEYİN]"){name}\n}',
      'mutation m {\n  updateEntityCustomData(entityTypeName: "Müşteriler", entityName: "Çağla D - 544 977 57 87", name: "Telefon", value: "544 977 57 87"){name}\n}',
      'mutation m {\n  updateEntityCustomData(entityTypeName: "Müşteriler", entityName: "Çağla D - 544 977 57 87", name: "Bölge", value: "Etimesgut (Şht Osman Avcı Mah.)"){name}\n}',
      'mutation m {\n  updateEntityCustomData(entityTypeName: "Müşteriler", entityName: "Çağla D - 544 977 57 87", name: "Ad Soyad", value: "Çağla D"){name}\n}',
    ],
    registerTerminal:
      'mutation m {registerTerminal(user: "Yemek Sepeti", ticketType: "Paket Servis", terminal: "Sunucu", department: "Restoran")}',
    createTerminalTicket:
      'mutation m {createTerminalTicket(terminalId:"{terminalId}"){uid}}',
    updateTerminalTicket:
      'mutation m {  updateTerminalTicket(terminalId: "{terminalId}", note: "Servis plastik çatal, peçete vs İSTEMİYORUM | Temassız Teslimat İstiyorum", states: [{"stateName":"Kaynak","state":"Yemek Sepeti"},{"stateName":"Ödeme Şekli","state":""},{"stateName":"Teslimat Şekli","state":"2"}], tags: [{"tagName":"Yemek Sepeti Onay Kodu","tag":"68879992"},{"tagName":"Ödeme Şekli","tag":"Online Kredi\\/Banka Kartı - Sipariş tutarı internet üzerinden ÖDENMİŞTİR. - Lütfen fiş getiriniz."},{"tagName":"ID","tag":""},{"tagName":"Restoran","tag":"Nokta Pide Test"}]){id}}',
    addOrderToTerminalTicket: [
      'mutation m {addOrderToTerminalTicket(terminalId:"{terminalId}",productId:6147,price:85.00,quantity:1,portion:"Normal",orderTags:"Yemeksepeti Etiketi=2 x Lahmacun:Acısız,Yemeksepeti Etiketi=Lahmacun:Acılı"){orders{uid}}}',
    ],
    addCalculationToTerminalTicket:
      'mutation m { addCalculationToTerminalTicket(terminalId:"{terminalId}",calculationName:"Joker İskonto",amount:0.00){id}}',
    changeEntityOfTerminalTicket:
      'mutation m {changeEntityOfTerminalTicket (terminalId:"{terminalId}",type:"Müşteriler",name:"Çağla D - 544 977 57 87"){uid}}',
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
    id: '1554203817',
    pid: '1554203817',
    slug: 'ys',
    restaurantId: '63668881164d597e970a910e',
  },
}
const Query = require('./bin/lib/query')
async function main() {
  let query = new Query(queries)
  await query.init()
}
main()
