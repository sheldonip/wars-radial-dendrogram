import React, { Component } from "react";
import * as d3 from "d3";

class Map extends Component {
    constructor(props) {
        super(props);
        this.state = {
            width: Math.max(1000, window.innerWidth * 0.8),
            transitionTime: 2000,
            margin: { left: 100, top: 100, right: 50, bottom: 50 },
            radialTreeSize: [2 * Math.PI, window.innerWidth * 0.8 / 2],
        };
        this.height = 3000;
        this.heightForRaidalTree = this.height / 2.7;
        this.root = {};

        this.horizontalTree = this.horizontalTree.bind(this);
        this.radialTree = this.radialTree.bind(this);
        this.mouseout = this.mouseout.bind(this);
        this.mouseovered = this.mouseovered.bind(this);
        this.getAllParentIds = this.getAllParentIds.bind(this);
        this.radialPoint = this.radialPoint.bind(this);
        this.generateNodeText = this.generateNodeText.bind(this);
        this.redraw = this.redraw.bind(this);
    }

    componentDidUpdate() {
        this.redraw();
    }

    componentDidMount() {
        this.redraw();
    }

    verticalTree() {
        let g = d3.select("svg.radical").selectAll("g");
        let tree = d3.tree();
        let node = g.selectAll(".node");
        let link = g.selectAll(".link");
        g.transition().attr("transform", 'translate(' + this.state.margin.left + ',' + this.state.margin.right + ')').duration(this.state.transitionTime);
        tree.size([this.state.width - this.state.margin.left - this.state.margin.right, this.height - this.state.margin.top - this.state.margin.bottom]);
        link.data(tree(this.root).links())
            .transition()
            .attr("id", (d) => { return "link-" + d.target.id; })
            .attr("d", d3.linkVertical()
                .x((d) => { return d.x; })
                .y((d) => { return d.y; }))
            .duration(this.state.transitionTime);

        node.data(this.root.descendants())
            .transition()
            .attr("class", (d) => { return "node" + (d.children ? " node-internal" : " node-leaf"); })
            .attr("id", (d) => { return "node-" + d.data.casenumber; })
            .attr("transform", (d) => { return "translate(" + d.x + "," + d.y + ")"; })
            .duration(this.state.transitionTime)

        node.html("")
            .append("circle")
            .attr("r", 6);

        node.append("text")
            .text((d) => this.generateNodeText(d))
            .attr("class", "node-text")
            .attr("id", (d) => { return "node-text-" + d.data.casenumber; })
            .attr('y', -10)
            .attr('x', -10)
            .attr('text-anchor', 'middle');
    }

    horizontalTree() {
        let svg = d3.select("svg.radical").attr("height", this.height);
        let g = svg.selectAll("g");
        let tree = d3.tree();
        let node = g.selectAll(".node");
        let link = g.selectAll(".link");
        g.transition().attr("transform", 'translate(' + this.state.margin.left + ',' + this.state.margin.right + ')').duration(this.state.transitionTime);
        tree.size([this.height - this.state.margin.top - this.state.margin.bottom, this.state.width - this.state.margin.left - this.state.margin.right]);
        link.data(tree(this.root).links())
            .transition()
            .attr("id", (d) => { return "link-" + d.target.id; })
            .attr("d", d3.linkHorizontal()
                .x((d) => { return d.y; })
                .y((d) => { return d.x; }))
            .duration(this.state.transitionTime);

        node.data(this.root.descendants())
            .transition()
            .attr("class", (d) => { return "node" + (d.children ? " node-internal" : " node-leaf"); })
            .attr("id", (d) => { return "node-" + d.data.casenumber; })
            .attr("transform", (d) => { return "translate(" + d.y + "," + d.x + ")"; })
            .duration(this.state.transitionTime);

        node.html("")
            .append("circle")
            .attr("r", 6);

        node.append("text")
            .text((d) => this.generateNodeText(d))
            .attr("class", "node-text")
            .attr("id", (d) => { return "node-text-" + d.data.casenumber; })
            .attr('y', -10)
            .attr('x', -10)
            .attr('text-anchor', 'middle');
    }

    radialTree() {
        let svg = d3.select("svg.radical").attr("height", this.heightForRaidalTree);
        let g = svg.selectAll("g");
        let tree = d3.tree();
        let node = g.selectAll(".node");
        let link = g.selectAll(".link");
        g.transition().attr("transform", "translate(" + this.state.width / 3 + "," + this.heightForRaidalTree / 2 + ")").duration(this.state.transitionTime);
        tree.size(this.state.radialTreeSize);
        link.data(tree(this.root).links())
            .transition()
            .attr("id", (d) => { return "link-" + d.target.id; })
            .attr("d", d3.linkRadial()
                .angle(function (d) { return d.x; })
                .radius(function (d) { return d.y; }))
            .duration(this.state.transitionTime);

        node.data(this.root.descendants())
            .transition()
            .attr("class", (d) => { return "node" + (d.children ? " node-internal" : " node-leaf"); })
            .attr("id", (d) => { return "node-" + d.data.casenumber; })
            .attr("transform", (d) => { return "translate(" + this.radialPoint(d.x, d.y) + ")"; })
            .duration(this.state.transitionTime);
        

        node.html("")
            .append("circle")
            .attr("r", 6);

        node.append("text")
            .text((d) => this.generateNodeText(d))
            .attr("class", "node-text")
            .attr("id", (d) => { return "node-text-" + d.data.casenumber; })
            .attr('y', -10)
            .attr('x', -10)
            .attr('text-anchor', 'middle');
    }

