import React, { Component } from 'react';

import './Navbar.css'

class Navbar extends Component {

	render() {
		return (
			<nav className="navbar fixed-top flex-md-nowrap shadow">

				<a  className="navbar-brand col-sm-3 col-md-2 mr-0"
					href="http://localhost:3000/"
					target="_blank"
					rel="noopener noreferrer"> PTI Project </a>

				<ul className="navbar-nav px-3">
					<li className="nav-item text-nowrap d-none d-sm-none d-sm-block">
						{/* account id */}
						<small className="account" id="account">{this.props.account}</small>
						{/* account image */}
						{ this.props.account
							?
							<span className="round">
								<img
									className='ml-2'
									width='30'
									height='30'
									src={`https://gradient-avatar.glitch.me/${this.props.account}`}
								/>
							</span>
							:
							<span></span>
						}
					</li>
				</ul>
			</nav>
		);
	}
}

export default Navbar;