import React, { Component } from 'react';
import CanvasJSReact from '@canvasjs/react-charts';

var CanvasJSChart = CanvasJSReact.CanvasJSChart;

class Graph extends Component {
	render() {
		const { data } = this.props;
		const options = {
			animationEnabled: true,
			theme: "light2",
			title: {
				text: "Day-Time Weather Data"
			},
			axisX: {
				title: "Time of Day",
				valueFormatString: "hh:mm TT"
			},
			axisY: {
				title: "Temperature (°C)",
				includeZero: false
			},
			data: [{
				type: "line",
				dataPoints: data.map(item => ({
					x: item.time,
					y: item.temperature
				}))
			}]
		};

		return (
			<div>
				<CanvasJSChart options={options} />
			</div>
		);
	}
}

export default Graph;