    horizontalCluster() {
        let g = d3.select("svg.radical").selectAll("g");
        let cluster = d3.cluster();
        let node = g.selectAll(".node");
        let link = g.selectAll(".link");
        g.transition().attr("transform", 'translate(' + this.state.margin.left + ',' + this.state.margin.right + ')').duration(this.state.transitionTime);
        cluster.size([this.height - this.state.margin.top - this.state.margin.bottom, this.state.width - this.state.margin.left - this.state.margin.right]);
        link.data(cluster(this.root).links())
            .transition()
            .attr("id", (d) => { return "link-" + d.target.id; })
            .attr("d", (d) => {
                return "M" + d.source.y + "," + d.source.x
                    + "C" + (d.source.y + 100) + "," + d.source.x
                    + " " + (d.source.y + 100) + "," + d.target.x
                    + " " + d.target.y + "," + d.target.x;
            })
            .duration(this.state.transitionTime)

        node.data(this.root.descendants())
            .transition()
            .attr("class", (d) => { return "node" + (d.children ? " node-internal" : " node-leaf"); })
            .attr("id", (d) => { return "node-" + d.data.casenumber; })
            .attr("transform", (d) => { return "translate(" + d.y + "," + d.x + ")"; })
            .duration(this.state.transitionTime);
        
        node.html("")
            .append("circle")
            .attr("r", 6);

        node.append("text")
            .text((d) => this.generateNodeText(d))
            .attr("class", "node-text")
            .attr("id", (d) => { return "node-text-" + d.data.casenumber; })
            .attr('y', -10)
            .attr('x', -10)
            .attr('text-anchor', 'middle');
    }

    verticalCluster() {
        let g = d3.select("svg.radical").selectAll("g");
        let cluster = d3.cluster();
        let node = g.selectAll(".node");
        let link = g.selectAll(".link");
        g.transition().attr("transform", 'translate(' + this.state.margin.left + ',' + this.state.margin.right + ')').duration(this.state.transitionTime);
        cluster.size([this.state.width - this.state.margin.left - this.state.margin.right, this.height - this.state.margin.top - this.state.margin.bottom]);
        link.data(cluster(this.root).links())
            .transition()
            .attr("id", (d) => { return "link-" + d.target.id; })
            .attr("d", (d) => {
                return "M" + d.source.x + "," + d.source.y
                    + "C" + d.source.x + "," + (d.source.y + 60)
                    + " " + d.target.x + "," + (d.source.y + 60)
                    + " " + d.target.x + "," + d.target.y;
            })
            .duration(this.state.transitionTime)

        node.data(this.root.descendants())
            .transition()
            .attr("class", (d) => { return "node" + (d.children ? " node-internal" : " node-leaf"); })
            .attr("id", (d) => { return "node-" + d.data.casenumber; })
            .attr("transform", (d) => { return "translate(" + d.x + "," + d.y + ")"; })
            .duration(this.state.transitionTime);
        
        node.html("")
            .append("circle")
            .attr("r", 6);

        node.append("text")
            .text((d) => this.generateNodeText(d))
            .attr("class", "node-text")
            .attr("id", (d) => { return "node-text-" + d.data.casenumber; })
            .attr('y', -10)
            .attr('x', -10)
            .attr('text-anchor', 'middle');
    }

    radialCluster() {
        let g = d3.select("svg.radical").selectAll("g");
        let cluster = d3.cluster();
        let node = g.selectAll(".node");
        let link = g.selectAll(".link");
        g.transition().attr("transform", "translate(" + this.state.width / 2 + "," + this.height / 2 + ")").duration(this.state.transitionTime);
        cluster.size([2 * Math.PI, this.height / 2 - 40]);

        link.data(cluster(this.root).links())
            .transition()
            .attr("id", (d) => { return "link-" + d.target.id; })
            .attr("d", (d) => {
                return "M" + this.radialPoint(d.source.x, d.source.y)
                    + "C" + this.radialPoint(d.source.x, (d.target.y + d.source.y) / 2)
                    + " " + this.radialPoint(d.target.x, (d.target.y + d.source.y) / 2)
                    + " " + this.radialPoint(d.target.x, d.target.y);
            })
            .duration(this.state.transitionTime)

        node.data(this.root.descendants())
            .transition()
            .attr("class", (d) => { return "node" + (d.children ? " node-internal" : " node-leaf"); })
            .attr("id", (d) => { return "node-" + d.data.casenumber; })
            .attr("transform", (d) => { return "translate(" + this.radialPoint(d.x, d.y) + ")"; })
            .duration(this.state.transitionTime);
        
        node.html("")
            .append("circle")
            .attr("r", 6);

        node.append("text")
            .text((d) => this.generateNodeText(d))
            .attr("class", "node-text")
            .attr("id", (d) => { return "node-text-" + d.data.casenumber; })
            .attr('y', -10)
            .attr('x', -10)
            .attr('text-anchor', 'middle');
    }

