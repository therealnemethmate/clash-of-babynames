import fs from 'fs';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const metadata = require('./src/assets/names-metadata.json');

let missingCount = 0;
const missingNames = [];

for (const [name, data] of Object.entries(metadata)) {
    if (!data.meaning || !data.nameDays) {
        missingCount++;
        missingNames.push(name);
    }
}

console.log(`Total names: ${Object.keys(metadata).length}`);
console.log(`Missing data: ${missingCount}`);
console.log(`First 10 missing: ${missingNames.slice(0, 10).join(', ')}`);
