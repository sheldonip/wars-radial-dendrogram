import * as d3 from "d3";
export default {
    "gender": {
        name: "性別",
        field: "gender",
        colours: ["red", "blue"],
    },
    "cluster" : {
        name: "群組",
        field: "cluster",
        colours: d3.schemeCategory10,
    }
};