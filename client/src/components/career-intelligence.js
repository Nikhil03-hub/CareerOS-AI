(function () {
    const ROLES = {
        "Full Stack Developer": ["JavaScript", "React", "Node.js", "Express", "MongoDB", "REST API", "Authentication", "Git", "Deployment", "System Design"],
        "Frontend Developer": ["HTML", "CSS", "JavaScript", "React", "TypeScript", "Tailwind", "Accessibility", "Responsive Design", "Testing"],
        "Backend Developer": ["Node.js", "Express", "MongoDB", "PostgreSQL", "Redis", "JWT", "REST API", "System Design", "Docker"],
        "AI/ML Engineer": ["Python", "Machine Learning", "NLP", "Embeddings", "Vector Search", "Pandas", "NumPy", "Model Evaluation"],
        "Data Analyst": ["SQL", "Excel", "Python", "Pandas", "Power BI", "Statistics", "Dashboarding", "Storytelling"],
        "Cloud/DevOps Engineer": ["Linux", "Docker", "Kubernetes", "AWS", "CI/CD", "Terraform", "Monitoring", "Security"]
    };

    const ACTIONS = ["built", "developed", "deployed", "optimized", "improved", "automated", "integrated", "launched"];
    const IMPACT = ["%", "users", "performance", "latency", "accuracy", "scale", "reduced", "increased"];

    function $(selector) {
        return document.querySelector(selector);
    }

    function normalize(value = "") {
        return String(value).toLowerCase().replace(/[^a-z0-9+#.% ]+/g, " ");
    }

    function hits(text, words) {
        const source = normalize(text);
        return words.filter((word) => source.includes(normalize(word)));
    }

    function clamp(value) {
        return Math.max(0, Math.min(100, Math.round(value)));
    }

    function linkedinUrlSignals(url = "") {
        const value = String(url || "").trim();
        if (!value) return { score: 0, handle: "", words: [], insight: "No LinkedIn URL provided." };
        try {
            const parsed = new URL(value.startsWith("http") ? value : `https://${value}`);
            const host = parsed.hostname.replace(/^www\./, "").toLowerCase();
            const parts = parsed.pathname.split("/").filter(Boolean);
            const isLinkedIn = host === "linkedin.com" || host.endsWith(".linkedin.com");
            const isProfile = parts[0] === "in" && Boolean(parts[1]);
            const handle = isProfile ? decodeURIComponent(parts[1]).toLowerCase() : "";
            const words = handle.split(/[-_.0-9]+/).filter((item) => item.length > 1);
            const numberLoad = (handle.match(/\d/g) || []).length;
            const readable = words.length >= 2 && numberLoad <= 4;
            const score = clamp((isLinkedIn ? 35 : 0) + (isProfile ? 28 : 0) + (readable ? 22 : 8) + (handle.length >= 6 && handle.length <= 45 ? 10 : 4) + (parsed.protocol === "https:" ? 5 : 0));
            return {
                score,
                handle,
                words,
                insight: isLinkedIn && isProfile
                    ? readable
                        ? "LinkedIn URL is valid, profile-specific and readable for recruiters."
                        : "LinkedIn URL is valid, but the handle can be cleaner and more memorable."
                    : "Use a direct LinkedIn /in/ public profile URL."
            };
        } catch {
            return { score: 8, handle: "", words: [], insight: "This does not look like a valid LinkedIn URL." };
        }
    }

    function fallbackAnalyze(payload) {
        const skills = ROLES[payload.targetRole] || ROLES["Full Stack Developer"];
        const linkedinUrl = linkedinUrlSignals(payload.linkedinUrl);
        const combined = [
            payload.resumeText,
            payload.linkedinHeadline,
            payload.linkedinSummary,
            payload.experienceText,
            payload.educationText,
            payload.githubText,
            payload.portfolioText,
            payload.certifications,
            linkedinUrl.words.join(" ")
        ].join(" ");
        const matched = hits(combined, skills);
        const missing = skills.filter((skill) => !matched.includes(skill));
        const actionHits = hits(combined, ACTIONS);
        const impactHits = hits(combined, IMPACT);
        const headlineScore = clamp((payload.linkedinHeadline.length > 50 ? 34 : 16) + hits(payload.linkedinHeadline, skills).length * 11);
        const summaryScore = clamp(Math.min(36, payload.linkedinSummary.length / 16) + hits(payload.linkedinSummary, skills).length * 6 + actionHits.length * 3);
        const technicalScore = clamp(matched.length / skills.length * 100);
        const impactScore = clamp(actionHits.length * 8 + impactHits.length * 10 + (/\d+%|\d+\+|\d+k/i.test(combined) ? 18 : 0));
        const projectScore = clamp(hits(combined, ["project", "github", "api", "dashboard", "authentication", "database", "deployed"]).length * 11);
        const atsScore = clamp(technicalScore * 0.52 + impactScore * 0.25 + projectScore * 0.23);
        const discoverability = clamp(headlineScore * 0.3 + summaryScore * 0.25 + technicalScore * 0.3 + projectScore * 0.15);
        const roleMatch = clamp(technicalScore * 0.72 + projectScore * 0.28);
        const hasProfileContent = [
            payload.resumeText,
            payload.linkedinHeadline,
            payload.linkedinSummary,
            payload.experienceText,
            payload.educationText,
            payload.githubText,
            payload.portfolioText,
            payload.certifications
        ].some((value) => normalize(value).length > 20);
        const overallScore = hasProfileContent
            ? clamp(atsScore * 0.2 + headlineScore * 0.11 + summaryScore * 0.12 + technicalScore * 0.18 + discoverability * 0.17 + roleMatch * 0.14 + linkedinUrl.score * 0.08)
            : linkedinUrl.score;

        const section = (score, title, insight) => ({ score, title, insight, status: score >= 85 ? "Excellent" : score >= 70 ? "Strong" : score >= 50 ? "Needs Review" : "Critical Gap" });
        return {
            success: true,
            engine: "CareerOS Career Intelligence Local Semantic Engine",
            targetRole: payload.targetRole,
            overallScore,
            scores: {
                ats: section(atsScore, "ATS Optimization", "Resume keyword, structure, action verb and impact strength."),
                profileStrength: section(overallScore, "Profile Strength", "Combined LinkedIn, resume, portfolio and GitHub readiness."),
                keywordOptimization: section(technicalScore, "Keyword Optimization", "Target-role skill coverage across your public career surfaces."),
                technicalSkill: section(technicalScore, "Technical Skill Analysis", "Visible technical proof for your selected role."),
                communication: section(summaryScore, "Communication Score", "Clarity, active voice, summary depth and recruiter readability."),
                resumeImpact: section(impactScore, "Resume Impact", "Action verbs, metrics and result-driven proof."),
                projectQuality: section(projectScore, "Project Quality", "GitHub, deployed work, APIs, dashboards and production signals."),
                portfolio: section(clamp(projectScore + (payload.portfolioText.length ? 18 : 0)), "Portfolio Effectiveness", "Live demo, case study and project presentation strength."),
                linkedinHeadline: section(headlineScore, "LinkedIn Headline", "Searchable role title and hard-skill density."),
                linkedinSummary: section(summaryScore, "LinkedIn Summary", "About section depth, keywords and call-to-action readiness."),
                linkedinUrl: section(linkedinUrl.score, "LinkedIn URL", linkedinUrl.insight),
                recruiterDiscoverability: section(discoverability, "Recruiter Discoverability", "How easily recruiters can find and trust your profile."),
                roleMatch: section(roleMatch, "Job-role Matching Accuracy", "Semantic alignment with your chosen target role.")
            },
            linkedinUrl,
            keywords: {
                matchedCore: matched,
                suggested: missing.slice(0, 9),
                searchTitles: [payload.targetRole, `${payload.targetRole} Intern`, "Software Engineer"]
            },
            strengths: [
                matched.length ? `Visible matched skills: ${matched.slice(0, 5).join(", ")}.` : "Your profile needs stronger target-role skill proof.",
                projectScore >= 65 ? "Projects show useful technical direction." : "Projects need clearer live links, architecture and measurable outcomes.",
                headlineScore >= 75 ? "Headline is searchable." : "Headline needs sharper target-role positioning."
            ],
            quickFixes: [
                linkedinUrl.score >= 80 ? "Keep this LinkedIn URL on your resume, GitHub and portfolio." : "Change your LinkedIn public profile URL to a clean name-based /in/ handle.",
                "Rewrite the LinkedIn summary with 2 project wins, target role and call to action.",
                `Add missing keywords: ${missing.slice(0, 5).join(", ") || "advanced role keywords"}.`,
                "Rewrite resume bullets with action, technical decision and measurable result.",
                "Add GitHub README architecture, screenshots, live demo and setup steps."
            ],
            generated: {
                headline: `${payload.targetRole} | ${matched.slice(0, 4).join(" | ") || skills.slice(0, 4).join(" | ")} | Building production-ready AI products`,
                summary: `I am a ${payload.targetRole} focused on building practical software with ${[...matched, ...skills].slice(0, 6).join(", ")}. I enjoy converting ideas into deployed products, improving user experience, and solving real problems through clean engineering. I am currently looking for opportunities where I can contribute, learn from strong teams, and build production-ready systems.`,
                resumeBullets: [
                    `Built a ${payload.targetRole.toLowerCase()} project using ${[...matched, ...skills].slice(0, 4).join(", ")} with dashboard, data flow and deployment-ready structure.`,
                    "Improved product readiness by integrating authentication, analytics, reusable UI and API-driven workflows.",
                    "Created recruiter-style career intelligence modules to convert resume and profile signals into actionable insights."
                ],
                projectEnhancements: ["Add architecture diagrams", "Add live demo links", "Add measurable outcomes", "Improve README proof"]
            },
            roadmap: [
                { phase: "Week 1", title: "Profile foundation", tasks: ["Rewrite headline", "Rewrite summary", "Add missing keywords"] },
                { phase: "Week 2", title: "Resume proof", tasks: ["Rewrite bullets", "Add metrics", "Re-score ATS"] },
                { phase: "Week 3", title: "Portfolio authority", tasks: ["Publish case study", "Improve GitHub README", "Add live demo"] },
                { phase: "Week 4", title: "Placement execution", tasks: ["Apply to matched jobs", "Practice interviews", "Track progress"] }
            ],
            recruiterSimulation: {
                verdict: overallScore >= 80 ? "Strong shortlist candidate" : overallScore >= 62 ? "Potential candidate with fixable gaps" : "Needs profile optimization before aggressive applications",
                likelyConcern: missing.length ? `Missing visible proof for ${missing.slice(0, 3).join(", ")}.` : "Needs stronger measurable outcomes.",
                interviewFocus: [`Explain your strongest ${payload.targetRole} project.`, "Describe one technical tradeoff.", "Show measurable impact."]
            },
            heatmap: [
                { label: "Resume", value: atsScore },
                { label: "LinkedIn", value: clamp((headlineScore + summaryScore) / 2) },
                { label: "URL", value: linkedinUrl.score },
                { label: "GitHub", value: projectScore },
                { label: "Portfolio", value: clamp(projectScore + (payload.portfolioText.length ? 18 : 0)) },
                { label: "Role Fit", value: roleMatch },
                { label: "Discovery", value: discoverability }
            ]
        };
    }

    function samplePayload() {
        return {
            targetRole: "Full Stack Developer",
            linkedinUrl: "https://www.linkedin.com/in/s-manjunath-reddy-51784638a",
            linkedinHeadline: "B.Tech CSM Student at KMIT | Full Stack Developer | Exploring AI & ML | Python | Java | MERN Stack",
            linkedinSummary: "Computer Science and Machine Learning student exploring AI, ML and web development through practical projects. I enjoy building useful products, learning by doing and collaborating with peers.",
            resumeText: "Built CareerOS AI using React, Node.js, MongoDB, REST APIs, authentication, dashboard analytics, resume analyzer and job matching modules. Developed and deployed reusable UI workflows.",
            experienceText: "Developed resume analyzer, job matching, dashboard and authentication modules for hackathon-ready career intelligence product.",
            educationText: "B.Tech Computer Science and Machine Learning, KMIT",
            githubText: "GitHub repositories include dashboard, API integrations, resume analyzer, job matching and AI career guidance projects with README files.",
            portfolioText: "Portfolio includes live demos, project screenshots, technology stack, GitHub links and case studies.",
            certifications: "Python, Java, MERN Stack, AI/ML"
        };
    }

    function payloadFromForm() {
        return {
            targetRole: $("#careerTargetRole")?.value || "Full Stack Developer",
            linkedinUrl: $("#careerLinkedinUrl")?.value || "",
            linkedinHeadline: $("#careerLinkedinHeadline")?.value || "",
            linkedinSummary: $("#careerLinkedinSummary")?.value || "",
            resumeText: $("#careerResumeText")?.value || "",
            experienceText: $("#careerExperienceText")?.value || "",
            educationText: $("#careerEducationText")?.value || "",
            githubText: $("#careerGithubText")?.value || "",
            portfolioText: $("#careerPortfolioText")?.value || "",
            certifications: $("#careerCertifications")?.value || ""
        };
    }

    function setPayload(payload) {
        if ($("#careerTargetRole")) $("#careerTargetRole").value = payload.targetRole;
        if ($("#careerLinkedinUrl")) $("#careerLinkedinUrl").value = payload.linkedinUrl || "";
        if ($("#careerLinkedinHeadline")) $("#careerLinkedinHeadline").value = payload.linkedinHeadline;
        if ($("#careerLinkedinSummary")) $("#careerLinkedinSummary").value = payload.linkedinSummary;
        if ($("#careerResumeText")) $("#careerResumeText").value = payload.resumeText;
        if ($("#careerExperienceText")) $("#careerExperienceText").value = payload.experienceText;
        if ($("#careerEducationText")) $("#careerEducationText").value = payload.educationText;
        if ($("#careerGithubText")) $("#careerGithubText").value = payload.githubText;
        if ($("#careerPortfolioText")) $("#careerPortfolioText").value = payload.portfolioText;
        if ($("#careerCertifications")) $("#careerCertifications").value = payload.certifications;
    }

    function renderBar(item) {
        return `<div class="career-ai-bar"><header><span>${item.title}</span><span>${item.score}/100</span></header><div><b style="width:${item.score}%"></b></div></div>`;
    }

    function renderResults(result) {
        const scores = result.scores || {};
        const keyScores = [
            scores.ats,
            scores.profileStrength,
            scores.keywordOptimization,
            scores.technicalSkill,
            scores.linkedinUrl,
            scores.recruiterDiscoverability,
            scores.roleMatch
        ].filter(Boolean);
        const modelLabel = result.modelInfo?.type === "ridge-linear-regression"
            ? `Trained ${result.modelInfo.trainingRows || 0}`
            : "Semantic";
        const isLinkedinUrlReview = result.type === "linkedin-url-review";
        const linkedinHandle = result.linkedinUrl?.handle ? `/${result.linkedinUrl.handle}` : "Not found";

        $("#careerOverallScore").textContent = result.overallScore || 0;
        $("#careerVerdict").textContent = result.recruiterSimulation?.verdict || "Analysis ready";
        $("#careerMetrics").innerHTML = isLinkedinUrlReview ? `
            <article class="career-ai-metric"><span>URL Quality</span><strong>${scores.linkedinUrl?.score || result.linkedinUrl?.score || 0}</strong></article>
            <article class="career-ai-metric"><span>Public Handle</span><strong>${linkedinHandle}</strong></article>
            <article class="career-ai-metric"><span>Discoverability</span><strong>${scores.recruiterDiscoverability?.score || 0}</strong></article>
            <article class="career-ai-metric"><span>AI Model</span><strong>${modelLabel}</strong></article>
        ` : `
            <article class="career-ai-metric"><span>ATS Score</span><strong>${scores.ats?.score || 0}</strong></article>
            <article class="career-ai-metric"><span>LinkedIn URL</span><strong>${scores.linkedinUrl?.score || result.linkedinUrl?.score || 0}</strong></article>
            <article class="career-ai-metric"><span>Discoverability</span><strong>${scores.recruiterDiscoverability?.score || 0}</strong></article>
            <article class="career-ai-metric"><span>AI Model</span><strong>${modelLabel}</strong></article>
        `;
        $("#careerBreakdowns").innerHTML = keyScores.map(renderBar).join("");
        $("#careerKeywords").innerHTML = (result.keywords?.suggested || []).map((keyword) => `<span>${keyword}</span>`).join("") || "<span>No major keyword gaps</span>";
        $("#careerStrengths").innerHTML = (result.strengths || []).map((item) => `<li>${item}</li>`).join("");
        $("#careerFixes").innerHTML = (result.quickFixes || []).map((item) => `<li>${item}</li>`).join("");
        $("#careerRoadmap").innerHTML = (result.roadmap || []).map((item) => `<article><h4>${item.phase}: ${item.title}</h4><p>${(item.tasks || []).join(" &middot; ")}</p></article>`).join("");
        $("#careerGenerated").innerHTML = `
            <h3 class="text-lg font-bold text-slate-900 mb-3">AI-generated enhancements</h3>
            <div class="career-ai-field"><label>Optimized LinkedIn headline</label><textarea readonly>${result.generated?.headline || ""}</textarea></div>
            <div class="career-ai-field"><label>Optimized LinkedIn summary</label><textarea readonly>${result.generated?.summary || ""}</textarea></div>
            <div class="career-ai-field"><label>Resume bullets</label><textarea readonly>${(result.generated?.resumeBullets || []).join("\\n")}</textarea></div>
        `;
        localStorage.setItem("careerIntelligenceLastResult", JSON.stringify(result));
    }

    async function runAnalysis() {
        const payload = payloadFromForm();
        const loader = $("#careerIntelligenceLoading");
        loader?.classList.add("active");
        try {
            const token = localStorage.getItem("jc_token") || localStorage.getItem("jwt") || localStorage.getItem("authToken") || localStorage.getItem("token");
            const response = await fetch("http://localhost:5000/api/career-intelligence/analyze", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    ...(token ? { Authorization: `Bearer ${token}` } : {})
                },
                body: JSON.stringify(payload)
            });
            if (!response.ok) throw new Error("API unavailable");
            renderResults(await response.json());
        } catch (error) {
            renderResults(fallbackAnalyze(payload));
        } finally {
            setTimeout(() => loader?.classList.remove("active"), 450);
        }
    }

    async function runLinkedinUrlAnalysis() {
        const payload = payloadFromForm();
        if (!payload.linkedinUrl.trim()) {
            $("#careerLinkedinUrl")?.focus();
            return;
        }
        const loader = $("#careerIntelligenceLoading");
        loader?.classList.add("active");
        try {
            const token = localStorage.getItem("jc_token") || localStorage.getItem("jwt") || localStorage.getItem("authToken") || localStorage.getItem("token");
            const response = await fetch("http://localhost:5000/api/career-intelligence/linkedin-url", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    ...(token ? { Authorization: `Bearer ${token}` } : {})
                },
                body: JSON.stringify(payload)
            });
            if (!response.ok) throw new Error("API unavailable");
            const partial = await response.json();
            renderResults({
                ...fallbackAnalyze(payload),
                ...partial,
                scores: {
                    ...fallbackAnalyze(payload).scores,
                    ...(partial.scores || {})
                }
            });
        } catch {
            renderResults(fallbackAnalyze(payload));
        } finally {
            setTimeout(() => loader?.classList.remove("active"), 450);
        }
    }

    function initCareerIntelligence() {
        const section = $("#section-career-intelligence");
        if (!section || section.dataset.ready === "true") return;
        section.dataset.ready = "true";

        setPayload(samplePayload());
        const stored = localStorage.getItem("careerIntelligenceLastResult");
        if (stored) {
            try {
                renderResults(JSON.parse(stored));
            } catch {
                renderResults(fallbackAnalyze(samplePayload()));
            }
        } else {
            renderResults(fallbackAnalyze(samplePayload()));
        }

        $("#runCareerIntelligence")?.addEventListener("click", runAnalysis);
        $("#analyzeLinkedinUrl")?.addEventListener("click", runLinkedinUrlAnalysis);
        $("#loadCareerSample")?.addEventListener("click", () => {
            setPayload(samplePayload());
            renderResults(fallbackAnalyze(samplePayload()));
        });
    }

    document.addEventListener("DOMContentLoaded", initCareerIntelligence);
    window.initCareerIntelligence = initCareerIntelligence;
})();
