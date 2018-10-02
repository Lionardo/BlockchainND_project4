# Blockchain project 4 Notary service

Star Registry service that allows users to claim ownership of their favorite star.

## Framework

Express.js
with the help of express generator in this project
https://expressjs.com/

### Prerequisites

```
npm
express.js
nodemon
level
crypto-js
```
### Installing

1- npm i 

2- npm run start


###  3. Wallet address

We need a bitcoin wallet address. Use bitaddress.org.

```
My Wallet address: 19SUr6pdworo9FFouRPnG259dBZSTcBpfB
```

## Run the Project

###  1. Install the dependencies

Using "npm install xxx" to install some module.

###  2. Run the project

```
npm run start
```

###  3. Service URL

Service will be available at the following URL:

http://localhost:8000/

## Endpoint Documentation

### Blockchain ID validation routine

#### 1. Blockchain ID Validation Request

**Method**

```
GET
```

**Endpoint**

```
http://localhost:8000/requestValidation
```

**Parameters**

```
address - The bitcoin address
```

**Example**

```
curl -X "POST" "http://localhost:8000/requestValidation" \
     -H 'Content-Type: application/json; charset=utf-8' \
     -d $'{
  "address": "19SUr6pdworo9FFouRPnG259dBZSTcBpfB"
}'
```

**Response Example**

```
{
    "address": "19SUr6pdworo9FFouRPnG259dBZSTcBpfB",
    "message": "19SUr6pdworo9FFouRPnG259dBZSTcBpfB:1538519317:starRegistry",
	"requestTimeStamp": 1538520582,
    "validationWindow": 300
}
```

#### 2. Blockchain ID Message Signature Validation

To get the signature parameter using Electrum Bitcon Wallet: Tools → Sign/verify message. 
Use address and message parameters that we got from Blockchain ID Validation Request endpoint response.

**Method**

```
POST
```

**Endpoint**

```
http://localhost:8000/message-signature/validate
```

**Parameters**

```
address - The bitcoin address that you used
signature - Take it from the Electrum wallet
```

**Example**

```
curl -X "POST" "http://localhost:8000/message-signature/validate" \
     -H 'Content-Type: application/json; charset=utf-8' \
     -d $'{
  "address": "19SUr6pdworo9FFouRPnG259dBZSTcBpfB",
  "signature": "IOd5QK4cDReUOv9NSSvehgG9u+W44+KawXgc4zxHp98XAgQ3+iYYgGrCWsmR5sbh+tmTWhm7Fm10pKHbBv1Ct3U="
}'
```

**Response Example**

```
{
    "registerStar": true,
    "status": {
        "address": "19SUr6pdworo9FFouRPnG259dBZSTcBpfB",
        "message": "19SUr6pdworo9FFouRPnG259dBZSTcBpfB:1537630417820:starRegistry",
		"timeStamp": 1537630417820,
        "validationWindow": 243,
        "messageSignature": "valid"
    }
}
```

### Star registration Endpoint

#### 3. Stars Registration

**Method**

```
POST
```

**Endpoint**

```
http://localhost:8000/block
```

**Parameters**

```
address - The bitcoin address that you used
star - Containing dec, ra and story
```

**Example**

```
curl -X "POST" "http://localhost:8000/block" \
     -H 'Content-Type: application/json; charset=utf-8' \
     -d $'{
  "address": "19SUr6pdworo9FFouRPnG259dBZSTcBpfB",
  "star": {
    "dec": "-26° 29'\'' 24.9",
    "ra": "16h 29m 1.0s",
    "story": "Found star using https://www.google.com/sky/"
  }
}'
```

**Response Example**

