/**
 * Dashboard Saved Jobs
 * Works with the JobCluster API when available and falls back to the
 * existing CareerOS browser session/local saved jobs on static deploys.
 */

const SAVED_JOB_KEYS = ['careerOSSavedJobs', 'savedJobs', 'domainx_saved_jobs', 'jc_saved_jobs'];

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

function getDashboardUser() {
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

function isSessionAvailable() {
  return Boolean(getToken() || getDashboardUser());
}

function normalizeJob(job = {}) {
  const jobId = job.jobId || job.id || job.url || job.applyLink || `${job.title || 'Job'}|${job.company || 'Company'}|${job.location || 'Location'}`;
  return {
    ...job,
    jobId,
    title: job.title || job.role || 'Untitled role',
    company: job.company || job.companyName || 'Company',
    location: job.location || job.city || 'Remote / India',
    salary: job.salary || job.salaryRange || '',
    url: job.url || job.applyLink || job.link || '#'
  };
}

function readLocalSavedJobs() {
  const merged = [];
  const seen = new Set();

  SAVED_JOB_KEYS.forEach((key) => {
    try {
      const raw = localStorage.getItem(key);
      if (!raw) return;
      const parsed = JSON.parse(raw);
      const jobs = Array.isArray(parsed) ? parsed : Array.isArray(parsed.jobs) ? parsed.jobs : [];
      jobs.map(normalizeJob).forEach((job) => {
        if (seen.has(job.jobId)) return;
        seen.add(job.jobId);
        merged.push(job);
      });
    } catch {
      // Ignore malformed local saved jobs.
    }
  });

  return merged;
}

function writeLocalSavedJobs(jobs) {
  const normalized = jobs.map(normalizeJob);
  localStorage.setItem('careerOSSavedJobs', JSON.stringify(normalized));
  localStorage.setItem('savedJobs', JSON.stringify(normalized));
}

async function fetchSavedJobsFromApi(token) {
  if (!token) return null;
  const isLocalHost = ['localhost', '127.0.0.1', '::1'].includes(window.location.hostname);
  const endpoints = isLocalHost
    ? ['http://localhost:5000/api/saved-jobs', '/api/saved-jobs']
    : ['/api/saved-jobs'];

  for (const endpoint of endpoints) {
    try {
      const response = await fetch(endpoint, {
        headers: { Authorization: `Bearer ${token}` },
        cache: 'no-store'
      });
      if (!response.ok) continue;
      const data = await response.json();
      if (Array.isArray(data.jobs)) return data.jobs.map(normalizeJob);
      if (Array.isArray(data)) return data.map(normalizeJob);
    } catch (error) {
      console.warn('Saved jobs API unavailable:', endpoint, error.message || error);
    }
  }

  return null;
}

function emptyState(message) {
  return `
    <div class="saved-job-card" style="text-align:center;">
      <div class="saved-job-title">${escapeHtml(message)}</div>
      <div class="saved-job-meta">Save roles from the jobs page and they will appear here instantly.</div>
    </div>
  `;
}

async function loadDashboardSavedJobs() {
  const container = document.getElementById('dashboardSavedJobsContainer');
  if (!container) {
    setTimeout(loadDashboardSavedJobs, 500);
    return;
  }

  if (!isSessionAvailable()) {
    container.innerHTML = emptyState('No saved jobs yet.');
    return;
  }

  const token = getToken();
  let jobs = await fetchSavedJobsFromApi(token);
  if (!jobs) jobs = readLocalSavedJobs();

  if (!Array.isArray(jobs) || jobs.length === 0) {
    container.innerHTML = emptyState('No saved jobs yet.');
    return;
  }

  writeLocalSavedJobs(jobs);

  container.innerHTML = jobs
    .map(
      (job) => `
      <div class="saved-job-card" data-id="${escapeHtml(job.jobId)}">
        <div class="saved-job-main">
          <div class="saved-job-text">
            <div class="saved-job-title">${escapeHtml(job.title)}</div>
            <div class="saved-job-meta">${escapeHtml(job.company)} • ${escapeHtml(job.location)}${job.salary ? ` • ${escapeHtml(job.salary)}` : ''}</div>
          </div>
          <div class="saved-job-actions">
            <a href="${escapeHtml(job.url)}" target="_blank" rel="noopener" class="btn btn-view-job">View</a>
            <button class="btn btn-remove-job" data-id="${escapeHtml(job.jobId)}">Remove</button>
          </div>
        </div>
      </div>
    `
    )
    .join('');

  attachRemoveListeners();
}

function removeLocalJob(jobId) {
  const jobs = readLocalSavedJobs().filter((job) => job.jobId !== jobId);
  writeLocalSavedJobs(jobs);
  return jobs;
}

async function deleteSavedJobFromApi(jobId, token) {
  if (!token) return false;
  const isLocalHost = ['localhost', '127.0.0.1', '::1'].includes(window.location.hostname);
  const endpoints = isLocalHost
    ? ['http://localhost:5000/api/saved-jobs', '/api/saved-jobs']
    : ['/api/saved-jobs'];

  for (const endpoint of endpoints) {
    try {
      const response = await fetch(endpoint, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ jobId })
      });
      if (response.ok) return true;
    } catch {
      // Try the next endpoint, then fall back to local removal.
    }
  }
  return false;
}

function attachRemoveListeners() {
  const container = document.getElementById('dashboardSavedJobsContainer');
  if (!container) return;

  const newContainer = container.cloneNode(true);
  container.parentNode.replaceChild(newContainer, container);

  newContainer.addEventListener('click', async (e) => {
    const button = e.target.closest('.btn-remove-job');
    if (!button) return;

    const jobId = button.getAttribute('data-id');
    const token = getToken();
    await deleteSavedJobFromApi(jobId, token);
    const remaining = removeLocalJob(jobId);

    const card = button.closest('.saved-job-card');
    if (card) {
      card.style.opacity = '0';
      card.style.transform = 'translateY(-10px)';
      setTimeout(() => {
        card.remove();
        if (remaining.length === 0) {
          const updatedContainer = document.getElementById('dashboardSavedJobsContainer');
          if (updatedContainer) updatedContainer.innerHTML = emptyState('No saved jobs yet.');
        }
      }, 250);
    }
  });
}

document.addEventListener('DOMContentLoaded', () => {
  loadDashboardSavedJobs();

  const savedJobsView = document.getElementById('view-saved-jobs');
  if (savedJobsView) {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
          const isVisible = !savedJobsView.classList.contains('hidden');
          if (isVisible) loadDashboardSavedJobs();
        }
      });
    });

    observer.observe(savedJobsView, {
      attributes: true,
      attributeFilter: ['class']
    });
  }

  window.addEventListener('hashchange', () => {
    const container = document.getElementById('dashboardSavedJobsContainer');
    if (container && container.closest('#view-saved-jobs') && !container.closest('#view-saved-jobs').classList.contains('hidden')) {
      loadDashboardSavedJobs();
    }
  });
});

if (typeof window !== 'undefined') {
  window.refreshDashboardSavedJobs = loadDashboardSavedJobs;
}

function escapeHtml(text) {
  if (!text) return '';
  const div = document.createElement('div');
  div.textContent = String(text);
  return div.innerHTML;
}
