(function () {
    const genderColours = ["red", "blue"];
    d3.csv("data.csv").then(function (data) {
        const width = window.innerWidth * 0.8;
        const height = 1200;
        const transitionTime = 2000;

        const margin = { left: 100, top: 100, right: 50, bottom: 50 }

        let color = d3.scaleOrdinal(genderColours);
        let radialMode = true;

        let svg = d3.select("svg.radical")
            .attr("width", width)
            .attr("height", height);

        let g = svg.append("g").attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

        let stratify = d3.stratify()
            .id(function (d) { return d.casenumber; })
            .parentId(function (d) { return d.parent; });

        let root = stratify(data)
            .sort(function (a, b) {
                return (a.data.gender.localeCompare(b.data.gender) || b.height - a.height);
            });

        // Setup legend
        // Title
        svg.append("text")
            .attr("x", "20")
            .attr("y", "40")
            .attr("class", "chart-title")
            .text("性別");

        const legendDotSize = 30;
        let legendWrapper = svg.append("g")
            .attr("class", "legend")
            .attr("transform", function (d) { return "translate(20,60)"; })

        let colorData = Array.from(new Set(data.map(function (d) { return d.gender; })))
            .filter(function (el) { return el != null && el != ''; })
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

        // Tree
        let tree = d3.tree()
            .size([width - margin.left - margin.right, height - margin.top - margin.bottom]);
        let radialTreeSize = [2 * Math.PI, width / 2.5];

        // Cluster	
        let cluster = d3.cluster()
            .size([height - margin.top - margin.bottom, width - margin.left - margin.right]);

        // Set initial radial tree
        tree.size(radialTreeSize);
        let link = g.selectAll(".link")
            .data(tree(root).links())
            .enter().append("path")
            .attr("class", "link")
            .attr("id", function (d) { return "link-" + d.target.id; })
            .attr("fill", "none")
            .attr("stroke", "#ccc")
            .attr("d", d3.linkRadial()
                .angle(function (d) { return d.x; })
                .radius(function (d) { return d.y; }));

        let node = g.selectAll(".node")
            .data(root.descendants())
            .enter().append("g")
            .attr("class", function (d) { return "node" + (d.children ? " node-internal" : " node-leaf"); })
            .attr("id", function (d) { return "node-" + d.data.casenumber; })
            .attr("transform", function (d) { return "translate(" + radialPoint(d.x, d.y) + ")"; })
            .on("mouseover", function (d) { mouseovered(d); })
            .on("mouseout", function (d) { mouseout(); });

        node.append("circle")
            .attr("r", 6)
            .attr("fill", function (d) {
                if (d.data.gender == "") {
                    return "grey";
                }
                return color(d.data.gender);
            });;

        node.append("text")
            .text(function (d) {
                switch (parseInt(d.id)) {
                    case -1:
                        return "輸入";
                    case 0:
                        return "本地";
                    default:
                        return d.data.age + "歳" + d.data.gender + " (#" + d.data.casenumber + ")";
                }
            })
            .attr('y', -10)
            .attr('x', -10)
            .attr('text-anchor', 'middle');

        // Interaction with button
        document.getElementById("toggle-button").onclick = function () { toggleMode() };

        function verticalTree() {
            g.transition().attr("transform", 'translate(' + margin.left + ',' + margin.right + ')').duration(transitionTime);
            tree.size([width - margin.left - margin.right, height - margin.top - margin.bottom]);
            link.data(tree(root).links())
                .transition()
                .attr("d", d3.linkVertical()
                    .x(function (d) { return d.x; })
                    .y(function (d) { return d.y; }))
                .duration(transitionTime);

            node.transition()
                .attr("transform", function (d) { return "translate(" + d.x + "," + d.y + ")"; })
                .duration(transitionTime)
        }

        function horizontalTree() {
            g.transition().attr("transform", 'translate(' + margin.left + ',' + margin.right + ')').duration(transitionTime);
            tree.size([height - margin.top - margin.bottom, width - margin.left - margin.right]);
            link.data(tree(root).links())
                .transition()
                .attr("d", d3.linkHorizontal()
                    .x(function (d) { return d.y; })
                    .y(function (d) { return d.x; }))
                .duration(transitionTime);

            node.transition()
                .attr("transform", function (d) { return "translate(" + d.y + "," + d.x + ")"; })
                .duration(transitionTime);
        }

        function radialTree() {
            g.transition().attr("transform", "translate(" + width / 2 + "," + height / 2 + ")").duration(transitionTime);
            tree.size(radialTreeSize);
            link.data(tree(root).links())
                .transition()
                .attr("d", d3.linkRadial()
                    .angle(function (d) { return d.x; })
                    .radius(function (d) { return d.y; }))
                .duration(transitionTime);

            node.transition()
                .attr("transform", function (d) { return "translate(" + radialPoint(d.x, d.y) + ")"; })
                .duration(transitionTime);
        }

        function horizontalCluster() {
            g.transition().attr("transform", 'translate(' + margin.left + ',' + margin.right + ')').duration(transitionTime);
            cluster.size([height - margin.top - margin.bottom, width - margin.left - margin.right]);
            link
                .data(cluster(root).links())
                .transition()
                .attr("d", function (d) {
                    console.log(d);
                    return "M" + d.source.y + "," + d.source.x
                        + "C" + (d.source.y + 100) + "," + d.source.x
                        + " " + (d.source.y + 100) + "," + d.target.x
                        + " " + d.target.y + "," + d.target.x;
                })
                .duration(transitionTime)

            node.transition()
                .attr("transform", function (d) { return "translate(" + d.y + "," + d.x + ")"; })
                .duration(transitionTime);
        }

        function verticalCluster() {
            g.transition().attr("transform", 'translate(' + margin.left + ',' + margin.right + ')').duration(transitionTime);
            cluster.size([width - margin.left - margin.right, height - margin.top - margin.bottom]);
            link
                .data(cluster(root).links())
                .transition()
                .attr("d", function (d) {
                    console.log(d);
                    return "M" + d.source.x + "," + d.source.y
                        + "C" + d.source.x + "," + (d.source.y + 60)
                        + " " + d.target.x + "," + (d.source.y + 60)
                        + " " + d.target.x + "," + d.target.y;
                })
                .duration(transitionTime)

            node.transition()
                .attr("transform", function (d) { return "translate(" + d.x + "," + d.y + ")"; })
                .duration(transitionTime);
        }

        function radialCluster() {
            g.transition().attr("transform", "translate(" + width / 2 + "," + height / 2 + ")").duration(transitionTime);
            cluster.size([2 * Math.PI, height / 2 - 40]);

            link
                .data(cluster(root).links())
                .transition()
                .attr("d", function (d) {
                    return "M" + radialPoint(d.source.x, d.source.y)
                        + "C" + radialPoint(d.source.x, (d.target.y + d.source.y) / 2)
                        + " " + radialPoint(d.target.x, (d.target.y + d.source.y) / 2)
                        + " " + radialPoint(d.target.x, d.target.y);
                })
                .duration(transitionTime)

            node.transition()
                .attr("transform", function (d) { return "translate(" + radialPoint(d.x, d.y) + ")"; })
                .duration(transitionTime);
        }

        function radialPoint(x, y) {
            return [(y = +y) * Math.cos(x -= Math.PI / 2), y * Math.sin(x)];
        }

        function toggleMode() {
            if (radialMode) {
                horizontalTree();
                radialMode = false;
            } else {
                radialTree();
                radialMode = true;
            }
        }
    }).catch(function (error) {
        // handle error
        console.log(error);
    });

    function mouseovered(d) {
        let relatedIdSet = getAllParentIds(d);
        const isHk = relatedIdSet.has("0"), isImport = relatedIdSet.has("-1");
        relatedIdSet.forEach(function (i) {
            if (isHk && i == "-1") {
                return;
            }
            if (document.getElementById("node-" + i) != null) {
                document.getElementById("node-" + i).classList.add("node-active");
            }
            if (isImport && i == "0") {
                return;
            }
            if (document.getElementById("link-" + i) != null) {
                document.getElementById("link-" + i).classList.add("link-active");
            }
        });
    }

    function mouseout() {
        let els = document.getElementsByClassName("node-active");
        while (els.length > 0) {
            els[0].classList.remove("node-active");
        }
        els = document.getElementsByClassName("link-active");
        while (els.length > 0) {
            els[0].classList.remove("link-active");
        }
    }

    function getAllParentIds(d) {
        let idSet = new Set();
        idSet.add(d.id);
        if (d.parent) {
            let p = getAllParentIds(d.parent);
            p.forEach(item => idSet.add(item));
        }
        return idSet;
    }

}());