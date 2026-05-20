const assert = require("node:assert/strict");
const { romanizeText, stripBreves, countHangulSyllables, applyWordDivision } = require("./romanizer");

const cases = [
  ["한글", "han'gŭl"],
  ["한국", "han'guk"],
  ["한국어", "han'gugŏ"],
  ["영혼", "yŏnghon"],
  ["영화", "yŏnghwa"],
  ["서울", "sŏul"],
  ["부산", "pusan"],
  ["평양", "p'yŏngyang"],
  ["조선", "chosŏn"],
  ["신라", "silla"],
  ["총론", "ch'ongnon"],
  ["발해", "parhae"],
  ["김치", "kimch'i"],
  ["문학", "munhak"],
  ["같이", "kat'i"],
  ["좋은", "choŭn"],
  ["좋다", "chot'a"],
  ["없다", "ŏpta"],
  ["읽어요", "ilgŏyo"],
  ["고기", "kogi"],
  ["가을", "kaŭl"],
  ["프린스턴", "p'ŭrinsŭt'ŏn"],
  ["국립", "kungnip"],
  ["독립", "tongnip"]
];

for (const [input, expected] of cases) {
  assert.equal(romanizeText(input), expected, input);
}

assert.equal(stripBreves("sŏul hangŭl"), "soul hangul");
assert.equal(romanizeText("한글", { breves: false }), "han'gul");
assert.equal(countHangulSyllables("A 한글!"), 2);
assert.equal(applyWordDivision("우리의 사명"), "우리 의 사명");
assert.equal(applyWordDivision("이 땅에서 학문 하기"), "이 땅 에서 학문 하기");
assert.equal(applyWordDivision("아이의 가슴에는 부모가 산다"), "아이 의 가슴 에는 부모 가 산다");
assert.equal(applyWordDivision("초원의 꿈을 그대에게"), "초원 의 꿈 을 그대 에게");
assert.equal(applyWordDivision("역사적으로 중요한 도시입니다"), "역사적으로 중요한 도시입니다");
assert.equal(applyWordDivision("한글은 한국어를 적는 문자입니다"), "한글 은 한국어 를 적는 문자입니다");
assert.equal(applyWordDivision("좋은 날에"), "좋은 날 에");
assert.equal(romanizeText("우리의 사명", { wordDivision: true }), "uri ŭi samyŏng");
assert.equal(romanizeText("이 땅에서 학문 하기", { wordDivision: true }), "i ttang esŏ hangmun hagi");
assert.equal(romanizeText("아이의 가슴에는 부모가 산다", { wordDivision: true }), "ai ŭi kasŭm enŭn pumo ka sanda");
assert.equal(romanizeText("초원의 꿈을 그대에게", { wordDivision: true }), "ch'owŏn ŭi kkum ŭl kŭdae ege");

console.log(`${cases.length + 14} romanizer checks passed`);
