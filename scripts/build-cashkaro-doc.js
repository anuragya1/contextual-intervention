const fs = require("fs");
const path = require("path");

const outDir = path.join(process.cwd(), "tmp_cashkaro_docx");
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
  const props = [];
  if (opts.bold) props.push("<w:b/>");
  if (opts.italic) props.push("<w:i/>");
  if (opts.size) props.push(`<w:sz w:val="${opts.size * 2}"/>`);
  if (opts.color) props.push(`<w:color w:val="${opts.color}"/>`);
  props.push('<w:rFonts w:ascii="Arial" w:hAnsi="Arial" w:cs="Arial"/>');
  return `<w:r><w:rPr>${props.join("")}</w:rPr><w:t xml:space="preserve">${esc(text)}</w:t></w:r>`;
}

function paragraph(text, style = "Normal", opts = {}) {
  const spacing = opts.after ?? (style === "Normal" ? 160 : 120);
  const before = opts.before ?? 0;
  const keepNext = opts.keepNext ? "<w:keepNext/>" : "";
  const numPr = opts.numId
    ? `<w:numPr><w:ilvl w:val="0"/><w:numId w:val="${opts.numId}"/></w:numPr>`
    : "";
  return `<w:p><w:pPr><w:pStyle w:val="${style}"/>${keepNext}${numPr}<w:spacing w:before="${before}" w:after="${spacing}" w:line="276" w:lineRule="auto"/></w:pPr>${run(
    text,
    opts
  )}</w:p>`;
}

function table(rows, widths) {
  const total = widths.reduce((sum, width) => sum + width, 0);
  const grid = widths.map((width) => `<w:gridCol w:w="${width}"/>`).join("");
  const rowXml = rows
    .map((row, rowIndex) => {
      const cells = row
        .map((cell, cellIndex) => {
          const fill = rowIndex === 0 ? '<w:shd w:fill="F8F9FA"/>' : "";
          const bold = rowIndex === 0 || cell.bold;
          return `<w:tc><w:tcPr><w:tcW w:w="${widths[cellIndex]}" w:type="dxa"/>${fill}<w:tcMar><w:top w:w="80" w:type="dxa"/><w:bottom w:w="80" w:type="dxa"/><w:start w:w="120" w:type="dxa"/><w:end w:w="120" w:type="dxa"/></w:tcMar></w:tcPr>${paragraph(
            typeof cell === "string" ? cell : cell.text,
            "TableText",
            { bold, after: 60 }
          )}</w:tc>`;
        })
        .join("");
      return `<w:tr>${cells}</w:tr>`;
    })
    .join("");
  return `<w:tbl><w:tblPr><w:tblW w:w="${total}" w:type="dxa"/><w:tblBorders><w:top w:val="single" w:sz="4" w:space="0" w:color="DADCE0"/><w:left w:val="single" w:sz="4" w:space="0" w:color="DADCE0"/><w:bottom w:val="single" w:sz="4" w:space="0" w:color="DADCE0"/><w:right w:val="single" w:sz="4" w:space="0" w:color="DADCE0"/><w:insideH w:val="single" w:sz="4" w:space="0" w:color="DADCE0"/><w:insideV w:val="single" w:sz="4" w:space="0" w:color="DADCE0"/></w:tblBorders><w:tblLook w:firstRow="1" w:noHBand="1" w:noVBand="1"/></w:tblPr><w:tblGrid>${grid}</w:tblGrid>${rowXml}</w:tbl>`;
}

const blocks = [];
blocks.push(paragraph("CashKaro Contextual Cashback MVP", "DocTitle", { size: 26, after: 60 }));
blocks.push(paragraph("A concise product assessment brief for a browser-level intervention that recovers high-intent purchases without asking users to restart their shopping journey.", "Subtitle", { after: 220 }));

