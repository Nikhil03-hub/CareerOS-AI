const express = require('express');
const optionalAuth = require('../middleware/optionalAuth');
const { analyzeCareerProfile, ROLE_LIBRARY } = require('../utils/careerIntelligenceEngine');

const router = express.Router();

router.get('/roles', (req, res) => {
    res.json({
        success: true,
        roles: Object.keys(ROLE_LIBRARY)
    });
});

router.post('/analyze', optionalAuth, (req, res) => {
    try {
        const result = analyzeCareerProfile(req.body || {});
        res.json({
            ...result,
            userId: req.user?.id || null,
            analyzedAt: new Date().toISOString()
        });
    } catch (error) {
        console.error('Career intelligence analysis failed:', error);
        res.status(500).json({
            success: false,
            error: 'Career intelligence analysis failed'
        });
    }
});

router.post('/linkedin-url', optionalAuth, (req, res) => {
    try {
        const result = analyzeCareerProfile({
            ...(req.body || {}),
            resumeText: req.body?.resumeText || '',
            githubText: req.body?.githubText || '',
            portfolioText: req.body?.portfolioText || ''
        });
        res.json({
            ...result,
            type: 'linkedin-url-review',
            analyzedAt: new Date().toISOString()
        });
    } catch (error) {
        console.error('LinkedIn URL review failed:', error);
        res.status(500).json({
            success: false,
            error: 'LinkedIn URL review failed'
        });
    }
});

router.get('/sample', (req, res) => {
    res.json(analyzeCareerProfile({
        targetRole: 'Full Stack Developer',
        linkedinUrl: 'https://www.linkedin.com/in/s-manjunath-reddy-51784638a',
        linkedinHeadline: 'B.Tech CSM Student at KMIT | Full Stack Developer | Exploring AI & ML | Python | Java | MERN Stack',
        linkedinSummary: 'Computer Science and Machine Learning student exploring AI, ML and web development through practical projects.',
        resumeText: 'Built CareerOS AI using React, Node.js, MongoDB, REST APIs, authentication, dashboard analytics and resume analyzer modules.',
        githubText: 'GitHub repositories include dashboard, authentication, API integrations, resume analyzer and job matching projects.',
        portfolioText: 'Portfolio with live demos, project screenshots, technology stack and GitHub links.',
        educationText: 'B.Tech Computer Science and Machine Learning, KMIT',
        certifications: 'Java, Python, MERN Stack'
    }));
});

module.exports = router;
