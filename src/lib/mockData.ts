'use client';

// Kannada Seva High-Fidelity Reactive Mock Database Layer
// Persists fully interactive changes in localStorage to simulate database transactions.

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  role: 'school_admin' | 'dept_officer' | 'ngo_viewer';
  district?: string;
  taluk?: string;
}

export interface School {
  id: string;
  name_en: string;
  name_kn: string;
  district: string;
  taluk: string;
  total_students: number;
  at_risk_students: number;
  enrolment_decline_rate: number; // e.g. 4.2%
  risk_score: number; // 0-100
  primary_medium: 'kannada' | 'english' | 'both';
}

export interface Student {
  id: string;
  school_id: string;
  school_name_en: string;
  school_name_kn: string;
  name_en: string;
  name_kn: string;
  grade: number;
  attendance_rate: number;
  kannada_proficiency: number; // percentage
  english_proficiency: number; // percentage
  risk_level: 'High' | 'Medium' | 'Low';
  risk_score: number; // 0-100
  risk_reasons: string[]; // key ids from translation
}

export interface Intervention {
  id: string;
  school_id: string;
  school_name_en: string;
  school_name_kn: string;
  student_id?: string;
  student_name_en?: string;
  student_name_kn?: string;
  title_en: string;
  title_kn: string;
  description_en: string;
  description_kn: string;
  category: 'bilingual' | 'attendance' | 'kits' | 'transport';
  status: 'pending' | 'in_progress' | 'completed';
  assigned_to_name: string;
  target_date: string;
  created_at: string;
}

export interface EnrolmentTrend {
  year: number;
  kannada: number;
  english: number;
}

export interface NotificationItem {
  id: string;
  title_en: string;
  title_kn: string;
  desc_en: string;
  desc_kn: string;
  time: string;
  read: boolean;
  type: 'danger' | 'warning' | 'success' | 'info';
}

// ----------------------------------------------------
// DEFAULT PRELOADED MOCK DATA
// ----------------------------------------------------

const defaultUserProfile: UserProfile = {
  id: 'user-default-officer',
  email: 'officer.edu@karnataka.gov.in',
  name: 'Dr. Ramesh Rao',
  role: 'dept_officer',
  district: 'Dakshina Kannada',
};

