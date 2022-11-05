let queries = {
  queries: {
    addEntity:
      'mutation m{addEntity(entity:{entityType:"Müşteriler",name:"tanya j - 530 567 45 74"}){name}}',
    updateEntityCustomData: [
      'mutation m {\n  updateEntityCustomData(entityTypeName: "Müşteriler", entityName: "tanya j - 530 567 45 74", name: "Adres", value: "Sevinç Sk. no: 72 daire no:2 Güvendik 2 Hasan Yaşar apt. kat:1-[ Apt. No: null][ Kat : null][ Kapı No: null] - Kuşadası (Türkmen Mah.)[ - Açıklama: 2 | köşedeki bina;]"){name}\n}',
      'mutation m {\n  updateEntityCustomData(entityTypeName: "Müşteriler", entityName: "tanya j - 530 567 45 74", name: "Telefon", value: "530 567 45 74"){name}\n}',
      'mutation m {\n  updateEntityCustomData(entityTypeName: "Müşteriler", entityName: "tanya j - 530 567 45 74", name: "Bölge", value: "Kuşadası (Türkmen Mah.)"){name}\n}',
      'mutation m {\n  updateEntityCustomData(entityTypeName: "Müşteriler", entityName: "tanya j - 530 567 45 74", name: "Ad Soyad", value: "tanya j"){name}\n}',
    ],
    registerTerminal:
      'mutation m {registerTerminal(user: "Yemek Sepeti", ticketType: "Paket Servis", terminal: "Sunucu", department: "Restoran")}',
    createTerminalTicket:
      'mutation m {createTerminalTicket(terminalId:"{terminalId}"){uid}}',
    updateTerminalTicket:
      'mutation m {  updateTerminalTicket(terminalId: "{terminalId}", note: "Temassız Teslimat İstiyorum | Servis plastik çatal, peçete vs İSTEMİYORUM", states: [{"stateName":"Kaynak","state":"Yemek Sepeti"},{"stateName":"Ödeme Şekli","state":""},{"stateName":"Teslimat Şekli","state":"2"}], tags: [{"tagName":"Yemek Sepeti Onay Kodu","tag":"68264515"},{"tagName":"Ödeme Şekli","tag":"Online Kredi\\/Banka Kartı - Sipariş tutarı internet üzerinden ÖDENMİŞTİR. - Lütfen fiş getiriniz."},{"tagName":"ID","tag":""},{"tagName":"Restoran","tag":"Meşhur Yenipazar Pidecisi Test 2"}]){id}}',
    addOrderToTerminalTicket: [
      'mutation m {addOrderToTerminalTicket(terminalId:"{terminalId}",productId:5626,price:27.00,quantity:1,portion:"Normal",orderTags:""){orders{uid}}}',
    ],
    addProduct: [
      'mutation m {\n                addProduct(name: "Kıymalı Yumurtalı Pide - 1 Porsiyon", groupCode: "Entegrasyon", portions: {name: "Normal", price:1}) {\n                  id\n                }\n              }',
      'mutation m {\n                addProduct(name: "Bozdoğan Peynirlisi - 1 Porsiyon", groupCode: "Entegrasyon", portions: {name: "Normal", price:1}) {\n                  id\n                }\n              }',
    ],
    getProduct: [
      { name: 'Kıymalı Yumurtalı Pide - 1 Porsiyon' },
      { name: 'Bozdoğan Peynirlisi - 1 Porsiyon' },
    ],
    addCalculationToTerminalTicket:
      'mutation m { addCalculationToTerminalTicket(terminalId:"{terminalId}",calculationName:"Joker İskonto",amount:0.00){id}}',
    changeEntityOfTerminalTicket:
      'mutation m {changeEntityOfTerminalTicket (terminalId:"{terminalId}",type:"Müşteriler",name:"tanya j - 530 567 45 74"){uid}}',
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
    id: '1554057901',
    pid: '1554057901',
    slug: 'ys',
    restaurantId: '63617059d55d1a6201061679',
  },
}
const Query = require('./bin/lib/query')
async function main() {
  let query = new Query(queries)
  await query.init()
}
main()
