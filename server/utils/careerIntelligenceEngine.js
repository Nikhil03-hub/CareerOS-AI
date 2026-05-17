const fs = require("fs");
const path = require("path");

const CAREER_MODEL_PATH = path.join(__dirname, "..", "ml", "career-intelligence-model.json");

function loadTrainedModel() {
    if (process.env.CAREER_INTELLIGENCE_DISABLE_MODEL === "1") return null;

    try {
        return JSON.parse(fs.readFileSync(CAREER_MODEL_PATH, "utf8"));
    } catch {
        return null;
    }
}

const TRAINED_MODEL = loadTrainedModel();

const ROLE_LIBRARY = {
    "Full Stack Developer": {
        titles: ["full stack developer", "mern developer", "software engineer", "product engineer"],
        skills: ["javascript", "typescript", "react", "node", "express", "mongodb", "postgresql", "rest api", "authentication", "git", "deployment", "system design", "testing"],
        adjacent: ["next.js", "tailwind", "redis", "docker", "ci/cd", "aws", "graphql", "performance"]
    },
    "Frontend Developer": {
        titles: ["frontend developer", "react developer", "ui engineer", "web developer"],
        skills: ["html", "css", "javascript", "typescript", "react", "tailwind", "accessibility", "responsive", "rest api", "testing", "performance"],
        adjacent: ["next.js", "framer motion", "gsap", "design systems", "redux", "vite"]
    },
    "Backend Developer": {
        titles: ["backend developer", "node developer", "api engineer", "server engineer"],
        skills: ["node", "express", "mongodb", "postgresql", "redis", "authentication", "jwt", "rest api", "system design", "docker", "testing"],
        adjacent: ["queues", "rabbitmq", "microservices", "observability", "rate limiting", "security"]
    },
    "AI/ML Engineer": {
        titles: ["ai engineer", "ml engineer", "machine learning engineer", "nlp engineer"],
        skills: ["python", "machine learning", "deep learning", "nlp", "pandas", "numpy", "scikit-learn", "tensorflow", "pytorch", "embeddings", "vector search", "statistics"],
        adjacent: ["mlops", "fastapi", "langchain", "rag", "model evaluation", "feature engineering"]
    },
    "Data Analyst": {
        titles: ["data analyst", "business analyst", "analytics engineer", "bi analyst"],
        skills: ["sql", "excel", "python", "pandas", "power bi", "tableau", "statistics", "dashboard", "data cleaning", "storytelling"],
        adjacent: ["forecasting", "ab testing", "etl", "dbt", "metabase", "looker"]
    },
    "Cloud/DevOps Engineer": {
        titles: ["devops engineer", "cloud engineer", "platform engineer", "sre"],
        skills: ["linux", "docker", "kubernetes", "aws", "ci/cd", "terraform", "monitoring", "networking", "security", "git"],
        adjacent: ["prometheus", "grafana", "nginx", "helm", "ansible", "incident response"]
    }
};

const ACTION_VERBS = ["built", "designed", "developed", "deployed", "optimized", "improved", "automated", "integrated", "reduced", "increased", "launched", "implemented"];
const IMPACT_WORDS = ["%", "users", "latency", "performance", "revenue", "conversion", "accuracy", "scale", "production", "metrics", "reduced", "increased"];
const COMMUNICATION_WORDS = ["collaborated", "presented", "documented", "mentored", "communicated", "led", "stakeholders", "team", "feedback"];
const MODEL_FEATURE_NAMES = [
    "bias",
    "urlScore",
    "headlineScore",
    "summaryScore",
    "atsScore",
    "keywordScore",
    "technicalScore",
    "communicationScore",
    "impactScore",
    "projectScore",
    "portfolioScore",
    "discoverabilityScore",
    "roleMatchScore",
    "matchedCoreRatio",
    "matchedAdjacentRatio",
    "suggestedPenalty",
    "contentRichness",
    "hasProfileContent",
    "qualityPrior"
];

