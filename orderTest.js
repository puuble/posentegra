let queries = {
  queries: {
    addEntity:
      'mutation m{addEntity(entity:{entityType:"Müşteriler",name:"Gizem h - 542 772 53 19"}){name}}',
    updateEntityCustomData: [
      'mutation m {\n  updateEntityCustomData(entityTypeName: "Müşteriler", entityName: "Gizem h - 542 772 53 19", name: "Adres", value: "610. Sk. no:1 daire no:65 Tnr garden loft kat:5-[ Apt. No: null][ Kat : null][ Kapı No: null] - İkiçeşmelik Kuşadası[ - Açıklama: 65 | TNR garden loft kat:5 daire:5;]"){name}\n}',
      'mutation m {\n  updateEntityCustomData(entityTypeName: "Müşteriler", entityName: "Gizem h - 542 772 53 19", name: "Telefon", value: "542 772 53 19"){name}\n}',
      'mutation m {\n  updateEntityCustomData(entityTypeName: "Müşteriler", entityName: "Gizem h - 542 772 53 19", name: "Bölge", value: "İkiçeşmelik Kuşadası"){name}\n}',
      'mutation m {\n  updateEntityCustomData(entityTypeName: "Müşteriler", entityName: "Gizem h - 542 772 53 19", name: "Ad Soyad", value: "Gizem h"){name}\n}',
    ],
    registerTerminal:
      'mutation m {registerTerminal(user: "Yemek Sepeti", ticketType: "Paket Servis", terminal: "Sunucu", department: "Restoran")}',
    createTerminalTicket:
      'mutation m {createTerminalTicket(terminalId:"{terminalId}"){uid}}',
    updateTerminalTicket:
      'mutation m {  updateTerminalTicket(terminalId: "{terminalId}", note: "Servis plastik çatal, peçete vs İSTEMİYORUM", states: [{"stateName":"Kaynak","state":"Yemek Sepeti"},{"stateName":"Ödeme Şekli","state":""},{"stateName":"Teslimat Şekli","state":"2"}], tags: [{"tagName":"Yemek Sepeti Onay Kodu","tag":"70142347"},{"tagName":"Ödeme Şekli","tag":"Kredi Kartı (Sipariş tesliminde kredi kartı \\/ banka kartı ile ödeme) - Lütfen fiş getiriniz."},{"tagName":"ID","tag":""},{"tagName":"Restoran","tag":"Meşhur Yenipazar Pidecisi Test 2"}]){id}}',
    addProduct: [
      'mutation m {\n                addProduct(name: "Kapalı Kıymalı Pide - 1.5 Porsiyon", groupCode: "Entegrasyon", portions: {name: "Normal", price:1}) {\n                  id\n                }\n              }',
      'mutation m {\n                addProduct(name: "Beyaz Peynirli Çift Yumurtalı Pide (Açık) - 1 Porsiyon", groupCode: "Entegrasyon", portions: {name: "Normal", price:1}) {\n                  id\n                }\n              }',
      'mutation m {\n                addProduct(name: "Kuşbaşılı Kaşarlı Pide (Açık) - 1.5 Porsiyon", groupCode: "Entegrasyon", portions: {name: "Normal", price:1}) {\n                  id\n                }\n              }',
      'mutation m {\n                addProduct(name: "Kavurmalı Kaşarlı Pide (Kapalı) - 1 Porsiyon", groupCode: "Entegrasyon", portions: {name: "Normal", price:1}) {\n                  id\n                }\n              }',
    ],
    getProduct: [
      { name: 'Kapalı Kıymalı Pide - 1.5 Porsiyon' },
      { name: 'Beyaz Peynirli Çift Yumurtalı Pide (Açık) - 1 Porsiyon' },
      { name: 'Kuşbaşılı Kaşarlı Pide (Açık) - 1.5 Porsiyon' },
      { name: 'Kavurmalı Kaşarlı Pide (Kapalı) - 1 Porsiyon' },
    ],
    addOrderToTerminalTicketWithProduct: [
      'mutation m {addOrderToTerminalTicket(terminalId:"{terminalId}",productId:{productId},price:93.00,quantity:1,portion:"Normal",orderTags:""){orders{uid}}}',
      'mutation m {addOrderToTerminalTicket(terminalId:"{terminalId}",productId:{productId},price:57.00,quantity:1,portion:"Normal",orderTags:""){orders{uid}}}',
      'mutation m {addOrderToTerminalTicket(terminalId:"{terminalId}",productId:{productId},price:109.50,quantity:1,portion:"Normal",orderTags:""){orders{uid}}}',
      'mutation m {addOrderToTerminalTicket(terminalId:"{terminalId}",productId:{productId},price:82.00,quantity:1,portion:"Normal",orderTags:""){orders{uid}}}',
    ],
    addOrderToTerminalTicket: [
      'mutation m {addOrderToTerminalTicket(terminalId:"{terminalId}",productId:5652,price:30.00,quantity:1,portion:"Normal",orderTags:""){orders{uid}}}',
    ],
    addCalculationToTerminalTicket:
      'mutation m { addCalculationToTerminalTicket(terminalId:"{terminalId}",calculationName:"Joker İskonto",amount:0.00){id}}',
    changeEntityOfTerminalTicket:
      'mutation m {changeEntityOfTerminalTicket (terminalId:"{terminalId}",type:"Müşteriler",name:"Gizem h - 542 772 53 19"){uid}}',
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
    id: '1554483686',
    pid: '1554483686',
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
