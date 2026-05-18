const { fetchJoobleJobs } = require('../_jooble');

module.exports = async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ success: false, error: 'Method not allowed', jobs: [] });
  }

  try {
    const { role, keywords, query, location, page } = req.query || {};
    const result = await fetchJoobleJobs({
      keywords: role || keywords || query || 'developer',
      location: location || 'India',
      page: page || 1
    });

    return res.status(200).json(result);
  } catch (err) {
    return res.status(502).json({
      success: false,
      source: 'jooble',
      error: err.message || 'Unable to fetch live jobs',
      jobs: []
    });
  }
};
