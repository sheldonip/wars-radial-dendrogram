import React, { Component } from "react";

class Control extends Component {
    constructor(props) {
        super(props);

        this.handleClick = this.handleClick.bind(this);
        this.handleLegendChange = this.handleLegendChange.bind(this);
    }

    handleClick() {
        if (this.props.type === "horizontalTree") {
            this.props.updateType("radialTree");
        } else {
            this.props.updateType("horizontalTree");
        }
    }

    handleLegendChange(e) {
      this.props.updateLegendType(e.target.value);
    }

    createLegendDropdownOptions() {
      let options = [];
      for (const [key, legend] of Object.entries(this.props.legendData)) {
        options.push(<option key={key} value={key}>{legend.name}</option>);
      };
      return options;
    }

    render() {
      return (
        <div className="control-container">
          <div className="button-container">
            <div id='button-toggle' className="button" onClick = {this.handleClick}>切換圖表類型</div>
          </div>
          <div className="dropdown-container">
            <label htmlFor="dropdown-legend-type">分類:</label>
            <select id="dropdown-legend-type" value={this.props.legendType} onChange={this.handleLegendChange}>{this.createLegendDropdownOptions()}</select>
          </div>
        </div>
      );
    }
}

export default Control;