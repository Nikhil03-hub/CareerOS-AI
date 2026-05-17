/**
 * Saved Jobs Page
 * Displays and manages saved jobs for authenticated user
 */

(function() {
    'use strict';

    const API_BASE_URL = 'http://localhost:5000/api';
    
    /**
     * Get JWT token from localStorage
     */
    /**
     * Get JWT token from localStorage
     * PRIMARY KEY: jc_token
     */
    function getToken() {
        return (
            localStorage.getItem('jc_token') ||
            localStorage.getItem('jwt') ||
            localStorage.getItem('authToken') ||
            localStorage.getItem('token') ||
            sessionStorage.getItem('jc_token') ||
            sessionStorage.getItem('jwt') ||
            sessionStorage.getItem('authToken') ||
            sessionStorage.getItem('token') ||
            null
        );
    }

    function getSessionUser() {
        if (window.AuthUI?.getCurrentUser) return window.AuthUI.getCurrentUser();
        for (const key of ['user', 'auroraUser', 'careerOSUser', 'careerosUser', 'currentUser']) {
            try {
                const raw = localStorage.getItem(key) || sessionStorage.getItem(key);
                if (!raw) continue;
                const parsed = JSON.parse(raw);
                const source = parsed.user || parsed.profile || parsed;
                if (source?.email || source?.displayName || source?.name) return source;
            } catch {
                // Ignore malformed legacy session keys.
            }
        }
        return null;
    }

    function getJobId(job = {}) {
        return job.jobId || job.id || job.url || job.applyLink || `${job.title || 'Job'}|${job.company || 'Company'}|${job.location || 'Location'}`;
    }

    function readLocalSavedJobs() {
        const merged = [];
        const seen = new Set();
        ['careerOSSavedJobs', 'savedJobs', 'domainx_saved_jobs', 'jc_saved_jobs'].forEach((key) => {
            try {
                const raw = localStorage.getItem(key);
                if (!raw) return;
                const parsed = JSON.parse(raw);
                const jobs = Array.isArray(parsed) ? parsed : Array.isArray(parsed.jobs) ? parsed.jobs : [];
                jobs.forEach((job) => {
                    const jobId = getJobId(job);
                    if (seen.has(jobId)) return;
                    seen.add(jobId);
                    merged.push({ ...job, jobId });
                });
            } catch {
                // Try next key.
            }
        });
        return merged;
    }

    function writeLocalSavedJobs(jobs) {
        localStorage.setItem('careerOSSavedJobs', JSON.stringify(jobs));
        localStorage.setItem('savedJobs', JSON.stringify(jobs));
    }

    /**
     * Escape HTML to prevent XSS
     */
    function escapeHtml(text) {
        if (!text) return '';
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    /**
     * Format date
     */
    function formatDate(dateString) {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric' 
        });
    }

    /**
     * Fetch saved jobs from API
     */
    async function fetchSavedJobs() {
        const token = getToken();
        
        if (!token) {
            return getSessionUser() ? readLocalSavedJobs() : [];
        }

        try {
            const response = await fetch(`${API_BASE_URL}/saved-jobs`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.status === 401) {
                return null;
            }

            const result = await response.json();
            return result.success ? result.jobs : [];
        } catch (error) {
            console.error('Error fetching saved jobs:', error);
            return readLocalSavedJobs();
        }
    }

    /**
     * Remove a saved job
     */
    async function removeSavedJob(jobId) {
        const token = getToken();
        
        if (!token) {
            const remaining = readLocalSavedJobs().filter((job) => getJobId(job) !== jobId);
            writeLocalSavedJobs(remaining);
            return true;
        }

        try {
            const response = await fetch(`${API_BASE_URL}/saved-jobs`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ jobId })
            });

            const result = await response.json();
            return result.success;
        } catch (error) {
            console.error('Error removing saved job:', error);
            const remaining = readLocalSavedJobs().filter((job) => getJobId(job) !== jobId);
            writeLocalSavedJobs(remaining);
            return true;
        }
    }

    /**
     * Render saved jobs
     */
    function renderSavedJobs(jobs) {
        const container = document.getElementById('savedJobsList') || 
                         document.getElementById('saved-jobs-container');
        
        if (!container) {
            console.error('Saved jobs container not found');
            return;
        }

        if (!jobs || jobs.length === 0) {
            container.innerHTML = `
                <div class="text-center py-12">
                    <p class="text-gray-500 text-lg mb-4">No saved jobs yet.</p>
                    <a href="jobs.html" class="text-primary hover:underline font-semibold">
                        Browse jobs to save them
                    </a>
                </div>
            `;
            return;
        }

        container.innerHTML = jobs.map((job, index) => `
            <div class="job-card" data-job-id="${escapeHtml(job.jobId)}" style="animation-delay: ${index * 100}ms">
                <div class="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
                    <div class="flex-1">
                        <h3 class="text-lg font-bold text-gray-900 mb-2">${escapeHtml(job.title || 'N/A')}</h3>
                        <div class="flex flex-wrap gap-4 text-sm text-gray-600 mb-2">
                            <span class="flex items-center gap-1">
                                <i class="ri-building-line"></i>
                                ${escapeHtml(job.company || 'N/A')}
                            </span>
                            <span class="flex items-center gap-1">
                                <i class="ri-map-pin-line"></i>
                                ${escapeHtml(job.location || 'N/A')}
                            </span>
                            ${job.salary ? `
                                <span class="flex items-center gap-1">
                                    <i class="ri-money-rupee-circle-line"></i>
                                    ${escapeHtml(job.salary)}
                                </span>
                            ` : ''}
                        </div>
                        ${job.createdAt ? `
                            <p class="text-xs text-gray-500">Saved on ${formatDate(job.createdAt)}</p>
                        ` : ''}
                    </div>
                    <div class="flex gap-2">
                        <a href="${escapeHtml(job.url || job.applyLink || '#')}" 
                           target="_blank" 
                           class="bg-primary text-white px-6 py-2.5 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 hover:bg-primary-hover transition-colors">
                            View/Apply
                            <i class="ri-arrow-right-line"></i>
                        </a>
                        <button class="remove-job-btn bg-red-50 text-red-600 px-6 py-2.5 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 hover:bg-red-100 transition-colors" 
                                data-job-id="${escapeHtml(job.jobId)}">
                            <i class="ri-delete-bin-line"></i>
                            Remove
                        </button>
                    </div>
                </div>
            </div>
        `).join('');

        // Attach remove button handlers
        container.querySelectorAll('.remove-job-btn').forEach(button => {
            button.addEventListener('click', async (e) => {
                const jobId = button.getAttribute('data-job-id');
                const jobCard = button.closest('.job-card');
                
                if (!jobId) return;

                // Confirm removal
                if (!confirm('Are you sure you want to remove this job from your saved jobs?')) {
                    return;
                }

                // Animate removal
                jobCard.style.transition = 'all 0.3s ease';
                jobCard.style.opacity = '0';
                jobCard.style.transform = 'translateX(-20px)';
                jobCard.style.height = jobCard.offsetHeight + 'px';

                const success = await removeSavedJob(jobId);

                if (success) {
                    setTimeout(() => {
                        jobCard.remove();
                        
                        // Check if no more jobs
                        const remainingJobs = container.querySelectorAll('.job-card');
                        if (remainingJobs.length === 0) {
                            container.innerHTML = `
                                <div class="text-center py-12">
                                    <p class="text-gray-500 text-lg mb-4">No saved jobs yet.</p>
                                    <a href="jobs.html" class="text-primary hover:underline font-semibold">
                                        Browse jobs to save them
                                    </a>
                                </div>
                            `;
                        }
                    }, 300);
                } else {
                    // Revert animation on error
                    jobCard.style.opacity = '1';
                    jobCard.style.transform = 'translateX(0)';
                    alert('Failed to remove job. Please try again.');
                }
            });
        });
    }

    /**
     * Initialize saved jobs page
     */
    async function init() {
        const token = getToken();
        
        const jobs = await fetchSavedJobs();
        
        if (jobs === null) {
            renderSavedJobs([]);
            return;
        }

        renderSavedJobs(jobs);
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();



