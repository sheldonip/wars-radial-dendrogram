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
        const data = this.props.data;
        if (Object.keys(data).length === 0 && data.constructor === Object) {
            return;
        }

        let color = d3.scaleOrdinal(legends[type].colours);
        let svg = d3.select("svg.legend");
        const legendDotSize = 30;

        let legendFields = [];
        let legendCnt = {};
        data.forEach((d) => { 
            legendFields.push(d[legends[type].field]); 
            legendCnt[d[legends[type].field]] = legendCnt[d[legends[type].field]]? legendCnt[d[legends[type].field]] + 1 : 1;
        });

        const legendSet = Array.from(new Set(legendFields))
            .filter(function (el) { return el !== null && el !== ''; })
            .sort(function (a, b) { return a.localeCompare(b); });
        const legendHeight = 30 * legendSet.length + 60;
        
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
            .attr("transform", (d) => { return "translate(20,60)"; })

        // The text of the legend
        let legendText = legendWrapper.selectAll("text")
            .data(legendSet);

        legendText.enter().append("text")
            .attr("y", (d, i) => { return i * legendDotSize + 12; })
            .attr("x", 20)
            .merge(legendText)
            .text((d) => {
                return d + "(" + legendCnt[d] + ")";
            });

        // The dots of the legend
        let legendDot = legendWrapper.selectAll("rect")
            .data(legendSet);

        legendDot.enter().append("rect")
            .attr("y", function (d, i) { return i * legendDotSize; })
            .attr("rx", legendDotSize * 0.5)
            .attr("ry", legendDotSize * 0.5)
            .attr("width", legendDotSize * 0.5)
            .attr("height", legendDotSize * 0.5)
            .merge(legendDot)
            .style("fill", function (d) { return color(d); });
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