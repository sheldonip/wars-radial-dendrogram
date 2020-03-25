import React, { Component } from "react";
import * as d3 from "d3";
import Map from "./Map";
import Legend from "./Legend";
import Control from "./Control";
import legendData from "./assets/legends";
import data from "./assets/data.csv";

class Diagram extends Component {
    constructor(props) {
        super(props);
        this.state = {
            csvData: {},
            data: data,
            type: "horizontalTree",
            legendType: "gender",
            legendData: legendData,
        };

        this.updateType = this.updateType.bind(this);
        this.updateLegendType = this.updateLegendType.bind(this);
    }

    componentDidMount() {
        d3.csv(data).then((csvData) => {
            this.setState({csvData: csvData});
        });
    }

    updateType(type) {
        this.setState({ type: type });
    }

    updateLegendType(type) {
        this.setState({ legendType: type });
    }

    render() {
        return (
            <React.Fragment>
                <div className="side-container">
                    <Control type={this.state.type} legendData={this.state.legendData} legendType={this.state.legendType} updateType={this.updateType} updateLegendType={this.updateLegendType} />
                    <Legend data={this.state.csvData} legendData={this.state.legendData} legendType={this.state.legendType} />
                </div>
                <Map data={this.state.csvData} type={this.state.type} legendData={this.state.legendData} legendType={this.state.legendType} />
            </React.Fragment>
        );
    }
}

export default Diagram;