// ext-check.html 만들기 (Source Lens 개발용 범용 도구, Claude가 실행함)
//
// 하는 일: src/parts/js/02-file-kinds.js 의 FILE_TYPES 표에서 지원하는 확장자·파일 이름을 모두 뽑아,
// 크롬 계열 브라우저가 폴더를 열 때 막는 이름이 있는지 보는 시험 페이지(ext-check.html)를 만든다.
// (크롬이 .ini·.cfg·.manifest 같은 "위험한 확장자"를 폴더 핸들에서 빼는 문제 확인용, TODO 참고)
//
// 쓰는 때: 새 파일 형식(FILE_TYPES 행)을 더하거나 바꾼 버전마다 다시 만든다.
// 쓰는 법 (source 폴더에서): node tools/make-ext-check.js <만들 파일 경로>
//   예: node tools/make-ext-check.js "../Claude outputs/ext-check.html"
// 만든 ext-check.html은 Git에 넣지 않는다 (틀 tools/ext-check.template.html 과 이 파일만 보관).
// 시험 방법: 만든 페이지를 크롬/Edge로 열고, 빈 폴더를 만들어 A 단추 → B 단추 순서로 누른다.
"use strict";
const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const out = process.argv[2];
if (!out) { console.error("usage: node tools/make-ext-check.js <output .html>"); process.exit(2); }

const kinds = fs.readFileSync(path.join(root, "src/parts/js/02-file-kinds.js"), "utf8");
const m = kinds.match(/const FILE_TYPES = \[([\s\S]*?)\n\];/);
if (!m) { console.error("FILE_TYPES 표를 찾지 못했습니다 (02-file-kinds.js)"); process.exit(2); }
const types = new Function("return [" + m[1] + "\n];")();

const names = [];
for (const ft of types) {
  for (const e of ft.exts || []) names.push("test_" + ft.id + "." + e);   // 확장자: test_<id>.<확장자>
  for (const n of ft.names || []) names.push(n);                            // 파일 이름: 그대로
}
const uniq = [...new Set(names)];

const tpl = fs.readFileSync(path.join(__dirname, "ext-check.template.html"), "utf8");
if (!tpl.includes("/*NAMES*/[]") || !tpl.includes("{{COUNT}}")) { console.error("틀에 /*NAMES*/[] 또는 {{COUNT}} 가 없습니다"); process.exit(2); }
const html = tpl.replace("/*NAMES*/[]", JSON.stringify(uniq)).replace("{{COUNT}}", String(uniq.length));
fs.writeFileSync(out, html);
console.log(uniq.length + "개 이름으로 " + out + " 를 만들었습니다.");
