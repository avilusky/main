// ===== CHART.JS CONFIGURATION =====
Chart.defaults.font.family = "'Heebo', sans-serif";
Chart.defaults.font.size = 13;
Chart.defaults.color = '#5A6B7C';
Chart.defaults.plugins.legend.labels.usePointStyle = true;
Chart.defaults.plugins.legend.rtl = true;
Chart.defaults.plugins.legend.labels.textDirection = 'rtl';

// Legend click hint plugin - draws a subtle hint next to the legend
Chart.register({
    id: 'legendHint',
    afterDraw(chart) {
        if (chart.options.plugins?.legendHint === false) return;
        const legendOpts = chart.options.plugins?.legend;
        if (legendOpts && legendOpts.display === false) return;
        if (!chart.legend || chart.legend.legendItems?.length < 2) return;

        const legend = chart.legend;
        const ctx = chart.ctx;
        ctx.save();
        ctx.font = "12px 'Heebo', sans-serif";
        ctx.fillStyle = 'rgba(148, 163, 184, 0.6)';
        ctx.textAlign = 'right';
        ctx.textBaseline = 'middle';
        const y = legend.top + legend.height / 2;
        ctx.fillText('💡 לחץ על מקרא לסינון', chart.width - 6, y);
        ctx.restore();
    }
});

// Global animation - bars grow from bottom
Chart.defaults.elements.bar.base = 0;

// ===== COLOR PALETTE =====
const colors = {
    clalit: '#103A97',
    maccabi: '#FDC509',
    meuhedet: '#5C83E3',
    leumit: '#36CEC4',
    color5: '#FD9802',
    color6: '#A0ECF7',
    success: '#36CEC4',
    warning: '#FDC509',
    danger: '#FD9802',
    gray: '#94A3B8'
};

const gradients = {
    clalit: ['#103A97', '#5C83E3'],
    maccabi: ['#FDC509', '#FD9802'],
    meuhedet: ['#5C83E3', '#A0ECF7'],
    leumit: ['#36CEC4', '#A0ECF7']
};

// ===== DATA =====
const quarters = ['Q3 2024', 'Q4 2024', 'Q1 2025', 'Q2 2025', 'Q3 2025'];
const years = ['2021', '2022', '2023', '2024', '2025'];
const quartersExtended = ['Q3 2024', 'Q4 2024', 'Q1 2025', 'Q2 2025', 'Q3 2025', 'Q4 2025'];
const quartersFull = ['Q4 2022', 'Q1 2023', 'Q2 2023', 'Q3 2023', 'Q4 2023', 'Q1 2024', 'Q2 2024', 'Q3 2024', 'Q4 2024', 'Q1 2025', 'Q2 2025', 'Q3 2025', 'Q4 2025'];
// רבעונים לניתוח צמיחת קרנות (מורחב מ-Q1 2024)
const fundGrowthQuarters = ['Q1 2024', 'Q2 2024', 'Q3 2024', 'Q4 2024', 'Q1 2025', 'Q2 2025', 'Q3 2025'];

// נתוני צמיחת קרנות - פקטור ביטוח (כולל transfer), פקטור השקעות, והעברה למבטח
const fundGrowthData = {
    clalit: {
        insurance: [370.0, -538.5, 213.6, 143.9, 213.8, 237.8, 178.9],
        finance: [94.0, 24.5, 120.1, 54.7, 45.6, 98.6, 114.4],
        transfer: [-32.1, -35.9, -35.8, -35.9, -45.4, -44.3, -43.8]
    },
    maccabi: {
        insurance: [161, 60, -21, -149, 109, 206, 86],
        finance: [505, -39, 302, 244, 28, 527, 371],
        transfer: [-9, -9, -9, -9, -10, -10, -10]
    },
    meuhedet: {
        insurance: [5.0, 16.1, 17.5, 29.9, 23.8, 56.0, 27.3],
        finance: [31.0, 1.9, 31.2, 24.7, -0.3, 63.9, 46.0],
        transfer: [-16.8, -17.1, -17.6, -18.1, -5.9, -6.0, -6.2]
    },
    leumit: {
        insurance: [-5.0, 1.8, 1.2, 2.1, 13.5, 27.9, 13.1],
        finance: [28.0, 1.2, 27.8, 20.9, -0.5, 49.1, 36.1],
        transfer: [-10.0, -0.9, -1.3, -2.0, -1.5, -1.6, -1.6]
    }
};

// יתרות קרנות מורחבות (Q1 2024 - Q3 2025) לתצוגת drill-down
const fundDataExtended = {
    clalit: [601, 87, 421, 619, 879, 1215, 1508],
    maccabi: [1055, 6428, 6709, 6807, 6944, 7677, 8134],
    meuhedet: [315, 333, 382, 436, 460, 580, 653],
    leumit: [306, 310, 339, 362, 375, 452, 501]
};

// פירוק מכבי לפי מבטח (הפניקס / מנורה)
// הערה: העברות בין-חברתיות הפניקס→מנורה נוטרלו לחלוטין:
// GAP מנורה (מיליונים): [0, 5352.6, 174.3, 3.0, 386.2, 0, 0] - הוחסרו מפקטור ביטוח מנורה
// העברות הפניקס (מיליונים): [5358, 0, 174, 0, 386, 0, 0] - הוחסרו מפקטור ביטוח ומ-transfer של הפניקס
const maccabiBreakdown = {
    phoenix: {
        fund: [878, 823, 721, 672, 278, 333, 340],
        insurance: [-16, -21, -8, -122, -21, -18, -35],
        finance: [505, -34, 80, 73, 13, 73, 42],
        transfer: [0, 0, 0, 0, 0, 0, 0]
    },
    menora: {
        fund: [177, 5605, 5988, 6135, 6666, 7344, 7794],
        insurance: [177, 81, -13, -27, 130, 224, 121],
        finance: [0.1, -5.5, 222, 171, 15, 454, 329],
        transfer: [-8.9, -9.2, -9.2, -9.1, -10.1, -9.6, -9.6]
    }
};

// בסיס לחישוב צמיחה מצטברת - יתרות לפני המעבר הפניקס→מנורה
const growthBase = {
    all: 6466,       // סך כל הקרנות סוף Q4 2023
    combined: 5728,  // יתרת קרן מכבי משולבת סוף Q4 2023
    phoenix: 5667,   // יתרת הפניקס סוף Q4 2023
    menora: 5488     // בסיס לחישוב צמיחת מנורה
};

// מצב Toggle להעברה למבטח
let showTransferSeparately = false;

const fundData = {
    clalit: [421, 619, 879, 1215, 1508],
    maccabi: [6534, 6804, 6944, 7677, 8134],
    meuhedet: [382, 436, 460, 580, 653],
    leumit: [339, 362, 375, 452, 501]
};

const demographicsData = {
    total: { clalit: 2723986, maccabi: 1667328, meuhedet: 468407, leumit: 314250 },
ageGroups: {
    '0-19': { clalit: 1194136, maccabi: 671249, meuhedet: 215958, leumit: 159023 },
    '20-29': { clalit: 347627, maccabi: 215947, meuhedet: 67451, leumit: 34985 },
    '30-39': { clalit: 272744, maccabi: 150297, meuhedet: 39993, leumit: 27561 },
    '40-49': { clalit: 304957, maccabi: 146486, meuhedet: 32446, leumit: 24939 },
    '50-59': { clalit: 190875, maccabi: 197222, meuhedet: 39132, leumit: 21995 },
    '60-69': { clalit: 166860, maccabi: 143095, meuhedet: 32693, leumit: 21034 },
    '70-79': { clalit: 175674, maccabi: 104726, meuhedet: 28370, leumit: 17828 },
    '80-89': { clalit: 62586, maccabi: 33772, meuhedet: 10475, leumit: 5855 },
    '90+': { clalit: 8527, maccabi: 4534, meuhedet: 1889, leumit: 1030 }
},
newMembers: {
    'Q3 2024': { clalit: 38729, maccabi: 21979, meuhedet: 8101, leumit: 6008 },
    'Q4 2024': { clalit: 36449, maccabi: 17860, meuhedet: 8256, leumit: 6260 },
    'Q1 2025': { clalit: 35126, maccabi: 22156, meuhedet: 7286, leumit: 8461 },
    'Q2 2025': { clalit: 30485, maccabi: 13737, meuhedet: 3235, leumit: 6731 },
    'Q3 2025': { clalit: 38051, maccabi: 20306, meuhedet: 7347, leumit: 9676 }
},
    gender: { male: 42, female: 58 }
};

const ageGroupQuarterlyData = {
    '0-19': {
        clalit: [1137519, 1160134, 1138142, 1157849, 1179165],
        maccabi: [644781, 656754, 642220, 651030, 661818],
        meuhedet: [216902, 219568, 208345, 206295, 205878],
        leumit: [140243, 144407, 144334, 148747, 153970]
    },
    '20-29': {
        clalit: [323154, 324544, 340447, 340517, 339510],
        maccabi: [200957, 201053, 213735, 213114, 212926],
        meuhedet: [60555, 60382, 66117, 65579, 65256],
        leumit: [33762, 33508, 34247, 33834, 33323]
    },
    '30-39': {
        clalit: [276827, 277584, 268012, 268159, 267659],
        maccabi: [148429, 148383, 148394, 147778, 147554],
        meuhedet: [38686, 68657, 39115, 38793, 38648],
        leumit: [27381, 27214, 27050, 26756, 26417]
    },
    '40-49': {
        clalit: [298044, 297789, 302655, 302205, 301032],
        maccabi: [150189, 150112, 145289, 144644, 144562],
        meuhedet: [32026, 32042, 32012, 31779, 31729],
        leumit: [24659, 24503, 24701, 24434, 24184]
    },
    '50-59': {
        clalit: [181061, 180673, 189810, 189462, 188640],
        maccabi: [194342, 194114, 196455, 195708, 195425],
        meuhedet: [39040, 39057, 38891, 38697, 38561],
        leumit: [22053, 21922, 21891, 21710, 21549]
    },
    '60-69': {
        clalit: [171575, 170941, 166467, 165944, 165081],
        maccabi: [138169, 137930, 142693, 142075, 141772],
        meuhedet: [32451, 32350, 32588, 32407, 32283],
        leumit: [21099, 20987, 20977, 20835, 20697]
    },
    '70-79': {
        clalit: [170622, 169625, 174935, 173952, 172721],
        maccabi: [99167, 98824, 104473, 103877, 103470],
        meuhedet: [27258, 27102, 28319, 28124, 27971],
        leumit: [17123, 16986, 17796, 17645, 17512]
    },
    '80-89': {
        clalit: [55952, 54921, 62080, 60974, 59849],
        maccabi: [29465, 29100, 33703, 33308, 33054],
        meuhedet: [9421, 9297, 10464, 10300, 10159],
        leumit: [5186, 5091, 5848, 5726, 5619]
    },
    '90+': {
        clalit: [7053, 6658, 8496, 7975, 7509],
        maccabi: [3467, 3346, 4528, 4386, 4278],
        meuhedet: [1553, 1504, 1887, 1818, 1741],
        leumit: [894, 857, 1030, 963, 904]
    }
};
const claimsData = {
    approvalRate: {
        clalit: [72, 70, 68, 67, 68],
        maccabi: [74, 73, 71, 70, 71],
        meuhedet: [68, 67, 65, 64, 65],
        leumit: [71, 70, 69, 68, 69]
    },
    adlDistribution: {
        before: { '2.0-2.5': 5, '2.5-3.0': 8, '3.0-3.5': 12, '3.5-4.0': 18, '4.0-4.5': 25, '4.5-5.0': 20, '5.0-5.5': 8, '5.5-6.0': 4 },
        after: { '2.0-2.5': 8, '2.5-3.0': 12, '3.0-3.5': 18, '3.5-4.0': 22, '4.0-4.5': 20, '4.5-5.0': 12, '5.0-5.5': 5, '5.5-6.0': 3 }
    },
    avgADL: {
        clalit: [4.8, 4.7, 4.5, 4.3, 4.2],
        maccabi: [4.9, 4.8, 4.6, 4.4, 4.3],
        meuhedet: [4.7, 4.6, 4.4, 4.2, 4.1],
        leumit: [4.8, 4.7, 4.5, 4.3, 4.2]
    }
};

// cancellationYearlyData is computed after cancellationAgeWeights are ready (see below)

// Claims approval rate data
const approvalData = {
    years: ['2022', '2023', '2024', '2025'],
    market: [76, 70, 62, 64],
    harel: [77, 68, 61, 60],
    menora: [73, 75, 65, 69]
};

// Per-HMO demographic weights for cancellation age groups
// Each HMO uses its own population size per age group
const cancellationHmoWeights = { clalit: {}, maccabi: {}, meuhedet: {}, leumit: {} };
for (const hmo of ['clalit', 'maccabi', 'meuhedet', 'leumit']) {
    // Split 0-19 into 0-10 and 10-20 (equal split per HMO)
    const pop0to19 = demographicsData.ageGroups['0-19'][hmo];
    cancellationHmoWeights[hmo]['0-10'] = Math.round(pop0to19 / 2);
    cancellationHmoWeights[hmo]['10-20'] = pop0to19 - cancellationHmoWeights[hmo]['0-10'];
}
for (const [group, hmos] of Object.entries(demographicsData.ageGroups)) {
    if (group === '0-19') continue;
    for (const hmo of ['clalit', 'maccabi', 'meuhedet', 'leumit']) {
        cancellationHmoWeights[hmo][group] = hmos[hmo];
    }
}

