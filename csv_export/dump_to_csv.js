const fs = require('fs');
const path = require('path');

const dumpFile = path.join(__dirname, 'backuppg'); // твій дамп
const outputDir = path.join(__dirname, 'csv');

if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir);

const content = fs.readFileSync(dumpFile, 'utf-8').split(/\r?\n/);

let currentTable = null;
let headers = [];
let rows = [];
let inCopy = false;

content.forEach(line => {
    line = line.trim();

    // Знаходимо COPY блок
    const copyMatch = line.match(/^COPY (\S+) \((.+)\) FROM stdin;/);
    if (copyMatch) {
        currentTable = copyMatch[1].replace(/"/g, '');
        headers = copyMatch[2].split(',').map(h => h.trim().replace(/"/g, ''));
        rows = [];
        inCopy = true;
        return;
    }

    // Кінець COPY блоку
    if (line === '\\.') {
        if (currentTable) {
            const csvFile = path.join(outputDir, `${currentTable}.csv`);
            const csvContent = [headers.join(',')];

            rows.forEach(r => {
                const row = r.split('\t').map(v => v === '\\N' ? '' : v);
                csvContent.push(row.join(','));
            });

            fs.writeFileSync(csvFile, csvContent.join('\n'), 'utf-8');
            console.log(`Created ${csvFile} (${rows.length} rows)`);
        }
        currentTable = null;
        headers = [];
        rows = [];
        inCopy = false;
        return;
    }

    // Збираємо дані всередині COPY
    if (inCopy && line.length > 0) {
        rows.push(line);
    }
});

console.log('All COPY tables exported to CSV!');

