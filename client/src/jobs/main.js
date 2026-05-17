// Main JavaScript for Jobs Page - Filtering, Pagination, and Navigation

// Helper function to escape HTML
function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// State
let currentPage = 1;
const jobsPerPage = 6; // Frontend pagination - 6 jobs per page
let jooblePage = 1; // Current page for Jooble API
let isLoading = false;
let isLoadingJobs = false; // Prevent repeated API calls
let hasMoreJobs = true;
let allJobs = []; // Store all jobs from Jooble API (accumulated)
let filteredJobs = [];
let activeFilters = {
    search: '',
    location: '',
    experience: [],
    salary: [],
    jobType: [],
    companyType: [],
    postedDate: null,
    industry: []
};

// Category to skills mapping for filtering
// If category doesn't match directly, use these related skills for search
// Defined early so it's available in DOMContentLoaded
const categoryToSkills = {
    'Software Engineering': ['javascript', 'react', 'node', 'backend'],
    'Data Science': ['python', 'data science', 'machine learning'],
    'Product Management': ['product manager', 'roadmap', 'stakeholder'],
    'UI/UX Design': ['ui designer', 'ux', 'figma'],
    'Marketing': ['digital marketing', 'seo', 'content'],
    'Human Resources': ['hr', 'recruiter', 'talent acquisition'],
    'Sales': ['sales executive', 'business development'],
    'Finance & Accounting': ['finance', 'accountant', 'accounts'],
    'AI/ML': ['ai engineer', 'machine learning', 'deep learning']
};

function getStaticJobsData() {
    if (typeof jobsData !== 'undefined' && Array.isArray(jobsData)) return jobsData;
    if (Array.isArray(window.jobsData)) return window.jobsData;
    return [];
}

function normalizeJobRecord(job, index = 0) {
    const logo = job.logo && !/^(https?:)?\/\//i.test(job.logo) && !job.logo.startsWith('/')
        ? `/client/src/jobs/${job.logo.replace(/^\.?\//, '')}`
        : (job.logo || '');

    return {
        id: job.id || `static-${index}`,
        title: job.title || 'Software Developer',
        company: job.company || 'CareerOS Partner',
        logo,
        location: job.location || 'India',
        salary: job.salary || 'Not specified',
        experience: job.experience || '',
        jobType: job.jobType || job.type || 'Full-time',
        companyType: job.companyType || '',
        industry: job.industry || '',
        postedDays: Number.isFinite(job.postedDays) ? job.postedDays : 0,
        description: job.description || job.snippet || 'Curated CareerOS opportunity for graduate candidates.',
        badges: Array.isArray(job.badges) ? job.badges : [],
        skills: Array.isArray(job.skills) ? job.skills : [],
        applyLink: job.applyLink || job.url || '#'
    };
}

function getStaticJobs(query = '', location = '') {
    const staticJobs = getStaticJobsData().map(normalizeJobRecord);
    if (!staticJobs.length) return [];

    const queryTerms = String(query || '')
        .toLowerCase()
        .split(/[\s,]+/)
        .map(term => term.trim())
        .filter(term => term.length > 1);
    const locationTerm = String(location || '').toLowerCase().trim();
    const textForJob = (job) => [
        job.title,
        job.company,
        job.location,
        job.salary,
        job.experience,
        job.jobType,
        job.companyType,
        job.industry,
        job.description,
        ...(job.skills || []),
        ...(job.badges || [])
    ].join(' ').toLowerCase();

    let results = staticJobs;
    if (queryTerms.length) {
        results = results.filter(job => {
            const text = textForJob(job);
            return queryTerms.some(term => text.includes(term));
        });
    }

    if (locationTerm && locationTerm !== 'india') {
        const locationFiltered = results.filter(job => textForJob(job).includes(locationTerm));
        if (locationFiltered.length) results = locationFiltered;
    }

    return results.length ? results : staticJobs;
}

function loadStaticJobs(query = '', location = '') {
    allJobs = getStaticJobs(query, location);
    filteredJobs = [...allJobs];
    currentPage = 1;
    jooblePage = 1;
    hasMoreJobs = false;
    hideLoadingState();
    renderJobs();
    renderActiveFilters();
    updateResultsCount();
    updateLoadMoreButton();
}

// Scroll Reveal Observer - Performance optimized
let scrollRevealObserver = null;

function initScrollReveal() {
    // Clean up previous observer
    if (scrollRevealObserver) {
        scrollRevealObserver.disconnect();
    }

    // Create IntersectionObserver for scroll reveal
    scrollRevealObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                // Add stagger delay based on card index
                const cardIndex = parseInt(entry.target.dataset.index) || 0;
                const delay = cardIndex * 80; // 80ms stagger

                setTimeout(() => {
                    entry.target.classList.remove('job-card-reveal');
                    entry.target.classList.add('job-card-revealed');
                }, delay);

                // Unobserve after reveal for performance
                scrollRevealObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    // Observe all job cards
    document.querySelectorAll('.job-card-reveal').forEach(card => {
        scrollRevealObserver.observe(card);
    });
}