const cancellationByAgeData = {
    '0-10': {
        clalit: [2.527, 2.409, 2.084, 2.530, 2.496],
        maccabi: [2.566, 2.774, 2.816, 2.871, 3.248],
        meuhedet: [4.563, 5.152, 3.857, 8.003, 8.951],
        leumit: [9.809, 8.241, 6.829, 7.598, 7.167]
    },
    '10-20': {
        clalit: [2.017, 1.838, 1.711, 2.443, 2.232],
        maccabi: [1.115, 1.115, 1.066, 1.176, 1.419],
        meuhedet: [7.550, 8.175, 7.231, 8.711, 9.348],
        leumit: [6.119, 5.425, 4.555, 5.373, 5.140]
    },
    '20-29': {
        clalit: [3.912, 3.973, 3.969, 4.834, 4.666],
        maccabi: [2.034, 2.229, 2.073, 2.033, 2.441],
        meuhedet: [6.749, 5.752, 4.934, 6.340, 6.050],
        leumit: [9.564, 9.143, 7.808, 7.843, 8.461]
    },
    '30-39': {
        clalit: [2.820, 2.747, 2.727, 3.476, 3.739],
        maccabi: [2.450, 2.642, 2.602, 2.700, 3.112],
        meuhedet: [6.185, 5.187, 4.221, 5.912, 6.004],
        leumit: [8.026, 7.452, 6.533, 6.760, 7.299]
    },
    '40-49': {
        clalit: [1.999, 1.881, 1.954, 2.441, 2.522],
        maccabi: [1.233, 1.410, 1.383, 1.677, 2.005],
        meuhedet: [3.616, 3.203, 2.718, 3.552, 3.727],
        leumit: [5.386, 5.468, 4.425, 4.582, 5.083]
    },
    '50-59': {
        clalit: [1.290, 1.380, 1.615, 2.172, 2.149],
        maccabi: [0.740, 0.750, 0.705, 0.999, 1.291],
        meuhedet: [2.689, 2.129, 1.709, 2.336, 2.422],
        leumit: [3.705, 3.250, 3.035, 3.131, 3.506]
    },
    '60-69': {
        clalit: [0.718, 0.733, 0.906, 1.428, 1.353],
        maccabi: [0.490, 0.584, 0.568, 0.861, 1.182],
        meuhedet: [2.212, 1.439, 1.262, 1.656, 1.795],
        leumit: [2.335, 2.160, 2.007, 2.045, 2.280]
    },
    '70-79': {
        clalit: [0.407, 0.395, 0.511, 0.852, 0.887],
        maccabi: [0.400, 0.483, 0.434, 0.620, 0.959],
        meuhedet: [1.968, 1.120, 1.162, 1.242, 1.068],
        leumit: [1.825, 1.500, 1.395, 1.324, 1.640]
    },
    '80-89': {
        clalit: [0.283, 0.217, 0.336, 0.440, 0.489],
        maccabi: [0.535, 0.486, 0.340, 0.524, 0.656],
        meuhedet: [2.191, 0.936, 0.709, 0.847, 0.919],
        leumit: [1.279, 1.405, 1.021, 0.926, 0.816]
    },
    '90+': {
        clalit: [0.428, 0.350, 0.322, 0.530, 0.454],
        maccabi: [1.016, 0.678, 0.421, 0.399, 0.672],
        meuhedet: [2.727, 0.919, 1.535, 0.811, 0.370],
        leumit: [0.828, 1.363, 0.695, 0.109, 1.392]
    }
};

// Cancellation yearly data - exact totals from source data per HMO
const cancellationYearlyData = {
    clalit: [2.124, 2.074, 2.038, 2.635, 2.609],
    maccabi: [1.525, 1.679, 1.625, 1.772, 2.110],
    meuhedet: [5.664, 5.530, 4.679, 6.061, 6.307],
    leumit: [6.665, 6.085, 5.212, 5.721, 5.808]
};

// ===== FREQUENCY DATA =====
const frequencyYears = ['2020', '2021', '2022', '2023', '2024', '2025'];

const frequencyByScenario = {
    permissive: { label: 'תרחיש קיצון מתירני', data: [0.366, 0.381, 0.463, 0.494, 0.426, 0.321] },
    be: { label: 'תרחיש BE', data: [0.366, 0.382, 0.467, 0.503, 0.440, 0.340] },
    conservativePrime: { label: 'תרחיש קיצון שמרני', data: [0.366, 0.383, 0.471, 0.514, 0.458, 0.364] },
    conservative: { label: 'תרחיש קיצון שמרני ללא תוספת', data: [0.366, 0.383, 0.471, 0.514, 0.458, 0.251] }
};

const frequencyByHmo = {
    clalit: { label: 'שכיחות כללית', data: [0.447, 0.461, 0.574, 0.635, 0.501, 0.393], color: '#103A97' },
    maccabi: { label: 'שכיחות מכבי', data: [0.294, 0.308, 0.354, 0.367, 0.434, 0.370], color: '#FDC509' },
    leumit: { label: 'שכיחות לאומית', data: [0.350, 0.391, 0.513, 0.551, 0.532, 0.431], color: '#36CEC4' },
    meuhedet: { label: 'שכיחות מאוחדת', data: [0.208, 0.240, 0.334, 0.423, 0.426, 0.359], color: '#5C83E3' },
    total: { label: 'שכיחות כל השוק', data: [0.366, 0.383, 0.471, 0.514, 0.458, 0.364], color: '#9CA3AF' }
};

// Frequency by age group (conservative extreme scenario) - total market
const frequencyByAge = {
    '0-19': [0.014, 0.019, 0.030, 0.073, 0.022, 0.009],
    '20-29': [0.009, 0.009, 0.009, 0.009, 0.008, 0.004],
    '30-39': [0.016, 0.018, 0.015, 0.020, 0.016, 0.012],
    '40-49': [0.047, 0.042, 0.053, 0.042, 0.038, 0.031],
    '50-59': [0.124, 0.115, 0.130, 0.127, 0.118, 0.087],
    '60-69': [0.498, 0.517, 0.604, 0.631, 0.562, 0.419],
    '70-79': [1.830, 1.898, 2.488, 2.614, 2.416, 1.734],
    '80-89': [6.780, 7.218, 8.948, 9.486, 8.995, 6.986],
    '90+': [14.899, 15.311, 16.955, 18.098, 19.813, 18.478]
};

// Weights for frequency age groups (total insured per age group from demographics)
const frequencyAgeWeights = {};
for (const [group, hmos] of Object.entries(demographicsData.ageGroups)) {
    frequencyAgeWeights[group] = Object.values(hmos).reduce((a, b) => a + b, 0);
}

const frequencyByAdl = {
    adl3: { label: 'ADL 3 ישן', data: [0.111, 0.113, 0.144, 0.162, 0.126, 0.004], color: '#F87171' },
    adl3New: { label: 'ADL 3 כולל סוגרים', data: [0.016, 0.018, 0.026, 0.039, 0.045, 0.043], color: '#60A5FA' },
    adl4: { label: 'ADL 4', data: [0.145, 0.155, 0.189, 0.195, 0.178, 0.208], color: '#10B981' },
    adl5: { label: 'תשישות נפש', data: [0.094, 0.098, 0.114, 0.124, 0.118, 0.112], color: '#A78BFA' },
    all: { label: 'ALL', data: [0.366, 0.383, 0.471, 0.514, 0.458, 0.364], color: '#94A3B8' }
};

const profitData = {
    insurance: {
        harel: [6.2, 7.1, 7.5, 6.8, 7.4],
        menora: [5.1, 5.8, 6.2, 5.5, 6.0]
    },
    hmo: {
        clalit: [7.5, 7.8, 8.0, 8.2, 8.5],
        maccabi: [8.2, 8.4, 8.6, 8.8, 9.0],
        meuhedet: [7.0, 7.2, 7.5, 7.7, 7.8],
        leumit: [7.8, 8.0, 8.2, 8.4, 8.6]
    }
};

// ===== CHART INSTANCES =====
let ageDistBarChart = null;
let fundBalanceChart;
let ageGroupTrendChart = null;
let ageGroupByHmoChart = null;
let ageGroupGrowthChart = null;
let fundGrowthChart = null;
let demographicsOverviewChart;
let claimsOverviewChart;
let profitOverviewChart;

// Panel charts
let newMembersChart, cancellationChart;
let scenariosChart = null, hmoFrequencyChart = null, adlFrequencyChart = null, ageFrequencyChart = null;

let insuranceProfitTrendChart, insuranceComparisonChart, premiumVsClaimsChart;
let hmoProfitTrendChart, hmoComparisonChart, managementFeesChart;

// Cancellation drill-down charts
let cancellationAgeTrendChart = null;
let cancellationAgeByHmoChart = null;
let cancellationAgeGrowthChart = null;

// Approval drill-down chart
let approvalTrendChart = null;

// ===== ANIMATION OPTIONS =====
const barAnimation = {
    duration: 800,
    easing: 'easeOutQuart'
};

const lineAnimation = {
    duration: 1000,
    easing: 'easeOutQuart'
};

const doughnutAnimation = {
    animateRotate: true,
    animateScale: true,
    duration: 1000,
    easing: 'easeOutQuart'
};

// ===== CLAIMS AGE DISTRIBUTION DATA =====
const claimsAgeDistData = {
    '2022': {
        labels: ['0-10', '10-20', '20-30', '30-40', '40-50', '50-60', '60-70', '70-80', '80-90', '90+'],
        claims: [584, 109, 47, 75, 247, 521, 2106, 6725, 8924, 2748],
        pct: [2.64, 0.49, 0.21, 0.34, 1.12, 2.36, 9.54, 30.45, 40.41, 12.44],
        cumPct: [2.64, 3.13, 3.34, 3.68, 4.80, 7.16, 16.70, 47.15, 87.56, 100.00],
        total: 22086, avgAge: 76.95, medianAge: 80
    },
    '2023': {
        labels: ['0-10', '10-20', '20-30', '30-40', '40-50', '50-60', '60-70', '70-80', '80-90', '90+'],
        claims: [1543, 196, 54, 92, 196, 503, 2051, 7157, 9163, 2906],
        pct: [6.47, 0.82, 0.23, 0.39, 0.82, 2.11, 8.60, 29.99, 38.40, 12.18],
        cumPct: [6.47, 7.29, 7.52, 7.91, 8.73, 10.84, 19.44, 49.43, 87.83, 100.00],
        total: 23861, avgAge: 74.09, medianAge: 80
    },
    '2024': {
        labels: ['0-10', '10-20', '20-30', '30-40', '40-50', '50-60', '60-70', '70-80', '80-90', '90+'],
        claims: [345, 107, 44, 72, 169, 436, 1714, 6385, 8037, 2655],
        pct: [1.73, 0.54, 0.22, 0.36, 0.85, 2.18, 8.59, 31.98, 40.26, 13.30],
        cumPct: [1.73, 2.27, 2.49, 2.85, 3.70, 5.88, 14.47, 46.45, 86.71, 100.00],
        total: 19964, avgAge: 78.01, medianAge: 80
    },
    '2025': {
        labels: ['0-10', '10-20', '20-30', '30-40', '40-50', '50-60', '60-70', '70-80', '80-90', '90+'],
        claims: [50, 20, 9, 20, 55, 135, 531, 1961, 2726, 1032],
        pct: [0.76, 0.31, 0.14, 0.31, 0.84, 2.06, 8.12, 29.99, 41.69, 15.78],
        cumPct: [0.76, 1.07, 1.21, 1.52, 2.36, 4.42, 12.54, 42.53, 84.22, 100.00],
        total: 6539, avgAge: 79.57, medianAge: 81
    }
};
let ageDistChart = null;
let currentAgeDistYear = '2022';
const hiddenClaimsAgeGroups = new Set();

function updateClaimsDistHiddenBar() {
    const bar = document.getElementById('claimsDistHiddenBar');
    if (!bar) return;
    if (hiddenClaimsAgeGroups.size === 0) {
        bar.style.display = 'none';
        return;
    }
    bar.style.display = 'flex';
    bar.innerHTML = '<span style="font-weight: 600; color: #475569;">מוסתרות:</span>';
    hiddenClaimsAgeGroups.forEach(age => {
        const chip = document.createElement('span');
        chip.style.cssText = 'background: rgba(16, 58, 151, 0.7); color: white; padding: 3px 10px; border-radius: 12px; cursor: pointer; font-size: 11px; font-weight: 500; transition: opacity 0.2s;';
        chip.textContent = age + ' ✕';
        chip.title = 'לחץ להציג חזרה';
        chip.addEventListener('mouseenter', () => chip.style.opacity = '0.7');
        chip.addEventListener('mouseleave', () => chip.style.opacity = '1');
        chip.addEventListener('click', () => {
            hiddenClaimsAgeGroups.delete(age);
            initAgeDistChart();
        });
        bar.appendChild(chip);
    });
    const resetBtn = document.createElement('span');
    resetBtn.style.cssText = 'background: #e2e8f0; color: #475569; padding: 3px 10px; border-radius: 12px; cursor: pointer; font-size: 11px; font-weight: 600; transition: opacity 0.2s;';
    resetBtn.textContent = 'הצג הכל';
    resetBtn.addEventListener('mouseenter', () => resetBtn.style.opacity = '0.7');
    resetBtn.addEventListener('mouseleave', () => resetBtn.style.opacity = '1');
    resetBtn.addEventListener('click', () => {
        hiddenClaimsAgeGroups.clear();
        initAgeDistChart();
    });
    bar.appendChild(resetBtn);
}

// ===== TREEMAP =====
const treemapColors = {
    '0-19': '#60A5FA',
    '20-29': '#34D399',
    '30-39': '#A78BFA',
    '40-49': '#FBBF24',
    '50-59': '#F87171',
    '60-69': '#2DD4BF',
    '70-79': '#103A97',
    '80-89': '#F472B6',
    '90+': '#FB923C'
};

// Track hidden age groups across filter switches
const hiddenAgeGroups = new Set();
let currentTreemapFilter = 'all';

