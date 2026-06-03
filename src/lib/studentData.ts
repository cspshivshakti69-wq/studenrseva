'use client';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface ExamScore {
    id: string;
    examName: string;
    subject: string;
    score: number;       // raw marks
    maxScore: number;
    date: string;        // ISO date string
}

export interface QuizQuestion {
    id: string;
    subject: 'Physics' | 'Chemistry' | 'Mathematics' | 'Biology' | 'General Knowledge';
    question: string;
    options: [string, string, string, string];
    correctIndex: number; // 0-3
    explanation: string;
    difficulty: 'Easy' | 'Medium' | 'Hard';
}

export interface QuizAttempt {
    id: string;
    subject: string;
    date: string;
    totalQuestions: number;
    correctAnswers: number;
    timeTaken: number;   // seconds
}

export interface Note {
    id: string;
    title: string;
    fileName: string;
    fileSize: number;    // bytes
    uploadedAt: string;
    dataUrl: string;     // base64 data URL stored locally
    subject: string;
}

export interface CalendarNote {
    id: string;
    date: string;        // YYYY-MM-DD
    text: string;
    type: 'exam' | 'task' | 'reminder';
    isExamDate: boolean;
}

// ─── Pre-seeded exam dates ────────────────────────────────────────────────────

export const PRESET_EXAM_DATES: CalendarNote[] = [
    { id: 'ex-1', date: '2026-06-10', text: 'NEET UG 2026 Exam', type: 'exam', isExamDate: true },
    { id: 'ex-2', date: '2026-06-15', text: 'JEE Advanced 2026', type: 'exam', isExamDate: true },
    { id: 'ex-3', date: '2026-07-01', text: 'CET Karnataka 2026', type: 'exam', isExamDate: true },
    { id: 'ex-4', date: '2026-07-20', text: 'KCET Counselling Round 1', type: 'exam', isExamDate: true },
    { id: 'ex-5', date: '2026-08-05', text: 'CUET PG 2026', type: 'exam', isExamDate: true },
];

// ─── Quiz question bank ───────────────────────────────────────────────────────