// Fetch jobs from Jooble API
async function fetchJobsFromJooble(query = 'developer', location = '', page = 1, append = false) {
    if (isLoading) return;

    isLoading = true;
    showLoadingState();

    try {
        const response = await fetch('/api/jobs/search', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                keywords: query.trim() || 'developer',
                location: location.trim() || '',
                page: page
            })
        });

        const data = await response.json();

        if (!response.ok || !data.success) {
            console.error('Failed to fetch jobs:', data.error || 'Unknown error');
            if (!append) loadStaticJobs(query, location);
            isLoading = false;
            return;
        }

        const jobs = data.jobs || [];

        if (jobs.length === 0) {
            hasMoreJobs = false;
            hideLoadingState();
            if (!append && allJobs.length === 0) {
                loadStaticJobs(query, location);
            } else if (append) {
                // Hide load more button if no more jobs
                const loadMoreBtn = document.getElementById('load-more-btn');
                if (loadMoreBtn) {
                    loadMoreBtn.style.display = 'none';
                }
            }
            isLoading = false;
            return;
        }

        // Map Jooble jobs to our format
        const formattedJobs = jobs.map((job, idx) => ({
            id: `jooble-${page}-${idx}`,
            title: job.title || 'N/A',
            company: job.company || 'N/A',
            logo: '', // Jooble doesn't provide logos
            location: job.location || 'N/A',
            salary: job.salary || 'Not specified',
            experience: '',
            jobType: job.type || 'Full-time',
            companyType: '',
            industry: '',
            postedDays: 0,
            description: job.snippet || '',
            badges: job.type === 'Remote' ? ['Remote'] : [],
            skills: [],
            applyLink: job.url || '#'
        }));

        if (append) {
            // Append to existing jobs
            allJobs = [...allJobs, ...formattedJobs];
        } else {
            // Replace all jobs
            allJobs = formattedJobs;
            jooblePage = 1;
            hasMoreJobs = true;
        }

        hideLoadingState();
        applyFilters();

        // Show/hide load more button
        updateLoadMoreButton();

    } catch (error) {
        console.error('Error fetching jobs:', error);
        hideLoadingState();
        if (!append) loadStaticJobs(query, location);
    } finally {
        isLoading = false;
    }
}

// Show loading state
function showLoadingState() {
    const container = document.getElementById('jobs-container');
    if (container) {
        const loadingHtml = `
            <div class="flex items-center justify-center py-12">
                <div class="text-center">
                    <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
                    <p class="text-gray-600">Loading jobs...</p>
                </div>
            </div>
        `;
        if (allJobs.length === 0) {
            container.innerHTML = loadingHtml;
        }
    }
}

// Hide loading state
function hideLoadingState() {
    // Loading state is replaced by renderJobs, so nothing needed here
}

// Show/hide loader
function showLoader(show) {
    if (show) {
        showLoadingState();
    } else {
        hideLoadingState();
    }
}

// Show error message
function showError(message) {
    const container = document.getElementById('jobs-container');
    const emptyState = document.getElementById('empty-state');

    if (container) {
        container.innerHTML = '';
    }

    if (emptyState) {
        emptyState.classList.remove('hidden');
        const title = emptyState.querySelector('h3');
        if (title) {
            title.textContent = message || 'Error loading jobs';
        }
    }
}

// Show empty state
function showEmptyState(message = 'No jobs found') {
    const container = document.getElementById('jobs-container');
    const emptyState = document.getElementById('empty-state');

    if (container) {
        container.innerHTML = '';
    }

    if (emptyState) {
        emptyState.classList.remove('hidden');
        const title = emptyState.querySelector('h3');
        if (title) {
            title.textContent = message;
        }
    }
}

// Update Load More button visibility
function updateLoadMoreButton() {
    const loadMoreBtn = document.getElementById('load-more-btn');
    if (loadMoreBtn) {
        if (hasMoreJobs && filteredJobs.length > 0 && !isLoading) {
            loadMoreBtn.style.display = 'block';
            loadMoreBtn.disabled = false;
            loadMoreBtn.innerHTML = `
                <span>Load More Jobs</span>
                <i class="ri-arrow-down-line"></i>
            `;
        } else if (isLoading) {
            loadMoreBtn.disabled = true;
            loadMoreBtn.innerHTML = `
                <span>Loading...</span>
                <div class="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            `;
        } else {
            loadMoreBtn.style.display = 'none';
        }
    } else {
        // Button doesn't exist yet, renderPagination will create it
        renderPagination();
    }
}

// Load More handler
function loadMoreJobs() {
    if (isLoading || !hasMoreJobs) return;

    jooblePage++;
    const query = activeFilters.search || document.getElementById('search-input')?.value.trim() || 'developer';
    const location = activeFilters.location || document.getElementById('location-input')?.value.trim() || '';

    fetchJobsFromJooble(query, location, jooblePage, true);
}

// Make loadMoreJobs available globally
window.loadMoreJobs = loadMoreJobs;