function updateHiddenBar() {
    const bar = document.getElementById('treemapHiddenBar');
    if (!bar) return;
    if (hiddenAgeGroups.size === 0) {
        bar.style.display = 'none';
        return;
    }
    bar.style.display = 'flex';
    bar.innerHTML = '<span style="font-weight: 600; color: #475569;">מוסתרות:</span>';
    hiddenAgeGroups.forEach(age => {
        const chip = document.createElement('span');
        chip.style.cssText = 'background:' + treemapColors[age] + '; color: white; padding: 3px 10px; border-radius: 12px; cursor: pointer; font-size: 11px; font-weight: 500; transition: opacity 0.2s;';
        chip.textContent = age + ' ✕';
        chip.title = 'לחץ להציג חזרה';
        chip.addEventListener('mouseenter', () => chip.style.opacity = '0.7');
        chip.addEventListener('mouseleave', () => chip.style.opacity = '1');
        chip.addEventListener('click', () => {
            hiddenAgeGroups.delete(age);
            refreshAgeChart();
        });
        bar.appendChild(chip);
    });
    // Add "show all" button
    const resetBtn = document.createElement('span');
    resetBtn.style.cssText = 'background: #e2e8f0; color: #475569; padding: 3px 10px; border-radius: 12px; cursor: pointer; font-size: 11px; font-weight: 600; transition: opacity 0.2s;';
    resetBtn.textContent = 'הצג הכל';
    resetBtn.addEventListener('mouseenter', () => resetBtn.style.opacity = '0.7');
    resetBtn.addEventListener('mouseleave', () => resetBtn.style.opacity = '1');
    resetBtn.addEventListener('click', () => {
        hiddenAgeGroups.clear();
        refreshAgeChart();
    });
    bar.appendChild(resetBtn);
}

function refreshAgeChart() {
    if (currentChartType === 'treemap') {
        initTreemap(currentTreemapFilter);
    } else {
        initAgeDistBar(currentTreemapFilter);
    }
}

function initTreemap(filter = 'all') {
    currentTreemapFilter = filter;
    const container = document.getElementById('ageTreemap');
    if (!container) return;

    document.querySelectorAll('.treemap-tooltip').forEach(t => t.remove());
    container.innerHTML = '';

    const width = container.clientWidth;
    const height = container.clientHeight || 320;

    let data = [];
    const ageGroups = Object.keys(demographicsData.ageGroups);

    ageGroups.forEach(age => {
        if (hiddenAgeGroups.has(age)) return;
        let value;
        if (filter === 'all') {
            value = demographicsData.ageGroups[age].clalit +
                    demographicsData.ageGroups[age].maccabi +
                    demographicsData.ageGroups[age].meuhedet +
                    demographicsData.ageGroups[age].leumit;
        } else {
            value = demographicsData.ageGroups[age][filter];
        }
        data.push({ name: age, value: value });
    });

    const total = data.reduce((sum, d) => sum + d.value, 0);
    data = data.map(d => ({ ...d, percentage: ((d.value / total) * 100).toFixed(1) }));

    const root = d3.hierarchy({ children: data }).sum(d => d.value).sort((a, b) => b.value - a.value);
    d3.treemap().size([width, height]).padding(3).round(true)(root);

    const svg = d3.select(container).append('svg').attr('width', width).attr('height', height);

    const tooltip = d3.select('body').append('div').attr('class', 'treemap-tooltip').style('opacity', 0).style('display', 'none');

    const cells = svg.selectAll('g').data(root.leaves()).join('g').attr('transform', d => `translate(${d.x0},${d.y0})`);

    cells.append('rect')
        .attr('class', 'treemap-cell')
        .attr('width', d => d.x1 - d.x0)
        .attr('height', d => d.y1 - d.y0)
        .attr('fill', d => treemapColors[d.data.name])
        .attr('rx', 6)
        .on('mouseover', function(event, d) {
            tooltip.style('display', 'block').style('opacity', 1)
                .html(`<div class="treemap-tooltip-title">גילאי ${d.data.name}</div>
                    <div class="treemap-tooltip-row"><span class="treemap-tooltip-label">מבוטחים:</span><span class="treemap-tooltip-value">${d.data.value.toLocaleString()}</span></div>
                    <div class="treemap-tooltip-row"><span class="treemap-tooltip-label">אחוז מסה"כ:</span><span class="treemap-tooltip-value">${d.data.percentage}%</span></div>
                    <div style="margin-top:6px;font-size:10px;color:rgba(255,255,255,0.5);text-align:center;">לחץ להסתרה</div>`);
        })
        .on('mousemove', function(event) {
            tooltip.style('left', (event.pageX + 15) + 'px').style('top', (event.pageY - 10) + 'px');
        })
        .on('mouseout', function() {
            tooltip.style('opacity', 0).style('display', 'none');
        })
        .on('click', function(event, d) {
            hiddenAgeGroups.add(d.data.name);
            initTreemap(currentTreemapFilter);
        });

    cells.append('text').attr('class', 'treemap-label')
        .attr('x', d => (d.x1 - d.x0) / 2).attr('y', d => (d.y1 - d.y0) / 2 - 8)
        .attr('font-size', d => { const w = d.x1-d.x0, h = d.y1-d.y0; if (w<50||h<40) return '0px'; if (w<80) return '12px'; return '16px'; })
        .text(d => d.data.name);

    cells.append('text').attr('class', 'treemap-value')
        .attr('x', d => (d.x1 - d.x0) / 2).attr('y', d => (d.y1 - d.y0) / 2 + 12)
        .attr('font-size', d => { const w = d.x1-d.x0, h = d.y1-d.y0; if (w<60||h<50) return '0px'; if (w<90) return '10px'; return '12px'; })
        .text(d => `${(d.data.value/1000).toFixed(0)}K (${d.data.percentage}%)`);

    updateHiddenBar();
}

// ===== AGE DISTRIBUTION BAR CHART =====
let currentChartType = 'treemap'; // 'treemap' or 'bar'

function initAgeDistBar(filter = 'all') {
    currentTreemapFilter = filter;
    const ctx = document.getElementById('ageDistBarChart');
    if (!ctx) return;
    if (ageDistBarChart) ageDistBarChart.destroy();

    const ageGroups = Object.keys(demographicsData.ageGroups).filter(g => !hiddenAgeGroups.has(g));
    const ageColors = ageGroups.map(g => treemapColors[g]);
    const hmoNames = { all: 'כל הקופות', clalit: 'כללית', maccabi: 'מכבי', meuhedet: 'מאוחדת', leumit: 'לאומית' };

    const data = ageGroups.map(g => {
        if (filter === 'all') {
            return demographicsData.ageGroups[g].clalit + demographicsData.ageGroups[g].maccabi + demographicsData.ageGroups[g].meuhedet + demographicsData.ageGroups[g].leumit;
        }
        return demographicsData.ageGroups[g][filter];
    });
    const total = data.reduce((a, b) => a + b, 0);

    ageDistBarChart = new Chart(ctx.getContext('2d'), {
        type: 'bar',
        data: {
            labels: ageGroups,
            datasets: [{
                label: hmoNames[filter],
                data,
                backgroundColor: ageColors,
                borderRadius: 4,
                barPercentage: 0.7,
                categoryPercentage: 0.75
            }]
        },
        options: {
            responsive: true, maintainAspectRatio: false,
            animation: false,
            onClick: (evt, elements) => {
                if (elements.length > 0) {
                    const ageName = ageGroups[elements[0].index];
                    hiddenAgeGroups.add(ageName);
                    initAgeDistBar(currentTreemapFilter);
                }
            },
            plugins: {
                legend: { display: false },
                tooltip: {
                    callbacks: {
                        label: (c) => {
                            const pct = ((c.raw / total) * 100).toFixed(1);
                            return `${(c.raw / 1000).toFixed(0)}K (${pct}%)\n(לחץ להסתרה)`;
                        }
                    }
                }
            },
            scales: {
                x: { grid: { display: false } },
                y: { grid: { color: '#F1F5F9' }, ticks: { callback: v => (v / 1000).toFixed(0) + 'K' } }
            }
        }
    });
    updateHiddenBar();
}

function switchChartType(type) {
    currentChartType = type;
    document.querySelectorAll('.chart-type-btn').forEach(b => b.classList.remove('active'));
    document.querySelector(`.chart-type-btn[data-type="${type}"]`)?.classList.add('active');

    const treemapEl = document.getElementById('ageTreemap');
    const barEl = document.getElementById('ageBarContainer');
    if (type === 'treemap') {
        treemapEl.style.display = '';
        barEl.style.display = 'none';
        initTreemap(currentTreemapFilter);
    } else {
        treemapEl.style.display = 'none';
        barEl.style.display = '';
        initAgeDistBar(currentTreemapFilter);
    }
}

// Click on treemap card header to drill down
const treemapCard = document.querySelector('#ageTreemap')?.closest('.panel-card');
if (treemapCard) {
    const drillIndicator = treemapCard.querySelector('.drill-indicator');
    if (drillIndicator) {
        drillIndicator.style.cursor = 'pointer';
        drillIndicator.addEventListener('click', (e) => {
            // Open with all age groups selected
            openPanel('ageGroupPanel', e.currentTarget);
            const allAgeGroups = [];
            document.querySelectorAll('.age-nav-btn').forEach(btn => {
                btn.classList.add('active');
                allAgeGroups.push(btn.dataset.age);
            });
            setTimeout(() => updateAgeGroupCharts(allAgeGroups), 450);
        });
    }
}

