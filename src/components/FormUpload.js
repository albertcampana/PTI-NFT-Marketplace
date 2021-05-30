import React, { Component } from 'react';
import IconPublishRounded from '@material-ui/icons/PublishRounded'

class FormUpload extends Component {

	render() {
		return (
            <div className="upload-form shadow p-5">
                {/* formulari upload */}
                {/* titol formulari */}
                <h3 className="center-text">UPLOAD YOUR NFT!</h3>

                <form onSubmit = {(event) => {
                    event.preventDefault()
                    const title = this.imageTitle.value
                    const description = this.imageDescription.value
                    const collection = this.imageCollection.value
                    const price = this.imagePrice.value
                    this.props.uploadImage(title, collection, description, price) }} >

                    {/* seleccionar arxiu */}
                    <div className="flex-container">
                        {this.props.fileName === 'Choose a file...'?
                            <label htmlFor="upload-file" className="upload-file-label"> <IconPublishRounded/> </label>:
                            <label htmlFor="upload-file" className="uploaded-file-label"> <IconPublishRounded/> </label>}
                        <input type='file' id='upload-file' className="file-input" accept=".jpg, .jpeg, .png, .bmp, .gif" onChange={this.props.captureFile} />
                    </div>
                    <div className="flex-container">
                        <p>{this.props.fileName}</p>
                    </div>

                    {/* inputs info */}
                    <div className="form-group">
                        {/* input title */}
                        <input
                            id="imageTitle"
                            type="text"
                            ref={(input) => { this.imageTitle = input }}
                            className="form-control mb-1"
                            placeholder="NFT title"
                            required />
                        {/* input coleccio */}
                        <input
                            id="imageCollection"
                            type="text"
                            ref={(input) => { this.imageCollection = input }}
                            className="form-control mb-1"
                            placeholder="NFT collection"
                            required />
                        {/* input descripcio */}
                        <input
                            id="imageDescription"
                            type="text"
                            ref={(input) => { this.imageDescription = input }}
                            className="form-control mb-1"
                            placeholder="NFT description"
                            required />
                            {/* input descripcio */}
                        <input
                            id="imagePrice"
                            type="number"
                            ref={(input) => { this.imagePrice = input }}
                            className="form-control mb-1"
                            placeholder="NFT price"
                            required />
                    </div>

                    {/* boto upload */}
                    <div className="flex-container">
                        <button type="submit" className="btn form-btn">Upload</button>
                    </div>
                </form>
            </div>
		);
	}
}

export default FormUpload;