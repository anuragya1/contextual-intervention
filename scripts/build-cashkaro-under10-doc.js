const fs = require("fs");
const path = require("path");

const outDir = path.join(process.cwd(), "tmp_cashkaro_under10_docx");
fs.rmSync(outDir, { recursive: true, force: true });
fs.mkdirSync(path.join(outDir, "_rels"), { recursive: true });
fs.mkdirSync(path.join(outDir, "docProps"), { recursive: true });
fs.mkdirSync(path.join(outDir, "word", "_rels"), { recursive: true });

const esc = (value) =>
  String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

function run(text, opts = {}) {
  const props = ['<w:rFonts w:ascii="Arial" w:hAnsi="Arial" w:cs="Arial"/>'];
  if (opts.bold) props.push("<w:b/>");
  if (opts.italic) props.push("<w:i/>");
  if (opts.size) props.push(`<w:sz w:val="${opts.size * 2}"/>`);
  if (opts.color) props.push(`<w:color w:val="${opts.color}"/>`);
  return `<w:r><w:rPr>${props.join("")}</w:rPr><w:t xml:space="preserve">${esc(text)}</w:t></w:r>`;
}

function paragraph(text, style = "Normal", opts = {}) {
  const spacing = opts.after ?? (style === "Normal" ? 120 : 100);
  const before = opts.before ?? 0;
  const numPr = opts.numId
    ? `<w:numPr><w:ilvl w:val="0"/><w:numId w:val="${opts.numId}"/></w:numPr>`
    : "";
  const keepNext = style === "Heading1" || style === "Heading2" ? "<w:keepNext/>" : "";
  return `<w:p><w:pPr><w:pStyle w:val="${style}"/>${keepNext}${numPr}<w:spacing w:before="${before}" w:after="${spacing}" w:line="276" w:lineRule="auto"/></w:pPr>${run(text, opts)}</w:p>`;
}

function table(rows, widths, opts = {}) {
  const total = widths.reduce((sum, width) => sum + width, 0);
  const grid = widths.map((width) => `<w:gridCol w:w="${width}"/>`).join("");
  const rowXml = rows
    .map((row, rowIndex) => {
      const cells = row
        .map((cell, cellIndex) => {
          const value = typeof cell === "string" ? cell : cell.text;
          const bold = rowIndex === 0 || (typeof cell === "object" && cell.bold);
          const fill = rowIndex === 0 ? '<w:shd w:fill="F8F9FA"/>' : "";
          const valign = "<w:vAlign w:val=\"center\"/>";
          return `<w:tc><w:tcPr><w:tcW w:w="${widths[cellIndex]}" w:type="dxa"/>${fill}${valign}<w:tcMar><w:top w:w="90" w:type="dxa"/><w:bottom w:w="90" w:type="dxa"/><w:start w:w="120" w:type="dxa"/><w:end w:w="120" w:type="dxa"/></w:tcMar></w:tcPr>${paragraph(value, opts.compact ? "SmallTableText" : "TableText", { bold, after: 40 })}</w:tc>`;
        })
        .join("");
      return `<w:tr>${cells}</w:tr>`;
    })
    .join("");
  return `<w:tbl><w:tblPr><w:tblW w:w="${total}" w:type="dxa"/><w:tblBorders><w:top w:val="single" w:sz="4" w:space="0" w:color="DADCE0"/><w:left w:val="single" w:sz="4" w:space="0" w:color="DADCE0"/><w:bottom w:val="single" w:sz="4" w:space="0" w:color="DADCE0"/><w:right w:val="single" w:sz="4" w:space="0" w:color="DADCE0"/><w:insideH w:val="single" w:sz="4" w:space="0" w:color="DADCE0"/><w:insideV w:val="single" w:sz="4" w:space="0" w:color="DADCE0"/></w:tblBorders><w:tblLook w:firstRow="1" w:noHBand="1" w:noVBand="1"/></w:tblPr><w:tblGrid>${grid}</w:tblGrid>${rowXml}</w:tbl>`;
}

function flow(title, steps) {
  return table([[title, steps.join(" -> ")]], [1700, 7660], { compact: true });
}

const blocks = [];

