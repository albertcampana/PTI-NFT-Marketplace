import React, { Component } from 'react';

class FormName extends Component {

	render() {
		return (
			<div className="name-form shadow p-5">
				{/* formulari name */}
				{/* titol formulari */}
				<h3 className="center-text">WHAT IS YOUR NAME?</h3>
				{this.props.name.length > 0? <p className="center-text">Your actual name is <em>{this.props.name}</em></p>:null}
				<form onSubmit = {(event) => {
					event.preventDefault()
					const username = this.username.value
					this.props.updateName(username) }} >

					{/* inputs info */}
					<div className="form-group">
						<br></br>
						{/* input nom */}
						<input
							id="username"
							type="text"
							ref={(input) => { this.username = input }}
							className="form-control mb-1"
							placeholder="Your name"
							required />
					</div>
					{/* inputs info */}
					<div className="flex-container">
						<button type="submit" className="btn form-btn">Update</button>
					</div>
				</form>
			</div>
		);
	}
}

export default FormName;