// ===== INITIALIZE MAIN CHARTS =====
function initMainCharts() {
    // 1. Fund Balance Chart - Stacked Bar
    const fundCtx = document.getElementById('fundBalanceChart').getContext('2d');
    fundBalanceChart = new Chart(fundCtx, {
        type: 'bar',
        data: {
            labels: quarters,
            datasets: [
                { label: 'מכבי', data: fundData.maccabi, backgroundColor: colors.maccabi, borderColor: 'white', borderWidth: { top: 3, bottom: 0, left: 0, right: 0 }, barPercentage: 0.6, categoryPercentage: 0.65, stack: 'fund' },
                { label: 'כללית', data: fundData.clalit, backgroundColor: colors.clalit, borderColor: 'white', borderWidth: { top: 3, bottom: 0, left: 0, right: 0 }, barPercentage: 0.6, categoryPercentage: 0.65, stack: 'fund' },
                { label: 'מאוחדת', data: fundData.meuhedet, backgroundColor: colors.meuhedet, borderColor: 'white', borderWidth: { top: 3, bottom: 0, left: 0, right: 0 }, barPercentage: 0.6, categoryPercentage: 0.65, stack: 'fund' },
                { label: 'לאומית', data: fundData.leumit, backgroundColor: colors.leumit, borderRadius: { topLeft: 5, topRight: 5 }, barPercentage: 0.6, categoryPercentage: 0.65, stack: 'fund' }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            animation: barAnimation,
            interaction: { mode: 'index', intersect: false },
            onClick: (evt, elements, chart) => {
                if (elements.length > 0) {
                    const dsIndex = elements[0].datasetIndex;
                    const meta = chart.getDatasetMeta(dsIndex);
                    meta.hidden = meta.hidden === null ? true : !meta.hidden;
                    chart.update();
                }
            },
            plugins: {
                legend: { position: 'bottom', labels: { usePointStyle: true } },
                tooltip: {
                    callbacks: {
                        label: (ctx) => `${ctx.dataset.label}: ₪${ctx.raw.toLocaleString()}M`,
                        footer: (items) => {
                            const total = items.reduce((sum, item) => sum + item.raw, 0);
                            return `סה"כ: ₪${total.toLocaleString()}M`;
                        }
                    }
                }
            },
            scales: {
                x: { grid: { display: false }, stacked: true },
                y: { stacked: true, grid: { color: '#F1F5F9' }, ticks: { maxTicksLimit: 7, callback: (v) => `₪${(v/1000).toFixed(1)}B` } }
            }
        }
    });

// 2. Demographics Overview
const demoCtx = document.getElementById('demographicsOverview').getContext('2d');
demographicsOverviewChart = new Chart(demoCtx, {
    type: 'doughnut',
    data: {
        labels: ['כללית', 'מכבי', 'מאוחדת', 'לאומית'],
        datasets: [{
            data: [2723986, 1667328, 468407, 314250],
            backgroundColor: [colors.clalit, colors.maccabi, colors.meuhedet, colors.leumit],
            borderWidth: 0,
            spacing: 2
        }]
    },
options: {
    responsive: true,
    maintainAspectRatio: false,
    animation: doughnutAnimation,
    cutout: '50%',
    plugins: {
        legend: { position: 'right' },
        legendHint: false,
        tooltip: {
            callbacks: {
                label: (ctx) => {
                    const total = ctx.dataset.data.reduce((a, b) => a + b, 0);
                    const percentage = ((ctx.raw / total) * 100).toFixed(1);
                    return `${ctx.label}: ${ctx.raw.toLocaleString()} (${percentage}%)`;
                }
            }
        },
        datalabels: {
            display: true,
            color: 'white',
            font: {
                weight: 'bold',
                size: 12
            },
            textAlign: 'center',
formatter: (value, ctx) => {
    const total = ctx.dataset.data.reduce((a, b) => a + b, 0);
    const percentage = Math.round((value / total) * 100);
    return percentage + '%';
}
        }
    }
},
plugins: [ChartDataLabels]
});

// 3. Claims Frequency & Count Overview
const claimsCtx = document.getElementById('claimsOverview').getContext('2d');
claimsOverviewChart = new Chart(claimsCtx, {
    type: 'bar',
    data: {
        labels: ['2022', '2023', '2024', '2025'],
        datasets: [
            {
                label: 'כמות תביעות',
                data: [22820, 25749, 23488, 18660],
                backgroundColor: colors.clalit,
                borderRadius: 6,
                barPercentage: 0.5,
                categoryPercentage: 0.6,
                yAxisID: 'y',
                order: 2
            },
            {
                label: 'שכיחות תביעות',
                data: [0.47, 0.52, 0.46, 0.36],
                type: 'line',
                borderColor: colors.color5,
                backgroundColor: colors.color5,
                fill: false,
                tension: 0.4,
                borderWidth: 3,
                pointRadius: 6,
                pointBackgroundColor: colors.color5,
                pointBorderColor: 'white',
                pointBorderWidth: 2,
                yAxisID: 'y1',
                order: 1
            }
        ]
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: barAnimation,
        interaction: {
            mode: 'index',
            intersect: false
        },
        plugins: {
            legend: {
                position: 'bottom',
                labels: { usePointStyle: true },
                onClick: (e, legendItem, legend) => {
                    const index = legendItem.datasetIndex;
                    const ci = legend.chart;
                    const meta = ci.getDatasetMeta(index);
                    meta.hidden = meta.hidden === null ? !ci.data.datasets[index].hidden : null;
                    ci.update();
                    e.native.stopPropagation();
                }
            },
            legendHint: false,
            tooltip: {
                callbacks: {
                    label: (ctx) => {
                        if (ctx.dataset.yAxisID === 'y1') {
                            return `${ctx.dataset.label}: ${ctx.raw}%`;
                        }
                        return `${ctx.dataset.label}: ${ctx.raw.toLocaleString()}`;
                    }
                }
            }
        },
        scales: {
            x: { grid: { display: false } },
            y: {
                type: 'linear',
                display: true,
                position: 'left',
                title: {
                    display: true,
                    text: 'כמות תביעות',
                    font: { size: 11 }
                },
                grid: { color: '#F1F5F9' },
                ticks: {
                    maxTicksLimit: 5,
                    callback: (v) => (v/1000).toFixed(0) + 'K'
                }
            },
            y1: {
                type: 'linear',
                display: true,
                position: 'right',
                title: {
                    display: true,
                    text: 'שכיחות (%)',
                    font: { size: 11 }
                },
                min: 0.2,
                max: 0.65,
                grid: { drawOnChartArea: false },
                ticks: {
                    maxTicksLimit: 5,
                    callback: (v) => v.toFixed(2) + '%'
                }
            }
        }
    }
});

// 4. Profit Overview - Grouped Horizontal Bar (removed from main page)
    const profitEl = document.getElementById('profitOverview');
    if (profitEl) {
    const profitCtx = profitEl.getContext('2d');
    profitOverviewChart = new Chart(profitCtx, {
        type: 'bar',
        data: {
            labels: quarters,
            datasets: [
                {
                    label: 'הראל',
                    data: profitData.insurance.harel,
                    backgroundColor: colors.color5,
                    borderRadius: 6
                },
                {
                    label: 'מנורה',
                    data: profitData.insurance.menora,
                    backgroundColor: colors.color6,
                    borderRadius: 6
                }
            ]
        },
        options: {
            indexAxis: 'y',
            responsive: true,
            maintainAspectRatio: false,
            animation: {
                duration: 1200,
                easing: 'easeOutQuart'
            },
            plugins: {
                legend: { 
                    position: 'bottom',
                    labels: { usePointStyle: true }
                },
                tooltip: {
                    callbacks: {
                        label: (ctx) => `${ctx.dataset.label}: ₪${ctx.raw}M`
                    }
                }
            },
            scales: {
                x: { 
                    grid: { color: '#F1F5F9' },
                    ticks: { callback: (v) => `₪${v}M` }
                },
                y: {
                    grid: { display: false }
                }
            }
        }
    });
    }
}

// ===== DRILL-DOWN PANELS =====
function openPanel(panelId, triggerEl) {
    const panel = document.getElementById(panelId);
    const content = panel.querySelector('.panel-content');
    const isSubPanel = panel.classList.contains('sub-panel');

    // Sub-panels (second-level dialogs) use simple open - no expanding animation
    if (isSubPanel) {
        panel.classList.add('active');
        content.style.cssText = '';
        panel.classList.add('expanded');
        content.classList.remove('content-hidden');
        content.classList.add('content-visible');
        return;
    }

    // Get trigger element position
    const triggerCard = triggerEl ? triggerEl.closest('.card, .kpi-card, .panel-card, section, .period-selector') || triggerEl : null;
    const rect = triggerCard ? triggerCard.getBoundingClientRect() : null;

    // Store trigger rect for close animation
    if (rect) {
        panel.dataset.triggerRect = JSON.stringify({ top: rect.top, left: rect.left, width: rect.width, height: rect.height, borderRadius: getComputedStyle(triggerCard).borderRadius });
    }

    // Hide content children initially
    content.classList.add('content-hidden');
    content.classList.remove('content-visible');

    // Set initial position (from card or center-small)
    if (rect) {
        content.style.top = rect.top + 'px';
        content.style.left = rect.left + 'px';
        content.style.width = rect.width + 'px';
        content.style.height = rect.height + 'px';
        content.style.borderRadius = getComputedStyle(triggerCard).borderRadius;
    } else {
        content.style.top = '50%';
        content.style.left = '50%';
        content.style.width = '200px';
        content.style.height = '100px';
        content.style.transform = 'translate(-50%, -50%)';
        content.style.borderRadius = '16px';
    }

    // Show panel - compensate for scrollbar to prevent layout shift
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    document.body.style.paddingRight = scrollbarWidth + 'px';
    document.body.style.overflow = 'hidden';
    panel.classList.add('active');

    // Determine target size
    const customMaxW = panel.dataset.maxWidth ? parseInt(panel.dataset.maxWidth) : null;
    const maxW = customMaxW || 1400;
    const viewW = window.innerWidth;
    const targetW = Math.min(viewW * 0.95, maxW);
    const targetH = window.innerHeight * 0.9;
    const targetTop = (window.innerHeight - targetH) / 2;
    const targetLeft = (viewW - targetW) / 2;

    // Animate to expanded state
    requestAnimationFrame(() => {
        requestAnimationFrame(() => {
            content.style.top = targetTop + 'px';
            content.style.left = targetLeft + 'px';
            content.style.width = targetW + 'px';
            content.style.height = targetH + 'px';
            content.style.borderRadius = '28px';
            content.style.transform = '';
            panel.classList.add('expanded');

            // Show content after expansion
            setTimeout(() => {
                content.classList.remove('content-hidden');
                content.classList.add('content-visible');

                // Initialize charts
                if (panelId === 'demographicsPanel') initDemographicsCharts();
                if (panelId === 'claimsPanel') initClaimsCharts();
                if (panelId === 'profitPanel') initProfitCharts();
            }, 350);
        });
    });
}

function closePanel(panelId) {
    const panel = document.getElementById(panelId);
    const content = panel.querySelector('.panel-content');
    const isSubPanel = panel.classList.contains('sub-panel');

    // Sub-panels use simple close with quick fade-out
    if (isSubPanel) {
        panel.style.transition = 'opacity 0.15s ease';
        panel.style.opacity = '0';
        setTimeout(() => {
            panel.classList.remove('active', 'expanded');
            panel.style.cssText = '';
            content.style.cssText = '';
            content.classList.remove('content-hidden', 'content-visible');
        }, 150);
        return;
    }

    const savedRect = panel.dataset.triggerRect ? JSON.parse(panel.dataset.triggerRect) : null;

    // Hide content first
    content.classList.remove('content-visible');
    content.classList.add('content-hidden');

    // Add collapsing class for transition
    panel.classList.add('collapsing');
    panel.classList.remove('expanded');

    // Fade out immediately (starts transitioning to 0 over 0.5s)
    content.style.opacity = '0';

    if (savedRect) {
        // Animate back to card position
        content.style.top = savedRect.top + 'px';
        content.style.left = savedRect.left + 'px';
        content.style.width = savedRect.width + 'px';
        content.style.height = savedRect.height + 'px';
        content.style.borderRadius = savedRect.borderRadius;
    } else {
        content.style.top = '50%';
        content.style.left = '50%';
        content.style.width = '200px';
        content.style.height = '100px';
        content.style.transform = 'translate(-50%, -50%)';
    }

    // Clean up after animation
    setTimeout(() => {
        panel.classList.remove('active', 'collapsing');
        content.style.cssText = '';
        content.classList.remove('content-hidden', 'content-visible');
        document.body.style.overflow = '';
        document.body.style.paddingRight = '';
        delete panel.dataset.triggerRect;
    }, 600);
}

// ===== DEMOGRAPHICS PANEL CHARTS =====
function initDemographicsCharts() {
    // Age Distribution - render active chart type
    if (currentChartType === 'treemap') {
        initTreemap('all');
    } else {
        initAgeDistBar('all');
    }
    
    // New Members
    const newMembersCtx = document.getElementById('newMembersChart').getContext('2d');
    if (newMembersChart) newMembersChart.destroy();
    
    newMembersChart = new Chart(newMembersCtx, {
        type: 'line',
        data: {
            labels: quarters,
datasets: [
    { label: 'כללית', data: [38729, 36449, 35126, 30485, 38051], borderColor: colors.clalit, backgroundColor: colors.clalit, fill: false, tension: 0.4, borderWidth: 3, pointRadius: 5, pointBackgroundColor: colors.clalit, pointBorderColor: 'white', pointBorderWidth: 2 },
    { label: 'מכבי', data: [21979, 17860, 22156, 13737, 20306], borderColor: colors.maccabi, backgroundColor: colors.maccabi, fill: false, tension: 0.4, borderWidth: 3, pointRadius: 5, pointBackgroundColor: colors.maccabi, pointBorderColor: 'white', pointBorderWidth: 2 },
    { label: 'מאוחדת', data: [8101, 8256, 7286, 3235, 7347], borderColor: colors.meuhedet, backgroundColor: colors.meuhedet, fill: false, tension: 0.4, borderWidth: 3, pointRadius: 5, pointBackgroundColor: colors.meuhedet, pointBorderColor: 'white', pointBorderWidth: 2 },
    { label: 'לאומית', data: [6008, 6260, 8461, 6731, 9676], borderColor: colors.leumit, backgroundColor: colors.leumit, fill: false, tension: 0.4, borderWidth: 3, pointRadius: 5, pointBackgroundColor: colors.leumit, pointBorderColor: 'white', pointBorderWidth: 2 }
]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            animation: lineAnimation,
            interaction: { mode: 'index', intersect: false },
            plugins: { legend: { position: 'bottom' } },
            scales: {
                x: { grid: { display: false } },
                y: {
                    grid: { color: '#F1F5F9' },
                    ticks: { callback: (v) => v >= 1000 ? (v / 1000) + 'K' : v }
                }
            }
        }
    });


// Cancellation Rate - Yearly
const cancellationCtx = document.getElementById('cancellationChart').getContext('2d');
if (cancellationChart) cancellationChart.destroy();

cancellationChart = new Chart(cancellationCtx, {
    type: 'line',
    data: {
        labels: years,
        datasets: [
            { label: 'כללית', data: cancellationYearlyData.clalit, borderColor: colors.clalit, backgroundColor: colors.clalit, fill: false, tension: 0.4, borderWidth: 3, pointRadius: 5, pointBackgroundColor: colors.clalit, pointBorderColor: 'white', pointBorderWidth: 2 },
            { label: 'מכבי', data: cancellationYearlyData.maccabi, borderColor: colors.maccabi, backgroundColor: colors.maccabi, fill: false, tension: 0.4, borderWidth: 3, pointRadius: 5, pointBackgroundColor: colors.maccabi, pointBorderColor: 'white', pointBorderWidth: 2 },
            { label: 'מאוחדת', data: cancellationYearlyData.meuhedet, borderColor: colors.meuhedet, backgroundColor: colors.meuhedet, fill: false, tension: 0.4, borderWidth: 3, pointRadius: 5, pointBackgroundColor: colors.meuhedet, pointBorderColor: 'white', pointBorderWidth: 2 },
            { label: 'לאומית', data: cancellationYearlyData.leumit, borderColor: colors.leumit, backgroundColor: colors.leumit, fill: false, tension: 0.4, borderWidth: 3, pointRadius: 5, pointBackgroundColor: colors.leumit, pointBorderColor: 'white', pointBorderWidth: 2 }
        ]
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: lineAnimation,
        interaction: { mode: 'index', intersect: false },
        plugins: {
            legend: { position: 'bottom' },
            tooltip: {
                callbacks: {
                    label: (ctx) => `${ctx.dataset.label}: ${parseFloat(ctx.raw).toFixed(2)}%`
                }
            }
        },
        scales: {
            x: { grid: { display: false } },
            y: {
                grid: { color: '#F1F5F9' },
                ticks: { callback: (v) => Math.round(v) + '%' }
            }
        }
    }
});}

// ===== APPROVAL DRILL-DOWN CHART =====
function initApprovalChart() {
    const ctx = document.getElementById('approvalTrendChart');
    if (!ctx) return;
    if (approvalTrendChart) approvalTrendChart.destroy();

    approvalTrendChart = new Chart(ctx.getContext('2d'), {
        type: 'line',
        data: {
            labels: approvalData.years,
            datasets: [
                { label: 'שוק', data: approvalData.market, borderColor: '#3B82F6', backgroundColor: '#3B82F6', fill: false, tension: 0.4, borderWidth: 3, pointRadius: 6, pointBackgroundColor: '#3B82F6', pointBorderColor: 'white', pointBorderWidth: 2 },
                { label: 'הראל', data: approvalData.harel, borderColor: '#E11D48', backgroundColor: '#E11D48', fill: false, tension: 0.4, borderWidth: 3, pointRadius: 6, pointBackgroundColor: '#E11D48', pointBorderColor: 'white', pointBorderWidth: 2 },
                { label: 'מנורה', data: approvalData.menora, borderColor: '#F59E0B', backgroundColor: '#F59E0B', fill: false, tension: 0.4, borderWidth: 3, pointRadius: 6, pointBackgroundColor: '#F59E0B', pointBorderColor: 'white', pointBorderWidth: 2 }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            animation: lineAnimation,
            interaction: { mode: 'index', intersect: false },
            plugins: {
                legend: { position: 'bottom', labels: { usePointStyle: true } },
                tooltip: {
                    callbacks: {
                        label: (ctx) => `${ctx.dataset.label}: ${ctx.raw}%`
                    }
                }
            },
            scales: {
                x: { grid: { display: false } },
                y: {
                    grid: { color: '#F1F5F9' },
                    ticks: { callback: (v) => v + '%' },
                    min: 50,
                    max: 85
                }
            }
        }
    });
}

// ===== CLAIMS PANEL CHARTS =====
function initClaimsCharts() {
    initScenariosChart();
}

function initScenariosChart() {
    const ctx = document.getElementById('scenariosChart');
    if (!ctx) return;
    if (scenariosChart) scenariosChart.destroy();

    scenariosChart = new Chart(ctx.getContext('2d'), {
        type: 'line',
        data: {
            labels: frequencyYears,
            datasets: [
                { label: frequencyByScenario.permissive.label, data: frequencyByScenario.permissive.data, borderColor: '#3B82F6', backgroundColor: '#3B82F6', fill: false, tension: 0.4, borderWidth: 3, pointRadius: 5, pointBackgroundColor: '#3B82F6', pointBorderColor: 'white', pointBorderWidth: 2 },
                { label: frequencyByScenario.be.label, data: frequencyByScenario.be.data, borderColor: '#F59E0B', backgroundColor: '#F59E0B', fill: false, tension: 0.4, borderWidth: 3, pointRadius: 5, pointBackgroundColor: '#F59E0B', pointBorderColor: 'white', pointBorderWidth: 2 },
                { label: frequencyByScenario.conservativePrime.label, data: frequencyByScenario.conservativePrime.data, borderColor: '#9CA3AF', backgroundColor: '#9CA3AF', fill: false, tension: 0.4, borderWidth: 3, pointRadius: 5, pointBackgroundColor: '#9CA3AF', pointBorderColor: 'white', pointBorderWidth: 2 },
                { label: frequencyByScenario.conservative.label, data: frequencyByScenario.conservative.data, borderColor: '#84CC16', backgroundColor: '#84CC16', fill: false, tension: 0.4, borderWidth: 3, pointRadius: 5, pointBackgroundColor: '#84CC16', pointBorderColor: 'white', pointBorderWidth: 2 }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            animation: lineAnimation,
            interaction: { mode: 'index', intersect: false },
            plugins: {
                legend: { position: 'bottom', labels: { usePointStyle: true } },
                tooltip: {
                    callbacks: {
                        label: (ctx) => `${ctx.dataset.label}: ${ctx.raw.toFixed(2)}%`
                    }
                },
                datalabels: { display: false }
            },
            scales: {
                x: { grid: { display: false } },
                y: {
                    grid: { color: '#F1F5F9' },
                    ticks: { callback: (v) => v.toFixed(2) + '%' }
                }
            }
        }
    });
}

function initHmoFrequencyChart() {
    const ctx = document.getElementById('hmoFrequencyChart');
    if (!ctx) return;
    if (hmoFrequencyChart) hmoFrequencyChart.destroy();

    const hmoKeys = Object.keys(frequencyByHmo);
    const hmoDatasets = hmoKeys.map(key => ({
        label: frequencyByHmo[key].label,
        data: frequencyByHmo[key].data,
        borderColor: frequencyByHmo[key].color,
        backgroundColor: frequencyByHmo[key].color,
        fill: false,
        tension: 0.4,
        borderWidth: key === 'total' ? 4 : 2.5,
        pointRadius: 5,
        pointBackgroundColor: frequencyByHmo[key].color,
        pointBorderColor: 'white',
        pointBorderWidth: 2,
        borderDash: key === 'total' ? [6, 3] : []
    }));

    hmoFrequencyChart = new Chart(ctx.getContext('2d'), {
        type: 'line',
        data: {
            labels: frequencyYears,
            datasets: hmoDatasets
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            animation: lineAnimation,
            interaction: { mode: 'index', intersect: false },
            plugins: {
                legend: { position: 'bottom', labels: { usePointStyle: true } },
                tooltip: {
                    callbacks: {
                        label: (ctx) => `${ctx.dataset.label}: ${ctx.raw.toFixed(2)}%`
                    }
                },
                datalabels: { display: false }
            },
            scales: {
                x: { grid: { display: false } },
                y: {
                    grid: { color: '#F1F5F9' },
                    ticks: { callback: (v) => v.toFixed(2) + '%' }
                }
            }
        }
    });
}

function initAgeFrequencyChart(selectedGroups) {
    if (!selectedGroups) {
        selectedGroups = Array.from(document.querySelectorAll('.freq-age-nav-btn.active')).map(b => b.dataset.age);
    }
    if (selectedGroups.length === 0) return;

    // Update subtitle
    const subtitleEl = document.getElementById('ageFreqSubtitle');
    if (subtitleEl) {
        subtitleEl.textContent = selectedGroups.length === Object.keys(frequencyByAge).length
            ? 'קבוצות גיל: הכל'
            : `קבוצות גיל: ${selectedGroups.join(', ')}`;
    }

    // Calculate weighted average across selected age groups
    const totalWeight = selectedGroups.reduce((acc, g) => acc + frequencyAgeWeights[g], 0);
    const combinedData = frequencyYears.map((_, i) => {
        const weightedSum = selectedGroups.reduce((acc, g) => acc + frequencyByAge[g][i] * frequencyAgeWeights[g], 0);
        return parseFloat((weightedSum / totalWeight).toFixed(3));
    });

    // Build individual datasets for each selected group
    const ageColors = {
        '0-19': '#94A3B8', '20-29': '#A78BFA', '30-39': '#818CF8',
        '40-49': '#60A5FA', '50-59': '#38BDF8', '60-69': '#2DD4BF',
        '70-79': '#F59E0B', '80-89': '#F97316', '90+': '#EF4444'
    };

    const datasets = [];

    // Individual age group lines for each selected group
    selectedGroups.forEach(group => {
        datasets.push({
            label: group,
            data: frequencyByAge[group],
            borderColor: ageColors[group],
            backgroundColor: ageColors[group],
            fill: false,
            tension: 0.4,
            borderWidth: 2.5,
            pointRadius: 4,
            pointBackgroundColor: ageColors[group],
            pointBorderColor: 'white',
            pointBorderWidth: 2
        });
    });

    // Weighted average line (only when more than 1 group selected)
    if (selectedGroups.length > 1) {
        datasets.push({
            label: 'ממוצע משוקלל',
            data: combinedData,
            borderColor: '#1e293b',
            backgroundColor: '#1e293b',
            fill: false,
            tension: 0.4,
            borderWidth: 4,
            pointRadius: 6,
            pointBackgroundColor: '#1e293b',
            pointBorderColor: 'white',
            pointBorderWidth: 2,
            borderDash: [6, 3]
        });
    }

    // Calculate max value to determine Y-axis decimal precision dynamically
    const allChartValues = [];
    selectedGroups.forEach(g => allChartValues.push(...frequencyByAge[g]));
    if (selectedGroups.length > 1) allChartValues.push(...combinedData);
    const maxVal = Math.max(...allChartValues);
    const decimals = maxVal < 0.1 ? 3 : maxVal < 1 ? 2 : null;
    const yTickCallback = (v) => decimals !== null ? v.toFixed(decimals) + '%' : Math.round(v) + '%';
    const tooltipDecimals = decimals !== null ? Math.max(decimals, 2) : 2;

    const ctx = document.getElementById('ageFrequencyChart');
    if (!ctx) return;
    if (ageFrequencyChart) ageFrequencyChart.destroy();

    ageFrequencyChart = new Chart(ctx.getContext('2d'), {
        type: 'line',
        data: {
            labels: frequencyYears,
            datasets: datasets
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            animation: lineAnimation,
            interaction: { mode: 'index', intersect: false },
            plugins: {
                legend: { position: 'bottom', labels: { usePointStyle: true } },
                tooltip: {
                    callbacks: {
                        label: (ctx) => `${ctx.dataset.label}: ${ctx.raw.toFixed(tooltipDecimals)}%`
                    }
                },
                datalabels: { display: false }
            },
            scales: {
                x: { grid: { display: false } },
                y: {
                    grid: { color: '#F1F5F9' },
                    ticks: { callback: yTickCallback }
                }
            }
        }
    });
}

function initAdlFrequencyChart() {
    const ctx = document.getElementById('adlFrequencyChart');
    if (!ctx) return;
    if (adlFrequencyChart) adlFrequencyChart.destroy();

    const adlKeys = Object.keys(frequencyByAdl);
    const datasets = adlKeys.map(key => ({
        label: frequencyByAdl[key].label,
        data: frequencyByAdl[key].data,
        borderColor: frequencyByAdl[key].color,
        backgroundColor: frequencyByAdl[key].color,
        fill: false,
        tension: 0.4,
        borderWidth: key === 'all' ? 4 : 2.5,
        pointRadius: 5,
        pointBackgroundColor: frequencyByAdl[key].color,
        pointBorderColor: 'white',
        pointBorderWidth: 2
    }));

    adlFrequencyChart = new Chart(ctx.getContext('2d'), {
        type: 'line',
        data: {
            labels: frequencyYears,
            datasets: datasets
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            animation: lineAnimation,
            interaction: { mode: 'index', intersect: false },
            plugins: {
                legend: { position: 'bottom', labels: { usePointStyle: true } },
                tooltip: {
                    callbacks: {
                        label: (ctx) => `${ctx.dataset.label}: ${ctx.raw.toFixed(2)}%`
                    }
                },
                datalabels: { display: false }
            },
            scales: {
                x: { grid: { display: false } },
                y: {
                    grid: { color: '#F1F5F9' },
                    ticks: { callback: (v) => v.toFixed(2) + '%' }
                }
            }
        }
    });
}

// ===== CLAIMS AGE DISTRIBUTION CHART =====
function initAgeDistChart(year) {
    currentAgeDistYear = year || currentAgeDistYear;
    const fullData = claimsAgeDistData[currentAgeDistYear];

    // Update KPIs
    document.getElementById('ageDistAvgAge').textContent = fullData.avgAge.toFixed(1);
    document.getElementById('ageDistMedianAge').textContent = fullData.medianAge;
    document.getElementById('ageDistTotal').textContent = fullData.total.toLocaleString();

    // Filter out hidden age groups
    const visibleIndices = fullData.labels.map((l, i) => hiddenClaimsAgeGroups.has(l) ? -1 : i).filter(i => i !== -1);
    const data = {
        labels: visibleIndices.map(i => fullData.labels[i]),
        claims: visibleIndices.map(i => fullData.claims[i]),
        pct: visibleIndices.map(i => fullData.pct[i])
    };

    // Update year buttons
    document.querySelectorAll('.age-dist-year-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.year === currentAgeDistYear);
    });

    const ctx = document.getElementById('ageDistChart');
    if (!ctx) return;
    if (ageDistChart) ageDistChart.destroy();

    // Color gradient for bars - intensity based on claim count, using dashboard palette
    const maxClaims = Math.max(...data.claims);
    const barColors = data.claims.map(v => {
        const intensity = 0.3 + (v / maxClaims) * 0.7;
        return `rgba(16, 58, 151, ${intensity})`;
    });

    ageDistChart = new Chart(ctx.getContext('2d'), {
        type: 'bar',
        data: {
            labels: data.labels,
            datasets: [
                {
                    label: 'כמות תביעות',
                    data: data.claims,
                    backgroundColor: barColors,
                    borderRadius: 6,
                    yAxisID: 'y',
                    order: 2
                },
                {
                    label: 'שכיחות תביעות',
                    data: (() => {
                        const yearIndex = frequencyYears.indexOf(currentAgeDistYear);
                        if (yearIndex === -1) return data.labels.map(() => null);
                        const mapping = {
                            '0-10': '0-19', '10-20': '0-19',
                            '20-30': '20-29', '30-40': '30-39', '40-50': '40-49',
                            '50-60': '50-59', '60-70': '60-69', '70-80': '70-79',
                            '80-90': '80-89', '90+': '90+'
                        };
                        return data.labels.map(label => {
                            const freqGroup = mapping[label];
                            return freqGroup ? frequencyByAge[freqGroup][yearIndex] : null;
                        });
                    })(),
                    type: 'line',
                    borderColor: '#FDC509',
                    backgroundColor: '#FDC509',
                    fill: false,
                    tension: 0.4,
                    borderWidth: 3,
                    pointRadius: 5,
                    pointBackgroundColor: '#FDC509',
                    pointBorderColor: 'white',
                    pointBorderWidth: 2,
                    yAxisID: 'y1',
                    order: 1
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            interaction: { mode: 'index', intersect: false },
            onClick: (evt, elements) => {
                if (elements.length > 0) {
                    const label = data.labels[elements[0].index];
                    hiddenClaimsAgeGroups.add(label);
                    initAgeDistChart();
                }
            },
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: { usePointStyle: true, font: { size: 12 } }
                },
                tooltip: {
                    callbacks: {
                        label: (ctx) => {
                            if (ctx.dataset.yAxisID === 'y1') {
                                const v = ctx.raw;
                                return `${ctx.dataset.label}: ${v >= 1 ? Math.round(v) : v}%`;
                            }
                            const pct = data.pct[ctx.dataIndex];
                            return `${ctx.dataset.label}: ${ctx.raw.toLocaleString()} (${Math.round(pct)}%)`;
                        },
                        afterBody: () => '(לחץ להסתרה)'
                    }
                },
                datalabels: {
                    display: (context) => {
                        // Show labels only on bars
                        return context.datasetIndex === 0;
                    },
                    anchor: 'end',
                    align: 'top',
                    offset: 2,
                    color: '#4338CA',
                    font: { size: 10, weight: 'bold' },
                    formatter: (value) => {
                        if (value >= 1000) return (value / 1000).toFixed(1) + 'K';
                        return value;
                    }
                }
            },
            scales: {
                x: {
                    grid: { display: false },
                    ticks: { font: { size: 11, weight: '600' } }
                },
                y: {
                    type: 'linear',
                    display: true,
                    position: 'right',
                    grace: '15%',
                    title: { display: true, text: 'כמות תביעות', font: { size: 11 } },
                    grid: { color: '#F1F5F9' },
                    ticks: {
                        callback: (v) => {
                            if (v >= 1000) return (v / 1000).toFixed(0) + 'K';
                            return v;
                        }
                    }
                },
                y1: {
                    type: 'linear',
                    display: true,
                    position: 'left',
                    beginAtZero: true,
                    title: { display: true, text: 'שכיחות תביעות %', font: { size: 11 } },
                    grid: { display: false },
                    ticks: { callback: (v) => v + '%' }
                }
            }
        },
        plugins: [ChartDataLabels]
    });
    updateClaimsDistHiddenBar();
}

// ===== PROFIT PANEL CHARTS =====
function initProfitCharts() {
    // Insurance Profit Trend
    const insuranceTrendCtx = document.getElementById('insuranceProfitTrend').getContext('2d');
    if (insuranceProfitTrendChart) insuranceProfitTrendChart.destroy();
    
    insuranceProfitTrendChart = new Chart(insuranceTrendCtx, {
        type: 'line',
        data: {
            labels: quarters,
            datasets: [
                { label: 'הראל', data: profitData.insurance.harel, borderColor: colors.color5, backgroundColor: colors.color5, fill: false, tension: 0.4, borderWidth: 3, pointRadius: 5, pointBackgroundColor: colors.color5, pointBorderColor: 'white', pointBorderWidth: 2 },
                { label: 'מנורה', data: profitData.insurance.menora, borderColor: colors.color6, backgroundColor: colors.color6, fill: false, tension: 0.4, borderWidth: 3, pointRadius: 5, pointBackgroundColor: colors.color6, pointBorderColor: 'white', pointBorderWidth: 2 }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            animation: lineAnimation,
            plugins: { legend: { position: 'top' } },
            scales: {
                x: { grid: { display: false } },
                y: { ticks: { callback: (v) => v + '%' } }
            }
        }
    });

    // Insurance Comparison
    const insuranceCompCtx = document.getElementById('insuranceComparison').getContext('2d');
    if (insuranceComparisonChart) insuranceComparisonChart.destroy();
    
    insuranceComparisonChart = new Chart(insuranceCompCtx, {
        type: 'bar',
        data: {
            labels: ['הראל', 'מנורה'],
            datasets: [{
                data: [14.2, 11.8],
                backgroundColor: [colors.color5, colors.color6],
                borderRadius: 8
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            animation: barAnimation,
            plugins: { legend: { display: false } },
            scales: {
                x: { grid: { display: false } },
                y: { ticks: { callback: (v) => v + '%' } }
            }
        }
    });

    // Premium vs Claims
    const premiumCtx = document.getElementById('premiumVsClaims').getContext('2d');
    if (premiumVsClaimsChart) premiumVsClaimsChart.destroy();
    
    premiumVsClaimsChart = new Chart(premiumCtx, {
        type: 'bar',
        data: {
            labels: ['הראל', 'מנורה'],
            datasets: [
                { label: 'פרמיות', data: [890, 720], backgroundColor: colors.leumit, borderRadius: 4 },
                { label: 'תביעות', data: [765, 635], backgroundColor: colors.color5, borderRadius: 4 }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            animation: barAnimation,
            plugins: { legend: { position: 'top' } },
            scales: {
                x: { grid: { display: false } },
                y: { ticks: { callback: (v) => '₪' + v + 'M' } }
            }
        }
    });

    // HMO Profit Trend
    const hmoTrendCtx = document.getElementById('hmoProfitTrend').getContext('2d');
    if (hmoProfitTrendChart) hmoProfitTrendChart.destroy();
    
    hmoProfitTrendChart = new Chart(hmoTrendCtx, {
        type: 'line',
        data: {
            labels: quarters,
            datasets: [
                { label: 'כללית', data: profitData.hmo.clalit, borderColor: colors.clalit, backgroundColor: colors.clalit, fill: false, tension: 0.4, borderWidth: 3, pointRadius: 5, pointBackgroundColor: colors.clalit, pointBorderColor: 'white', pointBorderWidth: 2 },
                { label: 'מכבי', data: profitData.hmo.maccabi, borderColor: colors.maccabi, backgroundColor: colors.maccabi, fill: false, tension: 0.4, borderWidth: 3, pointRadius: 5, pointBackgroundColor: colors.maccabi, pointBorderColor: 'white', pointBorderWidth: 2 },
                { label: 'מאוחדת', data: profitData.hmo.meuhedet, borderColor: colors.meuhedet, backgroundColor: colors.meuhedet, fill: false, tension: 0.4, borderWidth: 3, pointRadius: 5, pointBackgroundColor: colors.meuhedet, pointBorderColor: 'white', pointBorderWidth: 2 },
                { label: 'לאומית', data: profitData.hmo.leumit, borderColor: colors.leumit, backgroundColor: colors.leumit, fill: false, tension: 0.4, borderWidth: 3, pointRadius: 5, pointBackgroundColor: colors.leumit, pointBorderColor: 'white', pointBorderWidth: 2 }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            animation: lineAnimation,
            plugins: { legend: { position: 'top' } },
            scales: {
                x: { grid: { display: false } },
                y: { ticks: { callback: (v) => v + '%' } }
            }
        }
    });

    // HMO Comparison
    const hmoCompCtx = document.getElementById('hmoComparison').getContext('2d');
    if (hmoComparisonChart) hmoComparisonChart.destroy();
    
    hmoComparisonChart = new Chart(hmoCompCtx, {
        type: 'bar',
        data: {
            labels: ['כללית', 'מכבי', 'מאוחדת', 'לאומית'],
            datasets: [{
                data: [8.5, 9.0, 7.8, 8.6],
                backgroundColor: [colors.clalit, colors.maccabi, colors.meuhedet, colors.leumit],
                borderRadius: 8
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            animation: barAnimation,
            plugins: { legend: { display: false } },
            scales: {
                x: { grid: { display: false } },
                y: { ticks: { callback: (v) => v + '%' } }
            }
        }
    });

    // Management Fees
    const feesCtx = document.getElementById('managementFees').getContext('2d');
    if (managementFeesChart) managementFeesChart.destroy();
    
    managementFeesChart = new Chart(feesCtx, {
        type: 'doughnut',
        data: {
            labels: ['כללית', 'מכבי', 'מאוחדת', 'לאומית'],
            datasets: [{
                data: [42, 35, 15, 8],
                backgroundColor: [colors.clalit, colors.maccabi, colors.meuhedet, colors.leumit],
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            animation: doughnutAnimation,
            cutout: '60%',
            plugins: { legend: { position: 'bottom' } }
        }
    });
}

// ===== EVENT LISTENERS =====
document.addEventListener('DOMContentLoaded', () => {
    initMainCharts();
    
    // Drill-down clicks - only on drill-indicator buttons
    document.getElementById('demographicsSection').querySelector('.drill-indicator').addEventListener('click', (e) => openPanel('demographicsPanel', e.currentTarget));
    document.getElementById('claimsSection').querySelector('.drill-indicator').addEventListener('click', (e) => openPanel('claimsPanel', e.currentTarget));
    document.getElementById('fundSection').querySelector('.drill-indicator').addEventListener('click', (e) => {
        openPanel('fundPanel', e.currentTarget);
        setTimeout(() => initFundGrowthChart('all'), 450);
    });
// Claims approval KPI drill-down
    document.getElementById('approvalKpi')?.querySelector('.drill-indicator')?.addEventListener('click', (e) => {
        openPanel('claimsApprovalPanel', e.currentTarget);
        setTimeout(() => initApprovalChart(), 450);
    });

// Cancellation card drill-down - only via drill-indicator button
    document.getElementById('cancellationCard')?.querySelector('.drill-indicator')?.addEventListener('click', (e) => {
        openPanel('cancellationAgePanel', e.currentTarget);
        // Activate all age groups by default
        const defaultAgeGroups = [];
        document.querySelectorAll('.cancel-age-nav-btn').forEach(btn => {
            btn.classList.add('active');
            defaultAgeGroups.push(btn.dataset.age);
        });
        setTimeout(() => updateCancellationAgeCharts(defaultAgeGroups), 450);
    });

    // Close on overlay click
    document.querySelectorAll('.panel-overlay').forEach(overlay => {
        overlay.addEventListener('click', () => {
            const panel = overlay.closest('.drill-panel');
            if (panel) closePanel(panel.id);
        });
    });
    
// Tab switching in Claims Panel
document.querySelectorAll('.panel-tab[data-tab]').forEach(tab => {
    tab.addEventListener('click', () => {
        const tabId = tab.dataset.tab;
        document.querySelectorAll('.panel-tab[data-tab]').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        
        document.querySelectorAll('#claimsPanel .tab-content').forEach(content => {
            content.classList.remove('active');
        });
        document.getElementById(tabId + 'Tab').classList.add('active');
        
        // Initialize charts when switching tabs
        if (tabId === 'scenarios') {
            setTimeout(() => initScenariosChart(), 100);
        } else if (tabId === 'hmoFreq') {
            setTimeout(() => initHmoFrequencyChart(), 100);
        } else if (tabId === 'ageFreq') {
            setTimeout(() => initAgeFrequencyChart(), 100);
        } else if (tabId === 'adl') {
            setTimeout(() => {
                initAdlFrequencyChart();
                initADLPolarChart();
            }, 100);
        } else if (tabId === 'ageDist') {
            setTimeout(() => initAgeDistChart(), 100);
        }
    });
});

// Age Distribution year buttons
document.querySelectorAll('.age-dist-year-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        initAgeDistChart(btn.dataset.year);
    });
});
    // Tab switching in Profit Panel
    document.querySelectorAll('.panel-tab[data-profit-tab]').forEach(tab => {
        tab.addEventListener('click', () => {
            const tabId = tab.dataset.profitTab;
            document.querySelectorAll('.panel-tab[data-profit-tab]').forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            
            document.querySelectorAll('#profitPanel .tab-content').forEach(content => {
                content.classList.remove('active');
            });
            document.getElementById(tabId + 'Tab').classList.add('active');
        });
    });

    // Age Group Panel overlay close
    document.querySelector('#ageGroupPanel .panel-overlay')?.addEventListener('click', () => {
        closePanel('ageGroupPanel');
    });

// Age Group Navigation buttons - click = single select, Ctrl+click = multi-select
    document.querySelectorAll('.age-nav-btn:not(.cancel-age-nav-btn)').forEach(btn => {
        btn.addEventListener('click', (e) => {
            if (e.ctrlKey) {
                // Ctrl+click: toggle this button
                btn.classList.toggle('active');
            } else {
                // Regular click: select only this one
                document.querySelectorAll('.age-nav-btn:not(.cancel-age-nav-btn)').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
            }

            // Get all selected age groups
            const selectedGroups = Array.from(document.querySelectorAll('.age-nav-btn.active:not(.cancel-age-nav-btn)'))
                .map(b => b.dataset.age);

            // If none selected, select this one
            if (selectedGroups.length === 0) {
                btn.classList.add('active');
                selectedGroups.push(btn.dataset.age);
            }

            updateAgeGroupCharts(selectedGroups);
        });
    });

    // Cancellation Age Navigation buttons - click = single select, Ctrl+click = multi-select
    document.querySelectorAll('.cancel-age-nav-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            if (e.ctrlKey) {
                // Ctrl+click: toggle this button
                btn.classList.toggle('active');
            } else {
                // Regular click: select only this one
                document.querySelectorAll('.cancel-age-nav-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
            }

            // Get all selected age groups
            const selectedGroups = Array.from(document.querySelectorAll('.cancel-age-nav-btn.active'))
                .map(b => b.dataset.age);

            // If none selected, select this one
            if (selectedGroups.length === 0) {
                btn.classList.add('active');
                selectedGroups.push(btn.dataset.age);
            }

            updateCancellationAgeCharts(selectedGroups);
        });
    });

    // Frequency Age Navigation buttons - click = single select, Ctrl+click = multi-select
    document.querySelectorAll('.freq-age-nav-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            if (e.ctrlKey) {
                btn.classList.toggle('active');
            } else {
                document.querySelectorAll('.freq-age-nav-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
            }

            const selectedGroups = Array.from(document.querySelectorAll('.freq-age-nav-btn.active'))
                .map(b => b.dataset.age);

            if (selectedGroups.length === 0) {
                btn.classList.add('active');
                selectedGroups.push(btn.dataset.age);
            }

            initAgeFrequencyChart(selectedGroups);
        });
    });

// Treemap/Bar view buttons (excluding cancellation age and freq age buttons)
    document.querySelectorAll('.treemap-view-btn:not(.cancel-age-nav-btn):not(.freq-age-nav-btn)').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.treemap-view-btn:not(.cancel-age-nav-btn):not(.freq-age-nav-btn)').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            if (currentChartType === 'treemap') {
                initTreemap(btn.dataset.view);
            } else {
                initAgeDistBar(btn.dataset.view);
            }
        });
    });

    // Chart type toggle (treemap / bar)
    document.querySelectorAll('.chart-type-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            switchChartType(btn.dataset.type);
        });
    });
});