const defaultSchools: School[] = [
  { id: 'sch-1', name_en: 'GHPS Mangaluru Port', name_kn: 'ಸರ್ಕಾರಿ ಹಿರಿಯ ಪ್ರಾಥಮಿಕ ಶಾಲೆ ಮಂಗಳೂರು ಬಂದರು', district: 'Dakshina Kannada', taluk: 'Mangaluru', total_students: 124, at_risk_students: 18, enrolment_decline_rate: 6.4, risk_score: 72, primary_medium: 'kannada' },
  { id: 'sch-2', name_en: 'GHS Puttur Town', name_kn: 'ಸರ್ಕಾರಿ ಪ್ರೌಢಶಾಲೆ ಪುತ್ತೂರು', district: 'Dakshina Kannada', taluk: 'Puttur', total_students: 198, at_risk_students: 14, enrolment_decline_rate: 3.2, risk_score: 48, primary_medium: 'kannada' },
  { id: 'sch-3', name_en: 'GHPS Bantwal Rural', name_kn: 'ಸರ್ಕಾರಿ ಹಿರಿಯ ಪ್ರಾಥಮಿಕ ಶಾಲೆ ಬಂಟ್ವಾಳ ಗ್ರಾಮೀಣ', district: 'Dakshina Kannada', taluk: 'Bantwal', total_students: 85, at_risk_students: 19, enrolment_decline_rate: 9.1, risk_score: 84, primary_medium: 'kannada' },
  { id: 'sch-4', name_en: 'GHS Udupi Balayoni', name_kn: 'ಸರ್ಕಾರಿ ಪ್ರೌಢಶಾಲೆ ಉಡುಪಿ ಬಲಯೋನಿ', district: 'Udupi', taluk: 'Udupi', total_students: 210, at_risk_students: 11, enrolment_decline_rate: 2.1, risk_score: 35, primary_medium: 'kannada' },
  { id: 'sch-5', name_en: 'GHPS Kundapura Beach', name_kn: 'ಸರ್ಕಾರಿ ಹಿರಿಯ ಪ್ರಾಥಮಿಕ ಶಾಲೆ ಕುಂದಾಪುರ ಕಡಲತೀರ', district: 'Udupi', taluk: 'Kundapura', total_students: 92, at_risk_students: 15, enrolment_decline_rate: 5.5, risk_score: 64, primary_medium: 'kannada' },
  { id: 'sch-6', name_en: 'GHPS Mysore Palace Boundary', name_kn: 'ಸರ್ಕಾರಿ ಹಿರಿಯ ಪ್ರಾಥಮಿಕ ಶಾಲೆ ಮೈಸೂರು ಅರಮನೆ ಆವರಣ', district: 'Mysore', taluk: 'Mysore', total_students: 156, at_risk_students: 22, enrolment_decline_rate: 7.8, risk_score: 76, primary_medium: 'kannada' },
  { id: 'sch-7', name_en: 'GHS Nanjangud Temple Side', name_kn: 'ಸರ್ಕಾರಿ ಪ್ರೌಢಶಾಲೆ ನಂಜನಗೂಡು', district: 'Mysore', taluk: 'Nanjangud', total_students: 245, at_risk_students: 15, enrolment_decline_rate: 1.8, risk_score: 40, primary_medium: 'both' },
  { id: 'sch-8', name_en: 'GHPS Hunsur Forest Edge', name_kn: 'ಸರ್ಕಾರಿ ಹಿರಿಯ ಪ್ರಾಥಮಿಕ ಶಾಲೆ ಹುಣಸೂರು', district: 'Mysore', taluk: 'Hunsur', total_students: 73, at_risk_students: 20, enrolment_decline_rate: 11.2, risk_score: 91, primary_medium: 'kannada' },
  { id: 'sch-9', name_en: 'GHS Tumkur Cyber City', name_kn: 'ಸರ್ಕಾರಿ ಪ್ರೌಢಶಾಲೆ ತುಮಕೂರು', district: 'Tumkur', taluk: 'Tumkur', total_students: 180, at_risk_students: 16, enrolment_decline_rate: 4.1, risk_score: 52, primary_medium: 'both' },
  { id: 'sch-10', name_en: 'GHPS Madhugiri Rock Side', name_kn: 'ಸರ್ಕಾರಿ ಹಿರಿಯ ಪ್ರಾಥಮಿಕ ಶಾಲೆ ಮಧುಗಿರಿ', district: 'Tumkur', taluk: 'Madhugiri', total_students: 110, at_risk_students: 17, enrolment_decline_rate: 5.9, risk_score: 69, primary_medium: 'kannada' },
  { id: 'sch-11', name_en: 'GHPS Bangalore South Grid', name_kn: 'ಸರ್ಕಾರಿ ಹಿರಿಯ ಪ್ರಾಥಮಿಕ ಶಾಲೆ ಬೆಂಗಳೂರು ದಕ್ಷಿಣ', district: 'Bangalore Urban', taluk: 'Bangalore South', total_students: 310, at_risk_students: 35, enrolment_decline_rate: 8.5, risk_score: 79, primary_medium: 'kannada' },
  { id: 'sch-12', name_en: 'GHS Yelahanka Aero', name_kn: 'ಸರ್ಕಾರಿ ಪ್ರೌಢಶಾಲೆ ಯಲಹಂಕ', district: 'Bangalore Urban', taluk: 'Yelahanka', total_students: 240, at_risk_students: 10, enrolment_decline_rate: 1.1, risk_score: 30, primary_medium: 'both' },
  { id: 'sch-13', name_en: 'GHPS Belagavi Cantonment', name_kn: 'ಸರ್ಕಾರಿ ಹಿರಿಯ ಪ್ರಾಥಮಿಕ ಶಾಲೆ ಬೆಳಗಾವಿ ಕ್ಯಾಂಟೋನ್ಮೆಂಟ್', district: 'Belagavi', taluk: 'Belagavi', total_students: 145, at_risk_students: 12, enrolment_decline_rate: 3.5, risk_score: 44, primary_medium: 'kannada' },
  { id: 'sch-14', name_en: 'GHPS Gokak Falls', name_kn: 'ಸರ್ಕಾರಿ ಹಿರಿಯ ಪ್ರಾಥಮಿಕ ಶಾಲೆ ಗೋಕಾಕ್ ಜಲಪಾತ', district: 'Belagavi', taluk: 'Gokak', total_students: 98, at_risk_students: 16, enrolment_decline_rate: 7.2, risk_score: 74, primary_medium: 'kannada' },
  { id: 'sch-15', name_en: 'GHS Chikoadi Center', name_kn: 'ಸರ್ಕಾರಿ ಪ್ರೌಢಶಾಲೆ ಚಿಕ್ಕೋಡಿ', district: 'Belagavi', taluk: 'Chikodi', total_students: 176, at_risk_students: 8, enrolment_decline_rate: 2.5, risk_score: 38, primary_medium: 'kannada' },
  { id: 'sch-16', name_en: 'GHPS Shimoga River view', name_kn: 'ಸರ್ಕಾರಿ ಹಿರಿಯ ಪ್ರಾಥಮಿಕ ಶಾಲೆ ಶಿವಮೊಗ್ಗ', district: 'Shimoga', taluk: 'Shimoga', total_students: 135, at_risk_students: 14, enrolment_decline_rate: 4.8, risk_score: 56, primary_medium: 'kannada' },
  { id: 'sch-17', name_en: 'GHS Sagar Green hills', name_kn: 'ಸರ್ಕಾರಿ ಪ್ರೌಢಶಾಲೆ ಸಾಗರ', district: 'Shimoga', taluk: 'Sagar', total_students: 112, at_risk_students: 12, enrolment_decline_rate: 4.2, risk_score: 50, primary_medium: 'kannada' },
  { id: 'sch-18', name_en: 'GHPS Chamarajanagar Hill', name_kn: 'ಸರ್ಕಾರಿ ಹಿರಿಯ ಪ್ರಾಥಮಿಕ ಶಾಲೆ ಚಾಮರಾಜನಗರ', district: 'Chamarajanagar', taluk: 'Chamarajanagar', total_students: 65, at_risk_students: 18, enrolment_decline_rate: 12.5, risk_score: 93, primary_medium: 'kannada' },
  { id: 'sch-19', name_en: 'GHS Kollegal border', name_kn: 'ಸರ್ಕಾರಿ ಪ್ರೌಢಶಾಲೆ ಕೊಳ್ಳೇಗಾಲ', district: 'Chamarajanagar', taluk: 'Kollegal', total_students: 128, at_risk_students: 13, enrolment_decline_rate: 4.5, risk_score: 54, primary_medium: 'kannada' },
  { id: 'sch-20', name_en: 'GHPS Sullia Forest Road', name_kn: 'ಸರ್ಕಾರಿ ಹಿರಿಯ ಪ್ರಾಥಮಿಕ ಶಾಲೆ ಸುಳ್ಯ', district: 'Dakshina Kannada', taluk: 'Sullia', total_students: 79, at_risk_students: 14, enrolment_decline_rate: 6.8, risk_score: 70, primary_medium: 'kannada' }
];

