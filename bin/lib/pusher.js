require("dotenv").config();
const Pusher = require("pusher-js");
const axios = require("axios");
const fs = require("fs");
const _ = require("lodash");
const { getEnvironment, _asyncrequest, m_exec } = require("./helpers");
const Socket = require("./socket");
const DB = require("./database");
const SERVER = process.env.SERVER;
class PusherClient {
  constructor(key, cluster) {
    this.key = key;
    this.cluster = cluster;
    this.pusher = new Pusher(key, {
      cluster,
      authEndpoint: "/api/broadcasting/auth",

      authorizer: (channel, options) => {
        return {
          authorize: (socketId, callback) => {
            axios
              .post(SERVER + "/api/broadcasting/auth", {
                socket_id: socketId,
                channel_name: channel.name,
                options,
              })
              .then((response) => {
                callback(false, response.data);
              })
              .catch((error) => {
                callback(true, error);
              });
          },
        };
      },
    });
    this.pusher.connection.bind("connected", function () {
      console.log("Connected to Pusher");
    });
    this.pusher.connection.bind("disconnected", function () {
      console.log("Disconnected from Pusher");
    });
  }
  async connect() {
    try {
      this.env = await getEnvironment();
      if (this.env) {
        if (_.has(this.env, "userId")) {
          let channel = `private-trigger.${this.env.userId}`;
          let event = "Trigger";
          let channelUser = this.pusher.subscribe(channel);

          channelUser.bind("pusher:subscription_succeeded", async () => {
            console.log("baglandi", this.key, this.cluster, channel);
            channelUser.trigger("client-connected", {
              connected: true,
            });
          });

          channelUser.bind(event, async (data) => {
            if (data.channel == "onay") {
            } else {
              await this.sendData(data);
            }
          });

          channelUser.bind_global(function (data) {});
        }
      }
    } catch (error) {
      console.log(error);
    }
  }
  async sendData(data) {
    let socket = new Socket();
    let channel = data.channel;

    //if (channel != 'order') {
    if (typeof socket[channel] === "function") {
      let result = await socket[channel](data);
      if (_.has(result, "send")) {
        let send = result.send;

        fs.writeFileSync("./logs/" + channel + ".json", JSON.stringify(result));

        let resultChannel = send.channel;
        if (typeof socket[resultChannel] === "function") {
          await socket[send.channel](send);
        }
      }
    } else {
      console.log("channel yok");
    }
    //}
  }
}

module.exports = PusherClient;
