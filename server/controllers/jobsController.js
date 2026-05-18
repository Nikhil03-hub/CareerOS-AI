const jobsData = require('../data/jobsData');

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

function normalizeJoobleJob(job, index, page) {
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
    snippet: cleanText(job.snippet || job.description, 'Live opportunity fetched from Jooble. Review the original posting for full responsibilities and requirements.'),
    skills: Array.isArray(job.skills) && job.skills.length ? job.skills : inferSkills(job),
    badges: [type].filter(Boolean),
    updated: job.updated || job.date || null,
    source: 'Jooble'
  };
}

function formatLocalJob(job) {
  const salaryStr = `Rs. ${job.salary_min}-${job.salary_max} LPA`;
  const isRemote = job.location.toLowerCase() === 'remote';
  return {
    id: job.id,
    title: job.title,
    company: job.company,
    location: job.location,
    salary: salaryStr,
    jobType: isRemote ? 'Remote' : 'Full-time',
    type: isRemote ? 'Remote' : 'Full-time',
    applyLink: '#',
    url: '#',
    snippet: `${job.title} at ${job.company}. Required skills: ${job.required_skills.join(', ')}. Experience: ${job.required_experience}+ years.`,
    skills: job.required_skills,
    experience: job.required_experience,
    salary_min: job.salary_min,
    salary_max: job.salary_max,
    badges: isRemote ? ['Remote'] : (job.required_experience === 0 ? ['Fresher'] : []),
    source: 'CareerOS fallback'
  };
}

async function fetchJoobleJobs({ keywords = 'developer', location = 'India', page = 1 } = {}) {
  const body = {
    keywords: cleanText(keywords, 'developer') || 'developer',
    location: cleanText(location, 'India') || 'India',
    page: Number(page) || 1
  };

  const response = await fetch(JOOBLE_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });

  if (!response.ok) {
    throw new Error(`Jooble returned ${response.status}`);
  }

  const data = await response.json();
  const rawJobs = Array.isArray(data.jobs) ? data.jobs : [];
  const jobs = rawJobs.map((job, index) => normalizeJoobleJob(job, index, body.page));

  return {
    jobs,
    totalCount: Number(data.totalCount || data.total || jobs.length),
    page: body.page,
    query: body.keywords,
    location: body.location
  };
}

function filterLocalFallback({ keywords = '', location = '' } = {}) {
  const q = cleanText(keywords).toLowerCase();
  const loc = cleanText(location).toLowerCase();

  let results = jobsData;

  if (q) {
    results = results.filter((job) =>
      job.title.toLowerCase().includes(q) ||
      job.company.toLowerCase().includes(q) ||
      job.required_skills.some((skill) => skill.toLowerCase().includes(q))
    );
  }

  if (loc && loc !== 'india') {
    results = results.filter((job) => job.location.toLowerCase().includes(loc));
  }

  return results.map(formatLocalJob);
}

const getTrendingJobs = async (req, res) => {
  const { role, keywords, query, location, page } = req.query;
  const searchTerm = role || keywords || query || 'developer';

  try {
    const result = await fetchJoobleJobs({ keywords: searchTerm, location: location || 'India', page });
    return res.json({
      success: true,
      source: 'jooble',
      fromCache: false,
      count: result.jobs.length,
      totalCount: result.totalCount,
      jobs: result.jobs
    });
  } catch (err) {
    console.warn('Jooble jobs fallback:', err.message);
    const jobs = filterLocalFallback({ keywords: searchTerm, location });
    return res.json({
      success: true,
      source: 'fallback',
      warning: 'Live Jooble jobs unavailable, showing CareerOS fallback jobs.',
      count: jobs.length,
      jobs
    });
  }
};

const searchJobs = async (req, res) => {
  const { keywords, query, location, page } = req.body || {};
  const searchTerm = keywords || query || 'developer';

  try {
    const result = await fetchJoobleJobs({ keywords: searchTerm, location: location || 'India', page });
    return res.json({
      success: true,
      source: 'jooble',
      fromCache: false,
      totalCount: result.totalCount,
      jobs: result.jobs
    });
  } catch (err) {
    console.warn('Jooble search fallback:', err.message);
    const jobs = filterLocalFallback({ keywords: searchTerm, location });
    return res.json({
      success: true,
      source: 'fallback',
      warning: 'Live Jooble search unavailable, showing CareerOS fallback jobs.',
      jobs
    });
  }
};

module.exports = { getTrendingJobs, searchJobs };
