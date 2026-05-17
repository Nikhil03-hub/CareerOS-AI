/**
 * Jobs Save Functionality
 * Handles saving/unsaving jobs with JWT authentication
 */

(function () {
  'use strict';

  const API_BASE_URL = 'http://localhost:5000/api';

  /**
   * Get JWT token from localStorage
   * PRIMARY KEY: jc_token (set by Google auth via global-auth.js)
   * Fallbacks: jwt, authToken, token (for backward compatibility)
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

  function readLocalSavedJobs() {
    for (const key of ['careerOSSavedJobs', 'savedJobs', 'domainx_saved_jobs', 'jc_saved_jobs']) {
      try {
        const raw = localStorage.getItem(key);
        if (!raw) continue;
        const parsed = JSON.parse(raw);
        const jobs = Array.isArray(parsed) ? parsed : Array.isArray(parsed.jobs) ? parsed.jobs : [];
        if (jobs.length) return jobs;
      } catch {
        // Try next key.
      }
    }
    return [];
  }

  function writeLocalSavedJobs(jobs) {
    localStorage.setItem('careerOSSavedJobs', JSON.stringify(jobs));
    localStorage.setItem('savedJobs', JSON.stringify(jobs));
  }

  function saveJobLocally(jobData) {
    const jobId = getJobId(jobData);
    const savedJobs = readLocalSavedJobs();
    if (!savedJobs.some((job) => getJobId(job) === jobId || job.jobId === jobId)) {
      savedJobs.push({ ...jobData, jobId, savedAt: new Date().toISOString(), source: jobData.source || 'career-os-local' });
      writeLocalSavedJobs(savedJobs);
    }
    return true;
  }

  function unsaveJobLocally(jobId) {
    const savedJobs = readLocalSavedJobs().filter((job) => getJobId(job) !== jobId && job.jobId !== jobId);
    writeLocalSavedJobs(savedJobs);
    return true;
  }

  /**
   * Check if user is authenticated
   */
  function isAuthenticated() {
    return !!getToken() || !!getSessionUser();
  }

  /**
   * Show login prompt
   */
  function showLoginPrompt() {
    if (confirm('Please login to save jobs. Would you like to login with Google now?')) {
      window.location.href = 'http://localhost:8000/auth/google';
    }
  }

  /**
   * Save a job
   */
  async function saveJob(jobData) {
    const token = getToken();

    if (!token) {
      return getSessionUser() ? saveJobLocally(jobData) : (showLoginPrompt(), false);
    }

    try {
      // Ensure job data has all required fields
      const jobToSave = {
        title: jobData.title || 'N/A',
        company: jobData.company || 'N/A',
        location: jobData.location || 'N/A',
        salary: jobData.salary || '',
        jobType: jobData.jobType || jobData.type || 'Full-time',
        url: jobData.url || jobData.applyLink || jobData.link || '#',
        source: 'jooble'
      };

      const response = await fetch(`${API_BASE_URL}/saved-jobs`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ job: jobToSave }),
      });

      if (response.status === 401) {
        // Session expired or not logged in
        alert('Session expired or not logged in. Please login again.');
        localStorage.removeItem('jc_token');
        localStorage.removeItem('jwt');
        localStorage.removeItem('authToken');
        localStorage.removeItem('token');
        return false;
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('Save job failed:', errorData);
        return false;
      }

      const result = await response.json();
      return result.success && result.saved;
    } catch (error) {
      console.error('Error saving job:', error);
      return saveJobLocally(jobData);
    }
  }

  /**
   * Unsave a job
   */
  async function unsaveJob(jobId) {
    const token = getToken();
    if (!token) return unsaveJobLocally(jobId);

    try {
      const response = await fetch(`${API_BASE_URL}/saved-jobs`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ jobId }),
      });

      const result = await response.json();
      // backend returns { success:true, saved:false } on unsave
      return result.success && !result.saved;
    } catch (error) {
      console.error('Error unsaving job:', error);
      return unsaveJobLocally(jobId);
    }
  }

  /**
   * Get all saved jobs for current user
   */
  async function getSavedJobs() {
    const token = getToken();
    if (!token) return readLocalSavedJobs();

    try {
      const response = await fetch(`${API_BASE_URL}/saved-jobs`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 401) {
        return [];
      }

      const result = await response.json();
      return result.success ? result.jobs : [];
    } catch (error) {
      console.error('Error fetching saved jobs:', error);
      return readLocalSavedJobs();
    }
  }

  /**
   * Build unique jobId - MUST match backend logic exactly
   */
  function getJobId(jobData) {
    // Backend uses: job.url || job.jobId || `${job.title}|${job.company}|${job.location}`
    // But job.url might be '#' from Jooble, so we need to check if it's a valid URL
    const url = jobData.url || jobData.applyLink || jobData.link;
    const validUrl = url && url !== '#' && url.startsWith('http');

    if (validUrl) {
      return url;
    }

    if (jobData.jobId) {
      return jobData.jobId;
    }

    // Fallback to title+company+location (must match backend exactly)
    return `${jobData.title}|${jobData.company}|${jobData.location}`;
  }

  /**
   * Update save button UI
   */
  function updateSaveButton(button, isSaved) {
    if (!button) {
      console.error('updateSaveButton: button is null');
      return;
    }

    const icon = button.querySelector('i');

    if (isSaved) {
      button.classList.add('saved');
      // Update icon to filled bookmark
      if (icon) {
        icon.className = 'ri-bookmark-fill';
      } else {
        // Create icon if it doesn't exist
        const newIcon = document.createElement('i');
        newIcon.className = 'ri-bookmark-fill';
        button.insertBefore(newIcon, button.firstChild);
      }

      // Update text - replace "Save" with "Saved"
      // The button structure is: <i></i> Save
      const textNodes = Array.from(button.childNodes).filter(node => node.nodeType === Node.TEXT_NODE);
      textNodes.forEach(node => {
        const text = node.textContent.trim();
        if (text === 'Save' || text.includes('Save')) {
          node.textContent = ' Saved';
        }
      });

      // If no text node with "Save" found, add "Saved" after icon
      if (!textNodes.some(n => n.textContent.includes('Saved'))) {
        // Remove any existing "Save" text
        textNodes.forEach(n => n.remove());
        // Add "Saved" text after icon
        const iconEl = button.querySelector('i');
        if (iconEl && iconEl.nextSibling) {
          iconEl.nextSibling.textContent = ' Saved';
        } else {
          button.appendChild(document.createTextNode(' Saved'));
        }
      }
    } else {
      button.classList.remove('saved');
      // Update icon to outline bookmark
      if (icon) {
        icon.className = 'ri-bookmark-line';
      } else {
        // Create icon if it doesn't exist
        const newIcon = document.createElement('i');
        newIcon.className = 'ri-bookmark-line';
        button.insertBefore(newIcon, button.firstChild);
      }

      // Update text - replace "Saved" with "Save"
      const textNodes = Array.from(button.childNodes).filter(node => node.nodeType === Node.TEXT_NODE);
      textNodes.forEach(node => {
        const text = node.textContent.trim();
        if (text === 'Saved' || text.includes('Saved')) {
          node.textContent = ' Save';
        }
      });

      // If no text node with "Save" found, add "Save" after icon
      if (!textNodes.some(n => n.textContent.includes('Save'))) {
        // Remove any existing "Saved" text
        textNodes.forEach(n => n.remove());
        // Add "Save" text after icon
        const iconEl = button.querySelector('i');
        if (iconEl && iconEl.nextSibling) {
          iconEl.nextSibling.textContent = ' Save';
        } else {
          button.appendChild(document.createTextNode(' Save'));
        }
      }
    }
  }

  /**
   * Mark saved jobs on page load
   */
  async function markSavedJobs() {
    if (!isAuthenticated()) {
      console.log('Not authenticated, skipping markSavedJobs');
      return;
    }

    console.log('Marking saved jobs...');
    const savedJobs = await getSavedJobs();
    console.log('Found saved jobs:', savedJobs.length);

    if (savedJobs.length === 0) {
      console.log('No saved jobs to mark');
      return;
    }

    const savedJobIds = new Set(savedJobs.map((job) => job.jobId));
    console.log('Saved job IDs:', Array.from(savedJobIds));

    const buttons = document.querySelectorAll('.save-btn, .save-job-btn');
    console.log('Found buttons:', buttons.length);

    let markedCount = 0;
    buttons.forEach((button) => {
      try {
        const jobDataStr = button.getAttribute('data-job');
        if (!jobDataStr) {
          console.warn('Button missing data-job attribute');
          return;
        }

        const jobData = JSON.parse(jobDataStr);
        const jobId = getJobId(jobData);
        console.log('Checking job:', jobData.title, 'ID:', jobId, 'Saved:', savedJobIds.has(jobId));

        if (savedJobIds.has(jobId)) {
          updateSaveButton(button, true);
          markedCount++;
        }
      } catch (e) {
        console.error('Error parsing job data:', e);
      }
    });

    console.log('Marked', markedCount, 'jobs as saved');
  }

  /**
   * Initialize save button click handler
   */
  function initSaveButtons() {
    document.addEventListener('click', async (e) => {
      const button = e.target.closest('.save-btn, .save-job-btn');
      if (!button) return;

      e.preventDefault();
      e.stopPropagation();

      const token = getToken();
      if (!token && !getSessionUser()) {
        console.warn('No token found when clicking save button');
        showLoginPrompt();
        return;
      }

      console.log('Save button clicked, token exists:', !!token);

      try {
        const jobDataStr = button.getAttribute('data-job');
        if (!jobDataStr) {
          console.error('No job data found on button');
          return;
        }

        const jobData = JSON.parse(jobDataStr);
        const jobId = getJobId(jobData);
        const isCurrentlySaved = button.classList.contains('saved');

        if (isCurrentlySaved) {
          const success = await unsaveJob(jobId);
          if (success) {
            updateSaveButton(button, false);
            button.style.transform = 'scale(0.95)';
            setTimeout(() => {
              button.style.transform = '';
            }, 200);
          }
        } else {
          // Save the job
          console.log('Attempting to save job:', jobData.title);
          const success = await saveJob(jobData);
          console.log('Save result:', success);

          if (success) {
            updateSaveButton(button, true);
            button.style.transform = 'scale(1.05)';
            setTimeout(() => {
              button.style.transform = '';
            }, 200);
            console.log('Button updated to Saved state');
          } else {
            console.error('Failed to save job');
            alert('Failed to save job. Please try again.');
          }
        }
      } catch (error) {
        console.error('Error handling save button click:', error);
      }
    });
  }

  /**
   * Initialize
   */
  function init() {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => {
        initSaveButtons();
        markSavedJobs();
      });
    } else {
      initSaveButtons();
      markSavedJobs();
    }
  }

  init();
})();
