// State Management
let currentView = 'dashboard';
let chartInstance = null;
let currentQuestionIndex = 0;
let upcoins = 0;
let correctAnswersCount = 0;
let courseCompleted = false;
let upcoinsAtAttemptStart = 0; // Track upcoins at the start of each attempt

// Question Data
const questions = [
    {
        id: 1,
        title: "Scenario: The Real Value of Money",
        scenario: "You have <strong>$100</strong> invested in a savings account earning <strong>2.0%</strong> interest per year. However, the inflation rate is <strong>1.0%</strong> per year.",
        question: "What is the <strong>ending real value</strong> of your money in <strong>10 years</strong>?",
        nominalRate: 0.02,
        inflationRate: 0.01,
        options: [
            { id: 'A', value: 110.46, label: '$110.46' },
            { id: 'B', value: 121.90, label: '$121.90' },
            { id: 'C', value: 100.00, label: '$100.00' },
            { id: 'D', value: 90.50, label: '$90.50' }
        ],
        correctAnswer: 110.46,
        explanation: "Great job! Even though you earned 2% interest, inflation ate away 1% of your purchasing power. Your real return is roughly 1% per year.",
        chartType: 'growth',
        character: {
            name: 'Financial Advisor',
            color: '#ffd700'
        }
    },
    {
        id: 2,
        title: "Scenario: Negative Real Rates",
        scenario: "Your savings account pays <strong>1.0%</strong> interest, but inflation is running at <strong>3.0%</strong>.",
        question: "What happens to your purchasing power over <strong>10 years</strong>?",
        nominalRate: 0.01,
        inflationRate: 0.03,
        options: [
            { id: 'A', value: 110.46, label: 'Grows to $110.46' },
            { id: 'B', value: 82.03, label: 'Shrinks to $82.03' },
            { id: 'C', value: 100.00, label: 'Stays at $100.00' },
            { id: 'D', value: 98.00, label: 'Shrinks to $98.00' }
        ],
        correctAnswer: 82.03,
        explanation: "Exactly. When inflation is higher than your interest rate, you are losing purchasing power every year. This is a negative real rate.",
        chartType: 'growth',
        character: {
            name: 'Student',
            color: '#60a5fa'
        }
    },
    {
        id: 3,
        title: "Scenario: Doubling Your Money (Rule of 72)",
        scenario: "You find an investment earning <strong>7.2%</strong> interest with <strong>0%</strong> inflation.",
        question: "Approximately how many years does it take to double your money?",
        nominalRate: 0.072,
        inflationRate: 0.00,
        options: [
            { id: 'A', value: 10, label: '10 Years' },
            { id: 'B', value: 7.2, label: '7.2 Years' },
            { id: 'C', value: 5, label: '5 Years' },
            { id: 'D', value: 15, label: '15 Years' }
        ],
        correctAnswer: 10,
        explanation: "Correct! The Rule of 72 states that 72 divided by the interest rate (7.2) gives the approximate years to double (10).",
        chartType: 'growth',
        character: {
            name: 'Economist',
            color: '#a78bfa'
        }
    },
    {
        id: 4,
        title: "Scenario: Deflation",
        scenario: "Prices are falling! Inflation is <strong>-2.0%</strong> (Deflation). You stuff cash ($100) under your mattress (0% interest).",
        question: "What is the real value of that cash in <strong>10 years</strong>?",
        nominalRate: 0.00,
        inflationRate: -0.02,
        options: [
            { id: 'A', value: 100.00, label: '$100.00' },
            { id: 'B', value: 80.00, label: '$80.00' },
            { id: 'C', value: 122.12, label: '$122.12' },
            { id: 'D', value: 0.00, label: '$0.00' }
        ],
        correctAnswer: 122.12,
        explanation: "Yes! In deflation, money gains value over time because prices drop. Your $100 can buy more goods in the future.",
        chartType: 'growth',
        character: {
            name: 'Investor',
            color: '#4ade80'
        }
    },
    {
        id: 5,
        title: "Scenario: Advanced Statistics",
        scenario: "The interest rate is a random variable uniformly distributed between <strong>1%</strong> and <strong>2%</strong>. You invest $100 for 1 year.",
        question: "What is the <strong>Expected Value (E)</strong> and <strong>Standard Deviation (σ)</strong> of your money after 1 year?",
        options: [
            { id: 'A', value: 101.50, label: 'E = $101.50, σ ≈ $0.29' },
            { id: 'B', value: 101.50, label: 'E = $101.50, σ ≈ $0.00' },
            { id: 'C', value: 102.00, label: 'E = $102.00, σ ≈ $0.50' },
            { id: 'D', value: 101.00, label: 'E = $101.00, σ ≈ $0.29' }
        ],
        correctAnswer: 101.50,
        explanation: "Correct! E[M] = 100(1 + 0.015) = $101.50. StdDev = 100 * sqrt((0.02-0.01)^2 / 12) ≈ $0.29.",
        chartType: 'distribution',
        character: {
            name: 'Mathematician',
            color: '#fb923c'
        }
    }
];

// Time Machine Data
const pastQuestions = [
    {
        id: 'p1',
        courseId: 1, // Linked to Interest Rates & Inflation
        title: "The Great Recession (2008)",
        scenario: "It's <strong>September 2007</strong>. The housing bubble has burst, and the economy is slowing down. The Federal Reserve meets to decide on interest rates.",
        question: "How did the Fed change the <strong>Federal Funds Rate</strong> between late 2007 and end of 2008?",
        options: [
            { id: 'A', label: 'Raised rates to fight inflation' },
            { id: 'B', label: 'Kept rates steady at 5.25%' },
            { id: 'C', label: 'Cut rates aggressively to near 0%' },
            { id: 'D', label: 'Raised rates slightly then cut them' }
        ],
        correctAnswer: 'C',
        explanation: "Correct! The Fed cut rates from 5.25% in Sep 2007 to a range of 0-0.25% by Dec 2008 to stimulate the economy during the financial crisis.",
        chartData: {
            labels: ['Sep 07', 'Jan 08', 'Apr 08', 'Oct 08', 'Dec 08', 'Jan 09'],
            data: [5.25, 3.5, 2.0, 1.0, 0.25, 0.25]
        }
    },
    {
        id: 'p2',
        courseId: 1,
        title: "The Volcker Shock (1980)",
        scenario: "It's <strong>1979</strong>. Inflation is rampant, reaching over 11%. Paul Volcker becomes Fed Chair.",
        question: "What drastic action did Volcker take to tame inflation by 1981?",
        options: [
            { id: 'A', label: 'Lowered rates to 2%' },
            { id: 'B', label: 'Raised rates to over 20%' },
            { id: 'C', label: 'Pegged the dollar to Gold' },
            { id: 'D', label: 'Increased government spending' }
        ],
        correctAnswer: 'B',
        explanation: "Correct! Volcker raised the Fed Funds Rate to a peak of over 20% in 1981 to crush inflation, causing a recession but eventually stabilizing prices.",
        chartData: {
            labels: ['1978', '1979', '1980', '1981', '1982', '1983'],
            data: [7.9, 11.2, 13.3, 16.4, 12.3, 9.1] // Approx effective rates
        }
    }
];

