import React, { useEffect, useState } from "react";
import axios from "axios";

function PlayerItem({ link }) {
	//load script tag
	useEffect(() => {
		if (window && document) {
			const script = document.createElement("script");
			const body = document.getElementsByClassName("player-table")[0];
			script.src = link;
			body.appendChild(script);
		}
	}, [link]);

	return <div className="player-table"></div>;
}

export default PlayerItem;
