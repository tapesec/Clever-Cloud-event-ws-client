#!/usr/bin/env node
if (process.argv.length !== 4) throw new Error("Bad cmd parameter !");
const APP_NAME = process.argv[3];
const AUTHORIZATION_HEADER = `OAuth realm="https://api.clever-cloud.com/v2/oauth", oauth_consumer_key="XXXX", oauth_token="XXXXX", oauth_signature_method="HMAC-SHA512", oauth_signature="XXXXX", oauth_timestamp="XXXXX", oauth_nonce="XXXXX"`;

var WebSocketClient = require("websocket").client;
var client = new WebSocketClient({ closeTimeout: 20000 });

client.on("connectFailed", function(error) {
  console.log("Connect Error: " + error.toString());
});

client.on("connect", function(connection) {
  console.log("WebSocket Client Connected");
  connection.on("error", function(error) {
    console.log("Connection Error: " + error.toString());
  });
  connection.on("close", function(reasonCode, description) {
    console.log(reasonCode, description);
    console.log("Connection Closed");
  });
  connection.on("message", function(message) {
    if (message.type === "utf8" && message.utf8Data) {
      const parsedMessage = JSON.parse(message.utf8Data);
      const application = parsedMessage.application;
      if (parsedMessage.event) console.log(parsedMessage.event);
      if (
        application &&
        application.name === APP_NAME &&
        parsedMessage.event === "DEPLOYMENT_SUCCESS"
      ) {
        console.log("Deployment finished successfully ! next step …");
        connection.close();
      }
      if (
        application &&
        application.name === APP_NAME &&
        parsedMessage.event === "DEPLOYMENT_FAIL"
      ) {
        console.log("Deployment failed ! stop pipeline …");
        process.exit(1);
      }
    }
  });

  function auth() {
    if (connection.connected) {
      console.log("sending authentication request …");
      connection.send(
        JSON.stringify({
          message_type: "oauth",
          authorization: AUTHORIZATION_HEADER
        })
      );
      console.log("authentication request sended …");
    }
  }
  auth();
});

client.connect("wss://api.clever-cloud.com/v2/events/event-socket");