const studentNames = [
  { en: 'Abhishek Gowda', kn: 'ಅಭಿಷೇಕ್ ಗೌಡ' },
  { en: 'Chethan Kumar', kn: 'ಚೇತನ್ ಕುಮಾರ್' },
  { en: 'Divya M', kn: 'ದಿವ್ಯಾ ಎಂ' },
  { en: 'Ganesh Hegde', kn: 'ಗಣೇಶ್ ಹೆಗಡೆ' },
  { en: 'Kavya Murthy', kn: 'ಕಾವ್ಯಾ ಮೂರ್ತಿ' },
  { en: 'Latha Shastri', kn: 'ಲತಾ ಶಾಸ್ತ್ರಿ' },
  { en: 'Manjunatha B', kn: 'ಮಂಜುನಾಥ ಬಿ' },
  { en: 'Nikhitha Rao', kn: 'ನಿಖಿತಾ ರಾವ್' },
  { en: 'Prajwal D', kn: 'ಪ್ರಜ್ವಲ್ ಡಿ' },
  { en: 'Priyanka K', kn: 'ಪ್ರಿಯಾಂಕಾ ಕೆ' },
  { en: 'Ramya N', kn: 'ರಮ್ಯಾ ಎನ್' },
  { en: 'Sandesh Naik', kn: 'ಸಂದೇಶ್ ನಾಯಕ್' },
  { en: 'Shwetha Bhat', kn: 'ಶ್ವೇತಾ ಭಟ್' },
  { en: 'Varun S', kn: 'ವರುಣ್ ಎಸ್' },
  { en: 'Yashaswini G', kn: 'ಯಶಸ್ವಿನಿ ಜಿ' }
];