export const QUIZ_QUESTIONS: QuizQuestion[] = [
    // ── Physics ──────────────────────────────────────────────────────────────
    {
        id: 'ph1', subject: 'Physics', difficulty: 'Easy',
        question: 'A body of mass 4 kg moves with velocity 10 m/s. What is its kinetic energy?',
        options: ['200 J', '100 J', '400 J', '40 J'],
        correctIndex: 0,
        explanation: 'K.E = ½mv² = ½ × 4 × 100 = 200 J',
    },
    {
        id: 'ph2', subject: 'Physics', difficulty: 'Easy',
        question: 'A force of 20 N acts on a 5 kg body. What is the acceleration?',
        options: ['4 m/s²', '2 m/s²', '10 m/s²', '100 m/s²'],
        correctIndex: 0,
        explanation: 'a = F/m = 20/5 = 4 m/s²',
    },
    {
        id: 'ph3', subject: 'Physics', difficulty: 'Medium',
        question: 'The work done moving a charge of 3 C through 12 V potential difference is:',
        options: ['36 J', '4 J', '9 J', '15 J'],
        correctIndex: 0,
        explanation: 'W = qV = 3 × 12 = 36 J',
    },
    {
        id: 'ph4', subject: 'Physics', difficulty: 'Medium',
        question: 'A circuit has resistance 4 Ω and current 3 A. Power dissipated is:',
        options: ['36 W', '12 W', '7 W', '48 W'],
        correctIndex: 0,
        explanation: 'P = I²R = 9 × 4 = 36 W',
    },
    {
        id: 'ph5', subject: 'Physics', difficulty: 'Hard',
        question: 'A 100 μF capacitor is charged to 50 V. Energy stored is:',
        options: ['0.125 J', '0.25 J', '5 J', '0.5 J'],
        correctIndex: 0,
        explanation: 'E = ½CV² = ½ × 100×10⁻⁶ × 2500 = 0.125 J',
    },
    {
        id: 'ph6', subject: 'Physics', difficulty: 'Medium',
        question: 'The escape velocity from Earth (R = 6.4×10⁶ m, M = 6×10²⁴ kg) is approximately:',
        options: ['11.2 km/s', '9.8 km/s', '7.9 km/s', '12.5 km/s'],
        correctIndex: 0,
        explanation: 'v = √(2GM/R) ≈ 11.2 km/s',
    },
    {
        id: 'ph7', subject: 'Physics', difficulty: 'Hard',
        question: 'An object placed 30 cm from a concave mirror (f = 15 cm). Image distance is:',
        options: ['30 cm', '15 cm', '60 cm', '10 cm'],
        correctIndex: 0,
        explanation: '1/v + 1/u = 1/f → 1/v = 1/15 - 1/30 = 1/30 → v = 30 cm',
    },
    {
        id: 'ph8', subject: 'Physics', difficulty: 'Easy',
        question: 'What is the SI unit of electric resistance?',
        options: ['Ohm', 'Ampere', 'Volt', 'Watt'],
        correctIndex: 0,
        explanation: 'The SI unit of electric resistance is the Ohm (Ω).',
    },
    // ── Chemistry ────────────────────────────────────────────────────────────
    {
        id: 'ch1', subject: 'Chemistry', difficulty: 'Easy',
        question: 'What is the atomic number of Carbon?',
        options: ['6', '12', '4', '8'],
        correctIndex: 0,
        explanation: 'Carbon has 6 protons in its nucleus, so its atomic number is 6.',
    },
    {
        id: 'ch2', subject: 'Chemistry', difficulty: 'Easy',
        question: 'The pH of pure water at 25°C is:',
        options: ['7', '0', '14', '4'],
        correctIndex: 0,
        explanation: 'Pure water is neutral with pH = 7 at 25°C.',
    },
    {
        id: 'ch3', subject: 'Chemistry', difficulty: 'Medium',
        question: 'How many moles are in 44 g of CO₂? (Molar mass = 44 g/mol)',
        options: ['1 mol', '2 mol', '0.5 mol', '44 mol'],
        correctIndex: 0,
        explanation: 'Moles = mass/molar mass = 44/44 = 1 mol',
    },
    {
        id: 'ch4', subject: 'Chemistry', difficulty: 'Medium',
        question: 'Which gas is released when zinc reacts with dilute HCl?',
        options: ['Hydrogen', 'Oxygen', 'Chlorine', 'Nitrogen'],
        correctIndex: 0,
        explanation: 'Zn + 2HCl → ZnCl₂ + H₂↑. Hydrogen gas is released.',
    },
    {
        id: 'ch5', subject: 'Chemistry', difficulty: 'Hard',
        question: 'What is the hybridization of carbon in methane (CH₄)?',
        options: ['sp³', 'sp²', 'sp', 'dsp²'],
        correctIndex: 0,
        explanation: 'Carbon in CH₄ forms 4 equivalent bonds → sp³ hybridization, tetrahedral geometry.',
    },
    {
        id: 'ch6', subject: 'Chemistry', difficulty: 'Medium',
        question: 'Avogadro\'s number is approximately:',
        options: ['6.022 × 10²³', '6.022 × 10²²', '3.011 × 10²³', '1.66 × 10⁻²⁷'],
        correctIndex: 0,
        explanation: 'Avogadro\'s number = 6.022 × 10²³ particles per mole.',
    },
    {
        id: 'ch7', subject: 'Chemistry', difficulty: 'Easy',
        question: 'Which element has the symbol \'Na\'?',
        options: ['Sodium', 'Nitrogen', 'Nickel', 'Neon'],
        correctIndex: 0,
        explanation: 'Na comes from Latin "Natrium" — the element is Sodium.',
    },
    {
        id: 'ch8', subject: 'Chemistry', difficulty: 'Hard',
        question: 'The molarity of a 4 g NaOH (MM = 40) in 500 mL solution is:',
        options: ['0.2 M', '0.4 M', '0.1 M', '0.8 M'],
        correctIndex: 0,
        explanation: 'Moles = 4/40 = 0.1; Molarity = 0.1/0.5 = 0.2 M',
    },
    // ── Mathematics ──────────────────────────────────────────────────────────
    {
        id: 'ma1', subject: 'Mathematics', difficulty: 'Easy',
        question: 'What is the derivative of x³ with respect to x?',
        options: ['3x²', 'x²', '3x', '2x³'],
        correctIndex: 0,
        explanation: 'd/dx(xⁿ) = nxⁿ⁻¹ → d/dx(x³) = 3x²',
    },
    {
        id: 'ma2', subject: 'Mathematics', difficulty: 'Medium',
        question: '∫x² dx equals:',
        options: ['x³/3 + C', 'x³ + C', '2x + C', 'x²/2 + C'],
        correctIndex: 0,
        explanation: '∫xⁿ dx = xⁿ⁺¹/(n+1) + C → ∫x² dx = x³/3 + C',
    },
    {
        id: 'ma3', subject: 'Mathematics', difficulty: 'Easy',
        question: 'If sin θ = 1/2, then θ = ?',
        options: ['30°', '45°', '60°', '90°'],
        correctIndex: 0,
        explanation: 'sin 30° = 1/2, so θ = 30°',
    },
    {
        id: 'ma4', subject: 'Mathematics', difficulty: 'Medium',
        question: 'The roots of x² - 5x + 6 = 0 are:',
        options: ['2 and 3', '1 and 6', '-2 and -3', '2 and -3'],
        correctIndex: 0,
        explanation: 'x² - 5x + 6 = (x-2)(x-3) = 0 → x = 2 or x = 3',
    },
    {
        id: 'ma5', subject: 'Mathematics', difficulty: 'Hard',
        question: 'The determinant of matrix [[2,3],[1,4]] is:',
        options: ['5', '8', '11', '-5'],
        correctIndex: 0,
        explanation: 'det = (2×4) - (3×1) = 8 - 3 = 5',
    },
    {
        id: 'ma6', subject: 'Mathematics', difficulty: 'Medium',
        question: 'How many ways can 5 people be arranged in a row?',
        options: ['120', '25', '60', '20'],
        correctIndex: 0,
        explanation: '5! = 5×4×3×2×1 = 120',
    },
    {
        id: 'ma7', subject: 'Mathematics', difficulty: 'Hard',
        question: 'The sum of an AP with first term 3, common difference 2, and 10 terms is:',
        options: ['120', '100', '60', '50'],
        correctIndex: 0,
        explanation: 'S = n/2 [2a + (n-1)d] = 10/2 [6 + 18] = 5 × 24 = 120',
    },
    {
        id: 'ma8', subject: 'Mathematics', difficulty: 'Easy',
        question: 'What is log₁₀(1000)?',
        options: ['3', '100', '1000', '10'],
        correctIndex: 0,
        explanation: 'log₁₀(10³) = 3',
    },
    // ── Biology ──────────────────────────────────────────────────────────────
    {
        id: 'bi1', subject: 'Biology', difficulty: 'Easy',
        question: 'The powerhouse of the cell is:',
        options: ['Mitochondria', 'Nucleus', 'Ribosome', 'Golgi Body'],
        correctIndex: 0,
        explanation: 'Mitochondria produce ATP via cellular respiration, earning the "powerhouse" title.',
    },
    {
        id: 'bi2', subject: 'Biology', difficulty: 'Easy',
        question: 'DNA stands for:',
        options: ['Deoxyribonucleic Acid', 'Deoxyribose Nucleic Acid', 'Di-Nucleic Acid', 'Dynamic Nucleic Acid'],
        correctIndex: 0,
        explanation: 'DNA = Deoxyribonucleic Acid — the molecule that carries genetic information.',
    },
    {
        id: 'bi3', subject: 'Biology', difficulty: 'Medium',
        question: 'Which blood group is the universal donor?',
        options: ['O negative', 'AB positive', 'A positive', 'B negative'],
        correctIndex: 0,
        explanation: 'O negative RBCs lack A, B, and Rh antigens, making them compatible with all groups.',
    },
    {
        id: 'bi4', subject: 'Biology', difficulty: 'Medium',
        question: 'The process by which plants make food using sunlight is called:',
        options: ['Photosynthesis', 'Respiration', 'Transpiration', 'Digestion'],
        correctIndex: 0,
        explanation: '6CO₂ + 6H₂O + light → C₆H₁₂O₆ + 6O₂',
    },
    {
        id: 'bi5', subject: 'Biology', difficulty: 'Hard',
        question: 'Which enzyme unwinds the DNA double helix during replication?',
        options: ['Helicase', 'Polymerase', 'Ligase', 'Topoisomerase'],
        correctIndex: 0,
        explanation: 'Helicase breaks hydrogen bonds between base pairs to unwind the helix.',
    },
    {
        id: 'bi6', subject: 'Biology', difficulty: 'Medium',
        question: 'The normal human chromosome count is:',
        options: ['46', '48', '44', '23'],
        correctIndex: 0,
        explanation: 'Humans have 46 chromosomes (23 pairs) in somatic cells.',
    },
    {
        id: 'bi7', subject: 'Biology', difficulty: 'Easy',
        question: 'Which vitamin is produced when skin is exposed to sunlight?',
        options: ['Vitamin D', 'Vitamin C', 'Vitamin A', 'Vitamin K'],
        correctIndex: 0,
        explanation: 'UV-B radiation converts 7-dehydrocholesterol in skin to Vitamin D₃.',
    },
    {
        id: 'bi8', subject: 'Biology', difficulty: 'Hard',
        question: 'In Mendel\'s experiment, tall (T) is dominant over dwarf (t). A Tt × Tt cross gives ratio:',
        options: ['3:1', '1:1', '1:2:1', '1:3'],
        correctIndex: 0,
        explanation: 'Tt × Tt → TT : Tt : tt = 1:2:1, phenotype ratio 3 tall : 1 dwarf',
    },
    // ── General Knowledge ─────────────────────────────────────────────────────
    {
        id: 'gk1', subject: 'General Knowledge', difficulty: 'Easy',
        question: 'Who wrote the Indian National Anthem "Jana Gana Mana"?',
        options: ['Rabindranath Tagore', 'Bankim Chandra', 'Mahatma Gandhi', 'Nehru'],
        correctIndex: 0,
        explanation: 'Jana Gana Mana was composed by Rabindranath Tagore and adopted in 1950.',
    },
    {
        id: 'gk2', subject: 'General Knowledge', difficulty: 'Easy',
        question: 'India became independent on:',
        options: ['15 August 1947', '26 January 1950', '26 January 1947', '15 August 1950'],
        correctIndex: 0,
        explanation: 'India gained independence from British rule on 15 August 1947.',
    },
    {
        id: 'gk3', subject: 'General Knowledge', difficulty: 'Medium',
        question: 'Article 21 of the Indian Constitution guarantees:',
        options: ['Right to Life', 'Right to Equality', 'Right to Freedom', 'Right to Education'],
        correctIndex: 0,
        explanation: 'Article 21 states: "No person shall be deprived of his life or personal liberty..."',
    },
    {
        id: 'gk4', subject: 'General Knowledge', difficulty: 'Medium',
        question: 'The capital of Karnataka is:',
        options: ['Bengaluru', 'Mysuru', 'Hubballi', 'Mangaluru'],
        correctIndex: 0,
        explanation: 'Bengaluru (Bangalore) is the capital and largest city of Karnataka.',
    },
    {
        id: 'gk5', subject: 'General Knowledge', difficulty: 'Easy',
        question: 'How many planets are in the Solar System?',
        options: ['8', '9', '7', '10'],
        correctIndex: 0,
        explanation: 'Since Pluto was reclassified in 2006, there are 8 planets in the Solar System.',
    },
    {
        id: 'gk6', subject: 'General Knowledge', difficulty: 'Hard',
        question: 'Which organisation issues the Human Development Index (HDI)?',
        options: ['UNDP', 'World Bank', 'IMF', 'WHO'],
        correctIndex: 0,
        explanation: 'The UNDP (United Nations Development Programme) publishes the annual HDI report.',
    },
    {
        id: 'gk7', subject: 'General Knowledge', difficulty: 'Medium',
        question: 'The longest river in India is:',
        options: ['Ganga', 'Yamuna', 'Godavari', 'Indus'],
        correctIndex: 0,
        explanation: 'The Ganga (2525 km) is the longest river flowing entirely within India.',
    },
    {
        id: 'gk8', subject: 'General Knowledge', difficulty: 'Easy',
        question: 'One light-year is a measure of:',
        options: ['Distance', 'Time', 'Speed', 'Mass'],
        correctIndex: 0,
        explanation: 'A light-year is the distance light travels in one year ≈ 9.46 × 10¹² km.',
    },
];

