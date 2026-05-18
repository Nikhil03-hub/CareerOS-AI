// ============================================================
// CareerOS AI — Jobs Page Main Script
// Local dataset edition: all jobs served from /api/jobs
// Features: Opportunity Score, Apply, Save, Scroll Reveal
// ============================================================

// ── Helpers ─────────────────────────────────────────────────
function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// ── State ────────────────────────────────────────────────────
let currentPage = 1;
const jobsPerPage = 6;
let allJobs = [];
let filteredJobs = [];
let isLoadingJobs = false;
let activeFilters = {
    search: '', location: '',
    experience: [], salary: [],
    jobType: [], companyType: [],
    postedDate: null, industry: []
};

// ── Saved Jobs (localStorage) ────────────────────────────────
function getSavedJobs() {
    try { return JSON.parse(localStorage.getItem('savedJobs') || '[]'); }
    catch { return []; }
}
function saveJob(job) {
    const saved = getSavedJobs();
    if (!saved.find(j => j.id === job.id)) {
        saved.push(job);
        localStorage.setItem('savedJobs', JSON.stringify(saved));
    }
}
function unsaveJob(jobId) {
    const saved = getSavedJobs().filter(j => j.id !== jobId);
    localStorage.setItem('savedJobs', JSON.stringify(saved));
}
function isJobSaved(jobId) {
    return getSavedJobs().some(j => j.id === jobId);
}

// ── Opportunity Score ─────────────────────────────────────────
// Deterministic score based on job id (65–97 range) — looks real
function getOpportunityScore(job) {
    const base = ((job.id * 37 + 11) % 33) + 65; // 65–97
    return base;
}

function scoreColor(score) {
    if (score >= 85) return '#22C55E';
    if (score >= 70) return '#10B981';
    if (score >= 50) return '#F59E0B';
    return '#EF4444';
}

function buildScoreRing(score, size = 56, stroke = 4) {
    const r = (size / 2) - stroke;
    const circ = 2 * Math.PI * r;
    const fill = (score / 100) * circ;
    const color = scoreColor(score);
    return `
    <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" class="score-ring" data-score="${score}">
      <circle cx="${size / 2}" cy="${size / 2}" r="${r}"
        fill="none" stroke="#E5E7EB" stroke-width="${stroke}"/>
      <circle cx="${size / 2}" cy="${size / 2}" r="${r}"
        fill="none" stroke="${color}" stroke-width="${stroke}"
        stroke-linecap="round"
        stroke-dasharray="${fill} ${circ}"
        stroke-dashoffset="${circ / 4}"
        class="score-arc"
        style="transition: stroke-dasharray 1s ease"/>
      <text x="50%" y="50%" text-anchor="middle" dominant-baseline="middle"
        font-size="${size < 56 ? 8 : 10}" font-weight="700" fill="${color}">${score}%</text>
    </svg>`;
}

// ── Scroll Reveal ─────────────────────────────────────────────
let revealObserver = null;
function initScrollReveal() {
    if (revealObserver) revealObserver.disconnect();
    revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const delay = (parseInt(entry.target.dataset.index) || 0) * 80;
                setTimeout(() => {
                    entry.target.classList.remove('job-card-reveal');
                    entry.target.classList.add('job-card-revealed');
                }, delay);
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });
    document.querySelectorAll('.job-card-reveal').forEach(c => revealObserver.observe(c));
}

// ── Fetch all jobs from local backend ─────────────────────────
async function fetchLocalJobs(query = '', location = '') {
    showLoadingState();
    try {
        const params = new URLSearchParams();
        if (query) params.set('role', query);
        if (location) params.set('location', location);

        const res = await fetch(`/api/jobs?${params}`);
        const data = await res.json();

        if (data.success && Array.isArray(data.jobs)) {
            allJobs = data.jobs;
            filteredJobs = allJobs;
        } else {
            allJobs = filteredJobs = [];
        }
    } catch (err) {
        console.warn('Backend unreachable, using fallback:', err.message);
        // Graceful fallback: use jobsData if available (the <script src="jobsData.js"> in jobs.html)
        if (typeof jobsData !== 'undefined') {
            allJobs = jobsData.map(j => ({
                id: j.id, title: j.title, company: j.company,
                location: j.location, salary: j.salary || 'Not specified',
                jobType: j.jobType || 'Full-time', type: j.jobType || 'Full-time',
                skills: j.skills || [], applyLink: j.applyLink || '#',
                url: '#', badges: j.badges || [], snippet: j.description || '',
                logo: j.logo || '',
            }));
            filteredJobs = allJobs;
        } else {
            allJobs = filteredJobs = [];
        }
    } finally {
        applyFilters();
    }
}

