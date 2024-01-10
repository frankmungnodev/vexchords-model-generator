const vexchords = require('./vexchords/index');

function createShapeChart(keys, shapes, shape) {
    const chordsData = [];

    for (let i = 0; i < keys.length; i += 1) {
        const key = keys[i];
        for (let j = 0; j < shapes.length; j += 1) {
            chordsData.push(vexchords.build(key, shape, shapes[j]));
        }
    }

    return chordsData;
}

const keys_E = ['F', 'F#', 'Gb', 'G', 'G#', 'Ab', 'A', 'A#', 'Bb', 'C'];
const keys_A = ['C#', 'Db', 'D', 'D#', 'Eb', 'F', 'F#', 'Gb', 'G'];

const shapes_E = [
    'M E', 'm E', '7 E', 'm7 E', 'M7 E', 'm7b5 E',
    'dim E', 'sus4 E', '7sus4 E', '13 E'
];

const shapes_A = [
    'M A', 'm A', '7 A', 'm7 A', 'M7 A', 'm7b5 A',
    'dim A', 'sus2 A', 'sus4 A', '7sus4 A', '9 A', '7b9 A', '7#9 A', '13 A'
];

function generateOtherChords() {
    return [
        ...createShapeChart(keys_E, shapes_E, 'E'),
        ...createShapeChart(keys_A, shapes_A, 'A')
    ];
}

module.exports = {
    generateOtherChords,
}