blocks.push(paragraph("1. Executive Summary", "Heading1"));
blocks.push(paragraph("CashKaro's missed opportunity is not only awareness. Existing users may already understand cashback, but CashKaro can disappear from the journey once the user starts shopping directly on a retailer. By the time the user reaches cart or payment, leaving the retailer and restarting through CashKaro may feel like too much effort unless the saving is clearly meaningful."));
blocks.push(paragraph("The proposed MVP is a contextual cashback intervention that appears inside an existing shopping environment at a high-intent moment. It shows the exact saving, lets the user activate CashKaro, preserves the product context where possible, and returns the user to the retailer checkout path."));
blocks.push(paragraph("The MVP should not claim that intent detection, attribution, cross-retailer compatibility, or context preservation are solved. It should test whether timing plus a meaningful incentive can generate incremental tracked transactions without creating user annoyance."));

blocks.push(paragraph("2. Problem Hypothesis", "Heading1"));
blocks.push(paragraph("Working hypothesis: Existing CashKaro users can bypass CashKaro because the product is absent at the moment purchase intent becomes concrete."));
blocks.push(paragraph("A typical missed journey looks like this: user discovers product on retailer, compares options, reaches cart or payment, remembers CashKaro too late or not at all, and completes the purchase directly. The user misses cashback; CashKaro misses a potentially trackable transaction."));
blocks.push(paragraph("This is a context and timing problem more than a generic awareness problem. If the user has already selected a product, the intervention must respect the work already done and make the added step feel worthwhile."));
blocks.push(paragraph("Evidence and assumptions", "Heading2"));
blocks.push(paragraph("Evidence available: CashKaro's value depends on users entering a trackable purchase path, while real shopping often begins directly on retailer surfaces.", "Normal", { numId: 1 }));
blocks.push(paragraph("Behavioural assumption: the closer a user is to purchase, the less willing they are to restart the journey for a small reward.", "Normal", { numId: 1 }));
blocks.push(paragraph("Product assumption: a sufficiently meaningful cashback amount can offset the friction of switching through CashKaro.", "Normal", { numId: 1 }));
blocks.push(paragraph("Technical assumption: at least some high-intent retailer moments can be detected and acted on with enough accuracy to run a controlled MVP.", "Normal", { numId: 1 }));

blocks.push(paragraph("3. Opportunity and Product Principles", "Heading1"));
blocks.push(paragraph("Opportunity statement: How might CashKaro enter an existing high-intent shopping journey at the right moment, while preserving context and requiring minimal additional effort?"));
blocks.push(paragraph("Preserve context: the user should not have to search again, rebuild a cart, or repeat decisions already made.", "Normal", { numId: 1 }));
blocks.push(paragraph("Make value concrete: the intervention should show the exact cashback and effective price, not a vague reminder.", "Normal", { numId: 1 }));
blocks.push(paragraph("Intervene only at high intent: broad browsing reminders risk becoming noise.", "Normal", { numId: 1 }));
blocks.push(paragraph("Stay platform-independent: ShopNow in the prototype is a stand-in, not a strategic dependency on one retailer.", "Normal", { numId: 1 }));
blocks.push(paragraph("Keep the MVP testable: every claim should connect to a measurable experiment.", "Normal", { numId: 1 }));

blocks.push(paragraph("4. Solution Space and Prioritization", "Heading1"));
blocks.push(paragraph("I considered four directions before choosing the MVP. The goal was not to choose the most complete long-term vision, but the smallest credible experiment that tests the behavioural hypothesis."));
blocks.push(table(
  [
    ["Option", "Strength", "Main risk", "MVP fit"],
    ["Contextual browser intervention", "Appears inside the existing retailer journey and can test timing, incentive, and context preservation.", "Requires reliable high-intent detection and careful UX to avoid feeling intrusive.", "High"],
    ["Mobile re-engagement", "Potentially broad reach through CashKaro's own app or notification channels.", "Intent timing may be weak and notifications can become generic noise.", "Medium"],
    ["Cashback / offer assistant", "Could make cashback useful earlier in decision-making.", "Requires more product, retailer, and offer matching complexity.", "Medium"],
    ["Retailer checkout integration", "Lowest user friction if implemented deeply.", "Depends on retailer partnerships and does not scale quickly across the ecosystem.", "Low initially"]
  ],
  [1900, 3200, 2600, 1660]
));
blocks.push(paragraph("Decision: prioritize a contextual, platform-independent intervention with an experimentable cashback incentive. This direction best balances user relevance, context preservation, retailer coverage, and measurable incrementality."));