// Load jobs from static data (fallback - kept for compatibility)
function loadJobs() {
    // Auto-fetch default jobs from Jooble API
    const urlParams = new URLSearchParams(window.location.search);
    const queryParam = urlParams.get('query') || urlParams.get('search') || 'developer';
    const locationParam = urlParams.get('location') || 'India'; // Default to India

    // Set initial filters from URL
    if (queryParam) {
        activeFilters.search = queryParam;
        const searchInput = document.getElementById('search-input');
        if (searchInput) searchInput.value = queryParam;
    }

    // Always set location to India if not specified
    activeFilters.location = locationParam;
    const locationInput = document.getElementById('location-input');
    if (locationInput) {
        locationInput.value = locationParam;
    }

    // Fetch from Jooble API
    fetchJobsFromJooble(queryParam, locationParam, 1, false);
}

// Handle image error - replace with fallback
function handleImageError(img) {
    if (img.dataset.fallback) {
        const fallbackDiv = `<div class="w-14 h-14 rounded-xl bg-gradient-to-br from-primary/20 to-primary/40 flex items-center justify-center text-primary font-bold text-xl">${img.dataset.fallback}</div>`;
        img.outerHTML = fallbackDiv;
    }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    // Parse URL parameters
    parseURLParams();

    // Set up event listeners
    setupFilterListeners();
    setupSearchListeners();

    // Ensure location is set to India if empty
    const locationInput = document.getElementById('location-input');
    if (locationInput && !locationInput.value.trim()) {
        locationInput.value = 'India';
        activeFilters.location = 'India';
    }

    // Get search query (from URL or empty for all jobs)
    const searchInput = document.getElementById('search-input');
    const urlParams = new URLSearchParams(window.location.search);

    // Check URL parameters to determine query and location
    let query = '';
    let location = 'India';

    // Priority 1: Check for skills parameter (from dashboard Find Jobs button)
    if (urlParams.has('skills')) {
        // From dashboard Find Jobs: use skills parameter and always set location to India
        const skillsParam = urlParams.get('skills') || '';
        // Convert comma-separated skills to space-separated query
        query = skillsParam.split(',').map(s => s.trim()).filter(s => s).join(' ');
        location = urlParams.get('location') || 'India';
        activeFilters.search = query;
        activeFilters.location = location;
        if (searchInput) {
            searchInput.value = query;
        }
        if (locationInput) {
            locationInput.value = location;
        }
    }
    // Priority 2: Check for category parameter (from homepage category clicks)
    else if (urlParams.has('category')) {
        const category = urlParams.get('category');
        const relatedSkills = categoryToSkills[category] || [category.toLowerCase()];
        query = relatedSkills.join(' ');
        location = 'India';
        activeFilters.category = category;
        activeFilters.relatedSkills = relatedSkills;
        activeFilters.search = query;
        activeFilters.location = 'India';
        if (searchInput) {
            searchInput.value = query;
        }
        if (locationInput) {
            locationInput.value = 'India';
        }
        // Store related skills for client-side filtering
        activeFilters.categorySkills = relatedSkills;
    }
    // Priority 3: Check for search parameter (from home page or dashboard)
    else if (urlParams.has('search')) {
        // From home page or dashboard: use search parameter
        query = urlParams.get('search') || '';
        // Use location from URL if provided, otherwise default to India
        location = urlParams.get('location') || 'India';
        activeFilters.search = query;
        activeFilters.location = location;
        if (searchInput) {
            searchInput.value = query;
        }
        if (locationInput) {
            locationInput.value = location;
        }
    }
    // Priority 3: Use from activeFilters (already parsed by parseURLParams)
    else if (activeFilters.category && activeFilters.relatedSkills) {
        // From category click: use skills array joined as search query
        query = activeFilters.relatedSkills.join(' ');
        location = 'India';
        if (searchInput) {
            searchInput.value = query;
        }
        if (locationInput) {
            locationInput.value = 'India';
        }
        activeFilters.location = 'India';
        activeFilters.search = query;
        // Store related skills for client-side filtering
        activeFilters.categorySkills = activeFilters.relatedSkills;
    }
    // Fallback: use from input or activeFilters
    else {
        query = searchInput?.value.trim() || activeFilters.search || '';
        location = locationInput?.value.trim() || activeFilters.location || 'India';
    }

    // Auto-search on page load when category or search is clicked (always search with location India)
    // This works exactly like city clicks - simple and reliable
    setTimeout(() => {
        // Re-check URL parameters to ensure we have the latest values
        const urlParams = new URLSearchParams(window.location.search);
        let finalQuery = '';
        let finalLocation = 'India';
        let shouldSearch = false;

        // Priority 1: Skills parameter (from dashboard Find Jobs button)
        if (urlParams.has('skills')) {
            const skillsParam = urlParams.get('skills') || '';
            // Convert comma-separated skills to space-separated query
            finalQuery = skillsParam.split(',').map(s => s.trim()).filter(s => s).join(' ');
            finalLocation = urlParams.get('location') || 'India';
            shouldSearch = true;

            // Update activeFilters
            activeFilters.search = finalQuery;
            activeFilters.location = finalLocation;

            // Update input fields
            if (searchInput) {
                searchInput.value = finalQuery;
            }
            if (locationInput) {
                locationInput.value = finalLocation;
            }
        }
        // Priority 2: Category parameter (from homepage category clicks)
        else if (urlParams.has('category')) {
            const category = urlParams.get('category');
            if (categoryToSkills[category]) {
                const relatedSkills = categoryToSkills[category];
                finalQuery = relatedSkills.join(' ');
                finalLocation = 'India';
                shouldSearch = true;

                // Update activeFilters
                activeFilters.category = category;
                activeFilters.relatedSkills = relatedSkills;
                activeFilters.search = finalQuery;
                activeFilters.location = finalLocation;

                // Update input fields
                if (searchInput) {
                    searchInput.value = finalQuery;
                }
                if (locationInput) {
                    locationInput.value = finalLocation;
                }
            }
        }
        // Priority 3: Search parameter (from home page or dashboard)
        else if (urlParams.has('search')) {
            finalQuery = urlParams.get('search') || '';
            // Use location from URL if provided, otherwise default to India
            finalLocation = urlParams.get('location') || 'India';
            shouldSearch = true;

            // Update activeFilters
            activeFilters.search = finalQuery;
            activeFilters.location = finalLocation;

            // Update input fields
            if (searchInput) {
                searchInput.value = finalQuery;
            }
            if (locationInput) {
                locationInput.value = finalLocation;
            }
        }
        // Fallback: Use already set values from above
        else {
            finalQuery = query || activeFilters.search || '';
            finalLocation = location || activeFilters.location || 'India';
            if (finalQuery && finalQuery.trim() !== '') {
                shouldSearch = true;
            }
        }

        // Ensure inputs are visible with correct values
        if (searchInput && finalQuery) {
            searchInput.value = finalQuery;
        }
        if (locationInput && finalLocation) {
            locationInput.value = finalLocation;
        }

        // Trigger search automatically if we have a query (exactly like city clicks)
        if (shouldSearch && finalQuery && finalQuery.trim() !== '') {
            searchJobsOnce(finalQuery, finalLocation);
        }
    }, 200);
});