const futureQuestions = [
    {
        id: 'fed-rate',
        title: 'Fed Interest Rate Decision',
        question: 'Will the Federal Reserve raise interest rates at the next meeting?',
        options: [
            { id: 'Yes', label: 'Yes, by 25bps' },
            { id: 'No', label: 'No, hold steady' },
            { id: 'Cut', label: 'No, cut rates' }
        ],
        votes: { 'Yes': 60, 'No': 30, 'Cut': 10 },
        daysLeft: 5,
        relatedFinfluencer: {
            name: 'Market Maven',
            avatar: 'M',
            videoId: 'vid1'
        }
    },
    {
        id: 'crypto-cap',
        title: 'Crypto Market Cap',
        question: 'Will the total crypto market cap exceed $3T by end of month?',
        options: [
            { id: 'Yes', label: 'Yes' },
            { id: 'No', label: 'No' }
        ],
        votes: { 'Yes': 45, 'No': 55 },
        daysLeft: 12,
        relatedFinfluencer: {
            name: 'Crypto King',
            avatar: 'C',
            videoId: 'vid2'
        }
    },
    {
        id: 'tech-earnings',
        title: 'Tech Sector Earnings',
        question: 'Will the tech sector outperform the S&P 500 this quarter?',
        options: [
            { id: 'Outperform', label: 'Yes, Outperform' },
            { id: 'Underperform', label: 'No, Underperform' },
            { id: 'Match', label: 'Match Market' }
        ],
        votes: { 'Outperform': 70, 'Underperform': 20, 'Match': 10 },
        daysLeft: 8,
        relatedFinfluencer: {
            name: 'Tech Trends',
            avatar: 'T',
            videoId: 'vid3'
        }
    }
];

// Engage Data
const engageVideos = [
    {
        id: 'vid1',
        type: 'video',
        title: 'Why the Fed Might Surprise Us All',
        author: 'Market Maven',
        avatar: 'M',
        views: '12K views',
        duration: '15:24',
        timestamp: '2 days ago',
        thumbnail: '#',
        videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', // Placeholder
        description: 'Deep dive into the Federal Reserve\'s upcoming decisions and how inflation data might lead to unexpected policy changes. We analyze the latest economic indicators and what they mean for your investments.',
        relatedIndices: [1], // Tech Momentum Alpha index
        comments: [
            { user: 'TraderJoe', text: 'Great analysis on the inflation data!', timestamp: '1 day ago' },
            { user: 'Econ101', text: 'I think they will pause.', timestamp: '2 days ago' },
            { user: 'BullishBob', text: 'This aged well! Just saw the latest Fed minutes.', timestamp: '3 hours ago' },
            { user: 'DataDriven', text: 'The charts at 8:15 were especially insightful.', timestamp: '1 day ago' }
        ]
    },
    {
        id: 'vid2',
        type: 'video',
        title: 'Crypto Bull Run: Is $3T Inevitable?',
        author: 'Crypto King',
        avatar: 'C',
        views: '45K views',
        duration: '22:18',
        timestamp: '5 days ago',
        thumbnail: '#',
        videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', // Placeholder
        description: 'In this deep dive, we analyze whether the crypto market cap hitting $3 trillion is inevitable. We look at institutional adoption, regulatory clarity, and on-chain metrics that suggest a major bull run is coming.',
        relatedIndices: [3], // Crypto Volatility index
        comments: [
            { user: 'HODLer', text: 'To the moon! 🚀', timestamp: '4 days ago' },
            { user: 'Skeptic', text: 'Be careful of the volatility.', timestamp: '5 days ago' },
            { user: 'CryptoNewbie', text: 'Thanks for explaining the fundamentals so clearly!', timestamp: '3 days ago' },
            { user: 'BTCMaxi', text: 'Bitcoin dominance will lead the way.', timestamp: '2 days ago' },
            { user: 'AltcoinHunter', text: 'What about altcoin season?', timestamp: '1 day ago' }
        ]
    }
];

let activeBets = [];

// Indices Data
const indices = [
    {
        id: 1,
        name: "Tech Momentum Alpha",
        finfluencer: "Sarah Tradez",
        avatar: "S",
        return: "+24.5%",
        risk: "High",
        description: "Aggressive growth strategy focusing on AI and semiconductor stocks with momentum indicators.",
        holdings: ["NVDA", "AMD", "MSFT"]
    },
    {
        id: 2,
        name: "Dividend Kings",
        finfluencer: "Passive Pete",
        avatar: "P",
        return: "+8.2%",
        risk: "Low",
        description: "Stable income portfolio tracking aristocrats with 25+ years of dividend growth.",
        holdings: ["KO", "JNJ", "PG"]
    },
    {
        id: 3,
        name: "Crypto Volatility",
        finfluencer: "Crypto King",
        avatar: "C",
        return: "+145.2%",
        risk: "Very High",
        description: "High-risk, high-reward strategy trading major crypto pairs based on volatility breakouts.",
        holdings: ["BTC", "ETH", "SOL"]
    },
    {
        id: 4,
        name: "Green Energy Future",
        finfluencer: "Eco Investor",
        avatar: "E",
        return: "+12.4%",
        risk: "Medium",
        description: "Long-term thematic investing in renewable energy, EV infrastructure, and battery tech.",
        holdings: ["TSLA", "ENPH", "NEE"]
    }
];

// Navigation Logic will be initialized in DOMContentLoaded

function switchView(viewId) {
    // Hide all views
    document.querySelectorAll('.view').forEach(view => view.classList.remove('active'));
    // Deactivate all nav items
    document.querySelectorAll('.nav-item').forEach(nav => nav.classList.remove('active'));

    // Show selected view
    const targetView = document.getElementById(`${viewId}-view`);
    targetView.classList.add('active');

    // Activate nav item
    const navItem = document.querySelector(`.nav-item[data-view="${viewId}"]`);
    if (navItem) navItem.classList.add('active');

    // Scroll ONLY the main-content container to top (keeps sidebar visible)
    const mainContent = document.querySelector('.main-content');
    if (mainContent) {
        mainContent.scrollTop = 0;
    }

    if (viewId === 'indices') {
        renderIndices();
        renderUpvalooIndices();
    } else if (viewId === 'dashboard') {
        renderDashboardOverview();
    } else if (viewId === 'time-machine') {
        renderActiveBets();
    } else if (viewId === 'past') {
        startPastMode();
    } else if (viewId === 'future') {
        startFutureMode();
    } else if (viewId === 'engage') {
        renderEngageFeed();
    } else if (viewId === 'video-detail') {
        // Video detail is handled by openVideoDetail function
    }
}

function showDashboard() {
    switchView('dashboard');
}

function startCourse() {
    // Always start from the beginning when starting/retaking a course
    currentQuestionIndex = 0;
    correctAnswersCount = 0;
    upcoinsAtAttemptStart = upcoins; // Remember upcoins at start
    loadQuestion(currentQuestionIndex);
    switchView('course');
    setTimeout(initChart, 100);
}

