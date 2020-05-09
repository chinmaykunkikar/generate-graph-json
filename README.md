# Generate Graph (in JSON)

`get_station.js` is a helper script that will help in generating a `graph.json` which will be used as the input for [juliuste/transit-map](https://github.com/juliuste/transit-map).

---
The input `graph.json` must be in the [JSON Graph Format](http://jsongraphformat.info/). It will look something like -
```js
{
    "nodes": [ // list of all nodes
        {
            "id": "DR", // required
            "label": "Dadar", // optional
            "metadata": {
                "x": 0.702342, // x-coordinate in mercator, required
                "y": 0.444534 // y-coordinate in mercator, required
            }
        }
    ],
    "edges": [ // list of all edges
        {
            "source": "DR", // required
            "target": "PR", // required
            "metadata": {
                "line": "Central" // optional
            }
        }
    ],
    "lines": [ // list of all lines, optional
        {
            "id": "Central",
            "color": "#ABDA1E",
            "group": "Central"
        }
    ]
}
```
---

### Requirements
* [`node.js`](https://nodejs.org) 8.0+
* [`gurobi_cl`](https://gurobi.com) 7.5+ (Free academic license)
* [`juliuste/projections`](https://github.com/juliuste/projections) in parent working directory

### Usage
This script has a CLI which will generate a `graph.json` as shown above by taking inputs from the user as documented below -

```
USAGE: get_station.js [-n][-e][-l][-m][-c]
```
Option | Description
------:|:------------------------
|-n    | Add station nodes      |
|-e    | Add station edges      |
|-l    | Add a new line         |
|-m    | Generate the input file|
|-c    | Set new working city   |

* **`-n`** : adding new station nodes will take the required parameters:
*`(id, label, latitude, longitude)`*
* **`-e`** : adding new station edges will take the required parameters:
*`(source, target, line)`*
* **`-l`** : adding new line will take the required parameters:
*`(id, color, group)`*
* **`-m`** : generating a *`$city.input.json`* file needs *`$city_nodes.json`*, *`$city_edges.json`* and *`$city_lines.json`* files present in the *`working/$city`* directory
* **`-c`** : will set a new working city by modifying *`config.json`* file.

## Contributing
If you have a question, found a bug, or want to propose a feature, feel free to open a new issue.