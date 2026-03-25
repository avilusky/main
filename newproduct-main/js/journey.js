// Journey Management Module
const JourneyManager = {
    currentStation: 0,
    totalStations: 0,
    
    init() {
        this.totalStations = journeyData.stations.length + 2; // +2 for hero and final
        this.renderHero();
        this.renderStations();
        this.renderFinalSection();
        this.setupProgressIndicator();
        this.setupScrollHandler();
        
        // Initialize Status Tracker
        StatusTracker.init();
        
        // Force initial update to ensure correct state
        setTimeout(() => {
            StatusTracker.updateTracker(0);
        }, 100);
    },
    
    renderHero() {
        const heroSection = document.getElementById('heroSection');
        heroSection.className = 'hero-section';
        
        heroSection.innerHTML = `
            <!-- תוכן ראשי -->
            <div class="hero-content">
                <div class="logo-container">
                    <img src="${journeyData.hero.logo}" alt="רשות שוק ההון" class="hero-logo-animated">
                </div>
                
                <h1 class="hero-title">${journeyData.hero.title}</h1>
                <p class="hero-subtitle">${journeyData.hero.subtitle}</p>
                
                <!-- קו זמן משופר -->
                <div class="timeline-container">
                    <div class="timeline-track">
                        <div class="timeline-flow"></div>
                    </div>
                    
                    <div class="timeline-stations">
                        ${journeyData.hero.mapPoints.map((point, index) => `
                            <div class="timeline-station" data-index="${index}" style="animation-delay: ${index * 0.12}s">
                                <div class="station-content">
                                    <div class="station-bubble">
                                        <div class="station-icon">${point.icon}</div>
                                    </div>
                                    
                                    <div class="station-info">
                                        <div class="station-date">${point.date}</div>
                                        <div class="station-title">${point.title}</div>
                                    </div>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
                
                <!-- כפתור התחלה -->
                <button class="btn-start-journey" onclick="JourneyManager.startJourney()">
                    <span class="btn-text">התחל את המסע</span>
                    <span class="btn-arrow">←</span>
                </button>

                <!-- קרדיט -->
                <div class="matrix-footer" style="margin-top: 60px; padding: 20px; text-align: center; position: relative;">
                    <span class="footer-text">חטיבת ביטוחי בריאות וסיעוד</span>
                </div>
            </div>
        `;
        
        // הוספת אינטראקטיביות פשוטה לתחנות
        setTimeout(() => {
            this.initHeroInteractions();
        }, 100);
    },
    
    initHeroInteractions() {
        const stations = document.querySelectorAll('.timeline-station');
        
        stations.forEach((station, index) => {
            station.addEventListener('mouseenter', () => {
                // הדגשת התחנה בעדינות
                station.classList.add('active');
            });
            
            station.addEventListener('mouseleave', () => {
                station.classList.remove('active');
            });
        });
    },
    
    renderStations() {
        const container = document.getElementById('journeyStations');
        container.innerHTML = journeyData.stations.map(station => `
            <section class="journey-section" id="section${station.id}">
                <div class="decision-point">${station.icon}</div>
                <div class="section-content">
                    <div class="section-header">
                        <div class="section-date">${station.date}</div>
                        <h2 class="journey-section-title title-shadow">${station.title}</h2>
                        <p class="section-subtitle">${station.subtitle}</p>
                    </div>
                    
                    <div class="decision-tree">
                        ${station.options.map((option, index) => this.renderOption(option, station.id, index)).join('')}
                    </div>
                    
                    <div class="result-box">
                        <div class="result-title">
                            <span>${station.result.icon}</span>
                            <span>${station.result.title}</span>
                        </div>
                        <div class="result-text">${station.result.text}</div>
                    </div>
                </div>
            </section>
        `).join('');
    },
    
renderOption(option, stationId, optionIndex) {
    const badges = {
        preferred: '<span class="preferred-badge">העדפנו</span>',
        selected: '<span class="selected-badge">קרה בפועל</span>'
    };
    
    const isSelected = option.type === 'selected';
    const isLastStation = stationId === journeyData.stations.length;
    const nextStation = isLastStation ? "'finalSection'" : stationId + 1;
    
    // הוסף מספור לאפשרויות
    const optionNumber = optionIndex + 1;
    
    return `
        <div class="option-card ${option.type}" 
             ${isSelected ? `onclick="JourneyManager.continueJourney(${nextStation})"` : ''}>
            <div class="option-number">אפשרות ${optionNumber}</div>
            ${badges[option.type] || ''}
            <span class="option-icon">${option.icon}</span>
            <h3 class="option-title">${option.title}</h3>
            <p class="option-desc">${option.description}</p>
            <div class="option-outcome">
                <div class="outcome-label">${isSelected ? 'תוצאה בפועל' : 'הערות'}:</div>
                <div class="outcome-text">${option.outcome}</div>
            </div>
            ${isSelected ? '<span class="continue-hint">המשך ←</span>' : ''}
        </div>
    `;
},
    
    renderFinalSection() {
        const finalSection = document.getElementById('finalSection');
        finalSection.className = 'final-section';
        const data = journeyData.finalDecision;
        
        finalSection.innerHTML = `
            <div class="final-content">
                <h2 class="final-title">${data.title}</h2>
                <p class="final-subtitle">${data.subtitle}</p>
                
                <div class="final-cards">
                    ${data.options.map(option => `
                        <div class="final-card ${option.recommended ? 'recommended' : ''} ${option.status === 'blocked' ? 'blocked' : ''}" 
                             ${option.recommended ? 'id="recommendedCard"' : ''}>
                            ${option.recommended ? '<span class="final-recommended-badge">ההחלטה המומלצת</span>' : ''}
                            ${option.status === 'blocked' ? `
                                <div class="blocked-overlay">
                                    <div class="blocked-content">
                                        <span class="blocked-icon">⛔</span>
                                        <span class="blocked-text">${option.statusText}</span>
                                    </div>
                                </div>
                            ` : ''}
                            <span class="final-icon">${option.icon}</span>
                            <h3 class="final-card-title">${option.title}</h3>
                            <p class="final-card-desc">${option.description}</p>
                            ${option.blockedReason ? `
                                <div class="blocked-reason">
                                    <span class="reason-icon">⚠️</span>
                                    <span class="reason-text">${option.blockedReason}</span>
                                </div>
                            ` : ''}
                            ${option.recommended ? `
                                <button class="btn-secondary launch-matrix" onclick="MatrixManager.open()">
                                    פתח מטריצה ←
                                </button>
                            ` : ''}
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    },
    
    setupProgressIndicator() {
        const indicator = document.getElementById('progressIndicator');
        indicator.className = 'progress-indicator';
        
        const dots = [
            { label: 'התחלה', section: 'heroSection' },
            ...journeyData.stations.map(s => ({ 
                label: s.date, 
                section: `section${s.id}` 
            })),
            { label: 'נקודת ההכרעה', section: 'finalSection' }
        ];
        
        indicator.innerHTML = dots.map((dot, index) => `
            <div class="progress-dot ${index === 0 ? 'active' : ''}" 
                 onclick="JourneyManager.scrollToSection('${dot.section}')">
                <span class="progress-tooltip">${dot.label}</span>
            </div>
        `).join('');
    },
    
    startJourney() {
        this.scrollToSection('section1');
    },
    
    continueJourney(nextSection) {
        let targetId;
        
        if (typeof nextSection === 'string') {
            targetId = nextSection.replace(/['"]/g, '');
        } else if (nextSection === 'final' || nextSection > journeyData.stations.length) {
            targetId = 'finalSection';
        } else {
            targetId = `section${nextSection}`;
        }
        
        if (event && event.currentTarget) {
            const card = event.currentTarget;
            card.style.transform = 'scale(1.05)';
            card.style.boxShadow = '0 0 30px rgba(71, 85, 105, 0.3)';
        }
        
        setTimeout(() => {
            this.scrollToSection(targetId);
        }, 300);
    },
    
    scrollToSection(sectionId) {
        const section = document.getElementById(sectionId);
        if (section) {
            section.scrollIntoView({ 
                behavior: 'smooth',
                block: 'center'
            });
        }
    },
    
    setupScrollHandler() {
        let ticking = false;
        
        const handleScroll = () => {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    this.updateProgress();
                    this.animateVisibleElements();
                    ticking = false;
                });
                ticking = true;
            }
        };
        
        window.addEventListener('scroll', handleScroll);
        this.updateProgress();
        this.animateVisibleElements();
    },
    
    updateProgress() {
        const sections = document.querySelectorAll('.hero-section, .journey-section, .final-section');
        const scrollPosition = window.scrollY + window.innerHeight / 2;
        const dots = document.querySelectorAll('.progress-dot');
        
        sections.forEach((section, index) => {
            const top = section.offsetTop;
            const bottom = top + section.offsetHeight;
            
            if (scrollPosition >= top && scrollPosition <= bottom) {
                dots.forEach(dot => dot.classList.remove('active'));
                if (dots[index]) {
                    dots[index].classList.add('active');
                    for (let i = 0; i < index; i++) {
                        dots[i].classList.add('completed');
                    }
                }
                this.currentStation = index;
                
                // Update Status Tracker
                StatusTracker.updateTracker(index);
            }
        });
    },
    
    animateVisibleElements() {
        const elements = document.querySelectorAll('.section-header, .option-card, .result-box');
        
        elements.forEach(el => {
            const rect = el.getBoundingClientRect();
            const isVisible = rect.top < window.innerHeight && rect.bottom > 0;
            
            if (isVisible && !el.classList.contains('visible')) {
                el.classList.add('visible');
                
                // הוספת class animation-complete אחרי סיום האנימציה
                if (el.classList.contains('option-card')) {
                    // חישוב זמן האנימציה כולל delay
                    let delay = 400; // transition base time
                    
                    // הוספת ה-delay לפי המיקום
                    const parent = el.parentElement;
                    const children = Array.from(parent.children);
                    const index = children.indexOf(el);
                    
                    if (index === 0) delay += 200;
                    else if (index === 1) delay += 400;
                    else if (index === 2) delay += 600;
                    
                    // אם זה כרטיס selected, נוסיף עוד זמן בגלל אנימציית selectedPulse
                    if (el.classList.contains('selected')) {
                        delay += 1000; // זמן אנימציית selectedPulse
                    }
                    
                    setTimeout(() => {
                        el.classList.add('animation-complete');
                    }, delay);
                }
            }
        });
    }
};

// Status Tracker Manager
const StatusTracker = {
    isMinimized: true, // מתחיל ממוזער
    currentStation: 0,
    
    init() {
        // מתחיל במצב ממוזער
        const tracker = document.getElementById('statusTracker');
        const icon = document.getElementById('toggleIcon');
        tracker.classList.add('minimized');
        icon.textContent = '📊';
        
        this.setupEventListeners();
        this.updateTracker(0);
        this.updateTrackerHTML(0);
        
        // פותח אוטומטית אחרי 3 שניות
        setTimeout(() => {
            this.autoOpen();
        }, 3000);
    },
    
    autoOpen() {
        const tracker = document.getElementById('statusTracker');
        const icon = document.getElementById('toggleIcon');
        
        // מוסיף אנימציה איטית יותר לפתיחה - 1.5 שניות
        tracker.style.transition = 'all 1.5s cubic-bezier(0.4, 0, 0.2, 1)';
        tracker.classList.remove('minimized');
        icon.textContent = '−';
        this.isMinimized = false;
    },
    
    toggle() {
        const tracker = document.getElementById('statusTracker');
        const icon = document.getElementById('toggleIcon');
        
        if (tracker.classList.contains('minimized')) {
            tracker.classList.remove('minimized');
            icon.textContent = '−';
            this.isMinimized = false;
        } else {
            tracker.classList.add('minimized');
            icon.textContent = '📊';
            this.isMinimized = true;
        }
    },
    
    setupEventListeners() {
        // Listen to scroll events (handled by JourneyManager.updateProgress)
    },
    
    updateTrackerHTML(stationIndex) {
        const trackerData = document.getElementById('trackerData');
        const countdown = document.querySelector('.tracker-countdown');
        
        if (!trackerData) return;
        
        // Hide countdown for first stations, show after station 3
        if (stationIndex < 3) {
            countdown.style.display = 'none';
        } else {
            countdown.style.display = 'block';
            
            // Set the correct days based on station
            const daysElement = document.getElementById('daysLeft');
            if (daysElement) {
                if (stationIndex === 3) {
                    // Station 3 (סוף 2024): exactly 2 years = 730 days
                    daysElement.textContent = '730';
                    daysElement.className = 'countdown-days warning'; // כתום
                } else if (stationIndex >= 4) {
                    // Final station: calculate real days from today
                    const now = new Date();
                    const endDate = new Date('2026-12-31');
                    const diff = endDate - now;
                    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
                    daysElement.textContent = days > 0 ? days : 0;
                    daysElement.className = 'countdown-days critical'; // אדום
                }
            }
        }
        
        // Update HTML structure based on station
        let htmlContent = '';
        
        if (stationIndex <= 3) {
            // Stations 0-3: Show risk instead of days
            htmlContent = `
                <div class="tracker-item">
                    <span class="tracker-label">מבוטחים:</span>
                    <span class="tracker-value" id="insuredValue">4.5M</span>
                </div>
                <div class="tracker-item">
                    <span class="tracker-label">פרמיה:</span>
                    <span class="tracker-value" id="premiumValue">=</span>
                </div>
                <div class="tracker-item">
                    <span class="tracker-label">תגמולים:</span>
                    <span class="tracker-value" id="benefitValue">₪6,000</span>
                </div>
                <div class="tracker-item">
                    <span class="tracker-label">ADL:</span>
                    <span class="tracker-value" id="adlValue">3/6</span>
                </div>
                <div class="tracker-item">
                    <span class="tracker-label">רווחי חברות:</span>
                    <span class="tracker-value" id="companyStatus">הפסד</span>
                </div>
                <div class="tracker-item">
                    <span class="tracker-label">סיכון:</span>
                    <span class="tracker-value" id="riskValue">20/80</span>
                </div>
                <div class="tracker-item">
                    <span class="tracker-label">המשכיות:</span>
                    <span class="tracker-value" id="continuityValue">קיימת</span>
                </div>
            `;
        } else {
            // Final station: Show question marks prominently
            htmlContent = `
                <div class="tracker-item">
                    <span class="tracker-label">מבוטחים:</span>
                    <span class="tracker-value" id="insuredValue">5.1M</span>
                </div>
                <div class="tracker-item">
                    <span class="tracker-label">פרמיה:</span>
                    <span class="tracker-value state-critical" id="premiumValue">?</span>
                </div>
                <div class="tracker-item">
                    <span class="tracker-label">תגמולים:</span>
                    <span class="tracker-value state-critical" id="premiumValue">?</span>
                </div>
                <div class="tracker-item">
                    <span class="tracker-label">ADL:</span>
                    <span class="tracker-value state-critical" id="premiumValue">?</span>
                </div>
                <div class="tracker-item">
                    <span class="tracker-label">רווחי חברות:</span>
                    <span class="tracker-value state-critical" id="premiumValue">?</span>
                </div>
                <div class="tracker-item">
                    <span class="tracker-label">סיכון:</span>
                    <span class="tracker-value state-critical" id="premiumValue">?</span>
                </div>
                <div class="tracker-item">
                    <span class="tracker-label">המשכיות:</span>
                    <span class="tracker-value state-critical" id="premiumValue">?</span>
                </div>
            `;
        }
        
        trackerData.innerHTML = htmlContent;
    },
    
    updateTracker(stationIndex) {
        this.currentStation = stationIndex;
        
        // Update HTML structure first
        this.updateTrackerHTML(stationIndex);
        
        const elements = {
            year: document.getElementById('currentYear'),
            insured: document.getElementById('insuredValue'),
            premium: document.getElementById('premiumValue'),
            benefit: document.getElementById('benefitValue'),
            adl: document.getElementById('adlValue'),
            company: document.getElementById('companyStatus'),
            risk: document.getElementById('riskValue'),
            continuity: document.getElementById('continuityValue'),
            days: document.getElementById('daysLeft'),
            healthBar: document.getElementById('healthBar')
        };
        
        if (!elements.year) return;
        
        // Station data for tracker updates
        const stationData = [
            { // Hero - Initial state (before stations)
                year: 'ינואר 2023',
                insured: { value: '4.5M', state: '' },
                premium: { value: '=', state: 'state-good' },
                benefit: { value: '₪6,000', state: 'state-good' },
                adl: { value: '3/6', state: 'state-good' },
                company: { value: 'הפסד', state: 'state-critical' },
                risk: { value: '20/80', state: 'state-good' },
                continuity: { value: 'קיימת', state: 'state-good' },
                health: 'good'
            },
            { // Station 1 - נקודת המוצא
                year: 'דצמבר 2023',
                insured: { value: '4.7M', state: '' },
                premium: { value: '▲', state: 'state-warning', style: 'font-size: 1rem;' },
                benefit: { value: '₪5,000', state: 'state-critical' },
                adl: { value: '3/6', state: 'state-good' },
                company: { value: 'הפסד', state: 'state-critical' },
                risk: { value: 'מבוטל', state: 'state-critical' },
                continuity: { value: 'קיימת', state: 'state-good' },
                health: 'bad'
            },
            { // Station 2 - הקמת צוות משותף
                year: 'אמצע 2024',
                insured: { value: '4.8M', state: '' },
                premium: { value: '▲', state: 'state-warning', style: 'font-size: 1rem;' },
                benefit: { value: '₪5,000', state: 'state-critical' },
                adl: { value: '3/6', state: 'state-good' },
                company: { value: 'הפסד', state: 'state-critical' },
                risk: { value: 'מבוטל', state: 'state-critical' },
                continuity: { value: 'קיימת', state: 'state-good' },
                health: 'bad'
            },
            { // Station 3 - נסיגת המבטחים
                year: 'סוף 2024',
                insured: { value: '4.9M', state: '' },
                premium: { value: '▲', state: 'state-critical', style: 'font-size: 1rem;' },
                benefit: { value: '₪5,000', state: 'state-critical' },
                adl: { value: '4/6', state: 'state-critical' },
                company: { value: 'רווח', state: 'state-good' },
                risk: { value: 'מבוטל', state: 'state-critical' },
                continuity: { value: 'מבוטלת', state: 'state-critical' },
                health: 'critical'
            },
            { // Final - רגע ההכרעה
                year: 'רגע ההכרעה',
                insured: { value: '5.1M', state: '' },
                premium: { value: '?', state: 'state-critical' },
                benefit: { value: '?', state: 'state-critical' },
                adl: { value: '?', state: 'state-critical' },
                company: { value: '?', state: 'state-critical' },
                risk: { value: '?', state: 'state-critical' },
                continuity: { value: '?', state: 'state-critical' },
                health: 'critical'
            }
        ];
        
        const data = stationData[Math.min(stationIndex, stationData.length - 1)];
        
        // Update all values with animation
        elements.year.textContent = data.year;
        
        if (elements.insured) {
            elements.insured.textContent = data.insured.value;
            elements.insured.className = `tracker-value ${data.insured.state}`;
        }
        
        if (elements.premium) {
            elements.premium.textContent = data.premium.value;
            elements.premium.className = `tracker-value ${data.premium.state}`;
            if (data.premium.style) {
                elements.premium.style.cssText = data.premium.style;
            }
        }
        
        if (elements.benefit) {
            elements.benefit.textContent = data.benefit.value;
            elements.benefit.className = `tracker-value ${data.benefit.state}`;
        }
        
        if (elements.adl) {
            elements.adl.textContent = data.adl.value;
            elements.adl.className = `tracker-value ${data.adl.state}`;
        }
        
        if (elements.company) {
            elements.company.textContent = data.company.value;
            elements.company.className = `tracker-value ${data.company.state}`;
        }
        
        if (elements.risk) {
            elements.risk.textContent = data.risk.value;
            elements.risk.className = `tracker-value ${data.risk.state}`;
        }
        
        if (elements.continuity) {
            elements.continuity.textContent = data.continuity.value;
            elements.continuity.className = `tracker-value ${data.continuity.state}`;
        }
        
        if (elements.days && data.days) {
            elements.days.textContent = data.days.value;
            elements.days.className = `countdown-days ${data.days.state}`;
        }
        
        elements.healthBar.className = `health-bar ${data.health}`;
    },
    
    startCountdown() {
        // This function now only updates for the final station
        // Station 3 gets fixed 730 days in updateTrackerHTML
        if (this.currentStation >= 4) {
            const calculateDays = () => {
                const now = new Date();
                const endDate = new Date('2026-12-31');
                const diff = endDate - now;
                const days = Math.floor(diff / (1000 * 60 * 60 * 24));
                return days > 0 ? days : 0;
            };
            
            const updateDisplay = () => {
                const daysElement = document.getElementById('daysLeft');
                if (daysElement && this.currentStation >= 4) {
                    const daysLeft = calculateDays();
                    daysElement.textContent = daysLeft;
                }
            };
            
            // Update immediately
            updateDisplay();
            
            // Update every day at midnight
            setInterval(updateDisplay, 1000 * 60 * 60 * 24);
        }
    }
};