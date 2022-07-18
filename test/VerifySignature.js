const {expect} = require("chai")
const {ethers} = require("hardhat")

describe("VerifySignature", function(){
    it("Verify signature", async function() {
        const accounts = await ethers.getSigners(2)
        const VerifySignature = await ethers.getContractFactory("VerifySignature")
        const contract = await VerifySignature.deploy()
        await contract.deployed()

        const signer = accounts[0]
        const receiver = accounts[1]
        const amount = 666
        const message = "TestMessage"
        const nonce = 111

        const hash = await contract.getMessageHash(receiver.address, amount, message, nonce) 
        const sig = await signer.signMessage(ethers.utils.arrayify(hash))
        
        // recovering signer from hash
        const ethHash = await contract.getEthSignedMessageHash(hash)
        const recovered_signer = await contract.recoverSigner(ethHash, sig)
        console.log("Signer:", signer.address)
        console.log("Recovered signer:", recovered_signer)

        expect(await contract.verify(signer.address, receiver.address, amount, message, nonce, sig)).to.equal(true)
        expect(await contract.verify(signer.address, receiver.address, amount, "message", nonce, sig)).to.equal(false)

    })
})