// ─── Motivational quotes ──────────────────────────────────────────────────────

export const MOTIVATIONAL_QUOTES = [
    { text: 'Success is not final, failure is not fatal: it is the courage to continue that counts.', author: 'Winston Churchill' },
    { text: 'The secret of getting ahead is getting started.', author: 'Mark Twain' },
    { text: 'It does not matter how slowly you go as long as you do not stop.', author: 'Confucius' },
    { text: 'Our greatest weakness lies in giving up. The most certain way to succeed is always to try just one more time.', author: 'Thomas Edison' },
    { text: 'You don\'t have to be great to start, but you have to start to be great.', author: 'Zig Ziglar' },
    { text: 'Believe you can and you\'re halfway there.', author: 'Theodore Roosevelt' },
    { text: 'Hard work beats talent when talent doesn\'t work hard.', author: 'Tim Notke' },
    { text: 'Education is the passport to the future.', author: 'Malcolm X' },
    { text: 'The beautiful thing about learning is that no one can take it away from you.', author: 'B.B. King' },
    { text: 'Dream big. Work hard. Stay focused.', author: 'Unknown' },
];

// ─── localStorage helpers ─────────────────────────────────────────────────────

const getLS = <T>(key: string, def: T): T => {
    if (typeof window === 'undefined') return def;
    try {
        const v = localStorage.getItem(key);
        return v ? (JSON.parse(v) as T) : def;
    } catch { return def; }
};