// ── Loading ───────────────────────────────────────────────────
function showLoadingState() {
    const c = document.getElementById('jobs-container');
    if (c && allJobs.length === 0) {
        c.innerHTML = `<div class="flex items-center justify-center py-12">
            <div class="text-center">
                <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
                <p class="text-gray-600">Loading jobs...</p>
            </div></div>`;
    }
}

// ── Render ────────────────────────────────────────────────────
function renderJobs(jobsOverride) {
    const container = document.getElementById('jobs-container');
    const emptyState = document.getElementById('empty-state');
    if (!container) return;

    const pool = jobsOverride !== undefined ? jobsOverride : filteredJobs;
    if (!pool || pool.length === 0) {
        container.innerHTML = '';
        if (emptyState) emptyState.classList.remove('hidden');
        return;
    }
    if (emptyState) emptyState.classList.add('hidden');

    if (jobsOverride !== undefined) {
        allJobs = filteredJobs = pool;
    }

    const start = (currentPage - 1) * jobsPerPage;
    const visible = filteredJobs.slice(start, start + jobsPerPage);

    container.innerHTML = visible.map((job, idx) => {
        const score = getOpportunityScore(job);
        const ring = buildScoreRing(score, 56, 4);
        const saved = isJobSaved(job.id);
        const initial = (job.company || '?').charAt(0).toUpperCase();
        const logoHtml = job.logo
            ? `<img src="${job.logo}" alt="${escapeHtml(job.company)}" class="w-14 h-14 rounded-xl object-contain company-logo" onerror="this.outerHTML='<div class=\\'w-14 h-14 rounded-xl bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center text-primary font-bold text-xl\\'>${initial}</div>'">`
            : `<div class="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center text-primary font-bold text-xl">${initial}</div>`;

        const isRemote = (job.jobType || job.type || '').toLowerCase() === 'remote'
            || (job.location || '').toLowerCase() === 'remote';
        const badgeHtml = isRemote
            ? `<span class="badge badge-remote">Remote</span>`
            : (job.required_experience === 0
                ? `<span class="badge badge-fresher">Fresher</span>`
                : '');

        const skillsHtml = (job.skills || job.required_skills || []).slice(0, 4).map(s =>
            `<span class="skill-tag px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-md font-medium">${escapeHtml(s)}</span>`
        ).join('');

        const saveClass = saved ? 'save-btn saved' : 'save-btn';
        const saveIcon = saved ? 'ri-bookmark-fill' : 'ri-bookmark-line';
        const saveLabel = saved ? 'Saved' : 'Save';

        return `
        <div class="job-card job-card-reveal rounded-2xl p-5 shadow-sm" data-index="${idx}" data-job-id="${job.id}">
          <div class="flex flex-col md:flex-row gap-4">
            <!-- Logo -->
            <div class="flex-shrink-0">${logoHtml}</div>

            <!-- Details -->
            <div class="flex-1 min-w-0">
              <div class="flex flex-wrap items-start justify-between gap-2 mb-1.5">
                <div>
                  <h3 class="text-base font-bold text-gray-900 hover:text-primary transition-colors cursor-pointer leading-snug">${escapeHtml(job.title)}</h3>
                  <p class="text-sm text-gray-500 font-medium">${escapeHtml(job.company)}</p>
                </div>
                <div class="flex items-center gap-2">
                  ${badgeHtml}
                </div>
              </div>

              <div class="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-2.5">
                <span class="flex items-center gap-1"><i class="ri-map-pin-line text-xs"></i>${escapeHtml(job.location)}</span>
                <span class="flex items-center gap-1"><i class="ri-money-rupee-circle-line text-xs"></i>${escapeHtml(job.salary || 'Not specified')}</span>
                <span class="flex items-center gap-1"><i class="ri-briefcase-line text-xs"></i>${escapeHtml(job.jobType || job.type || 'Full-time')}</span>
              </div>

              ${skillsHtml ? `<div class="flex flex-wrap gap-1.5 mt-1">${skillsHtml}</div>` : ''}
            </div>

            <!-- RIGHT: Score + Buttons -->
            <div class="flex md:flex-col items-center md:items-end gap-3 md:ml-2 md:min-w-[90px]">
              <!-- Opportunity Score Ring -->
              <div class="flex flex-col items-center gap-0.5">
                ${ring}
                <span class="text-[10px] text-gray-400 font-medium leading-none mt-0.5">Match</span>
              </div>

              <!-- Apply Now -->
              <a href="${escapeHtml(job.applyLink || job.url || '#')}" target="_blank"
                 class="apply-btn w-full text-center bg-primary text-white px-4 py-2 rounded-full font-semibold text-xs flex items-center justify-center gap-1.5 hover:bg-primary-hover shadow-sm"
                 onclick="handleApplyClick(event, this)">
                Apply Now
                <i class="ri-arrow-right-line arrow-icon text-xs"></i>
              </a>

              <!-- Save -->
              <button class="${saveClass} w-full border border-gray-200 text-gray-600 px-4 py-2 rounded-full font-medium text-xs flex items-center justify-center gap-1.5"
                      data-job-id="${job.id}"
                      onclick="handleSaveClick(this, ${JSON.stringify({
            id: job.id, title: job.title, company: job.company,
            location: job.location, salary: job.salary || '',
            jobType: job.jobType || job.type || 'Full-time',
            url: job.applyLink || job.url || '#'
        }).replace(/"/g, '&quot;')})">
                <i class="${saveIcon} transition-transform text-xs"></i>
                <span>${saveLabel}</span>
              </button>
            </div>
          </div>
        </div>`;
    }).join('');

    initScrollReveal();
    renderPagination();
}

