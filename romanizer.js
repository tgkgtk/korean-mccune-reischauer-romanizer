(function attachRomanizer(global) {
  "use strict";

  const S_BASE = 0xac00;
  const L_COUNT = 19;
  const V_COUNT = 21;
  const T_COUNT = 28;
  const N_COUNT = V_COUNT * T_COUNT;
  const S_END = S_BASE + L_COUNT * N_COUNT;

  const INITIALS = [
    "ㄱ", "ㄲ", "ㄴ", "ㄷ", "ㄸ", "ㄹ", "ㅁ", "ㅂ", "ㅃ", "ㅅ",
    "ㅆ", "ㅇ", "ㅈ", "ㅉ", "ㅊ", "ㅋ", "ㅌ", "ㅍ", "ㅎ"
  ];
  const VOWELS = [
    "ㅏ", "ㅐ", "ㅑ", "ㅒ", "ㅓ", "ㅔ", "ㅕ", "ㅖ", "ㅗ", "ㅘ", "ㅙ",
    "ㅚ", "ㅛ", "ㅜ", "ㅝ", "ㅞ", "ㅟ", "ㅠ", "ㅡ", "ㅢ", "ㅣ"
  ];
  const FINALS = [
    "", "ㄱ", "ㄲ", "ㄳ", "ㄴ", "ㄵ", "ㄶ", "ㄷ", "ㄹ", "ㄺ", "ㄻ",
    "ㄼ", "ㄽ", "ㄾ", "ㄿ", "ㅀ", "ㅁ", "ㅂ", "ㅄ", "ㅅ", "ㅆ", "ㅇ",
    "ㅈ", "ㅊ", "ㅋ", "ㅌ", "ㅍ", "ㅎ"
  ];

  const VOWEL_MR = {
    "ㅏ": "a", "ㅐ": "ae", "ㅑ": "ya", "ㅒ": "yae", "ㅓ": "ŏ",
    "ㅔ": "e", "ㅕ": "yŏ", "ㅖ": "ye", "ㅗ": "o", "ㅘ": "wa",
    "ㅙ": "wae", "ㅚ": "oe", "ㅛ": "yo", "ㅜ": "u", "ㅝ": "wŏ",
    "ㅞ": "we", "ㅟ": "wi", "ㅠ": "yu", "ㅡ": "ŭ", "ㅢ": "ŭi", "ㅣ": "i"
  };

  const INITIAL_MR = {
    "ㄱ": { soft: "g", hard: "k" },
    "ㄲ": { soft: "kk", hard: "kk" },
    "ㄴ": { soft: "n", hard: "n" },
    "ㄷ": { soft: "d", hard: "t" },
    "ㄸ": { soft: "tt", hard: "tt" },
    "ㄹ": { soft: "r", hard: "r" },
    "ㅁ": { soft: "m", hard: "m" },
    "ㅂ": { soft: "b", hard: "p" },
    "ㅃ": { soft: "pp", hard: "pp" },
    "ㅅ": { soft: "s", hard: "s" },
    "ㅆ": { soft: "ss", hard: "ss" },
    "ㅇ": { soft: "", hard: "" },
    "ㅈ": { soft: "j", hard: "ch" },
    "ㅉ": { soft: "tch", hard: "tch" },
    "ㅊ": { soft: "ch'", hard: "ch'" },
    "ㅋ": { soft: "k'", hard: "k'" },
    "ㅌ": { soft: "t'", hard: "t'" },
    "ㅍ": { soft: "p'", hard: "p'" },
    "ㅎ": { soft: "h", hard: "h" }
  };

  const FINAL_MR = {
    "": "", "ㄱ": "k", "ㄲ": "k", "ㄳ": "k", "ㄴ": "n", "ㄵ": "n",
    "ㄶ": "n", "ㄷ": "t", "ㄹ": "l", "ㄺ": "k", "ㄻ": "m", "ㄼ": "p",
    "ㄽ": "l", "ㄾ": "l", "ㄿ": "p", "ㅀ": "l", "ㅁ": "m", "ㅂ": "p",
    "ㅄ": "p", "ㅅ": "t", "ㅆ": "t", "ㅇ": "ng", "ㅈ": "t", "ㅊ": "t",
    "ㅋ": "k", "ㅌ": "t", "ㅍ": "p", "ㅎ": "t"
  };

  const LIAISON = {
    "ㄱ": "g", "ㄲ": "kk", "ㄳ": "ks", "ㄴ": "n", "ㄵ": "nj", "ㄶ": "n",
    "ㄷ": "d", "ㄹ": "r", "ㄺ": "lg", "ㄻ": "lm", "ㄼ": "lb", "ㄽ": "ls",
    "ㄾ": "lt'", "ㄿ": "lp'", "ㅀ": "r", "ㅁ": "m", "ㅂ": "b", "ㅄ": "ps",
    "ㅅ": "s", "ㅆ": "ss", "ㅇ": "ng", "ㅈ": "j", "ㅊ": "ch'", "ㅋ": "k'",
    "ㅌ": "t'", "ㅍ": "p'", "ㅎ": ""
  };

  const ASPIRATED_BY_H = {
    "ㄱ": "k'", "ㄷ": "t'", "ㅂ": "p'", "ㅈ": "ch'",
    "ㅊ": "ch'", "ㅋ": "k'", "ㅌ": "t'", "ㅍ": "p'",
    "ㄲ": "kk", "ㄸ": "tt", "ㅃ": "pp", "ㅉ": "tch"
  };

  const BOUNDARY_MR = {
    "ㄱ": {
      "ㅇ": "g", "ㄱ": "kk", "ㄴ": "ngn", "ㄷ": "kt", "ㄹ": "ngn",
      "ㅁ": "ngm", "ㅂ": "kp", "ㅅ": "ks", "ㅈ": "kch", "ㅊ": "kch'",
      "ㅋ": "kk'", "ㅌ": "kt'", "ㅍ": "kp'", "ㅎ": "kh"
    },
    "ㄲ": {
      "ㅇ": "kk", "ㄱ": "kk", "ㄴ": "ngn", "ㄷ": "kt", "ㄹ": "ngn",
      "ㅁ": "ngm", "ㅂ": "kp", "ㅅ": "ks", "ㅈ": "kch", "ㅊ": "kch'",
      "ㅋ": "kk'", "ㅌ": "kt'", "ㅍ": "kp'", "ㅎ": "kh"
    },
    "ㄴ": {
      "ㅇ": "n", "ㄱ": "n'g", "ㄴ": "nn", "ㄷ": "nd", "ㄹ": "ll",
      "ㅁ": "nm", "ㅂ": "nb", "ㅅ": "ns", "ㅈ": "nj", "ㅊ": "nch'",
      "ㅋ": "nk'", "ㅌ": "nt'", "ㅍ": "np'", "ㅎ": "nh"
    },
    "ㄷ": {
      "ㅇ": "d", "ㄱ": "tk", "ㄴ": "nn", "ㄷ": "tt", "ㄹ": "nn",
      "ㅁ": "nm", "ㅂ": "tp", "ㅅ": "ss", "ㅈ": "tch", "ㅊ": "tch'",
      "ㅋ": "tk'", "ㅌ": "tt'", "ㅍ": "tp'", "ㅎ": "th"
    },
    "ㄹ": {
      "ㅇ": "r", "ㄱ": "lg", "ㄴ": "ll", "ㄷ": "ld", "ㄹ": "ll",
      "ㅁ": "lm", "ㅂ": "lb", "ㅅ": "ls", "ㅈ": "lj", "ㅊ": "lch'",
      "ㅋ": "lk'", "ㅌ": "lt'", "ㅍ": "lp'", "ㅎ": "rh"
    },
    "ㅁ": {
      "ㅇ": "m", "ㄱ": "mg", "ㄴ": "mn", "ㄷ": "md", "ㄹ": "mn",
      "ㅁ": "mm", "ㅂ": "mb", "ㅅ": "ms", "ㅈ": "mj", "ㅊ": "mch'",
      "ㅋ": "mk'", "ㅌ": "mt'", "ㅍ": "mp'", "ㅎ": "mh"
    },
    "ㅂ": {
      "ㅇ": "b", "ㄱ": "pk", "ㄴ": "mn", "ㄷ": "pt", "ㄹ": "mn",
      "ㅁ": "mm", "ㅂ": "pp", "ㅅ": "ps", "ㅈ": "pch", "ㅊ": "pch'",
      "ㅋ": "pk'", "ㅌ": "pt'", "ㅍ": "pp'", "ㅎ": "ph"
    },
    "ㅇ": {
      "ㅇ": "ng", "ㄱ": "ngg", "ㄴ": "ngn", "ㄷ": "ngd", "ㄹ": "ngn",
      "ㅁ": "ngm", "ㅂ": "ngb", "ㅅ": "ngs", "ㅈ": "ngj", "ㅊ": "ngch'",
      "ㅋ": "ngk'", "ㅌ": "ngt'", "ㅍ": "ngp'", "ㅎ": "ngh"
    },
    "ㄳ": {
      "ㅇ": "ks", "ㄴ": "ngn", "ㄹ": "ngn", "ㅁ": "ngm"
    },
    "ㄶ": {
      "ㅇ": "nh", "ㄱ": "nk'", "ㄴ": "nn", "ㄷ": "nt'", "ㅂ": "np'",
      "ㅈ": "nch'", "ㅅ": "nss"
    },
    "ㄵ": {
      "ㅇ": "nj", "ㅎ": "nch'", "ㄱ": "nk", "ㄴ": "nn", "ㄷ": "nt",
      "ㄹ": "nn", "ㅁ": "nm", "ㅂ": "np", "ㅅ": "ns", "ㅈ": "nch",
      "ㅊ": "nch'", "ㅋ": "nk'", "ㅌ": "nt'", "ㅍ": "np'"
    },
    "ㄺ": {
      "ㅇ": "lg", "ㄱ": "lg", "ㄲ": "lkk", "ㅋ": "lk'", "ㄴ": "ngn",
      "ㄹ": "ngn", "ㅁ": "ngm", "ㅎ": "lk'"
    },
    "ㄻ": {
      "ㅇ": "lm"
    },
    "ㄼ": {
      "ㅇ": "lb", "ㅎ": "lp'", "ㄱ": "lg", "ㄴ": "ll", "ㄷ": "ld",
      "ㄹ": "ll", "ㅁ": "lm", "ㅂ": "lb", "ㅍ": "lp'", "ㅃ": "lpp"
    },
    "ㄽ": {
      "ㅇ": "ls"
    },
    "ㄾ": {
      "ㅇ": "lt'"
    },
    "ㄿ": {
      "ㅇ": "lp'", "ㄴ": "mn"
    },
    "ㅀ": {
      "ㅇ": "rh", "ㄱ": "lk'", "ㄴ": "ll", "ㄷ": "lt'", "ㅂ": "lp'",
      "ㅈ": "lch'"
    },
    "ㅄ": {
      "ㅇ": "ps", "ㄴ": "mn", "ㄹ": "mn", "ㅁ": "mm"
    }
  };

  const RUN_EXCEPTIONS = {
    "사건": "sakŏn"
  };

  const PARTICLE_SUFFIXES = [
    "에서부터", "에게서는", "에게서", "에서는", "에선", "에게는", "에게도",
    "에게만", "까지는", "부터는", "으로는", "으로도", "으로만", "로서는",
    "께서는", "께서", "에서는", "에서", "에게", "에는", "에도", "에만",
    "에의", "으로", "부터", "까지", "처럼", "보다", "마다", "밖에",
    "하고", "와는", "과는", "와도", "과도", "와만", "과만", "라는",
    "이라", "라고", "이라고", "란", "이란", "이라도", "라도", "이나",
    "나", "이야", "야", "은", "는", "이", "가", "을", "를", "의",
    "에", "와", "과", "도", "만", "로"
  ];

  const NON_PARTICLE_SUFFIXES = [
    "이다", "입니다", "였다", "이었다", "였다", "이고", "이며", "이면",
    "적인", "적으로", "적이다", "스럽다", "스럽게"
  ];

  const SHORT_PARTICLE_STEMS = new Set([
    "나", "너", "저", "그", "이", "것", "말", "꿈", "길", "땅", "집", "책",
    "문", "일", "곳", "때", "날", "차", "해", "달", "별", "산", "강", "물"
  ]);

  function isHangulSyllable(char) {
    const code = char.codePointAt(0);
    return code >= S_BASE && code < S_END;
  }

  function decompose(char) {
    const code = char.codePointAt(0) - S_BASE;
    if (code < 0 || code >= L_COUNT * N_COUNT) return null;
    const initialIndex = Math.floor(code / N_COUNT);
    const vowelIndex = Math.floor((code % N_COUNT) / T_COUNT);
    const finalIndex = code % T_COUNT;
    return {
      char,
      initial: INITIALS[initialIndex],
      vowel: VOWELS[vowelIndex],
      final: FINALS[finalIndex]
    };
  }

  function isSoftContext(previousPart) {
    return Boolean(previousPart && /[aeiouŭŏmnngrly]$/i.test(previousPart));
  }

  function stripBreves(text) {
    return text.replaceAll("ŏ", "o").replaceAll("Ŏ", "O").replaceAll("ŭ", "u").replaceAll("Ŭ", "U");
  }

  function hasFinalConsonant(char) {
    const decomposed = decompose(char);
    return Boolean(decomposed && decomposed.final);
  }

  function canTakeRoParticle(stem, particle) {
    if (particle === "로") {
      return stem.endsWith("적") || !hasFinalConsonant(Array.from(stem).at(-1)) || stem.endsWith("ㄹ");
    }
    if (particle === "으로" || particle.startsWith("으로")) {
      return hasFinalConsonant(Array.from(stem).at(-1)) && !stem.endsWith("ㄹ");
    }
    return true;
  }

  function shouldSkipParticleSplit(word, suffix) {
    if (NON_PARTICLE_SUFFIXES.some((ending) => word.endsWith(ending))) return true;
    const stem = word.slice(0, -suffix.length);
    if (stem.length === 1 && !SHORT_PARTICLE_STEMS.has(stem)) return true;
    if ((suffix === "이" || suffix === "가") && stem.length === 1 && !SHORT_PARTICLE_STEMS.has(stem)) return true;
    return false;
  }

  function splitParticleSuffixes(word) {
    const pieces = [];
    let remainder = word;

    while (remainder.length > 1) {
      const suffix = PARTICLE_SUFFIXES.find((candidate) => {
        if (!remainder.endsWith(candidate)) return false;
        const stem = remainder.slice(0, -candidate.length);
        if (stem.length < 1) return false;
        if (shouldSkipParticleSplit(remainder, candidate)) return false;
        return canTakeRoParticle(stem, candidate);
      });

      if (!suffix) break;
      pieces.unshift(suffix);
      remainder = remainder.slice(0, -suffix.length);
    }

    pieces.unshift(remainder);
    return pieces;
  }

  function applyWordDivision(text) {
    return text.replace(/[가-힣]+/g, (word) => splitParticleSuffixes(word).join(" "));
  }

  function romanizeInitial(initial, previousOutput) {
    if (initial === "ㅇ") return "";
    const style = isSoftContext(previousOutput) ? "soft" : "hard";
    return INITIAL_MR[initial][style];
  }

  function isIOrYVowel(vowel) {
    return vowel === "ㅣ" || vowel === "ㅑ" || vowel === "ㅒ" || vowel === "ㅕ" ||
      vowel === "ㅖ" || vowel === "ㅛ" || vowel === "ㅠ";
  }

  function romanizeBoundary(current, next) {
    const final = current.final;
    const nextInitial = next && next.initial;
    if (!final || !nextInitial) return null;
    if (nextInitial === "ㅇ" && isIOrYVowel(next.vowel)) {
      if (final === "ㄷ") return "j";
      if (final === "ㅌ") return "ch'";
      if (final === "ㄾ") return "lch'";
    }
    if (final === "ㅄ" && nextInitial === "ㅇ" && current.vowel === "ㅏ" && next.vowel === "ㅓ") {
      return "p";
    }
    if (BOUNDARY_MR[final] && BOUNDARY_MR[final][nextInitial]) {
      return BOUNDARY_MR[final][nextInitial];
    }
    if ((final === "ㄳ" || final === "ㄲ" || final === "ㅋ") &&
        (nextInitial === "ㄴ" || nextInitial === "ㄹ" || nextInitial === "ㅁ")) {
      return "ng" + romanizeInitial(nextInitial, "");
    }
    if ((final === "ㅅ" || final === "ㅆ" || final === "ㅈ" || final === "ㅊ" || final === "ㅌ") &&
        (nextInitial === "ㄴ" || nextInitial === "ㄹ" || nextInitial === "ㅁ")) {
      return "n" + romanizeInitial(nextInitial, "");
    }
    if ((final === "ㅂ" || final === "ㅍ" || final === "ㄼ" || final === "ㅄ") &&
        (nextInitial === "ㄴ" || nextInitial === "ㄹ" || nextInitial === "ㅁ")) {
      return "m" + romanizeInitial(nextInitial, "");
    }
    if ((final === "ㅅ" || final === "ㅆ" || final === "ㅈ" || final === "ㅊ" || final === "ㅌ") &&
        (nextInitial === "ㅅ" || nextInitial === "ㅆ")) {
      return "ss";
    }
    if (final === "ㅎ" && (nextInitial === "ㅅ" || nextInitial === "ㅆ")) {
      return "ss";
    }
    if (nextInitial === "ㅇ") {
      return LIAISON[final];
    }
    if (final === "ㅎ" && ASPIRATED_BY_H[nextInitial]) {
      return ASPIRATED_BY_H[nextInitial];
    }
    if (final === "ㄶ" && ASPIRATED_BY_H[nextInitial]) {
      return "n" + ASPIRATED_BY_H[nextInitial];
    }
    if (final === "ㅀ" && ASPIRATED_BY_H[nextInitial]) {
      return "l" + ASPIRATED_BY_H[nextInitial];
    }
    return null;
  }

  function romanizeRun(run) {
    if (RUN_EXCEPTIONS[run]) return RUN_EXCEPTIONS[run];

    const syllables = Array.from(run).map(decompose);
    const out = [];
    const initialHandledByPrevious = new Array(syllables.length).fill(false);

    for (let i = 0; i < syllables.length; i += 1) {
      const current = syllables[i];
      const next = syllables[i + 1];
      const previousOutput = out[out.length - 1] || "";
      const initial = initialHandledByPrevious[i] ? "" : romanizeInitial(current.initial, previousOutput);
      const vowel = VOWEL_MR[current.vowel];
      let final = "";

      if (current.final) {
        const boundary = next ? romanizeBoundary(current, next) : null;
        if (boundary !== null) {
          final = boundary;
          initialHandledByPrevious[i + 1] = true;
        } else {
          final = FINAL_MR[current.final];
        }
      }

      out.push(initial + vowel + final);
    }

    return out.join("");
  }

  function romanizeText(text, options = {}) {
    const useBreves = options.breves !== false;
    const sourceText = options.wordDivision ? applyWordDivision(text) : text;
    let output = "";
    let run = "";

    for (const char of sourceText) {
      if (isHangulSyllable(char)) {
        run += char;
      } else {
        if (run) {
          output += romanizeRun(run);
          run = "";
        }
        output += char;
      }
    }

    if (run) output += romanizeRun(run);
    return useBreves ? output : stripBreves(output);
  }

  function countHangulSyllables(text) {
    return Array.from(text).filter(isHangulSyllable).length;
  }

  global.McCuneReischauer = {
    romanizeText,
    applyWordDivision,
    countHangulSyllables,
    decompose,
    stripBreves
  };

  if (typeof module !== "undefined") {
    module.exports = global.McCuneReischauer;
  }
})(typeof window !== "undefined" ? window : globalThis);