// Dashboard Logic
function renderDashboardOverview() {
    // Update Stats
    const upcoinsDisplay = document.getElementById('upcoins-display');
    if (upcoinsDisplay) upcoinsDisplay.textContent = upcoins;

    // Update Progress Bar (Dashboard)
    const progressBar = document.getElementById('course-progress-bar');
    let progress = (currentQuestionIndex / questions.length) * 100;
    if (courseCompleted) progress = 100;

    if (progressBar) {
        progressBar.style.width = `${progress}%`;
    }

    // Sync Progress Bar (Courses View)
    const coursesViewProgress = document.querySelector('#courses-view .progress');
    if (coursesViewProgress) {
        coursesViewProgress.style.width = `${progress}%`;
    }

    // Update Course Button (Dashboard)
    const dashboardCourseBtn = document.querySelector('#dashboard-view .btn-start');
    if (dashboardCourseBtn) {
        if (courseCompleted) {
            // Change button to Retake
            dashboardCourseBtn.textContent = 'Retake Course';
            dashboardCourseBtn.classList.add('retake');
            dashboardCourseBtn.onclick = () => startCourse();

            // Add Test Knowledge Button (Check if exists first)
            if (!document.getElementById('dashboard-test-btn')) {
                const testBtn = document.createElement('button');
                testBtn.id = 'dashboard-test-btn'; // Add ID to prevent duplicates
                testBtn.className = 'btn btn-secondary';
                // Remove margin-top as gap is handled by flex container
                testBtn.style.width = '100%';
                testBtn.style.padding = '0.4rem 1rem'; // Smaller padding
                testBtn.style.fontSize = '0.85rem'; // Smaller font
                testBtn.innerHTML = `
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:14px;height:14px;display:inline;vertical-align:middle;margin-right:4px;">
                        <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    Time Travel
                `;
                testBtn.onclick = () => switchView('past');

                // Insert into .course-actions container (after start button)
                dashboardCourseBtn.parentNode.appendChild(testBtn);
            }

        } else if (currentQuestionIndex > 0) {
            dashboardCourseBtn.textContent = 'Resume';
            dashboardCourseBtn.classList.remove('retake');
            // Remove test button if it exists (e.g. if course was reset)
            const existingTestBtn = document.getElementById('dashboard-test-btn');
            if (existingTestBtn) existingTestBtn.remove();
        } else {
            dashboardCourseBtn.textContent = 'Start Learning';
            dashboardCourseBtn.classList.remove('retake');
            const existingTestBtn = document.getElementById('dashboard-test-btn');
            if (existingTestBtn) existingTestBtn.remove();
        }
    }

    // Sync Course Button (Courses View)
    const coursesViewBtn = document.querySelector('#courses-view .btn-start');
    if (coursesViewBtn) {
        if (courseCompleted) {
            coursesViewBtn.textContent = 'Retake Course';
            coursesViewBtn.classList.add('retake');
            coursesViewBtn.onclick = () => startCourse();
        } else if (currentQuestionIndex > 0) {
            coursesViewBtn.textContent = 'Resume';
            coursesViewBtn.classList.remove('retake');
        } else {
            coursesViewBtn.textContent = 'Start Learning';
            coursesViewBtn.classList.remove('retake');
        }
    }

    // Update Course Status Display
    const courseCard = document.querySelector('.course-card');
    if (courseCard && courseCompleted) {
        const statusBadge = courseCard.querySelector('.course-status') || document.createElement('span');
        if (!courseCard.querySelector('.course-status')) {
            statusBadge.className = 'course-status completed';
            statusBadge.textContent = 'Completed';
            const courseInfo = courseCard.querySelector('.course-info');
            if (courseInfo) courseInfo.appendChild(statusBadge);
        }
    }

    // Render Mini Indices Feed
    const miniFeed = document.getElementById('indices-overview-feed');
    if (miniFeed) {
        miniFeed.innerHTML = indices.slice(0, 2).map(index => `
            <div class="index-card mini">
                <div class="index-header">
                    <div class="finfluencer-info">
                        <div class="finfluencer-avatar small">${index.avatar}</div>
                        <div>
                            <h3>${index.name}</h3>
                            <span class="finfluencer-name">by ${index.finfluencer}</span>
                        </div>
                    </div>
                    <div class="index-return ${index.return.includes('+') ? 'positive' : 'negative'}">
                        ${index.return}
                    </div>
                </div>
            </div>
        `).join('');
    }

    // Render Dashboard Engage Feed (featured videos)
    const dashboardEngageFeed = document.getElementById('dashboard-engage-feed');
    if (dashboardEngageFeed) {
        const featuredVideos = engageVideos.filter(v => v.type === 'video').slice(0, 2); // Show only 2 videos
        dashboardEngageFeed.innerHTML = featuredVideos.map(item => {
            const icon = `<svg viewBox="0 0 24 24" fill="currentColor" stroke="none" style="width:20px;height:20px;">
                <path d="M8 5v14l11-7z"></path>
            </svg>`;

            return `
            <div class="content-card ${item.type}" onclick="openVideoDetail('${item.id}')">
                <div class="content-thumbnail">
                    <div class="play-icon">${icon}</div>
                    ${item.duration ? `<div class="content-duration">${item.duration}</div>` : ''}
                </div>
                <div class="content-details">
                    <h3 class="content-title">${item.title}</h3>
                    <div class="content-meta">
                        <div class="finfluencer-tag">
                            <div class="avatar-small">${item.avatar}</div>
                            <span>${item.author}</span>
                        </div>
                    </div>
                </div>
            </div>
        `;
        }).join('');
    }
}

// Engage Logic
function renderEngageFeed() {
    const feed = document.getElementById('engage-feed');
    feed.classList.remove('hidden');

    feed.innerHTML = engageVideos.map(item => {
        const isVideo = item.type === 'video';
        const icon = isVideo ?
            `<svg viewBox="0 0 24 24" fill="currentColor" stroke="none" style="width:24px;height:24px;">
                <path d="M8 5v14l11-7z"></path>
            </svg>` :
            `<svg viewBox="0 0 24 24" fill="currentColor" stroke="none" style="width:24px;height:24px;">
                <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"></path>
            </svg>`;

        const contentBadge = isVideo ? 'VIDEO' : 'BLOG';
        const duration = isVideo ? item.duration : item.readTime;

        return `
        <div class="content-card ${item.type}" onclick="openVideoDetail('${item.id}')">
            <div class="content-thumbnail">
                <span class="content-type-badge">${contentBadge}</span>
                <div class="play-icon">${icon}</div>
                ${duration ? `<div class="content-duration">${duration}</div>` : ''}
            </div>
            <div class="content-details">
                <h3 class="content-title">${item.title}</h3>
                <div class="content-meta">
                    <div class="finfluencer-tag">
                        <div class="avatar-small">${item.avatar}</div>
                        <span>${item.author}</span>
                    </div>
                    <span class="views-count">${item.views}</span>
                </div>
                <span class="content-timestamp">${item.timestamp}</span>
            </div>
        </div>
    `;
    }).join('');
}

