const fs2 = require('fs/promises')
const Api = require('./bin/lib/api')

async function main(data) {
  let folder = './tmp/' + data.receiver + '.txt'
  let result = {
    message: {
      result: {},
      option: data['message']['option'],
    },
    sender: data['user']['id'],
    receiver: data.receiver,
    channel: data.channel,
    broadcast: false,
  }
  const stuffReturned = await fs2.readFile(folder)
  const api = new Api()
  /* const saveTo = path.join(__dirname, filename);
  file.pipe(fs.createWriteStream(saveTo));*/
  await api.sendFile(
    {
      file: {
        value: Buffer.concat(stuffReturned),
        options: {
          filename: folder,
          contentType: 'text/plain',
        },
      },
    },
    result
  )
}
main({
  receiver: '6360169dba1bd2361c0bd0fe',
  message: { option: 'reportHistory' },
  user: { id: '6360169dba1bd2361c0bd0fe' },
})
