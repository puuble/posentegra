const TY = require('./bin/lib/ty')

async function main() {
  let data = {
    providerId: '60cdef67451ac719569864f5',
    integration: {
      apiKey: '3JoMGMotnx3rgR2tZe5o',
      apiSecretKey: 'RsINz3bPvc2C69LfI9BG',
      supplierId: '427920',
    },
    otomatikOnay: 1,
    slug: 'ty',
    status: true,
    restaurantId: '16252',
    service: '30',
  }
  const ty = new TY(data, 700)
  let packageId =
    '95550810f48b487e5420339a4dfedf05e7f6722ed7833ec6ee1745ac799c2742'
  let res = await ty.set700(packageId)
  console.log(res)
}

main()