const mockReasons = ['distance', 'attendance', 'language', 'family'];

const generateMockStudents = (schools: School[]): Student[] => {
  const list: Student[] = [];
  let idCounter = 1;

  schools.forEach((sch) => {
    // Generate 5 key students for each school
    for (let i = 0; i < 5; i++) {
      const isHighRisk = i === 0 && sch.risk_score > 60;
      const isMedRisk = (i === 1 && sch.risk_score > 50) || (i === 2 && sch.risk_score > 70);

      let attRate = 90 + Math.random() * 8;
      let kanComp = 75 + Math.random() * 20;
      let engComp = 60 + Math.random() * 30;
      let riskScore = 15 + Math.random() * 25;
      let riskLevel: 'High' | 'Medium' | 'Low' = 'Low';
      const reasons: string[] = [];

      if (isHighRisk) {
        attRate = 60 + Math.random() * 15;
        kanComp = 35 + Math.random() * 20;
        engComp = 30 + Math.random() * 20;
        riskScore = 75 + Math.random() * 20;
        riskLevel = 'High';
        reasons.push(mockReasons[1]); // attendance
        reasons.push(mockReasons[2]); // language difficulty
        if (Math.random() > 0.5) reasons.push(mockReasons[0]); // distance
      } else if (isMedRisk) {
        attRate = 75 + Math.random() * 12;
        kanComp = 50 + Math.random() * 20;
        engComp = 45 + Math.random() * 25;
        riskScore = 45 + Math.random() * 25;
        riskLevel = 'Medium';
        reasons.push(mockReasons[2]); // language
        if (Math.random() > 0.5) reasons.push(mockReasons[3]); // family
      }

      const nameObj = studentNames[(idCounter - 1) % studentNames.length];
      const name_en = `${nameObj.en} (${sch.taluk})`;
      const name_kn = `${nameObj.kn} (${sch.name_kn.slice(-4)})`;

      list.push({
        id: `std-${idCounter++}`,
        school_id: sch.id,
        school_name_en: sch.name_en,
        school_name_kn: sch.name_kn,
        name_en,
        name_kn,
        grade: 4 + ((idCounter) % 4), // grades 4-8
        attendance_rate: parseFloat(attRate.toFixed(1)),
        kannada_proficiency: parseFloat(kanComp.toFixed(1)),
        english_proficiency: parseFloat(engComp.toFixed(1)),
        risk_level: riskLevel,
        risk_score: parseFloat(riskScore.toFixed(1)),
        risk_reasons: reasons,
      });
    }
  });

  return list;
};

const defaultEnrolmentTrends: EnrolmentTrend[] = [
  { year: 2022, kannada: 14200, english: 8200 },
  { year: 2023, kannada: 13100, english: 9500 },
  { year: 2024, kannada: 12200, english: 10900 },
  { year: 2025, kannada: 11400, english: 12500 },
  { year: 2026, kannada: 10800, english: 13900 },
];