// Helper function to get URL parameter
function getURLParam(name) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name) || '';
}

// Parse URL parameters from homepage
function parseURLParams() {
    const urlParams = new URLSearchParams(window.location.search);

    // Category parameter - map to related skills
    if (urlParams.has('category')) {
        const category = urlParams.get('category');
        const relatedSkills = categoryToSkills[category] || [category.toLowerCase()];

        // Join skills array into a search query string
        const skillsQuery = relatedSkills.join(' ');
        activeFilters.search = skillsQuery;
        const searchInput = document.getElementById('search-input');
        if (searchInput) {
            searchInput.value = skillsQuery;
        }

        // Store category for filtering
        activeFilters.category = category;
        activeFilters.relatedSkills = relatedSkills;

        // When category is clicked, always set location to India
        activeFilters.location = 'India';
        const locationInput = document.getElementById('location-input');
        if (locationInput) {
            locationInput.value = 'India';
        }
    } else if (urlParams.has('search')) {
        activeFilters.search = urlParams.get('search');
        const searchInput = document.getElementById('search-input');
        if (searchInput) {
            searchInput.value = activeFilters.search;
        }

        // Location - always use India when search parameter is present (from dashboard city clicks)
        // This ensures city names from dashboard are ignored and location always shows India
        activeFilters.location = 'India';
        const locationInput = document.getElementById('location-input');
        if (locationInput) {
            locationInput.value = 'India';
        }
    } else if (urlParams.has('role')) {
        activeFilters.search = urlParams.get('role');
        const searchInput = document.getElementById('search-input');
        if (searchInput) {
            searchInput.value = activeFilters.search;
        }

        // Location - default to India if not specified in URL
        if (urlParams.has('location')) {
            activeFilters.location = urlParams.get('location');
        } else {
            activeFilters.location = 'India';
        }
        const locationInput = document.getElementById('location-input');
        if (locationInput) {
            locationInput.value = activeFilters.location;
        }
    } else {
        // No category/search/role - just set location default
        if (urlParams.has('location')) {
            activeFilters.location = urlParams.get('location');
        } else {
            activeFilters.location = 'India';
        }
        const locationInput = document.getElementById('location-input');
        if (locationInput) {
            locationInput.value = activeFilters.location;
        }
    }

    // Experience
    if (urlParams.has('experience')) {
        const exp = urlParams.get('experience');
        activeFilters.experience = [exp];
        // Check the corresponding checkbox
        const checkbox = document.querySelector(`input[data-filter="experience"][value="${exp}"]`);
        if (checkbox) checkbox.checked = true;
    }

    // Job Type
    if (urlParams.has('jobType')) {
        const type = urlParams.get('jobType');
        activeFilters.jobType = [type];
        const checkbox = document.querySelector(`input[data-filter="jobType"][value="${type}"]`);
        if (checkbox) checkbox.checked = true;
    }

    // Company Type
    if (urlParams.has('companyType')) {
        const type = urlParams.get('companyType');
        activeFilters.companyType = [type];
        const checkbox = document.querySelector(`input[data-filter="companyType"][value="${type}"]`);
        if (checkbox) checkbox.checked = true;
    }

    // Industry
    if (urlParams.has('industry')) {
        const ind = urlParams.get('industry');
        activeFilters.industry = [ind];
        const checkbox = document.querySelector(`input[data-filter="industry"][value="${ind}"]`);
        if (checkbox) checkbox.checked = true;
    }

    // Company (search by company name)
    if (urlParams.has('company')) {
        activeFilters.search = urlParams.get('company');
        document.getElementById('search-input').value = activeFilters.search;
    }
}