// Video Detail Page Functions
let currentDetailVideoId = null;

function openVideoDetail(videoId) {
    const video = engageVideos.find(v => v.id === videoId);
    if (!video) return;

    currentDetailVideoId = videoId;

    // Switch to video detail view
    document.querySelectorAll('.view').forEach(view => view.classList.remove('active'));
    document.getElementById('video-detail-view').classList.add('active');

    // Scroll to top
    const mainContent = document.querySelector('.main-content');
    if (mainContent) mainContent.scrollTop = 0;

    // Reset and set video iframe
    const videoPlayerContainer = document.querySelector('.video-player-large');
    if (video.videoUrl) {
        // Create fresh iframe element to ensure proper loading
        videoPlayerContainer.innerHTML = `
            <iframe id="video-iframe" 
                    src="${video.videoUrl}" 
                    width="100%" 
                    height="100%" 
                    frameborder="0" 
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                    allowfullscreen>
            </iframe>
        `;
    } else {
        videoPlayerContainer.innerHTML = `
            <div class="video-placeholder">
                <div class="play-button-large">
                    <svg viewBox="0 0 24 24" fill="currentColor" stroke="none">
                        <path d="M8 5v14l11-7z"></path>
                    </svg>
                </div>
            </div>
        `;
    }

    // Set video info - ensure all elements are properly updated
    document.getElementById('video-detail-title').textContent = video.title;

    // Update author information
    const authorTag = document.getElementById('video-detail-author');
    const avatarSmall = authorTag.querySelector('.avatar-small');
    const authorSpan = authorTag.querySelector('span');

    avatarSmall.textContent = video.avatar;
    authorSpan.textContent = video.author;

    // Update meta information
    document.getElementById('video-detail-views').textContent = video.views;
    document.getElementById('video-detail-timestamp').textContent = video.timestamp;
    document.getElementById('video-detail-description').textContent = video.description || 'No description available.';

    // Render comments
    renderVideoDetailComments(video);

    // Render related indices
    renderRelatedIndices(video);
}

function renderVideoDetailComments(video) {
    const commentsList = document.getElementById('video-detail-comments');
    if (!video.comments || video.comments.length === 0) {
        commentsList.innerHTML = '<div style="color:var(--text-secondary); font-style:italic; text-align:center; padding:2rem;">No comments yet. Be the first to share your thoughts!</div>';
    } else {
        commentsList.innerHTML = video.comments.map(c => `
            <div class="comment-item">
                <div class="comment-avatar">${c.user.charAt(0)}</div>
                <div class="comment-content">
                    <div class="comment-header">
                        <span class="comment-user">${c.user}</span>
                        ${c.timestamp ? `<span class="comment-timestamp">${c.timestamp}</span>` : ''}
                    </div>
                    <div class="comment-text">${c.text}</div>
                </div>
            </div>
        `).join('');
    }
}

function renderRelatedIndices(video) {
    const indicesContainer = document.getElementById('video-detail-indices');
    if (!video.relatedIndices || video.relatedIndices.length === 0) {
        indicesContainer.innerHTML = '<p style="color:var(--text-secondary); font-style:italic;">No related indices</p>';
        return;
    }

    const relatedIndices = video.relatedIndices.map(indexId => indices.find(idx => idx.id === indexId)).filter(Boolean);

    indicesContainer.innerHTML = relatedIndices.map(index => `
        <div class="related-index-card" onclick="switchView('indices')">
            <h4>${index.name}</h4>
            <div class="finfluencer-name">by ${index.finfluencer}</div>
            <div class="index-return ${index.return.includes('+') ? 'positive' : 'negative'}">
                ${index.return}
            </div>
        </div>
    `).join('');
}

function postVideoDetailComment() {
    const input = document.getElementById('video-detail-comment-input');
    const text = input.value.trim();
    if (!text || !currentDetailVideoId) return;

    const video = engageVideos.find(v => v.id === currentDetailVideoId);
    if (!video) return;

    const now = new Date();
    video.comments.push({
        user: 'You',
        text: text,
        timestamp: 'Just now'
    });

    input.value = '';
    renderVideoDetailComments(video);
}

// Indices Logic
function renderIndices() {
    const feed = document.getElementById('indices-feed');
    feed.innerHTML = indices.map(index => `
        <div class="index-card">
            <div class="index-header">
                <div class="finfluencer-info">
                    <div class="finfluencer-avatar">${index.avatar}</div>
                    <div>
                        <h3>${index.name}</h3>
                        <span class="finfluencer-name">by ${index.finfluencer}</span>
                    </div>
                </div>
                <div class="index-return ${index.return.includes('+') ? 'positive' : 'negative'}">
                    ${index.return}
                </div>
            </div>
            <p class="index-desc">${index.description}</p>
            <div class="index-meta">
                <div class="holdings">
                    ${index.holdings.map(h => `<span class="holding-tag">${h}</span>`).join('')}
                </div>
                <span class="risk-badge ${index.risk.toLowerCase().replace(' ', '-')}">${index.risk} Risk</span>
            </div>
            <button class="btn btn-outline-light btn-invest">Invest in Index</button>
        </div>
    `).join('');
}

// Upvaloo Managed Indices Data
const upvalooIndices = [
    {
        name: 'S&P 500',
        ticker: 'SPX',
        return: '+28.5%',
        risk: 'Medium',
        features: ['Tax-Loss Harvesting', 'Auto-Rebalancing', 'Low Fees (0.03%)']
    },
    {
        name: 'Nasdaq 100',
        ticker: 'NDX',
        return: '+35.2%',
        risk: 'Medium-High',
        features: ['Tax-Loss Harvesting', 'Sector Optimization', 'Low Fees (0.05%)']
    },
    {
        name: 'Total Market',
        ticker: 'VTI',
        return: '+26.1%',
        risk: 'Medium',
        features: ['Full Diversification', 'Tax Optimization', 'Ultra-Low Fees (0.02%)']
    }
];

function renderUpvalooIndices() {
    const container = document.getElementById('upvaloo-indices-list');
    if (!container) return;

    container.innerHTML = upvalooIndices.map(index => `
        <div class="upvaloo-index-card">
            <div class="upvaloo-index-header">
                <div>
                    <h4>${index.name}</h4>
                    <span class="ticker-small">${index.ticker}</span>
                </div>
                <span class="upvaloo-badge">UPVALOO</span>
            </div>
            <div class="index-return positive">${index.return} YTD</div>
            <div class="optimization-features">
                ${index.features.map(feature => `
                    <div class="feature-tag">
                        <span class="feature-icon">✓</span>
                        <span>${feature}</span>
                    </div>
                `).join('')}
            </div>
            <button class="btn btn-primary" style="width: 100%; margin-top: 1rem; font-size: 0.85rem;">
                Learn More
            </button>
        </div>
    `).join('');
}

