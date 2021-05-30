import React, { Component } from 'react';

import './Main.css'
import Museum from './Museum'
import FormName from './FormName'
import FormUpload from './FormUpload';
import OwnedNFT from './OwnedNFT';

class Main extends Component {

	render() {
		return (
			<div className="main container-fluid">
				<Museum 
					account={this.props.account}
					museum={this.props.museum}
					buyNFT={this.props.buyNFT} />
				<hr/>
				<div className="row p-0 m-0">
					<OwnedNFT
						ownedNft={this.props.ownedNft}
						updatePrice={this.props.updatePrice}/>

					{/* formularis */}
					<div className="forms">
						<FormName 
							name={this.props.name}
							updateName={this.props.updateName}/>		
						<br></br><br></br>
						<FormUpload
							fileName={this.props.fileName}
							mint={this.props.mint}
							captureFile={this.props.captureFile}
							uploadImage={this.props.uploadImage}/>	
					</div>
				</div>
			</div>
			
		);
	}
}

export default Main;