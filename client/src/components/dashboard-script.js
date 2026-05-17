document.addEventListener('DOMContentLoaded', () => {
    // Register ScrollTrigger
    // Register ScrollTrigger and ScrollSmoother (if available)
    gsap.registerPlugin(ScrollTrigger);
    if (window.ScrollSmoother) {
        gsap.registerPlugin(ScrollSmoother);
        ScrollSmoother.create({
            wrapper: "#wrapper",
            content: "#content",
            smooth: 1.5,
            effects: true
        });
    }

    // Main Hero Timeline (Initially Paused)
    const mainTl = gsap.timeline({
        paused: true,
        defaults: { ease: "power4.out", duration: 1.5 }
    });

    mainTl.to('#navbar', { opacity: 1, duration: 1, ease: "power2.out" }, 0)
        .fromTo('.hero-title',
            { y: 100, opacity: 0, filter: 'blur(10px)' },
            { y: 0, opacity: 1, filter: 'blur(0px)' }
        )
        .fromTo('.hero-subtitle',
            { y: 50, opacity: 0, filter: 'blur(5px)' },
            { y: 0, opacity: 1, filter: 'blur(0px)', duration: 1.2 },
            '-=1.2'
        )
        .fromTo('.hero-btn',
            { scale: 0.5, opacity: 0, y: 20 },
            { scale: 1, opacity: 1, y: 0, ease: "elastic.out(1, 0.5)", duration: 1.5 },
            '-=1.0'
        );

    // Preloader Timeline
    const introTl = gsap.timeline({
        onComplete: () => {
            gsap.set('#preloader', { display: 'none' });
            mainTl.play(); // Start main animation after intro
        }
    });

    introTl
        .to('.preloader-char', {
            y: 0,
            opacity: 1,
            filter: 'blur(0px)',
            duration: 0.8,
            stagger: 0.05,
            ease: "power3.out"
        })
        .to('.preloader-char', {
            y: -100,
            opacity: 0,
            filter: 'blur(0px)',
            duration: 0.5,
            stagger: 0.03,
            ease: "power3.in"
        }, "+=0.8")
        .to('#preloader', {
            yPercent: -100,
            opacity: 0, // Fade out while sliding up to prevent artifacts
            duration: 0.8,
            ease: "power4.inOut"
        });

    // Dashboard 3D Entrance & Scroll Effect
    gsap.set('.dashboard-container', {
        rotateX: 15,
        y: 100,
        opacity: 0,
        scale: 0.9,
        transformOrigin: "center top"
    });

    mainTl.to('.dashboard-container', {
        opacity: 1,
        duration: 1.5,
        ease: "power3.out"
    }, '-=1.0');

    gsap.to('.dashboard-container', {
        scrollTrigger: {
            trigger: 'body',
            start: "top top",
            end: "1000px top",
            scrub: 1
        },
        rotateX: 0,
        y: 0,
        scale: 1,
        ease: "none"
    });

    // Features Section Animation
    gsap.fromTo('.features-section',
        { y: 100, opacity: 0 },
        {
            y: 0,
            opacity: 1,
            duration: 1.2,
            ease: 'power3.out',
            scrollTrigger: {
                trigger: '.features-section',
                start: 'top 80%',
                end: 'top 50%',
                scrub: false
            }
        }
    );

    // Error Bubbles Animation
    const bubblesTl = gsap.timeline({
        scrollTrigger: {
            trigger: '.error-bubbles-section',
            start: 'top top',
            end: '+=2000', // Scroll distance to complete animation
            pin: true,      // Pin the section while animating
            scrub: 1,       // Smooth scrubbing linked to scroll
            toggleActions: 'play none none reverse'
        }
    });

    // Animate Bubbles sequentially with Jitter/Jerk Effect
    const bubbles = document.querySelectorAll('.error-bubble');
    bubbles.forEach((bubble, index) => {
        // Random float delay for natural feel
        const floatDelay = Math.random() * 2;

        // Jitter/Jerk Entrance
        bubblesTl.fromTo(bubble,
            { scale: 0.8, opacity: 0, rotation: Math.random() * 10 - 5 },
            {
                scale: 1,
                opacity: 1,
                rotation: 0,
                duration: 0.5,
                ease: 'elastic.out(2.5, 0.1)' // High tension elastic for "jerk" effect
            },
            index * 1.5
        );

        // Icon Pop
        const icon = bubble.querySelector('.bubble-icon');
        bubblesTl.to(icon, {
            scale: 1.2,
            duration: 0.2,
            ease: 'power2.out'
        }, `>-0.4`)
            .to(icon, {
                scale: 1,
                duration: 0.2,
                ease: 'power2.in'
            });

        // Continuous Float Animation
        gsap.to(bubble, {
            y: '-=10',
            duration: 2 + Math.random(),
            repeat: -1,
            yoyo: true,
            ease: 'sine.inOut',
            delay: floatDelay
        });
    });

    // Parallax Effects
    gsap.to('.hero-section', {
        scrollTrigger: {
            trigger: 'body',
            start: 'top top',
            end: 'bottom top',
            scrub: true
        },
        y: 100,
        opacity: 0
    });

    // Navbar Scroll Effect
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('py-2');
            navbar.classList.remove('py-4');
        } else {
            navbar.classList.add('py-4');
            navbar.classList.remove('py-2');
        }
    });

    // Video Background Enhancements
    const bgVideo = document.getElementById('bg-wave');
    const bgWrapper = document.getElementById('bg-video-wrapper');

    // Pause on low power / low memory
    if (navigator.deviceMemory && navigator.deviceMemory < 2) {
        bgVideo.pause();
    }

    // Visibility Change Handler
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            bgVideo.pause();
        } else {
            bgVideo.play().catch(() => { }); // Catch autoplay errors
        }
    });

    // Subtle Parallax on Mouse Move
    document.addEventListener('mousemove', (e) => {
        const x = (e.clientX / window.innerWidth - 0.5) * 20;
        const y = (e.clientY / window.innerHeight - 0.5) * 20;

        gsap.to(bgWrapper, {
            x: x,
            y: y,
            duration: 1.5,
            ease: 'power2.out'
        });
    });

    // Text Swap Animation (Fast & Smooth)
    let items = gsap.utils.toArray(".swap");
    let index = 0;

    function showNext() {
        gsap.to(items[index], {
            opacity: 0,
            y: -20,
            duration: 0.4,
            ease: "power2.out"
        });

        index = (index + 1) % items.length;

        gsap.fromTo(items[index],
            { opacity: 0, y: 20 },
            { opacity: 1, y: 0, duration: 0.45, ease: "power3.out" }
        );
    }

    // Initialize first item
    gsap.to(items[0], {
        opacity: 1,
        y: 0,
        duration: 0.5,
        ease: "power3.out"
    });

    // Start loop
    setInterval(showNext, 1200);
    // Everything You Need Section Animations

    // 1. Floating Calendar Bubbles
    gsap.to('.calendar-bubble', {
        y: -8,
        duration: 3,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        stagger: {
            each: 1,
            from: "random"
        }
    });

    // 2. Staggered Reveal for Step Cards
    gsap.from('.step-card', {
        scrollTrigger: {
            trigger: '#everything-section',
            start: "top 70%",
            toggleActions: "play none none reverse"
        },
        y: 50,
        opacity: 0,
        duration: 0.8,
        stagger: 0.2,
        ease: "power3.out"
    });

    // 3. Metric Number Count & Scale Punch
    const counterVal = document.querySelector('.counter-value');
    if (counterVal) {
        ScrollTrigger.create({
            trigger: '.metric-number',
            start: "top 85%",
            once: true,
            onEnter: () => {
                // 1. Count up with a "scramble" feel or just smooth fast count
                gsap.to(counterVal, {
                    innerText: 87,
                    duration: 2.5,
                    snap: { innerText: 1 },
                    ease: "power4.out" // Fast start, very slow smooth end
                });

                // 2. Scale Punch & Blur Clear
                gsap.fromTo(counterVal,
                    { scale: 0.5, filter: "blur(10px)", opacity: 0 },
                    {
                        scale: 1,
                        filter: "blur(0px)",
                        opacity: 1,
                        duration: 1.5,
                        ease: "elastic.out(1, 0.5)"
                    }
                );
            }
        });
    }

    // 4. Floating Tags Animation (Random Loop)
    const tags = document.querySelectorAll('.floating-tag');
    tags.forEach(tag => {
        gsap.to(tag, {
            x: "random(-20, 20)",
            y: "random(-20, 20)",
            rotation: "random(-10, 10)",
            duration: "random(3, 5)",
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut"
        });
    });

    // Section Fade In
    gsap.from('#everything-section', {
        scrollTrigger: {
            trigger: '#everything-section',
            start: "top 80%"
        },
        opacity: 0,
        y: 50,
        duration: 1,
        ease: "power3.out"
    });
    // Resume Checker Section Animations

    // 1. Heading Fade In + Slide Up
    gsap.to('.resume-heading', {
        scrollTrigger: {
            trigger: '#section-upload-resume',
            start: "top 70%",
            toggleActions: "play none none reverse"
        },
        y: 0,
        opacity: 1,
        duration: 1,
        ease: "power3.out"
    });

    // 2. Subheading Slide from Right
    gsap.to('.resume-subheading', {
        scrollTrigger: {
            trigger: '#section-upload-resume',
            start: "top 70%",
            toggleActions: "play none none reverse"
        },
        x: 0,
        opacity: 1,
        duration: 1,
        delay: 0.2,
        ease: "power3.out"
    });

    // 3. Upload Box Scale Up Pop
    gsap.to('.resume-upload-box', {
        scrollTrigger: {
            trigger: '#section-upload-resume',
            start: "top 60%",
            toggleActions: "play none none reverse"
        },
        scale: 1,
        opacity: 1,
        duration: 0.8,
        delay: 0.4,
        ease: "back.out(1.5)"
    });

    // 4. Button Bounce Entrance
    gsap.from('.resume-scan-btn', {
        scrollTrigger: {
            trigger: '.resume-upload-box',
            start: "top 60%",
            toggleActions: "play none none reverse"
        },
        y: 20,
        opacity: 0,
        duration: 0.8,
        delay: 0.8,
        ease: "elastic.out(1, 0.5)"
    });

    // File Upload Interaction
    const fileInput = document.getElementById('resume-input');
    const uploadBtn = document.getElementById('upload-resume-btn');
    const viewResumeBtn = document.getElementById('view-resume-btn');
    const uploadBox = document.querySelector('.resume-upload-box');

    if (fileInput && uploadBox && uploadBtn) {
        // Drag over effect
        uploadBox.addEventListener('dragover', (e) => {
            e.preventDefault();
            uploadBox.classList.add('border-blue-500', 'bg-blue-50/50');
        });

        uploadBox.addEventListener('dragleave', (e) => {
            e.preventDefault();
            uploadBox.classList.remove('border-blue-500', 'bg-blue-50/50');
        });

        uploadBox.addEventListener('drop', (e) => {
            e.preventDefault();
            uploadBox.classList.remove('border-blue-500', 'bg-blue-50/50');
            const files = e.dataTransfer.files;
            if (files.length > 0) {
                fileInput.files = files; // Set input files
                handleFile(files[0]);
            }
        });

        // File select
        fileInput.addEventListener('change', (e) => {
            if (e.target.files.length > 0) {
                handleFile(e.target.files[0]);
            }
        });

        // Upload Button Click
        uploadBtn.addEventListener('click', async (e) => {
            e.preventDefault();
            if (fileInput.files.length === 0) {
                showToast('Please select a file first.', 'error');
                return;
            }

            const file = fileInput.files[0];
            const token = localStorage.getItem('authToken');

            if (!token) {
                showToast('Please login to upload resume.', 'error');
                return;
            }

            const formData = new FormData();
            formData.append('resume', file);

            // UI Feedback
            const btnSpan = uploadBtn.querySelector('span');
            const originalText = btnSpan.textContent;
            btnSpan.textContent = 'Uploading...';
            uploadBtn.disabled = true;

            try {
                const res = await fetch('http://localhost:5001/api/resume/upload', {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    },
                    body: formData
                });

                const data = await res.json();

                if (res.ok && data.success) {
                    showToast('Resume uploaded successfully!');
                    btnSpan.textContent = 'Upload Complete';

                    // Get resumeId from response
                    const resumeId = data.resumeId;

                    if (resumeId) {
                        // Show result panel immediately
                        showResultPanel();

                        // Show processing state
                        showProcessingState();

                        // Start polling for results
                        pollResumeResult(resumeId, token);
                    }
                } else {
                    showToast(data.message || 'Upload failed', 'error');
                    btnSpan.textContent = originalText;
                    uploadBtn.disabled = false;
                }
            } catch (error) {
                console.error('Upload error:', error);
                showToast('An error occurred during upload.', 'error');
                btnSpan.textContent = originalText;
                uploadBtn.disabled = false;
            }
        });

        function handleFile(file) {
            console.log("File selected:", file.name);
            const btnSpan = uploadBtn.querySelector('span');
            if (btnSpan) btnSpan.textContent = `Selected: ${file.name}`;
        }
    }

    // Polling function to check resume processing status
    function pollResumeResult(resumeId, token) {
        const pollInterval = 2000; // 2 seconds
        const maxAttempts = 60; // 2 minutes max
        let attempts = 0;

        const intervalId = setInterval(async () => {
            attempts++;

            try {
                const res = await fetch(`http://localhost:5001/api/resume/result/${resumeId}`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                // Handle authentication errors
                if (res.status === 401 || res.status === 403) {
                    clearInterval(intervalId);
                    showProcessingState(false);
                    showErrorInPanel('Authentication failed. Please login again.');
                    showToast('Session expired. Please login again.', 'error');
                    return;
                }

                const data = await res.json();

                if (res.ok && data.success) {
                    const status = data.status;

                    if (status === 'completed') {
                        // Stop polling
                        clearInterval(intervalId);

                        // Display results
                        displayResults(data.data);
                        showToast('Resume analysis complete!', 'success');
                    } else if (status === 'failed') {
                        // Stop polling
                        clearInterval(intervalId);

                        // Show error in panel and toast
                        showProcessingState(false);
                        const errorMsg = data.error || 'Resume processing failed';
                        showErrorInPanel(errorMsg);
                        showToast(errorMsg, 'error');
                    }
                    // If still processing, continue polling
                } else {
                    // API returned error
                    if (!res.ok) {
                        clearInterval(intervalId);
                        showProcessingState(false);
                        showErrorInPanel('Failed to fetch results. Please try again.');
                        showToast('API error occurred', 'error');
                    }
                }

                // Stop after max attempts
                if (attempts >= maxAttempts) {
                    clearInterval(intervalId);
                    showProcessingState(false);
                    showErrorInPanel('Processing is taking longer than expected. Please refresh and check status.');
                    showToast('Processing timeout. Please check back later.', 'error');
                }
            } catch (error) {
                // Network error or server unreachable
                console.error('Polling request error:', error);

                // Only stop polling after several consecutive errors
                if (attempts >= 3) {
                    clearInterval(intervalId);
                    showProcessingState(false);
                    showErrorInPanel('Cannot reach server. Please check your connection and try again.');
                    showToast('Server unreachable. Please check your connection.', 'error');
                }
            }
        }, pollInterval);
    }

    // Show error message in result panel
    function showErrorInPanel(message) {
        const panel = document.getElementById('resumeResultPanel');
        const processingState = document.getElementById('processingState');

        if (panel && processingState) {
            // Clear processing state and show error
            processingState.innerHTML = `
                <div class="text-center py-12">
                    <div class="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <i class="fa-solid fa-exclamation-triangle text-3xl text-red-600"></i>
                    </div>
                    <p class="text-lg font-medium text-slate-700 mb-2">❌ Processing Failed</p>
                    <p class="text-sm text-slate-600 max-w-md mx-auto">${message}</p>
                    <button onclick="location.reload()" class="mt-6 px-6 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-all">
                        Try Again
                    </button>
                </div>
            `;
            processingState.style.display = 'block';
        }
    }

    // Show result panel
    function showResultPanel() {
        const panel = document.getElementById('resumeResultPanel');
        if (panel) {
            panel.style.display = 'block';

            // Smooth scroll to panel
            setTimeout(() => {
                panel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }, 300);
        }
    }

    // Show/hide processing state
    function showProcessingState(show = true) {
        const processingState = document.getElementById('processingState');
        const completedState = document.getElementById('completedState');

        if (processingState && completedState) {
            if (show) {
                processingState.style.display = 'block';
                completedState.style.display = 'none';
            } else {
                processingState.style.display = 'none';
            }
        }
    }

    // Display results in UI
    function displayResults(result) {
        // Hide processing state
        showProcessingState(false);

        // Show completed state
        const completedState = document.getElementById('completedState');
        if (completedState) {
            completedState.style.display = 'block';
        }

        // Populate ATS Score
        const atsScoreEl = document.getElementById('atsScoreValue');
        if (atsScoreEl && result.atsScore !== undefined) {
            atsScoreEl.textContent = result.atsScore;

            // Animate score
            gsap.from(atsScoreEl, {
                innerText: 0,
                duration: 2,
                snap: { innerText: 1 },
                ease: "power2.out"
            });
        }

        // Populate Skills
        const skillsList = document.getElementById('extractedSkillList');
        if (skillsList && result.skills) {
            skillsList.innerHTML = '';
            result.skills.forEach((skill) => {
                const li = document.createElement('span');
                li.className = 'px-3 py-1.5 bg-green-100 text-green-700 rounded-lg text-sm font-medium border border-green-200';
                li.textContent = skill;
                skillsList.appendChild(li);
            });

            // Stagger animation
            gsap.from(skillsList.children, {
                opacity: 0,
                y: 10,
                duration: 0.5,
                stagger: 0.05,
                ease: "power2.out"
            });
        }

        // Populate Missing Skills
        const missingSkillsList = document.getElementById('missingSkillList');
        if (missingSkillsList && result.missingSkills) {
            missingSkillsList.innerHTML = '';

            if (result.missingSkills.length === 0) {
                const emptyMsg = document.createElement('span');
                emptyMsg.className = 'text-sm text-slate-500 italic';
                emptyMsg.textContent = 'No missing skills detected!';
                missingSkillsList.appendChild(emptyMsg);
            } else {
                result.missingSkills.forEach((skill) => {
                    const li = document.createElement('span');
                    li.className = 'px-3 py-1.5 bg-amber-100 text-amber-700 rounded-lg text-sm font-medium border border-amber-200';
                    li.textContent = skill;
                    missingSkillsList.appendChild(li);
                });

                // Stagger animation
                gsap.from(missingSkillsList.children, {
                    opacity: 0,
                    y: 10,
                    duration: 0.5,
                    stagger: 0.05,
                    ease: "power2.out"
                });
            }
        }

        // Populate Scoring Breakdown
        if (result.scoringBreakdown) {
            const breakdown = result.scoringBreakdown;

            const skillScoreEl = document.getElementById('skillScoreValue');
            const experienceScoreEl = document.getElementById('experienceScoreValue');
            const educationScoreEl = document.getElementById('educationScoreValue');
            const formatScoreEl = document.getElementById('formatScoreValue');

            if (skillScoreEl) skillScoreEl.textContent = breakdown.skillScore || 0;
            if (experienceScoreEl) experienceScoreEl.textContent = breakdown.experienceScore || 0;
            if (educationScoreEl) educationScoreEl.textContent = breakdown.educationScore || 0;
            if (formatScoreEl) formatScoreEl.textContent = breakdown.formatScore || 0;

            // Animate breakdown scores
            const breakdownEls = [skillScoreEl, experienceScoreEl, educationScoreEl, formatScoreEl];
            gsap.from(breakdownEls, {
                scale: 0.5,
                opacity: 0,
                duration: 0.8,
                stagger: 0.1,
                ease: "back.out(1.5)"
            });
        }
    }



    // 5. Machine Animations

    // Gauge Needle Movement
    gsap.to('.gauge-needle', {
        rotation: 45,
        duration: 2,
        repeat: -1,
        yoyo: true,
        ease: "power1.inOut"
    });

    // Waveform Oscillation (Simple Scale Y)
    gsap.to('.waveform-line', {
        scaleY: 5,
        duration: 0.2,
        repeat: -1,
        yoyo: true,
        ease: "rough({ template: none.out, strength: 1, points: 20, taper: 'none', randomize: true, clamp: false})"
    });

    // Status Lights Blinking
    gsap.to('.status-dot', {
        backgroundColor: "#22c55e",
        duration: 0.5,
        stagger: 0.2,
        repeat: -1,
        yoyo: true,
        ease: "steps(1)"
    });

    // Scanner Beam Animation
    const scannerBeam = document.querySelector('.scanner-beam');
    if (scannerBeam) {
        gsap.set(scannerBeam, { display: 'block', top: '10px', opacity: 0 });

        const scanTl = gsap.timeline({ repeat: -1, repeatDelay: 1 });
        scanTl.to(scannerBeam, { opacity: 1, duration: 0.2 })
            .to(scannerBeam, { top: '300px', duration: 2, ease: "linear" })
            .to(scannerBeam, { opacity: 0, duration: 0.2 });
    }

    // Machine Entrance
    gsap.from('.machine-body', {
        scrollTrigger: {
            trigger: '#section-upload-resume',
            start: "top 60%"
        },
        x: -50,
        opacity: 0,
        duration: 1,
        ease: "power3.out"
    });

    gsap.from('.resume-doc', {
        scrollTrigger: {
            trigger: '#section-upload-resume',
            start: "top 60%"
        },
        x: 50,
        opacity: 0,
        duration: 1,
        delay: 0.3,
        ease: "power3.out"
    });
    // 6. Pricing Section Animations & Logic

    // Toggle Switch Logic
    const monthlyBtn = document.getElementById('monthly-btn');
    const yearlyBtn = document.getElementById('yearly-btn');
    const toggleBg = document.getElementById('pricing-toggle-bg');

    if (monthlyBtn && yearlyBtn && toggleBg) {
        // Better Toggle Logic
        const updateToggle = (isYearly) => {
            if (isYearly) {
                toggleBg.style.transform = 'translateX(100%)';
                yearlyBtn.classList.add('text-slate-900');
                yearlyBtn.classList.remove('text-slate-500');
                monthlyBtn.classList.add('text-slate-500');
                monthlyBtn.classList.remove('text-slate-900');
            } else {
                toggleBg.style.transform = 'translateX(0)';
                monthlyBtn.classList.add('text-slate-900');
                monthlyBtn.classList.remove('text-slate-500');
                yearlyBtn.classList.add('text-slate-500');
                yearlyBtn.classList.remove('text-slate-900');
            }
        };

        monthlyBtn.addEventListener('click', () => updateToggle(false));
        yearlyBtn.addEventListener('click', () => updateToggle(true));
    }

    // Pricing Cards Staggered Reveal
    gsap.from('.pricing-card', {
        scrollTrigger: {
            trigger: '#pricing',
            start: "top 70%"
        },
        y: 50,
        opacity: 0,
        duration: 0.8,
        stagger: 0.2,
        ease: "power3.out"
    });

    // Footer Animations
    if (document.querySelector('footer')) {
        // CTA Fade Up
        gsap.from("#footer-cta", {
            scrollTrigger: {
                trigger: "#footer-cta",
                start: "top 80%",
            },
            y: 50,
            opacity: 0,
            duration: 1,
            ease: "power3.out"
        });

        // Columns Stagger
        gsap.from(".footer-col", {
            scrollTrigger: {
                trigger: "#footer-grid",
                start: "top 85%",
            },
            y: 30,
            opacity: 0,
            duration: 0.8,
            stagger: 0.1,
            ease: "power2.out"
        });

        // Big Text Parallax
        gsap.to("#footer-big-text", {
            scrollTrigger: {
                trigger: "footer",
                start: "top bottom",
                end: "bottom top",
                scrub: 1
            },
            y: -100,
            ease: "none"
        });
    }

    // Cinematic Transition for Next Section
    gsap.from(".next-section", {
        scale: 0.93,
        opacity: 0,
        y: 20,
        duration: 1.2,
        ease: "power3.out",
        scrollTrigger: {
            trigger: ".next-section",
            start: "top 80%",
            end: "top 40%",
            scrub: false,
            toggleActions: "play none none reverse"
        }
    });

    // Magnetic Button Effect
    // Magnetic Button Effect
    const magneticBtns = document.querySelectorAll('.magnetic-btn');
    magneticBtns.forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;

            gsap.to(btn, {
                x: x * 0.4,
                y: y * 0.4,
                duration: 0.3,
                ease: 'power2.out'
            });

            // Move inner text less for depth
            const span = btn.querySelector('span');
            if (span) {
                gsap.to(span, {
                    x: x * 0.1,
                    y: y * 0.1,
                    duration: 0.3,
                    ease: 'power2.out'
                });
            }
        });

        btn.addEventListener('mouseleave', () => {
            gsap.to(btn, {
                x: 0,
                y: 0,
                duration: 1,
                ease: 'elastic.out(1, 0.3)'
            });
            const span = btn.querySelector('span');
            if (span) {
                gsap.to(span, {
                    x: 0,
                    y: 0,
                    duration: 1,
                    ease: 'elastic.out(1, 0.3)'
                });
            }
        });
    });

    // Pricing Link Scroll
    const pricingLink = document.getElementById('nav-pricing');
    if (pricingLink) {
        pricingLink.addEventListener('click', (e) => {
            e.preventDefault();
            const pricingSection = document.getElementById('pricing');
            if (pricingSection) {
                pricingSection.scrollIntoView({ behavior: 'smooth' });
            }
        });
    }

    // Dashboard Link Scroll
    const dashboardLink = document.getElementById('nav-dashboard');
    if (dashboardLink) {
        dashboardLink.addEventListener('click', (e) => {
            e.preventDefault();
            const dashboardSection = document.getElementById('dashboard-section');
            if (dashboardSection) {
                dashboardSection.scrollIntoView({ behavior: 'smooth' });
            }
        });
    }

    // Problems Link Scroll
    const problemsLink = document.getElementById('nav-problems');
    if (problemsLink) {
        problemsLink.addEventListener('click', (e) => {
            e.preventDefault();
            const problemsSection = document.getElementById('problems-section');
            if (problemsSection) {
                problemsSection.scrollIntoView({ behavior: 'smooth' });
            }
        });
    }

    // Features Link Scroll
    const featuresLink = document.getElementById('nav-features');
    if (featuresLink) {
        featuresLink.addEventListener('click', (e) => {
            e.preventDefault();
            const featuresSection = document.getElementById('features-section');
            if (featuresSection) {
                featuresSection.scrollIntoView({ behavior: 'smooth' });
            }
        });
    }

    // Unified Dashboard Section Navigation
    function showSection(sectionId) {
        // Hide all dashboard sections (CSS handles visibility via .active class)
        document.querySelectorAll('.dashboard-section').forEach(el => {
            el.classList.remove('active');
        });

        // Show the selected section
        const section = document.getElementById(sectionId);
        if (section) {
            section.classList.add('active');

            // Also ensure inner view elements are visible (remove hidden class)
            // Map section IDs to their inner view IDs
            const viewMap = {
                'section-upload-resume': 'view-upload-resume',
                'section-build-resume': 'view-build-resume',
                'section-inbox': 'view-messages',
                'section-find-jobs': 'view-find-jobs',
                'section-saved-jobs': 'view-saved-jobs',
                'section-resume-history': 'view-resume-history',
                'section-career-intelligence': 'view-career-intelligence',
                'section-my-profile': 'view-profile'
            };

            const viewId = viewMap[sectionId];
            if (viewId) {
                const viewEl = document.getElementById(viewId);
                if (viewEl) {
                    viewEl.classList.remove('hidden');
                }
            }
        }

        // Update navigation active states
        const allNavs = document.querySelectorAll('[id^="nav-"], #savedJobsMenu');
        allNavs.forEach(nav => {
            if (nav) {
                nav.classList.remove('bg-blue-50', 'text-blue-700', 'font-medium');
                nav.classList.add('text-slate-600', 'hover:bg-slate-50', 'hover:text-slate-900');
            }
        });

        // Set active nav based on section
        const navMap = {
            'section-upload-resume': 'nav-upload-resume',
            'section-build-resume': 'nav-build-resume',
            'section-inbox': 'nav-inbox',
            'section-find-jobs': 'nav-find-jobs',
            'section-saved-jobs': 'savedJobsMenu',
            'section-resume-history': 'nav-resume-history',
            'section-career-intelligence': 'nav-career-intelligence',
            'section-my-profile': 'nav-profile'
        };

        const activeNavId = navMap[sectionId];
        if (activeNavId) {
            const activeNav = document.getElementById(activeNavId);
            if (activeNav) {
                activeNav.classList.remove('text-slate-600', 'hover:bg-slate-50', 'hover:text-slate-900');
                activeNav.classList.add('bg-blue-50', 'text-blue-700', 'font-medium');
            }
        }

        ScrollTrigger.refresh();

        // Trigger animations for specific sections
        if (sectionId === 'section-upload-resume') {
            animateUploadResumeSection();
        }

        // Load resume history when that section becomes active
        if (sectionId === 'section-resume-history') {
            if (typeof loadResumeHistory === 'function') {
                setTimeout(() => loadResumeHistory(), 100);
            }
        }

        if (sectionId === 'section-career-intelligence' && typeof window.initCareerIntelligence === 'function') {
            setTimeout(() => window.initCareerIntelligence(), 50);
        }
    }

    // Animation for Upload Resume section when it becomes active
    function animateUploadResumeSection() {
        // Heading Animation
        gsap.fromTo('.resume-heading',
            { y: 10, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" }
        );

        // Subheading Animation
        gsap.fromTo('.resume-subheading',
            { x: 10, opacity: 0 },
            { x: 0, opacity: 1, duration: 0.8, delay: 0.1, ease: "power3.out" }
        );

        // Upload Box Animation
        gsap.fromTo('.resume-upload-box',
            { scale: 0.95, opacity: 0 },
            { scale: 1, opacity: 1, duration: 0.6, delay: 0.2, ease: "back.out(1.5)" }
        );

        // Machine Body Animation
        gsap.fromTo('.machine-body',
            { x: -30, opacity: 0 },
            { x: 0, opacity: 1, duration: 0.8, delay: 0.3, ease: "power3.out" }
        );

        // Resume Document Animation
        gsap.fromTo('.resume-doc',
            { x: 30, opacity: 0 },
            { x: 0, opacity: 1, duration: 0.8, delay: 0.4, ease: "power3.out" }
        );

        // Button Animation
        gsap.fromTo('.resume-scan-btn',
            { y: 15, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.6, delay: 0.5, ease: "elastic.out(1, 0.5)" }
        );
    }

    // Connect all sidebar menu items
    const navUploadResume = document.getElementById('nav-upload-resume');
    const navBuildResume = document.getElementById('nav-build-resume');
    const navInbox = document.getElementById('nav-inbox');
    const navFindJobs = document.getElementById('nav-find-jobs');
    const savedJobsMenu = document.getElementById('savedJobsMenu');
    const navResumeHistory = document.getElementById('nav-resume-history');
    const navCareerIntelligence = document.getElementById('nav-career-intelligence');
    const navProfile = document.getElementById('nav-profile');

    if (navUploadResume) {
        navUploadResume.addEventListener('click', (e) => {
            e.preventDefault();
            showSection('section-upload-resume');
        });
    }

    if (navBuildResume) {
        navBuildResume.addEventListener('click', (e) => {
            e.preventDefault();
            showSection('section-build-resume');
        });
    }

    if (navInbox) {
        navInbox.addEventListener('click', (e) => {
            e.preventDefault();
            showSection('section-inbox');
        });
    }

    if (navFindJobs) {
        navFindJobs.addEventListener('click', (e) => {
            e.preventDefault();
            showSection('section-find-jobs');
        });
    }

    if (savedJobsMenu) {
        savedJobsMenu.addEventListener('click', (e) => {
            e.preventDefault();
            showSection('section-saved-jobs');
        });
    }

    if (navResumeHistory) {
        navResumeHistory.addEventListener('click', (e) => {
            e.preventDefault();
            showSection('section-resume-history');
            // Load resume history when section is shown
            if (typeof loadResumeHistory === 'function') {
                loadResumeHistory();
            }
        });
    }

    if (navCareerIntelligence) {
        navCareerIntelligence.addEventListener('click', (e) => {
            e.preventDefault();
            showSection('section-career-intelligence');
        });
    }

    if (navProfile) {
        navProfile.addEventListener('click', (e) => {
            e.preventDefault();
            showSection('section-my-profile');
        });
    }

    // Handle hash navigation (legacy support)
    const handleHashNavigation = () => {
        const hash = window.location.hash;
        const hashMap = {
            '#view-upload-resume': 'section-upload-resume',
            '#view-messages': 'section-inbox',
            '#view-profile': 'section-my-profile',
            '#view-saved-jobs': 'section-saved-jobs',
            '#view-find-jobs': 'section-find-jobs',
            '#view-build-resume': 'section-build-resume',
            '#view-resume-history': 'section-resume-history',
            '#view-career-intelligence': 'section-career-intelligence'
        };

        if (hash && hashMap[hash]) {
            setTimeout(() => {
                showSection(hashMap[hash]);
            }, 100);
        } else if (!hash) {
            // Set default active section to My Profile if no hash
            showSection('section-my-profile');
        }
    };

    // Check hash on page load
    document.addEventListener('DOMContentLoaded', () => {
        handleHashNavigation();
    });

    // Listen for hash changes
    window.addEventListener('hashchange', handleHashNavigation);

    // Logout Logic
    // Logout Logic
    const logoutBtn = document.getElementById('logout-btn');

    // Check token on load
    const token = localStorage.getItem('jc_token') || localStorage.getItem('jwt') || localStorage.getItem('authToken') || localStorage.getItem('token');
    if (token) {
        if (logoutBtn) logoutBtn.style.display = 'flex'; // Show if logged in
        // loadUserProfile() is called below
    } else {
        if (logoutBtn) logoutBtn.style.display = 'none'; // Hide if not logged in
    }

    if (logoutBtn) {
        logoutBtn.addEventListener('click', async (e) => {
            e.preventDefault();
            const token = localStorage.getItem('jc_token') || localStorage.getItem('jwt') || localStorage.getItem('authToken') || localStorage.getItem('token');

            if (token) {
                try {
                    await fetch('http://localhost:8000/auth/logout', {
                        method: 'POST',
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    });
                } catch (error) {
                    console.error('Logout error:', error);
                }
            }

            ['auroraUser', 'auroraProfile', 'user', 'jc_token', 'jwt', 'authToken', 'token'].forEach((key) => {
                localStorage.removeItem(key);
                sessionStorage.removeItem(key);
            });
            window.location.href = '/';
        });
    }

    // --- Profile Logic ---
    const profileForm = document.getElementById('profile-form');

    // Helper to get token
    const getToken = () => {
        const params = new URLSearchParams(window.location.search);
        const tokenFromUrl = params.get('token');
        if (tokenFromUrl) {
            localStorage.setItem('authToken', tokenFromUrl);
            // Clean URL but preserve hash
            const url = new URL(window.location.href);
            const hash = url.hash;
            url.searchParams.delete('token');
            window.history.replaceState({}, document.title, url.toString());
            return tokenFromUrl;
        }
        return localStorage.getItem('authToken');
    };

    const loadUserProfile = async () => {
        // Check if we came from OAuth redirect before cleaning URL
        const params = new URLSearchParams(window.location.search);
        const cameFromOAuth = params.has('token') || window.location.hash === '#view-profile';

        const token = getToken();
        if (!token) return;

        // Helper function to decode JWT and get payload
        const decodeJWT = (token) => {
            try {
                const parts = token.split('.');
                if (parts.length !== 3) return null;
                const payload = parts[1];
                // Handle Base64URL encoding
                const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
                const decoded = atob(base64);
                return JSON.parse(decoded);
            } catch (e) {
                console.error('Error decoding JWT:', e);
                return null;
            }
        };

        // Decode JWT to get Google picture URL
        const jwtPayload = decodeJWT(token);
        const googlePicture = jwtPayload?.picture || null;
        console.log('JWT payload:', jwtPayload);
        console.log('Google picture from JWT:', googlePicture);

        try {
            const res = await fetch('http://localhost:8000/auth/me', {
                headers: { 'Authorization': `Bearer ${localStorage.getItem('jc_token') || token}` }
            });

            if (res.ok) {
                const user = await res.json();

                // Add Google picture to user object if not already present
                if (!user.avatar && googlePicture) {
                    user.avatar = googlePicture;
                }
                if (!user.photoURL && googlePicture) {
                    user.photoURL = googlePicture;
                }

                // Save user data for auth-ui.js compatibility
                localStorage.setItem('user', JSON.stringify(user));
                // Also save token as 'jwt' for auth-ui.js
                const currentToken = getToken();
                if (currentToken) {
                    localStorage.setItem('jwt', currentToken);
                }

                // Update auth UI to show profile icon instead of signin button
                if (window.AuthUI) {
                    window.AuthUI.saveUser(user);
                    // Refresh auth UI
                    const authContainer = document.querySelector('.auth-ui-container');
                    if (authContainer) {
                        window.AuthUI.renderAuthUI(authContainer, {
                            signupUrl: authContainer.getAttribute('data-signup-url') || '/signup/',
                            profileUrl: authContainer.getAttribute('data-profile-url') || '#view-profile',
                            buttonClass: authContainer.getAttribute('data-button-class') || 'bg-black text-white px-6 py-2.5 rounded-full text-[15px] font-semibold shadow-md hover:shadow-lg transition-all hover:-translate-y-0.5',
                            avatarSize: 40
                        });
                    }
                }

                // Get the profile picture URL (from user data or JWT)
                const profilePictureUrl = user.avatar || user.photoURL || googlePicture;

                // Update Sidebar
                const sidebarName = document.getElementById('profile-name');
                const sidebarEmail = document.getElementById('profile-email');
                const sidebarAvatar = document.getElementById('profile-avatar-img');
                const sidebarAvatarContainer = document.getElementById('profile-avatar');
                const sidebarAvatarIcon = sidebarAvatarContainer?.querySelector('i');

                if (sidebarName) sidebarName.textContent = user.name || 'User';
                if (sidebarEmail) sidebarEmail.textContent = user.email || '';

                if (profilePictureUrl && sidebarAvatar && sidebarAvatarContainer) {
                    sidebarAvatar.referrerPolicy = 'no-referrer';  // Fix Google picture CORS
                    sidebarAvatar.src = profilePictureUrl;
                    sidebarAvatar.style.display = 'block';
                    // Hide the default icon when showing the image
                    if (sidebarAvatarIcon) sidebarAvatarIcon.style.display = 'none';
                }

                // Update Profile View
                const inputFirstName = document.getElementById('input-first-name');
                const inputLastName = document.getElementById('input-last-name');
                const inputEmail = document.getElementById('input-email');
                const inputLocation = document.getElementById('input-location');
                const inputBio = document.getElementById('input-bio');

                const viewAvatar = document.getElementById('profile-view-avatar');
                const viewInitials = document.getElementById('profile-view-initials');

                // Split name into first and last name
                if (user.name) {
                    const nameParts = user.name.trim().split(/\s+/);
                    if (inputFirstName) {
                        inputFirstName.value = nameParts[0] || '';
                    }
                    if (inputLastName) {
                        inputLastName.value = nameParts.slice(1).join(' ') || '';
                    }
                }

                if (inputEmail) inputEmail.value = user.email || '';
                if (inputLocation) inputLocation.value = user.location || '';
                if (inputBio) inputBio.value = user.bio || '';

                // Set profile view avatar
                if (profilePictureUrl && viewAvatar) {
                    viewAvatar.referrerPolicy = 'no-referrer';  // Fix Google picture CORS
                    viewAvatar.src = profilePictureUrl;
                    viewAvatar.classList.remove('hidden');
                    viewAvatar.style.display = 'block';
                    if (viewInitials) viewInitials.classList.add('hidden');
                    console.log('Profile picture set to:', profilePictureUrl);
                }

                // If coming from OAuth redirect, show profile section
                if (cameFromOAuth) {
                    const viewProfile = document.getElementById('view-profile');
                    const navProfile = document.getElementById('nav-profile');
                    const viewUploadResume = document.getElementById('view-upload-resume');
                    const viewMessages = document.getElementById('view-messages');
                    const viewFindJobs = document.getElementById('view-find-jobs');
                    const viewBuildResume = document.getElementById('view-build-resume');
                    const navUploadResume = document.getElementById('nav-upload-resume');
                    const navInbox = document.getElementById('nav-inbox');
                    const navFindJobs = document.getElementById('nav-find-jobs');

                    if (viewProfile && navProfile) {
                        // Hide all views
                        const views = [viewUploadResume, viewMessages, viewFindJobs, viewBuildResume].filter(v => v !== null);
                        views.forEach(v => {
                            if (v) v.classList.add('hidden');
                        });

                        // Show profile view
                        viewProfile.classList.remove('hidden');

                        // Update nav styles
                        const navs = [navUploadResume, navInbox, navFindJobs].filter(n => n !== null);
                        navs.forEach(n => {
                            if (n) {
                                n.classList.remove('bg-blue-50', 'text-blue-700', 'font-medium');
                                n.classList.add('text-slate-600', 'hover:bg-slate-50', 'hover:text-slate-900');
                            }
                        });

                        navProfile.classList.remove('text-slate-600', 'hover:bg-slate-50', 'hover:text-slate-900');
                        navProfile.classList.add('bg-blue-50', 'text-blue-700', 'font-medium');

                        // Scroll to profile section
                        setTimeout(() => {
                            viewProfile.scrollIntoView({ behavior: 'smooth', block: 'start' });
                        }, 100);
                    }
                }
            }
        } catch (e) {
            console.error('Failed to load profile', e);
        }
    };

    // Load on start
    loadUserProfile();

    // Save Profile - LOGIC MOVED TO index.html
    /*
    if (profileForm) {
        profileForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const token = getToken();
            if (!token) return;

            const btn = profileForm.querySelector('button[type="submit"]');
            const originalText = btn.textContent;
            btn.textContent = 'Saving...';
            btn.disabled = true;

            const firstName = document.getElementById('input-first-name')?.value || '';
            const lastName = document.getElementById('input-last-name')?.value || '';
            const fullName = `${firstName} ${lastName}`.trim();

            const data = {
                name: fullName || undefined,
                location: document.getElementById('input-location')?.value || undefined,
                bio: document.getElementById('input-bio')?.value || undefined
            };

            try {
                const res = await fetch('http://localhost:8000/auth/update_profile', {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(data)
                });

                if (res.ok) {
                    // Show success toast
                    showToast('Profile updated successfully!');
                    // Reload info to update sidebar
                    loadUserProfile();
                } else {
                    showToast('Failed to update profile.', 'error');
                }
            } catch (e) {
                console.error(e);
                showToast('An error occurred.', 'error');
            } finally {
                btn.textContent = originalText;
                btn.disabled = false;
            }
        });
    }
    */

    // Simple Toast Notification
    const showToast = (message, type = 'success') => {
        const toast = document.createElement('div');
        toast.className = `fixed bottom-8 right-8 px-6 py-4 rounded-xl shadow-2xl transform transition-all duration-500 translate-y-20 opacity-0 z-50 flex items-center gap-3 ${type === 'success' ? 'bg-slate-900 text-white' : 'bg-red-500 text-white'}`;

        toast.innerHTML = `
            <i class="fa-solid ${type === 'success' ? 'fa-check-circle text-green-400' : 'fa-circle-exclamation'}"></i>
            <span class="font-medium">${message}</span>
        `;

        document.body.appendChild(toast);

        // Animate in
        requestAnimationFrame(() => {
            toast.style.transform = 'translateY(0)';
            toast.style.opacity = '1';
        });

        // Remove after 3s
        setTimeout(() => {
            toast.style.transform = 'translateY(20px)';
            toast.style.opacity = '0';
            setTimeout(() => toast.remove(), 500);
        }, 3000);
    };

});
