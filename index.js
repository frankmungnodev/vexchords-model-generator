const fs = require("fs");

if (process.argv.includes('--generate-json')) {
    generateJson();
}

if (process.argv.includes('--generate-dart')) {
    generateDart();
}

function getChordList() {
    const { generateOtherChords } = require('./other_chords.js');
    const openChords = require('./open_chords.js');

    return [...openChords, ...generateOtherChords()];
}


function generateDart() {
    console.log('Generating Dart code...');


    const chordList = getChordList();

    const generateChordCode = (chord) => `GuitarChordModel(
        name: "${chord.name}",
        chord: ${JSON.stringify(chord.chord)},
        position: ${chord.position},
        barres: ${chord.barres != null ? `[${chord.barres.map(generateBarre).join('\n')}]` : '[]'},
      ),`;

    const generateBarre = (barre) => `const Barre(
        stringFrom: ${barre.fromString},
        stringTo: ${barre.toString},
        fret: ${barre.fret},
    ),`;

    // Generate Dart code for all chords
    const dartCode = `
        import 'dart:convert';

        import 'package:equatable/equatable.dart';

        class GuitarChordModel extends Equatable {
        final String name;
        final List<List<dynamic>> chord;
        final int position;
        final List<Barre> barres;

        const GuitarChordModel({
            required this.name,
            required this.chord,
            required this.position,
            required this.barres,
        });

        @override
        List<Object?> get props => [name, chord, position, barres];

        static List<GuitarChordModel> getChords() {
            return [
                ${chordList.map(generateChordCode).join('\n')}
            ];
        }

        factory GuitarChordModel.fromMap(Map<String, dynamic> map) {
            return GuitarChordModel(
            name: map['name'],
            chord: (map['chord'] as List<dynamic>)
                .map((e) => List<dynamic>.from(e))
                .toList(),
            position: map['position'],
            barres: map['barres'] == null
                ? []
                : (map['barres'] as List<dynamic>)
                    .map((e) => e == null ? null : Barre.fromMap(e))
                    .nonNulls
                    .toList(),
            );
        }

        Map<String, dynamic> toMap() {
            return {
            'name': name,
            'chord': chord.map((e) => e.toList()).toList(),
            'position': position,
            'barres': barres.map((e) => e.toMap()).toList(),
            };
        }

        String toJson() => json.encode(toMap());

        factory GuitarChordModel.fromJson(String source) =>
            GuitarChordModel.fromMap(json.decode(source) as Map<String, dynamic>);
        }

        class Barre extends Equatable {
        final int stringFrom;
        final int stringTo;
        final int fret;

        const Barre({
            required this.stringFrom,
            required this.stringTo,
            required this.fret,
        });

        @override
        List<Object> get props => [stringFrom, stringTo, fret];

        Map<String, dynamic> toMap() {
            return <String, dynamic>{
            'fromString': stringFrom,
            'toString': stringTo,
            'fret': fret,
            };
        }

        factory Barre.fromMap(Map<String, dynamic> map) {
            return Barre(
            stringFrom: map['fromString'] as int,
            stringTo: map['toString'] as int,
            fret: map['fret'] as int,
            );
        }

        String toJson() => json.encode(toMap());

        factory Barre.fromJson(String source) =>
            Barre.fromMap(json.decode(source) as Map<String, dynamic>);
        }
    `;

    // Write to the file
    const filePath = 'generated/guitar_chords.dart';
    fs.writeFile(filePath, dartCode, (err) => {
        if (err) {
            console.error(`Error writing file: ${err}`);
        } else {
            console.log(`Chord dart file has been generated and saved to: ${filePath}.`);
        }
    });
}

function generateJson() {
    console.log("Generating chords json...");
    const chordList = getChordList();
    const jsonString = JSON.stringify(chordList);
    fs.writeFileSync('generated/guitar_chords.json', jsonString);

    console.log('Chords json data has been minified and saved to: generated/guitar_chords.json');
}