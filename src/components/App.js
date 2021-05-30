import React, { Component } from 'react';
import Web3 from 'web3'

import Navbar from './Navbar'
import Main from './Main'

import NftShop from '../abis/NftShop.json'
import './App.css';


//Declare IPFS
const ipfsClient = require('ipfs-http-client')
const ipfs = ipfsClient({ host: 'ipfs.infura.io', port: 5001, protocol: 'https' }) // leaving out the arguments will default to these values
var imageId = 0
var userId = 0

class App extends Component {

	async componentWillMount() {
		await this.loadWeb3()
		await this.loadBlockchainData()
	}

	async loadWeb3() {
		if (window.ethereum) {
			window.web3 = new Web3(window.ethereum)
			await window.ethereum.enable()
		}
		else if (window.web3) {
			window.web3 = new Web3(window.web3.currentProvider)
		}
		else {
			window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!')
		}
	}

	async sortNFT(){
		this.state.nftSort = [...this.state.nft]
		this.setState({
			nftSort: this.state.nftSort.sort((a, b) => a[6] === b[6] ? a.collection.localeCompare(b.collection):a[6].localeCompare(b[6]))
		})
	}

	async loadNames() {
		userId = await this.state.contract.methods.userId().call()
		
		for (var j = 0; j < userId; j++) {
			const name = await this.state.contract.methods.names(j).call()
			this.setState({
				usernames: [...this.state.usernames, name]
			})
	
			if(name.userAddress === this.state.account) this.setState({
				name: name.username
			})
		}
	}

	async loadNFTs() {
		imageId = await this.state.contract.methods.imageId().call()
		//imageId = imageId
		
		for (var j = 0; j < imageId; j++) {
			const image = await this.state.contract.methods.images(j+1).call()
			const _id = await this.state.contract.methods.id(image.id).call()
			for(var i = 0; i < userId; i++){
				if(image.author === this.state.usernames[i].userAddress) {
					image.author = this.state.usernames[i].username
				}
			}
			
			this.setState({
				nft: [...this.state.nft, image]
			})
		}
	}

	async loadOwnedNFTs() {
		let balanceOf = await this.state.contract.methods.balanceOf(this.state.account).call();
		for (let i = 0; i < balanceOf; i++) {
			let id = await this.state.contract.methods.tokenOfOwnerByIndex(this.state.account, i).call();
			this.setState({
				ownedNft: [...this.state.ownedNft, this.state.nft[id - 1]]
			});
		}
	}

	async buildMuseumArray() {
		let museum = [];

		for (var j = 0; j < imageId; j++) {
			let art = this.state.nftSort[j][6];
			let arr = [];
			for (var i = j; i < imageId && art === this.state.nftSort[i][6]; i++) {
				let col = this.state.nftSort[i].collection;
				let arr2 = [];
				for (var z = i; z < imageId && col === this.state.nftSort[z].collection; z++) {
					arr2.push(this.state.nftSort[z]);

					i = z;
				}
				arr.push(arr2);
				j = i;
			}
			museum.push(arr);
		}
		this.setState({
			museum: museum
		});

	}

	async loadBlockchainData() {
		const web3 = window.web3
		// Load account
		const accounts = await web3.eth.getAccounts()
		this.setState({ account: accounts[0] })

		const networkId = await web3.eth.net.getId()
		const networkData = NftShop.networks[networkId]
		if(networkData) {
			const abi = NftShop.abi
			const address = networkData.address
			const contract = new web3.eth.Contract(abi, address)
			this.setState({ contract })			

			// Load names
			await this.loadNames()

			// Load images
			await this.loadNFTs()
			
			// Get owned NFTs
			await this.loadOwnedNFTs();

			// Sort nfts by author and collection
			await this.sortNFT();

			// Build proper array for museum component
			this.buildMuseumArray();

			this.setState({ loading: false})
		} else {
			window.alert('Smart contract not deployed to detected network.')
		}
	}

	captureFile = event => {

		event.preventDefault()
		const file = event.target.files[0]
		const fileName = event.target.value.split('\\')
		this.state.fileName = fileName[2]
		if (file!== undefined) {
			const reader = new window.FileReader()
			reader.readAsArrayBuffer(file)
		
			reader.onloadend = () => {
				this.setState({ buffer: Buffer(reader.result) })
			}
		} else {
			this.setState({ buffer: undefined }) 
		}
	  }
	