// ===== AGE GROUP DRILL-DOWN =====

function openAgeGroupPanel(ageGroup) {
    document.getElementById('ageGroupPanel').classList.add('active');
    
    // Activate all buttons by default
    const allAgeGroups = [];
    document.querySelectorAll('.age-nav-btn').forEach(btn => {
        btn.classList.add('active');
        allAgeGroups.push(btn.dataset.age);
    });
    
    setTimeout(() => updateAgeGroupCharts(allAgeGroups), 100);
}

function updateAgeGroupCharts(selectedGroups) {
    // Update subtitle
    document.getElementById('ageGroupSubtitle').textContent = `קבוצות גיל: ${selectedGroups.join(', ')}`;
    
    initAgeGroupCharts(selectedGroups);
}

function initAgeGroupCharts(selectedGroups) {
    // Combine data from all selected age groups
    const combinedData = {
        clalit: quarters.map((_, i) => selectedGroups.reduce((sum, g) => sum + ageGroupQuarterlyData[g].clalit[i], 0)),
        maccabi: quarters.map((_, i) => selectedGroups.reduce((sum, g) => sum + ageGroupQuarterlyData[g].maccabi[i], 0)),
        meuhedet: quarters.map((_, i) => selectedGroups.reduce((sum, g) => sum + ageGroupQuarterlyData[g].meuhedet[i], 0)),
        leumit: quarters.map((_, i) => selectedGroups.reduce((sum, g) => sum + ageGroupQuarterlyData[g].leumit[i], 0))
    };
    
    // Calculate totals per quarter
    const totals = quarters.map((_, i) => 
        combinedData.clalit[i] + combinedData.maccabi[i] + combinedData.meuhedet[i] + combinedData.leumit[i]
    );
    
    // Trend Chart
const trendCtx = document.getElementById('ageGroupTrendChart').getContext('2d');

if (ageGroupTrendChart) {
    // עדכון נתונים בלבד - שומר על מצב המקרא (Legend)
    ageGroupTrendChart.data.datasets[0].data = combinedData.clalit;
    ageGroupTrendChart.data.datasets[1].data = combinedData.maccabi;
    ageGroupTrendChart.data.datasets[2].data = combinedData.meuhedet;
    ageGroupTrendChart.data.datasets[3].data = combinedData.leumit;
    ageGroupTrendChart.update(); 
} else {
    // יצירה ראשונית בלבד
    ageGroupTrendChart = new Chart(trendCtx, {
        type: 'line',
        data: {
            labels: quarters,
            datasets: [
                { label: 'כללית', data: combinedData.clalit, borderColor: colors.clalit, backgroundColor: colors.clalit, fill: false, tension: 0.4, borderWidth: 3, pointRadius: 5, pointBackgroundColor: colors.clalit, pointBorderColor: 'white', pointBorderWidth: 2 },
                { label: 'מכבי', data: combinedData.maccabi, borderColor: colors.maccabi, backgroundColor: colors.maccabi, fill: false, tension: 0.4, borderWidth: 3, pointRadius: 5, pointBackgroundColor: colors.maccabi, pointBorderColor: 'white', pointBorderWidth: 2 },
                { label: 'מאוחדת', data: combinedData.meuhedet, borderColor: colors.meuhedet, backgroundColor: colors.meuhedet, fill: false, tension: 0.4, borderWidth: 3, pointRadius: 5, pointBackgroundColor: colors.meuhedet, pointBorderColor: 'white', pointBorderWidth: 2 },
                { label: 'לאומית', data: combinedData.leumit, borderColor: colors.leumit, backgroundColor: colors.leumit, fill: false, tension: 0.4, borderWidth: 3, pointRadius: 5, pointBackgroundColor: colors.leumit, pointBorderColor: 'white', pointBorderWidth: 2 }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            animation: lineAnimation,
            interaction: { mode: 'index', intersect: false },
            plugins: { legend: { position: 'top' } },
            scales: {
                x: { grid: { display: false } },
                y: { 
                    grid: { color: '#F1F5F9' },
                    ticks: { callback: (v) => (v/1000) + 'K' }
                }
            }
        }
    });
}

// By HMO Chart - Yearly Change Percentage
    const hmoCtx = document.getElementById('ageGroupByHmoChart').getContext('2d');
    
    const hmoChangeData = [
        ((combinedData.clalit[4] - combinedData.clalit[0]) / combinedData.clalit[0] * 100).toFixed(1),
        ((combinedData.maccabi[4] - combinedData.maccabi[0]) / combinedData.maccabi[0] * 100).toFixed(1),
        ((combinedData.meuhedet[4] - combinedData.meuhedet[0]) / combinedData.meuhedet[0] * 100).toFixed(1),
        ((combinedData.leumit[4] - combinedData.leumit[0]) / combinedData.leumit[0] * 100).toFixed(1)
    ];

    if (ageGroupByHmoChart) {
        ageGroupByHmoChart.data.datasets[0].data = hmoChangeData;
        ageGroupByHmoChart.data.datasets[0].backgroundColor = hmoChangeData.map(v => v >= 0 ? colors.leumit : colors.color5);
        ageGroupByHmoChart.update();
    } else {
        ageGroupByHmoChart = new Chart(hmoCtx, {
            type: 'bar',
            data: {
                labels: ['כללית', 'מכבי', 'מאוחדת', 'לאומית'],
                datasets: [{
                    label: 'אחוז שינוי שנתי',
                    data: hmoChangeData,
                    backgroundColor: hmoChangeData.map(v => v >= 0 ? colors.leumit : colors.color5),
                    borderRadius: 8
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                animation: barAnimation,
                plugins: { legend: { display: false } },
                scales: {
                    x: { grid: { display: false } },
                    y: { 
                        grid: { color: '#F1F5F9' },
                        ticks: { callback: (v) => parseFloat(v).toFixed(1) + '%' }
                    }
                }
            }
        });
    }

    // Growth Chart
    const growthCtx = document.getElementById('ageGroupGrowthChart').getContext('2d');
    if (ageGroupGrowthChart) ageGroupGrowthChart.destroy();
    
    const growthData = [
        ((combinedData.clalit[4] - combinedData.clalit[3]) / combinedData.clalit[3] * 100).toFixed(1),
        ((combinedData.maccabi[4] - combinedData.maccabi[3]) / combinedData.maccabi[3] * 100).toFixed(1),
        ((combinedData.meuhedet[4] - combinedData.meuhedet[3]) / combinedData.meuhedet[3] * 100).toFixed(1),
        ((combinedData.leumit[4] - combinedData.leumit[3]) / combinedData.leumit[3] * 100).toFixed(1)
    ];
    
    ageGroupGrowthChart = new Chart(growthCtx, {
        type: 'bar',
        data: {
            labels: ['כללית', 'מכבי', 'מאוחדת', 'לאומית'],
            datasets: [{
                label: 'אחוז שינוי',
                data: growthData,
                backgroundColor: growthData.map(v => v >= 0 ? colors.leumit : colors.color5),
                borderRadius: 8
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            animation: barAnimation,
            plugins: { legend: { display: false } },
            scales: {
                x: { grid: { display: false } },
                y: { 
                    grid: { color: '#F1F5F9' },
                    ticks: { 
                    callback: (v) => {
                        // הפיכת המספר לכזה שמוגבל ל-2 ספרות אחרי הנקודה ומחיקת אפסים מיותרים
                        return parseFloat(v.toFixed(2)) + '%';
                    }
                }
                }
            }
        }
    });
}

// ===== FUND GROWTH PANEL =====
let currentFundView = 'all';
let currentMaccabiSub = 'combined';

function getFundGrowthDataForView(fund, sub) {
    // מחזיר את הנתונים המתאימים לתצוגה הנבחרת
    if (fund === 'maccabi_phoenix') {
        return maccabiBreakdown.phoenix;
    }
    if (fund === 'maccabi_menora') {
        return maccabiBreakdown.menora;
    }
    if (fund === 'all') {
        return {
            insurance: fundGrowthQuarters.map((_, i) =>
                fundGrowthData.clalit.insurance[i] +
                fundGrowthData.maccabi.insurance[i] +
                fundGrowthData.meuhedet.insurance[i] +
                fundGrowthData.leumit.insurance[i]
            ),
            finance: fundGrowthQuarters.map((_, i) =>
                fundGrowthData.clalit.finance[i] +
                fundGrowthData.maccabi.finance[i] +
                fundGrowthData.meuhedet.finance[i] +
                fundGrowthData.leumit.finance[i]
            ),
            transfer: fundGrowthQuarters.map((_, i) =>
                fundGrowthData.clalit.transfer[i] +
                fundGrowthData.maccabi.transfer[i] +
                fundGrowthData.meuhedet.transfer[i] +
                fundGrowthData.leumit.transfer[i]
            )
        };
    }
    return fundGrowthData[fund];
}

function getBalanceDataForView(fund) {
    if (fund === 'maccabi_phoenix') return maccabiBreakdown.phoenix.fund;
    if (fund === 'maccabi_menora') return maccabiBreakdown.menora.fund;
    if (fund === 'all') {
        return fundGrowthQuarters.map((_, i) =>
            fundDataExtended.clalit[i] + fundDataExtended.maccabi[i] +
            fundDataExtended.meuhedet[i] + fundDataExtended.leumit[i]
        );
    }
    return fundDataExtended[fund];
}

function initFundGrowthChart(fund = 'clalit') {
    const ctx = document.getElementById('fundGrowthChart').getContext('2d');
    if (fundGrowthChart) fundGrowthChart.destroy();

    const data = getFundGrowthDataForView(fund);
    const balanceData = getBalanceDataForView(fund);

    // חישוב סיכומים
    const latestBalance = balanceData[balanceData.length - 1];
    const prevBalance = balanceData[balanceData.length - 2];
    // בסיס לצמיחה: שימוש ביתרות מלפני המעבר בין-חברתי
    let firstBalance;
    if (fund === 'all') {
        firstBalance = growthBase.all;
    } else if (fund === 'maccabi') {
        firstBalance = growthBase.combined;
    } else if (fund === 'maccabi_phoenix') {
        firstBalance = growthBase.phoenix;
    } else if (fund === 'maccabi_menora') {
        firstBalance = growthBase.menora;
    } else {
        firstBalance = balanceData[0];
    }
    const qoqChange = ((latestBalance - prevBalance) / prevBalance * 100).toFixed(0);
    const totalGrowth = ((latestBalance - firstBalance) / firstBalance * 100).toFixed(0);

    document.getElementById('fundSummaryBalance').textContent = '₪' + (latestBalance / 1000).toFixed(2) + 'B';
    document.getElementById('fundSummaryChange').textContent = (qoqChange > 0 ? '+' : '') + qoqChange + '%';
    document.getElementById('fundSummaryChange').className = 'panel-summary-value ' + (qoqChange >= 0 ? 'positive' : 'negative');
    document.getElementById('fundSummaryGrowth').textContent = (totalGrowth > 0 ? '+' : '') + totalGrowth + '%';
    document.getElementById('fundSummaryGrowth').className = 'panel-summary-value ' + (totalGrowth >= 0 ? 'positive' : 'negative');

    // בניית datasets לפי מצב Toggle
    let datasets;
    if (showTransferSeparately) {
        // 3 עמודות: ביטוח (ללא העברה), העברה למבטח, השקעות
        const insuranceNet = data.insurance.map((v, i) => v - data.transfer[i]);
        datasets = [
            {
                label: 'פקטור ביטוח (ללא העברה)',
                data: insuranceNet,
                backgroundColor: colors.clalit,
                borderRadius: 4,
                barPercentage: 0.65,
                categoryPercentage: 0.7,
                stack: 'stack1'
            },
            {
                label: 'העברה למבטח',
                data: data.transfer,
                backgroundColor: '#E74C3C',
                borderRadius: 4,
                barPercentage: 0.65,
                categoryPercentage: 0.7,
                stack: 'stack1'
            },
            {
                label: 'פקטור השקעות',
                data: data.finance,
                backgroundColor: colors.leumit,
                borderRadius: 4,
                barPercentage: 0.65,
                categoryPercentage: 0.7,
                stack: 'stack1'
            }
        ];
    } else {
        // 2 עמודות: ביטוח (כולל העברה), השקעות
        datasets = [
            {
                label: 'פקטור ביטוח',
                data: data.insurance,
                backgroundColor: colors.clalit,
                borderRadius: 4,
                barPercentage: 0.65,
                categoryPercentage: 0.7,
                stack: 'stack1'
            },
            {
                label: 'פקטור השקעות',
                data: data.finance,
                backgroundColor: colors.leumit,
                borderRadius: 4,
                barPercentage: 0.65,
                categoryPercentage: 0.7,
                stack: 'stack1'
            }
        ];
    }

    fundGrowthChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: fundGrowthQuarters,
            datasets: datasets
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            animation: barAnimation,
            plugins: {
                legend: { position: 'top' },
                tooltip: {
                    mode: 'index',
                    intersect: false,
                    callbacks: {
                        label: (ctx) => {
                            const val = ctx.raw;
                            if (Math.abs(val) >= 1000) {
                                return `${ctx.dataset.label}: ₪${(val/1000).toFixed(2)}B`;
                            }
                            return `${ctx.dataset.label}: ₪${val.toFixed(1)}M`;
                        },
                        afterBody: (tooltipItems) => {
                            const total = tooltipItems.reduce((sum, item) => sum + item.raw, 0);
                            if (Math.abs(total) >= 1000) {
                                return `סה"כ שינוי: ₪${(total/1000).toFixed(2)}B`;
                            }
                            return `סה"כ שינוי: ₪${total.toFixed(1)}M`;
                        }
                    }
                }
            },
            scales: {
                x: {
                    grid: { display: false },
                    stacked: true
                },
                y: {
                    stacked: true,
                    grid: {
                        color: (context) => context.tick.value === 0 ? '#64748b' : '#F1F5F9',
                        lineWidth: (context) => context.tick.value === 0 ? 2 : 1
                    },
                    ticks: {
                        maxTicksLimit: 7,
                        callback: (v) => {
                            if (Math.abs(v) >= 1000) return '₪' + (v/1000).toFixed(1) + 'B';
                            return '₪' + v + 'M';
                        }
                    }
                }
            }
        }
    });
}

// Fund panel open handler
function openFundPanel() {
    document.getElementById('fundPanel').classList.add('active');
    document.body.style.overflow = 'hidden';
    currentFundView = 'all';
    currentMaccabiSub = 'combined';
    document.getElementById('maccabiSubNav').style.display = 'none';
    setTimeout(() => initFundGrowthChart('all'), 100);
}

// Fund nav buttons
document.querySelectorAll('.fund-nav-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.fund-nav-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentFundView = btn.dataset.fund;
        currentMaccabiSub = 'combined';

        // הצגת/הסתרת תת-ניווט מכבי
        const subNav = document.getElementById('maccabiSubNav');
        if (btn.dataset.fund === 'maccabi') {
            subNav.style.display = 'flex';
            document.querySelectorAll('.fund-sub-btn').forEach(b => b.classList.remove('active'));
            document.querySelector('.fund-sub-btn[data-sub="combined"]').classList.add('active');
            initFundGrowthChart('maccabi');
        } else {
            subNav.style.display = 'none';
            initFundGrowthChart(btn.dataset.fund);
        }
    });
});

