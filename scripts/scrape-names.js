import * as cheerio from 'cheerio';
import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

const LETTERS = [
    'A', 'Á', 'B', 'C', 'Cs', 'D', 'Dz', 'Dzs', 'E', 'É',
    'F', 'G', 'Gy', 'H', 'I', 'Í', 'J', 'K', 'L', 'Ly',
    'M', 'N', 'Ny', 'O', 'Ó', 'Ö', 'Ő', 'P', 'Q', 'R',
    'S', 'Sz', 'T', 'Ty', 'U', 'Ú', 'Ü', 'Ű', 'V', 'W',
    'X', 'Y', 'Z', 'Zs'
];

// Helper to delay requests
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function scrape() {
    console.log('Starting scrape...');
    const outputPath = path.resolve('src/assets/names-metadata.json');
    let metadata = {};

    if (fs.existsSync(outputPath)) {
        console.log('Loading existing metadata...');
        metadata = JSON.parse(fs.readFileSync(outputPath, 'utf-8'));
    }

    // Phase 1: Scrape magyarnevek.hu (skip if we have data, or maybe we want to refresh?)
    // For now, let's assume if we have > 4000 names, we skip phase 1 to save time
    if (Object.keys(metadata).length < 100) {
        for (const letter of LETTERS) {
        console.log(`Fetching letter: ${letter}`);
        try {
            const baseUrl = 'https://magyarnevek.hu/kereses/eredmenyek';
            const params = new URLSearchParams({
                searchField: '',
                lastname: '',
                'certificate[]': '1',
                description: '',
                contain_vowel: '',
                contain_consonant: '',
                ends_start: '',
                ends_end: '',
                syllable_min: '',
                syllable_max: '',
                date_from: '',
                date_to: '',
                advancedSearch: 'Keresés',
                letter: letter
            });
            const url = `${baseUrl}?${params.toString()}`;

            // Use curl with extensive headers to mimic a real browser
            const cmd = `curl -s -L \
            -H "User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36" \
            -H "Accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8" \
            -H "Accept-Language: hu-HU,hu;q=0.9,en-US;q=0.8,en;q=0.7" \
            -H "Cache-Control: max-age=0" \
            -H "Connection: keep-alive" \
            -H "Upgrade-Insecure-Requests: 1" \
            -H "Sec-Fetch-Dest: document" \
            -H "Sec-Fetch-Mode: navigate" \
            -H "Sec-Fetch-Site: none" \
            -H "Sec-Fetch-User: ?1" \
            "${url}"`;

            const html = execSync(cmd, { maxBuffer: 10 * 1024 * 1024 }).toString(); // Increase buffer for large responses

            console.log(`  HTML length: ${html.length}`);

            const $ = cheerio.load(html);
            const items = $('.names-item');
            console.log(`  Cheerio found ${items.length} items`);

            items.each((i, el) => {
                const name = $(el).attr('data-name');
                if (!name) return;

                // Extract description/meaning
                // Clone to avoid modifying the original during removals
                const descEl = $(el).find('.names-item-description').clone();

                // Remove the name days part from description to get just the text
                descEl.find('.names-item-namedays').remove();
                descEl.find('.names-item-stats').remove(); // Remove stats chart if present

                let meaning = descEl.text().trim();
                // Clean up excessive whitespace
                meaning = meaning.replace(/\s+/g, ' ');

                // Extract name days
                // Try to find links first, as they contain the dates
                const nameDaysContainer = $(el).find('.names-item-namedays');
                let nameDays = [];

                const links = nameDaysContainer.find('a');
                if (links.length > 0) {
                    links.each((j, nd) => {
                        nameDays.push($(nd).text().trim());
                    });
                } else {
                    // Fallback to text parsing if no links (or different structure)
                    // Remove "Ajánlott névnapok:" prefix if present
                    let text = nameDaysContainer.text().trim();
                    text = text.replace(/^Ajánlott névnapok:\s*/i, '');
                    if (text) {
                        nameDays.push(text);
                    }
                }

                if (name) {
                    metadata[name] = {
                        meaning,
                        nameDays: nameDays.join(', ')
                    };
                }
            });

            console.log(`  Found ${Object.keys(metadata).length} names so far.`);

            // Be nice to the server
            await delay(1000); // Increased delay slightly

            } catch (error) {
                console.error(`Error fetching letter ${letter}:`, error);
            }
        }
    }

    console.log(`Total names scraped: ${Object.keys(metadata).length}`);

    // Write to file
    fs.writeFileSync(outputPath, JSON.stringify(metadata, null, 2));
    console.log(`Saved to ${outputPath}`);
}

scrape();