const defaultInterventions: Intervention[] = [
  {
    id: 'int-1',
    school_id: 'sch-3',
    school_name_en: 'GHPS Bantwal Rural',
    school_name_kn: 'ಸರ್ಕಾರಿ ಹಿರಿಯ ಪ್ರಾಥಮಿಕ ಶಾಲೆ ಬಂಟ್ವಾಳ ಗ್ರಾಮೀಣ',
    student_id: 'std-11',
    student_name_en: 'Abhishek Gowda (Bantwal)',
    student_name_kn: 'ಅಭಿಷೇಕ್ ಗೌಡ (ಮೀಣ)',
    title_en: 'Absenteeism Intervention Campaign',
    title_kn: 'ಹಾಜರಾತಿ ಸುಧಾರಣಾ ಜಾಗೃತಿ ಅಭಿಯಾನ',
    description_en: 'Conduct a home visit to verify student commute and engage guardians on daily attendance importance.',
    description_kn: 'ಮನೆ ಭೇಟಿ ನೀಡಿ ಪೋಷಕರೊಂದಿಗೆ ಚರ್ಚಿಸಿ ವಿದ್ಯಾರ್ಥಿಯ ದೈನಂದಿನ ಗೈರುಹಾಜರಿ ನಿವಾರಿಸಲು ಕ್ರಮ ಕೈಗೊಳ್ಳುವುದು.',
    category: 'attendance',
    status: 'in_progress',
    assigned_to_name: 'Dr. Ramesh Rao',
    target_date: '2026-06-15',
    created_at: '2026-05-18T10:00:00Z',
  },
  {
    id: 'int-2',
    school_id: 'sch-8',
    school_name_en: 'GHPS Hunsur Forest Edge',
    school_name_kn: 'ಸರ್ಕಾರಿ ಹಿರಿಯ ಪ್ರಾಥಮಿಕ ಶಾಲೆ ಹುಣಸೂರು',
    title_en: 'Bilingual Bridge Materials Distribution',
    title_kn: 'ದ್ವಿಭಾಷಾ ಸೇತುವೆ ಕಲಿಕಾ ಸಾಮಗ್ರಿ ವಿತರಣೆ',
    description_en: 'Ship 40 copies of language bridging workbooks mapping Kannada letters to English phonetics.',
    description_kn: 'ಕನ್ನಡ ಅಕ್ಷರಗಳನ್ನು ಇಂಗ್ಲಿಷ್ ಉಚ್ಚಾರಣೆಗೆ ಹೋಲಿಸುವ ೪೦ ದ್ವಿಭಾಷಾ ಸೇತುವೆ ಪುಸ್ತಕಗಳನ್ನು ವಿತರಿಸುವುದು.',
    category: 'bilingual',
    status: 'pending',
    assigned_to_name: 'Dr. Ramesh Rao',
    target_date: '2026-06-30',
    created_at: '2026-05-19T08:30:00Z',
  },
  {
    id: 'int-3',
    school_id: 'sch-18',
    school_name_en: 'GHPS Chamarajanagar Hill',
    school_name_kn: 'ಸರ್ಕಾರಿ ಹಿರಿಯ ಪ್ರಾಥಮಿಕ ಶಾಲೆ ಚಾಮರಾಜನಗರ',
    title_en: 'Daily Commute Transport Subsidy',
    title_kn: 'ಪ್ರಯಾಣ ಭತ್ಯೆ ಮತ್ತು ಉಚಿತ ಸಾರಿಗೆ ಸೌಲಭ್ಯ',
    description_en: 'Partner with local auto services to resolve the 6.2km deep forest commuting barrier for 12 students.',
    description_kn: 'ಕಾಡಿನ ಅಂಚಿನಲ್ಲಿ ವಾಸಿಸುವ ೧೨ ವಿದ್ಯಾರ್ಥಿಗಳಿಗೆ ಆಟೋ ಸಾರಿಗೆ ಸಂಪರ್ಕ ಒದಗಿಸಿ ಶಾಲಾ ಹಾದಿ ಸುಲಭಗೊಳಿಸುವುದು.',
    category: 'transport',
    status: 'completed',
    assigned_to_name: 'Suresh Gowda',
    target_date: '2026-05-10',
    created_at: '2026-04-10T09:00:00Z',
  }
];