blocks.push(paragraph("5. Chosen MVP", "Heading1"));
blocks.push(paragraph("The MVP simulates a user shopping on a fictional retailer, ShopNow. The user selects Wireless Noise Cancelling Headphones and moves to payment. At that high-intent moment, a CashKaro browser-side intervention appears without hiding the retailer context."));
blocks.push(paragraph("Core experience", "Heading2"));
blocks.push(paragraph("1. User shops normally on ShopNow and selects a product.", "Normal", { numId: 2 }));
blocks.push(paragraph("2. User reaches payment or another strong purchase-intent moment.", "Normal", { numId: 2 }));
blocks.push(paragraph("3. CashKaro shows a contextual offer: retail price, cashback amount, and effective price.", "Normal", { numId: 2 }));
blocks.push(paragraph("4. User activates cashback if the saving justifies the effort.", "Normal", { numId: 2 }));
blocks.push(paragraph("5. CashKaro preserves product context and returns the user to the retailer checkout path.", "Normal", { numId: 2 }));
blocks.push(paragraph("6. The user completes the retailer purchase through a trackable path.", "Normal", { numId: 2 }));
blocks.push(paragraph("Prototype behaviour", "Heading2"));
blocks.push(paragraph("The prototype includes a demo control for intent simulation and incentive testing. The primary flow, however, triggers the intervention when the user clicks Buy Now and reaches the payment page. This better represents a realistic high-intent moment than asking the reviewer to manually switch states."));
blocks.push(paragraph("The incentive selector tests cashback levels such as Rs. 50, Rs. 100, Rs. 150, Rs. 250, and Rs. 300. For multiple quantities, total cashback should multiply by item quantity so the order summary reflects the actual purchase value."));

blocks.push(paragraph("6. Experiment Design and Success Metrics", "Heading1"));
blocks.push(paragraph("The MVP should be evaluated through an A/B test against eligible users or sessions. The control group continues shopping normally. The treatment group receives the contextual intervention when a high-intent signal is detected. Treatment variants should test different incentive levels to find the minimum attractive cashback that changes behaviour."));
blocks.push(table(
  [
    ["Metric", "Why it matters"],
    ["Primary: incremental tracked transactions per eligible shopping session", "Measures whether CashKaro recovered purchases that would otherwise bypass tracking."],
    ["Activation rate", "Shows whether the intervention and incentive are compelling enough to earn action."],
    ["Activation to completed transaction rate", "Separates curiosity clicks from actual purchase recovery."],
    ["Dismissal and annoyance rate", "Protects user trust and prevents intervention fatigue."],
    ["Average cashback cost per incremental transaction", "Tests whether the incentive is economically sustainable."],
    ["Context-preserved completion rate", "Measures whether reducing restart friction improves purchase completion."]
  ],
  [3300, 6060]
));
blocks.push(paragraph("Key learning loop: Can CashKaro detect high intent, intervene at the right moment, offer enough value, preserve enough context, and create incremental tracked transactions with acceptable economics?"));

blocks.push(paragraph("7. Technical Feasibility and Constraints", "Heading1"));
blocks.push(paragraph("The prototype deliberately demonstrates UX and product logic, not a production implementation. Several areas remain validation work."));
blocks.push(paragraph("Intent detection: candidate signals may include cart entry, payment page entry, repeated product visits, long dwell time, return visits, or movement from product page to checkout. These should be treated as hypotheses, not proven intent.", "Normal", { numId: 1 }));
blocks.push(paragraph("Context extraction: retailer, product URL, product name, price, quantity, and offer eligibility may not be consistently available across all retailers or platforms.", "Normal", { numId: 1 }));
blocks.push(paragraph("Attribution: the MVP must verify that activation creates a valid trackable path rather than merely showing a saving message.", "Normal", { numId: 1 }));
blocks.push(paragraph("Privacy and trust: a browser-level experience must clearly explain value, minimize data use, and avoid repeated interruptions.", "Normal", { numId: 1 }));
blocks.push(paragraph("Platform variance: desktop web, mobile web, apps, and retailer integrations may require different implementation mechanisms while preserving the same product principle.", "Normal", { numId: 1 }));