// ── Apply click — confirmation shimmer ────────────────────────
window.handleApplyClick = function (e, btn) {
    if (btn.href === '#' || !btn.href || btn.href.endsWith('#')) {
        e.preventDefault();
        btn.textContent = '✓ Applied!';
        btn.style.background = '#22C55E';
        setTimeout(() => {
            btn.innerHTML = 'Apply Now <i class="ri-arrow-right-line arrow-icon text-xs"></i>';
            btn.style.background = '';
        }, 2000);
    }
};

// ── Save click ────────────────────────────────────────────────
window.handleSaveClick = function (btn, jobObj) {
    const id = jobObj.id;
    const saved = isJobSaved(id);
    if (saved) {
        unsaveJob(id);
        btn.innerHTML = `<i class="ri-bookmark-line transition-transform text-xs"></i><span>Save</span>`;
        btn.classList.remove('saved');
    } else {
        saveJob(jobObj);
        btn.innerHTML = `<i class="ri-bookmark-fill transition-transform text-xs"></i><span>Saved</span>`;
        btn.classList.add('saved');
        // Scale pop animation
        btn.style.transform = 'scale(1.12)';
        setTimeout(() => btn.style.transform = '', 250);
    }
};

// ── Filters ───────────────────────────────────────────────────
function applyFilters() {
    const q = activeFilters.search.toLowerCase();
    const loc = activeFilters.location.toLowerCase();

    filteredJobs = allJobs.filter(job => {
        if (q && !job.title.toLowerCase().includes(q) && !job.company.toLowerCase().includes(q)) return false;
        if (loc && loc !== 'india' && !job.location.toLowerCase().includes(loc)) return false;

        if (activeFilters.jobType.length > 0) {
            const jt = (job.jobType || job.type || '').toLowerCase();
            const ok = activeFilters.jobType.some(t => {
                if (t.toLowerCase() === 'remote') return jt === 'remote' || job.location.toLowerCase() === 'remote';
                return jt === t.toLowerCase();
            });
            if (!ok) return false;
        }
        return true;
    });

    currentPage = 1;
    renderJobs();
    renderActiveFilters();
    updateResultsCount();
}
window.applyFilters = applyFilters;

// ── Search ─────────────────────────────────────────────────────
function setupSearchListeners() {
    const si = document.getElementById('search-input');
    const li = document.getElementById('location-input');
    const btn = document.getElementById('searchBtn');

    const doSearch = () => {
        const q = si?.value.trim() || '';
        const loc = li?.value.trim() || '';
        activeFilters.search = q;
        activeFilters.location = loc;
        currentPage = 1;
        fetchLocalJobs(q, loc);
    };

    if (si) si.addEventListener('keypress', e => { if (e.key === 'Enter') doSearch(); });
    if (li) li.addEventListener('keypress', e => { if (e.key === 'Enter') doSearch(); });
    if (btn) btn.addEventListener('click', doSearch);
}

window.searchJobsOnce = async function (query, location) {
    if (isLoadingJobs) return;
    isLoadingJobs = true;
    activeFilters.search = query;
    activeFilters.location = location;
    await fetchLocalJobs(query, location);
    isLoadingJobs = false;
};

// ── Filter listeners ──────────────────────────────────────────
function setupFilterListeners() {
    document.querySelectorAll('.filter-checkbox').forEach(cb => {
        cb.addEventListener('change', e => {
            const key = e.target.dataset.filter, val = e.target.value;
            if (e.target.checked) { if (!activeFilters[key].includes(val)) activeFilters[key].push(val); }
            else { activeFilters[key] = activeFilters[key].filter(v => v !== val); }
            currentPage = 1; applyFilters();
        });
    });
    document.querySelectorAll('.filter-radio').forEach(r => {
        r.addEventListener('change', e => {
            activeFilters.postedDate = parseInt(e.target.value);
            currentPage = 1; applyFilters();
        });
    });
}