    mouseovered(d) {
        let relatedIdSet = this.getAllParentIds(d);
        const isHk = relatedIdSet.has("0"), isImport = relatedIdSet.has("-1");
        relatedIdSet.forEach(function (i) {
            if (isHk && i === "-1") {
                return;
            }
            if (document.getElementById("node-" + i) != null) {
                document.getElementById("node-" + i).classList.add("node-active");
            }
            if (isImport && i === "0") {
                return;
            }
            if (document.getElementById("link-" + i) != null) {
                document.getElementById("link-" + i).classList.add("link-active");
            }
        });
    }

    mouseout() {
        let els = document.getElementsByClassName("node-active");
        while (els.length > 0) {
            els[0].classList.remove("node-active");
        }
        els = document.getElementsByClassName("link-active");
        while (els.length > 0) {
            els[0].classList.remove("link-active");
        }
    }

    getAllParentIds(d) {
        let idSet = new Set();
        idSet.add(d.id);
        if (d.parent) {
            let p = this.getAllParentIds(d.parent);
            p.forEach(item => idSet.add(item));
        }
        return idSet;
    }

    radialPoint(x, y) {
        return [(y = +y) * Math.cos(x -= Math.PI / 2), y * Math.sin(x)];
    }

    generateNodeText(d) {
        switch (parseInt(d.id, 10)) {
            case -1:
                return "輸入";
            case 0:
                return "本地";
            default:
                return d.data.age + "歳" + d.data.gender + " (#" + d.data.casenumber + ")";
        }
    }

    redraw() {
        if (Object.keys(this.props.data).length === 0 && this.props.data.constructor === Object) {
            return;
        }
        const legendType = this.props.legendType;
        const legends = this.props.legendData;
        const data = this.props.data;
        const width = this.state.width;
        const margin = this.state.margin;

        let stratify = d3.stratify()
            .id(function (d) { return d.casenumber; })
            .parentId(function (d) { return d.parent; });

        let root = stratify(data)
            .sort(function (a, b) {
                return (a.data[legends[legendType].field].localeCompare(b.data[legends[legendType].field]) || b.casenumber - a.casenumber);
            });
        this.root = root;

        let cnt = root.children.length + root.children[0].children.length;
        this.height = cnt * 20;
        this.heightForRaidalTree = 1600;
        let svg = d3.select("svg.radical")
            .attr("width", width)
            .attr("height", this.height);

        let g;
        if (d3.select("svg.radical g").empty()) {
            g = svg.append("g")
                .attr("transform", "translate(" + width / 2 + "," + this.height / 2 + ")");

            // Tree
            let tree = d3.tree()
                .size([width - margin.left - margin.right, this.height - margin.top - margin.bottom]);
            let radialTreeSize = this.state.radialTreeSize;
    
            // Cluster	
            d3.cluster()
                .size([this.height - margin.top - margin.bottom, width - margin.left - margin.right]);
    
            // Set initial radial tree
            tree.size(radialTreeSize);
            g.selectAll(".link")
                .data(tree(root).links())
                .enter().append("path")
                .attr("class", "link")
                .attr("id", (d) => { return "link-" + d.target.id; })
                .attr("fill", "none")
                .attr("stroke", "#ccc")
                .attr("d", d3.linkRadial()
                    .angle((d) => { return d.x; })
                    .radius((d) => { return d.y; }));
    
            g.selectAll(".node")
                .data(root.descendants())
                .enter().append("g")
                .attr("class", (d) => { return "node" + (d.children ? " node-internal" : " node-leaf"); })
                .attr("id", (d) => { return "node-" + d.data.casenumber; })
                .attr("transform", (d) => { return "translate(" + this.radialPoint(d.x, d.y) + ")"; })
                .on("mouseover", (d) => { this.mouseovered(d); })
                .on("mouseout", () => { this.mouseout(); });
        } else {
            g = d3.select("svg.radical")
                .selectAll("g");
        }
        switch (this.props.type) {
            case "horizontalTree":
                this.horizontalTree();
                break;
            case "radialTree":
                this.radialTree();
                break;
            default:
                this.radialTree();
        }
        const legendSet = Array.from(new Set(data.map((d) => { return d[legends[legendType].field]; })))
                .filter(function (el) { return el !== null && el !== ''; })
                .sort(function (a, b) { return a.localeCompare(b); });

        g.selectAll(".node circle").attr("fill", (d) => {
            if (d.data[legends[legendType].field] === "") {
                return "#ccc";
            }
            let idx = legendSet.indexOf(d.data[legends[legendType].field]);
            if (idx >= legends[legendType].colours.length) {
                idx = idx % legends[legendType].colours.length;
            }
            return legends[legendType].colours[idx];
        });
    }

    render() {
        return (
            <div className="radical-container">
                <svg className="radical" height="1500"></svg>
            </div>
        );
    }
}

export default Map;