function normalize(value = "") {
    return String(value).toLowerCase().replace(/[^a-z0-9+#.% ]+/g, " ").replace(/\s+/g, " ").trim();
}

function tokens(value = "") {
    return normalize(value).split(" ").filter((token) => token.length > 1);
}

function unique(items) {
    return [...new Set(items.filter(Boolean))];
}

function clamp(value, min = 0, max = 100) {
    return Math.max(min, Math.min(max, Math.round(value)));
}

function vectorize(text, dimensions = 96) {
    const vector = new Array(dimensions).fill(0);
    const words = tokens(text);
    const grams = [];
    for (let i = 0; i < words.length; i += 1) {
        grams.push(words[i]);
        if (words[i + 1]) grams.push(`${words[i]} ${words[i + 1]}`);
    }
    grams.forEach((gram, index) => {
        let hash = 2166136261;
        for (let i = 0; i < gram.length; i += 1) {
            hash ^= gram.charCodeAt(i);
            hash += (hash << 1) + (hash << 4) + (hash << 7) + (hash << 8) + (hash << 24);
        }
        const slot = Math.abs(hash) % dimensions;
        vector[slot] += 1 + Math.log2(index + 2);
    });
    const magnitude = Math.sqrt(vector.reduce((sum, value) => sum + value * value, 0)) || 1;
    return vector.map((value) => value / magnitude);
}

function cosine(a, b) {
    return a.reduce((sum, value, index) => sum + value * b[index], 0);
}

function roleModel(targetRole = "Full Stack Developer") {
    return ROLE_LIBRARY[targetRole] || ROLE_LIBRARY["Full Stack Developer"];
}

function countHits(text, dictionary) {
    const source = normalize(text);
    return dictionary.filter((item) => source.includes(normalize(item)));
}

function section(score, title, insight, fixes = []) {
    return {
        title,
        score: clamp(score),
        status: score >= 85 ? "Excellent" : score >= 70 ? "Strong" : score >= 50 ? "Needs Review" : "Critical Gap",
        insight,
        fixes
    };
}

function modelFeatureMap({
    checks,
    matchedCore,
    matchedAdjacent,
    suggested,
    model,
    resume,
    headline,
    summary,
    experience,
    education,
    github,
    portfolio,
    certifications,
    hasProfileContent
}) {
    const content = [resume, headline, summary, experience, education, github, portfolio, certifications].join(" ");
    const values = {
        bias: 1,
        urlScore: (checks.linkedinUrl?.score || 0) / 100,
        headlineScore: (checks.linkedinHeadline?.score || 0) / 100,
        summaryScore: (checks.linkedinSummary?.score || 0) / 100,
        atsScore: (checks.ats?.score || 0) / 100,
        keywordScore: (checks.keywordOptimization?.score || 0) / 100,
        technicalScore: (checks.technicalSkill?.score || 0) / 100,
        communicationScore: (checks.communication?.score || 0) / 100,
        impactScore: (checks.resumeImpact?.score || 0) / 100,
        projectScore: (checks.projectQuality?.score || 0) / 100,
        portfolioScore: (checks.portfolio?.score || 0) / 100,
        discoverabilityScore: (checks.recruiterDiscoverability?.score || 0) / 100,
        roleMatchScore: (checks.roleMatch?.score || 0) / 100,
        matchedCoreRatio: matchedCore.length / model.skills.length,
        matchedAdjacentRatio: matchedAdjacent.length / Math.max(1, model.adjacent.length),
        suggestedPenalty: suggested.length / (model.skills.length + model.adjacent.length),
        contentRichness: Math.min(1, normalize(content).length / 2400),
        hasProfileContent: hasProfileContent ? 1 : 0,
        qualityPrior: Math.min(1, (
            (checks.keywordOptimization?.score || 0) +
            (checks.projectQuality?.score || 0) +
            (checks.linkedinHeadline?.score || 0) +
            (checks.linkedinSummary?.score || 0)
        ) / 400)
    };

    return MODEL_FEATURE_NAMES.reduce((features, name) => {
        features[name] = values[name] || 0;
        return features;
    }, {});
}

function predictWithTrainedModel(targetName, fallbackScore, features) {
    const target = TRAINED_MODEL?.targets?.[targetName];
    const featureNames = TRAINED_MODEL?.featureNames || MODEL_FEATURE_NAMES;

    if (!target?.weights?.length) {
        return clamp(fallbackScore);
    }

    const rawPrediction = target.weights.reduce((sum, weight, index) => {
        const featureName = featureNames[index];
        return sum + weight * (features[featureName] || 0);
    }, 0) * 100;

    return clamp(rawPrediction * 0.82 + fallbackScore * 0.18);
}

function linkedinUrlSignals(url = "") {
    const value = String(url || "").trim();
    if (!value) {
        return {
            url: "",
            isLinkedIn: false,
            handle: "",
            handleWords: [],
            score: 0,
            insight: "No LinkedIn URL provided."
        };
    }

    let parsed = null;
    try {
        parsed = new URL(value.startsWith("http") ? value : `https://${value}`);
    } catch {
        return {
            url: value,
            isLinkedIn: false,
            handle: "",
            handleWords: [],
            score: 8,
            insight: "This does not look like a valid LinkedIn profile URL."
        };
    }

    const hostname = parsed.hostname.replace(/^www\./, "").toLowerCase();
    const pathParts = parsed.pathname.split("/").filter(Boolean);
    const isLinkedIn = hostname === "linkedin.com" || hostname.endsWith(".linkedin.com");
    const hasProfilePath = pathParts[0] === "in" && Boolean(pathParts[1]);
    const handle = hasProfilePath ? decodeURIComponent(pathParts[1]).toLowerCase() : "";
    const handleWords = handle.split(/[-_.0-9]+/).filter((item) => item.length > 1);
    const numberLoad = (handle.match(/\d/g) || []).length;
    const customReadable = handleWords.length >= 2 && numberLoad <= 4;
    const compactReadable = handle.length >= 6 && handle.length <= 45;
    const score = clamp(
        (isLinkedIn ? 35 : 0) +
        (hasProfilePath ? 28 : 0) +
        (customReadable ? 22 : 8) +
        (compactReadable ? 10 : 4) +
        (parsed.protocol === "https:" ? 5 : 0)
    );

    return {
        url: parsed.href,
        isLinkedIn,
        handle,
        handleWords,
        score,
        insight: isLinkedIn && hasProfilePath
            ? customReadable
                ? "LinkedIn URL is valid, profile-specific and readable for recruiters."
                : "LinkedIn URL is valid, but the public handle can be made cleaner and more memorable."
            : "Use a direct LinkedIn /in/ profile URL for better recruiter sharing."
    };
}

function analyzeCareerProfile(input = {}) {
    const role = input.targetRole || "Full Stack Developer";
    const model = roleModel(role);
    const linkedin = linkedinUrlSignals(input.linkedinUrl);
    const resume = input.resumeText || "";
    const headline = input.linkedinHeadline || "";
    const summary = input.linkedinSummary || "";
    const experience = input.experienceText || "";
    const education = input.educationText || "";
    const github = input.githubText || "";
    const portfolio = input.portfolioText || "";
    const certifications = input.certifications || "";
    const combined = [resume, headline, summary, experience, education, github, portfolio, certifications, linkedin.handleWords.join(" ")].join(" ");

    const matchedCore = countHits(combined, model.skills);
    const matchedAdjacent = countHits(combined, model.adjacent);
    const missingCore = model.skills.filter((skill) => !matchedCore.includes(skill));
    const suggested = unique([...missingCore.slice(0, 8), ...model.adjacent.filter((skill) => !matchedAdjacent.includes(skill)).slice(0, 6)]);

    const roleCorpus = [...model.titles, ...model.skills, ...model.adjacent].join(" ");
    const semanticScore = clamp(cosine(vectorize(combined), vectorize(roleCorpus)) * 135);
    const headlineScore = clamp(
        (headline.length >= 60 && headline.length <= 180 ? 30 : 14)
        + countHits(headline, model.skills).length * 10
        + countHits(headline, model.titles).length * 12
    );
    const summaryScore = clamp(
        Math.min(30, summary.length / 18)
        + countHits(summary, model.skills).length * 5
        + countHits(summary, ACTION_VERBS).length * 4
        + countHits(summary, COMMUNICATION_WORDS).length * 3
        + (summary.includes("http") || summary.toLowerCase().includes("portfolio") ? 8 : 0)
    );
    const technicalScore = clamp((matchedCore.length / model.skills.length) * 72 + matchedAdjacent.length * 4 + semanticScore * 0.18);
    const impactScore = clamp(countHits(combined, ACTION_VERBS).length * 7 + countHits(combined, IMPACT_WORDS).length * 8 + (/\d+%|\d+\+|\d+k/i.test(combined) ? 18 : 0));
    const projectScore = clamp(countHits(`${resume} ${github} ${portfolio}`, ["project", "github", "deployed", "api", "dashboard", "authentication", "database", "production"]).length * 9 + semanticScore * 0.28);
    const communicationScore = clamp(countHits(combined, COMMUNICATION_WORDS).length * 10 + Math.min(30, summary.length / 35) + (summary.split(".").length > 3 ? 12 : 0));
    const portfolioScore = clamp((portfolio.length ? 24 : 0) + countHits(portfolio, ["live", "github", "case study", "metrics", "demo", "tech stack"]).length * 12 + countHits(github, ["commit", "repository", "pull request", "stars", "readme"]).length * 8);
    const atsScore = clamp((matchedCore.length / model.skills.length) * 46 + impactScore * 0.24 + projectScore * 0.18 + (resume.length > 900 ? 10 : 4));
    const discoverabilityScore = clamp(headlineScore * 0.24 + summaryScore * 0.2 + technicalScore * 0.28 + portfolioScore * 0.12 + semanticScore * 0.16);
    const roleMatchScore = clamp(semanticScore * 0.42 + technicalScore * 0.42 + projectScore * 0.16);
    const profileStrength = clamp(headlineScore * 0.12 + summaryScore * 0.14 + technicalScore * 0.18 + atsScore * 0.18 + impactScore * 0.12 + portfolioScore * 0.12 + roleMatchScore * 0.14);
    const hasProfileContent = [resume, headline, summary, experience, education, github, portfolio, certifications]
        .some((value) => normalize(value).length > 20);

    const checks = {
        ats: section(atsScore, "ATS Optimization", "Measures resume parse strength, role keywords, action verbs and measurable impact.", [
            "Add missing target-role skills naturally inside project bullets.",
            "Use numbers for outcomes: users, latency, accuracy, performance or scale."
        ]),
        profileStrength: section(profileStrength, "Profile Strength", "Combines resume, LinkedIn, portfolio, GitHub and role-fit signals into one recruiter-style profile score.", [
            "Make every profile surface point to the same target role.",
            "Connect projects to business or user impact."
        ]),
        keywordOptimization: section(clamp((matchedCore.length / model.skills.length) * 80 + matchedAdjacent.length * 3), "Keyword Optimization", "Benchmarks your profile against semantic keywords used by strong profiles in the target role.", [
            `Add: ${suggested.slice(0, 5).join(", ") || "advanced project keywords"}.`
        ]),
        technicalSkill: section(technicalScore, "Technical Skill Analysis", "Uses semantic role matching and skill coverage to understand your strongest technical direction.", [
            "Turn listed skills into proof by attaching them to projects."
        ]),
        communication: section(communicationScore, "Communication Score", "Checks whether your summary and experience explain context, ownership, collaboration and outcomes.", [
            "Use concise first-person language with project context, action and result."
        ]),
        resumeImpact: section(impactScore, "Resume Impact", "Scores action verbs, quantified outcomes and recruiter-readable project value.", [
            "Rewrite weak bullets with action + technical decision + measurable result."
        ]),
        projectQuality: section(projectScore, "Project Quality", "Looks for deployed work, GitHub proof, APIs, dashboards, auth, data and production signals.", [
            "Add live links, README architecture, screenshots and measurable project outcomes."
        ]),
        portfolio: section(portfolioScore, "Portfolio Effectiveness", "Measures whether your portfolio communicates live proof, case studies, stack and results.", [
            "Create one polished case study for your strongest project."
        ]),
        linkedinHeadline: section(headlineScore, "LinkedIn Headline", "Checks role clarity, hard skills, search terms and headline density.", [
            "Lead with target role, then proof skills, then specialization."
        ]),
        linkedinSummary: section(summaryScore, "LinkedIn Summary", "Checks length, skill density, active language, call to action and credibility signals.", [
            "Add 2-3 project wins and end with the role or internship you are seeking."
        ]),
        linkedinUrl: section(linkedin.score, "LinkedIn URL", linkedin.insight, [
            linkedin.score >= 80 ? "Keep this URL consistent across resume, portfolio and GitHub." : "Change your LinkedIn public profile URL to a clean name-based /in/ handle."
        ]),
        recruiterDiscoverability: section(discoverabilityScore, "Recruiter Discoverability", "Predicts how well your profile can be found and trusted by recruiters.", [
            "Repeat important skills across headline, summary, projects and skills sections."
        ]),
        roleMatch: section(roleMatchScore, "Job-role Matching Accuracy", "Uses hashed semantic vectors to compare your whole profile against the target role corpus.", [
            "Choose one target role per profile version and optimize around that role."
        ])
    };

    const trainedFeatures = modelFeatureMap({
        checks,
        matchedCore,
        matchedAdjacent,
        suggested,
        model,
        resume,
        headline,
        summary,
        experience,
        education,
        github,
        portfolio,
        certifications,
        hasProfileContent
    });

    const trainedTargetMap = {
        ats: "ats",
        profileStrength: "profileStrength",
        keywordOptimization: "keywordOptimization",
        technicalSkill: "technicalSkill",
        communication: "communication",
        resumeImpact: "resumeImpact",
        projectQuality: "projectQuality",
        portfolio: "portfolio",
        recruiterDiscoverability: "recruiterDiscoverability",
        roleMatch: "roleMatch"
    };

    Object.entries(trainedTargetMap).forEach(([scoreKey, targetName]) => {
        checks[scoreKey] = {
            ...checks[scoreKey],
            score: predictWithTrainedModel(targetName, checks[scoreKey].score, trainedFeatures),
            model: TRAINED_MODEL ? "trained-calibrated" : "semantic-fallback"
        };
    });

    const weightedOverall = clamp(
        checks.profileStrength.score * 0.18 +
        checks.ats.score * 0.16 +
        checks.keywordOptimization.score * 0.14 +
        checks.technicalSkill.score * 0.14 +
        checks.recruiterDiscoverability.score * 0.14 +
        checks.roleMatch.score * 0.1 +
        checks.linkedinUrl.score * 0.04 +
        checks.communication.score * 0.1
    );
    const overallScore = hasProfileContent
        ? predictWithTrainedModel("overall", weightedOverall, trainedFeatures)
        : checks.linkedinUrl.score;

    const smartHeadline = `${role} | ${matchedCore.slice(0, 4).join(" | ") || model.skills.slice(0, 4).join(" | ")} | Building production-ready AI and web products`;
    const smartSummary = `I am a ${role} focused on building practical, production-ready software across ${unique([...matchedCore, ...model.skills]).slice(0, 6).join(", ")}. My work combines hands-on projects, clean engineering, and measurable product thinking. I enjoy turning ideas into deployed systems, improving user experience, and learning deeply through real builds. I am currently looking for opportunities where I can contribute to ${role.toLowerCase()} work, strengthen product engineering skills, and solve meaningful real-world problems.`;

    return {
        success: true,
        engine: TRAINED_MODEL ? "CareerOS Career Intelligence Trained Semantic Engine v2" : "CareerOS Career Intelligence Semantic Engine v1",
        methodology: TRAINED_MODEL
            ? ["NLP tokenization", "hashed semantic embeddings", "role vector similarity", "skill ontology matching", "supervised score calibration", "adaptive recommendation ranking"]
            : ["NLP tokenization", "hashed semantic embeddings", "role vector similarity", "skill ontology matching", "impact scoring", "adaptive recommendation ranking"],
        modelInfo: TRAINED_MODEL ? {
            type: TRAINED_MODEL.modelType,
            version: TRAINED_MODEL.version,
            trainedAt: TRAINED_MODEL.trainedAt,
            trainingRows: TRAINED_MODEL.trainingRows,
            averageMae: Number((Object.values(TRAINED_MODEL.targets || {}).reduce((sum, target) => sum + (target.mae || 0), 0) / Math.max(1, Object.keys(TRAINED_MODEL.targets || {}).length)).toFixed(3))
        } : {
            type: "semantic-fallback"
        },
        targetRole: role,
        linkedinUrl: linkedin,
        overallScore,
        scores: checks,
        keywords: {
            matchedCore,
            matchedAdjacent,
            suggested,
            searchTitles: model.titles
        },
        strengths: [
            matchedCore.length ? `Strongest matched skills: ${matchedCore.slice(0, 5).join(", ")}.` : "Profile has a base structure but needs stronger target-role skill proof.",
            checks.projectQuality.score >= 70 ? "Projects show credible technical proof." : "Projects need clearer architecture, live links and measurable outcomes.",
            checks.linkedinHeadline.score >= 80 ? "Headline is recruiter-readable." : "Headline needs stronger role and keyword positioning."
        ],
        quickFixes: [
            checks.linkedinUrl.fixes[0],
            checks.linkedinSummary.fixes[0],
            checks.resumeImpact.fixes[0],
            checks.keywordOptimization.fixes[0],
            checks.projectQuality.fixes[0],
            "Add LinkedIn, GitHub, portfolio link and one clear call-to-action across all career surfaces."
        ],
        generated: {
            headline: smartHeadline,
            summary: smartSummary,
            resumeBullets: [
                `Built a ${role.toLowerCase()} project using ${unique([...matchedCore, ...model.skills]).slice(0, 4).join(", ")} to solve a real user workflow with a deployed dashboard.`,
                `Improved product readiness by integrating authentication, data handling, analytics and recruiter-style profile scoring into one workflow.`,
                `Designed reusable UI components and API-driven modules to keep the platform scalable, responsive and production-friendly.`
            ],
            projectEnhancements: [
                "Add architecture diagram, API contract, demo screenshots and setup steps to every major GitHub repository.",
                "Add one metrics section: performance, users tested, accuracy, latency, conversion or time saved.",
                "Connect every project to the target role: problem, stack, implementation, result."
            ]
        },
        roadmap: [
            { phase: "Week 1", title: "Profile foundation", tasks: ["Rewrite headline", "Rewrite summary", "Add missing keywords", "Add custom LinkedIn URL"] },
            { phase: "Week 2", title: "Resume proof", tasks: ["Rewrite top 3 bullets", "Add metrics", "Add target role skills", "Run ATS re-score"] },
            { phase: "Week 3", title: "Portfolio authority", tasks: ["Publish one case study", "Improve GitHub READMEs", "Add live demos", "Add project architecture"] },
            { phase: "Week 4", title: "Placement execution", tasks: ["Apply to semantic job matches", "Practice interview stories", "Network with templates", "Track progress weekly"] }
        ],
        recruiterSimulation: hasProfileContent ? {
            verdict: overallScore >= 82 ? "Strong shortlist candidate" : overallScore >= 65 ? "Potential candidate with fixable gaps" : "Needs profile optimization before aggressive applications",
            likelyConcern: missingCore.length ? `Missing visible proof for ${missingCore.slice(0, 3).join(", ")}.` : "Needs stronger measurable outcomes and project storytelling.",
            interviewFocus: [`Explain your strongest ${role} project.`, "Describe one technical tradeoff you made.", "Show how your skills connect to business/user impact."]
        } : {
            verdict: "LinkedIn URL quality checked",
            likelyConcern: "Only the public LinkedIn URL was provided, so full profile strength needs headline, summary, experience, skills and project content.",
            interviewFocus: ["Paste your exported LinkedIn profile or summary text for full recruiter simulation.", "Add resume, GitHub and portfolio details for role-match scoring.", "Use a clean /in/ LinkedIn handle across resume and portfolio."]
        },
        heatmap: [
            { label: "Resume", value: checks.ats.score },
            { label: "LinkedIn", value: clamp((checks.linkedinHeadline.score + checks.linkedinSummary.score) / 2) },
            { label: "URL", value: linkedin.score },
            { label: "GitHub", value: checks.projectQuality.score },
            { label: "Portfolio", value: checks.portfolio.score },
            { label: "Role Fit", value: checks.roleMatch.score },
            { label: "Discovery", value: checks.recruiterDiscoverability.score }
        ]
    };
}

module.exports = {
    analyzeCareerProfile,
    ROLE_LIBRARY
};