	uploadImage = (title, collection, description, price) => {
		this.state.fileName = 'Choose a file...'
		// price must be >= 0
		if(price < 0) price = 0
		//adding file to the IPFS
		if(this.state.buffer!== undefined && collection !== ""){
			ipfs.add(this.state.buffer, (error, result) => {
				if(error) {
					console.error(error)
					return
				}

				this.setState({ loading: true })
				//string memory _title, uint _price, string memory _imgHash, string memory _description, string memory _collection
				this.state.contract.methods.uploadImage(title, price, result[0].hash, description, collection).send({ from: this.state.account }).once('receipt', (receipt) => {
					// NFT creat i penjat
					let newNFT = receipt.events.TokenCreated.returnValues
					
					imageId++

					//this.loadNames()
					if(this.state.name !== '') {newNFT.author = this.state.name}

					// Afegim el nou NFT al array de nft
					this.setState({
						nft: [...this.state.nft, newNFT]
					})

					// Afegim el nou NFT al array dels nft de l'usuari
					this.setState({
						ownedNft: [...this.state.ownedNft, newNFT]
					})

					// sort nfts by author and collection
					this.sortNFT();

					// rebuild museum component array
					this.buildMuseumArray();
					
					//this.forceUpdate();
					this.setState({ loading: false })
					
				})
				

			})
		} else {
			window.alert('No image or collection selected')
		}
	}

	updateThisName(username) {

		// recorrer this.state.museum
		for(var i = 0; i < this.state.museum.length; i++) {
			// quan trobem l'array de l'artista canviar el nom dels nfts de totes les coleccions seves
			if(this.state.museum[i][0][0][6] === this.state.account) {
				for(var j = 0; j < this.state.museum[i].length; j++){
					for(var z = 0; z < this.state.museum[i][j].length; z++){
						this.state.museum[i][j][z].author = username
					}
				}
			}
		}
	}

	updateName = (userName) => {
		this.setState({ loading: true })
		this.state.contract.methods.updateUsername(userName).send({ from: this.state.account }).once('receipt', (receipt) => {
			this.setState({ name: userName })
			this.updateThisName(userName)
			this.setState({ loading: false })
		})
	}

	updateThisPrice(price, tokenId) {
		const nft = this.state.nft[tokenId-1]
		// recorrer this.state.museum
		for(var i = 0; i < this.state.museum.length; i++) {
			// quan trobem l'array de l'artista cal buscar la col.leccio
			if(this.state.museum[i][0][0][6] === nft[6]) {
				for(var j = 0; j < this.state.museum[i].length; j++){
					if(this.state.museum[i][j][0][5] === nft.collection) {
						for(var z = 0; z < this.state.museum[i][j].length; z++){
							if(this.state.museum[i][j][z].id === nft.id) {
								this.state.museum[i][j][z].price = price
								this.state.museum[i][j][z].owner = this.state.account
							}
						}
					}
				}
			}
		}
	}

	updatePrice = (price, tokenId) => {
		// price must be >= 0
		if(price < 0) price = 0
		this.setState({ loading: true })
		this.state.contract.methods.allowBuy(tokenId, price).send({ from: this.state.account }).once('receipt', (receipt) => {
			this.updateThisPrice(price, tokenId)
			this.setState({ loading: false })
		})
	}

	buyNFT = (nftId) => {
		const web3 = window.web3
		let nftPos = nftId-1
		this.state.contract.methods.buy(nftId).send({ from: this.state.account, value: web3.utils.toWei(this.state.nft[nftPos].price, 'Ether') }).once('receipt', (receipt) => {
			this.updateThisPrice(0,nftId)
			this.setState({
				ownedNft: [...this.state.ownedNft, this.state.nft[nftId - 1]]
			});
			this.setState({ loading: false })
		})
	}

	constructor(props) {
		super(props)
		this.state = {
			account: '',
			contract: null,
			museum: [[[]]],
			nft: [],
			nftSort: [],
			ownedNft: [],
			nftShop: null,
			loading: true,
			usernames: [],
			name: '',
			fileName: 'Choose a file...'
		}

		this.updateName = this.updateName.bind(this)
		this.uploadImage = this.uploadImage.bind(this)
    	this.captureFile = this.captureFile.bind(this)
		this.buyNFT = this.buyNFT.bind(this)
		this.updatePrice = this.updatePrice.bind(this)
	}

	render() {
		return (
			<div>
				<Navbar account={this.state.account} />
				{ this.state.loading
					? <div id="loader" className="loading-text text-center"><p>Loading...</p></div>
					: <Main
						account={this.state.account}
						museum={this.state.museum}
						ownedNft={this.state.ownedNft}
						nft={this.state.nft}
						name={this.state.name}
						fileName={this.state.fileName}
						captureFile={this.captureFile}
						uploadImage={this.uploadImage}
						updateName={this.updateName}
						buyNFT={this.buyNFT}
						updatePrice={this.updatePrice}
					/>
				}
			</div>
		);
	}
}

export default App;
