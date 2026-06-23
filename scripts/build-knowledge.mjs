import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const SRC_PAGES = join(ROOT, 'src', 'pages');
const OUTPUT = join(ROOT, 'backend', 'knowledge-base.json');

function readHTML(filename) {
  try { return readFileSync(filename, 'utf-8'); }
  catch (e) { console.warn('Warning: Could not read', filename); return ''; }
}

function decodeEntities(text) {
  return text
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&#x27;/g, "'")
    .replace(/&#x2F;/g, '/')
    .replace(/&nbsp;/g, ' ');
}

function stripHTML(html) {
  return decodeEntities(html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim());
}

function extractTitle(html) {
  const m = html.match(/<title[^>]*>([\s\S]*?)<\/title[^>]*>/i);
  return m ? stripHTML(m[1]) : '';
}

function extractMetaDescription(html) {
  const m = html.match(/name="description"\s*content="([^"]*)"/i);
  return m ? m[1].trim() : '';
}

function extractHeadings(html) {
  const headings = [];
  const regex = /<h([1-6])[^>]*>([\s\S]*?)<\/h\1[^>]*>/gi;
  let match;
  while ((match = regex.exec(html)) !== null) {
    headings.push({ level: parseInt(match[1]), text: stripHTML(match[2]) });
  }
  return headings;
}

function extractParagraphs(html) {
  const paras = [];
  const regex = /<p[^>]*>([\s\S]*?)<\/p[^>]*>/gi;
  let match;
  while ((match = regex.exec(html)) !== null) {
    const text = stripHTML(match[1]);
    if (text.length > 10) paras.push(text);
  }
  return paras;
}

function extractListItems(html) {
  const items = [];
  const regex = /<li[^>]*>([\s\S]*?)<\/li[^>]*>/gi;
  let match;
  while ((match = regex.exec(html)) !== null) {
    items.push(stripHTML(match[1]));
  }
  return items;
}

function extractButtons(html) {
  const buttons = [];
  const btnRegex = /<button[^>]*>([\s\S]*?)<\/button[^>]*>/gi;
  let match;
  while ((match = btnRegex.exec(html)) !== null) {
    const text = stripHTML(match[1]);
    if (text.length > 0) buttons.push(text);
  }
  const inputRegex = /<input[^>]*type="(?:submit|button)"[^>]*value="([^"]*)"/gi;
  while ((match = inputRegex.exec(html)) !== null) {
    buttons.push(match[1].trim());
  }
  return [...new Set(buttons)];
}

function extractFormLabels(html) {
  const labels = [];
  const regex = /<label[^>]*>([\s\S]*?)<\/label[^>]*>/gi;
  let match;
  while ((match = regex.exec(html)) !== null) {
    labels.push(stripHTML(match[1]));
  }
  return labels;
}

function extractFAQ(html) {
  const faqs = [];
  const faqSection = html.match(/id="faq"[^>]*>([\s\S]*?)<\/section[^>]*>/i);
  if (!faqSection) return faqs;

  const content = faqSection[1];
  const aRegex = /<div[^>]*class="faq-body[^"]*"[^>]*>([\s\S]*?)<\/div[^>]*>/gi;
  const answers = [];
  let am;
  while ((am = aRegex.exec(content)) !== null) {
    answers.push(stripHTML(am[1]));
  }

  const qRegex = /<button[^>]*>[\s\S]*?<span[^>]*>([\s\S]*?)<\/span[^>]*>/gi;
  const questions = [];
  let qm;
  while ((qm = qRegex.exec(content)) !== null) {
    const q = stripHTML(qm[1]);
    if (q.includes('?') && q.length > 5) {
      questions.push(q);
    }
  }

  const count = Math.min(questions.length, answers.length);
  for (let i = 0; i < count; i++) {
    faqs.push({ question: questions[i], answer: answers[i] });
  }
  return faqs;
}

function extractServices(html) {
  const services = [];
  const sections = html.split(/id="services"[^>]*>/i);
  if (sections.length < 2) return services;
  const content = sections[1].split(/<\/section[^>]*>/i)[0];

  const blocks = content.match(/<h3[^>]*>([\s\S]*?)<\/h3[^>]*>\s*<p[^>]*>([\s\S]*?)<\/p[^>]*>/gi);
  if (!blocks) return services;

  for (const block of blocks) {
    const nameMatch = block.match(/<h3[^>]*>([\s\S]*?)<\/h3[^>]*>/i);
    const descMatch = block.match(/<p[^>]*>([\s\S]*?)<\/p[^>]*>/i);
    const priceMatch = block.match(/From NPR[^<0-9]*([0-9,]+)/i);
    if (nameMatch) {
      services.push({
        name: stripHTML(nameMatch[1]),
        description: descMatch ? stripHTML(descMatch[1]) : '',
        price: priceMatch ? 'From NPR ' + priceMatch[1] : ''
      });
    }
  }
  return services;
}

