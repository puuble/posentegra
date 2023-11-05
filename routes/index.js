const Query = require("../bin/lib/query");
var express = require("express");
const path = require("path");
const Api = require("../bin/lib/api");
const DB = require("../bin/lib/database");
const { getEnv, _asyncrequest, m_exec } = require("../bin/lib/helpers");
var router = express.Router();
const db = new DB();

router.get("/upload-panel", async function (req, res) {
  res.sendFile(path.join(__dirname, "../dist", "index.html"));
});

router.get("/", async function (req, res) {
  res.sendFile(path.join(__dirname, "../dist", "index.html"));
});

router.get("/onayKodu", async function (req, res) {
  res.sendFile(path.join(__dirname, "../dist", "index.html"));
});

router.get("/sendAgain", async function (req, res) {
  let env = await getEnv();
  let sonuc = false;
  if (req.query.id) {
    sonuc = await _asyncrequest(
      "/api/again?id=" + req.query.id,
      "GET",
      {},
      {
        Authorization: "Bearer " + env.token,
      }
    ).catch((e) => console.log("SERVERDAN", e));
  }

  return res.json(sonuc);
});

router.get("/odemeTipiGonder", async (req, res, next) => {
  let env = await getEnv();
  let result = {
    channel: "getOdemeTipi",
    message: { ot: req.query.ot },
    sender: env.userId,
    receiver: env.userId,
  };
  let sonuc = await _asyncrequest("/api/trigger", "POST", result, {
    Authorization: "Bearer " + env.token,
  }).catch((e) => console.log("SERVERDAN"));
  console.log(sonuc, "SERVERDAN");

  return res.json({ success: true });
});

router.get("/tarihGonder", async (req, res, next) => {
  let id = req.query.id;

  if (id) {
    const env = await getEnv();
    let api = new Api();
    let query = new Query();

    let frm = {
      message: {
        id,
      },
      channel: "tarihGonder",
      sender: env.userId,
      receiver: env.userId,
      broadcast: false,
    };

    let send = await api.send(frm);
    let q = `mutation m1 {
          postBroadcastMessage(message: "ENT- Wp Gönder - ${send.result.samba_id}") {
            message
          }
        }`;
    await query.getQueryWithText(q);
    return res.json({ success: true });
  }

  res.json({ success: true });
});

router.get("/raporGonder", async (req, res, next) => {
  try {
    const env = await getEnv();
    let api = new Api();
    console.log(req.query.name);
    let frm = {
      message: {
        name: req.query.name,
      },
      channel: "raporGonder",
      sender: env.userId,
      receiver: env.userId,
      broadcast: true,
    };
    console.log(frm);
    await api.send(frm);
    return res.json({ success: true });
  } catch (error) {
    console.log(error);
  }
});
router.get("/push", async (req, res, next) => {
  try {
    const env = await getEnv();
    let api = new Api();

    let frm = {
      message: {
        notification: { title: req.query.title, body: req.query.body },
        data: {
          pin: req.query.pin,
          icon: req.query.icon,
        },
      },
      channel: "notification",
      sender: env.userId,
      receiver: env.userId,
      broadcast: false,
    };
    console.log(frm);
    await api.send(frm);
    return res.json({ success: true });
  } catch (error) {
    console.log(error);
  }
});

router.post("/upload", async (req, res) => {
  let env = await getEnv();
  let trigger = await _asyncrequest("/api/authenticateWithToken", "POST", { token: env.token }, {}).catch((e) => {
    req.session.fail = true;
    //console.log(e)
    // return res.redirect(301, '/')
  });

  if (!trigger) {
    req.session.fail = true;
  }

  if (trigger.success) {
    let api = new Api();
    let filename = "";
    const bb = busboy({ headers: req.headers });
    bb.on("file", async (name, file, info) => {
      filename = info.filename;
      const saveTo = path.join(__dirname, filename);
      file.pipe(fs.createWriteStream(saveTo));
      console.log(filename);
      await api.sendFile(
        {
          file: {
            value: req.file,
            options: {
              filename: filename,
              contentType: "text/plain",
            },
          },
        },
        {}
      );
    });

    req.pipe(bb);
  } else {
    req.session.fail = true;
  }

  return res.redirect(301, "/");
});

module.exports = router;
