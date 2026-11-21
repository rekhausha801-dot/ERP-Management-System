const ts = require('./node_modules/typescript/lib/typescript.js');
const fs = require('fs');
const code = fs.readFileSync(__dirname + '/src/pages/billing/InvoiceTemplatesPage.tsx', 'utf8');
const sf = ts.createSourceFile('test.tsx', code, 99, true, 4);
for (const d of sf.parseDiagnostics) {
  const p = sf.getLineAndCharacterOfPosition(d.start);
  console.log('Line:', p.line + 1, 'Col:', p.character + 1, d.messageText);
}
console.log('Done check.');