const defaultNotifications: NotificationItem[] = [
  {
    id: 'nt-1',
    title_en: 'Critical Dropout Alert',
    title_kn: 'ದಾಖಲಾತಿ ತುರ್ತು ಎಚ್ಚರಿಕೆ',
    desc_en: 'GHPS Hunsur Forest Edge enrolment decline rate hit 11.2%! Triggering predictive audit.',
    desc_kn: 'ಹುಣಸೂರು ಸರ್ಕಾರಿ ಶಾಲೆಯ ದಾಖಲಾತಿ ಕುಸಿತ ದರ 11.2% ತಲುಪಿದೆ! ಪರಿಶೀಲನೆ ಅಗತ್ಯವಿದೆ.',
    time: '3 hours ago',
    read: false,
    type: 'danger',
  },
  {
    id: 'nt-2',
    title_en: 'Intervention Successfully Resolved',
    title_kn: 'ಸುಧಾರಣಾ ಕ್ರಮ ಯಶಸ್ವಿಯಾಗಿದೆ',
    desc_en: 'Chamarajanagar transport subsidy campaign resolved. 12 students returned to regular classes.',
    desc_kn: 'ಚಾಮರಾಜನಗರ ಸಾರಿಗೆ ಸಹಾಯ ಅಭಿಯಾನ ಯಶಸ್ವಿಯಾಗಿದೆ. ೧೨ ವಿದ್ಯಾರ್ಥಿಗಳು ಶಾಲೆಗೆ ವಾಪಸ್ಸಾಗಿದ್ದಾರೆ.',
    time: '1 day ago',
    read: true,
    type: 'success',
  },
  {
    id: 'nt-3',
    title_en: 'New System Policy Updates',
    title_kn: 'ಇಲಾಖೆಯ ನೂತನ ನವೀಕರಣ',
    desc_en: 'BEO reports deadline extended to June 30th. Check report builder for guidelines.',
    desc_kn: 'ಬಿ.ಇ.ಒ ವರದಿಗಳ ಗಡುವನ್ನು ಜೂನ್ ೩೦ ರವರೆಗೆ ವಿಸ್ತರಿಸಲಾಗಿದೆ. ಹೆಚ್ಚಿನ ಮಾಹಿತಿಗೆ ವರದಿಗಳ ಫಲಕ ನೋಡಿ.',
    time: '2 days ago',
    read: true,
    type: 'info',
  }
];

// ----------------------------------------------------
// STORAGE HELPER METHODS
// ----------------------------------------------------

const getStorageItem = <T>(key: string, defaultValue: T): T => {
  if (typeof window === 'undefined') return defaultValue;
  try {
    const val = localStorage.getItem(key);
    if (!val) {
      localStorage.setItem(key, JSON.stringify(defaultValue));
      return defaultValue;
    }
    return JSON.parse(val);
  } catch (e) {
    return defaultValue;
  }
};

const setStorageItem = <T>(key: string, value: T): void => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error('Local Storage Save Error', e);
  }
};

// Initialize Mock Database in Client Storage
export const initializeMockDB = () => {
  if (typeof window === 'undefined') return;
  
  if (!localStorage.getItem('ks_user_profile')) {
    setStorageItem('ks_user_profile', defaultUserProfile);
  }
  if (!localStorage.getItem('ks_schools')) {
    setStorageItem('ks_schools', defaultSchools);
  }
  if (!localStorage.getItem('ks_students')) {
    const mockStudents = generateMockStudents(defaultSchools);
    setStorageItem('ks_students', mockStudents);
  }
  if (!localStorage.getItem('ks_interventions')) {
    setStorageItem('ks_interventions', defaultInterventions);
  }
  if (!localStorage.getItem('ks_notifications')) {
    setStorageItem('ks_notifications', defaultNotifications);
  }
  if (!localStorage.getItem('ks_enrolment_trends')) {
    setStorageItem('ks_enrolment_trends', defaultEnrolmentTrends);
  }
};

