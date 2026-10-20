// ---------- JSON5 읽기 (언어팩용 작은 구현) ----------
// 주석, 따옴표 없는 키, 작은따옴표, 끝 쉼표, 이스케이프(\n \uXXXX \xXX 줄 잇기), 16진수·Infinity·NaN을 읽는다.
// 틀리면 Error (e.line = 줄 번호)
function json5Parse(src) {
  let i = 0;
  const fail = msg => { const e = new Error(msg); e.line = src.slice(0, i).split("\n").length; throw e; };
  const ws = () => {
    for (;;) {
      const c = src[i];
      if (c === " " || c === "\t" || c === "\n" || c === "\r" || c === "\v" || c === "\f" || c === " " || c === "﻿" || c === " " || c === " ") i++;
      else if (c === "/" && src[i + 1] === "/") { while (i < src.length && src[i] !== "\n") i++; }
      else if (c === "/" && src[i + 1] === "*") { const e = src.indexOf("*/", i + 2); if (e < 0) fail("unclosed comment"); i = e + 2; }
      else return;
    }
  };
  const hex = n => {
    const h = src.slice(i, i + n);
    if (h.length < n || !/^[\da-fA-F]+$/.test(h)) fail("invalid hex escape");
    i += n; return String.fromCharCode(parseInt(h, 16));
  };
  const str = () => {
    const q = src[i++]; let out = "";
    for (;;) {
      if (i >= src.length) fail("unclosed string");
      const c = src[i++];
      if (c === q) return out;
      if (c === "\n") { i--; fail("unclosed string"); }
      if (c !== "\\") { out += c; continue; }
      const e = src[i++];
      if (e === "n") out += "\n"; else if (e === "t") out += "\t"; else if (e === "r") out += "\r";
      else if (e === "b") out += "\b"; else if (e === "f") out += "\f"; else if (e === "v") out += "\v";
      else if (e === "0" && !/\d/.test(src[i] || "")) out += "\0";
      else if (e === "x") out += hex(2);
      else if (e === "u") out += hex(4);
      else if (e === "\r") { if (src[i] === "\n") i++; }
      else if (e === "\n" || e === " " || e === " ") { /* 줄 잇기 */ }
      else if (e === undefined) fail("unclosed string");
      else out += e;
    }
  };
  const key = () => {
    const c = src[i];
    if (c === '"' || c === "'") return str();
    const m = /[A-Za-z_$][\w$]*/y; m.lastIndex = i;
    const r = m.exec(src);
    if (!r) fail("expected a key");
    i += r[0].length; return r[0];
  };
  const num = /[+-]?(?:Infinity|NaN|0[xX][\da-fA-F]+|(?:\d+\.?\d*|\.\d+)(?:[eE][+-]?\d+)?)(?![\w$])/y;
  const value = () => {
    ws();
    const c = src[i];
    if (c === "{") {
      i++; const o = Object.create(null);
      for (;;) {
        ws();
        if (src[i] === "}") { i++; return o; }
        const k = key(); ws();
        if (src[i] !== ":") fail("':' expected");
        i++; o[k] = value(); ws();
        if (src[i] === ",") i++;
        else if (src[i] !== "}") fail("',' or '}' expected");
      }
    }
    if (c === "[") {
      i++; const a = [];
      for (;;) {
        ws();
        if (src[i] === "]") { i++; return a; }
        a.push(value()); ws();
        if (src[i] === ",") i++;
        else if (src[i] !== "]") fail("',' or ']' expected");
      }
    }
    if (c === '"' || c === "'") return str();
    for (const [w, v] of [["true", true], ["false", false], ["null", null]])
      if (src.startsWith(w, i) && !/[\w$]/.test(src[i + w.length] || "")) { i += w.length; return v; }
    num.lastIndex = i;
    const m = num.exec(src);
    if (!m) fail(c === undefined ? "expected a value" : "unexpected '" + c + "'");
    i += m[0].length;
    const s = m[0], sign = s[0] === "-" ? -1 : 1, b = s.replace(/^[+-]/, "");
    return b === "Infinity" ? sign * Infinity : b === "NaN" ? NaN : sign * Number(b);
  };
  const v = value(); ws();
  if (i < src.length) fail("unexpected text after the value");
  return v;
}

