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
  ["같이", "kach'i"],
  ["좋은", "choŭn"],
  ["좋다", "chot'a"],
  ["없다", "ŏpta"],
  ["읽어요", "ilgŏyo"],
  ["읽는다", "ingnŭnda"],
  ["읽고", "ilgo"],
  ["읽었습니다", "ilgŏssŭmnida"],
  ["고기", "kogi"],
  ["사건", "sakŏn"],
  ["가을", "kaŭl"],
  ["프린스턴", "p'ŭrinsŭt'ŏn"],
  ["국립", "kungnip"],
  ["독립", "tongnip"],
  ["붉히다", "pulk'ida"],
  ["긁다", "kŭkta"],
  ["좋게", "chok'e"],
  ["좋습니다", "chossŭmnida"],
  ["반닫이", "pandaji"],
  ["않고", "ank'o"],
  ["않습니다", "anssŭmnida"],
  ["앉다", "anta"],
  ["앉아요", "anjayo"],
  ["앉히다", "anch'ida"],
  ["값만", "kamman"],
  ["값어치", "kapŏch'i"],
  ["없이", "ŏpsi"],
  ["넓히다", "nŏlp'ida"],
  ["끓는", "kkŭllŭn"]
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
assert.equal(romanizeText("[소래마을]", { wordDivision: true }), "Soremaŭl");
assert.equal(romanizeText("[소래마을]에 갔다", { wordDivision: true }), "Soremaŭl e katta");
assert.equal(romanizeText("[서울대학교]에서 공부했다", { wordDivision: true }), "Sŏuldaehakkyo esŏ kongbuhaetta");
assert.equal(romanizeText("[이 순신]의 생애", { wordDivision: true, personNameHyphens: true }), "Yi Sun-sin ŭi saengae");
assert.equal(romanizeText("[김 수환] 추기경", { wordDivision: true, personNameHyphens: true }), "Kim Su-hwan ch'ugigyŏng");

console.log(`${cases.length + 19} romanizer checks passed`);