// Maccabi sub-nav buttons
document.querySelectorAll('.fund-sub-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.fund-sub-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentMaccabiSub = btn.dataset.sub;

        if (btn.dataset.sub === 'combined') {
            initFundGrowthChart('maccabi');
        } else if (btn.dataset.sub === 'phoenix') {
            initFundGrowthChart('maccabi_phoenix');
        } else if (btn.dataset.sub === 'menora') {
            initFundGrowthChart('maccabi_menora');
        }
    });
});

// Transfer toggle handler
document.getElementById('transferToggle').addEventListener('change', (e) => {
    showTransferSeparately = e.target.checked;
    // רינדור מחדש של הגרף הנוכחי
    if (currentFundView === 'maccabi' && currentMaccabiSub !== 'combined') {
        initFundGrowthChart('maccabi_' + currentMaccabiSub);
    } else {
        initFundGrowthChart(currentFundView);
    }
});

function openCancellationAgePanel(ageGroup) {
    document.getElementById('cancellationAgePanel').classList.add('active');
    
    // Activate all age groups by default
    const defaultAgeGroups = [];
    document.querySelectorAll('.cancel-age-nav-btn').forEach(btn => {
        btn.classList.add('active');
        defaultAgeGroups.push(btn.dataset.age);
    });

    setTimeout(() => updateCancellationAgeCharts(defaultAgeGroups), 100);
}

