const fs = require("fs");
const zlib = require("zlib");

const input = process.argv[2];
if (!input) {
  console.error("Usage: node scripts/extract-pdf-text.js <pdf>");
  process.exit(1);
}

const buf = fs.readFileSync(input);
const source = buf.toString("latin1");
const streams = [];
const streamPattern = /<<(?:.|\n|\r)*?\/Filter\s*\/FlateDecode(?:.|\n|\r)*?>>\s*stream\r?\n/g;
let match;

while ((match = streamPattern.exec(source))) {
  const start = match.index + match[0].length;
  const end = source.indexOf("endstream", start);
  if (end < 0) continue;
  const stream = buf.subarray(start, Math.max(start, end - 1));
  try {
    streams.push(zlib.inflateSync(stream).toString("latin1"));
  } catch {
    // Ignore non-page streams that do not inflate cleanly.
  }
}

function decodePdfString(value) {
  return value
    .replace(/\\([nrtbf()\\])/g, (_match, char) => {
      const map = { n: "\n", r: "\r", t: "\t", b: "\b", f: "\f", "(": "(", ")": ")", "\\": "\\" };
      return map[char] || char;
    })
    .replace(/\\([0-7]{1,3})/g, (_match, octal) => String.fromCharCode(parseInt(octal, 8)));
}

const text = [];
for (const stream of streams) {
  const tjPattern = /\((?:\\.|[^\\()])*\)\s*Tj/g;
  let item;
  while ((item = tjPattern.exec(stream))) {
    const raw = item[0].slice(1, item[0].lastIndexOf(")"));
    text.push(decodePdfString(raw));
  }

  const arrayPattern = /\[((?:.|\n|\r)*?)\]\s*TJ/g;
  while ((item = arrayPattern.exec(stream))) {
    const parts = [];
    const stringPattern = /\((?:\\.|[^\\()])*\)/g;
    let part;
    while ((part = stringPattern.exec(item[1]))) {
      parts.push(decodePdfString(part[0].slice(1, -1)));
    }
    if (parts.length) text.push(parts.join(""));
  }
}

console.log(text.join("\n").replace(/\n{3,}/g, "\n\n"));
