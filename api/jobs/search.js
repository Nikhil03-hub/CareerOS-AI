const { fetchJoobleJobs } = require('../_jooble');

module.exports = async function handler(req, res) {
  if (req.method !== 'POST' && req.method !== 'GET') {
    res.setHeader('Allow', 'GET, POST');
    return res.status(405).json({ success: false, error: 'Method not allowed', jobs: [] });
  }

  try {
    const params = req.method === 'POST'
      ? (typeof req.body === 'string' ? JSON.parse(req.body || '{}') : (req.body || {}))
      : (req.query || {});
    const result = await fetchJoobleJobs({
      keywords: params.keywords || params.query || params.role || 'developer',
      location: params.location || 'India',
      page: params.page || 1
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
