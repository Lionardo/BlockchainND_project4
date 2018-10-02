
const compression = require('compression')
const express = require('express')
const router = express()
const bodyParser = require('body-parser')
const Block = require('./block')
const Blockchain = require('./blockchain')
const blockchain = new Blockchain()
const StarValidation = require('./starValidation')

router.use(compression())
router.listen(8000, () => console.log('listening port: 8000'))
router.use(bodyParser.json())
router.get('/', (req, res) => res.status(404).json({ 
  "status": 404,
  "message": "Please check endpoints" 
}))

validateAddressParameter = async (req, res, next) => {
  try {
    const starValidation = new StarValidation(req)
    starValidation.validateAddressParameter()
    next()
  } catch (error) {
    res.status(400).json({
      status: 400,
      message: error
    })
  }
}

validateSignatureParameter = async (req, res, next) => {
  try {
    const starValidation = new StarValidation(req)
    starValidation.validateSignatureParameter()
    next()
  } catch (error) {
    res.status(400).json({
      status: 400,
      message: error
    })
  }
}

validateNewStarRequest = async (req, res, next) => {
  try {
    const starValidation = new StarValidation(req)
    starValidation.validateNewStarRequest()
    next()
  } catch (error) {
    res.status(400).json({
      status: 400,
      message: error
    })
  }
}


router.post('/requestValidation', async (req, res) => {
    const starValidation = new StarValidation(req)
    const address = req.body.address

    try {
      data = await starValidation.getPendingAddressRequest(address)
    } catch (error) {
      data = await starValidation.saveNewRequestValidation(address)
    }

    res.json(data)
})

router.post('/message-signature/validate', async (req, res) => {
  const starValidation = new StarValidation(req)

  try {
    starValidation.validateAddressAndSignatureParameters()
  } catch (error) {
    res.status(400).json({
      status: 400,
      message: error
    })
    return
  }

  try {
    const { address, signature } = req.body
    const response = await starValidation.validateMessageSignature(address, signature)

    if (response.registerStar) {
      res.json(response)
    } else {
      res.status(401).json(response)
    }
  } catch (error) {
    res.status(404).json({
      status: 404,
      message: error
    })
  }
})

router.get('/block/:height', async (req, res) => {
  try {
    const response = await blockchain.getBlock(req.params.height)
    res.send(response)
  } catch (error) {
    res.status(404).json({ 
      "status": 404,
      "message": 'This block is not found' 
    })
  }
})

router.get('/stars/address:address', async (req, res) => {
  try {
    const address = req.params.address.slice(1)
    const response = await blockchain.getBlocksByAddress(address)

    res.send(response)
  } catch (error) {
    res.status(404).json({
      status: 404,
      message: 'Block not found'
    })
  }
})

router.get('/stars/hash:hash', async (req, res) => {
  try {
    const hash = req.params.hash.slice(1)
    const response = await blockchain.getBlockByHash(hash)

    res.send(response)
  } catch (error) {
    res.status(404).json({
      status: 404,
      message: 'Block not found'
    })
  }
})

router.post('/block', async (req, res) => {
    const starValidation = new StarValidation(req)
    try {
      const isValid = await starValidation.isValid()
      if (!isValid) {
        throw 'Signature is not valid'
      }
    } catch (error) {
      res.status(401).json({
        status: 401,
        message: error
      })
      return
    }
    const body = { address, star } = req.body
    const story = star.story

    body.star = {
      dec: star.dec,
      ra: star.ra,
      story: new Buffer(story).toString('hex'),
      mag: star.mag,
      con: star.con
    }
    await blockchain.addBlock(new Block(body))
    const height = await blockchain.getBlockHeight()
    const response = await blockchain.getBlock(height)
    starValidation.invalidate(address)
    res.status(201).send(response)
})