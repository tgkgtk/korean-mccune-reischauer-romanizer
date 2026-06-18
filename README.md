# McCune-Reischauer Romanizer

A small browser app for romanizing Korean text with a rule-based McCune-Reischauer engine.

Open `index.html` in a browser, paste Korean text, or upload a UTF-8 `.txt` file. The app runs locally in the browser.

The `ALA-LC spacing` option applies a conservative particle-splitting pass before romanization. It separates common particles such as `의`, `은/는`, `이/가`, `을/를`, `에`, `에서`, `에게`, `와/과`, `로/으로`, `까지`, and `부터` when they appear attached to a preceding Korean word.

For proper names, place the full name in square brackets before any particles, e.g. `[부산]에`, `[소래마을]은`. Bracketed text is romanized as one proper-name unit, capitalized, and excluded from automatic particle spacing. For person-names, users can put a space between the family and given names, e.g. `[이 순신]`, to generate a formatted and hyphenated romanization.

## Test

```sh
node romanizer.test.js
```

## Scope

The engine handles Hangul decomposition, McCune-Reischauer vowel mappings, common initial/final consonant mappings, liaison before vowel-initial syllables, the common within-word boundary changes shown in the introductory romanization deck, optional ALA-LC-style particle spacing, and bracketed proper-name spans.

The rule set has been checked against the University of Chicago Library's McCune-Reischauer chart and Universität Hamburg's detailed McCune-Reischauer transcription table, including compound-final examples such as `읽는다 -> ingnŭnda`, `읽고 -> ilgo`, `읽었습니다 -> ilgŏssŭmnida`, `값만 -> kamman`, `값어치 -> kapŏch'i`, and `없이 -> ŏpsi`.

Proper names, dictionary exceptions, verb endings, compound splitting, and scholarly house styles may still need review. The app preserves spaces and punctuation, so add spaces or slashes where you want lexical divisions to remain visible.