blocks.push(paragraph("CashKaro Contextual Cashback MVP", "DocTitle", { size: 26, after: 40 }));
blocks.push(paragraph("Assessment brief | Condensed Google Docs version under 10 pages", "Subtitle", { after: 140 }));

blocks.push(paragraph("1. Product Thesis", "Heading1"));
blocks.push(paragraph("Existing CashKaro users may already understand cashback, but CashKaro can become absent from the shopping journey once purchase intent becomes concrete. If a user has already found a product directly on a retailer, asking them to leave, restart, and recreate the journey can feel like unnecessary friction unless the saving is meaningful."));
blocks.push(paragraph("Core hypothesis: when a user is close to completing a purchase, a timely contextual intervention with sufficiently compelling cashback can recover purchases that would otherwise bypass CashKaro, without introducing unacceptable friction or annoyance.", "Normal", { bold: true }));
blocks.push(table(
  [
    ["User problem", "CashKaro problem"],
    ["Misses potential cashback", "Misses a trackable transaction"],
    ["Has to restart the journey to recover it", "Loses affiliate value from an existing user"]
  ],
  [4680, 4680],
  { compact: true }
));

blocks.push(paragraph("2. Problem, Insight and Opportunity", "Heading1"));
blocks.push(paragraph("The problem is not necessarily lack of awareness. The sharper issue is that CashKaro can disappear between product discovery and purchase. A user may discover a product, compare options, reach cart or payment on a retailer, and only then remember CashKaro - or not remember it at all."));
blocks.push(flow("Current behaviour", ["User discovers product", "Compares options", "Reaches cart/payment", "Remembers CashKaro late or forgets", "Completes purchase directly"]));
blocks.push(flow("Opportunity", ["User discovers product", "Compares options", "Reaches high-intent moment", "CashKaro presents relevant saving", "User activates", "Completes purchase"]));
blocks.push(paragraph("Opportunity statement: How might we bring CashKaro into an existing high-intent shopping journey at the right moment, while preserving context and requiring minimal additional effort?", "Normal", { bold: true }));

blocks.push(paragraph("3. Product Principles", "Heading1"));
blocks.push(table(
  [
    ["Principle", "Meaning in the MVP"],
    ["Preserve context", "The user should not have to restart product discovery or repeat work already completed."],
    ["Minimize additional effort", "The value of the intervention should be proportional to the cashback or benefit available."],
    ["Intervene at high intent", "CashKaro should appear when purchase likelihood is stronger, not during casual browsing."],
    ["Design beyond one retailer", "The solution should be based on general shopping behaviour rather than one retailer's systems."],
    ["Keep it testable", "Because internal funnel data is unavailable here, the MVP should be structured around measurable experiments and explicit assumptions."]
  ],
  [2300, 7060],
  { compact: true }
));

blocks.push(paragraph("4. Solution Space", "Heading1"));
blocks.push(paragraph("The strongest directions are the ones that bring CashKaro into the user's existing journey rather than asking the user to restart it. The comparison below uses the criteria from the reference: friction, context preservation, coverage, feasibility, scalability, experimentability, and incentive strength."));
blocks.push(table(
  [
    ["Solution", "Friction", "Context", "Coverage", "Feasibility", "Experimentability", "Takeaway"],
    ["Contextual intervention", "Low-Med", "High", "High*", "Medium", "High", "Best balance for MVP"],
    ["Mobile re-engagement", "Low", "Medium", "High", "Med-High", "High", "Useful, but timing may be noisy"],
    ["Shopping assistant", "Low-Med", "High", "High*", "Med-Low", "High", "Promising, but more matching complexity"],
    ["Retailer integration", "Very low", "Very high", "Low initially", "Low", "High", "Clean UX, but retailer-dependent"]
  ],
  [1700, 1000, 1000, 1050, 1100, 1300, 2210],
  { compact: true }
));
blocks.push(paragraph("*Subject to platform capabilities, eligibility, permissions, and available signals. These are assumptions to validate, not established facts."));
blocks.push(paragraph("Prioritization decision: a contextual, platform-independent intervention with a strong incentive is the primary MVP direction. A generic reminder is too weak; the intervention must make the saving concrete enough for the user to think the extra step is worth it.", "Normal", { bold: true }));