// Character Creation Function
function createCharacterSVG(character) {
    const color = character.color;
    const name = character.name;

    return `
        <div class="character-container">
            <svg class="character-avatar" viewBox="0 0 200 280" xmlns="http://www.w3.org/2000/svg">
                ${getFullBodyCharacter(name, color)}
            </svg>
        </div>
    `;
}

function getFullBodyCharacter(name, color) {
    const baseCharacter = `
        <g class="head">
            <!-- Head -->
            <circle cx="100" cy="50" r="25" fill="#f5d5b8" stroke="${color}" stroke-width="2"/>
            
            <!-- Hair -->
            <path d="M 75 45 Q 75 25 100 25 Q 125 25 125 45" fill="#4a3728" stroke="${color}" stroke-width="1"/>
            
            <!-- Eyes -->
            <g class="eyes">
                <ellipse cx="92" cy="48" rx="3" ry="5" fill="#333"/>
                <ellipse cx="108" cy="48" rx="3" ry="5" fill="#333"/>
            </g>
            
            <!-- Eyelashes -->
            <g class="eyelashes">
                <!-- Left eyelashes -->
                <line x1="89" y1="43" x2="88" y2="41" stroke="#333" stroke-width="0.8" stroke-linecap="round"/>
                <line x1="92" y1="42" x2="92" y2="40" stroke="#333" stroke-width="0.8" stroke-linecap="round"/>
                <line x1="95" y1="43" x2="96" y2="41" stroke="#333" stroke-width="0.8" stroke-linecap="round"/>
                <!-- Right eyelashes -->
                <line x1="105" y1="43" x2="104" y2="41" stroke="#333" stroke-width="0.8" stroke-linecap="round"/>
                <line x1="108" y1="42" x2="108" y2="40" stroke="#333" stroke-width="0.8" stroke-linecap="round"/>
                <line x1="111" y1="43" x2="112" y2="41" stroke="#333" stroke-width="0.8" stroke-linecap="round"/>
            </g>
            
            <!-- Smile -->
            <path d="M 90 58 Q 100 63 110 58" stroke="#333" stroke-width="1.5" fill="none" stroke-linecap="round"/>
        </g>
    `;


    switch (name) {
        case 'Financial Advisor':
            return baseCharacter + `
                <!-- Suit Body -->
                <rect x="80" y="75" width="40" height="60" fill="${color}" opacity="0.8" rx="5"/>
                
                <!-- Tie -->
                <polygon points="100,75 95,85 100,115 105,85" fill="#1a1a1a" opacity="0.6"/>
                
                <!-- Arms -->
                <rect x="60" y="80" width="15" height="50" fill="${color}" opacity="0.7" rx="3"/>
                <g class="right-arm">
                    <rect x="125" y="80" width="15" height="50" fill="${color}" opacity="0.7" rx="3"/>
                </g>
                
                <!-- Briefcase in hand -->
                <g class="prop">
                    <rect x="135" y="120" width="25" height="18" fill="#8b4513" stroke="#654321" stroke-width="1.5" rx="2"/>
                    <rect x="145" y="115" width="5" height="8" fill="#654321" rx="1"/>
                    <line x1="140" y1="129" x2="155" y2="129" stroke="#654321" stroke-width="1"/>
                </g>
                
                <!-- Legs -->
                <rect x="85" y="135" width="12" height="60" fill="#2c2c2c" rx="2"/>
                <rect x="103" y="135" width="12" height="60" fill="#2c2c2c" rx="2"/>
                
                <!-- Shoes -->
                <ellipse cx="91" cy="200" rx="8" ry="4" fill="#1a1a1a"/>
                <ellipse cx="109" cy="200" rx="8" ry="4" fill="#1a1a1a"/>
            `;

        case 'Student':
            return baseCharacter + `
                <!-- Glasses -->
                <g>
                    <circle cx="92" cy="48" r="8" fill="none" stroke="${color}" stroke-width="2"/>
                    <circle cx="108" cy="48" r="8" fill="none" stroke="${color}" stroke-width="2"/>
                    <line x1="100" y1="48" x2="100" y2="48" stroke="${color}" stroke-width="2"/>
                </g>
                
                <!-- Casual Shirt -->
                <rect x="80" y="75" width="40" height="60" fill="${color}" opacity="0.6" rx="5"/>
                <circle cx="90" cy="85" r="2" fill="#fff" opacity="0.8"/>
                <circle cx="90" cy="95" r="2" fill="#fff" opacity="0.8"/>
                <circle cx="90" cy="105" r="2" fill="#fff" opacity="0.8"/>
                
                <!-- Arms -->
                <rect x="60" y="80" width="15" height="50" fill="${color}" opacity="0.5" rx="3"/>
                <g class="right-arm">
                    <rect x="125" y="80" width="15" height="50" fill="${color}" opacity="0.5" rx="3"/>
                </g>
                
                <!-- Backpack -->
                <g class="prop">
                    <rect x="45" y="85" width="30" height="35" fill="#4a5568" stroke="#2d3748" stroke-width="2" rx="3"/>
                    <rect x="52" y="90" width="7" height="10" fill="#718096" rx="1"/>
                    <rect x="61" y="90" width="7" height="10" fill="#718096" rx="1"/>
                    <line x1="55" y1="80" x2="55" y2="85" stroke="#2d3748" stroke-width="3"/>
                    <line x1="65" y1="80" x2="65" y2="85" stroke="#2d3748" stroke-width="3"/>
                </g>
                
                <!-- Legs -->
                <rect x="85" y="135" width="12" height="60" fill="#4299e1" rx="2"/>
                <rect x="103" y="135" width="12" height="60" fill="#4299e1" rx="2"/>
                
                <!-- Sneakers -->
                <ellipse cx="91" cy="200" rx="9" ry="5" fill="#e53e3e"/>
                <ellipse cx="109" cy="200" rx="9" ry="5" fill="#e53e3e"/>
            `;

        case 'Economist':
            return baseCharacter + `
                <!-- Professional Blazer -->
                <rect x="80" y="75" width="40" height="60" fill="${color}" opacity="0.7" rx="5"/>
                <polygon points="100,75 95,80 95,95 100,90 105,95 105,80" fill="#fff" opacity="0.6"/>
                
                <!-- Arms -->
                <rect x="60" y="80" width="15" height="50" fill="${color}" opacity="0.6" rx="3"/>
                <g class="right-arm">
                    <rect x="125" y="80" width="15" height="50" fill="${color}" opacity="0.6" rx="3"/>
                </g>
                
                <!-- Clipboard with chart -->
                <g class="prop">
                    <rect x="130" y="100" width="30" height="40" fill="#f7fafc" stroke="#2d3748" stroke-width="2" rx="2"/>
                    <rect x="135" y="95" width="20" height="5" fill="#4a5568" rx="1"/>
                    <!-- Chart lines -->
                    <polyline points="135,130 140,125 145,120 150,128 155,115" stroke="${color}" stroke-width="2" fill="none"/>
                    <line x1="135" y1="135" x2="155" y2="135" stroke="#cbd5e0" stroke-width="1"/>
                </g>
                
                <!-- Legs -->
                <rect x="85" y="135" width="12" height="60" fill="#4a5568" rx="2"/>
                <rect x="103" y="135" width="12" height="60" fill="#4a5568" rx="2"/>
                
                <!-- Shoes -->
                <ellipse cx="91" cy="200" rx="8" ry="4" fill="#2d3748"/>
                <ellipse cx="109" cy="200" rx="8" ry="4" fill="#2d3748"/>
            `;

        case 'Investor':
            return baseCharacter + `
                <!-- Business Suit -->
                <rect x="80" y="75" width="40" height="60" fill="${color}" opacity="0.8" rx="5"/>
                <rect x="88" y="75" width="24" height="60" fill="#2d3748" opacity="0.4" rx="3"/>
                
                <!-- Arms -->
                <rect x="60" y="80" width="15" height="50" fill="${color}" opacity="0.7" rx="3"/>
                <g class="right-arm">
                    <rect x="125" y="80" width="15" height="50" fill="${color}" opacity="0.7" rx="3"/>
                </g>
                
                <!-- Stack of Cash in hand -->
                <g class="prop" transform="translate(130, 110)">
                    <rect x="0" y="0" width="28" height="18" fill="#48bb78" stroke="#2f855a" stroke-width="1.5" rx="1"/>
                    <rect x="2" y="-3" width="28" height="18" fill="#48bb78" stroke="#2f855a" stroke-width="1.5" rx="1"/>
                    <rect x="4" y="-6" width="28" height="18" fill="#68d391" stroke="#2f855a" stroke-width="1.5" rx="1"/>
                    <text x="18" y="8" font-size="10" fill="#1a472a" text-anchor="middle" font-weight="bold">$$$</text>
                </g>
                
                <!-- Legs -->
                <rect x="85" y="135" width="12" height="60" fill="#1a202c" rx="2"/>
                <rect x="103" y="135" width="12" height="60" fill="#1a202c" rx="2"/>
                
                <!-- Dress Shoes -->
                <ellipse cx="91" cy="200" rx="8" ry="4" fill="#000"/>
                <ellipse cx="109" cy="200" rx="8" ry="4" fill="#000"/>
            `;

        case 'Mathematician':
            return baseCharacter + `
                <!-- Cardigan/Sweater -->
                <rect x="80" y="75" width="40" height="60" fill="${color}" opacity="0.6" rx="5"/>
                <line x1="100" y1="75" x2="100" y2="135" stroke="#fff" stroke-width="2" opacity="0.6"/>
                
                <!-- Arms -->
                <rect x="60" y="80" width="15" height="50" fill="${color}" opacity="0.5" rx="3"/>
                <g class="right-arm">
                    <rect x="125" y="80" width="15" height="50" fill="${color}" opacity="0.5" rx="3"/>
                </g>
                
                <!-- Calculator in hand -->
                <g class="prop" transform="translate(50, 115)">
                    <rect x="0" y="0" width="22" height="30" fill="#2d3748" stroke="#1a202c" stroke-width="2" rx="2"/>
                    <rect x="2" y="2" width="18" height="8" fill="#68d391" rx="1"/>
                    <!-- Calculator buttons -->
                    <circle cx="6" cy="15" r="2" fill="#4a5568"/>
                    <circle cx="11" cy="15" r="2" fill="#4a5568"/>
                    <circle cx="16" cy="15" r="2" fill="#4a5568"/>
                    <circle cx="6" cy="20" r="2" fill="#4a5568"/>
                    <circle cx="11" cy="20" r="2" fill="#4a5568"/>
                    <circle cx="16" cy="20" r="2" fill="#4a5568"/>
                    <circle cx="6" cy="25" r="2" fill="#4a5568"/>
                    <circle cx="11" cy="25" r="2" fill="#4a5568"/>
                    <circle cx="16" cy="25" r="2" fill="${color}"/>
                </g>
                
                <!-- Legs -->
                <rect x="85" y="135" width="12" height="60" fill="#805ad5" rx="2"/>
                <rect x="103" y="135" width="12" height="60" fill="#805ad5" rx="2"/>
                
                <!-- Shoes -->
                <ellipse cx="91" cy="200" rx="8" ry="4" fill="#553c9a"/>
                <ellipse cx="109" cy="200" rx="8" ry="4" fill="#553c9a"/>
            `;

        default:
            return baseCharacter;
    }
}

