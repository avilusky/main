// Matrix Management Module
const MatrixManager = {
    isOpen: false,
    
    init() {
        this.renderMatrix();
        this.renderDetailOverlay();
        this.setupEventListeners();
    },
    
    renderMatrix() {
        const overlay = document.getElementById('matrixOverlay');
        overlay.className = 'matrix-overlay';
        
        overlay.innerHTML = `
            <div class="matrix-container" id="matrixContainer">
                <div class="matrix-header">
                    <div class="matrix-header-content">
                        <div class="header-right">
                            <img src="${journeyData.hero.logo}" alt="רשות שוק ההון" class="matrix-logo">
                            <div>
                                <h2 class="matrix-title">${matrixData.title}</h2>
                                <p class="matrix-subtitle">${matrixData.subtitle}</p>
                            </div>
                        </div>
                        <button class="close-btn close-matrix" onclick="MatrixManager.close()">×</button>
                    </div>
                </div>
                
                <div class="matrix-grid">
                    ${matrixData.cells.map(cell => this.renderCell(cell)).join('')}
                </div>

                <div class="matrix-footer">
                    <span class="footer-text">חטיבת ביטוחי בריאות וסיעוד</span>
                </div>
            </div>
        `;
    },
    
    renderCell(cell) {
        return `
            <div class="matrix-cell" onclick="MatrixManager.showDetail(${cell.id})">
                ${cell.badge ? `<span class="cell-badge">${cell.badge}</span>` : ''}
                <div class="cell-icon">${cell.icon}</div>
                <div class="cell-title">${cell.title}</div>
                <div class="cell-description">${cell.description}</div>
            </div>
        `;
    },
    
    renderDetailOverlay() {
        const overlay = document.getElementById('detailOverlay');
        overlay.className = 'detail-overlay';
        
        overlay.innerHTML = `
            <div class="detail-content">
                <div class="detail-header">
                    <button class="close-btn detail-close" onclick="MatrixManager.closeDetail()">×</button>
                    <h2 id="detailTitle"></h2>
                    <p id="detailSubtitle"></p>
                </div>
                <div class="detail-body" id="detailBody"></div>
            </div>
        `;
    },
    
    open() {
        const recommendedCard = document.getElementById('recommendedCard');
        const matrixOverlay = document.getElementById('matrixOverlay');
        const matrixContainer = document.getElementById('matrixContainer');
        
        // Morphing animation
        this.createMorphAnimation(recommendedCard);
        
        // Show matrix after animation
        setTimeout(() => {
            matrixOverlay.classList.add('active');
            matrixContainer.classList.add('active');
            this.isOpen = true;
            
            // Animate cells entrance
            this.animateCells();
        }, 800);
    },
    
    createMorphAnimation(sourceElement) {
        const rect = sourceElement.getBoundingClientRect();
        
        // Create morphing element
        const morphElement = document.createElement('div');
        morphElement.className = 'morph-element';
        morphElement.style.cssText = `
            position: fixed;
            top: ${rect.top}px;
            left: ${rect.left}px;
            width: ${rect.width}px;
            height: ${rect.height}px;
            background: linear-gradient(135deg, #3b82f6, #0ea5e9);
            border-radius: 20px;
            z-index: 9999;
            transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1);
        `;
        document.body.appendChild(morphElement);
        
        // Start animation
        setTimeout(() => {
            morphElement.style.top = '50%';
            morphElement.style.left = '50%';
            morphElement.style.transform = 'translate(-50%, -50%) scale(0.5)';
            morphElement.style.borderRadius = '50%';
            morphElement.style.opacity = '0.8';
        }, 50);
        
        // Create expanding rings
        this.createExpandingRings();
        
        // Final expansion
        setTimeout(() => {
            morphElement.style.transform = 'translate(-50%, -50%) scale(25)';
            morphElement.style.opacity = '0';
        }, 600);
        
        // Clean up
        setTimeout(() => {
            morphElement.remove();
        }, 1400);
    },
    
    createExpandingRings() {
        for (let i = 0; i < 3; i++) {
            setTimeout(() => {
                const ring = document.createElement('div');
                ring.className = 'expanding-ring';
                ring.style.cssText = `
                    position: fixed;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    width: 100px;
                    height: 100px;
                    border: 2px solid rgba(59, 130, 246, 0.5);
                    border-radius: 50%;
                    z-index: 9998;
                    animation: expandRing ${1 + i * 0.2}s ease-out forwards;
                `;
                document.body.appendChild(ring);
                
                setTimeout(() => ring.remove(), 2000);
            }, 300 + i * 100);
        }
    },
    
    animateCells() {
        const cells = document.querySelectorAll('.matrix-cell');
        cells.forEach((cell, index) => {
            setTimeout(() => {
                cell.classList.add('appear');
            }, index * 80);
        });
    },
    
    close() {
        const matrixOverlay = document.getElementById('matrixOverlay');
        const matrixContainer = document.getElementById('matrixContainer');
        const cells = document.querySelectorAll('.matrix-cell');
        
        // Animate cells exit
        cells.forEach((cell, index) => {
            setTimeout(() => {
                cell.style.transform = 'scale(0.8)';
                cell.style.opacity = '0';
            }, index * 30);
        });
        
        // Hide overlay
        setTimeout(() => {
            matrixContainer.classList.remove('active');
            matrixOverlay.classList.remove('active');
            this.isOpen = false;
            
            // Reset cells
            cells.forEach(cell => {
                cell.classList.remove('appear');
                cell.style.transform = '';
                cell.style.opacity = '';
            });
        }, 500);
    },
    
    showDetail(cellId) {
        const cell = matrixData.cells.find(c => c.id === cellId);
        if (!cell || !cell.details) {
            this.showDefaultDetail(cellId);
            return;
        }
        
        const detailOverlay = document.getElementById('detailOverlay');
        const titleElement = document.getElementById('detailTitle');
        const subtitleElement = document.getElementById('detailSubtitle');
        const bodyElement = document.getElementById('detailBody');
        
        // הוספת האייקון לכותרת
        titleElement.innerHTML = `<span class="header-icon">${cell.icon}</span> ${cell.details.title}`;
        subtitleElement.textContent = cell.details.subtitle;
        
        // Check if this is a decision point cell
        if (cell.details.isDecisionPoint) {
            // Special layout for decision point
            let content = '';
            
            if (cell.details.introduction) {
                content += `<div class="decision-intro">${cell.details.introduction}</div>`;
            }
            
            // Create options comparison
            content += `<div class="decision-options-container">`;
            
            cell.details.options.forEach((option, index) => {
                content += `
                    <div class="decision-option ${index === 0 ? 'option-left' : 'option-right'}">
                        <div class="option-header">
                            <h3>${option.title}</h3>
                        </div>
                        <div class="option-description">${option.description}</div>
                        
                        ${option.components ? `
                            <div class="option-components">
                                ${option.components.map(comp => `
                                    <div class="component-section">
                                        <h4>${comp.title}</h4>
                                        <ul>
                                            ${comp.items.map(item => `<li>${item}</li>`).join('')}
                                        </ul>
                                    </div>
                                `).join('')}
                            </div>
                        ` : ''}
                        
                        <div class="pros-cons-grid">
                            <div class="pros-section">
                                <h4 class="pros-title">יתרונות</h4>
                                <ul class="pros-list">
                                    ${option.pros.map(pro => `<li>${pro}</li>`).join('')}
                                </ul>
                            </div>
                            <div class="cons-section">
                                <h4 class="cons-title">חסרונות</h4>
                                <ul class="cons-list">
                                    ${option.cons.map(con => `<li>${con}</li>`).join('')}
                                </ul>
                            </div>
                        </div>
                        
                        ${option.impact ? `
                            <div class="impact-meters">
                                <h4>מדדי השפעה</h4>
                                <div class="impact-grid">
                                    <div class="impact-item">
                                        <span class="impact-label">גמישות שוק</span>
                                        <div class="impact-bar">
                                            <div class="impact-fill" style="width: ${option.impact.market}%"></div>
                                        </div>
                                        <span class="impact-value">${option.impact.market}%</span>
                                    </div>
                                    <div class="impact-item">
                                        <span class="impact-label">רמת פיקוח</span>
                                        <div class="impact-bar">
                                            <div class="impact-fill" style="width: ${option.impact.control}%"></div>
                                        </div>
                                        <span class="impact-value">${option.impact.control}%</span>
                                    </div>
                                    <div class="impact-item">
                                        <span class="impact-label">שקיפות</span>
                                        <div class="impact-bar">
                                            <div class="impact-fill" style="width: ${option.impact.transparency}%"></div>
                                        </div>
                                        <span class="impact-value">${option.impact.transparency}%</span>
                                    </div>
                                    <div class="impact-item">
                                        <span class="impact-label">חדשנות</span>
                                        <div class="impact-bar">
                                            <div class="impact-fill" style="width: ${option.impact.innovation}%"></div>
                                        </div>
                                        <span class="impact-value">${option.impact.innovation}%</span>
                                    </div>
                                </div>
                            </div>
                        ` : ''}
                    </div>
                `;
            });
            
            content += `</div>`;
            
            bodyElement.innerHTML = content;
            detailOverlay.classList.add('active');
            
            // Animate impact bars after content is loaded
            setTimeout(() => {
                const impactFills = detailOverlay.querySelectorAll('.impact-fill');
                impactFills.forEach(fill => {
                    const width = fill.style.width;
                    fill.style.width = '0';
                    setTimeout(() => {
                        fill.style.width = width;
                    }, 100);
                });
            }, 100);
            
            return;
        }



// Check if this is the product model cell
if (cellId === 1) {
    // Special design for product model
    bodyElement.className = 'detail-body product-model-design';
    
    let content = `
        <div class="target-intro">
            <p>${cell.details.introduction}</p>
        </div>
        
        <div class="model-stage-container">
            <div class="model-stage-card savings-stage">
                <div class="stage-header">
                    <span class="stage-icon">💰</span>
                    <div class="stage-text">
                        <div class="stage-title">שלב ראשון</div>
                        <div class="stage-subtitle">חיסכון עד גיל 70</div>
                    </div>
                </div>
                <ul class="feature-list">
                    <li>
                        <span class="feature-icon">📊</span>
                        <div class="feature-content">
                            <span class="feature-label">חיסכון אישי:</span>
                            חשבון על שמך
                        </div>
                    </li>
                    <li>
                        <span class="feature-icon">💳</span>
                        <div class="feature-content">
                            <span class="feature-label">דמי ניהול:</span>
                            <span class="feature-value"><1%</span>
                        </div>
                    </li>
                    <li>
                        <span class="feature-icon">📈</span>
                        <div class="feature-content">
                            <span class="feature-label">הנחת תשואה:</span>
                            <span class="feature-value">4%</span> שנתית
                        </div>
                    </li>
                    <li>
                        <span class="feature-icon">🎯</span>
                        <div class="feature-content">
                            <span class="feature-label">גיל הצטרפות מקסימלי:</span>
                            <span class="feature-value">55 / 70</span>
                        </div>
                    </li>
                </ul>
                <div class="savings-goals">
                    <div class="goal-item">
                        <div class="goal-label">יעד גברים</div>
                        <div class="goal-amount">₪80,000</div>
                    </div>
                    <div class="goal-item">
                        <div class="goal-label">יעד נשים</div>
                        <div class="goal-amount">₪100,000</div>
                    </div>
                </div>
            </div>
            
            <div class="model-stage-card insurance-stage">
                <div class="stage-header">
    <span class="stage-icon">🛡️</span>
    <div class="stage-text">
        <div class="stage-title">שלב שני</div>
        <div class="stage-subtitle">ביטוח סיעודי מגיל 70</div>
    </div>
</div>
                <ul class="feature-list">
                    <li>
                        <span class="feature-icon">🔄</span>
                        <div class="feature-content">
                            <span class="feature-label">המרה אוטומטית</span>
                            ללא חיתום נוסף
                        </div>
                    </li>
                    <li>
                        <span class="feature-icon">💵</span>
                        <div class="feature-content">
                            <span class="feature-label">תגמול חודשי:</span>
<span class="feature-value">₪5,000</span>
<div style="font-size: 0.75rem; color: #64748b; margin-top: 4px;">
    משתנה בהתאם לאיזון אקטוארי
</div>
                        </div>
                    </li>
                    <li>
                        <span class="feature-icon">📅</span>
                        <div class="feature-content">
                            <span class="feature-label">תקופת תשלום:</span>
                            <span class="feature-value">60 חודשים</span>
                        </div>
                    </li>
                    <li>
                        <span class="feature-icon">⏱️</span>
                        <div class="feature-content">
                            <span class="feature-label">תקופת המתנה:</span>
                            <span class="feature-value">60 יום</span>
                        </div>
                    </li>
                </ul>
            </div>
        </div>
        
        <div class="guarantees-section">
            <div class="guarantees-header">
                🏆 הבטחות מובנות במוצר
            </div>
            <div class="guarantees-grid">
                <div class="guarantee-card">
                    <span class="guarantee-icon">💰</span>
                    <div class="guarantee-title"> הבטחת מוות ללא תביעה</div>
                    <div class="guarantee-value">₪30,000</div>
                    <div class="guarantee-desc">במקרה פטירה ללא מצב סיעודי</div>
                </div>
                <div class="guarantee-card">
                    <span class="guarantee-icon">✅</span>
                    <div class="guarantee-title">תשלום מינימלי</div>
                    <div class="guarantee-value">12 חודשים</div>
                    <div class="guarantee-desc">מובטח במקרה תביעה</div>
                </div>
                <div class="guarantee-card">
                    <span class="guarantee-icon">↩️</span>
                    <div class="guarantee-title">החזר חיסכון</div>
                    <div class="guarantee-value">100%</div>
                    <div class="guarantee-desc">לפני גיל 70</div>
                </div>
            </div>
        </div>
    `;
    
    bodyElement.innerHTML = content;
    detailOverlay.classList.add('active');
    return;
}

// Check if this is the calculator cell
if (cellId === 2) {
    bodyElement.className = 'detail-body calculator-design';
    
    let content = `
        <div class="calculator-container">
            <div class="calculator-grid">
                <div class="calculator-card calculator-controls">
                    <div class="control-group">
                        <label>גיל הצטרפות:</label>
                        <input type="range" id="ageInput" class="age-range" min="20" max="55" step="5" value="30"/>
                        <div class="age-display" id="ageDisplay">30</div>
                    </div>

                    <div class="control-group">
                        <label>מגדר:</label>
                        <div class="gender-buttons">
                            <button class="gender-button active" id="maleBtn">גבר</button>
                            <button class="gender-button" id="femaleBtn">אישה</button>
                        </div>
                    </div>

                    <div class="summary-box">
                        <h3>סיכום תשלומים</h3>
                        <div class="summary-item">
                            <span>פרמיה התחלתית - קבועה:</span>
                            <span id="fixedModelInitial">₪0</span>
                        </div>
                        <div class="summary-item">
                            <span>פרמיה התחלתית - משתנה:</span>
                            <span id="newModelInitial">₪0</span>
                        </div>
                        <div class="summary-item">
                            <span>פרמיה התחלתית - קופות חולים:</span>
                            <span id="kupotInitial">₪0</span>
                        </div>
                        <div class="summary-item">
                            <span>סך תשלום - פרמיה קבועה:</span>
                            <span id="fixedModelTotal">₪0</span>
                        </div>
                        <div class="summary-item">
                            <span>סך תשלום - פרמיה משתנה:</span>
                            <span id="newModelTotal">₪0</span>
                        </div>
                        <div class="summary-item">
                            <span>סך תשלום - קופות חולים:</span>
                            <span id="kupotTotal">₪0</span>
                        </div>
                    </div>

                    <div class="calculator-note">
                        <strong>הערה:</strong> בעוד שהפרמיות בקופות החולים הן תשלום עבור הביטוח בלבד, במודל החדש הפרמיות נצברות כחיסכון אישי לטובת המבוטח
                    </div>
                </div>

                <div class="calculator-card charts-container">
                    <div class="chart-wrapper">
                        <div class="chart-title">פרמיה חודשית</div>
                        <canvas id="monthlyChart"></canvas>
                    </div>
                    <div class="chart-wrapper">
                        <div class="chart-title">פרמיות מצטברות</div>
                        <canvas id="cumulativeChart"></canvas>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    bodyElement.innerHTML = content;
    detailOverlay.classList.add('active');
    
    // Initialize calculator after DOM is ready
    setTimeout(() => {
        initPremiumCalculator();
    }, 100);
    
    return;
}

// Check if this is the target audience cell
if (cell.details.isTargetAudience) {
    bodyElement.className = 'detail-body target-audience-design';
    
    let content = `
        <div class="target-intro">
            <p>${cell.details.introduction}</p>
        </div>
        
        <div class="target-segments-container">
            <!-- סגמנט ראשון - עד גיל 55 -->
            <div class="target-segment primary-segment">
                <div class="segment-header">
                    <span class="segment-icon">🎯</span>
                    <h3>קהל היעד המרכזי: עד גיל 55</h3>
                </div>
                
                <div class="segment-content">
                    <div class="advantage-cards">
                        <div class="advantage-card">
                            <div class="advantage-icon">💰</div>
                            <div class="advantage-title">פרמיות אטרקטיביות</div>
                            <div class="advantage-value">₪16-243</div>
                            <div class="advantage-desc">נמוכות או תחרותיות מול קופות החולים</div>
                        </div>
                        
                        <div class="advantage-card">
                            <div class="advantage-icon">⏱️</div>
                            <div class="advantage-title">זמן צבירה נוח</div>
                            <div class="advantage-value">15-50 שנה</div>
                            <div class="advantage-desc">מספיק זמן לצבירה הדרגתית</div>
                        </div>

        <div class="advantage-card">
            <div class="advantage-icon">📈</div>
            <div class="advantage-title">תשואה מצטברת</div>
            <div class="advantage-value">4%-8% שנתי</div>
            <div class="advantage-desc">החיסכון צומח לאורך זמן</div>
        </div>
                        
                        <div class="advantage-card">
                            <div class="advantage-icon">✅</div>
                            <div class="advantage-title">חיתום נוח</div>
                            <div class="advantage-value">סיכון נמוך</div>
                            <div class="advantage-desc">סבירות גבוהה לאישור</div>
                        </div>
                    </div>
                </div>
            </div>
<!-- סגמנט שני - מעל גיל 55 -->
<div class="target-segment secondary-segment">
    <div class="segment-header">
        <span class="segment-icon">⚠️</span>
        <h3>כדאיות פוחתת: מעל גיל 55</h3>
    </div>
    
    <div class="segment-content">
        <div class="comparison-container">
            <div class="comparison-title">השוואת עלויות - דוגמה לגבר בן 55</div>
            
            <div class="comparison-cards">
                <div class="comparison-card new-model">
                    <div class="card-header">מודל חדש</div>
                    <div class="premium-amount">₪244</div>
                    <div class="premium-label">לחודש</div>
                    <div class="total-payments">
                        <span class="total-label">סה"כ עד גיל 70:</span>
                        <span class="total-value">₪43,920</span>
                    </div>
                </div>
                
                <div class="vs-indicator">VS</div>
                
                <div class="comparison-card kupot">
                    <div class="card-header">קופות חולים</div>
                    <div class="premium-amount">₪169</div>
                    <div class="premium-label">לחודש</div>
                    <div class="total-payments">
                        <span class="total-label">סה"כ עד גיל 70:</span>
                        <span class="total-value">₪30,420</span>
                    </div>
                </div>
            </div>
            
            <div class="price-difference">
                <div class="difference-badge">פער של 45% לרעת המודל החדש</div>
            </div>
            
            <div class="comparison-note" style="background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%); padding: 15px; border-radius: 8px; margin-top: 15px; border: 1px solid #10b981;">
                <div style="font-weight: 600; color: #059669; margin-bottom: 5px;">⚡ נקודה חשובה:</div>
                <div style="color: #064e3b; font-size: 0.95rem; line-height: 1.5;">
                    למרות הפרמיה החודשית הגבוהה והמצטברת עד גיל 70, <strong>המבוטח ישלם פחות במודל החדש לאורך חייו </strong> כיוון שהתשלום נפסק בגיל 70, בעוד שבקופות החולים התשלום נמשך כל החיים.
                </div>
            </div>
        </div>
        
        <div class="barriers-list">
            <h4>חסמי הצטרפות:</h4>
            <div class="barrier-item">
                <span class="barrier-icon">⏰</span>
                <span class="barrier-text">זמן צבירה קצר מדי (0-15 שנה בלבד)</span>
            </div>
            <div class="barrier-item">
                <span class="barrier-icon">🏥</span>
                <span class="barrier-text">חיתום רפואי בגילאים מבוגרים</span>
            </div>
            <div class="barrier-item">
                <span class="barrier-icon">💸</span>
                <span class="barrier-text">פרמיות גבוהות מאוד (עד ₪600 בגיל 60)</span>
            </div>
        </div>
    </div>
</div>
        </div>
        
        <div class="target-conclusion">
            <h3>💡 מסקנה</h3>
            <p>החיתום הרפואי והמחיר יוצרים "מנגנון שוק טבעי" שמכוון את המוצר לקהל היעד האופטימלי - צעירים ומבוגרים עד גיל 55, ללא צורך בהגבלה פורמלית.</p>
        </div>
    `;
    
    bodyElement.innerHTML = content;
    detailOverlay.classList.add('active');
    return;
}


// Check if this is the commissions cell
if (cell.details.isCommissions) {
    bodyElement.className = 'detail-body commissions-design';
    
    let content = `
        <div class="commissions-intro">
            <p>${cell.details.introduction}</p>
        </div>
        
        <div class="commissions-main-container">
            <!-- מצב נוכחי בענף -->
            <div class="market-problem-section">
                <div class="problem-header">
                    <span class="problem-icon">📊</span>
                    <h3>מצב נוכחי בענף ביטוחי הבריאות</h3>
                </div>
<div class="problem-content-new">
    <div class="problem-main">
        <div class="problem-stat-box">
            <div class="stat-number">25%~</div>
            <div class="stat-label">מהפרמיה</div>
        </div>
        <div class="problem-description">
            <p>שיעורי עמלות גבוהים מייקרים את המוצר ומקשים על נגישותו לציבור הרחב</p>
        </div>
    </div>
</div>
            </div>
            
            <!-- הגישה המוצעת -->
            <div class="solution-section">
                <div class="solution-header">
                    <span class="solution-icon">⚖️</span>
                    <h3>גישה מוצעת: הצמדה למודל פוליסות חיסכון</h3>
                </div>
                <div class="solution-cards">
                    <div class="solution-card">
                        <div class="card-icon">📊</div>
                        <div class="card-title">תקרת עמלה</div>
                        <div class="card-value">&lt;1%</div>
                        <div class="card-desc">מהצבירה השנתית</div>
                    </div>
                    <div class="solution-card">
                        <div class="card-icon">💰</div>
                        <div class="card-title">הפחתת עלויות</div>
                        <div class="card-value">משמעותית</div>
                        <div class="card-desc">חיסכון בעלויות השיווק</div>
                    </div>
                    <div class="solution-card">
                        <div class="card-icon">⚖️</div>
                        <div class="card-title">איזון</div>
                        <div class="card-value">הוגן</div>
                        <div class="card-desc">תגמול סביר למפיצים</div>
                    </div>
                </div>
            </div>
            
            <!-- נתוני רקע -->
            <div class="rationale-section">
                <div class="rationale-header">
                    <span class="rationale-icon">📈</span>
                    <h3>נתוני רקע ושיקולים</h3>
                </div>
                <div class="rationale-points">
                    <div class="rationale-item">
                        <div class="item-number">5M+</div>
                        <div class="item-content">
                            <div class="item-title">מבוטחים קיימים</div>
                            <div class="item-text">מעל 5 מיליון ישראלים מבוטחים כיום בביטוח סיעודי דרך קופות החולים</div>
                        </div>
                    </div>
                    <div class="rationale-item">
                        <div class="item-icon">🎯</div>
                        <div class="item-content">
                            <div class="item-title">מוצר מוכר</div>
                            <div class="item-text">ביטוח סיעודי הוא צורך מוכר עם מודעות ציבורית גבוהה - אינו דורש מאמצי שיווק חריגים</div>
                        </div>
                    </div>
                    <div class="rationale-item">
                        <div class="item-icon">💡</div>
                        <div class="item-content">
                            <div class="item-title">התאמה לשוק</div>
                            <div class="item-text">מבנה עמלות דומה למקובל בפוליסות חיסכון ארוכות טווח</div>
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- המלצות -->
            <div class="commissions-conclusion">
                <ul>
                    <li>הצמדה לסטנדרט של פוליסות חיסכון (&lt;1% מהצבירה)</li>
                    <li>שמירה על מחיר תחרותי ונגיש למבוטחים</li>
                    <li>תגמול הוגן וסביר לערוצי ההפצה</li>
                </ul>
            </div>
        </div>
    `;
    
    bodyElement.innerHTML = content;
    detailOverlay.classList.add('active');
    return;
}

// Check if this is the global review cell
if (cell.details.isGlobalReview) {
    bodyElement.className = 'detail-body global-review-design';
    
    let content = `
        <style>
            .global-review-design {
                background: linear-gradient(180deg, #f0f9ff 0%, #ffffff 100%);
                padding: 0;
            }
            
            .world-map-header {
                background: linear-gradient(135deg, #0ea5e9 0%, #2563eb 100%);
                padding: 2rem;
                text-align: center;
                color: white;
                position: relative;
                overflow: hidden;
            }
            
            .world-map-header::before {
                content: '🌍🌎🌏';
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                font-size: 8rem;
                opacity: 0.1;
                animation: rotate 30s linear infinite;
            }
            
            @keyframes rotate {
                from { transform: translate(-50%, -50%) rotate(0deg); }
                to { transform: translate(-50%, -50%) rotate(360deg); }
            }
            
            .header-content {
                position: relative;
                z-index: 1;
            }
            
            .header-title {
                font-size: 1.8rem;
                font-weight: 700;
                margin-bottom: 0.5rem;
            }
            
            .header-subtitle {
                font-size: 1.1rem;
                opacity: 0.95;
            }
            
            .countries-container {
                padding: 2rem;
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(380px, 1fr));
                gap: 1.5rem;
            }
            
            .country-card {
                background: white;
                border-radius: 16px;
                box-shadow: 0 4px 20px rgba(0,0,0,0.08);
                border: 2px solid transparent;
                transition: all 0.3s ease;
                overflow: hidden;
                animation: slideUp 0.5s ease forwards;
                opacity: 0;
            }
            
            @keyframes slideUp {
                from {
                    opacity: 0;
                    transform: translateY(20px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }
            
            .country-card:nth-child(1) { animation-delay: 0.1s; }
            .country-card:nth-child(2) { animation-delay: 0.2s; }
            .country-card:nth-child(3) { animation-delay: 0.3s; }
            .country-card:nth-child(4) { animation-delay: 0.4s; }
            .country-card:nth-child(5) { animation-delay: 0.5s; }
            .country-card:nth-child(6) { animation-delay: 0.6s; }
            
            .country-card:hover {
                transform: translateY(-5px);
                box-shadow: 0 8px 30px rgba(0,0,0,0.12);
                border-color: #3b82f6;
            }
            
            .usa-card { border-top: 4px solid #ef4444; }
            .singapore-card { border-top: 4px solid #f59e0b; }
            .china-card { border-top: 4px solid #dc2626; }
            .uae-card { border-top: 4px solid #10b981; }
            .netherlands-card { border-top: 4px solid #3b82f6; }
            .australia-card { border-top: 4px solid #8b5cf6; }
            
            .country-header {
                padding: 1.25rem;
                background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
                border-bottom: 1px solid #e2e8f0;
                display: flex;
                align-items: center;
                gap: 1rem;
            }
            
            .country-flag {
                font-size: 2.5rem;
                filter: drop-shadow(0 2px 4px rgba(0,0,0,0.1));
            }
            
            .country-info {
                flex: 1;
            }
            
            .country-name {
                font-size: 1.2rem;
                font-weight: 700;
                color: #1e293b;
                margin-bottom: 0.25rem;
            }
            
            .program-name {
                font-size: 0.9rem;
                color: #3b82f6;
                font-weight: 600;
            }
            
            .country-content {
                padding: 1.25rem;
            }
            
            .country-description {
                color: #475569;
                line-height: 1.6;
                margin-bottom: 1rem;
                font-size: 1.05rem;
            }
            
            .features-list {
                display: flex;
                flex-direction: column;
                gap: 0.5rem;
            }
            
            .feature-item {
                display: flex;
                align-items: flex-start;
                gap: 0.75rem;
                padding: 0.5rem;
                background: #f8fafc;
                border-radius: 8px;
                transition: all 0.2s ease;
            }
            
            .feature-item:hover {
                background: #e0f2fe;
                transform: translateX(-3px);
            }
            
            .feature-icon {
                font-size: 1rem;
                margin-top: 2px;
            }
            
            .feature-text {
                flex: 1;
                font-size: 1rem;
                color: #1e293b;
                line-height: 1.4;
            }
            
            .summary-section {
                margin: 2rem;
                padding: 1.5rem;
                background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
                border-radius: 12px;
                border: 2px solid #fbbf24;
            }
            
            .summary-title {
                font-size: 1.2rem;
                font-weight: 700;
                color: #92400e;
                margin-bottom: 1rem;
                text-align: center;
            }
            
            .summary-content {
                color: #78350f;
                line-height: 1.6;
            }
            
            .insights-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
                gap: 1rem;
                margin-top: 1rem;
            }
            
            .insight-card {
                background: white;
                padding: 1rem;
                border-radius: 8px;
                border-right: 4px solid #f59e0b;
            }
            
            .insight-title {
                font-weight: 600;
                color: #92400e;
                margin-bottom: 0.5rem;
            }
            
            .insight-text {
                font-size: 0.9rem;
                color: #78350f;
            }
        </style>
        
        <div class="world-map-header">
            <div class="header-content">
                <div class="header-title">מודלים גלובליים לחיסכון רפואי</div>
                <div class="header-subtitle">למידה מהניסיון הבינלאומי</div>
            </div>
        </div>
        
        <div class="countries-container">
            <!-- USA -->
            <div class="country-card usa-card">
                <div class="country-header">
                    <span class="country-flag">🇺🇸</span>
                    <div class="country-info">
                        <div class="country-name">ארצות הברית</div>
                        <div class="program-name">Health Savings Account (HSA)</div>
                    </div>
                </div>
                <div class="country-content">
                    <div class="country-description">
                        חשבון חיסכון רפואי אישי עם הטבות מס משמעותיות, מותנה בביטוח עם השתתפות עצמית גבוהה (HDHP).
                    </div>
                    <div class="features-list">
                        <div class="feature-item">
                            <span class="feature-icon">💰</span>
                            <span class="feature-text">הפקדות לפני מס - חיסכון מיידי</span>
                        </div>
                        <div class="feature-item">
                            <span class="feature-icon">📈</span>
                            <span class="feature-text">צמיחה פטורה ממס</span>
                        </div>
                        <div class="feature-item">
                            <span class="feature-icon">🔄</span>
                            <span class="feature-text">משיכות פטורות למטרות רפואיות</span>
                        </div>
                        <div class="feature-item">
                            <span class="feature-icon">🎯</span>
                            <span class="feature-text">תקרת הפקדה שנתית: $4,150 ליחיד</span>
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- Singapore -->
            <div class="country-card singapore-card">
                <div class="country-header">
                    <span class="country-flag">🇸🇬</span>
                    <div class="country-info">
                        <div class="country-name">סינגפור</div>
                        <div class="program-name">Medisave</div>
                    </div>
                </div>
                <div class="country-content">
                    <div class="country-description">
                        חשבון חובה כחלק מה-CPF, עם הפקדה אוטומטית מהמשכורת למטרות כיסוי הוצאות רפואיות ושירותים משפחתיים.
                    </div>
                    <div class="features-list">
                        <div class="feature-item">
                            <span class="feature-icon">⚖️</span>
                            <span class="feature-text">חובה לכל העובדים</span>
                        </div>
                        <div class="feature-item">
                            <span class="feature-icon">🏛️</span>
                            <span class="feature-text">ניהול ממשלתי מרכזי</span>
                        </div>
                        <div class="feature-item">
                            <span class="feature-icon">👨‍👩‍👧‍👦</span>
                            <span class="feature-text">שימוש משפחתי</span>
                        </div>
                        <div class="feature-item">
                            <span class="feature-icon">📊</span>
                            <span class="feature-text">8-10.5% מהמשכורת</span>
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- China -->
            <div class="country-card china-card">
                <div class="country-header">
                    <span class="country-flag">🇨🇳</span>
                    <div class="country-info">
                        <div class="country-name">סין</div>
                        <div class="program-name">Medical Savings Account</div>
                    </div>
                </div>
                <div class="country-content">
                    <div class="country-description">
                        חשבון חיסכון עירוני עם הפקדות חודשיות לכיסוי הוצאות רפואיות, כחלק מביטוח רפואי עירוני.
                    </div>
                    <div class="features-list">
                        <div class="feature-item">
                            <span class="feature-icon">🏙️</span>
                            <span class="feature-text">מוגבל לערים מסוימות</span>
                        </div>
                        <div class="feature-item">
                            <span class="feature-icon">🏥</span>
                            <span class="feature-text">כיסוי שירותים בסיסיים</span>
                        </div>
                        <div class="feature-item">
                            <span class="feature-icon">💳</span>
                            <span class="feature-text">הפקדות חודשיות קבועות</span>
                        </div>
                        <div class="feature-item">
                            <span class="feature-icon">🔗</span>
                            <span class="feature-text">משולב עם ביטוח ציבורי</span>
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- UAE -->
            <div class="country-card uae-card">
                <div class="country-header">
                    <span class="country-flag">🇦🇪</span>
                    <div class="country-info">
                        <div class="country-name">איחוד האמירויות</div>
                        <div class="program-name">חשבון חיסכון במסגרת ביטוח פרטי</div>
                    </div>
                </div>
                <div class="country-content">
                    <div class="country-description">
                        מוצרים פיננסיים בתוך ביטוח פרטי עם רכיב חיסכון לטיפולים שאינם מכוסים. אין מערכת ממשלתית רשמית.
                    </div>
                    <div class="features-list">
                        <div class="feature-item">
                            <span class="feature-icon">🏢</span>
                            <span class="feature-text">חלק מביטוח פרטי</span>
                        </div>
                        <div class="feature-item">
                            <span class="feature-icon">❌</span>
                            <span class="feature-text">ללא הטבות מס</span>
                        </div>
                        <div class="feature-item">
                            <span class="feature-icon">🎯</span>
                            <span class="feature-text">מיועד לטיפולים משלימים</span>
                        </div>
                        <div class="feature-item">
                            <span class="feature-icon">📝</span>
                            <span class="feature-text">וולונטרי לחלוטין</span>
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- Netherlands -->
            <div class="country-card netherlands-card">
                <div class="country-header">
                    <span class="country-flag">🇳🇱</span>
                    <div class="country-info">
                        <div class="country-name">הולנד</div>
                        <div class="program-name">חשבון חיסכון רפואי פרטי</div>
                    </div>
                </div>
                <div class="country-content">
                    <div class="country-description">
                        חשבון מיוחד למיעוט (פטורים ביטוחיים), עם השתתפות עצמית חובה (eigen risico) והקלות לעשירונים נמוכים.
                    </div>
                    <div class="features-list">
                        <div class="feature-item">
                            <span class="feature-icon">🎯</span>
                            <span class="feature-text">לא נפוץ - למקרים מיוחדים</span>
                        </div>
                        <div class="feature-item">
                            <span class="feature-icon">💶</span>
                            <span class="feature-text">השתתפות עצמית: €385</span>
                        </div>
                        <div class="feature-item">
                            <span class="feature-icon">🤝</span>
                            <span class="feature-text">הקלות לעשירונים נמוכים</span>
                        </div>
                        <div class="feature-item">
                            <span class="feature-icon">🔄</span>
                            <span class="feature-text">גמישות בהשתתפות העצמית</span>
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- Australia -->
            <div class="country-card australia-card">
                <div class="country-header">
                    <span class="country-flag">🇦🇺</span>
                    <div class="country-info">
                        <div class="country-name">אוסטרליה</div>
                        <div class="program-name">HSA (הצעה - לא יושם)</div>
                    </div>
                </div>
                <div class="country-content">
                    <div class="country-description">
                        הצעה ל-HSA וולונטרי בדומה ל-Superannuation הפנסיוני. נדון אך טרם יושם רשמית במערכת הבריאות.
                    </div>
                    <div class="features-list">
                        <div class="feature-item">
                            <span class="feature-icon">📋</span>
                            <span class="feature-text">בשלב הצעה בלבד</span>
                        </div>
                        <div class="feature-item">
                            <span class="feature-icon">🎯</span>
                            <span class="feature-text">קיים מודל פנסיוני</span>
                        </div>
                        <div class="feature-item">
                            <span class="feature-icon">💰</span>
                            <span class="feature-text">הטבות מס פוטנציאליות</span>
                        </div>
                        <div class="feature-item">
                            <span class="feature-icon">🔮</span>
                            <span class="feature-text">וולונטרי אם ייושם</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        
        <div class="summary-section">
            <div class="summary-title">💡 תובנות מרכזיות מהסקירה הגלובלית</div>
            <div class="summary-content">
                <div class="insights-grid">
                    <div class="insight-card">
                        <div class="insight-title">🎯 מגוון גישות</div>
                        <div class="insight-text">מחובה ממשלתית (סינגפור) ועד וולונטרי מלא (ארה"ב)</div>
                    </div>
                    <div class="insight-card">
                        <div class="insight-title">💰 הטבות מס</div>
                        <div class="insight-text">במרבית המדינות - תמריץ מרכזי להצטרפות</div>
                    </div>
                    <div class="insight-card">
                        <div class="insight-title">🔄 גמישות</div>
                        <div class="insight-text">איזון בין חיסכון לטווח ארוך לנגישות בעת הצורך</div>
                    </div>
                </div>
                <p style="margin-top: 1.5rem; text-align: center; font-weight: 600;">
                    המודל החדש משלב אלמנטים מוצלחים: חיסכון אישי כמו ב-HSA האמריקאי, 
עם מעבר אוטומטי לביטוח בגיל מבוגר בדומה לגישה הסינגפורית.
                </p>
            </div>
        </div>
    `;
    
    bodyElement.innerHTML = content;
    detailOverlay.classList.add('active');
    return;
}
// Check if this is the regulation cell
if (cell.details.isRegulation) {
    bodyElement.className = 'detail-body regulation-design';
    
    let content = `
        <style>
            .regulation-design {
                background: linear-gradient(180deg, #f8fafc 0%, #ffffff 100%);
                padding: 2rem;
            }
            
            .regulation-tabs {
                display: flex;
                background: white;
                border-radius: 12px;
                padding: 0.5rem;
                margin-bottom: 2rem;
                box-shadow: 0 2px 10px rgba(0,0,0,0.05);
            }
            
            .regulation-tab {
                flex: 1;
                padding: 1rem;
                background: transparent;
                border: none;
                border-radius: 8px;
                cursor: pointer;
                font-size: 1rem;
                font-weight: 600;
                color: #64748b;
                transition: all 0.3s ease;
            }
            
            .regulation-tab.active {
                background: linear-gradient(135deg, #3b82f6, #2563eb);
                color: white;
            }
            
            .regulation-tab:hover:not(.active) {
                background: #f1f5f9;
            }
            
            .tab-content {
                display: none;
            }
            
            .tab-content.active {
                display: block;
            }
            
            .timeline-item {
                position: relative;
                padding-left: 3rem;
                margin-bottom: 2rem;
            }
            
            .timeline-dot {
                position: absolute;
                left: 0.5rem;
                top: 0.5rem;
                width: 16px;
                height: 16px;
                background: white;
                border: 3px solid #3b82f6;
                border-radius: 50%;
            }
            
            .timeline-item.completed .timeline-dot {
                background: #3b82f6;
            }
            
            .timeline-item.pending .timeline-dot {
                background: #fbbf24;
                border-color: #fbbf24;
            }
            
            .timeline-content {
                background: white;
                padding: 1.25rem;
                border-radius: 12px;
                box-shadow: 0 2px 10px rgba(0,0,0,0.05);
                border: 1px solid #e2e8f0;
            }
            
            .timeline-title {
                font-weight: 600;
                color: #1e293b;
                margin-bottom: 0.5rem;
            }
            
            .timeline-description {
                color: #64748b;
                font-size: 0.95rem;
            }
            
            .timeline-status {
                display: inline-block;
                padding: 0.25rem 0.75rem;
                border-radius: 20px;
                font-size: 0.8rem;
                font-weight: 600;
                margin-top: 0.5rem;
            }
            
            .status-completed {
                background: #dcfce7;
                color: #15803d;
            }
            
            .status-pending {
                background: #fef3c7;
                color: #a16207;
            }
            
            .status-future {
                background: #f1f5f9;
                color: #64748b;
            }
            
            .risk-card {
                background: white;
                padding: 1.5rem;
                border-radius: 12px;
                margin-bottom: 1.5rem;
                border: 2px solid #e2e8f0;
            }
            
            .risk-card.high {
                border-color: #fca5a5;
                background: linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%);
            }
            
            .simulator-container {
                background: white;
                border-radius: 16px;
                box-shadow: 0 4px 20px rgba(0,0,0,0.08);
                padding: 2rem;
                margin-top: 2rem;
            }
            
            .slider-group {
                margin-bottom: 0.1rem;
            }
            
            .slider-label {
                display: flex;
                justify-content: space-between;
                margin-bottom: 0.5rem;
                font-weight: 500;
            }
            
            .slider-value {
                color: #2563eb;
                font-weight: 700;
            }
            
            .slider-input {
                width: 100%;
                height: 8px;
                -webkit-appearance: none;
                background: linear-gradient(to right, #dbeafe 0%, #93c5fd 100%);
                border-radius: 4px;
                outline: none;
            }
            
            .slider-input::-webkit-slider-thumb {
                -webkit-appearance: none;
                width: 20px;
                height: 20px;
                background: #2563eb;
                border-radius: 50%;
                cursor: pointer;
            }
            
            .deficit-value {
                font-size: 2rem;
                font-weight: 700;
                text-align: center;
                margin: 1rem 0;
            }

.regulation-design h3 {
    font-size: 1.5rem !important;
    font-weight: 700 !important;
    color: #1e293b !important;
    margin-bottom: 30px !important;
    padding-bottom: 15px !important;
    border-bottom: 3px solid transparent !important;
    background: linear-gradient(90deg, #3b82f6 0%, #0ea5e9 30%, transparent 70%) bottom / 100% 3px no-repeat !important;
    position: relative !important;
}
        </style>
        
        <div class="regulation-tabs">
            <button class="regulation-tab active" data-tab="new">
                🆕 רגולציה למוצר החדש
            </button>
            <button class="regulation-tab" data-tab="existing">
                📊 רגולציה למוצר הקיים
            </button>
        </div>
        
        <!-- Tab 1: New Product -->
        <div data-content="new" class="tab-content active">
            <h3 class="regulation-title">⚡ צעדים מיידיים להשקת המוצר</h3>
            
            <div class="timeline-item completed">
                <div class="timeline-dot"></div>
                <div class="timeline-content">
                    <div class="timeline-title">📝 פרסום חוזר המוצר החדש</div>
                    <div class="timeline-description">
                        החוזר מוכן ומחכה לפרסום. מגדיר את מבנה המוצר, דרישות ההון, וכללי החיתום.
                    </div>
                    <span class="timeline-status status-completed">הושלם</span>
                </div>
            </div>
            
            <div class="timeline-item">
                <div class="timeline-dot"></div>
                <div class="timeline-content">
                    <div class="timeline-title">💰 פרה-רולינג מול רשות המיסים</div>
                    <div class="timeline-description">
                        בדיקת הטבות המס למוצר החדש - האם דרך הרשות או דרך חברות הביטוח.
                    </div>
                    <span class="timeline-status status-future">מתוכנן</span>
                </div>
            </div>
            
            <div class="timeline-item">
                <div class="timeline-dot"></div>
                <div class="timeline-content">
                    <div class="timeline-title">✅ אישור פוליסות</div>
                    <div class="timeline-description">
                        הקמת מנגנון לאישור מהיר של פוליסות חדשות.
                    </div>
                    <span class="timeline-status status-future">מתוכנן</span>
                </div>
            </div>
            
            <div class="timeline-item">
                <div class="timeline-dot"></div>
                <div class="timeline-content">
                    <div class="timeline-title">📢 פרסום לציבור והערות</div>
                    <div class="timeline-description">
                        פרסום מסמך מדיניות מפורט והיוועצות עם הציבור.
                    </div>
                    <span class="timeline-status status-future">מתוכנן</span>
                </div>
            </div>
            
            <h3 class="regulation-title">⚠️ מניעת ניצול - "טוויסטינג"</h3>
            
            <div class="risk-card high">
                <h4 style="color: #dc2626; margin-bottom: 1rem;">🔄 הסיכון המרכזי</h4>
                <p style="color: #7f1d1d; margin-bottom: 1rem;">
                    חברות ביטוח עלולות לנסות להעביר מבוטחים מפוליסות ישנות (הפסדיות לחברות) למוצר החדש (רווחי לחברות).
                </p>
                
            </div>
        </div>
        
<!-- Tab 2: Existing Product -->
<div data-content="existing" class="tab-content">
    <h3 class="regulation-title">🏥 ניהול המוצר הקיים בקופות החולים</h3>
    
    <div style="padding: 1.5rem; background: linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%); border-radius: 12px; margin-bottom: 2rem;">
        <h4 style="color: #dc2626;">⚠️ האתגר המרכזי</h4>
        <p style="color: #7f1d1d;">
            עזיבה המונית של צעירים תוביל לגירעון קצה של 16 מיליארד ₪.
            הפתרון: מעבר לקרן מאוחדת וכלי איזון.
        </p>
    </div>
    
    <div class="simulator-container">
        <div class="simulator-header">
    <h3 class="regulation-title">🖥️ סימולטור איזון המוצר הקיים</h3>
</div>
        
        <div style="display: grid; grid-template-columns: 40% 60%; gap: 2rem;">
            <div>
                <!-- סרגל 1: העלאת פרמיות -->
                <div class="slider-group">
                    <div class="slider-label">
                        <span>העלאת פרמיות</span>
                        <span class="slider-value"><span class="prem-val">0</span>%</span>
                    </div>
                    <input type="range" class="slider-input prem-slider" min="0" max="20" value="0">
                    <div style="font-size: 0.85rem; color: #059669; margin-top: 0.5rem;" class="prem-impact">השפעה: 0 מיליארד ₪</div>
                </div>
                
                <!-- סרגל 2: הקטנת תביעות -->
                <div class="slider-group">
                    <div class="slider-label">
                        <span>הקטנת תביעות</span>
                        <span class="slider-value"><span class="claim-val">0</span>%</span>
                    </div>
                    <input type="range" class="slider-input claim-slider" min="0" max="20" value="0">
                    <div style="font-size: 0.85rem; color: #059669; margin-top: 0.5rem;" class="claim-impact">השפעה: 0 מיליארד ₪</div>
                </div>
                
                <!-- סרגל 3: תקופת המתנה -->
                <div class="slider-group">
                    <div class="slider-label">
                        <span>תקופת המתנה</span>
                        <span class="slider-value waiting-val">ללא שינוי</span>
                    </div>
                    <input type="range" class="slider-input waiting-slider" min="0" max="3" value="0">
                    <div style="font-size: 0.85rem; color: #059669; margin-top: 0.5rem;" class="waiting-impact">השפעה: 0 מיליארד ₪</div>
                </div>
                
                <!-- סרגל 4: קיצור תקופת זכאות -->
                <div class="slider-group">
                    <div class="slider-label">
                        <span>קיצור תקופת זכאות</span>
                        <span class="slider-value eligibility-val">ללא שינוי</span>
                    </div>
                    <input type="range" class="slider-input eligibility-slider" min="0" max="1" value="0">
                    <div style="font-size: 0.85rem; color: #059669; margin-top: 0.5rem;" class="eligibility-impact">השפעה: 0 מיליארד ₪</div>
                </div>
                
                <!-- סרגל 5: יתרת קרן קיימת -->
                <div class="slider-group">
                    <div class="slider-label">
                        <span>יתרת קרן קיימת</span>
                        <span class="slider-value"><span class="fund-val">0</span> מיליארד ₪</span>
                    </div>
                    <input type="range" class="slider-input fund-slider" min="0" max="9" value="0">
                    <div style="font-size: 0.85rem; color: #059669; margin-top: 0.5rem;" class="fund-impact">השפעה: 0 מיליארד ₪</div>
                </div>
            </div>
            
            <!-- תצוגת התוצאה בעיצוב חדש -->
            <div style="display: flex; align-items: center; justify-content: center; padding: 2rem 0;">
    <div style="background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%); border: 3px solid #cbd5e1; padding: 3.5rem 4rem; border-radius: 24px; text-align: center; box-shadow: 0 15px 50px rgba(59, 130, 246, 0.15); min-width: 400px; position: relative;">
        <!-- הוספת אפקט זוהר -->
        <div style="position: absolute; top: -2px; left: -2px; right: -2px; bottom: -2px; background: linear-gradient(135deg, #e2e8f0, #cbd5e1); border-radius: 24px; opacity: 0.1; z-index: -1;"></div>
                   <h4 class="deficit-title" style="font-size: 1.3rem; color: #1e293b; margin-bottom: 2rem; font-weight: 600; letter-spacing: 0.5px;">גירעון צפוי לאחר הפעולות</h4>
                    <div class="deficit-amount" style="font-size: 4.5rem; font-weight: 800; color: #dc2626; margin-bottom: 1rem; line-height: 1;">16</div>
                    <div style="font-size: 1.2rem; color: #94a3b8; font-weight: 500;">מיליארד ₪</div>
                    <div style="margin-top: 2rem; padding-top: 2rem; border-top: 2px solid #e2e8f0;">
                        <div style="display: flex; justify-content: space-around; font-size: 1.1rem;">
                            <div>
                                <div style="color: #94a3b8;">פרמיות</div>
                                <div style="color: #22c55e; font-weight: 600;" class="total-premiums">45</div>
                            </div>
                            <div>
                                <div style="color: #94a3b8;">תביעות</div>
                                <div style="color: #ef4444; font-weight: 600;" class="total-claims">-61</div>
                            </div>
                            <div>
                                <div style="color: #94a3b8;">קרן</div>
                                <div style="color: #3b82f6; font-weight: 600;" class="total-fund">0</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>

    `;
    
    bodyElement.innerHTML = content;
    detailOverlay.classList.add('active');
    
    // Add event listeners after content is loaded
    setTimeout(() => {
        // Tab switching
        const tabs = bodyElement.querySelectorAll('.regulation-tab');
        const contents = bodyElement.querySelectorAll('.tab-content');
        
        tabs.forEach(tab => {
            tab.addEventListener('click', function() {
                // Remove active from all
                tabs.forEach(t => t.classList.remove('active'));
                contents.forEach(c => c.classList.remove('active'));
                
                // Add active to clicked
                this.classList.add('active');
                const targetContent = bodyElement.querySelector(`[data-content="${this.dataset.tab}"]`);
                if (targetContent) {
                    targetContent.classList.add('active');
                }
            });
        });
        
// Simulator functionality
const waitingPeriodValues = {
    0: { text: 'ללא שינוי', impact: 0 },
    1: { text: 'חצי שנה', impact: 10 },
    2: { text: '9 חודשים', impact: 15 },
    3: { text: 'שנה', impact: 20 }
};

const eligibilityValues = {
    0: { text: 'ללא שינוי', impact: 0 },
    1: { text: 'קיצור ל-4 שנים', impact: 10 }
};

function updateSimulator() {
    const basePremiums = 45;
    const baseClaims = -56;
    const baseExpenses = -5;
    
    const premValue = parseFloat(bodyElement.querySelector('.prem-slider').value) || 0;
    const claimValue = parseFloat(bodyElement.querySelector('.claim-slider').value) || 0;
    const waitingValue = parseInt(bodyElement.querySelector('.waiting-slider').value) || 0;
    const eligibilityValue = parseInt(bodyElement.querySelector('.eligibility-slider').value) || 0;
    const fundValue = parseFloat(bodyElement.querySelector('.fund-slider').value) || 0;
    
    // חישוב השפעות
    const premAdjust = basePremiums * premValue / 100;
    const claimAdjust = Math.abs(baseClaims) * claimValue / 100;
    const waitingAdjust = Math.abs(baseClaims) * waitingPeriodValues[waitingValue].impact / 100;
    const eligibilityAdjust = Math.abs(baseClaims) * eligibilityValues[eligibilityValue].impact / 100;
    
    // עדכון תצוגת השפעות
    bodyElement.querySelector('.prem-impact').textContent = `השפעה: +${premAdjust.toFixed(1)} מיליארד ₪`;
    bodyElement.querySelector('.claim-impact').textContent = `השפעה: +${claimAdjust.toFixed(1)} מיליארד ₪`;
    bodyElement.querySelector('.waiting-impact').textContent = `השפעה: +${waitingAdjust.toFixed(1)} מיליארד ₪`;
    bodyElement.querySelector('.eligibility-impact').textContent = `השפעה: +${eligibilityAdjust.toFixed(1)} מיליארד ₪`;
    bodyElement.querySelector('.fund-impact').textContent = `השפעה: +${fundValue} מיליארד ₪`;
    
    // חישוב סופי
    const newPremiums = basePremiums + premAdjust;
    const newClaims = baseClaims + claimAdjust + waitingAdjust + eligibilityAdjust;
    const total = newPremiums + newClaims + baseExpenses + fundValue;
    
    // עדכון תצוגה
    const deficitEl = bodyElement.querySelector('.deficit-amount');
    const titleEl = bodyElement.querySelector('.deficit-title');
    
    // עדכון המספרים בתחתית
    bodyElement.querySelector('.total-premiums').textContent = newPremiums.toFixed(1);
    bodyElement.querySelector('.total-claims').textContent = (newClaims + baseExpenses).toFixed(1);
    bodyElement.querySelector('.total-fund').textContent = fundValue;
    
    if (total >= 0) {
        deficitEl.textContent = total.toFixed(1);
        deficitEl.style.color = '#22c55e';
        titleEl.textContent = 'עודף צפוי לאחר הפעולות';
    } else {
        deficitEl.textContent = Math.abs(total).toFixed(1);
        deficitEl.style.color = '#dc2626';
        titleEl.textContent = 'גירעון צפוי לאחר הפעולות';
    }
}

// Event listeners for all sliders
const premSlider = bodyElement.querySelector('.prem-slider');
if (premSlider) {
    premSlider.addEventListener('input', function() {
        bodyElement.querySelector('.prem-val').textContent = this.value;
        updateSimulator();
    });
}

const claimSlider = bodyElement.querySelector('.claim-slider');
if (claimSlider) {
    claimSlider.addEventListener('input', function() {
        bodyElement.querySelector('.claim-val').textContent = this.value;
        updateSimulator();
    });
}

const waitingSlider = bodyElement.querySelector('.waiting-slider');
if (waitingSlider) {
    waitingSlider.addEventListener('input', function() {
        const val = parseInt(this.value);
        bodyElement.querySelector('.waiting-val').textContent = waitingPeriodValues[val].text;
        updateSimulator();
    });
}

const eligibilitySlider = bodyElement.querySelector('.eligibility-slider');
if (eligibilitySlider) {
    eligibilitySlider.addEventListener('input', function() {
        const val = parseInt(this.value);
        bodyElement.querySelector('.eligibility-val').textContent = eligibilityValues[val].text;
        updateSimulator();
    });
}

const fundSlider = bodyElement.querySelector('.fund-slider');
if (fundSlider) {
    fundSlider.addEventListener('input', function() {
        bodyElement.querySelector('.fund-val').textContent = this.value;
        updateSimulator();
    });
}
    }, 100);
    
    return;
}

// Check if this is the financial impact cell
if (cell.details.isFinancialImpact) {
    bodyElement.className = 'detail-body financial-impact-design';
    
    let content = `
        <div class="financial-intro">
            <p>${cell.details.introduction}</p>
        </div>
        
        <div class="financial-main-container">
            <!-- סיכום השוואתי מרכזי -->
            <div class="comparison-summary-section">
                <h3 class="financial-title">השוואת עלויות מצטברות - דוגמאות מייצגות</h3>
                <div class="comparison-grid">
                    <div class="age-comparison-card">
                        <div class="age-header">
                            <span class="age-icon">🧑</span>
                            <span class="age-label">גיל 30</span>
                        </div>
                        <div class="comparison-values">
                            <div class="model-value new">
                                <span class="model-name">מודל חדש</span>
                                <span class="monthly">₪74/חודש</span>
                                <span class="total">₪35,520 סה"כ עד גיל 70</span>
                                <span class="savings-badge">חיסכון 73%</span>
                            </div>
                            <div class="model-value current">
                                <span class="model-name">קופות חולים</span>
                                <span class="monthly">₪40-390/חודש</span>
                                <span class="total">₪132,000 סה"כ עד גיל 85</span>
                            </div>
                        </div>
                    </div>
                    
                    <div class="age-comparison-card">
                        <div class="age-header">
                            <span class="age-icon">👨</span>
                            <span class="age-label">גיל 45</span>
                        </div>
                        <div class="comparison-values">
                            <div class="model-value new">
                                <span class="model-name">מודל חדש</span>
                                <span class="monthly">₪164/חודש</span>
                                <span class="total">₪49,200 סה"כ עד גיל 70</span>
                                <span class="savings-badge">חיסכון 58%</span>
                            </div>
                            <div class="model-value current">
                                <span class="model-name">קופות חולים</span>
                                <span class="monthly">₪147-390/חודש</span>
                                <span class="total">₪117,600 סה"כ עד גיל 85</span>
                            </div>
                        </div>
                    </div>
                    
                    <div class="age-comparison-card highlight">
                        <div class="age-header">
                            <span class="age-icon">👴</span>
                            <span class="age-label">גיל 60</span>
                        </div>
                        <div class="comparison-values">
                            <div class="model-value new">
                                <span class="model-name">מודל חדש</span>
                                <span class="monthly">₪600/חודש</span>
                                <span class="total">₪72,000 סה"כ עד גיל 70</span>
                                <span class="neutral-badge">פרמיה גבוהה</span>
                            </div>
                            <div class="model-value current">
                                <span class="model-name">קופות חולים</span>
                                <span class="monthly">₪301-390/חודש</span>
                                <span class="total">₪91,800 סה"כ עד גיל 85</span>
                                <span class="note">אך במצטבר עדיין זול יותר!</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- השפעה לפי קבוצות גיל -->
            <div class="age-groups-impact">
               <h3 class="financial-title">ניתוח השפעות לפי קבוצות גיל</h3>
                
                <div class="impact-cards">
                    <div class="impact-card young">
                        <div class="card-header">
                            <span class="header-icon">🎯</span>
                            <h4>צעירים עד גיל 40</h4>
                        </div>
                        <div class="impact-metrics">
                            <div class="metric">
                                <span class="metric-label">חיסכון בפרמיה חודשית</span>
                                <span class="metric-value positive">60-75%</span>
                            </div>
                            <div class="metric">
                                <span class="metric-label">חיסכון מצטבר</span>
                                <span class="metric-value positive">70%+</span>
                            </div>
                            <div class="metric">
                                <span class="metric-label">יתרון נוסף</span>
                                <span class="metric-text">הכסף נצבר כחיסכון אישי</span>
                            </div>
                        </div>
                    </div>
                    
                    <div class="impact-card middle">
                        <div class="card-header">
                            <span class="header-icon">⚖️</span>
                            <h4>מבוגרים 40-55</h4>
                        </div>
                        <div class="impact-metrics">
                            <div class="metric">
                                <span class="metric-label">חיסכון בפרמיה חודשית</span>
                                <span class="metric-value positive">20-40%</span>
                            </div>
                            <div class="metric">
                                <span class="metric-label">חיסכון מצטבר</span>
                                <span class="metric-value positive">50-60%</span>
                            </div>
                            <div class="metric">
                                <span class="metric-label">יתרון נוסף</span>
                                <span class="metric-text">גמישות בבחירת מסלול השקעה</span>
                            </div>
                        </div>
                    </div>
                    
                    <div class="impact-card senior">
                        <div class="card-header">
                            <span class="header-icon">⚠️</span>
                            <h4>מבוגרים מעל 55</h4>
                        </div>
                        <div class="impact-metrics">
                            <div class="metric">
                                <span class="metric-label">פרמיה חודשית</span>
                                <span class="metric-value negative">גבוהה ב-45%</span>
                            </div>
                            <div class="metric">
                                <span class="metric-label">אך במצטבר עד גיל 85</span>
                                <span class="metric-value neutral">דומה או זול יותר</span>
                            </div>
                            <div class="metric">
                                <span class="metric-label">נקודה חשובה</span>
                                <span class="metric-text">תשלום עד גיל 70 בלבד</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- יתרונות כלכליים מובנים -->
            <div class="economic-advantages">
                <h3 class="financial-title">יתרונות כלכליים מובנים במודל החדש</h3>
                
                <div class="advantages-grid">
                    <div class="advantage-item">
                        <div class="advantage-header">
                            <span class="adv-icon">📈</span>
                            <h4>תשואות שוק ההון</h4>
                        </div>
                        <div class="advantage-content">
                            <p>בחירה בין מסלולי השקעה:</p>
                            <div class="investment-tracks">
                                <div class="track">
                                    <span class="track-name">סיכון נמוך</span>
                                    <span class="track-return">2-3%</span>
                                </div>
                                <div class="track">
                                    <span class="track-name">סיכון בינוני</span>
                                    <span class="track-return">4-6%</span>
                                </div>
                                <div class="track">
                                    <span class="track-name">סיכון גבוה</span>
                                    <span class="track-return">7-9%</span>
                                </div>
                            </div>
                            <p class="advantage-note">לעומת ריבית סולידית במודל הקיים</p>
                        </div>
                    </div>
                    
                    <div class="advantage-item">
                        <div class="advantage-header">
                            <span class="adv-icon">💰</span>
                            <h4>הפחתת עלויות תפעול</h4>
                        </div>
                        <div class="advantage-content">
                            <div class="cost-comparison">
                                <div class="cost-item old">
                                    <span class="cost-label">דמי ניהול חברות ביטוח</span>
                                    <span class="cost-value">~5%</span>
                                </div>
                                <div class="cost-item old">
                                    <span class="cost-label">החזר הוצאות קופות</span>
                                    <span class="cost-value">~3%</span>
                                </div>
                                <div class="cost-item new">
                                    <span class="cost-label">דמי ניהול מודל חדש</span>
                                    <span class="cost-value"><1%</span>
                                </div>
                            </div>
                            <div class="total-savings">חיסכון של 7% בעלויות תפעול</div>
                        </div>
                    </div>
                    
                    <div class="advantage-item">
                        <div class="advantage-header">
                            <span class="adv-icon">🔄</span>
                            <h4>גמישות פיננסית</h4>
                        </div>
                        <div class="advantage-content">
                            <ul class="flexibility-list">
                                <li>אפשרות להעברת כספים מקופות גמל אחרות</li>
                                <li>החיסכון בבעלות המבוטח עד גיל 70</li>
                                <li>הבטחות מובנות במוצר</li>
                                <li>ירושה במקרה פטירה לפני גיל 70</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- השפעה על השוק הקיים -->
            <div class="market-impact-section">
                <h3 class="financial-title">השפעה צפויה על השוק הקיים</h3>
                
                <div class="market-scenarios">
                    <div class="scenario-card">
                        <div class="scenario-header">
                            <span class="scenario-icon">📉</span>
                            <h4>תרחיש לטווח קצר</h4>
                        </div>
                        <div class="scenario-content">
                            <p>נטישת צעירים את המודל הקיים תוביל לעלייה חדה בפרמיות למבוגרים שיישארו בקופות החולים.</p>
                        </div>
                    </div>
                    
                    <div class="scenario-card">
                        <div class="scenario-header">
                            <span class="scenario-icon">🏛️</span>
                            <h4>תרחיש לטווח בינוני</h4>
                        </div>
            <div class="scenario-content">
                <p>סביר להניח מעבר לקרן מאוחדת עם פרמיה אחידה לכל המבוטחים, כפתרון חירום למשבר.</p>
            </div>
                    </div>
                </div>
            </div>
            
            <!-- סיכום מנהלים -->
            <div class="executive-summary">
                <h3 class="financial-title">💡 תובנות מרכזיות</h3>
                <div class="insights-grid">
                    <div class="insight">
                        <span class="insight-number">1</span>
                        <span class="insight-text">המודל החדש מייצר חיסכון משמעותי לרוב המבוטחים הפוטנציאליים</span>
                    </div>
                    <div class="insight">
                        <span class="insight-number">2</span>
                        <span class="insight-text">שילוב תשואות שוק ההון והפחתת עלויות תפעול מוזילים את המוצר</span>
                    </div>
                    <div class="insight">
                        <span class="insight-number">3</span>
                        <span class="insight-text">השפעה דרמטית צפויה על המודל הקיים - ייקור משמעותי או קריסה</span>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    bodyElement.innerHTML = content;
    detailOverlay.classList.add('active');
    return;
}

// Check if this is the extreme scenarios cell
if (cell.details.isExtremScenarios) {
    bodyElement.className = 'detail-body extreme-scenarios-design';
    
    let content = `
        <div class="scenarios-intro">
            <p>${cell.details.introduction}</p>
        </div>
        
        <div class="scenarios-split-container">
            <!-- צד שמאל - מודל חדש -->
            <div class="scenarios-column new-model-column">
                <div class="column-header new-model-header">
    <span class="column-icon">🆕</span>
    <h3 class="column-title">תרחישי קיצון - המודל החדש</h3>
</div>
                
                <div class="scenarios-list">
                    <!-- תרחיש 1 -->
                    <div class="scenario-item high-risk">
                        <div class="scenario-header">
                            <span class="scenario-emoji">👥</span>
                            <h4>חוסר היענות של מבוטחים</h4>
                            <span class="risk-badge low">סיכון נמוך</span>
                        </div>
                        <p class="scenario-text">
                            ככל שמספר המצטרפים קטן, קיים חשש ליציבות בתקופת הביטוח.
                        </p>
                        <div class="scenario-consequence">
                            <strong>השלכה:</strong> בקרנות הפנסיה נדרש מבטח משנה כאשר מספר המבוטחים נמוך מ-1,500
                        </div>
                    </div>
                    
                    <!-- תרחיש 2 -->
                    <div class="scenario-item medium-risk">
                        <div class="scenario-header">
                            <span class="scenario-emoji">🏢</span>
                            <h4>חוסר היענות של מבטחים</h4>
                            <span class="risk-badge medium">סיכון בינוני</span>
                        </div>
                        <p class="scenario-text">
                            למרות היעדר סיכון לכאורה, קיים חשש שחברות הביטוח יהססו להצטרף למודל החדש.
                        </p>
                        <div class="scenario-consequence">
                            <strong>השלכה:</strong> יטיל ספק ביכולת לייצר רפורמה כוללת בעתיד
                        </div>
                    </div>
                    
                    <!-- תרחיש 3 -->
                    <div class="scenario-item high-risk">
                        <div class="scenario-header">
                            <span class="scenario-emoji">🔄</span>
                            <h4>אנטי-סלקציה במועד המעבר</h4>
                            <span class="risk-badge high">סיכון גבוה</span>
                        </div>
                        <p class="scenario-text">
                            חשש שבגיל 70 מבוטחים בריאים יקחו את הכסף ויותירו רק בעלי סיכון גבוה.
                        </p>
                        <div class="scenario-consequence">
                            <strong>השלכה:</strong> פגיעה ביציבות האקטוארית של המודל
                        </div>
                    </div>
                    
                    <!-- תרחיש 4 -->
                    <div class="scenario-item medium-risk">
                        <div class="scenario-header">
                            <span class="scenario-emoji">📉</span>
                            <h4>שינויים בסביבת הריבית</h4>
                            <span class="risk-badge medium">סיכון בינוני</span>
                        </div>
                        <p class="scenario-text">
                            תרחישי קיצון בריבית או בשכיחות ישחקו את החיסכון.
                        </p>
                        <div class="scenario-consequence">
                            <strong>השלכה:</strong> כיסוי לא מספק בגיל שקשה לגייס חלופות
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- קו הפרדה מרכזי -->
            <div class="scenarios-divider"></div>
            
            <!-- צד ימין - מודל קיים -->
            <div class="scenarios-column existing-model-column">
                
                <div class="column-header existing-model-header">
   <span class="column-icon">🏥</span>
    <h3 class="column-title">תרחישי קיצון - המודל הקיים</h3>
 
</div>
                <div class="scenarios-list">
                    <!-- תרחיש 1 -->
                    <div class="scenario-item critical-risk">
                        <div class="scenario-header">
                            <span class="scenario-emoji">🏃</span>
                            <h4>נטישת הצעירים</h4>
                            <span class="risk-badge critical">סיכון קריטי</span>
                        </div>
                        <p class="scenario-text">
                            עזיבת צעירים לטובת התכנית החדשה האטרקטיבית יותר.
                        </p>
                        <div class="scenario-consequence">
                            <strong>השלכה:</strong> גירעון אקטוארי הניתן לכיסוי רק במימון חיצוני או הפחתת זכויות
                        </div>
                    </div>
                    
                    <!-- תרחיש 2 -->
                    <div class="scenario-item high-risk">
                        <div class="scenario-header">
                            <span class="scenario-emoji">📊</span>
                            <h4>הגדלת פערים בין קופות</h4>
                            <span class="risk-badge high">סיכון גבוה</span>
                        </div>
                        <p class="scenario-text">
                            קופות ללא רזרבות ייאלצו לפגוע בזכויות - העלאת פרמיה או הפחתת כיסוי.
                        </p>
                        <div class="scenario-consequence">
                            <strong>השלכה:</strong> לחצים מרגולטורים ומקופות החולים
                        </div>
                    </div>
                    
                    <!-- תרחיש 3 -->
                    <div class="scenario-item critical-risk">
                        <div class="scenario-header">
                            <span class="scenario-emoji">🚪</span>
                            <h4>נטישת מבטחים</h4>
                            <span class="risk-badge critical">סיכון קריטי</span>
                        </div>
                        <p class="scenario-text">
                            ירידת "תיאבון" המבטחים להיכנס לסיעוד בקופות עם מבוגרים בלבד.
                        </p>
                        <div class="scenario-consequence">
                            <strong>השלכה:</strong> סכנה ממשית להמשך קיום הביטוח הקיים
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- המלצות תחתונות 
        <div class="scenarios-recommendations">
            <h3 class="recommendations-title">🎯 המלצות לניהול סיכונים</h3>
            <div class="recommendations-split">
                <div class="recommendation-box new-model-rec">
                    <h4><span>🛡️</span> למודל החדש</h4>
                    <ul>
                        <li>קביעת מספר מינימלי של מצטרפים כתנאי להפעלה</li>
                        <li>יצירת תמריצים למבטחים בשנים הראשונות</li>
                        <li>מנגנוני הגנה מפני אנטי-סלקציה בגיל המעבר</li>
                    </ul>
                </div>
                <div class="recommendation-box existing-model-rec">
                    <h4><span>⚖️</span> למודל הקיים</h4>
                    <ul>
                        <li>מעבר מיידי לקרן מאוחדת למניעת קריסה</li>
                        <li>הקפאת המוצר להצטרפות חדשה</li>
                        <li>תוכנית מעבר מסודרת למבוטחים קיימים</li>
                    </ul>
                </div>
            </div>
        </div>
-->
    `;
    
    bodyElement.innerHTML = content;
    detailOverlay.classList.add('active');
    return;
}


// Check if this is the stakeholders interface cell
if (cell.details.isStakeholders) {
    bodyElement.className = 'detail-body stakeholders-design';
    
    let content = `
        <style>
            .stakeholders-design {
                background: linear-gradient(180deg, #f0f9ff 0%, #ffffff 100%);
                padding: 0;
            }
            
            .stakeholders-header {
                background: linear-gradient(135deg, #0ea5e9 0%, #2563eb 100%);
                padding: 2rem;
                text-align: center;
                color: white;
                position: relative;
                overflow: hidden;
            }
            
            .stakeholders-header::before {
                content: '🏛️💼🤝';
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                font-size: 8rem;
                opacity: 0.1;
                animation: rotate 30s linear infinite;
            }
            
            @keyframes rotate {
                from { transform: translate(-50%, -50%) rotate(0deg); }
                to { transform: translate(-50%, -50%) rotate(360deg); }
            }
            
            .header-content {
                position: relative;
                z-index: 1;
            }
            
            .header-title {
                font-size: 1.8rem;
                font-weight: 700;
                margin-bottom: 0.5rem;
            }
            
            .header-subtitle {
                font-size: 1.1rem;
                opacity: 0.95;
            }
            
            .stakeholders-container {
                padding: 2rem;
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
                gap: 1.5rem;
            }
            
            .stakeholder-card {
                background: white;
                border-radius: 16px;
                box-shadow: 0 4px 20px rgba(0,0,0,0.08);
                border: 2px solid transparent;
                transition: all 0.3s ease;
                overflow: hidden;
                animation: slideUp 0.5s ease forwards;
                opacity: 0;
            }
            
            @keyframes slideUp {
                from {
                    opacity: 0;
                    transform: translateY(20px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }
            
            .stakeholder-card:nth-child(1) { animation-delay: 0.1s; }
            .stakeholder-card:nth-child(2) { animation-delay: 0.2s; }
            .stakeholder-card:nth-child(3) { animation-delay: 0.3s; }
            
            .stakeholder-card:hover {
                transform: translateY(-5px);
                box-shadow: 0 8px 30px rgba(0,0,0,0.12);
                border-color: #3b82f6;
            }
            
            .health-card { border-top: 4px solid #10b981; }
            .treasury-card { border-top: 4px solid #f59e0b; }
            .tax-card { border-top: 4px solid #8b5cf6; }
            
            .card-header {
                padding: 1.25rem;
                background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
                border-bottom: 1px solid #e2e8f0;
                display: flex;
                align-items: center;
                gap: 1rem;
            }
            
            .card-flag {
                font-size: 2.5rem;
                filter: drop-shadow(0 2px 4px rgba(0,0,0,0.1));
            }
            
            .card-info {
                flex: 1;
            }
            
            .card-name {
                font-size: 1.2rem;
                font-weight: 700;
                color: #1e293b;
                margin-bottom: 0.25rem;
            }
            
            .card-role {
                font-size: 0.9rem;
                color: #3b82f6;
                font-weight: 600;
            }
            
            .card-content {
                padding: 1.25rem;
            }
            
            .card-description {
                color: #475569;
                line-height: 1.6;
                margin-bottom: 1rem;
                font-size: 0.95rem;
            }
            
            .features-list {
                display: flex;
                flex-direction: column;
                gap: 0.5rem;
            }
            
            .feature-item {
                display: flex;
                align-items: flex-start;
                gap: 0.75rem;
                padding: 0.5rem;
                background: #f8fafc;
                border-radius: 8px;
                transition: all 0.2s ease;
            }
            
            .feature-item:hover {
                background: #e0f2fe;
                transform: translateX(-3px);
            }
            
            .feature-icon {
                font-size: 1rem;
                margin-top: 2px;
            }
            
            .feature-text {
                flex: 1;
                font-size: 0.9rem;
                color: #1e293b;
                line-height: 1.4;
            }
            
            .status-section {
                margin-top: 1rem;
                padding-top: 1rem;
                border-top: 1px solid #e2e8f0;
            }
            
            .status-label {
                font-size: 0.85rem;
                color: #64748b;
                margin-bottom: 0.5rem;
                font-weight: 600;
            }
            
            .status-badge {
                display: inline-block;
                padding: 0.5rem 1rem;
                border-radius: 8px;
                font-weight: 600;
                font-size: 0.9rem;
            }
            
            .status-neutral {
                background: #f1f5f9;
                color: #475569;
            }
            
            .status-caution {
                background: #fef3c7;
                color: #d97706;
            }
            
            .status-positive {
                background: #dcfce7;
                color: #15803d;
            }
            
            .action-box {
                margin-top: 1rem;
                padding: 1rem;
                background: linear-gradient(135deg, #e0f2fe 0%, #dbeafe 100%);
                border-radius: 8px;
                border-left: 3px solid #3b82f6;
            }
            
            .action-title {
                font-size: 0.9rem;
                font-weight: 600;
                color: #1e40af;
                margin-bottom: 0.25rem;
            }
            
            .action-text {
                font-size: 0.85rem;
                color: #1e40af;
                line-height: 1.4;
            }
            
            .summary-section {
                margin: 2rem;
                padding: 1.5rem;
                background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
                border-radius: 12px;
                border: 2px solid #fbbf24;
            }
            
            .summary-title {
                font-size: 1.2rem;
                font-weight: 700;
                color: #92400e;
                margin-bottom: 1rem;
                text-align: center;
            }
            
            .summary-content {
                color: #78350f;
                line-height: 1.6;
            }
            
            .insights-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
                gap: 1rem;
                margin-top: 1rem;
            }
            
            .insight-card {
                background: white;
                padding: 1rem;
                border-radius: 8px;
                border-left: 4px solid #f59e0b;
            }
            
            .insight-title {
                font-weight: 600;
                color: #92400e;
                margin-bottom: 0.5rem;
            }
            
            .insight-text {
                font-size: 0.9rem;
                color: #78350f;
            }
            
            @media (max-width: 900px) {
                .stakeholders-container {
                    grid-template-columns: 1fr;
                }
            }
        </style>
        
        <div class="stakeholders-header">
            <div class="header-content">
                <div class="header-title">ממשק מול גורמים רלוונטיים</div>
                <div class="header-subtitle">ניהול יחסים אסטרטגיים עם בעלי עניין מרכזיים</div>
            </div>
        </div>
        
        <div class="stakeholders-container">
            <!-- משרד הבריאות -->
            <div class="stakeholder-card health-card">
                <div class="card-header">
                    <span class="card-flag">🏥</span>
                    <div class="card-info">
                        <div class="card-name">משרד הבריאות / קופות חולים</div>
                        <div class="card-role">רגולטור הבריאות ובעלי הפוליסות הקבוצתיות</div>
                    </div>
                </div>
                <div class="card-content">
                    <div class="card-description">
                        לכאורה פתיחת שוק הפרט אינה אמורה לייצר ממשק עם משרד הבריאות. אך החשש מהקרסת המוצר הקיים עלול ליצור עימות.
                    </div>
                    <div class="features-list">
                        <div class="feature-item">
                            <span class="feature-icon">📌</span>
                            <span class="feature-text">בעבר התקיימו ביטוחי פרט לצד קופות חולים</span>
                        </div>
                        <div class="feature-item">
                            <span class="feature-icon">⚠️</span>
                            <span class="feature-text">מניעת פתיחת השוק מנוונת את הענף</span>
                        </div>
                        <div class="feature-item">
                            <span class="feature-icon">🎯</span>
                            <span class="feature-text">תחרות תאלץ התייעלות גם בקופות</span>
                        </div>
                        <div class="feature-item">
                            <span class="feature-icon">✅</span>
                            <span class="feature-text">לא נדרשת הסכמה פורמלית</span>
                        </div>
                    </div>
                    
                    <div class="status-section">
                        <div class="status-label">סטטוס נוכחי:</div>
                        <span class="status-badge status-caution">חשש מעימות</span>
                    </div>
                    
                    <div class="action-box">
                        <div class="action-title">🎯 אסטרטגיה מומלצת</div>
                        <div class="action-text">עדכון מוקדם על הכוונות יכול להפחית התנגדויות</div>
                    </div>
                </div>
            </div>
            
            <!-- משרד האוצר -->
            <div class="stakeholder-card treasury-card">
                <div class="card-header">
                    <span class="card-flag">💰</span>
                    <div class="card-info">
                        <div class="card-name">משרד האוצר / אגף התקציבים</div>
                        <div class="card-role">שותף מרכזי בדיונים - שנתיים של התנהלות</div>
                    </div>
                </div>
                <div class="card-content">
                    <div class="card-description">
                        ההתנהלות נמשכת כבר שנתיים. הם לא שללו את הרעיון ואף ציינו שזה המוצר הנכון לסיעוד, אך הגענו למבוי סתום.
                    </div>
                    <div class="features-list">
                        <div class="feature-item">
                            <span class="feature-icon">⏱️</span>
                            <span class="feature-text">שנתיים של דיונים ללא התקדמות</span>
                        </div>
                        <div class="feature-item">
                            <span class="feature-icon">🚫</span>
                            <span class="feature-text">השר: אין היתכנות לרפורמות בממשלה זו</span>
                        </div>
                        <div class="feature-item">
                            <span class="feature-icon">💪</span>
                            <span class="feature-text">הצדקה לפעול בסמכויות עצמאיות</span>
                        </div>
                        <div class="feature-item">
                            <span class="feature-icon">⚡</span>
                            <span class="feature-text">משבר בקופות יכפה התערבות</span>
                        </div>
                    </div>
                    
                    <div class="status-section">
                        <div class="status-label">סטטוס נוכחי:</div>
                        <span class="status-badge status-neutral">מבוי סתום - פעולה עצמאית</span>
                    </div>
                    
                    <div class="action-box">
                        <div class="action-title">⚖️ החלטה</div>
                        <div class="action-text">ההליכה המשותפת מוצתה - יש סמכות לפעול</div>
                    </div>
                </div>
            </div>
            
            <!-- רשות המיסים -->
            <div class="stakeholder-card tax-card">
                <div class="card-header">
                    <span class="card-flag">📊</span>
                    <div class="card-info">
                        <div class="card-name">רשות המיסים</div>
                        <div class="card-role">אישור היבטי מיסוי במעבר בין השלבים</div>
                    </div>
                </div>
                <div class="card-content">
                    <div class="card-description">
                        המעבר מתקופת החיסכון לביטוח עלול להיחשב כאירוע מס. נדרשת הבהרה לגבי ההיבטים המיסויים.
                    </div>
                    <div class="features-list">
                        <div class="feature-item">
                            <span class="feature-icon">🔍</span>
                            <span class="feature-text">בעיה: מעבר בין שלבים כאירוע מס</span>
                        </div>
                        <div class="feature-item">
                            <span class="feature-icon">📝</span>
                            <span class="feature-text">אופציה א': פרה-רולינג מהרשות</span>
                        </div>
                        <div class="feature-item">
                            <span class="feature-icon">🏢</span>
                            <span class="feature-text">אופציה ב': דרך חברות הביטוח</span>
                        </div>
                        <div class="feature-item">
                            <span class="feature-icon">✅</span>
                            <span class="feature-text">המלצה: הבהרה מראש לוודאות</span>
                        </div>
                    </div>
                    
                    <div class="status-section">
                        <div class="status-label">סטטוס נוכחי:</div>
                        <span class="status-badge status-positive">דיאלוג פתוח</span>
                    </div>
                    
                    <div class="action-box">
                        <div class="action-title">📋 פעולה נדרשת</div>
                        <div class="action-text">השגת פרה-רולינג או הכוונה לחברות</div>
                    </div>
                </div>
            </div>
        </div>
        
        <div class="summary-section">
            <div class="summary-title">💡 תובנות מרכזיות מניתוח הממשקים</div>
            <div class="summary-content">
                <div class="insights-grid">
                    <div class="insight-card">
                        <div class="insight-title">🏥 משרד הבריאות</div>
                        <div class="insight-text">עדכון מוקדם למניעת הפתעות והתנגדויות</div>
                    </div>
                    <div class="insight-card">
                        <div class="insight-title">💰 משרד האוצר</div>
                        <div class="insight-text">פעולה עצמאית לאחר מיצוי הדיאלוג</div>
                    </div>
                    <div class="insight-card">
                        <div class="insight-title">📊 רשות המיסים</div>
                        <div class="insight-text">הבהרה מוקדמת לוודאות בשוק</div>
                    </div>
                </div>

            </div>
        </div>
    `;
    
    bodyElement.innerHTML = content;
    detailOverlay.classList.add('active');
    return;
}

// Check if this is the legal risks cell
if (cell.details.isLegalRisks) {
    bodyElement.className = 'detail-body legal-risks-design';
    
    let content = `
        <style>
            .legal-risks-design {
                background: linear-gradient(180deg, #fafafa 0%, #ffffff 100%);
                padding: 0;
            }
            
            /* Header with animated scales */
            .legal-header {
                background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
                padding: 2.5rem;
                text-align: center;
                color: white;
                position: relative;
                overflow: hidden;
            }
            
            .legal-header::before {
                content: '⚖️';
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                font-size: 10rem;
                opacity: 0.08;
                animation: balance 4s ease-in-out infinite;
            }
            
            @keyframes balance {
                0%, 100% { transform: translate(-50%, -50%) rotate(-5deg); }
                50% { transform: translate(-50%, -50%) rotate(5deg); }
            }
            
            .header-content {
                position: relative;
                z-index: 1;
            }
            
            .header-title {
                font-size: 2rem;
                font-weight: 700;
                margin-bottom: 0.5rem;
                text-shadow: 0 2px 10px rgba(0,0,0,0.3);
            }
            
            .header-subtitle {
                font-size: 1.1rem;
                opacity: 0.9;
                color: #cbd5e1;
            }
            
            /* Risk Categories Container */
            .risks-container {
                padding: 2rem;
            }
            
            /* Two Column Layout */
            .risks-layout {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 2rem;
                margin-bottom: 2rem;
            }
            
            @media (max-width: 900px) {
                .risks-layout {
                    grid-template-columns: 1fr;
                }
            }
            
            /* Risk Section Card */
            .risk-section {
                background: white;
                border-radius: 16px;
                overflow: hidden;
                box-shadow: 0 4px 20px rgba(0,0,0,0.08);
                transition: all 0.3s ease;
                animation: slideUp 0.5s ease forwards;
                opacity: 0;
            }
            
            @keyframes slideUp {
                from {
                    opacity: 0;
                    transform: translateY(20px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }
            
            .risk-section:nth-child(1) { animation-delay: 0.1s; }
            .risk-section:nth-child(2) { animation-delay: 0.2s; }
            
            .risk-section:hover {
                transform: translateY(-3px);
                box-shadow: 0 8px 30px rgba(0,0,0,0.12);
            }
            
            .immediate-risks {
                border-top: 4px solid #22c55e;
            }
            
            .crisis-risks {
                border-top: 4px solid #ef4444;
            }
            
            /* Section Header */
            .section-header {
                padding: 1.5rem;
                background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
                border-bottom: 2px solid #e2e8f0;
            }

          .section-header {
    padding: 1.5rem;
    background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
    border-bottom: 2px solid #e2e8f0;
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
}

  
.section-icon {
    display: inline-block;
    width: 48px;
    height: 48px;
    background: white;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.8rem;
    margin-bottom: 1rem;
    box-shadow: 0 4px 12px rgba(0,0,0,0.08);
}
            
            .section-title {
                font-size: 1.3rem;
                font-weight: 700;
                color: #1e293b;
                margin-bottom: 0.5rem;
            }
            
            .section-subtitle {
                font-size: 0.95rem;
                color: #64748b;
                line-height: 1.4;
            }
            
            /* Risk Items */
            .risk-items {
                padding: 1.5rem;
            }
            
            .risk-item {
                margin-bottom: 1.5rem;
                padding: 1.25rem;
                background: #f8fafc;
                border-radius: 12px;
                border-left: 4px solid transparent;
                transition: all 0.3s ease;
            }
            
            .risk-item:hover {
                background: white;
                box-shadow: 0 4px 12px rgba(0,0,0,0.08);
                transform: translateX(-5px);
            }
            
            .risk-item:last-child {
                margin-bottom: 0;
            }
            
            .low-risk {
                border-left-color: #22c55e;
            }
            
            .medium-risk {
                border-left-color: #f59e0b;
            }
            
            .high-risk {
                border-left-color: #ef4444;
            }
            
            .risk-header {
                display: flex;
                align-items: flex-start;
                gap: 1rem;
                margin-bottom: 0.75rem;
            }
            
            .risk-icon {
                font-size: 1.5rem;
                flex-shrink: 0;
                margin-top: 2px;
            }
            
            .risk-content {
                flex: 1;
            }
            
            .risk-title {
                font-size: 1.1rem;
                font-weight: 600;
                color: #1e293b;
                margin-bottom: 0.5rem;
            }
            
            .risk-description {
                font-size: 0.95rem;
                color: #64748b;
                line-height: 1.5;
                margin-bottom: 0.75rem;
            }
            
            /* Risk Assessment Badge */
            .risk-assessment {
                display: inline-flex;
                align-items: center;
                gap: 0.5rem;
                padding: 0.375rem 0.875rem;
                border-radius: 20px;
                font-size: 0.85rem;
                font-weight: 600;
            }
            
            .assessment-low {
                background: #dcfce7;
                color: #15803d;
            }
            
            .assessment-medium {
                background: #fef3c7;
                color: #d97706;
            }
            
            .assessment-high {
                background: #fee2e2;
                color: #dc2626;
            }
            
            /* Action Required Box */
            .action-required {
                margin-top: 0.75rem;
                padding: 0.75rem;
                background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%);
                border-radius: 8px;
                border-left: 3px solid #3b82f6;
            }
            
            .action-label {
                font-size: 0.85rem;
                font-weight: 600;
                color: #1e40af;
                margin-bottom: 0.25rem;
            }
            
            .action-text {
                font-size: 0.9rem;
                color: #1e40af;
                line-height: 1.4;
            }
            
            /* Summary Box */
            .legal-summary {
                background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
                border-radius: 16px;
                padding: 2rem;
                margin: 2rem;
                border: 2px solid #93c5fd;
            }
            
            .summary-title {
                font-size: 1.3rem;
                font-weight: 700;
                color: #1e293b;
                margin-bottom: 1.5rem;
                text-align: center;
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 0.75rem;
            }
            
            .summary-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                gap: 1.5rem;
            }
            
            .summary-card {
                background: white;
                padding: 1.25rem;
                border-radius: 12px;
                text-align: center;
                box-shadow: 0 2px 10px rgba(0,0,0,0.05);
            }
            
            .summary-icon {
                font-size: 2.5rem;
                margin-bottom: 0.75rem;
            }
            
            .summary-label {
                font-size: 0.9rem;
                color: #64748b;
                margin-bottom: 0.5rem;
            }
            
            .summary-value {
                font-size: 1.8rem;
                font-weight: 700;
                color: #1e293b;
                margin-bottom: 0.25rem;
            }
            
            .summary-status {
                font-size: 0.85rem;
                font-weight: 600;
                padding: 0.25rem 0.75rem;
                border-radius: 12px;
                display: inline-block;
            }
            
            .status-manageable {
                background: #dcfce7;
                color: #15803d;
            }
            
            .status-attention {
                background: #fef3c7;
                color: #d97706;
            }
            
            /* Bottom Alert */
            .legal-alert {
                margin: 2rem;
                padding: 1.5rem;
                background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
                border-radius: 12px;
                border: 2px solid #fbbf24;
                display: flex;
                align-items: flex-start;
                gap: 1rem;
            }
            
            .alert-icon {
                font-size: 2rem;
                flex-shrink: 0;
            }
            
            .alert-content {
                flex: 1;
            }
            
            .alert-title {
                font-size: 1.1rem;
                font-weight: 700;
                color: #92400e;
                margin-bottom: 0.5rem;
            }
            
            .alert-text {
                color: #78350f;
                line-height: 1.5;
            }
        </style>
        
        <div class="legal-header">
            <div class="header-content">
                <div class="header-title">סוגיות משפטיות וניהול סיכונים</div>
                <div class="header-subtitle">מיפוי וניתוח החשיפות המשפטיות הפוטנציאליות</div>
            </div>
        </div>
        
        <div class="risks-container">
            <div class="risks-layout">
                <!-- סיכונים מיידיים -->
                <div class="risk-section immediate-risks">
                    <div class="section-header">
                        <div class="section-icon">🛡️</div>
                        <div class="section-title">סיכונים מיידיים בפתיחת השוק</div>
                        <div class="section-subtitle">סוגיות משפטיות הדורשות התייחסות בטרם השקת המוצר</div>
                    </div>
                    
                    <div class="risk-items">
                        <div class="risk-item low-risk">
                            <div class="risk-header">
                                <span class="risk-icon">⚖️</span>
                                <div class="risk-content">
                                    <div class="risk-title">תביעה ייצוגית על השפעה על המוצר בקופות</div>
                                    <div class="risk-description">
                                        חשש מתביעה ייצוגית בטענה שפתיחת שוק הפרט תפגע במבוטחים הקיימים בקופות החולים
                                    </div>
                                    <div class="risk-assessment assessment-low">
                                        <span>✓</span>
                                        <span>סיכון נמוך</span>
                                    </div>
                                    <div class="action-required">
                                        <div class="action-label">הערכת הרשות:</div>
                                        <div class="action-text">אין סיכון משמעותי - הפעולה בסמכותנו</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <div class="risk-item medium-risk">
                            <div class="risk-header">
                                <span class="risk-icon">📊</span>
                                <div class="risk-content">
                                    <div class="risk-title">פרה-רולינג מול רשות המיסים</div>
                                    <div class="risk-description">
                                        הבהרת ההיבטים המיסויים במעבר בין תקופת החיסכון לתקופת הביטוח
                                    </div>
                                    <div class="risk-assessment assessment-medium">
                                        <span>!</span>
                                        <span>דורש טיפול</span>
                                    </div>
                                    <div class="action-required">
                                        <div class="action-label">פעולה נדרשת:</div>
                                        <div class="action-text">קבלת אישור מקדים או הפניה לחברות הביטוח לטיפול עצמאי</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- סיכונים במשבר -->
                <div class="risk-section crisis-risks">
                    <div class="section-header">
                        <div class="section-icon">🚨</div>
                        <div class="section-title">סיכונים פוטנציאליים במקרה משבר</div>
                        <div class="section-subtitle">סוגיות שעלולות להתעורר אם ייווצר משבר בקופות החולים</div>
                    </div>
                    
                    <div class="risk-items">
                        <div class="risk-item high-risk">
                            <div class="risk-header">
                                <span class="risk-icon">🏛️</span>
                                <div class="risk-content">
                                    <div class="risk-title">מעבר לקרן אחת בקופות החולים</div>
                                    <div class="risk-description">
                                        איחוד כל הקרנות בקופות לקרן אחת עם כל המשתמע מכך - שינוי תנאים, פרמיה אחידה, ועוד
                                    </div>
                                    <div class="risk-assessment assessment-high">
                                        <span>⚠️</span>
                                        <span>השלכות מורכבות</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <div class="risk-item high-risk">
                            <div class="risk-header">
                                <span class="risk-icon">🔄</span>
                                <div class="risk-content">
                                    <div class="risk-title">מעבר לתקנון ביטוח הדדי</div>
                                    <div class="risk-description">
                                        שינוי מבנה הביטוח לאוכלוסייה שנשארת בקופות למודל של ביטוח הדדי
                                    </div>
                                    <div class="risk-assessment assessment-high">
                                        <span>⚠️</span>
                                        <span>שינוי מהותי</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <div class="risk-item high-risk">
                            <div class="risk-header">
                                <span class="risk-icon">💔</span>
                                <div class="risk-content">
                                    <div class="risk-title">פירוק הביטוח בקופות</div>
                                    <div class="risk-description">
                                        במקרה קיצוני שלא יימצא מבטח חדש - פירוק מוחלט של הביטוח הסיעודי בקופות
                                    </div>
                                    <div class="risk-assessment assessment-high">
                                        <span>🔴</span>
                                        <span>תרחיש קיצון</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            

            
            <!-- התראה חשובה -->
            <div class="legal-alert">
                <span class="alert-icon">⚡</span>
                <div class="alert-content">
                    <div class="alert-title">הערה כללית</div>
                    <div class="alert-text">
                        רוב הסיכונים המשמעותיים תלויים בהתפתחות משבר בקופות החולים. <br>
                        הסיכונים המיידיים ניתנים לניהול ואינם מהווים חסם לפתיחת השוק.
                    </div>
                </div>
            </div>
        </div>
    `;
    
    bodyElement.innerHTML = content;
    detailOverlay.classList.add('active');
    return;
}

// Check if this is the advantages summary cell
if (cell.details.isAdvantages) {
    bodyElement.className = 'detail-body advantages-design';
    
    let content = `
        <style>
            .advantages-design {
                background: linear-gradient(180deg, #f0fdf4 0%, #ffffff 100%);
                padding: 2rem;
            }
            
            .advantages-header {
                text-align: center;
                padding: 2rem;
                background: linear-gradient(135deg, #10b981 0%, #059669 100%);
                border-radius: 16px;
                margin-bottom: 2rem;
                color: white;
            }
            
            .advantages-title {
                font-size: 2rem;
                font-weight: 700;
                margin-bottom: 0.5rem;
            }
            
            .advantages-subtitle {
                font-size: 1.1rem;
                opacity: 0.95;
            }
            
            .advantages-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
                gap: 1.5rem;
                margin-bottom: 2rem;
            }
            
            .advantage-category {
                background: white;
                border-radius: 12px;
                padding: 1.5rem;
                box-shadow: 0 4px 15px rgba(0,0,0,0.08);
                border-right: 4px solid #10b981;
            }
            
            .category-header {
                display: flex;
                align-items: center;
                gap: 0.75rem;
                margin-bottom: 1rem;
                padding-bottom: 0.75rem;
                border-bottom: 2px solid #e5e7eb;
            }
            
            .category-icon {
                font-size: 1.8rem;
            }
            
            .category-title {
                font-size: 1.2rem;
                font-weight: 700;
                color: #059669;
            }
            
            .advantage-list {
                list-style: none;
                padding: 0;
                margin: 0;
            }
            
            .advantage-item {
                padding: 0.75rem;
                margin-bottom: 0.5rem;
                background: linear-gradient(90deg, #f0fdf4 0%, transparent 100%);
                border-radius: 8px;
                display: flex;
                align-items: flex-start;
                gap: 0.75rem;
                transition: all 0.2s ease;
            }
            
            .advantage-item:hover {
                background: linear-gradient(90deg, #dcfce7 0%, transparent 100%);
                transform: translateX(-3px);
            }
            
            .item-icon {
                color: #10b981;
                font-weight: bold;
                flex-shrink: 0;
            }
            
            .item-text {
                color: #1e293b;
                font-size: 0.95rem;
                line-height: 1.5;
            }
        </style>
        
        <div class="advantages-header">
            <div class="advantages-title">✅ יתרונות המוצר החדש</div>
            <div class="advantages-subtitle">פתרון מקיף לאתגר הביטוח הסיעודי</div>
        </div>
        
        <div class="advantages-grid">
            <!-- יתרונות כלכליים -->
            <div class="advantage-category">
                <div class="category-header">
                    <span class="category-icon">💰</span>
                    <span class="category-title">יתרונות כלכליים למבוטח</span>
                </div>
                <ul class="advantage-list">
                    <li class="advantage-item">
                        <span class="item-icon">✓</span>
                        <span class="item-text">חיסכון של 50-70% בעלויות למבוטחים צעירים</span>
                    </li>
                    <li class="advantage-item">
                        <span class="item-icon">✓</span>
                        <span class="item-text">דמי ניהול של 1% בלבד לעומת 5-8% במודל הקיים</span>
                    </li>
                    <li class="advantage-item">
                        <span class="item-icon">✓</span>
                        <span class="item-text">תשואות גבוהות יחסית בשוק ההון על החיסכון</span>
                    </li>
                    <li class="advantage-item">
                        <span class="item-icon">✓</span>
                        <span class="item-text">החיסכון בבעלות המבוטח עד גיל 70</span>
                    </li>
                    <li class="advantage-item">
                        <span class="item-icon">✓</span>
                        <span class="item-text">אפשרות העברת כספים מקופות גמל אחרות</span>
                    </li>
                </ul>
            </div>
            
            <!-- יתרונות מבניים -->
            <div class="advantage-category">
                <div class="category-header">
                    <span class="category-icon">🏗️</span>
                    <span class="category-title">יתרונות מבניים ואסטרטגיים</span>
                </div>
                <ul class="advantage-list">
                    <li class="advantage-item">
                        <span class="item-icon">✓</span>
                        <span class="item-text">מודל דו-שלבי המותאם למעגל החיים</span>
                    </li>
                    <li class="advantage-item">
                        <span class="item-icon">✓</span>
                        <span class="item-text">מודל הוגן וצודק ללא סבסוד צולב</span>
                    </li>
                    <li class="advantage-item">
                        <span class="item-icon">✓</span>
                        <span class="item-text">הבטחות מובנות במוצר למקרי ביטוח משניים</span>
                    </li>
                    <li class="advantage-item">
                        <span class="item-icon">✓</span>
                        <span class="item-text">פתרון ארוך טווח לבעיית ביטוחי הסיעוד</span>
                    </li>
                    <li class="advantage-item">
                        <span class="item-icon">✓</span>
                        <span class="item-text">מתאים למודלים בינלאומיים מוצלחים</span>
                    </li>
                </ul>
            </div>
            
            <!-- יתרונות לשוק -->
            <div class="advantage-category">
                <div class="category-header">
                    <span class="category-icon">📈</span>
                    <span class="category-title">יתרונות לשוק ולרגולטור</span>
                </div>
                <ul class="advantage-list">
                    <li class="advantage-item">
                        <span class="item-icon">✓</span>
                        <span class="item-text">יצירת תחרות בריאה והחייאת השוק</span>
                    </li>
                    <li class="advantage-item">
                        <span class="item-icon">✓</span>
                        <span class="item-text">עמלות נמוכות לסוכנים (&lt;1%)</span>
                    </li>
                    <li class="advantage-item">
                        <span class="item-icon">✓</span>
                        <span class="item-text">שחרור ללא התנגדות מהותית צפויה</span>
                    </li>
                    <li class="advantage-item">
                        <span class="item-icon">✓</span>
                        <span class="item-text">מחזק את מעמד הרשות</span>
                    </li>
                </ul>
            </div>
        </div>
    `;
    
    bodyElement.innerHTML = content;
    detailOverlay.classList.add('active');
    return;
}



// Check if this is the disadvantages summary cell
if (cell.details.isDisadvantages) {
    bodyElement.className = 'detail-body disadvantages-design';
    
    let content = `
        <style>
            .disadvantages-design {
                background: linear-gradient(180deg, #fef2f2 0%, #ffffff 100%);
                padding: 2rem;
            }
            
            .disadvantages-header {
                text-align: center;
                padding: 2rem;
                background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
                border-radius: 16px;
                margin-bottom: 2rem;
                color: white;
            }
            
            .disadvantages-title {
                font-size: 2rem;
                font-weight: 700;
                margin-bottom: 0.5rem;
            }
            
            .disadvantages-subtitle {
                font-size: 1.1rem;
                opacity: 0.95;
            }
            
            .disadvantages-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
                gap: 1.5rem;
                margin-bottom: 2rem;
            }
            
            .disadvantage-category {
                background: white;
                border-radius: 12px;
                padding: 1.5rem;
                box-shadow: 0 4px 15px rgba(0,0,0,0.08);
                border-right: 4px solid #ef4444;
            }
            
            .category-header {
                display: flex;
                align-items: center;
                gap: 0.75rem;
                margin-bottom: 1rem;
                padding-bottom: 0.75rem;
                border-bottom: 2px solid #e5e7eb;
            }
            
            .category-icon {
                font-size: 1.8rem;
            }
            
            .category-title {
                font-size: 1.2rem;
                font-weight: 700;
                color: #dc2626;
            }
            
            .disadvantage-list {
                list-style: none;
                padding: 0;
                margin: 0;
            }
            
            .disadvantage-item {
                padding: 0.75rem;
                margin-bottom: 0.5rem;
                background: linear-gradient(90deg, #fef2f2 0%, transparent 100%);
                border-radius: 8px;
                display: flex;
                align-items: flex-start;
                gap: 0.75rem;
                transition: all 0.2s ease;
            }
            
            .disadvantage-item:hover {
                background: linear-gradient(90deg, #fee2e2 0%, transparent 100%);
                transform: translateX(-3px);
            }
            
            .item-icon {
                color: #ef4444;
                font-weight: bold;
                flex-shrink: 0;
            }
            
            .item-text {
                color: #1e293b;
                font-size: 0.95rem;
                line-height: 1.5;
            }
        </style>
        
        <div class="disadvantages-header">
            <div class="disadvantages-title">⚠️ חסרונות ואתגרים</div>
            <div class="disadvantages-subtitle">האתגרים שיש להיערך אליהם</div>
        </div>
        
        <div class="disadvantages-grid">
            <!-- מגבלות המוצר -->
            <div class="disadvantage-category">
                <div class="category-header">
                    <span class="category-icon">🚫</span>
                    <span class="category-title">מגבלות המוצר</span>
                </div>
                <ul class="disadvantage-list">
                    <li class="disadvantage-item">
                        <span class="item-icon">✗</span>
                        <span class="item-text">אין אפשרות הצטרפות לאחר גיל 70</span>
                    </li>
                    <li class="disadvantage-item">
                        <span class="item-icon">✗</span>
                        <span class="item-text">פרמיות חודשיות גבוהות לבני 55+</span>
                    </li>
                    <li class="disadvantage-item">
                        <span class="item-icon">✗</span>
                        <span class="item-text">מורכבות המוצר - קשה להסבר</span>
                    </li>
                    <li class="disadvantage-item">
                        <span class="item-icon">✗</span>
                        <span class="item-text">אין מענה מובנה לביטוח עד גיל 70</span>
                    </li>
                </ul>
            </div>
            
            <!-- סיכונים תפעוליים -->
            <div class="disadvantage-category">
                <div class="category-header">
                    <span class="category-icon">⚡</span>
                    <span class="category-title">סיכונים תפעוליים</span>
                </div>
                <ul class="disadvantage-list">
                    <li class="disadvantage-item">
                        <span class="item-icon">✗</span>
                        <span class="item-text">חשש מאנטי-סלקציה בגיל 70</span>
                    </li>
                    <li class="disadvantage-item">
                        <span class="item-icon">✗</span>
                        <span class="item-text">חשש מחוסר היענות של מבטחים ומבוטחים</span>
                    </li>
                </ul>
            </div>
            
            <!-- השפעות על השוק הקיים -->
            <div class="disadvantage-category">
                <div class="category-header">
                    <span class="category-icon">💥</span>
                    <span class="category-title">השפעות על השוק הקיים</span>
                </div>
                <ul class="disadvantage-list">
                    <li class="disadvantage-item">
                        <span class="item-icon">✗</span>
                        <span class="item-text">קריסת המוצר הקיים בקופות החולים</span>
                    </li>
                    <li class="disadvantage-item">
                        <span class="item-icon">✗</span>
                        <span class="item-text">גירעון של עד 16 מיליארד ₪ בקרנות</span>
                    </li>
                    <li class="disadvantage-item">
                        <span class="item-icon">✗</span>
                        <span class="item-text">פגיעה במבוגרים עקב הקרסת המוצר הקיים</span>
                    </li>
                </ul>
            </div>
        </div>
        
        <div style="margin-top: 2rem; padding: 1.5rem; background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%); border-radius: 12px; border: 2px solid #fbbf24;">
            <div style="font-size: 1.2rem; font-weight: 700; color: #92400e; margin-bottom: 0.75rem;">
                📌 הערה
            </div>
            <div style="color: #78350f; line-height: 1.6;">
                למרות האתגרים, הסיכון המרכזי הוא בהמשך הסטטוס קוו שיוביל לקריסת המערכת ללא חלופה.
            </div>
        </div>
    `;
    
    bodyElement.innerHTML = content;
    detailOverlay.classList.add('active');
    return;
}


// Regular detail content (existing code continues...)
bodyElement.className = 'detail-body'; // Reset to default
        
        // Regular detail content (existing code continues...)
        let content = '';
bodyElement.className = 'detail-body'; // Reset to default
        
        if (cell.details.introduction) {
            content += `<div class="detail-paragraph">${cell.details.introduction}</div>`;
        }
        
        if (cell.details.sections) {
            cell.details.sections.forEach(section => {
                content += `<div class="detail-section">`;
                content += `<h3>${section.title}</h3>`;
                
                // Check what type of content to render
                if (section.paragraph) {
                    content += `<div class="detail-paragraph">${section.paragraph}</div>`;
                }
                
                if (section.stats) {
                    content += `<div class="detail-stats-container">`;
                    section.stats.forEach(stat => {
                        content += `
                            <div class="detail-stat">
                                <div class="detail-stat-value">${stat.value}</div>
                                <div class="detail-stat-label">${stat.label}</div>
                            </div>
                        `;
                    });
                    content += `</div>`;
                }
                
                if (section.cards) {
                    content += `<div class="detail-cards-grid">`;
                    section.cards.forEach(card => {
                        content += `
                            <div class="detail-card">
                                <div class="detail-card-title">${card.title}</div>
                                ${card.value ? `<div class="detail-card-value">${card.value}</div>` : ''}
                                ${card.description ? `<div class="detail-card-description">${card.description}</div>` : ''}
                            </div>
                        `;
                    });
                    content += `</div>`;
                }
                
                if (section.progress) {
                    section.progress.forEach(item => {
                        content += `
                            <div class="detail-progress-item">
                                <div class="detail-progress-label">
                                    <span>${item.label}</span>
                                    <span>${item.value}</span>
                                </div>
                                <div class="detail-progress-bar">
                                    <div class="detail-progress-fill" style="width: ${item.percentage}%"></div>
                                </div>
                            </div>
                        `;
                    });
                }
                
                if (section.chart) {
                    content += `
                        <div class="detail-chart-container">
                            <div class="detail-chart-title">${section.chart.title}</div>
                            <canvas id="chart-${cellId}-${section.chart.id}"></canvas>
                        </div>
                    `;
                    // Note: You'll need to initialize the chart after the content is added to DOM
                    setTimeout(() => this.initChart(cellId, section.chart), 100);
                }
                
                content += `</div>`;
            });
        }
        
        bodyElement.innerHTML = content;
        detailOverlay.classList.add('active');
        
        // Animate progress bars after content is loaded
        setTimeout(() => {
            const progressFills = detailOverlay.querySelectorAll('.detail-progress-fill');
            progressFills.forEach(fill => {
                const width = fill.style.width;
                fill.style.width = '0';
                setTimeout(() => {
                    fill.style.width = width;
                }, 100);
            });
        }, 100);
    },
    
    initChart(cellId, chartConfig) {
        const canvas = document.getElementById(`chart-${cellId}-${chartConfig.id}`);
        if (!canvas) return;
        
        // Simple example chart - you can customize this
        const ctx = canvas.getContext('2d');
        // Here you would initialize your chart using Chart.js or similar
        // This is just a placeholder
        ctx.fillStyle = '#3b82f6';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    },
    
    showDefaultDetail(cellId) {
        const cell = matrixData.cells.find(c => c.id === cellId);
        if (!cell) return;
        
        const detailOverlay = document.getElementById('detailOverlay');
        const titleElement = document.getElementById('detailTitle');
        const subtitleElement = document.getElementById('detailSubtitle');
        const bodyElement = document.getElementById('detailBody');
        
        titleElement.innerHTML = `<span class="header-icon">${cell.icon}</span> ${cell.title}`;
        subtitleElement.textContent = cell.description;
        bodyElement.innerHTML = `
            <div class="detail-section">
                <div class="detail-paragraph">
                    <p>פרטים מלאים עבור נושא זה יתווספו בקרוב.</p>
                    <p>הנושא כולל היבטים רבים הדורשים תכנון מפורט ומעמיק.</p>
                </div>
            </div>
        `;
        
        detailOverlay.classList.add('active');
    },
    
    closeDetail() {
        const detailOverlay = document.getElementById('detailOverlay');
        detailOverlay.classList.remove('active');
    },
    
    setupEventListeners() {
        // ESC key to close
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                if (document.getElementById('detailOverlay').classList.contains('active')) {
                    this.closeDetail();
                } else if (this.isOpen) {
                    this.close();
                }
            }
        });
        
        // Click outside to close detail
        document.getElementById('detailOverlay').addEventListener('click', (e) => {
            if (e.target === e.currentTarget) {
                this.closeDetail();
            }
        });
    }
};

// Premium Calculator Logic
function initPremiumCalculator() {
    const malePremiums = {
        20: {20: 16, 25: 20, 30: 26, 35: 33, 40: 42, 45: 54, 50: 69, 55: 88, 60: 112, 65: 143, 70: 174},
        25: {25: 22, 30: 28, 35: 36, 40: 46, 45: 58, 50: 75, 55: 95, 60: 122, 65: 155, 70: 189},
        30: {30: 31, 35: 39, 40: 50, 45: 64, 50: 82, 55: 104, 60: 133, 65: 170, 70: 207},
        35: {35: 44, 40: 56, 45: 71, 50: 91, 55: 116, 60: 148, 65: 189, 70: 230},
        40: {40: 63, 45: 81, 50: 103, 55: 132, 60: 168, 65: 215, 70: 261},
        45: {45: 95, 50: 121, 55: 154, 60: 197, 65: 251, 70: 305},
        50: {50: 147, 55: 187, 60: 239, 65: 305, 70: 371},
        55: {55: 243, 60: 310, 65: 396, 70: 481}
    };

    const femalePremiums = {
        20: {20: 20, 25: 26, 30: 33, 35: 41, 40: 53, 45: 68, 50: 86, 55: 110, 60: 140, 65: 179, 70: 218},
        25: {25: 28, 30: 37, 35: 45, 40: 57, 45: 73, 50: 93, 55: 119, 60: 152, 65: 194, 70: 236},
        30: {30: 39, 35: 49, 40: 63, 45: 80, 50: 102, 55: 131, 60: 167, 65: 213, 70: 258},
        35: {35: 55, 40: 70, 45: 89, 50: 114, 55: 145, 60: 185, 65: 237, 70: 288},
        40: {40: 79, 45: 101, 50: 129, 55: 165, 60: 210, 65: 269, 70: 327},
        45: {45: 118, 50: 151, 55: 193, 60: 246, 65: 314, 70: 381},
        50: {50: 184, 55: 234, 60: 299, 65: 382, 70: 464},
        55: {55: 304, 60: 388, 65: 495, 70: 601}
    };

    const fixedPremiums = {
        male: {20: 46, 25: 58, 30: 74, 35: 94, 40: 123, 45: 164, 50: 229, 55: 338},
        female: {20: 58, 25: 73, 30: 92, 35: 118, 40: 154, 45: 206, 50: 286, 55: 422}
    };

    const kupotPremiums = {
        20: 12, 25: 19, 30: 40, 35: 63, 40: 81, 45: 147, 50: 203, 55: 255,
        60: 301, 65: 353, 70: 390, 75: 412, 80: 412, 85: 412
    };

    let monthlyChart, cumulativeChart;
    let currentGender = 'male';
    let currentAge = 30;

    function createCharts() {
        const monthlyCtx = document.getElementById('monthlyChart').getContext('2d');
        const cumulativeCtx = document.getElementById('cumulativeChart').getContext('2d');

        monthlyChart = new Chart(monthlyCtx, {
            type: 'line',
            data: {
                labels: [],
                datasets: [
                    {
                        label: 'מודל חדש - פרמיה קבועה',
                        data: [],
                        borderColor: '#22c55e',
                        backgroundColor: 'rgba(34, 197, 94, 0.1)',
                        tension: 0.4,
                        pointRadius: 4,
                        pointHoverRadius: 6,
                        borderWidth: 2.5
                    },
                    {
                        label: 'מודל חדש - פרמיה משתנה',
                        data: [],
                        borderColor: '#3b82f6',
                        backgroundColor: 'rgba(59, 130, 246, 0.1)',
                        tension: 0.4,
                        pointRadius: 4,
                        pointHoverRadius: 6,
                        borderWidth: 2.5
                    },
                    {
                        label: 'קופות חולים',
                        data: [],
                        borderColor: '#f97316',
                        backgroundColor: 'rgba(249, 115, 22, 0.1)',
                        tension: 0.4,
                        pointRadius: 4,
                        pointHoverRadius: 6,
                        borderWidth: 2.5
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'top',
                        labels: {
                            padding: 12,
                            font: { size: 12 }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'פרמיה חודשית (₪)'
                        }
                    },
                    x: {
                        title: {
                            display: true,
                            text: 'גיל'
                        }
                    }
                }
            }
        });

        cumulativeChart = new Chart(cumulativeCtx, {
            type: 'bar',
            data: {
                labels: ['מודל חדש - קבועה', 'מודל חדש - משתנה', 'קופות חולים'],
                datasets: [{
                    data: [0, 0, 0],
                    backgroundColor: ['#22c55e', '#3b82f6', '#f97316'],
                    borderRadius: 7,
                    borderSkipped: false,
                    barThickness: 90
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'סך תשלומים (₪)'
                        },
                        ticks: {
                            callback: function(value) {
                                return new Intl.NumberFormat('he-IL').format(value) + ' ₪';
                            }
                        }
                    }
                }
            }
        });
    }

    function updateCharts() {
        const premiumsData = currentGender === 'male' ? malePremiums : femalePremiums;
        const fixedPremium = fixedPremiums[currentGender][currentAge];
        const monthlyData = [];
        let newModelCumulative = 0;
        let fixedModelCumulative = 0;
        let kupotCumulative = 0;

        for (let age = currentAge; age <= 85; age += 5) {
            let newModelMonthly = null;
            let fixedModelMonthly = null;
            const kupotMonthly = kupotPremiums[age] || kupotPremiums[Math.floor(age/5)*5];

            if (age <= 70) {
                newModelMonthly = premiumsData[currentAge] && premiumsData[currentAge][age] ? premiumsData[currentAge][age] : null;
                fixedModelMonthly = fixedPremium;
                
                if (newModelMonthly) {
                    newModelCumulative += newModelMonthly * 12 * 5;
                }
                if (fixedModelMonthly) {
                    fixedModelCumulative += fixedModelMonthly * 12 * 5;
                }
            }
            
            kupotCumulative += kupotMonthly * 12 * 5;

            monthlyData.push({
                age: age,
                newModel: newModelMonthly,
                fixed: fixedModelMonthly,
                kupot: kupotMonthly
            });
        }

        monthlyChart.data.labels = monthlyData.map(d => d.age);
        monthlyChart.data.datasets[0].data = monthlyData.map(d => d.fixed);
        monthlyChart.data.datasets[1].data = monthlyData.map(d => d.newModel);
        monthlyChart.data.datasets[2].data = monthlyData.map(d => d.kupot);
        monthlyChart.update();

        cumulativeChart.data.datasets[0].data = [fixedModelCumulative, newModelCumulative, kupotCumulative];
        cumulativeChart.update();

        document.getElementById('fixedModelInitial').textContent = `₪${fixedPremium}`;
        document.getElementById('newModelInitial').textContent = `₪${monthlyData[0].newModel}`;
        document.getElementById('kupotInitial').textContent = `₪${monthlyData[0].kupot}`;
        document.getElementById('newModelTotal').textContent = `₪${newModelCumulative.toLocaleString()}`;
        document.getElementById('fixedModelTotal').textContent = `₪${fixedModelCumulative.toLocaleString()}`;
        document.getElementById('kupotTotal').textContent = `₪${kupotCumulative.toLocaleString()}`;
    }

    // Initialize
    createCharts();
    updateCharts();

    // Event listeners
    document.getElementById('ageInput').addEventListener('input', (e) => {
        currentAge = parseInt(e.target.value);
        document.getElementById('ageDisplay').textContent = currentAge;
        updateCharts();
    });

    document.getElementById('maleBtn').addEventListener('click', () => {
        currentGender = 'male';
        document.getElementById('maleBtn').classList.add('active');
        document.getElementById('femaleBtn').classList.remove('active');
        updateCharts();
    });

    document.getElementById('femaleBtn').addEventListener('click', () => {
        currentGender = 'female';
        document.getElementById('femaleBtn').classList.add('active');
        document.getElementById('maleBtn').classList.remove('active');
        updateCharts();
    });
}