function extractReviews(html) {
  const reviews = [];
  const sections = html.split(/id="reviews"[^>]*>/i);
  if (sections.length < 2) return reviews;
  const content = sections[1].split(/<\/section[^>]*>/i)[0];

  const cards = content.split(/(?=<div[^>]*class="lift )/gi);
  for (const card of cards) {
    const paras = card.match(/<p[^>]*>([\s\S]*?)<\/p[^>]*>/gi);
    if (paras && paras.length >= 2) {
      const text = stripHTML(paras[0]).replace(/^["\u201C\u201D]+|["\u201C\u201D]+$/g, '').trim();
      const reviewer = stripHTML(paras[1]);
      if (text && reviewer && reviewer.length < 30) {
        reviews.push({ text: text.substring(0, 300), reviewer, route: '' });
      }
    }
  }
  return reviews;
}

function extractPageSections(html, pageId) {
  const sections = [];
  const headingRegex = /<h([1-6])[^>]*>([\s\S]*?)<\/h\1[^>]*>/gi;
  const headingMatches = [];
  let m;
  while ((m = headingRegex.exec(html)) !== null) {
    headingMatches.push({ level: parseInt(m[1]), text: stripHTML(m[2]), index: m.index });
  }

  if (headingMatches.length === 0) return sections;

  for (let i = 0; i < headingMatches.length; i++) {
    const h = headingMatches[i];
    const start = h.index;
    const end = i + 1 < headingMatches.length ? headingMatches[i + 1].index : html.length;
    const content = html.substring(start, end);
    const text = stripHTML(content);
    const bodyEnd = text.indexOf(h.text) + h.text.length;
    const body = text.substring(bodyEnd).trim();

    if (body.length > 5) {
      sections.push({
        heading: h.text,
        level: h.level,
        content: body.substring(0, 500)
      });
    }
  }
  return sections;
}

function extractInputFields(html) {
  const fields = [];
  const inputRegex = /<input[^>]*type="([^"]*)"[^>]*id="([^"]*)"[^>]*placeholder="([^"]*)"[^>]*>/gi;
  let match;
  while ((match = inputRegex.exec(html)) !== null) {
    fields.push({ type: match[1], id: match[2], placeholder: match[3] });
  }
  const selectRegex = /<select[^>]*id="([^"]*)"[^>]*>([\s\S]*?)<\/select[^>]*>/gi;
  while ((match = selectRegex.exec(html)) !== null) {
    const options = [];
    const optRegex = /<option[^>]*>([\s\S]*?)<\/option[^>]*>/gi;
    let om;
    while ((om = optRegex.exec(match[2])) !== null) {
      const val = stripHTML(om[1]);
      if (val && val.length > 0 && !/select/i.test(val)) options.push(val);
    }
    fields.push({ type: 'select', id: match[1], options });
  }
  return fields;
}

