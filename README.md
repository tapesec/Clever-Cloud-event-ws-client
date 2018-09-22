# Clever-Cloud-event-ws-client

A client for connect to Clever Cloud event API

# How to

You need to obtain an oauth1 header.
Simplest way is to connect to your clever cloud dashboard, open your browser's console and copy past the code below.

```javascript
API.session.getHMACAuthorization(
  "GET",
  Console.configuration.API_HOST + "/events/",
  {},
  Console.LoginAs.getTokens()
);
```

In deployment-listener, replace the exemple header line 4 by this new one :

```shell
npm install
```

```shell
node deployment-listener.js --<APP_NAME>
```

now, the client listening to deployment events for the app_name given in param