blocks.push(paragraph("5. MVP Definition and User Flow", "Heading1"));
blocks.push(paragraph("MVP objective: test whether CashKaro can recover otherwise-missed purchases by intervening at a high-intent moment in the user's existing shopping journey. The MVP tests three variables: timing, incentive, and transition friction."));
blocks.push(table(
  [
    ["Step", "User / system behaviour"],
    ["1. Product discovery", "User searches and compares through their preferred retailer. Intervention is not yet the focus."],
    ["2. Product selection", "User selects a product and moves closer to purchase. Intent becomes more concrete."],
    ["3. Contextual intervention", "CashKaro identifies an eligible context and presents a lightweight cashback opportunity."],
    ["4. Value evaluation", "User decides whether the saving is worth the additional effort."],
    ["5. Minimal transition", "CashKaro preserves available context such as retailer, product page, offer, and destination URL where possible."],
    ["6. Purchase and tracking", "User continues through the eligible retailer path; the important outcome is a tracked transaction that would otherwise have bypassed CashKaro."]
  ],
  [2250, 7110],
  { compact: true }
));
blocks.push(flow("Prototype flow", ["ShopNow product page", "Buy Now/payment", "CashKaro intervention", "Activate cashback", "Context preserved", "Return to ShopNow checkout"]));
blocks.push(paragraph("Key product rule: the closer the user is to purchase, the stronger the value proposition needs to be relative to the effort being requested.", "Normal", { bold: true }));

blocks.push(paragraph("6. MVP Scope", "Heading1"));
blocks.push(table(
  [
    ["In scope", "Out of scope"],
    ["Detecting an eligible high-intent shopping context", "Building a complete AI shopping assistant"],
    ["Triggering a contextual CashKaro intervention", "Deep integration with every retailer"],
    ["Presenting a meaningful cashback incentive", "Rebuilding retailer checkout flows"],
    ["Allowing activation and preserving context where technically possible", "Perfect product matching across every retailer"],
    ["Tracking resulting transactions and measuring incrementality", "Solving attribution across every possible browser and mobile environment"]
  ],
  [4680, 4680],
  { compact: true }
));
blocks.push(paragraph("The MVP is intentionally narrow: test whether contextual intervention plus meaningful incentive can generate incremental CashKaro transactions."));

blocks.push(paragraph("7. Experiment Design and Metrics", "Heading1"));
blocks.push(table(
  [
    ["Variant", "Experience", "Incentive"],
    ["Control", "Normal shopping journey", "-"],
    ["Treatment A", "Contextual CashKaro intervention", "Lower incentive"],
    ["Treatment B", "Contextual CashKaro intervention", "Medium incentive"],
    ["Treatment C", "Contextual CashKaro intervention", "Higher incentive"]
  ],
  [2000, 4560, 2800],
  { compact: true }
));
blocks.push(paragraph("Primary metric: incremental tracked transactions per eligible shopping session. This is more meaningful than clicks because a user can click an intervention and still abandon the purchase."));
blocks.push(table(
  [
    ["Metric group", "Metrics from the reference"],
    ["User behaviour", "Intervention impression rate; dismissal rate; CashKaro activation rate; activation to completed transaction rate; purchase completion rate; repeat usage after successful activation."],
    ["Business impact", "Incremental tracked transactions; incremental GMV; incremental cashback cost; incremental CashKaro revenue/contribution; average cashback required per incremental transaction; contribution after incentive cost."],
    ["Experience", "Intervention frequency per user; user dismissal/annoyance rate; abandonment after intervention; time or steps added to the shopping journey."]
  ],
  [2300, 7060],
  { compact: true }
));
blocks.push(flow("Learning loop", ["Detect meaningful purchase intent", "Intervene at the right moment", "Test incentive strength", "Preserve context", "Measure incremental tracked transactions with sustainable economics"]));
blocks.push(paragraph("Incrementality principle: incremental transactions = treatment transactions - expected control transactions. This separates transactions that would have happened anyway from transactions recovered because of the intervention."));