// Course Logic
function loadQuestion(index) {
    const q = questions[index];

    // Update Progress
    document.getElementById('current-question-num').textContent = index + 1;
    document.querySelector('.question-progress').innerHTML = `Question <span id="current-question-num">${index + 1}</span>/5`;

    // Update Content
    document.getElementById('scenario-title').textContent = q.title;
    document.getElementById('scenario-text').innerHTML = q.scenario;
    document.getElementById('question-text').innerHTML = q.question;

    // Render Character
    const characterDisplay = document.getElementById('character-display');
    if (characterDisplay && q.character) {
        characterDisplay.innerHTML = createCharacterSVG(q.character);
    }

    // Update Options
    const optionsGrid = document.getElementById('options-grid');
    optionsGrid.innerHTML = q.options.map(opt => `
        <button class="option-btn" onclick="checkAnswer(this, ${opt.value})">
            <span class="option-label">${opt.id}</span>
            ${opt.label}
        </button>
    `).join('');

    // Reset Feedback
    document.getElementById('feedback-area').classList.add('hidden');
    document.getElementById('feedback-area').classList.remove('success', 'error');
    document.getElementById('next-btn').classList.add('hidden');

    // Reset Chart
    if (chartInstance) {
        initChart();
    }
}

function nextQuestion() {
    currentQuestionIndex++;
    if (currentQuestionIndex < questions.length) {
        loadQuestion(currentQuestionIndex);
    } else {
        // Course Finished - Calculate Results
        const totalQuestions = questions.length;
        const scorePercentage = (correctAnswersCount / totalQuestions) * 100;
        const passingScore = 80;

        if (scorePercentage >= passingScore) {
            // PASS: Keep all earned upcoins (already awarded during quiz)
            courseCompleted = true;
            alert(`🎉 Course Completed! You scored ${correctAnswersCount}/${totalQuestions} (${scorePercentage}%)\n\nYou earned ${correctAnswersCount} Upcoins!`);
            document.getElementById('courses-completed-display').textContent = '1';
        } else {
            // FAIL: Reset upcoins to start amount + 1, allow retake
            const upcoinsEarned = correctAnswersCount;
            upcoins = upcoinsAtAttemptStart + 1; // Only get 1 upcoin for failing
            courseCompleted = false;
            alert(`You scored ${correctAnswersCount}/${totalQuestions} (${scorePercentage}%)\n\nYou need 80% to pass. You earned 1 Upcoin.\n\nTry again - you can retake as many times as you'd like!`);
        }

        // Save state to localStorage
        localStorage.setItem('courseCompleted', courseCompleted);
        localStorage.setItem('upcoins', upcoins);

        showDashboard();
    }
}

