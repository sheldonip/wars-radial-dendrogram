# Relationship of Hong Kong Confirmed COVID-19 (2019-nCoV) Cases
An interactive diagram for showing the relationship of confirmed COVID-19 (2019-nCoV) cases in Hong Kong

# Setup
## Install
```sh
npm install
```

## Run development server
```sh
npm run-script start
```

# Data
All data are stored in `/assets/data.csv` with the following format:
| Field name | Description |
|---|---|
| casenumber  | Case number |
| parent  | Parent case number; if its parent is unknown, -1 for an import case, 0 for a local case |
| gender  | Gender (Optional)  |
| age | Age (Optional) |
| cluster | Cluster name (Optional) |

Case number -1 and 0 are dedictated for acting as the source of import cases and local cases.

# Authors
* **Sheldon Ip** - *Initial work*

# References
* [Radial Dendrogram / D3 / Observable](https://observablehq.com/@d3/radial-dendrogram)
* [Org Chart (Radial -> Dendrogram Transition) - bl.ocks.org](https://bl.ocks.org/cjhin/7023f2df4f9165b6e4ed8e07ab7b968a)
* [Tidy Tree vs Dendogram - bl.ocks.org](https://bl.ocks.org/Andrew-Reid/c7ae41a98b8cbb38f1febf13deb9d294)