```
{
    "hash": "2eb83385f12709dbfeb33c67eb25394868d64e3f3e8c05c886320cc21c764916",
    "height": 1,
    "body": {
        "address": "19SUr6pdworo9FFouRPnG259dBZSTcBpfB",
        "star": {
            "dec": "-26° 29'\'' 24.9",
            "ra": "16h 29m 1.0s",
            "story": "466f756e642073746172207573696e672068747470733a2f2f7777772e676f6f676c652e636f6d2f736b792f"
			"storyDecoded": "Found star using https://www.google.com/sky/"
        }
    }
    "time": "1537668090",
    "previousBlockHash": "98db1e26c067711b1ea67606a35aafda8cc26f181d42a1f8586aadc38352977d",
}
```

### Star Lookup

#### 4. Stars Lookup by Wallet Address

**Method**

```
GET
```

**Endpoint**

```
http://localhost:8000/stars/address:address
```

**Parameters**

```
address - The bitcoin address that you used
```

**Example**

```
curl "http://localhost:8000/stars/address:19SUr6pdworo9FFouRPnG259dBZSTcBpfB"
```

**Response Example**
```
{
    "hash": "2eb83385f12709dbfeb33c67eb25394868d64e3f3e8c05c886320cc21c764916",
    "height": 1,
    "body": {
        "address": "19SUr6pdworo9FFouRPnG259dBZSTcBpfB",
        "star": {
            "dec": "-26° 29' 24.9",
            "ra": "16h 29m 1.0s",
            "story": "466f756e642073746172207573696e672068747470733a2f2f7777772e676f6f676c652e636f6d2f736b792f",
            "storyDecoded": "Found star using https://www.google.com/sky/"
        }
    }
	"time": "1537668090",
	"previousBlockHash": "98db1e26c067711b1ea67606a35aafda8cc26f181d42a1f8586aadc38352977d",
}
```

#### 5. Star Lookup by Block Hash

**Method**

```
GET
```

**Endpoint**

```
http://localhost:8000/stars/hash:hash
```

**Parameters**

```
hash - The hash of one block created
```

**Example**
```
curl "http://localhost:8000/stars/hash:2eb83385f12709dbfeb33c67eb25394868d64e3f3e8c05c886320cc21c764916"
```

**Response Example**
```
{
    "hash": "2eb83385f12709dbfeb33c67eb25394868d64e3f3e8c05c886320cc21c764916",
    "height": 1,
    "body": {
        "address": "1JhzgwjPp8xGswhfNHvoPmiANTe21r6Wq3",
        "star": {
            "dec": "-26° 29' 24.9",
            "ra": "16h 29m 1.0s",
            "story": "466f756e642073746172207573696e672068747470733a2f2f7777772e676f6f676c652e636f6d2f736b792f",
            "storyDecoded": "Found star using https://www.google.com/sky/"
        }
    }
	"time": "1537668090",
	"previousBlockHash": "98db1e26c067711b1ea67606a35aafda8cc26f181d42a1f8586aadc38352977d",
}
```

#### 6. Star Lookup by Block Height

**Method**

```
GET
```

**Endpoint**

```
http://localhost:8000/block/:height
```

**Parameters**

```
height - The height of block
```

**Example**
```
curl "http://localhost:8000/block/1"
```

**Response Example**
```
{
    "hash": "2eb83385f12709dbfeb33c67eb25394868d64e3f3e8c05c886320cc21c764916",
    "height": 1,
    "body": {
        "address": "1JhzgwjPp8xGswhfNHvoPmiANTe21r6Wq3",
        "star": {
            "dec": "-26° 29' 24.9",
            "ra": "16h 29m 1.0s",
            "story": "466f756e642073746172207573696e672068747470733a2f2f7777772e676f6f676c652e636f6d2f736b792f",
            "storyDecoded": "Found star using https://www.google.com/sky/"
        }
    }
	"time": "1537668090",
	"previousBlockHash": "98db1e26c067711b1ea67606a35aafda8cc26f181d42a1f8586aadc38352977d",
}
```
If the block wasn't found, it was showed:

```
{
	"status":404,"message":
	"Block not found"
}
```

## Udacity honor

Udacity Project4 Concepts section

Udacity slack of nanodegree