// Chart Logic
function initChart() {
    const ctx = document.getElementById('growthChart').getContext('2d');
    const q = questions[currentQuestionIndex];

    if (chartInstance) {
        chartInstance.destroy();
    }

    if (q.chartType === 'distribution') {
        // Probability Density Function Chart
        chartInstance = new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['0%', '0.5%', '1.0%', '1.5%', '2.0%', '2.5%', '3.0%'],
                datasets: [{
                    label: 'Probability Density',
                    data: [0, 0, 1, 1, 1, 0, 0], // Uniform distribution between 1% and 2%
                    borderColor: '#ffd700',
                    backgroundColor: 'rgba(255, 215, 0, 0.2)',
                    borderWidth: 2,
                    fill: true,
                    stepped: true,
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 1.5,
                        title: { display: true, text: 'Density', color: '#a0a0a0' },
                        grid: { color: 'rgba(255, 255, 255, 0.1)' },
                        ticks: { color: '#a0a0a0' }
                    },
                    x: {
                        grid: { display: false },
                        ticks: { color: '#a0a0a0' }
                    }
                },
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        callbacks: {
                            label: () => 'Uniform Probability Density'
                        }
                    }
                }
            }
        });
    } else {
        // Standard Growth Chart
        // Initial data (Year 0)
        const labels = Array.from({ length: 11 }, (_, i) => `Year ${i}`);
        const nominalData = [100];
        const realData = [100];

        // Fill with nulls for animation
        for (let i = 1; i <= 10; i++) {
            nominalData.push(null);
            realData.push(null);
        }

        chartInstance = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [
                    {
                        label: `Nominal (${(q.nominalRate * 100).toFixed(1)}%)`,
                        data: nominalData,
                        borderColor: '#ffd700',
                        backgroundColor: 'rgba(255, 215, 0, 0.1)',
                        borderWidth: 2,
                        tension: 0.4,
                        fill: true
                    },
                    {
                        label: `Real (Net ${(((1 + q.nominalRate) / (1 + q.inflationRate) - 1) * 100).toFixed(1)}%)`,
                        data: realData,
                        borderColor: '#4ade80',
                        backgroundColor: 'rgba(74, 222, 128, 0.1)',
                        borderWidth: 2,
                        tension: 0.4,
                        fill: true
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                animation: {
                    duration: 1000,
                    easing: 'easeOutQuart'
                },
                scales: {
                    y: {
                        beginAtZero: false,
                        grid: { color: 'rgba(255, 255, 255, 0.1)' },
                        ticks: { color: '#a0a0a0', callback: value => '$' + value }
                    },
                    x: {
                        grid: { display: false },
                        ticks: { color: '#a0a0a0' }
                    }
                },
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        mode: 'index',
                        intersect: false,
                        callbacks: {
                            label: function (context) {
                                let label = context.dataset.label || '';
                                if (label) label += ': ';
                                if (context.parsed.y !== null) {
                                    label += new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(context.parsed.y);
                                }
                                return label;
                            }
                        }
                    }
                }
            }
        });
    }
}

// Answer Logic
function checkAnswer(btn, value) {
    const q = questions[currentQuestionIndex];

    // Disable all buttons
    const buttons = document.querySelectorAll('.option-btn');
    buttons.forEach(b => b.disabled = true);

    const isCorrect = Math.abs(value - q.correctAnswer) < 0.1; // Tolerance for rounding

    // Show feedback
    const feedbackArea = document.getElementById('feedback-area');
    const feedbackTitle = document.getElementById('feedback-title');
    const feedbackMessage = document.getElementById('feedback-message');
    const nextBtn = document.getElementById('next-btn');

    feedbackArea.classList.remove('hidden');
    nextBtn.classList.remove('hidden');

    if (isCorrect) {
        btn.classList.add('correct');
        feedbackArea.classList.add('success');
        feedbackTitle.textContent = 'Correct!';
        feedbackMessage.textContent = q.explanation;

        // Track correct answer
        correctAnswersCount++;
        // Temporarily add Upcoin (will be adjusted at end if failed)
        upcoins++;

    } else {
        btn.classList.add('incorrect');
        feedbackArea.classList.add('error');
        feedbackTitle.textContent = 'Not quite right';
        feedbackMessage.textContent = q.explanation;
    }

    // Animate the chart
    if (q.chartType !== 'distribution') {
        animateChartResults(q);
    }
}

function animateChartResults(q) {
    const nominalRate = q.nominalRate;
    const inflationRate = q.inflationRate;
    // Real rate formula: (1+n)/(1+i) - 1
    const realRate = (1 + nominalRate) / (1 + inflationRate) - 1;

    let currentNominal = 100;
    let currentReal = 100;

    let year = 1;

    const interval = setInterval(() => {
        if (year > 10) {
            clearInterval(interval);
            return;
        }

        currentNominal = currentNominal * (1 + nominalRate);
        currentReal = currentReal * (1 + realRate);

        chartInstance.data.datasets[0].data[year] = currentNominal;
        chartInstance.data.datasets[1].data[year] = currentReal;

        chartInstance.update();
        year++;
    }, 100); // Faster animation
}

// Time Machine Logic
function startTimeMachine(mode) {
    if (mode === 'past') {
        switchView('past');
    } else {
        switchView('future');
    }
}

// Past Mode
let currentPastQuestion = null;