// Set up filter checkboxes and radio buttons
function setupFilterListeners() {
    // Checkboxes
    document.querySelectorAll('.filter-checkbox').forEach(checkbox => {
        checkbox.addEventListener('change', (e) => {
            const filterType = e.target.dataset.filter;
            const value = e.target.value;

            if (e.target.checked) {
                if (!activeFilters[filterType].includes(value)) {
                    activeFilters[filterType].push(value);
                }
            } else {
                activeFilters[filterType] = activeFilters[filterType].filter(v => v !== value);
            }

            currentPage = 1;
            // Apply filters to existing jobs (client-side filtering)
            applyFilters();
        });
    });

    // Radio buttons (Posted Date)
    document.querySelectorAll('.filter-radio').forEach(radio => {
        radio.addEventListener('change', (e) => {
            activeFilters.postedDate = parseInt(e.target.value);
            currentPage = 1;
            // Apply filters to existing jobs (client-side filtering)
            applyFilters();
        });
    });
}

// Set up search input listeners
function setupSearchListeners() {
    const searchInput = document.getElementById('search-input');
    const locationInput = document.getElementById('location-input');

    if (!searchInput || !locationInput) return;

    // Auto-search on input change (debounced) - automatically search when user types
    let searchTimeout;
    searchInput.addEventListener('input', (e) => {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => {
            const query = e.target.value.trim();
            const location = locationInput.value.trim() || "India";
            activeFilters.search = query;
            searchJobsOnce(query, location);
        }, 500); // 500ms debounce to prevent API spam
    });

    // Auto-search on location change (debounced)
    let locationTimeout;
    locationInput.addEventListener('input', (e) => {
        clearTimeout(locationTimeout);
        locationTimeout = setTimeout(() => {
            const query = searchInput.value.trim();
            const location = e.target.value.trim() || "India";
            activeFilters.location = location;
            searchJobsOnce(query, location);
        }, 500); // 500ms debounce
    });

    // Enter key to search - uses searchJobsOnce wrapper
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            const query = e.target.value.trim();
            const location = locationInput.value.trim() || "India";
            clearTimeout(searchTimeout);
            searchJobsOnce(query, location);
        }
    });

    locationInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            const query = searchInput.value.trim();
            const location = e.target.value.trim() || "India";
            clearTimeout(locationTimeout);
            searchJobsOnce(query, location);
        }
    });

    // Search button click - uses searchJobsOnce wrapper
    const searchBtn = document.getElementById("searchBtn");
    if (searchBtn) {
        searchBtn.addEventListener("click", () => {
            const keywords = document.getElementById("search-input").value.trim();
            const location = document.getElementById("location-input").value.trim() || "India";
            clearTimeout(searchTimeout);
            clearTimeout(locationTimeout);
            searchJobsOnce(keywords, location);
        });
    }
}

// Global applyFilters function for onclick handlers - uses searchJobsOnce
window.applyFilters = function () {
    const searchInput = document.getElementById('search-input');
    const locationInput = document.getElementById('location-input');
    const query = searchInput?.value.trim() || '';
    const location = locationInput?.value.trim() || 'India';

    searchJobsOnce(query, location);
};

// Apply all filters and render (client-side filtering of already fetched jobs)
function applyFilters() {
    // Filter jobs from Jooble API results
    filteredJobs = allJobs.filter(job => {
        // Category-based filtering: if category is set, filter by category name or related skills
        if (activeFilters.category && activeFilters.categorySkills) {
            const jobText = `${job.title} ${job.description} ${job.company}`.toLowerCase();
            const categoryLower = activeFilters.category.toLowerCase();
            const hasCategoryMatch = jobText.includes(categoryLower);

            // If category doesn't match, check related skills
            if (!hasCategoryMatch) {
                const hasSkillMatch = activeFilters.categorySkills.some(skill =>
                    jobText.includes(skill.toLowerCase())
                );
                if (!hasSkillMatch) {
                    return false; // Filter out jobs that don't match category or related skills
                }
            }
        }

        // Job Type filter (Remote/On-site/Full-time/etc)
        if (activeFilters.jobType.length > 0) {
            const jobTypeMatch = activeFilters.jobType.some(type => {
                // Check if job has Remote badge or jobType is Remote
                if (type === 'Remote' && (job.jobType === 'Remote' || (job.badges && job.badges.includes('Remote')))) return true;
                // Check for On-site (anything that's not Remote)
                if (type === 'On-site' && job.jobType !== 'Remote' && !(job.badges && job.badges.includes('Remote'))) return true;
                // Direct match
                if (job.jobType === type) return true;
                return false;
            });
            if (!jobTypeMatch) return false;
        }

        return true;
    });

    // Reset to page 1 when filters change
    currentPage = 1;
    renderJobs();
    renderActiveFilters();
    updateResultsCount();
}

