import React from "react";
import { Link } from "react-router-dom";

function Footer() {
	return (
		<>
			<footer
				className="section footer-dark context-dark bg-dark text-white"
				style={{ background: "#2d3246" }}
			>
				<div className="container">
					<div className="row row-30">
						<div className="col-md-4 col-xl-5">
							<div className="pr-xl-4">

								<Link
									to="/"
									className="text-dark text-decoration-none fw-bold fs-4 text-white">Hamro Pasal</Link>
								<p>
									We are an award-winning ecommerce platform, dedicated to the providing best service and products at affordable rate.
								</p>

							</div>
						</div>
						<div className="col-md-4">
							<h5>Contacts</h5>
							<dl className="contact-list">
								<dt>Address:</dt>
								<dd>798 South Park Avenue, NSW, Aus</dd>
							</dl>


						</div>
						<div className="col-md-4 col-xl-3">
							<ul className="nav-list">
								<dl className="contact-list">
									<dt>phones:</dt>
									<dd>
										<a href="tel:#">01-5511221</a>
									</dd>
								</dl>
								<dl className="contact-list">
									<dt>email:</dt>
									<dd>
										<a href="mailto:#">admin@admin.com</a>
									</dd>
								</dl>
							</ul>
						</div>
						{/* Rights*/}
						<p className="rights text-center">
							<span>©&nbsp; </span>
							<span className="copyright-year">2026</span>
							<span>&nbsp;</span>
							<span>Hamro Pasal </span>
							<span>.&nbsp;</span>
							<span>All Rights Reserved. </span>
							<span>Crafted By Paramatma Khadka.</span>
						</p>
					</div>
				</div>
			</footer >
		</>
	);
}

export default Footer;
