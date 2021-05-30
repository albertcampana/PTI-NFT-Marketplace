const { assert } = require('chai')

const NftShop = artifacts.require('./NftShop.sol')

require('chai')
  .use(require('chai-as-promised'))
  .should()

contract('NftShop', ([deployer, author, tipper]) => {
  let nftShop

  before(async () => {
    nftShop = await NftShop.deployed()
  })

  describe('deployment', async () => {
    it('deploys successfully', async () => {
      const address = await nftShop.address
      assert.notEqual(address, 0x0)
      assert.notEqual(address, '')
      assert.notEqual(address, null)
      assert.notEqual(address, undefined)
    })

    it('has a name', async () => {
      const name = await nftShop.name()
      assert.equal(name, 'NftShop')
    })

    it('has an id', async () => {
      const id = await nftShop.imageId()
      assert.equal(id, '0')
    })
  })

  describe('images', async () => {
    let result, imageId, _id
    const hash = 'QmV8cfu6n4NT5xRr2AHdKxFMTZEJrA44qgrBCr739BN9Wb'

    before(async () => {
      result = await nftShop.uploadImage('titola', 12, hash, 'Image description', 'Image collection', { from: author })
      imageId = await nftShop.imageId()
      //_id = await nftShop.id(imageId)
    })

    //check event
    it('creates images', async () => {
      // SUCESS

      //assert.equal(imageId, _id)
      assert.equal(imageId, 1)
      const event = result.logs[1].args
      assert.equal(event.id.toNumber(), imageId.toNumber(), 'id is correct')
      assert.equal(event.hash, hash, 'Hash is correct')
      assert.equal(event.description, 'Image description', 'description is correct')
      assert.equal(event.collection, 'Image collection', 'collection is correct')

      // FAILURE: Image must have hash
      await nftShop.uploadImage('titola',12,'', 'Image description', 'Image collection', { from: author }).should.be.rejected;

      // FAILURE: Image must have description
      await nftShop.uploadImage('titola',12,'Image hash', '', 'Image collection', { from: author }).should.be.rejected;

      // FAILURE: Image must have collection
      await nftShop.uploadImage('titola',12,'Image hash', 'Image description', '', { from: author }).should.be.rejected;
    })
  })

  describe('usernames', async () => {
    let result, _id;
    before(async () => {
      //this.enableTimeouts(false)
      result = await nftShop.updateUsername('mama', {from: author})
      _id = await nftShop.usernames(author)
    })

    it('add name mama', async () => {
      assert.equal(_id, 1);
      const event = result.logs[0].args
      assert.equal(event.name, 'mama')
    })

    it('add name hola', async () => {
      result = await nftShop.updateUsername('hola', {from: author})
      _id = await nftShop.usernames(author)
      assert.equal(_id, 1);
      const event = result.logs[0].args
      assert.equal(event.name, 'hola')
    })

    it('add name eii', async () => {
      result = await nftShop.updateUsername('eii', {from: tipper})
      _id = await nftShop.usernames(tipper)
      assert.equal(_id, 2);
      const event = result.logs[0].args
      assert.equal(event.name, 'eii')
    })

  })

  describe('withdraw', async () => {
    let balance;

    beforeEach(async () => {        
      await nftShop.deposit({value: 1000, from: tipper})
      balance = await web3.eth.getBalance(tipper)
      await nftShop.withdraw(1000, {from: tipper})
    })

     it('balances should decrease', async () => {
      expect(Number(await web3.eth.getBalance(nftShop.address))).to.eq(0)
      expect(Number(await nftShop.etherBalanceOf(tipper))).to.eq(0)
    })
  })

  describe('deposit', async () => {
    let balance;

    beforeEach(async () => {
      await nftShop.deposit({value: 10**16, from: tipper}) //0.01 ETH
    })

    it('balance should increase', async () => {
      expect(Number(await nftShop.etherBalanceOf(tipper))).to.eq(10**16)
    })
  })

  describe('send offer', async () => {
    let result, result1, balance
    const hash = 'QmV8cfu6n4NT5xRr2AHdKxFMTZEJrA44qgrBCr739BN9Wb'

    before(async () => {
      balance = await web3.eth.getBalance(author)
      result = await nftShop.uploadImage('titola', 12, hash, 'Image description', 'Image collection', { from: author })
      result1 = await nftShop.sendOffer(1, { from: author })
    }) 
    it('deposit should be made', async () => {
      expect(Number(await web3.eth.getBalance(author))).to.be.below(Number(balance))
    })
  })

  describe('accept offer', async () => {
    
  })
})