// ----------------------------------------------------
// DATABASE API ACTIONS (CRUD)
// ----------------------------------------------------

export const mockDB = {
  // Profiles
  getUserProfile: (): UserProfile => {
    initializeMockDB();
    return getStorageItem('ks_user_profile', defaultUserProfile);
  },
  
  setUserProfile: (profile: UserProfile): void => {
    setStorageItem('ks_user_profile', profile);
  },

  // Schools
  getSchools: (): School[] => {
    initializeMockDB();
    return getStorageItem('ks_schools', defaultSchools);
  },

  addSchool: (school: Omit<School, 'id' | 'risk_score' | 'total_students' | 'at_risk_students'>): School => {
    const schools = mockDB.getSchools();
    const newSchool: School = {
      ...school,
      id: `sch-${Date.now()}`,
      risk_score: parseFloat((30 + Math.random() * 45).toFixed(1)),
      total_students: 50 + Math.floor(Math.random() * 150),
      at_risk_students: Math.floor(Math.random() * 20)
    };
    schools.push(newSchool);
    setStorageItem('ks_schools', schools);

    // Automatically generate 5 students for the new school
    const students = mockDB.getStudents();
    const generated = generateMockStudents([newSchool]);
    students.push(...generated);
    setStorageItem('ks_students', students);

    return newSchool;
  },

  // Students
  getStudents: (): Student[] => {
    initializeMockDB();
    return getStorageItem('ks_students', []);
  },

  updateStudentScores: (studentId: string, attendance: number, kannada: number, english: number): Student | null => {
    const students = mockDB.getStudents();
    const idx = students.findIndex((s) => s.id === studentId);
    if (idx === -1) return null;

    // Recalculate Risk Score
    const attRisk = (100 - attendance) * 4; // up to 40 points
    const langRisk = ((100 - kannada) * 0.4) + ((100 - english) * 0.2); // up to 60 points
    const riskScore = parseFloat(Math.min(99, Math.max(5, attRisk + langRisk)).toFixed(1));
    const riskLevel = riskScore > 70 ? 'High' : riskScore > 40 ? 'Medium' : 'Low';
    
    const reasons: string[] = [];
    if (attendance < 85) reasons.push('attendance');
    if (kannada < 60) reasons.push('language');

    students[idx] = {
      ...students[idx],
      attendance_rate: attendance,
      kannada_proficiency: kannada,
      english_proficiency: english,
      risk_score: riskScore,
      risk_level: riskLevel,
      risk_reasons: reasons
    };

    setStorageItem('ks_students', students);

    // Update School Total Risk count
    const schoolId = students[idx].school_id;
    const schoolStudents = students.filter(s => s.school_id === schoolId);
    const atRiskCount = schoolStudents.filter(s => s.risk_level === 'High' || s.risk_level === 'Medium').length;
    const schools = mockDB.getSchools();
    const sIdx = schools.findIndex(s => s.id === schoolId);
    if (sIdx !== -1) {
      schools[sIdx].at_risk_students = atRiskCount;
      const scoresSum = schoolStudents.reduce((sum, s) => sum + s.risk_score, 0);
      schools[sIdx].risk_score = parseFloat((scoresSum / schoolStudents.length).toFixed(1));
      setStorageItem('ks_schools', schools);
    }

    return students[idx];
  },

  // Interventions
  getInterventions: (): Intervention[] => {
    initializeMockDB();
    return getStorageItem('ks_interventions', defaultInterventions);
  },

  addIntervention: (interv: Omit<Intervention, 'id' | 'created_at'>): Intervention => {
    const list = mockDB.getInterventions();
    const newInterv: Intervention = {
      ...interv,
      id: `int-${Date.now()}`,
      created_at: new Date().toISOString()
    };
    list.push(newInterv);
    setStorageItem('ks_interventions', list);
    return newInterv;
  },

  updateInterventionStatus: (id: string, status: 'pending' | 'in_progress' | 'completed'): Intervention | null => {
    const list = mockDB.getInterventions();
    const idx = list.findIndex(i => i.id === id);
    if (idx === -1) return null;

    list[idx].status = status;
    setStorageItem('ks_interventions', list);

    // Send visual notification if marked completed!
    if (status === 'completed') {
      const notifs = mockDB.getNotifications();
      notifs.unshift({
        id: `nt-${Date.now()}`,
        title_en: 'Intervention Campaign Completed',
        title_kn: 'ಸುಧಾರಣಾ ಕ್ರಮ ಯಶಸ್ವಿಯಾಗಿ ಮುಕ್ತಾಯಗೊಂಡಿದೆ',
        desc_en: `"${list[idx].title_en}" marked as resolved at ${list[idx].school_name_en}.`,
        desc_kn: `"${list[idx].title_kn}" ಶಾಲಾ ಅಭಿಯಾನವನ್ನು ಯಶಸ್ವಿಯಾಗಿ ಮುಕ್ತಾಯಗೊಳಿಸಲಾಗಿದೆ.`,
        time: 'Just now',
        read: false,
        type: 'success'
      });
      setStorageItem('ks_notifications', notifs);
    }

    return list[idx];
  },

  // Notifications
  getNotifications: (): NotificationItem[] => {
    initializeMockDB();
    return getStorageItem('ks_notifications', defaultNotifications);
  },

  markNotificationsRead: (): void => {
    const list = mockDB.getNotifications();
    const updated = list.map(n => ({ ...n, read: true }));
    setStorageItem('ks_notifications', updated);
  },

  // Trends
  getEnrolmentTrends: (): EnrolmentTrend[] => {
    initializeMockDB();
    return getStorageItem('ks_enrolment_trends', defaultEnrolmentTrends);
  },

  uploadCSVData: (csvText: string): boolean => {
    // Basic CSV parser simulating batch school uploader
    try {
      const schools = mockDB.getSchools();
      const rows = csvText.split('\n').filter(r => r.trim().length > 0);
      
      // Expected: school_name, district, taluk, total, decline_rate, primary_medium
      // Skip header if matches text
      let successCount = 0;
      rows.forEach((row, i) => {
        if (i === 0 && row.toLowerCase().includes('name')) return;
        
        const cols = row.split(',').map(c => c.trim().replace(/^"|"$/g, ''));
        if (cols.length >= 5) {
          const name = cols[0];
          const dist = cols[1];
          const taluk = cols[2];
          const total = parseInt(cols[3]) || 100;
          const decline = parseFloat(cols[4]) || 4.5;
          const medium = (cols[5] as 'kannada' | 'english') || 'kannada';

          mockDB.addSchool({
            name_en: name,
            name_kn: `ಸರ್ಕಾರಿ ಶಾಲೆ ${name}`,
            district: dist,
            taluk: taluk,
            enrolment_decline_rate: decline,
            primary_medium: medium
          });
          successCount++;
        }
      });

      if (successCount > 0) {
        // Send a success notification
        const notifs = mockDB.getNotifications();
        notifs.unshift({
          id: `nt-${Date.now()}`,
          title_en: 'CSV Data Sync Completed',
          title_kn: 'ದತ್ತಾಂಶ ನವೀಕರಣ ಯಶಸ್ವಿಯಾಗಿದೆ',
          desc_en: `Uploaded CSV file parsed. Successfully synced ${successCount} government schools.`,
          desc_kn: `ಅಪ್ಲೋಡ್ ಮಾಡಲಾದ CSV ಇಂದ ${successCount} ಶಾಲೆಗಳ ಮಾಹಿತಿಯನ್ನು ನವೀಕರಿಸಲಾಗಿದೆ.`,
          time: 'Just now',
          read: false,
          type: 'success'
        });
        setStorageItem('ks_notifications', notifs);
        return true;
      }
      return false;
    } catch (e) {
      console.error(e);
      return false;
    }
  }
};