function buildKnowledgeBase() {
  const files = [
    { path: join(ROOT, 'index.html'), id: 'index', label: 'Homepage' },
    { path: join(SRC_PAGES, 'user.html'), id: 'user', label: 'Booking Form' },
    { path: join(SRC_PAGES, 'admin.html'), id: 'admin', label: 'Admin Panel' },
    { path: join(SRC_PAGES, 'vendor.html'), id: 'vendor', label: 'Vendor Portal' },
    { path: join(SRC_PAGES, 'login.html'), id: 'login', label: 'Login' },
    { path: join(SRC_PAGES, 'signup.html'), id: 'signup', label: 'Sign Up' },
    { path: join(SRC_PAGES, 'my-bookings.html'), id: 'my-bookings', label: 'My Bookings' }
  ];

  const pages = [];
  let allFaq = [];
  let allServices = [];
  let allReviews = [];

  for (const file of files) {
    const html = readHTML(file.path);
    if (!html) continue;

    const title = extractTitle(html);
    const description = extractMetaDescription(html);
    const sections = extractPageSections(html, file.id);
    const headings = extractHeadings(html);
    const paras = extractParagraphs(html);
    const listItems = extractListItems(html);
    const buttons = extractButtons(html);
    const formLabels = extractFormLabels(html);
    const inputFields = extractInputFields(html);

    pages.push({
      id: file.id,
      title: title || file.label,
      description: description || '',
      sections: sections.slice(0, 30),
      headings: headings.slice(0, 30),
      paragraphs: paras.slice(0, 40),
      listItems: listItems.slice(0, 30),
      buttons: buttons.slice(0, 20),
      formLabels: formLabels.slice(0, 20),
      inputFields: inputFields.slice(0, 20)
    });

    if (file.id === 'index') {
      allFaq = extractFAQ(html);
      allServices = extractServices(html);
      allReviews = extractReviews(html);
    }
  }

  const howItWorks = [
    { step: 1, title: 'Fill the Form', description: 'Province, district, items, vehicle type, and preferred date - our 5-step form takes under 3 minutes.' },
    { step: 2, title: 'Get Matched', description: 'We match you with a verified, rated mover available in your district within 2 hours of your request.' },
    { step: 3, title: 'Confirm & Pay', description: 'Review your NPR quote over Viber or phone. Pay a token amount via eSewa, Khalti, or cash to secure your slot.' },
    { step: 4, title: 'Move Day!', description: 'The crew arrives on time even for early auspicious timings. Relax and enjoy your new home.' }
  ];

  const vehicleTypes = [
    { name: 'Cargo Tempo', price: 'NPR 400-500', bestFor: '1-2 rooms, narrow lanes, valley intra-city moves' },
    { name: 'Tata Ace (Small Truck)', price: 'NPR 800-1200', bestFor: '2 BHK, semi-urban routes' },
    { name: 'Mini Truck (407)', price: 'NPR 1500-2000', bestFor: '3 BHK, inter-city moves, full household' },
    { name: 'Large Truck + Helper Team', price: 'NPR 2000+', bestFor: 'Large house, province-to-province, villa moves' },
    { name: 'Let MeroGhar Recommend', price: 'Varies', bestFor: 'Coordinator suggests best vehicle based on items' }
  ];

  const addonServices = [
    { name: 'Packing Service', description: 'Bubble wrap, rope, and boxes provided' },
    { name: 'Furniture Disassembly', description: 'Taken apart and reassembled at new home' },
    { name: 'Porter / Labor Help', description: 'Extra manual labor for stairs or narrow access' },
    { name: 'Item Insurance', description: 'Full-value coverage on all moved items' }
  ];

  const paymentMethods = [
    { name: 'eSewa', type: 'Digital Wallet' },
    { name: 'Khalti', type: 'Digital Wallet' },
    { name: 'IME Pay', type: 'Digital Wallet' },
    { name: 'ConnectIPS', type: 'Bank to Bank' },
    { name: 'Bank Transfer', type: 'NEFT / RTGS' },
    { name: 'Cash on Move Day', type: 'Pay in Person' }
  ];

  const contactInfo = {
    phone: '+977 980-000-000',
    viber: '+977 980-000-000',
    email: 'info@meroghar.com.np'
  };

  const stats = {
    movesCompleted: '8,000+',
    districtsCovered: 77,
    averageRating: 4.8,
    quoteTime: '2 hours',
    verifiedProviders: '250+',
    onTimeRate: '97%',
    verifiedReviews: '6,000+',
    wouldRecommend: '97%'
  };

  const siteOverview = {
    name: 'MeroGhar Logistics',
    tagline: "Nepal's Trusted Household Moving Service",
    description: 'Household moving and delivery service based in Nepal. Covers all 7 provinces with verified movers. Book via the app for distance-based quotes with eSewa, Khalti, and Cash payments.',
    founded: 2021,
    features: [
      'Verified Movers Only',
      'All 7 Provinces of Nepal',
      'Viber & Phone Support',
      'Auspicious Timing Respected',
      'eSewa, Khalti, IME Pay accepted'
    ]
  };

  return {
    version: '1.0.0',
    generated: new Date().toISOString(),
    site: siteOverview,
    stats,
    pages,
    services: allServices,
    faq: allFaq,
    reviews: allReviews,
    howItWorks,
    vehicleTypes,
    addonServices,
    paymentMethods,
    contactInfo
  };
}

const kb = buildKnowledgeBase();
const outDir = dirname(OUTPUT);
if (!existsSync(outDir)) mkdirSync(outDir, { recursive: true });
writeFileSync(OUTPUT, JSON.stringify(kb, null, 2), 'utf-8');
console.log('Knowledge base written to', OUTPUT);
console.log('Pages:', kb.pages.length);
for (const p of kb.pages) {
  console.log('  ' + p.id + ':', p.title, '-', p.sections.length, 'sections,', p.paragraphs.length, 'paras,', p.headings.length, 'headings');
}
console.log('Services:', kb.services.length);
console.log('FAQ items:', kb.faq.length);
console.log('Reviews:', kb.reviews.length);
