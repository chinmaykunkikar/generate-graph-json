// imports
const mercator = require('./projections/mercator');
const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
});
const fs = require('fs');
const inputFile = './mumbai.input.json';
const nodesFile = './mumbai_nodes.json';
const edgesFile = './mumbai_edges.json';
const linesFile = './mumbai_lines.json';

// string prototype functions
String.prototype.toTitleCase = function () {
    return this.replace(/(^|\s)\S/g, function (t) { return t.toUpperCase() });
}
String.prototype.count = function (str) {
    return (this.length - this.replace(new RegExp(str, 'g'), '').length) / str.length;
}

function stnNodesToJSON() {
    console.log('- Add station');
    let readRecursively = function () {
        readline.question('Input parameters (id, label, latitude, longitude): ', function (stnDataInput) {
            start: if (stnDataInput == 'q' || stnDataInput == 'exit') {
                return readline.close();
            } else {
                if (stnDataInput.count(',') === 3) {
                    let stDataArr = stnDataInput.split(',').map(item => item.trim());
                    let idVal = stDataArr[0].toUpperCase();
                    let labelVal = stDataArr[1].toTitleCase();
                    let latVal = Number(stDataArr[2]);
                    let lngVal = Number(stDataArr[3]);
                    let { x, y } = mercator.project({ lon: lngVal, lat: latVal });
                    let newNode = JSON.parse(fs.readFileSync(nodesFile));
                    for (let i = 0; i < newNode.nodes.length; i++) {
                        if (newNode.nodes[i].id == idVal) {
                            console.log('The value already exists.');
                            break start;
                        }
                    }
                    newNode.nodes.push({ id: idVal, label: labelVal, metadata: { x: x, y: y } });
                    fs.writeFile(nodesFile, JSON.stringify(newNode), (e) => {
                        if (e) {
                            console.error(e);
                            return;
                        };
                    });
                } else {
                    console.log('The input does not satisfy all the parameters. Try again.');
                }
            }
            readRecursively();
        });
    };
    readRecursively();
}

function stnEdgesToJSON() {
    console.log('- Add station edge');
    let readRecursively = function () {
        readline.question('Input parameters (source, target, line): ', function (stnEdgeInput) {
            start: if (stnEdgeInput == 'q' || stnEdgeInput == 'exit') {
                return readline.close();
            } else {
                if (stnEdgeInput.count(',') === 2) {
                    let stEdgeArr = stnEdgeInput.split(',').map(item => item.trim());
                    let srcVal = stEdgeArr[0].toUpperCase();
                    let tgtVal = stEdgeArr[1].toUpperCase();
                    let lineVal = stEdgeArr[2].toTitleCase();
                    let newEdge = JSON.parse(fs.readFileSync(edgesFile));
                    for (let i = 0; i < newEdge.edges.length; i++) {
                        if (newEdge.edges[i].source == srcVal && newEdge.edges[i].target == tgtVal) {
                            console.log('The value already exists.');
                            break start;
                        }
                    }
                    newEdge.edges.push({ source: srcVal, target: tgtVal, metadata: { lines: [lineVal] } });
                    fs.writeFile(edgesFile, JSON.stringify(newEdge), (e) => {
                        if (e) {
                            console.error(e);
                            return;
                        };
                    });
                } else {
                    console.log('The input does not satisfy all the parameters. Try again.');
                }
            }
            readRecursively();
        });
    };
    readRecursively();
}

function addNewLine() {
    console.log('- Add line');
    readline.question('Input parameters (id, color, group): ', function (newLineInput) {
        start: if (newLineInput == 'q' || newLineInput == 'exit') {
            return readline.close();
        } else {
            if (newLineInput.count(',') === 2) {
                let newLineArr = newLineInput.split(',').map(item => item.trim());
                let idVal = newLineArr[0].toTitleCase();
                let clrVal = newLineArr[1];
                let grpVal = newLineArr[2];
                let newLine = JSON.parse(fs.readFileSync(linesFile));
                for (let i = 0; i < newLine.lines.length; i++) {
                    if (newLine.lines[i].id == idVal) {
                        console.log('The value already exists.');
                        break start;
                    }
                }
                newLine.lines.push({ id: idVal, color: clrVal, group: grpVal });
                fs.writeFile(linesFile, JSON.stringify(newLine), (e) => {
                    if (e) {
                        console.error(e);
                        return;
                    };
                    console.log(newLineArr[0].toTitleCase() + " line added");
                    process.exit(0);
                });
            } else {
                console.log('The input does not satisfy all the parameters. Try again.');
            }
        }
    });
}

function makeInputFile() {
    let nodes = JSON.parse(fs.readFileSync(nodesFile));
    let edges = JSON.parse(fs.readFileSync(edgesFile));
    let lines = JSON.parse(fs.readFileSync(linesFile));

    let concat = Object.assign(nodes, edges, lines);

    fs.writeFile(inputFile, JSON.stringify(concat), (e) => {
        if (e) {
            console.error(e);
            return;
        };
        console.log("File generated: " + inputFile.substr(2));
        process.exit(0);
    });
}

// TODO city name as command line argument for future works

let action = process.argv[2];
switch (action) {
    case '-n':
        stnNodesToJSON();
        break;
    case '-e':
        stnEdgesToJSON();
        break;
    case '-l':
        addNewLine();
        break;
    case '-m':
        makeInputFile();
        break;
    default:
        console.log("USAGE: get_station.js [-n][-e][-l][-m]\n-n\tTo input station nodes\n-e\tTo input station edges\n-l\tTo add a new line\n-m\tTo generate the input file");
        process.exit(1);
}