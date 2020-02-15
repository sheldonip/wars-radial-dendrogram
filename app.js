(function () {
    const genderColours = ["red", "blue"];
    let svg = d3.select("svg.radical"),
        g = svg.append("g").attr("transform", "translate(" + 80 + "," + 0 + ")");
    const width = +svg.attr("width"), height = +svg.attr("height");

    let stratify = d3.stratify()
        .id(function (d) { return d.casenumber; })
        .parentId(function (d) { return d.parent; });

    function project(x, y) {
        let angle = (x - 90) / 180 * Math.PI, radius = y;
        return [radius * Math.cos(angle) + width / 2.0, radius * Math.sin(angle) + height / 2.0];
    }

    d3.csv("data.csv").then(function (data) {
        let color = d3.scaleOrdinal(genderColours);

        // Title
        svg.append("text")
            .attr("x", "20")
            .attr("y", "40")
            .attr("class", "chart-title")
            .text("性別");

        // Setup legend
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

        // Interaction with button
        let radialMode = true;
        document.getElementById("toggle-button").onclick = function () { toggleMode() };

        let toggleMode = function () {
            let tree;

            if (radialMode) {
                tree = d3.cluster()
                    .size([360, 320]) // degrees, radius
                    .separation(function (a, b) { return (a.parent == b.parent ? 1 : 2) / a.depth; });
            } else {
                tree = d3.cluster()
                    .size([820, 700]); // height, width
            }

            let root = stratify(data)
                .sort(function (a, b) {
                    return (a.data.gender.localeCompare(b.data.gender) || b.height - a.height);
                });

            tree(root);

            let link = g.selectAll(".link")
                .data(root.descendants().slice(1));

            let node = g.selectAll(".node").data(root.descendants());

            node.group = node.enter().append("g")
                .attr("class", function (d) { return "node" + (d.children ? " node-internal" : " node-leaf"); })
                .attr("id", function (d) { return "node-" + d.data.casenumber; })
                .on("mouseover", function (d) { mouseovered(d); })
                .on("mouseout", function (d) { mouseout(); });

            if (radialMode) {
                link.enter().append("path")
                    .attr("class", "link")
                    .attr("id", function (d) { return "link-" + d.data.casenumber; })
                    .merge(link).transition().duration(1000)
                    .attr("d", function (d) {
                        return "M" + project(d.x, d.y)
                            + "C" + project(d.x, (d.y + d.parent.y) / 2)
                            + " " + project(d.parent.x, (d.y + d.parent.y) / 2)
                            + " " + project(d.parent.x, d.parent.y);
                    });

                node.group.merge(node).transition().duration(1000)
                    .attr("transform", function (d) { return "translate(" + project(d.x, d.y) + ")"; });

                node.group.append("text")
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
                    .merge(node.select("text")).transition().duration(1000)
                    .attr("dy", function(d) { return d.children ? -5 : 0; })
                    .attr("x", function (d) { return d.x < 180 === !d.children ? 12 : -1 * (this.getBBox().width + 12); })
                    .attr("transform", function (d) { return "rotate(" + (d.x < 180 ? d.x - 90 : d.x + 90) + ")"; });
            } else {
                link.enter().append("path")
                    .attr("class", "link")
                    .attr("id", function (d) { return "link-" + d.data.casenumber; })
                    .merge(link).transition().duration(1000)
                    .attr("d", function (d) {
                        return "M" + d.y + "," + d.x
                            + "C" + (d.parent.y + 100) + "," + d.x
                            + " " + (d.parent.y + 100) + "," + d.parent.x
                            + " " + d.parent.y + "," + d.parent.x;
                    });

                node.group.merge(node).transition().duration(1000)
                    .attr("transform", function (d) { return "translate(" + d.y + "," + d.x + ")"; });

                node.group.append("text")
                    .text(function (d) { return d.data.name; })
                    .merge(node.select("text")).transition().duration(1000)
                    .attr("dy", function(d) { return d.children ? -5 : 3;})
                    .attr("x", 12)
                    .attr("transform", function (d) { return "rotate(0)"; });
            }

            node.group.append("circle")
                .attr("r", 6)
                .attr("fill", function (d) {
                    if (d.data.gender == "") {
                        return "grey";
                    }
                    return color(d.data.gender);
                });

            // Toggle state
            radialMode = !radialMode;
        };

        // run radial mode first!
        toggleMode();
    }).catch(function (error) {
        // handle error
        console.log(error);
    })

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
        while(els.length > 0) {
            els[0].classList.remove("node-active");
        }
        els = document.getElementsByClassName("link-active");
        while(els.length > 0) {
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