import React, { Component } from "react";
import * as d3 from "d3";

class Legend extends Component {
    constructor(props) {
        super(props);
        this.redraw = this.redraw.bind(this);
    }

    componentDidUpdate() {
        this.redraw();
    }

    componentDidMount() {
        this.redraw();
    }

    redraw() {
        const type = this.props.legendType;
        const legends = this.props.legendData;
        d3.csv(this.props.data).then(function (data) {
            let color = d3.scaleOrdinal(legends[type].colours);
            let svg = d3.select("svg.legend");
            const legendDotSize = 30;
            const legendHeight = 35 * legends.cluster.colours.length;
            
            svg.html("")
                .attr("height", legendHeight);
            // Title
            svg.append("text")
                .attr("x", "20")
                .attr("y", "40")
                .attr("class", "chart-title")
                .text(legends[type].name);

            let legendWrapper = svg.append("g")
                .attr("class", "legend")
                .attr("transform", function (d) { return "translate(20,60)"; })

            let colorData = Array.from(new Set(data.map((d) => { return d[legends[type].field]; })))
                .filter(function (el) { return el !== null && el !== ''; })
                .sort(function (a, b) { return a.localeCompare(b); });

            // The text of the legend
            let legendText = legendWrapper.selectAll("text")
                .data(colorData);

            legendText.enter().append("text")
                .attr("y", function (d, i) { return i * legendDotSize + 12; })
                .attr("x", 20)
                .merge(legendText)
                .text(function (d) {
                    return d;
                });

            // The dots of the legend
            let legendDot = legendWrapper.selectAll("rect")
                .data(colorData);

            legendDot.enter().append("rect")
                .attr("y", function (d, i) { return i * legendDotSize; })
                .attr("rx", legendDotSize * 0.5)
                .attr("ry", legendDotSize * 0.5)
                .attr("width", legendDotSize * 0.5)
                .attr("height", legendDotSize * 0.5)
                .merge(legendDot)
                .style("fill", function (d) { return color(d); });
        }).catch(function (error) {
            // handle error
            console.log(error);
        });
    }

    render() {
      return (
        <div className="legend-container">
          <svg className="legend"/>
        </div>
      );
    }
}

export default Legend;