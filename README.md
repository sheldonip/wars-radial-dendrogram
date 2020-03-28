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
Data originated from [data.gov.hk](https://data.gov.hk/tc-data/dataset/hk-dh-chpsebcddr-novel-infectious-agent).  
All enriched data are stored in `/assets/data.csv` with the following format:
| Field name | Description |
|---|---|
| casenumber  | Case number |
| reportdate  | Report date |
| onsetdate  | Date of onset (Optional) |
| gender  | Gender (Optional)  |
| age | Age (Optional) |
| hospital | Name of hospital admitted (Optional) |
| residency | Residency (Optional) |
| classification | Case classification (Optional) |
| parent  | Parent case number; if its parent is unknown, -1 for an imported case, 0 for a local case |
| cluster | Cluster name (Optional) |

Case number -1 and 0 are dedictated for acting as the source of imported cases and local cases.  
Relationship is based on contact only

# Authors
* **Sheldon Ip** - *Initial work*

# References
* [Radial Dendrogram / D3 / Observable](https://observablehq.com/@d3/radial-dendrogram)
* [Org Chart (Radial -> Dendrogram Transition) - bl.ocks.org](https://bl.ocks.org/cjhin/7023f2df4f9165b6e4ed8e07ab7b968a)
* [Tidy Tree vs Dendogram - bl.ocks.org](https://bl.ocks.org/Andrew-Reid/c7ae41a98b8cbb38f1febf13deb9d294)