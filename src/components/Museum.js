import React, { Component } from 'react';

class Museum extends Component {

	render() {
		return (
            <div className="pl-2 pr-2 pt-0 pb-3">
                {/* artistes */}
                <h1>Museum</h1>
                <div> {this.props.museum.map((artist, key) => {
                    return (
                    <div key={key} className="card mb-4 center shadow">
                        {/* header artista */}
                        <div className="card-header row m-0 pl-3 pt-3 pr-3 pb-2">
                            <img
                                className='mr-2'
                                width='30'
                                height='30'
                                src={`https://gradient-avatar.glitch.me/${artist[0][0][6]}`}
                            />
                            <p className="artist-name text-muted">{artist[0][0].author}</p>
                        </div>
                        {/* nfts */}
                        <div className="card-body">
                            { artist.map((collection, key) => {
                                return (
                                    <div key={key} className="card mb-4 center shadow">
                                        {/* header artista */}
                                        <div className="card-header row m-0 pl-3 pt-3 pr-3 pb-2">
                                            <p className="artist-name text-muted">{collection[0].collection}</p>
                                        </div>
                                        {/* nfts */}
                                        <div className="card-body row m-0 p-0 collection-card">
                                            { collection.map((image) => {
                                                return(
                                                <div className="nft card m-2 p-0" key={image.id} >
                                                    <div className="nft-image-container text-center p-3">
                                                        <span className="helper"></span>
                                                        <img className='nft-image' src={`https://ipfs.infura.io/ipfs/${image.hash}`}/>
                                                    </div>
                                                    <p className='nft-title'>{image.title}</p>
                                                    <p className='nft-description pb-5 pl-2 pr-2'>{image.description}</p>
                                                    { image.price === '0' || image.price === 0 ? null : 
                                                        <div className='row m-0 p-0 price-btn-div'>
                                                            <p className='price-tag fifty center-text'>{image.price} ETH</p>
                                                            { image.owner === this.props.account ? null : 
                                                                <button className='fifty btn buy-btn p-0 m-0' onClick={this.props.buyNFT.bind(this, image.id)}>
                                                                BUY</button>}
                                                            
                                                        </div> }
                                                    
                                                </div>
                                                )
                                            })}
                                        </div>
                                        
                                    </div>
                                )
                            })}
                        </div>
                        
                    </div>
                    )
                })}
                </div>
            </div>
		);
	}
}

export default Museum;