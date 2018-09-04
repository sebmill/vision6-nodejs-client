# Vision6 NodeJS Client

This Vision6 client is dependency-free and promised-based. It is modelled of Vision6's [PHP client](http://developers.vision6.com.au/files/guide/getting_started/examples.zip) implementation.

The Vision6 API Developer documentation [can be found here](https://developer.vision6.com.au).

## Installing

```bash
npm install --save vision6-nodejs-client
```

## Using

Example:

```javascript
const Vision6 = require('vision6-nodejs-client');

const api_key = 'API_KEY';
const v6 = new Vision6(api_key);

v6.invokeMethod('searchLists')
    .then(function (lists) {
        console.log(`Found ${lists.length} lists for this account.`);
    })
    .catch(function (err) {
        console.error(err);
    });
```

The example shown above demonstrates how any [method](https://developers.vision6.com.au/3.3/method/) can be invoked. Similar to the PHP client, a number of optional arguments can be passed onto the function which will be used for the method invoked.


## Methods

### Unwrapped Methods

- `Vision6.invoke(method, [optional_arg1, optional_arg2, ...])`