// Extract salary number from string (e.g., "₹18-25 LPA" -> 18)
function extractSalaryNumber(salaryStr) {
    const match = salaryStr.match(/₹(\d+)/);
    return match ? parseInt(match[1]) : 0;
}

// Render job cards - accepts jobs array directly from API
function renderJobs(jobs) {
    const container = document.getElementById('jobs-container');
    const emptyState = document.getElementById('empty-state');

    if (!container) return;

    // If jobs array is provided, use it directly; otherwise use filteredJobs
    const jobsToRender = jobs !== undefined ? jobs : filteredJobs;

    if (!jobsToRender || jobsToRender.length === 0) {
        container.innerHTML = '';
        if (emptyState) {
            emptyState.classList.remove('hidden');
            const emptyStateTitle = emptyState.querySelector('h3');
            if (emptyStateTitle) {
                emptyStateTitle.textContent = 'No jobs found';
            }
        }
        return;
    }

    if (emptyState) {
        emptyState.classList.add('hidden');
    }

    // Store jobs for filtering if jobs array was provided
    if (jobs !== undefined) {
        allJobs = jobsToRender.map((job, idx) => ({
            id: job.id || `jooble-${Date.now()}-${idx}`,
            title: job.title || 'N/A',
            company: job.company || 'N/A',
            logo: job.logo || '',
            location: job.location || 'N/A',
            salary: job.salary || 'Not specified',
            experience: '',
            jobType: job.type || 'Full-time',
            companyType: '',
            industry: '',
            postedDays: 0,
            description: job.snippet || '',
            badges: job.type === 'Remote' ? ['Remote'] : [],
            skills: [],
            applyLink: job.url || '#'
        }));
        filteredJobs = allJobs;
        jooblePage = 1;
        hasMoreJobs = true;
    }

    // Frontend pagination - show only 6 jobs per page
    const indexOfLastJob = currentPage * jobsPerPage;
    const indexOfFirstJob = indexOfLastJob - jobsPerPage;
    const currentJobs = filteredJobs.slice(indexOfFirstJob, indexOfLastJob);

    // Map API jobs to display format (only current page jobs)
    container.innerHTML = currentJobs.map((job, index) => {
        // Get company initial for fallback
        const companyInitial = job.company ? job.company.charAt(0).toUpperCase() : '?';

        // Use logo from jobsData if available, otherwise show initial
        const fallbackDiv = `<div class="w-14 h-14 rounded-xl bg-gradient-to-br from-primary/20 to-primary/40 flex items-center justify-center text-primary font-bold text-xl">${companyInitial}</div>`;
        const logoDisplay = job.logo
            ? `<img src="${job.logo}" alt="${job.company} logo" class="w-14 h-14 rounded-xl object-cover company-logo" data-fallback="${companyInitial}" onerror="handleImageError(this)">`
            : fallbackDiv;

        // Determine badge based on jobType and badges array
        let badge = '';
        const jobType = job.type || job.jobType || 'Full-time';
        if (jobType === 'Remote' || (job.badges && job.badges.includes('Remote'))) {
            badge = 'Remote';
        } else if (job.badges && job.badges.length > 0) {
            badge = job.badges[0]; // Use first badge
        }

        return `
        <div class="job-card job-card-reveal rounded-2xl p-6 shadow-sm" data-index="${index}">
            <div class="flex flex-col md:flex-row gap-4">
                <!-- Company Logo -->
                <div class="flex-shrink-0">
                    ${logoDisplay}
                </div>
                
                <!-- Job Details -->
                <div class="flex-1 min-w-0">
                    <div class="flex flex-wrap items-start justify-between gap-2 mb-2">
                        <div>
                            <h3 class="text-lg font-bold text-gray-900 hover:text-primary transition-colors cursor-pointer">${job.title || 'N/A'}</h3>
                            <p class="text-sm font-medium text-gray-600">${job.company || 'N/A'}</p>
                        </div>
                        <div class="flex gap-2">
                            ${badge ? `<span class="badge ${getBadgeClass(badge)}">${badge}</span>` : ''}
                        </div>
                    </div>
                    
                    <div class="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-3">
                        <span class="flex items-center gap-1">
                            <i class="ri-map-pin-line"></i>
                            ${job.location || 'N/A'}
                        </span>
                        <span class="flex items-center gap-1">
                            <i class="ri-money-rupee-circle-line"></i>
                            ${job.salary || 'Not specified'}
                        </span>
                        <span class="flex items-center gap-1">
                            <i class="ri-briefcase-line"></i>
                            ${job.jobType || 'Full-time'}
                        </span>
                    </div>
                </div>
                
                <!-- Action Buttons -->
                <div class="flex md:flex-col gap-2 md:ml-4">
                    <a href="${job.applyLink || job.url || '#'}" target="_blank" class="apply-btn flex-1 md:flex-none bg-primary text-white px-6 py-2.5 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 hover:bg-primary-hover transition-colors">
                        Apply Now
                        <i class="ri-arrow-right-line arrow-icon"></i>
                    </a>
                    <button class="save-btn flex-1 md:flex-none border border-gray-200 text-gray-700 px-6 py-2.5 rounded-xl font-medium text-sm flex items-center justify-center gap-2 hover:bg-gray-50 transition-colors" data-job='${JSON.stringify({
            id: job.id || `job-${index}`,
            title: job.title || 'N/A',
            company: job.company || 'N/A',
            location: job.location || 'N/A',
            salary: job.salary || '',
            jobType: job.jobType || 'Full-time',
            url: job.applyLink || job.url || '#',
            logo: job.logo || '',
            description: job.description || job.snippet || ''
        })}'>
                        <i class="ri-bookmark-line transition-transform"></i>
                        Save
                    </button>
                </div>
            </div>
        </div>
    `;
    }).join('');

    // Initialize scroll reveal for job cards
    initScrollReveal();

    // Render pagination
    renderPagination();
    updateResultsCount();
}

