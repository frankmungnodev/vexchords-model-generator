const ChordBox = require('./chordbox');
const { POSITIONS, SHAPES, build } = require('./builder');


function draw(sel, chord, opts) {
    return new ChordBox(sel, opts).draw(chord);
};

module.exports = {
    ChordBox,
    POSITIONS,
    SHAPES,
    build,
    draw,
}