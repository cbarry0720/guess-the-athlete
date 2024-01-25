import React from "react";
import "../styles/Frontpage.css";

export default function FrontpageModern() {
	return (
		<div className="main-container">
			<div className="league-container">
				<h2>All Leagues</h2>
				<div className="content-container">
					<form>
						<div className="active-container">
							<input type="checkbox" />
							<label>Active Players Only</label>
						</div>
						<div className="difficulty-container">
							<label>Select Difficulty</label>
							<select>
								<option>Easy</option>
								<option>Medium</option>
								<option>Hard</option>
								<option>Random</option>
							</select>
						</div>
					</form>
				</div>
			</div>
			<div className="league-container">
				<h2>NBA</h2>
				<div className="content-container">
					<form>
						<div className="active-container">
							<input type="checkbox" />
							<label>Active Players Only</label>
						</div>
						<div className="difficulty-container">
							<label>Select Difficulty</label>
							<select>
								<option>Easy</option>
								<option>Medium</option>
								<option>Hard</option>
								<option>Random</option>
							</select>
						</div>
					</form>
				</div>
			</div>
			<div className="league-container">
				<h2>MLB</h2>
				<div className="content-container">
					<form>
						<div className="active-container">
							<input type="checkbox" />
							<label>Active Players Only</label>
						</div>
						<div className="difficulty-container">
							<label>Select Difficulty</label>
							<select>
								<option>Easy</option>
								<option>Medium</option>
								<option>Hard</option>
								<option>Random</option>
							</select>
						</div>
					</form>
				</div>
			</div>
		</div>
	);
}