// Get badge CSS class
function getBadgeClass(badge) {
    switch (badge.toLowerCase()) {
        case 'remote': return 'badge-remote';
        case 'fresher': return 'badge-fresher';
        case 'fast hiring': return 'badge-fast';
        default: return 'badge-remote';
    }
}

// Format experience
function formatExperience(exp) {
    if (exp === '0-1') return 'Fresher';
    if (exp === '10+') return '10+ years';
    return exp + ' years';
}

// Format posted date
function formatPostedDate(days) {
    if (days === 0) return 'Today';
    if (days === 1) return 'Yesterday';
    return `${days} days ago`;
}

// Handle page change for frontend pagination
function handlePageChange(pageNumber) {
    const totalPages = Math.ceil(filteredJobs.length / jobsPerPage);
    if (pageNumber < 1 || pageNumber > totalPages) return;

    currentPage = pageNumber;
    renderJobs(); // Re-render with new page
    window.scrollTo({ top: 0, behavior: "smooth" });
}

// Render pagination UI
function renderPagination() {
    const container = document.getElementById('pagination');
    if (!container) return;

    const totalPages = Math.ceil(filteredJobs.length / jobsPerPage);

    if (totalPages <= 1) {
        container.innerHTML = '';
        return;
    }

    let html = '';

    // Previous button
    html += `
        <button onclick="handlePageChange(${currentPage - 1})" 
                ${currentPage === 1 ? 'disabled' : ''}
                class="pagination-btn pagination-arrow ${currentPage === 1 ? 'disabled' : ''}">
            ❮
        </button>
    `;

    // Page numbers - show up to 5 pages
    const maxVisible = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisible / 2));
    let endPage = Math.min(totalPages, startPage + maxVisible - 1);

    if (endPage - startPage < maxVisible - 1) {
        startPage = Math.max(1, endPage - maxVisible + 1);
    }

    // First page and ellipsis
    if (startPage > 1) {
        html += `<button onclick="handlePageChange(1)" class="pagination-btn">1</button>`;
        if (startPage > 2) {
            html += `<span class="pagination-ellipsis">...</span>`;
        }
    }

    // Page numbers
    for (let i = startPage; i <= endPage; i++) {
        html += `
            <button onclick="handlePageChange(${i})" 
                    class="pagination-btn ${i === currentPage ? 'active-page' : ''}">
                ${i}
            </button>
        `;
    }

    // Last page and ellipsis
    if (endPage < totalPages) {
        if (endPage < totalPages - 1) {
            html += `<span class="pagination-ellipsis">...</span>`;
        }
        html += `<button onclick="handlePageChange(${totalPages})" class="pagination-btn">${totalPages}</button>`;
    }

    // Next button
    html += `
        <button onclick="handlePageChange(${currentPage + 1})" 
                ${currentPage === totalPages ? 'disabled' : ''}
                class="pagination-btn pagination-arrow ${currentPage === totalPages ? 'disabled' : ''}">
            ❯
        </button>
    `;

    container.innerHTML = html;
}

// Make handlePageChange available globally
window.handlePageChange = handlePageChange;

// Go to specific page (deprecated - using Load More instead)
// Kept for compatibility but not used with Jooble API
function goToPage(page) {
    // Not used with Jooble API - pagination handled by Load More
    return;
}