function startPastMode() {
    // Filter questions based on completed courses (For demo, we assume course 1 is relevant)
    // In a real app, check `courseCompleted` and filter `pastQuestions`
    const availableQuestions = pastQuestions; // Use all for demo

    // Pick random
    const q = availableQuestions[Math.floor(Math.random() * availableQuestions.length)];
    currentPastQuestion = q;

    // Render
    document.getElementById('past-scenario-title').textContent = q.title;
    document.getElementById('past-scenario-text').innerHTML = q.scenario;
    document.getElementById('past-question-text').innerHTML = q.question;

    document.getElementById('past-options-grid').innerHTML = q.options.map(opt => `
        <button class="option-btn" onclick="checkPastAnswer(this, '${opt.id}')">
            <span class="option-label">${opt.id}</span>
            ${opt.label}
        </button>
    `).join('');

    // Reset Feedback & Chart
    document.getElementById('past-feedback-area').classList.add('hidden');
    document.getElementById('past-feedback-area').classList.remove('success', 'error');

    // Clear previous chart
    const ctx = document.getElementById('pastChart').getContext('2d');
    if (chartInstance) chartInstance.destroy();

    // Initialize empty chart or placeholder
    chartInstance = new Chart(ctx, {
        type: 'line',
        data: {
            labels: q.chartData.labels,
            datasets: [{
                label: 'Interest Rate (%)',
                data: [], // Start empty
                borderColor: '#60a5fa',
                backgroundColor: 'rgba(96, 165, 250, 0.1)',
                borderWidth: 2,
                fill: true
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: { beginAtZero: true, grid: { color: 'rgba(255,255,255,0.1)' } },
                x: { grid: { display: false } }
            }
        }
    });
}

function checkPastAnswer(btn, selectedId) {
    const q = currentPastQuestion;
    const isCorrect = selectedId === q.correctAnswer;

    // Disable buttons
    document.querySelectorAll('#past-options-grid .option-btn').forEach(b => b.disabled = true);

    const feedbackArea = document.getElementById('past-feedback-area');
    feedbackArea.classList.remove('hidden');

    if (isCorrect) {
        btn.classList.add('correct');
        feedbackArea.classList.add('success');
        document.getElementById('past-feedback-title').textContent = 'Correct!';
        document.getElementById('past-feedback-message').textContent = q.explanation;

        // Award Upcoin
        upcoins++;
        localStorage.setItem('upcoins', upcoins);
        // Note: Dashboard update happens on view switch, but we can update if visible elements exist
    } else {
        btn.classList.add('incorrect');
        feedbackArea.classList.add('error');
        document.getElementById('past-feedback-title').textContent = 'Not quite...';
        document.getElementById('past-feedback-message').textContent = q.explanation;
    }

    // Reveal Chart Data
    chartInstance.data.datasets[0].data = q.chartData.data;
    chartInstance.update();
}

// Future Mode
let currentFutureQuestion = null;

function startFutureMode() {
    // Filter out questions that already have active bets
    const activeQuestionIds = activeBets.map(b => b.questionId);
    const availableQuestions = futureQuestions.filter(q => !activeQuestionIds.includes(q.id));

    if (availableQuestions.length === 0) {
        // Exhausted State - Clear message and show active bets
        document.getElementById('future-question-title').textContent = "No More Bets Available";
        document.getElementById('future-question-text').innerHTML =
            "<strong>You've placed all available bets!</strong><br><br>" +
            "Check back tomorrow for new prediction opportunities, or view your active bets below.";
        document.getElementById('future-options-grid').innerHTML = '';
        document.querySelector('#future-view .visualization-panel').classList.add('hidden');
        document.getElementById('future-feedback-area').classList.add('hidden');
        // Ensure card is visible but clear options
        document.querySelector('#future-view .question-card').classList.remove('hidden');

        // Show active bets section in future view
        renderActiveBets();
        return;
    }

    // Pick random
    const q = availableQuestions[Math.floor(Math.random() * availableQuestions.length)];
    currentFutureQuestion = q;

    document.getElementById('future-question-title').textContent = q.title;
    document.getElementById('future-question-text').innerHTML = q.question;

    document.getElementById('future-options-grid').innerHTML = q.options.map(opt => `
        <button class="option-btn" onclick="submitPrediction('${opt.id}')">
            <span class="option-label">${opt.id}</span>
            ${opt.label}
        </button>
    `).join('');

    document.getElementById('future-feedback-area').classList.add('hidden');

    // Hide chart initially
    document.querySelector('#future-view .visualization-panel').classList.add('hidden');

    // Clear chart instance if exists
    if (chartInstance) chartInstance.destroy();
}

function submitPrediction(selectedId) {
    const q = currentFutureQuestion;

    // Save Bet
    const bet = {
        id: Date.now(),
        questionId: q.id, // Track ID to prevent repeats
        question: q.question,
        choice: selectedId,
        status: 'Pending',
        date: new Date().toLocaleDateString(),
        daysLeft: q.daysLeft
    };
    activeBets.push(bet);
    localStorage.setItem('activeBets', JSON.stringify(activeBets));

    // Show Feedback
    document.getElementById('future-feedback-area').classList.remove('hidden');
    document.querySelectorAll('#future-options-grid .option-btn').forEach(b => {
        b.disabled = true;
        if (b.textContent.includes(selectedId)) b.classList.add('selected');
    });

    // Reveal and Render Chart
    const vizPanel = document.querySelector('#future-view .visualization-panel');
    vizPanel.classList.remove('hidden');

    const ctx = document.getElementById('futureChart').getContext('2d');
    if (chartInstance) chartInstance.destroy();

    chartInstance = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: Object.keys(q.votes),
            datasets: [{
                data: Object.values(q.votes),
                backgroundColor: ['#ffd700', '#e0e0e0', '#a0a0a0'],
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { position: 'bottom', labels: { color: '#fff' } } }
        }
    });
}

function renderActiveBets() {
    const containers = [
        document.getElementById('dashboard-bets-list'),
        document.getElementById('tm-bets-list')
    ];

    const html = activeBets.length ? activeBets.map(bet => {
        // Find the original question to get related finfluencer info
        const relatedQuestion = futureQuestions.find(q => q.id === bet.questionId);
        const finfluencer = relatedQuestion?.relatedFinfluencer;

        return `
        <div class="bet-card">
            <div class="bet-header">
                <span>${bet.date}</span>
                <span class="bet-status">${bet.status}</span>
            </div>
            <p class="bet-question">${bet.question}</p>
            <div class="bet-choice">
                <span>Your Prediction:</span>
                <strong>${bet.choice}</strong>
            </div>
            ${finfluencer ? `
            <div class="bet-finfluencer">
                <span class="finfluencer-label">Related Finfluencer:</span>
                <div class="finfluencer-tag" onclick="openVideoFromBet('${finfluencer.videoId}')">
                    <div class="avatar-small">${finfluencer.avatar}</div>
                    <span>${finfluencer.name}</span>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:14px;height:14px;margin-left:4px;">
                        <path d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"></path>
                        <path d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                </div>
            </div>
            ` : ''}
            <div class="bet-footer">
                <span class="days-left">⏳ ${bet.daysLeft} days left</span>
            </div>
        </div>
    `;
    }).join('') : '<p style="color: var(--text-secondary); font-style: italic;">No active predictions yet.</p>';

    containers.forEach(c => {
        if (c) {
            c.innerHTML = html;
            // Show/Hide container based on content
            if (activeBets.length > 0) {
                c.parentElement.classList.remove('hidden');
            } else {
                // Keep hidden on dashboard if empty, maybe show on TM page?
                // For now, let's show "No active predictions" on TM page, hide on Dashboard
                if (c.id === 'dashboard-bets-list') {
                    c.parentElement.classList.add('hidden');
                } else {
                    c.parentElement.classList.remove('hidden');
                }
            }
        }
    });
}

// Helper function to open video from bet card and switch to Engage view
function openVideoFromBet(videoId) {
    switchView('engage');
    // Small delay to ensure view is switched before opening video
    setTimeout(() => openVideo(videoId), 100);
}

// Initialize Dashboard on Load
renderDashboardOverview();

document.addEventListener('DOMContentLoaded', () => {
    // Setup Navigation Event Listeners
    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const viewId = item.getAttribute('data-view');
            if (viewId) {
                switchView(viewId);
            }
        });
    });

    // Load saved state from localStorage
    const savedCompleted = localStorage.getItem('courseCompleted');
    const savedUpcoins = localStorage.getItem('upcoins');

    if (savedCompleted !== null) {
        courseCompleted = savedCompleted === 'true';
    }
    if (savedUpcoins !== null) {
        upcoins = parseInt(savedUpcoins) || 0;
    }

    // Load Bets
    const savedBets = localStorage.getItem('activeBets');
    if (savedBets) {
        activeBets = JSON.parse(savedBets);
    }

    renderDashboardOverview();
    renderActiveBets();
});