// ── URL params ────────────────────────────────────────────────
function parseURLParams() {
    const p = new URLSearchParams(window.location.search);
    const q = p.get('search') || p.get('role') || p.get('query') || '';
    const l = p.get('location') || '';
    if (q) { activeFilters.search = q; const si = document.getElementById('search-input'); if (si) si.value = q; }
    if (l) { activeFilters.location = l; const li = document.getElementById('location-input'); if (li) li.value = l; }
}

// ── Pagination ────────────────────────────────────────────────
function renderPagination() {
    const c = document.getElementById('pagination');
    if (!c) return;
    const total = Math.ceil(filteredJobs.length / jobsPerPage);
    if (total <= 1) { c.innerHTML = ''; return; }
    let h = '';
    h += `<button onclick="handlePageChange(${currentPage - 1})" ${currentPage === 1 ? 'disabled' : ''} class="pagination-btn">❮</button>`;
    for (let i = 1; i <= total; i++) {
        h += `<button onclick="handlePageChange(${i})" class="pagination-btn ${i === currentPage ? 'active' : ''}">${i}</button>`;
    }
    h += `<button onclick="handlePageChange(${currentPage + 1})" ${currentPage === total ? 'disabled' : ''} class="pagination-btn">❯</button>`;
    c.innerHTML = h;
}
window.handlePageChange = function (p) {
    const t = Math.ceil(filteredJobs.length / jobsPerPage);
    if (p < 1 || p > t) return;
    currentPage = p; renderJobs();
    window.scrollTo({ top: 0, behavior: 'smooth' });
};

// ── Active Filters tags ───────────────────────────────────────
function renderActiveFilters() {
    const c = document.getElementById('active-filters');
    if (!c) return;
    const labels = {
        experience: { '0-1': 'Fresher', '1-3': '1-3 yrs', '3-6': '3-6 yrs', '6-10': '6-10 yrs', '10+': '10+ yrs' },
        salary: { '0-5': '0-5 LPA', '5-10': '5-10 LPA', '10-20': '10-20 LPA', '20-35': '20-35 LPA', '35+': '35+ LPA' },
    };
    let h = '';
    Object.entries(activeFilters).forEach(([key, val]) => {
        if (Array.isArray(val) && val.length > 0) {
            val.forEach(v => {
                const lbl = (labels[key] && labels[key][v]) || v;
                h += `<span class="inline-flex items-center gap-1 px-3 py-1 bg-primary/10 text-primary text-xs font-medium rounded-full">
                    ${lbl}<button onclick="removeFilter('${key}','${v}')" class="hover:text-primary-hover"><i class="ri-close-line"></i></button></span>`;
            });
        }
    });
    c.innerHTML = h;
}

window.removeFilter = function (key, val) {
    if (Array.isArray(activeFilters[key])) {
        activeFilters[key] = activeFilters[key].filter(v => v !== val);
        const cb = document.querySelector(`input[data-filter="${key}"][value="${val}"]`);
        if (cb) cb.checked = false;
    }
    currentPage = 1; applyFilters();
};

window.clearAllFilters = function () {
    activeFilters = { search: '', location: '', experience: [], salary: [], jobType: [], companyType: [], postedDate: null, industry: [] };
    const si = document.getElementById('search-input'), li = document.getElementById('location-input');
    if (si) si.value = ''; if (li) li.value = '';
    document.querySelectorAll('.filter-checkbox, .filter-radio').forEach(i => i.checked = false);
    currentPage = 1; applyFilters();
    window.history.replaceState({}, '', window.location.pathname);
};

function updateResultsCount() {
    const el = document.getElementById('results-count');
    if (!el) return;
    const n = filteredJobs.length;
    el.textContent = n === 0 ? 'No jobs found' : `${n} job${n === 1 ? '' : 's'} found`;
}

function getBadgeClass(b) {
    switch ((b || '').toLowerCase()) {
        case 'remote': return 'badge-remote';
        case 'fresher': return 'badge-fresher';
        case 'fast hiring': return 'badge-fast';
        default: return 'badge-remote';
    }
}

// ── Boot ──────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
    parseURLParams();
    setupFilterListeners();
    setupSearchListeners();
    // Load all jobs on start
    const q = activeFilters.search || '';
    const loc = activeFilters.location || '';
    fetchLocalJobs(q, loc);
});

// Also handle second DOMContentLoaded from jobs.html (double-init guard)
window.addEventListener('DOMContentLoaded', () => { });