blocks.push(paragraph("8. GTM and Rollout", "Heading1"));
blocks.push(paragraph("Start with a limited beta for existing CashKaro users who already have a high likelihood of transacting. The first launch should focus on a small set of eligible retailer/category combinations where product context and tracking are feasible."));
blocks.push(paragraph("Phase 1: validate the intervention with a narrow cohort and a few incentive variants.", "Normal", { numId: 2 }));
blocks.push(paragraph("Phase 2: improve context preservation and identify the strongest retailer/category segments.", "Normal", { numId: 2 }));
blocks.push(paragraph("Phase 3: expand coverage across more shopping surfaces only after incrementality and user-acceptance thresholds are met.", "Normal", { numId: 2 }));
blocks.push(paragraph("Positioning should be user-first: 'Save on what you are already buying' rather than 'Come back to CashKaro'. Internally, the launch should be framed as an incrementality experiment, not a guaranteed business outcome."));

blocks.push(paragraph("9. Risks and Decision Criteria", "Heading1"));
blocks.push(paragraph("The biggest risks are false-positive intent detection, weak incentive economics, context loss after activation, attribution gaps, and user fatigue. The MVP should continue only if it creates statistically and economically meaningful incremental tracked transactions without unacceptable disruption."));
blocks.push(paragraph("Continue if treatment sessions generate incremental tracked transactions, activation-to-purchase quality is strong, and cashback cost remains sustainable.", "Normal", { numId: 1 }));
blocks.push(paragraph("Iterate if the concept shows movement but fails on timing, incentive size, or context preservation.", "Normal", { numId: 1 }));
blocks.push(paragraph("Stop if users dismiss the intervention, abandon checkout, or require incentives that exceed the incremental value created.", "Normal", { numId: 1 }));
blocks.push(paragraph("Final takeaway: CashKaro should not try to rebuild the user's shopping journey. The stronger product move is to enter at the high-intent moment, make the saving concrete, preserve context, and learn whether that creates incremental tracked transactions.", "Normal", { bold: true }));

const body = blocks.join("\n");

const documentXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"><w:body>${body}<w:sectPr><w:pgSz w:w="12240" w:h="15840"/><w:pgMar w:top="1440" w:right="1440" w:bottom="1440" w:left="1440" w:header="708" w:footer="708" w:gutter="0"/></w:sectPr></w:body></w:document>`;

const stylesXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:styles xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
<w:style w:type="paragraph" w:default="1" w:styleId="Normal"><w:name w:val="Normal"/><w:qFormat/><w:pPr><w:spacing w:after="160" w:line="276" w:lineRule="auto"/></w:pPr><w:rPr><w:rFonts w:ascii="Arial" w:hAnsi="Arial" w:cs="Arial"/><w:sz w:val="22"/><w:color w:val="000000"/></w:rPr></w:style>
<w:style w:type="paragraph" w:styleId="DocTitle"><w:name w:val="Doc Title"/><w:basedOn w:val="Normal"/><w:qFormat/><w:pPr><w:spacing w:before="0" w:after="60"/></w:pPr><w:rPr><w:rFonts w:ascii="Arial" w:hAnsi="Arial" w:cs="Arial"/><w:sz w:val="52"/><w:color w:val="000000"/></w:rPr></w:style>
<w:style w:type="paragraph" w:styleId="Subtitle"><w:name w:val="Subtitle"/><w:basedOn w:val="Normal"/><w:qFormat/><w:pPr><w:spacing w:before="0" w:after="220" w:line="276" w:lineRule="auto"/></w:pPr><w:rPr><w:rFonts w:ascii="Arial" w:hAnsi="Arial" w:cs="Arial"/><w:sz w:val="22"/><w:color w:val="555555"/></w:rPr></w:style>
<w:style w:type="paragraph" w:styleId="Heading1"><w:name w:val="heading 1"/><w:basedOn w:val="Normal"/><w:next w:val="Normal"/><w:qFormat/><w:pPr><w:keepNext/><w:spacing w:before="400" w:after="120"/></w:pPr><w:rPr><w:rFonts w:ascii="Arial" w:hAnsi="Arial" w:cs="Arial"/><w:sz w:val="40"/><w:color w:val="000000"/></w:rPr></w:style>
<w:style w:type="paragraph" w:styleId="Heading2"><w:name w:val="heading 2"/><w:basedOn w:val="Normal"/><w:next w:val="Normal"/><w:qFormat/><w:pPr><w:keepNext/><w:spacing w:before="360" w:after="120"/></w:pPr><w:rPr><w:rFonts w:ascii="Arial" w:hAnsi="Arial" w:cs="Arial"/><w:sz w:val="32"/><w:color w:val="000000"/></w:rPr></w:style>
<w:style w:type="paragraph" w:styleId="TableText"><w:name w:val="Table Text"/><w:basedOn w:val="Normal"/><w:pPr><w:spacing w:after="60" w:line="276" w:lineRule="auto"/></w:pPr><w:rPr><w:rFonts w:ascii="Arial" w:hAnsi="Arial" w:cs="Arial"/><w:sz w:val="20"/><w:color w:val="000000"/></w:rPr></w:style>
</w:styles>`;

const numberingXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:numbering xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
<w:abstractNum w:abstractNumId="1"><w:multiLevelType w:val="singleLevel"/><w:lvl w:ilvl="0"><w:start w:val="1"/><w:numFmt w:val="bullet"/><w:lvlText w:val="●"/><w:lvlJc w:val="left"/><w:pPr><w:tabs><w:tab w:val="num" w:pos="720"/></w:tabs><w:ind w:left="720" w:hanging="360"/></w:pPr><w:rPr><w:rFonts w:ascii="Arial" w:hAnsi="Arial" w:hint="default"/></w:rPr></w:lvl></w:abstractNum>
<w:abstractNum w:abstractNumId="2"><w:multiLevelType w:val="singleLevel"/><w:lvl w:ilvl="0"><w:start w:val="1"/><w:numFmt w:val="decimal"/><w:lvlText w:val="%1."/><w:lvlJc w:val="left"/><w:pPr><w:tabs><w:tab w:val="num" w:pos="720"/></w:tabs><w:ind w:left="720" w:hanging="360"/></w:pPr><w:rPr><w:rFonts w:ascii="Arial" w:hAnsi="Arial" w:hint="default"/></w:rPr></w:lvl></w:abstractNum>
<w:num w:numId="1"><w:abstractNumId w:val="1"/></w:num>
<w:num w:numId="2"><w:abstractNumId w:val="2"/></w:num>
</w:numbering>`;

const contentTypes = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/><Override PartName="/word/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.styles+xml"/><Override PartName="/word/numbering.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.numbering+xml"/><Override PartName="/docProps/core.xml" ContentType="application/vnd.openxmlformats-package.core-properties+xml"/><Override PartName="/docProps/app.xml" ContentType="application/vnd.openxmlformats-officedocument.extended-properties+xml"/></Types>`;

const rels = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/></Relationships>`;

const docRels = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/><Relationship Id="rId2" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/numbering" Target="numbering.xml"/></Relationships>`;

const core = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<cp:coreProperties xmlns:cp="http://schemas.openxmlformats.org/package/2006/metadata/core-properties" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:dcterms="http://purl.org/dc/terms/" xmlns:dcmitype="http://purl.org/dc/dcmitype/" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"><dc:title>CashKaro Contextual Cashback MVP</dc:title><dc:creator>Codex</dc:creator><cp:lastModifiedBy>Codex</cp:lastModifiedBy></cp:coreProperties>`;

const app = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Properties xmlns="http://schemas.openxmlformats.org/officeDocument/2006/extended-properties" xmlns:vt="http://schemas.openxmlformats.org/officeDocument/2006/docPropsVTypes"><Application>Codex</Application></Properties>`;

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
