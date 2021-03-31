
const { assert } = require("chai")
const Reeler = artifacts.require('./Reeler.sol')

require('chai')
     .use(require('chai-as-promised'))
     .should()

contract('Reeler', ([deployer, seller, buyer])=>{
    let reeler

    before(async () => {
        reeler = await Reeler.deployed()
    })

    describe('deployment', async ()=>{
      it('deploys successfully', async () => {
          const address = await reeler.address
          assert.notEqual(address, 0x0)
          assert.notEqual(address, '')
          assert.notEqual(address, null)
          assert.notEqual(address, undefined)
      })
      it ('has a id', async() =>{
        const id = await reeler.id()
        assert.equal(id, '1098')
        
    })
      it ('has a name', async() =>{
          const name = await reeler.name()
          assert.equal(name, 'joy')
          
      })
      it ('has a addres', async() =>{
        const addres = await reeler.addres()
        assert.equal(addres, 'mysore')
        
    })
    it ('has a state', async() =>{
        const state = await reeler.state()
        assert.equal(state, 'karnataka')
        
    })
    it ('has a pincode', async() =>{
        const pincode = await reeler.pincode()
        assert.equal(pincode, '560043')
        
    })
    })

    describe('yarns', async ()=>{
        let result, yarncount 

        before(async () => {
            result = await reeler.createYarn('kanchivaram','34kg', web3.utils.toWei('1', 'ether') , 'lilac', {from: seller})
            yarncount = await reeler.yarncount()
        })
        
        it ('creates Yarn', async() =>{
            //succes
            assert.equal(yarncount, 1)
            const event = result.logs[0].args
            assert.equal(event.owner, seller , ' is correct') 
            assert.equal(event.yid.toNumber(), yarncount.toNumber(), 'id is correct')  
            assert.equal(event.types, 'kanchivaram', 'types is correct') 
            assert.equal(event.weight, '34kg', 'weight is correct') 
            assert.equal(event.price, '1000000000000000000', 'price is correct') 
            assert.equal(event.colour, 'lilac', 'clour is correct') 

            //failure: yarn must have a name
            await reeler.createYarn('','34kg', web3.utils.toWei('1', 'ether') , 'lilac', {from: seller}).should.be.rejected;
            //failure: yarn must have a weight
            await reeler.createYarn('kanchivaram','', web3.utils.toWei('1', 'ether') , 'lilac', {from: seller}).should.be.rejected;
            //failure: yarn must have a price
            await reeler.createYarn('kanchivaram','34kg', '' , 'lilac', {from: seller}).should.be.rejected;
            //failure: yarn must have a color
            await reeler.createYarn('kanchivaram','34kg', web3.utils.toWei('1', 'ether') , '', {from: seller}).should.be.rejected;
        })
        it ('lists Yarn', async() =>{
          const yarn = await reeler.yarns(yarncount)
          assert.equal(yarn.owner, seller , ' is correct') 
          assert.equal(yarn.yid.toNumber(), yarncount.toNumber(), 'id is correct')  
          assert.equal(yarn.types, 'kanchivaram', 'types is correct') 
          assert.equal(yarn.weight, '34kg', 'weight is correct') 
          assert.equal(yarn.price, '1000000000000000000', 'price is correct') 
          assert.equal(yarn.colour, 'lilac', 'clour is correct')
        })
        it ('sells Yarn', async() =>{
            // track the seller balance before purchase
            let oldSellerBalance
            oldSellerBalance = await web3.eth.getBalance(seller)
            oldSellerBalance = new web3.utils.BN(oldSellerBalance)

            //success: buyer makes purchase
            result = await reeler.purchaseYarn(yarncount,{from: buyer, value: web3.utils.toWei('1', 'ether')})
            //check logs
            const event = result.logs[0].args
            assert.equal(event.owner, buyer , 'owner is correct') 
            assert.equal(event.yid.toNumber(), yarncount.toNumber(), 'id is correct')  
            assert.equal(event.types, 'kanchivaram', 'types is correct') 
            assert.equal(event.weight, '34kg', 'weight is correct') 
            assert.equal(event.price, '1000000000000000000', 'price is correct') 
            assert.equal(event.colour, 'lilac', 'clour is correct') 

            // check that seller recived fund
            let newSellerBalance 
            newSellerBalance = await web3.eth.getBalance(seller)
            newSellerBalance = new web3.utils.BN(newSellerBalance)


            let price
            price = web3.utils.toWei('1', 'ether')
            price = new web3.utils.BN(price)

            //console.log(oldSellerBalance, newSellerBalance, price)

            const expectedBalance = oldSellerBalance.add(price)

            assert.equal(newSellerBalance.toString(), expectedBalance.toString())

            //failure: tries to product that dose not exist i.e no valid id
            await reeler.purchaseYarn(99, {from: buyer, value: web3.utils.toWei('1', 'ether')}).should.be.rejected;
            //failure: buyer should have enough ethers
            await reeler.purchaseYarn(99, {from: buyer, value: web3.utils.toWei('0.5', 'ether')}).should.be.rejected;
            //failure: deployer tries to buy the yarn  i.e  yarn cant be purchased twice
            await reeler.purchaseYarn(99, {from: deployer, value: web3.utils.toWei('1', 'ether')}).should.be.rejected;
            //failure: buyer cant buy the yarn twice  i.e  seller cant be the buyer
            await reeler.purchaseYarn(99, {from: buyer, value: web3.utils.toWei('1', 'ether')}).should.be.rejected;
          })
      })



})