// Render active filters tags
function renderActiveFilters() {
    const container = document.getElementById('active-filters');
    let html = '';

    // Add filter tags
    Object.entries(activeFilters).forEach(([key, value]) => {
        if (Array.isArray(value) && value.length > 0) {
            value.forEach(v => {
                html += `
                    <span class="inline-flex items-center gap-1 px-3 py-1 bg-primary/10 text-primary text-sm font-medium rounded-full">
                        ${formatFilterLabel(key, v)}
                        <button onclick="removeFilter('${key}', '${v}')" class="hover:text-primary-hover">
                            <i class="ri-close-line"></i>
                        </button>
                    </span>
                `;
            });
        } else if (value && typeof value === 'string' && key !== 'search' && key !== 'location') {
            html += `
                <span class="inline-flex items-center gap-1 px-3 py-1 bg-primary/10 text-primary text-sm font-medium rounded-full">
                    ${formatFilterLabel(key, value)}
                    <button onclick="removeFilter('${key}', '${value}')" class="hover:text-primary-hover">
                        <i class="ri-close-line"></i>
                    </button>
                </span>
            `;
        } else if (typeof value === 'number' && key === 'postedDate') {
            html += `
                <span class="inline-flex items-center gap-1 px-3 py-1 bg-primary/10 text-primary text-sm font-medium rounded-full">
                    Last ${value} days
                    <button onclick="removeFilter('${key}', ${value})" class="hover:text-primary-hover">
                        <i class="ri-close-line"></i>
                    </button>
                </span>
            `;
        }
    });

    container.innerHTML = html;
}

// Format filter label
function formatFilterLabel(key, value) {
    const labels = {
        experience: { '0-1': 'Fresher', '1-3': '1-3 yrs', '3-6': '3-6 yrs', '6-10': '6-10 yrs', '10+': '10+ yrs' },
        salary: { '0-5': '0-5 LPA', '5-10': '5-10 LPA', '10-20': '10-20 LPA', '20-35': '20-35 LPA', '35+': '35+ LPA' }
    };

    if (labels[key] && labels[key][value]) {
        return labels[key][value];
    }
    return value;
}

// Remove a specific filter
function removeFilter(key, value) {
    if (Array.isArray(activeFilters[key])) {
        activeFilters[key] = activeFilters[key].filter(v => v !== value);
        // Uncheck the checkbox
        const checkbox = document.querySelector(`input[data-filter="${key}"][value="${value}"]`);
        if (checkbox) checkbox.checked = false;
    } else if (key === 'postedDate') {
        activeFilters[key] = null;
        // Uncheck radio
        document.querySelectorAll(`input[data-filter="${key}"]`).forEach(r => r.checked = false);
    } else {
        activeFilters[key] = '';
        // Update input field
        if (key === 'search') {
            const searchInput = document.getElementById('search-input');
            if (searchInput) searchInput.value = '';
        } else if (key === 'location') {
            const locationInput = document.getElementById('location-input');
            if (locationInput) locationInput.value = '';
        }
    }

    currentPage = 1;

    // Apply filters to static data
    applyFilters();
}

// Clear all filters
function clearAllFilters() {
    activeFilters = {
        search: '',
        location: '',
        experience: [],
        salary: [],
        jobType: [],
        companyType: [],
        postedDate: null,
        industry: []
    };

    // Clear inputs
    const searchInput = document.getElementById('search-input');
    const locationInput = document.getElementById('location-input');
    if (searchInput) searchInput.value = '';
    if (locationInput) locationInput.value = '';

    // Uncheck all checkboxes and radios
    document.querySelectorAll('.filter-checkbox, .filter-radio').forEach(input => {
        input.checked = false;
    });

    currentPage = 1;

    // Apply filters to static data
    applyFilters();

    // Clear URL params
    window.history.replaceState({}, '', window.location.pathname);
}

// Update results count
function updateResultsCount() {
    const countEl = document.getElementById('results-count');
    const total = filteredJobs.length;

    if (total === 0) {
        countEl.textContent = 'No jobs found';
    } else if (total === 1) {
        countEl.textContent = '1 job found';
    } else {
        countEl.textContent = `${total} jobs found`;
    }
}

// Search jobs function (actual API call logic)
async function searchJobs(query = "", location = "India") {
    try {
        const res = await fetch("/api/jobs/search", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                query,     // MUST be query
                location   // MUST be location
            })
        });

        const data = await res.json();
        // Reset to page 1 when new jobs are loaded
        currentPage = 1;
        if (data.success && Array.isArray(data.jobs) && data.jobs.length) {
            renderJobs(data.jobs);   // ⬅ display jobs directly
        } else {
            renderJobs(getStaticJobs(query, location));
        }
    } catch (err) {
        console.log("Job fetch error:", err);
        currentPage = 1;
        renderJobs(getStaticJobs(query, location));
    }
}

// Wrapper to prevent repeated API calls
async function searchJobsOnce(query, location) {
    if (isLoadingJobs) {
        console.log("⏸️ Search already in progress, skipping duplicate call");
        return Promise.resolve(); // 🛑 prevent repeated calls, return resolved promise
    }

    isLoadingJobs = true;
    try {
        await searchJobs(query, location); // your actual API logic
    } finally {
        isLoadingJobs = false;
    }
    return Promise.resolve(); // Return promise for chaining
}

// ❌ REMOVED: Any setInterval, window.onload, or oninput handlers that auto-trigger searchJobs
// Search only happens on button click, Enter key, or initial page load
// Auto-search is now handled in the main DOMContentLoaded event above