function updateCancellationAgeCharts(selectedGroups) {
    document.getElementById('cancellationAgeSubtitle').textContent = `קבוצות גיל: ${selectedGroups.join(', ')}`;
    initCancellationAgeCharts(selectedGroups);
}

function initCancellationAgeCharts(selectedGroups) {
    // Calculate weighted average per HMO using each HMO's own population weights
    const combinedData = {};
    for (const hmo of ['clalit', 'maccabi', 'meuhedet', 'leumit']) {
        const hmoTotalWeight = selectedGroups.reduce((acc, g) => acc + cancellationHmoWeights[hmo][g], 0);
        combinedData[hmo] = years.map((_, i) => {
            const weightedSum = selectedGroups.reduce((acc, g) => acc + cancellationByAgeData[g][hmo][i] * cancellationHmoWeights[hmo][g], 0);
            return (weightedSum / hmoTotalWeight).toFixed(3);
        });
    }

    // Extract latest and previous values for charts
    const latestClalit = parseFloat(combinedData.clalit[4]);
    const latestMaccabi = parseFloat(combinedData.maccabi[4]);
    const latestMeuhedet = parseFloat(combinedData.meuhedet[4]);
    const latestLeumit = parseFloat(combinedData.leumit[4]);
    const prevClalit = parseFloat(combinedData.clalit[3]);
    const prevMaccabi = parseFloat(combinedData.maccabi[3]);
    const prevMeuhedet = parseFloat(combinedData.meuhedet[3]);
    const prevLeumit = parseFloat(combinedData.leumit[3]);

    // Trend Chart
    const trendCtx = document.getElementById('cancellationAgeTrendChart').getContext('2d');

    if (cancellationAgeTrendChart) {
        cancellationAgeTrendChart.data.datasets[0].data = combinedData.clalit;
        cancellationAgeTrendChart.data.datasets[1].data = combinedData.maccabi;
        cancellationAgeTrendChart.data.datasets[2].data = combinedData.meuhedet;
        cancellationAgeTrendChart.data.datasets[3].data = combinedData.leumit;
        cancellationAgeTrendChart.update();
    } else {
        cancellationAgeTrendChart = new Chart(trendCtx, {
            type: 'line',
            data: {
                labels: years,
                datasets: [
                    { label: 'כללית', data: combinedData.clalit, borderColor: colors.clalit, backgroundColor: colors.clalit, fill: false, tension: 0.4, borderWidth: 3, pointRadius: 5, pointBackgroundColor: colors.clalit, pointBorderColor: 'white', pointBorderWidth: 2 },
                    { label: 'מכבי', data: combinedData.maccabi, borderColor: colors.maccabi, backgroundColor: colors.maccabi, fill: false, tension: 0.4, borderWidth: 3, pointRadius: 5, pointBackgroundColor: colors.maccabi, pointBorderColor: 'white', pointBorderWidth: 2 },
                    { label: 'מאוחדת', data: combinedData.meuhedet, borderColor: colors.meuhedet, backgroundColor: colors.meuhedet, fill: false, tension: 0.4, borderWidth: 3, pointRadius: 5, pointBackgroundColor: colors.meuhedet, pointBorderColor: 'white', pointBorderWidth: 2 },
                    { label: 'לאומית', data: combinedData.leumit, borderColor: colors.leumit, backgroundColor: colors.leumit, fill: false, tension: 0.4, borderWidth: 3, pointRadius: 5, pointBackgroundColor: colors.leumit, pointBorderColor: 'white', pointBorderWidth: 2 }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                animation: lineAnimation,
                interaction: { mode: 'index', intersect: false },
                plugins: {
                    legend: { position: 'bottom' },
                    tooltip: {
                        callbacks: {
                            label: (ctx) => `${ctx.dataset.label}: ${parseFloat(ctx.raw).toFixed(2)}%`
                        }
                    }
                },
scales: {
                    x: { grid: { display: false } },
                    y: {
                        grid: { color: '#F1F5F9' },
                        ticks: { callback: (v) => Math.round(v) + '%' }
                    }
                }
            }
        });
    }

    // By HMO Chart (latest year)
    const hmoCtx = document.getElementById('cancellationAgeByHmoChart').getContext('2d');

    if (cancellationAgeByHmoChart) {
        cancellationAgeByHmoChart.data.datasets[0].data = [latestClalit, latestMaccabi, latestMeuhedet, latestLeumit];
        cancellationAgeByHmoChart.update();
    } else {
        cancellationAgeByHmoChart = new Chart(hmoCtx, {
            type: 'bar',
            data: {
                labels: ['כללית', 'מכבי', 'מאוחדת', 'לאומית'],
                datasets: [{
                    label: 'שיעור ביטולים',
                    data: [latestClalit, latestMaccabi, latestMeuhedet, latestLeumit],
                    backgroundColor: [colors.clalit, colors.maccabi, colors.meuhedet, colors.leumit],
                    borderRadius: 8
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                animation: barAnimation,
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        callbacks: {
                            label: (ctx) => `${ctx.dataset.label}: ${parseFloat(ctx.raw).toFixed(2)}%`
                        }
                    }
                },
scales: {
                    x: { grid: { display: false } },
                    y: {
                        grid: { color: '#F1F5F9' },
                        ticks: { callback: (v) => Math.round(v) + '%' }
                    }
                }
            }
        });
    }

    // Growth Chart (change from previous year)
    const growthCtx = document.getElementById('cancellationAgeGrowthChart').getContext('2d');
    if (cancellationAgeGrowthChart) cancellationAgeGrowthChart.destroy();
    
    const growthData = [
        ((latestClalit - prevClalit) / prevClalit * 100).toFixed(1),
        ((latestMaccabi - prevMaccabi) / prevMaccabi * 100).toFixed(1),
        ((latestMeuhedet - prevMeuhedet) / prevMeuhedet * 100).toFixed(1),
        ((latestLeumit - prevLeumit) / prevLeumit * 100).toFixed(1)
    ];
    
    cancellationAgeGrowthChart = new Chart(growthCtx, {
        type: 'bar',
        data: {
            labels: ['כללית', 'מכבי', 'מאוחדת', 'לאומית'],
            datasets: [{
                label: 'אחוז שינוי',
                data: growthData,
                backgroundColor: growthData.map(v => v >= 0 ? colors.color5 : colors.leumit),
                borderRadius: 8
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            animation: barAnimation,
            plugins: { legend: { display: false } },
            scales: {
                x: { grid: { display: false } },
                y: {
                    grid: { color: '#F1F5F9' },
                    ticks: { callback: (v) => Math.round(v) + '%' }
                }
            }
        }
    });
}

// Event listen

// ===== ADL POLAR CHART =====
const adlData = {
    2020: { '3 ADL ישן': 30.33, '3 ADL כולל סוגרים': 4.37, '4 ADL': 39.62, 'תשישות נפש': 25.68 },
    2021: { '3 ADL ישן': 29.43, '3 ADL כולל סוגרים': 4.69, '4 ADL': 40.36, 'תשישות נפש': 25.52 },
    2022: { '3 ADL ישן': 30.44, '3 ADL כולל סוגרים': 5.50, '4 ADL': 39.96, 'תשישות נפש': 24.10 },
    2023: { '3 ADL ישן': 31.15, '3 ADL כולל סוגרים': 7.50, '4 ADL': 37.50, 'תשישות נפש': 23.85 },
    2024: { '3 ADL ישן': 26.98, '3 ADL כולל סוגרים': 9.64, '4 ADL': 38.12, 'תשישות נפש': 25.27 },
    2025: { '3 ADL ישן (לא מזכה כיום)': 1.09, '3 ADL כולל סוגרים': 11.72, '4 ADL': 56.68, 'תשישות נפש': 30.52 }
};

let currentYear = 2025;

function initADLPolarChart() {
    const container = document.getElementById('adlRadialChart');
    if (!container) return;

    updateADLPolarChart();

    // Year buttons
    document.querySelectorAll('.year-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.year-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentYear = parseInt(btn.dataset.year);
            updateADLPolarChart();
        });
    });
}
function updateADLPolarChart() {
    try {
        console.log('Starting updateADLPolarChart');
        const container = document.getElementById('adlRadialChart');
        console.log('Container:', container);
        if (!container) {
            console.log('No container found');
            return;
        }
    
    // Clear previous chart
    container.innerHTML = '';
    
    const data = adlData[currentYear];
    const labels = Object.keys(data);
    const values = Object.values(data);
    
    // Color map
    const colorMap = {
        '3 ADL ישן': ['#FCA5A5', '#EF4444'],
        '3 ADL ישן (לא מזכה כיום)': ['#FCA5A5', '#EF4444'],
        '3 ADL כולל סוגרים': ['#93C5FD', '#3B82F6'],
        '4 ADL': ['#6EE7B7', '#10B981'],
        'תשישות נפש': ['#C4B5FD', '#8B5CF6']
    };
    
// Dimensions
const width = 450;
const height = 230;
const centerX = width / 2;
const centerY = height - 20;
const maxRadius = 190;
const minRadius = 60;
    const barSpacing = 6;
    const numBars = labels.length;
    const barHeight = (maxRadius - minRadius - (numBars - 1) * barSpacing) / numBars;
    const maxValue = 80;
    
    // Create SVG
    const svg = d3.select(container)
        .append('svg')
        .attr('width', width)
        .attr('height', height);
    
    const g = svg.append('g')
        .attr('transform', `translate(${centerX}, ${centerY})`);
    
    // Create defs for gradients
    const defs = svg.append('defs');
    
    labels.forEach((label, i) => {
        const colors = colorMap[label] || ['#94A3B8', '#64748B'];
        const gradient = defs.append('linearGradient')
            .attr('id', `radial-grad-${i}`)
            .attr('x1', '0%')
            .attr('y1', '0%')
            .attr('x2', '100%')
            .attr('y2', '0%');
        
        gradient.append('stop')
            .attr('offset', '0%')
            .attr('stop-color', colors[0]);
        
        gradient.append('stop')
            .attr('offset', '100%')
            .attr('stop-color', colors[1]);
    });
    
    // Draw background arcs and value arcs for each category
    labels.forEach((label, i) => {
        const innerR = minRadius + i * (barHeight + barSpacing);
        const outerR = innerR + barHeight;
        const value = values[i];
        const endAngle = (value / maxValue) * Math.PI; // Half circle
        
        // Background arc (gray track)
        const bgArc = d3.arc()
            .innerRadius(innerR)
            .outerRadius(outerR)
            .startAngle(-Math.PI / 2)
            .endAngle(Math.PI / 2)
            .cornerRadius(4);
        
        g.append('path')
            .attr('d', bgArc())
            .attr('fill', '#e2e8f0');
        
        // Value arc with animation
        const valueArc = d3.arc()
            .innerRadius(innerR)
            .outerRadius(outerR)
            .startAngle(-Math.PI / 2)
            .cornerRadius(4);
        
        g.append('path')
            .attr('fill', `url(#radial-grad-${i})`)
            .attr('d', valueArc.endAngle(-Math.PI / 2)())
            .transition()
.duration(800)
.ease(d3.easeCubicOut)
            .attrTween('d', function() {
                const interpolate = d3.interpolate(-Math.PI / 2, -Math.PI / 2 + endAngle);
                return function(t) {
                    return valueArc.endAngle(interpolate(t))();
                };
            });
        
 // Add hover tooltip
        g.append('path')
            .attr('d', bgArc())
            .attr('fill', 'transparent')
            .style('cursor', 'pointer')
            .on('mouseover', function(event) {
                d3.select('#adlTooltip')
                    .style('display', 'block')
                    .style('left', (event.pageX + 10) + 'px')
                    .style('top', (event.pageY - 10) + 'px')
                    .html(`<strong>${label}</strong><br>${value.toFixed(2)}%`);
            })
            .on('mouseout', function() {
                d3.select('#adlTooltip').style('display', 'none');
            });
});  
    // Center text - Year
    g.append('text')
        .attr('text-anchor', 'middle')
        .attr('dominant-baseline', 'middle')
        .attr('dy', '-8px')
        .style('font-size', '26px')
        .style('font-weight', '700')
        .style('fill', '#1e293b')
        .style('font-family', 'Heebo, sans-serif')
        .text(currentYear);
    
    // Center text - subtitle
    g.append('text')
        .attr('text-anchor', 'middle')
        .attr('dominant-baseline', 'middle')
        .attr('dy', '18px')
        .style('font-size', '13px')
        .style('font-weight', '500')
        .style('fill', '#64748b')
        .style('font-family', 'Heebo, sans-serif')
        .text('כל השוק');
    
    // Update legend text based on year
    const adl3Label = document.getElementById('adl3Label');
    if (adl3Label) {
        adl3Label.textContent = currentYear === 2025 ? '3 ADL ישן (לא מזכה כיום)' : '3 ADL ישן';
    }
console.log('Chart completed successfully');
    } catch (error) {
        console.error('Error in updateADLPolarChart:', error);
    }
}
