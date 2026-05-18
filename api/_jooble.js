const JOOBLE_API_KEY = process.env.JOOBLE_API_KEY || 'a29e9e09-4b4d-4c9d-ad14-48809c6c339f';
const JOOBLE_URL = `https://jooble.org/api/${JOOBLE_API_KEY}`;

const SKILL_KEYWORDS = [
  'javascript', 'typescript', 'react', 'node', 'express', 'python', 'java',
  'spring', 'sql', 'mongodb', 'aws', 'azure', 'docker', 'kubernetes',
  'machine learning', 'data analysis', 'figma', 'ui', 'ux', 'html', 'css'
];

function cleanText(value, fallback = '') {
  return String(value || fallback)
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function inferSkills(job) {
  const text = `${job.title || ''} ${job.snippet || ''} ${job.description || ''}`.toLowerCase();
  const matches = SKILL_KEYWORDS.filter((skill) => text.includes(skill));
  return matches.length ? matches.slice(0, 6) : ['Communication', 'Problem Solving'];
}

function normalizeJob(job, index, page) {
  const location = cleanText(job.location, 'Remote / India');
  const type = cleanText(job.type || job.jobType, location.toLowerCase().includes('remote') ? 'Remote' : 'Full-time');
  const link = job.link || job.url || job.applyLink || '#';

  return {
    id: job.id || `jooble-${page}-${index}-${Buffer.from(`${job.title || ''}-${job.company || ''}`).toString('base64').slice(0, 10)}`,
    title: cleanText(job.title, 'Career Opportunity'),
    company: cleanText(job.company, 'Hiring Company'),
    location,
    salary: cleanText(job.salary, 'Salary not disclosed'),
    jobType: type,
    type,
    applyLink: link,
    url: link,
    snippet: cleanText(job.snippet || job.description, 'Live opportunity fetched from Jooble. Review the original posting for full details.'),
    skills: Array.isArray(job.skills) && job.skills.length ? job.skills : inferSkills(job),
    badges: [type].filter(Boolean),
    updated: job.updated || job.date || null,
    source: 'Jooble'
  };
}

async function fetchJoobleJobs({ keywords = 'developer', location = 'India', page = 1 } = {}) {
  const requestBody = {
    keywords: cleanText(keywords, 'developer') || 'developer',
    location: cleanText(location, 'India') || 'India',
    page: Number(page) || 1
  };

  const response = await fetch(JOOBLE_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(requestBody)
  });

  if (!response.ok) {
    throw new Error(`Jooble returned ${response.status}`);
  }

  const data = await response.json();
  const rawJobs = Array.isArray(data.jobs) ? data.jobs : [];

  return {
    success: true,
    source: 'jooble',
    fromCache: false,
    totalCount: Number(data.totalCount || data.total || rawJobs.length),
    count: rawJobs.length,
    jobs: rawJobs.map((job, index) => normalizeJob(job, index, requestBody.page))
  };
}

module.exports = { fetchJoobleJobs };