blocks.push(paragraph("8. Validation, Feasibility and Risks", "Heading1"));
blocks.push(table(
  [
    ["Hypothesis / risk", "What needs validation"],
    ["High-intent users are more likely to switch", "Which shopping signals indicate purchase intent, and whether performance improves as intent increases."],
    ["Meaningful saving can overcome switching friction", "Minimum perceived saving, response across incentive levels, and diminishing returns."],
    ["Context preservation affects conversion", "How much existing product/shopping context can be preserved, and whether preservation increases completion."],
    ["Approach can work across retailers", "Which signals are consistent across retailers and which flows require retailer-specific handling."],
    ["False-positive intent detection", "Whether interventions appear during normal browsing and become annoying."],
    ["Incentive economics", "Whether added cashback cost is justified by recovered incremental value."],
    ["User trust and fatigue", "Whether relevance and timing are strong enough to avoid disruption."]
  ],
  [2700, 6660],
  { compact: true }
));
blocks.push(paragraph("Candidate intent signals from the reference include repeated visits to the same product, time spent on product or retailer pages, movement toward cart or checkout, repeated product searches, price or offer comparison behaviour, and return visits within a short period. These should be treated as candidate signals, not proven indicators."));

blocks.push(paragraph("9. Roadmap and Decision Framework", "Heading1"));
blocks.push(table(
  [
    ["Phase", "Focus", "Goal"],
    ["Phase 1", "Validate intervention timing, incentive levels, tracked transactions, and user acceptance.", "Establish whether the core hypothesis is valid."],
    ["Phase 2", "Improve product recognition, offer matching, context preservation, deep linking, and retailer-specific flows where justified.", "Make transition from retailer journey to CashKaro increasingly seamless."],
    ["Phase 3", "Expand across mobile web, desktop web, supported app environments, more categories, and more retailers.", "Recover high-intent purchases that would otherwise bypass CashKaro."],
    ["Phase 4", "Personalize when to intervene, which offer to show, incentive size, and where not to intervene.", "Move toward an intelligent contextual savings layer."]
  ],
  [1500, 5560, 2300],
  { compact: true }
));
blocks.push(table(
  [
    ["Decision", "Condition"],
    ["Continue", "Intervention creates statistically and economically meaningful incremental transactions without unacceptable user disruption."],
    ["Iterate", "Positive movement exists, but timing, incentive economics, or context preservation need improvement."],
    ["Stop", "The intervention fails to generate meaningful incrementality or requires excessive incentives/friction."]
  ],
  [1800, 7560],
  { compact: true }
));
blocks.push(paragraph("Final strategic takeaway: CashKaro should not force users to change how they shop. The stronger product move is to become relevant inside an existing high-intent shopping journey, make the saving concrete, preserve as much context as possible, and test whether that creates incremental tracked transactions.", "Normal", { bold: true }));

const body = blocks.join("\n");

const documentXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"><w:body>${body}<w:sectPr><w:pgSz w:w="12240" w:h="15840"/><w:pgMar w:top="1440" w:right="1440" w:bottom="1440" w:left="1440" w:header="708" w:footer="708" w:gutter="0"/></w:sectPr></w:body></w:document>`;

const stylesXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><w:styles xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
<w:style w:type="paragraph" w:default="1" w:styleId="Normal"><w:name w:val="Normal"/><w:qFormat/><w:pPr><w:spacing w:after="120" w:line="276" w:lineRule="auto"/></w:pPr><w:rPr><w:rFonts w:ascii="Arial" w:hAnsi="Arial" w:cs="Arial"/><w:sz w:val="22"/><w:color w:val="000000"/></w:rPr></w:style>
<w:style w:type="paragraph" w:styleId="DocTitle"><w:name w:val="Doc Title"/><w:basedOn w:val="Normal"/><w:qFormat/><w:pPr><w:spacing w:before="0" w:after="40"/></w:pPr><w:rPr><w:rFonts w:ascii="Arial" w:hAnsi="Arial" w:cs="Arial"/><w:sz w:val="52"/><w:color w:val="000000"/></w:rPr></w:style>
<w:style w:type="paragraph" w:styleId="Subtitle"><w:name w:val="Subtitle"/><w:basedOn w:val="Normal"/><w:qFormat/><w:pPr><w:spacing w:before="0" w:after="140" w:line="276" w:lineRule="auto"/></w:pPr><w:rPr><w:rFonts w:ascii="Arial" w:hAnsi="Arial" w:cs="Arial"/><w:sz w:val="22"/><w:color w:val="555555"/></w:rPr></w:style>
<w:style w:type="paragraph" w:styleId="Heading1"><w:name w:val="heading 1"/><w:basedOn w:val="Normal"/><w:next w:val="Normal"/><w:qFormat/><w:pPr><w:keepNext/><w:spacing w:before="300" w:after="100"/></w:pPr><w:rPr><w:rFonts w:ascii="Arial" w:hAnsi="Arial" w:cs="Arial"/><w:sz w:val="36"/><w:color w:val="000000"/></w:rPr></w:style>
<w:style w:type="paragraph" w:styleId="Heading2"><w:name w:val="heading 2"/><w:basedOn w:val="Normal"/><w:next w:val="Normal"/><w:qFormat/><w:pPr><w:keepNext/><w:spacing w:before="240" w:after="80"/></w:pPr><w:rPr><w:rFonts w:ascii="Arial" w:hAnsi="Arial" w:cs="Arial"/><w:sz w:val="28"/><w:color w:val="000000"/></w:rPr></w:style>
<w:style w:type="paragraph" w:styleId="TableText"><w:name w:val="Table Text"/><w:basedOn w:val="Normal"/><w:pPr><w:spacing w:after="40" w:line="276" w:lineRule="auto"/></w:pPr><w:rPr><w:rFonts w:ascii="Arial" w:hAnsi="Arial" w:cs="Arial"/><w:sz w:val="19"/><w:color w:val="000000"/></w:rPr></w:style>
<w:style w:type="paragraph" w:styleId="SmallTableText"><w:name w:val="Small Table Text"/><w:basedOn w:val="Normal"/><w:pPr><w:spacing w:after="30" w:line="264" w:lineRule="auto"/></w:pPr><w:rPr><w:rFonts w:ascii="Arial" w:hAnsi="Arial" w:cs="Arial"/><w:sz w:val="18"/><w:color w:val="000000"/></w:rPr></w:style>
</w:styles>`;

const numberingXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><w:numbering xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
<w:abstractNum w:abstractNumId="1"><w:multiLevelType w:val="singleLevel"/><w:lvl w:ilvl="0"><w:start w:val="1"/><w:numFmt w:val="bullet"/><w:lvlText w:val="●"/><w:lvlJc w:val="left"/><w:pPr><w:tabs><w:tab w:val="num" w:pos="720"/></w:tabs><w:ind w:left="720" w:hanging="360"/></w:pPr><w:rPr><w:rFonts w:ascii="Arial" w:hAnsi="Arial" w:hint="default"/></w:rPr></w:lvl></w:abstractNum>
<w:num w:numId="1"><w:abstractNumId w:val="1"/></w:num></w:numbering>`;

const contentTypes = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/><Override PartName="/word/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.styles+xml"/><Override PartName="/word/numbering.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.numbering+xml"/><Override PartName="/docProps/core.xml" ContentType="application/vnd.openxmlformats-package.core-properties+xml"/><Override PartName="/docProps/app.xml" ContentType="application/vnd.openxmlformats-officedocument.extended-properties+xml"/></Types>`;
const rels = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/></Relationships>`;
const docRels = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/><Relationship Id="rId2" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/numbering" Target="numbering.xml"/></Relationships>`;
const core = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><cp:coreProperties xmlns:cp="http://schemas.openxmlformats.org/package/2006/metadata/core-properties" xmlns:dc="http://purl.org/dc/elements/1.1/"><dc:title>CashKaro Contextual Cashback MVP</dc:title><dc:creator>Codex</dc:creator><cp:lastModifiedBy>Codex</cp:lastModifiedBy></cp:coreProperties>`;
const app = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Properties xmlns="http://schemas.openxmlformats.org/officeDocument/2006/extended-properties"><Application>Codex</Application></Properties>`;

const files = {
  "[Content_Types].xml": contentTypes,
  "_rels/.rels": rels,
  "docProps/core.xml": core,
  "docProps/app.xml": app,
  "word/document.xml": documentXml,
  "word/styles.xml": stylesXml,
  "word/numbering.xml": numberingXml,
  "word/_rels/document.xml.rels": docRels
};

for (const [name, content] of Object.entries(files)) {
  const full = path.join(outDir, name);
  fs.mkdirSync(path.dirname(full), { recursive: true });
  fs.writeFileSync(full, content, "utf8");
}

console.log(outDir);
