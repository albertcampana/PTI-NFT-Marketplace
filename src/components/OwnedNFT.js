import React, { Component } from 'react';

class OwnedNFT extends Component {

	render() {
		return (
            <div className="owned-nfts shadow mr-5 pl-5 pt-3 pb-3">
                {/* nfts propis */}
                <h1>Owned NFTs</h1>
                <div className="row text-center m-0 p-0">
                    { this.props.ownedNft.map((image, key) => {
                        return(
                        <div className="owned-nft card m-2 p-4" key={key} >
                            <div className="nft-image-container text-center pb-4">
                                <span class="helper"></span>
                                <img className='nft-image' src={`https://ipfs.infura.io/ipfs/${image.hash}`}/>
                            </div>
                            <p className='nft-author-collection'>By {image.author} in {image.collection}</p>
                            <p className='nft-title'>{image.title}</p>
                            <p className='nft-description'>{image.description}</p>
                            {/*<p className='nft-description'>super descripcio super molona penta rexulona</p>*/}
                            <form onSubmit = {(event) => {
                                event.preventDefault()
                                const price = key.value
                                this.props.updatePrice(price, image.id) }} >

                                {/* inputs set new price */}
                                <div className="form-group">
                                    <br></br>
                                    {/* value={image.price} */}
                                    <input
                                        id={image.id}
                                        type="number"
                                        ref={(input) => { key = input }}
                                        className="form-control mb-1"
                                        
                                        placeholder="Sell Price"
                                        required />
                                </div>
                                <div className="flex-container">
                                    <button type="submit" className="btn form-btn">Set Price</button>
                                </div>
                            </form>
                        </div>
                        )
                    })}
                </div>
            </div>
		);
	}
}

export default OwnedNFT;