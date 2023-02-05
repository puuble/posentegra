function textChanger(text, data) {
  let newText = text.replace(/\[(.*?)\{(.*?)\}(.*?)\]/g, (match, start, key, end) => {
    return data[key] !== undefined && data[key] !== null && data[key] !== false ? start + data[key] + end : ''
  })
  return newText.replace(/\{(.*?)\}/g, (match, key) => {
    return data[key] !== undefined && data[key] !== null && data[key] !== false ? data[key] : ''
  })
}

const data = {
  adres: 'Oranienburger Straße 70 ',
  aptNo: false,
  katNo: 1,
  kapiNo: 4,
  bolge: false,
  adresAciklama: 'hey',
}

const template =
  '{adres}[ - Apt. No: {aptNo} -][ Kat : {katNo}][ Kapı No: {kapiNo}][ - {bolge}][ - Açıklama: {adresAciklama}]'
let output = textChanger(template, data)

console.log(output)