const setLS = <T>(key: string, val: T) => {
    if (typeof window === 'undefined') return;
    try { localStorage.setItem(key, JSON.stringify(val)); } catch { /* quota */ }
};

// ─── Student data API ─────────────────────────────────────────────────────────

export const studentDB = {
    // Exam scores
    getScores: (): ExamScore[] =>
        getLS<ExamScore[]>('sp_scores', [
            { id: 's1', examName: 'Unit Test 1', subject: 'Physics', score: 72, maxScore: 100, date: '2026-03-10' },
            { id: 's2', examName: 'Unit Test 1', subject: 'Chemistry', score: 65, maxScore: 100, date: '2026-03-11' },
            { id: 's3', examName: 'Unit Test 1', subject: 'Mathematics', score: 80, maxScore: 100, date: '2026-03-12' },
            { id: 's4', examName: 'Mock Test 1', subject: 'Physics', score: 78, maxScore: 100, date: '2026-04-05' },
            { id: 's5', examName: 'Mock Test 1', subject: 'Chemistry', score: 70, maxScore: 100, date: '2026-04-06' },
            { id: 's6', examName: 'Mock Test 1', subject: 'Mathematics', score: 85, maxScore: 100, date: '2026-04-07' },
            { id: 's7', examName: 'Mock Test 2', subject: 'Physics', score: 82, maxScore: 100, date: '2026-05-01' },
            { id: 's8', examName: 'Mock Test 2', subject: 'Chemistry', score: 75, maxScore: 100, date: '2026-05-02' },
            { id: 's9', examName: 'Mock Test 2', subject: 'Mathematics', score: 90, maxScore: 100, date: '2026-05-03' },
        ]),

    addScore: (score: Omit<ExamScore, 'id'>): ExamScore => {
        const scores = studentDB.getScores();
        const ns = { ...score, id: `s-${Date.now()}` };
        setLS('sp_scores', [...scores, ns]);
        return ns;
    },

    deleteScore: (id: string) => {
        setLS('sp_scores', studentDB.getScores().filter(s => s.id !== id));
    },

    // Quiz attempts
    getAttempts: (): QuizAttempt[] => getLS<QuizAttempt[]>('sp_attempts', []),

    addAttempt: (a: Omit<QuizAttempt, 'id'>): QuizAttempt => {
        const attempts = studentDB.getAttempts();
        const na = { ...a, id: `qa-${Date.now()}` };
        setLS('sp_attempts', [...attempts, na]);
        return na;
    },

    // Notes
    getNotes: (): Note[] => getLS<Note[]>('sp_notes', []),

    addNote: (note: Omit<Note, 'id'>): Note => {
        const notes = studentDB.getNotes();
        const nn = { ...note, id: `n-${Date.now()}` };
        setLS('sp_notes', [...notes, nn]);
        return nn;
    },

    deleteNote: (id: string) => {
        setLS('sp_notes', studentDB.getNotes().filter(n => n.id !== id));
    },

    // Calendar
    getCalendarNotes: (): CalendarNote[] =>
        getLS<CalendarNote[]>('sp_calendar', PRESET_EXAM_DATES),

    addCalendarNote: (note: Omit<CalendarNote, 'id'>): CalendarNote => {
        const notes = studentDB.getCalendarNotes();
        const nn = { ...note, id: `cal-${Date.now()}` };
        setLS('sp_calendar', [...notes, nn]);
        return nn;
    },

    deleteCalendarNote: (id: string) => {
        setLS('sp_calendar', studentDB.getCalendarNotes().filter(n => n.id !== id));
    },
};
