'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'en' | 'kn';

interface LanguageContextType {
  language: Language;
  toggleLanguage: () => void;
  t: (key: string) => string;
}

const translations: Record<Language, Record<string, string>> = {
  en: {
    // Brand
    'brand.name': 'Kannada Seva',
    'brand.tagline': 'AI-Powered Education Analytics & Interventions',

    // Nav & Sidebar
    'nav.dashboard': 'Dashboard',
    'nav.schools': 'Schools',
    'nav.analytics': 'Analytics',
    'nav.predictions': 'Early Warnings',
    'nav.interventions': 'Interventions',
    'nav.reports': 'Reports',
    'nav.profile': 'Profile Settings',
    'nav.logout': 'Sign Out',
    'nav.toggle_language': 'ಕನ್ನಡ',
    'nav.notifications': 'Notifications',
    'nav.search_placeholder': 'Search schools, students, interventions...',

    // Roles
    'role.school_admin': 'School Administrator',
    'role.dept_officer': 'Department Officer',
    'role.ngo_viewer': 'NGO Analyst',
    'role.logged_in_as': 'Logged in as',

    // Landing Page
    'landing.hero_title_glowing': 'Strengthening Kannada-Medium',
    'landing.hero_title_main': 'Government Schools',
    'landing.hero_subtitle': 'Empowering educators, administrators, and policy makers with AI-driven predictive insights to counter declining enrolment and elevate Kannada learning outcomes in Karnataka.',
    'landing.get_started': 'Access Platform',
    'landing.learn_more': 'Learn More',
    'landing.stat.schools': 'Schools Tracked',
    'landing.stat.enrolment': 'Enrolment Saved',
    'landing.stat.accuracy': 'Prediction Accuracy',
    'landing.stat.active_users': 'Active Officers',
    'landing.features_title': 'State-of-the-Art Solutions',
    'landing.feature.enrol_title': 'Enrolment Analytics',
    'landing.feature.enrol_desc': 'Identify taluk-level school dropouts and model future school-medium demographic transitions.',
    'landing.feature.warning_title': 'Early Warning System',
    'landing.feature.warning_desc': 'AI scoring models identify students showing early patterns of chronic absenteeism or linguistic gaps.',
    'landing.feature.interv_title': 'Targeted Action Cards',
    'landing.feature.interv_desc': 'Instantly deploy, track, and measure custom school intervention materials (e.g. Bilingual Bridge kits).',
    'landing.testimonial_title': 'Impact in the Field',
    'landing.testimonial.quote1': '"Kannada Seva helped us identify 14 high-risk dropouts in Dakshina Kannada. Within 3 months of assigning target transport interventions, 12 of them are attending regularly!"',
    'landing.testimonial.author1': 'Suresh Kumar - BEO, Mangaluru',
    'landing.testimonial.quote2': '"The English-Kannada bilingual learning gaps analysis gave us the data needed to distribute localized translation kits, increasing vocabulary retention by 42%."',
    'landing.testimonial.author2': 'Dr. Asha Gowda - NGO Lead',

    // Auth
    'auth.title': 'Secure Access Portal',
    'auth.email': 'Official Email Address',
    'auth.password': 'Password',
    'auth.sign_in': 'Sign In',
    'auth.sign_up': 'Create Account',
    'auth.no_account': "Don't have an account?",
    'auth.have_account': 'Already have an account?',
    'auth.role_select': 'Select Authority Role',
    'auth.demo_logins': 'Quick-Access Demo Credentials',
    'auth.demo_admin_desc': 'View intervention creation forms and student roster records.',
    'auth.demo_officer_desc': 'Full district access, interactive SVG maps, and taluk comparisons.',
    'auth.demo_ngo_desc': 'Read-only metrics, comprehensive analytics, and reports download.',

    // Dashboard
    'dash.total_schools': 'Monitored Schools',
    'dash.enrol_decline': 'Enrolment Trend',
    'dash.at_risk_students': 'At-Risk Students',
    'dash.districts_covered': 'Districts Monitored',
    'dash.enrol_trends_chart': 'Enrolment Trends (2022 - 2026)',
    'dash.kannada_medium': 'Kannada Medium',
    'dash.english_medium': 'English Medium',
    'dash.dropout_risk_taluk': 'Dropout Risk Index by Taluk',
    'dash.district_filter_title': 'Interactive Karnataka Map',
    'dash.district_filter_desc': 'Click on a district to filter the dashboard data.',
    'dash.selected_district': 'Selected District',
    'dash.all_districts': 'All Districts',
    'dash.at_risk_schools_table': 'High-Risk Schools Checklist',
    'dash.school_name': 'School Name',
    'dash.risk_score': 'Risk Index',
    'dash.action': 'Action',
    'dash.view_dossier': 'View Dossier',

    // Schools Page
    'school.title': 'Schools Directory',
    'school.add_school': 'Add New School',
    'school.search_placeholder': 'Search by school name, district, or taluk...',
    'school.district': 'District',
    'school.taluk': 'Taluk',
    'school.total_students': 'Total Enrolled',
    'school.at_risk': 'At-Risk count',
    'school.action.view': 'View Dossier',
    'school.medium': 'Primary Medium',
    'school.decline_rate': 'Annual Decline',
    'school.risk_index': 'Risk Score',
    'school.add.title': 'Register Government School',
    'school.add.name_en': 'School Name (English)',
    'school.add.name_kn': 'School Name (Kannada)',
    'school.add.medium': 'Medium of Instruction',
    'school.add.submit': 'Register School',
    'school.add.success': 'School registered successfully!',
    'school.details.title': 'Government School Dossier',
    'school.details.demographics': 'Student Demographics',
    'school.details.student_roster': 'Grade-wise Student Monitoring',
    'school.details.learning_gaps': 'Linguistic Gap Analysis',

    // Analytics
    'analytics.title': 'Learning Gaps & Analytics Hub',
    'analytics.subtitle': 'Investigate attendance patterns, grade breakdowns, and linguistic disparities.',
    'analytics.filter.district': 'Select District',
    'analytics.filter.taluk': 'Select Taluk',
    'analytics.filter.year': 'Select Year',
    'analytics.gaps_title': 'Linguistic Disparities (Kannada vs English Literacy)',
    'analytics.gaps_desc': 'Comparing reading and comprehension metrics in Kannada-medium schools compared to regional English benchmarks.',
    'analytics.attendance_title': 'Weekly Attendance Over Time (%)',
    'analytics.grade_perf_title': 'Average Proficiency Score by Grade',
    'analytics.kan_comp': 'Kannada Proficiency',
    'analytics.eng_comp': 'English Proficiency',
    'analytics.att_rate': 'Attendance Rate',

    // Risk Predictions
    'risk.title': 'AI Early Warning Alerts',
    'risk.subtitle': 'Machine learning models scoring student dropout probability based on 6 core risk factors.',
    'risk.student_name': 'Student Name',
    'risk.grade': 'Grade',
    'risk.attendance': 'Attendance',
    'risk.language_gap': 'Lang. Gap',
    'risk.risk_factor': 'Primary Trigger',
    'risk.action.assign': 'Assign Intervention',
    'risk.high': 'High Risk',
    'risk.medium': 'Medium Risk',
    'risk.low': 'Low Risk',
    'risk.reasons.distance': 'Long commute (>5km)',
    'risk.reasons.attendance': 'Chronic absenteeism (>15% absences)',
    'risk.reasons.language': 'Severe Kannada reading difficulty',
    'risk.reasons.family': 'Socio-economic household distress',
    'risk.bulk_title': 'AI Action Panel',
    'risk.bulk_description': 'Deploy targeted bilingual materials to all students with a language-based risk trigger.',
    'risk.bulk_btn': 'Auto-deploy Bilingual Kits',

    // Interventions
    'interv.title': 'Active Interventions Board',
    'interv.subtitle': 'Designate, monitor, and finalize language bridge campaigns and support systems.',
    'interv.create_btn': 'Design Intervention',
    'interv.col_pending': 'Assigned',
    'interv.col_progress': 'In Action',
    'interv.col_completed': 'Resolved',
    'interv.add.title': 'Design Targeted Intervention Campaign',
    'interv.add.title_en': 'Campaign Title (English)',
    'interv.add.title_kn': 'Campaign Title (Kannada)',
    'interv.add.desc_en': 'Action Plan (English)',
    'interv.add.desc_kn': 'Action Plan (Kannada)',
    'interv.add.school': 'Target School',
    'interv.add.type': 'Intervention Category',
    'interv.add.submit': 'Deploy Campaign',
    'interv.assignee': 'Officer',
    'interv.target': 'Target Date',
    'interv.cat.bilingual': 'Bilingual Bridge Materials',
    'interv.cat.attendance': 'Absentee Call Drive',
    'interv.cat.kits': 'Linguistic Lab Kits',
    'interv.cat.transport': 'Daily Commute Subsidy',

    // Reports Page
    'reports.title': 'Analytics Export & Reports',
    'reports.subtitle': 'Download legal compliance papers, local council slide decks, or batch upload student logs.',
    'reports.export_pdf': 'Download PDF Analytical Summary',
    'reports.export_csv': 'Export Metrics Spreadsheet (CSV)',
    'reports.upload_title': 'Batch Enrolment Uploader',
    'reports.upload_desc': 'Drag & drop an official school enrolment CSV, or click to upload.',
    'reports.upload_success': 'Successfully parsed and synchronised school logs!',
    'reports.preview_pdf': 'Official Executive Summary (Draft)',
    'reports.pdf_intro': 'This document provides a performance evaluation of Kannada-Medium state schools, including dropout models, taluk profiles, and intervention reports.',

    // Common Utilities
    'common.search': 'Search',
    'common.filter': 'Filter',
    'common.save': 'Save Changes',
    'common.cancel': 'Cancel',
    'common.confirm': 'Confirm',
    'common.success': 'Success',
    'common.error': 'Error',
    'common.loading': 'Compiling records...',
    'common.status': 'Status',
    'common.view': 'View Details',
    'common.no_records': 'No records found matching search queries.',
  },
  kn: {
    // Brand
    'brand.name': 'ಕನ್ನಡ ಸೇವಾ',
    'brand.tagline': 'ಕೃತಕ ಬುದ್ಧಿಮತ್ತೆ ಆಧಾರಿತ ಶಿಕ್ಷಣ ವಿಶ್ಲೇಷಣೆ ಮತ್ತು ಪರಿಹಾರಗಳು',

    // Nav & Sidebar
    'nav.dashboard': 'ವಿಶ್ಲೇಷಣಾ ಫಲಕ',
    'nav.schools': 'ಶಾಲೆಗಳ ಪಟ್ಟಿ',
    'nav.analytics': 'ವಿವರವಾದ ವಿಶ್ಲೇಷಣೆ',
    'nav.predictions': 'ಮುನ್ಸೂಚನೆಗಳು',
    'nav.interventions': 'ಸುಧಾರಣಾ ಕ್ರಮಗಳು',
    'nav.reports': 'ವರದಿಗಳು',
    'nav.profile': 'ಪ್ರೊಫೈಲ್ ಸೆಟ್ಟಿಂಗ್ಸ್',
    'nav.logout': 'ನಿರ್ಗಮಿಸಿ',
    'nav.toggle_language': 'English',
    'nav.notifications': 'ಸೂಚನೆಗಳು',
    'nav.search_placeholder': 'ಶಾಲೆಗಳು, ವಿದ್ಯಾರ್ಥಿಗಳು, ಸುಧಾರಣಾ ಕ್ರಮಗಳನ್ನು ಹುಡುಕಿ...',

    // Roles
    'role.school_admin': 'ಶಾಲಾ ಮುಖ್ಯಸ್ಥರು',
    'role.dept_officer': 'ಶಿಕ್ಷಣ ಇಲಾಖೆ ಅಧಿಕಾರಿ',
    'role.ngo_viewer': 'NGO ವಿಶ್ಲೇಷಕರು',
    'role.logged_in_as': 'ಲಾಗಿನ್ ಆಗಿರುವ ಬಳಕೆದಾರ',

    // Landing Page
    'landing.hero_title_glowing': 'ಕನ್ನಡ ಮಾಧ್ಯಮದ ಸರ್ಕಾರಿ',
    'landing.hero_title_main': 'ಶಾಲೆಗಳ ಸಬಲೀಕರಣ',
    'landing.hero_subtitle': 'ದಾಖಲಾತಿ ಕುಸಿತವನ್ನು ತಡೆಯಲು ಮತ್ತು ಗುಣಮಟ್ಟದ ಕನ್ನಡ ಕಲಿಕೆಯನ್ನು ಉತ್ತೇಜಿಸಲು ಶಿಕ್ಷಕರು, ಅಧಿಕಾರಿಗಳು ಮತ್ತು ಸ್ವಯಂಸೇವಾ ಸಂಸ್ಥೆಗಳಿಗೆ ಸಹಾಯ ಮಾಡುವ ಕೃತಕ ಬುದ್ಧಿಮತ್ತೆ ಆಧಾರಿತ ತಂತ್ರಾಂಶ.',
    'landing.get_started': 'ಪ್ರವೇಶಿಸಿ',
    'landing.learn_more': 'ಹೆಚ್ಚಿನ ಮಾಹಿತಿ',
    'landing.stat.schools': 'ಮೇಲ್ವಿಚಾರಣೆಯ ಶಾಲೆಗಳು',
    'landing.stat.enrolment': 'ಉಳಿಸಿದ ದಾಖಲಾತಿ',
    'landing.stat.accuracy': 'ನಿಖರತೆಯ ದರ',
    'landing.stat.active_users': 'ಕಾರ್ಯನಿರತ ಅಧಿಕಾರಿಗಳು',
    'landing.features_title': 'ನವೀನ ವೈಶಿಷ್ಟ್ಯಗಳು',
    'landing.feature.enrol_title': 'ದಾಖಲಾತಿ ವಿಶ್ಲೇಷಣೆ',
    'landing.feature.enrol_desc': 'ತಾಲ್ಲೂಕು ಮಟ್ಟದ ಶಾಲಾ ದಾಖಲಾತಿ ಕುಸಿತ ಮತ್ತು ವಿದ್ಯಾರ್ಥಿಗಳ ವಲಸೆ ಪ್ರವೃತ್ತಿಯನ್ನು ಗುರುತಿಸಿ.',
    'landing.feature.warning_title': 'ಮುನ್ನೆಚ್ಚರಿಕೆ ವ್ಯವಸ್ಥೆ',
    'landing.feature.warning_desc': 'ಗೈರುಹಾಜರಿ ಅಥವಾ ಭಾಷಾ ಕಲಿಕಾ ಅಂತರವನ್ನು ಹೊಂದಿರುವ ವಿದ್ಯಾರ್ಥಿಗಳನ್ನು AI ತಂತ್ರಜ್ಞಾನದಿಂದ ಗುರುತಿಸಿ.',
    'landing.feature.interv_title': 'ನಿರ್ದಿಷ್ಟ ಸುಧಾರಣಾ ಕ್ರಮಗಳು',
    'landing.feature.interv_desc': 'ದ್ವಿಭಾಷಾ ಕಲಿಕಾ ಪರಿಕರಗಳು ಮತ್ತು ಇತರ ಸಹಾಯಗಳನ್ನು ತಕ್ಷಣ ನಿಯೋಜಿಸಿ ಮತ್ತು ಮೇಲ್ವಿಚಾರಣೆ ಮಾಡಿ.',
    'landing.testimonial_title': 'ಕ್ಷೇತ್ರ ಮಟ್ಟದ ಬದಲಾವಣೆ',
    'landing.testimonial.quote1': '"ಕನ್ನಡ ಸೇವಾ ಮೂಲಕ ಮಂಗಳೂರಿನಲ್ಲಿ ಗೈರಾಗುತ್ತಿದ್ದ 14 ವಿದ್ಯಾರ್ಥಿಗಳನ್ನು ಗುರುತಿಸಿ ಉಚಿತ ಸಾರಿಗೆ ಸೌಲಭ್ಯ ಒದಗಿಸಿದ್ದೇವೆ. 3 ತಿಂಗಳಿನಲ್ಲಿ 12 ವಿದ್ಯಾರ್ಥಿಗಳು ಶಾಲೆಗೆ ಮರಳಿದ್ದಾರೆ!"',
    'landing.testimonial.author1': 'ಸುರೇಶ್ ಕುಮಾರ್ - ಬಿ.ಇ.ಒ, ಮಂಗಳೂರು',
    'landing.testimonial.quote2': '"ದ್ವಿಭಾಷಾ ಕಲಿಕಾ ಅಂತರ ವಿಶ್ಲೇಷಣೆಯಿಂದ ನಮಗೆ ಪ್ರಾದೇಶಿಕ ಭಾಷಾ ಪರಿಕರಗಳನ್ನು ವಿತರಿಸಲು ಸಾಧ್ಯವಾಯಿತು, ಇದರಿಂದ ವಿದ್ಯಾರ್ಥಿಗಳ ಕಲಿಕಾ ಸಾಮರ್ಥ್ಯ 42% ಹೆಚ್ಚಾಗಿದೆ."',
    'landing.testimonial.author2': 'ಡಾ. ಆಶಾ ಗೌಡ - NGO ಸಂಸ್ಥೆಯ ಮುಖ್ಯಸ್ಥರು',

    // Auth
    'auth.title': 'ಸುರಕ್ಷಿತ ಪ್ರವೇಶ ದ್ವಾರ',
    'auth.email': 'ಅಧಿಕೃತ ಇಮೇಲ್ ವಿಳಾಸ',
    'auth.password': 'ಗುಪ್ತಪದ (Password)',
    'auth.sign_in': 'ಲಾಗಿನ್ ಮಾಡಿ',
    'auth.sign_up': 'ಖಾತೆ ತೆರೆಯಿರಿ',
    'auth.no_account': 'ಖಾತೆ ಹೊಂದಿಲ್ಲವೇ?',
    'auth.have_account': 'ಈಗಾಗಲೇ ಖಾತೆ ಹೊಂದಿದ್ದೀರಾ?',
    'auth.role_select': 'ಅಧಿಕಾರ ವರ್ಗವನ್ನು ಆಯ್ಕೆಮಾಡಿ',
    'auth.demo_logins': 'ಡೆಮೊ ಪ್ರವೇಶ ಮಾಹಿತಿ',
    'auth.demo_admin_desc': 'ಸ್ಥಳೀಯ ಶಾಲಾ ಹಂತದ ವಿದ್ಯಾರ್ಥಿ ದಾಖಲಾತಿ ಹಾಗೂ ಸುಧಾರಣಾ ಪ್ರಕ್ರಿಯೆಗಳ ಮಾಹಿತಿ.',
    'auth.demo_officer_desc': 'ಸಂಪೂರ್ಣ ಜಿಲ್ಲಾ ಮಟ್ಟದ ನಕ್ಷೆಗಳು, ತಾಲೂಕು ತುಲನೆ ಮತ್ತು ಸಂಖ್ಯಾಶಾಸ್ತ್ರ.',
    'auth.demo_ngo_desc': 'ಒಟ್ಟಾರೆ ವಿಶ್ಲೇಷಣೆ, ಪ್ರಮುಖ ವರದಿಗಳು ಮತ್ತು ಇಲಾಖಾ ದತ್ತಾಂಶ.',

    // Dashboard
    'dash.total_schools': 'ಮೇಲ್ವಿಚಾರಣೆಯ ಶಾಲೆಗಳು',
    'dash.enrol_decline': 'ದಾಖಲಾತಿ ಪ್ರವೃತ್ತಿ',
    'dash.at_risk_students': 'ಅಪಾಯದಲ್ಲಿರುವ ವಿದ್ಯಾರ್ಥಿಗಳು',
    'dash.districts_covered': 'ಒಳಗೊಂಡ ಜಿಲ್ಲೆಗಳು',
    'dash.enrol_trends_chart': 'ದಾಖಲಾತಿ ಪ್ರವೃತ್ತಿ (2022 - 2026)',
    'dash.kannada_medium': 'ಕನ್ನಡ ಮಾಧ್ಯಮ',
    'dash.english_medium': 'ಇಂಗ್ಲಿಷ್ ಮಾಧ್ಯಮ',
    'dash.dropout_risk_taluk': 'ತಾಲ್ಲೂಕುವಾರು ಶಾಲಾ ಗೈರುಹಾಜರಿ ಸೂಚ್ಯಂಕ',
    'dash.district_filter_title': 'ಕರ್ನಾಟಕದ ಸಂವಾದಾತ್ಮಕ ನಕ್ಷೆ',
    'dash.district_filter_desc': 'ವಿವರಗಳನ್ನು ಫಿಲ್ಟರ್ ಮಾಡಲು ನಕ್ಷೆಯಲ್ಲಿನ ಜಿಲ್ಲೆಯ ಮೇಲೆ ಕ್ಲಿಕ್ ಮಾಡಿ.',
    'dash.selected_district': 'ಆಯ್ಕೆಮಾಡಿದ ಜಿಲ್ಲೆ',
    'dash.all_districts': 'ಎಲ್ಲಾ ಜಿಲ್ಲೆಗಳು',
    'dash.at_risk_schools_table': 'ಹೆಚ್ಚಿನ ಅಪಾಯದಲ್ಲಿರುವ ಶಾಲೆಗಳು',
    'dash.school_name': 'ಶಾಲೆಯ ಹೆಸರು',
    'dash.risk_score': 'ಅಪಾಯದ ಸೂಚ್ಯಂಕ',
    'dash.action': 'ಕ್ರಮಗಳು',
    'dash.view_dossier': 'ಮಾಹಿತಿ ವೀಕ್ಷಿಸಿ',

    // Schools Page
    'school.title': 'ಶಾಲೆಗಳ ಡೈರೆಕ್ಟರಿ',
    'school.add_school': 'ಹೊಸ ಶಾಲೆ ಸೇರಿಸಿ',
    'school.search_placeholder': 'ಶಾಲೆಯ ಹೆಸರು, ಜಿಲ್ಲೆ ಅಥವಾ ತಾಲ್ಲೂಕಿನ ಮೂಲಕ ಹುಡುಕಿ...',
    'school.district': 'ಜಿಲ್ಲೆ',
    'school.taluk': 'ತಾಲ್ಲೂಕು',
    'school.total_students': 'ಒಟ್ಟು ದಾಖಲಾತಿ',
    'school.at_risk': 'ಅಪಾಯದಲ್ಲಿರುವ ಸಂಖ್ಯೆ',
    'school.action.view': 'ಮಾಹಿತಿ ವೀಕ್ಷಿಸಿ',
    'school.medium': 'ಮುಖ್ಯ ಮಾಧ್ಯಮ',
    'school.decline_rate': 'ವಾರ್ಷಿಕ ಇಳಿಕೆ ದರ',
    'school.risk_index': 'ಅಪಾಯದ ಸೂಚ್ಯಂಕ',
    'school.add.title': 'ಸರ್ಕಾರಿ ಶಾಲೆಯ ನೊಂದಣಿ',
    'school.add.name_en': 'ಶಾಲೆಯ ಹೆಸರು (ಇಂಗ್ಲಿಷ್)',
    'school.add.name_kn': 'ಶಾಲೆಯ ಹೆಸರು (ಕನ್ನಡ)',
    'school.add.medium': 'ಬೋಧನಾ ಮಾಧ್ಯಮ',
    'school.add.submit': 'ನೊಂದಾಯಿಸಿ',
    'school.add.success': 'ಶಾಲೆಯನ್ನು ಯಶಸ್ವಿಯಾಗಿ ನೊಂದಾಯಿಸಲಾಗಿದೆ!',
    'school.details.title': 'ಸರ್ಕಾರಿ ಶಾಲೆಯ ವರದಿ',
    'school.details.demographics': 'ವಿದ್ಯಾರ್ಥಿ ಜನಸಂಖ್ಯಾಶಾಸ್ತ್ರ',
    'school.details.student_roster': 'ತರಗತಿವಾರು ವಿದ್ಯಾರ್ಥಿ ಪ್ರಗತಿ',
    'school.details.learning_gaps': 'ಭಾಷಾ ಕಲಿಕೆ ಕೊರತೆ ವಿಶ್ಲೇಷಣೆ',

    // Analytics
    'analytics.title': 'ಕಲಿಕಾ ಕೊರತೆ ಹಾಗೂ ಅಂಕಿಸಂಖ್ಯೆಗಳು',
    'analytics.subtitle': 'ಹಾಜರಾತಿ ಮಾದರಿಗಳು, ಗ್ರೇಡ್ ವಿಭಜನೆಗಳು ಮತ್ತು ಭಾಷಾ ವ್ಯತ್ಯಾಸಗಳನ್ನು ಪರಿಶೀಲಿಸಿ.',
    'analytics.filter.district': 'ಜಿಲ್ಲೆ ಆಯ್ಕೆಮಾಡಿ',
    'analytics.filter.taluk': 'ತಾಲ್ಲೂಕು ಆಯ್ಕೆಮಾಡಿ',
    'analytics.filter.year': 'ವರ್ಷ ಆಯ್ಕೆಮಾಡಿ',
    'analytics.gaps_title': 'ಭಾಷಾ ಕಲಿಕಾ ಅಂತರ (ಕನ್ನಡ ಮತ್ತು ಇಂಗ್ಲಿಷ್ ಭಾಷಾ ಜ್ಞಾನ)',
    'analytics.gaps_desc': 'ಕನ್ನಡ ಮಾಧ್ಯಮ ಶಾಲೆಗಳ ಕನ್ನಡ ಓದುವಿಕೆ ಮತ್ತು ಗ್ರಹಿಕೆಯನ್ನು ಇಂಗ್ಲಿಷ್ ಭಾಷೆಗೆ ಹೋಲಿಸಲಾಗಿದೆ.',
    'analytics.attendance_title': 'ವಾರವಾರು ಹಾಜರಾತಿ ಪ್ರವೃತ್ತಿ (%)',
    'analytics.grade_perf_title': 'ತರಗತಿವಾರು ಸರಾಸರಿ ಭಾಷಾ ಜ್ಞಾನದ ಅಂಕಗಳು',
    'analytics.kan_comp': 'ಕನ್ನಡ ಭಾಷಾ ಸಾಮರ್ಥ್ಯ',
    'analytics.eng_comp': 'ಇಂಗ್ಲಿಷ್ ಭಾಷಾ ಸಾಮರ್ಥ್ಯ',
    'analytics.att_rate': 'ಹಾಜರಾತಿ ದರ',

    // Risk Predictions
    'risk.title': 'ಕೃತಕ ಬುದ್ಧಿಮತ್ತೆ ಆಧಾರಿತ ಮುನ್ನೆಚ್ಚರಿಕೆ',
    'risk.subtitle': '೬ ಪ್ರಮುಖ ಅಪಾಯದ ಅಂಶಗಳ ಆಧಾರದ ಮೇಲೆ ಶಾಲೆಯಿಂದ ಹೊರಗುಳಿಯುವ ವಿದ್ಯಾರ್ಥಿಗಳ ಮುನ್ಸೂಚನೆ.',
    'risk.student_name': 'ವಿದ್ಯಾರ್ಥಿಯ ಹೆಸರು',
    'risk.grade': 'ತರಗತಿ',
    'risk.attendance': 'ಹಾಜರಾತಿ',
    'risk.language_gap': 'ಕಲಿಕಾ ಅಂತರ',
    'risk.risk_factor': 'ಮುಖ್ಯ ಕಾರಣ',
    'risk.action.assign': 'ಪರಿಹಾರ ನಿಯೋಜಿಸಿ',
    'risk.high': 'ಹೆಚ್ಚಿನ ಅಪಾಯ',
    'risk.medium': 'ಮಧ್ಯಮ ಅಪಾಯ',
    'risk.low': 'ಕಡಿಮೆ ಅಪಾಯ',
    'risk.reasons.distance': 'ದೂರದ ಪ್ರಯಾಣ (>೫ಕಿ.ಮೀ)',
    'risk.reasons.attendance': 'ಹೆಚ್ಚಿನ ಗೈರುಹಾಜರಿ (>೧೫% ರಜೆಗಳು)',
    'risk.reasons.language': 'ಕನ್ನಡ ಓದುವಿಕೆಯಲ್ಲಿ ತೊಂದರೆ',
    'risk.reasons.family': 'ಆರ್ಥಿಕ ಮತ್ತು ಸಾಮಾಜಿಕ ಸಮಸ್ಯೆಗಳು',
    'risk.bulk_title': 'ಕೃತಕ ಬುದ್ಧಿಮತ್ತೆ ಸುಧಾರಣಾ ಮಂಡಳಿ',
    'risk.bulk_description': 'ಕಲಿಕಾ ತೊಂದರೆ ಇರುವ ಎಲ್ಲಾ ವಿದ್ಯಾರ್ಥಿಗಳಿಗೆ ದ್ವಿಭಾಷಾ ಶಾಲಾ ಪರಿಕರಗಳನ್ನು ವಿತರಿಸಿ.',
    'risk.bulk_btn': 'ದ್ವಿಭಾಷಾ ಪರಿಕರಗಳನ್ನು ನಿಯೋಜಿಸಿ',

    // Interventions
    'interv.title': 'ಸಕ್ರಿಯ ಸುಧಾರಣಾ ಕ್ರಮಗಳು',
    'interv.subtitle': 'ಭಾಷಾ ಸೇತುವೆ ಮತ್ತು ಇತರ ಕಲಿಕಾ ಸಾಮಗ್ರಿ ವಿತರಣೆಗಳನ್ನು ಯೋಜಿಸಿ ಮತ್ತು ಮೇಲ್ವಿಚಾರಣೆ ಮಾಡಿ.',
    'interv.create_btn': 'ಹೊಸ ಸುಧಾರಣೆ ರೂಪಿಸಿ',
    'interv.col_pending': 'ನಿಯೋಜಿಸಲಾಗಿದೆ',
    'interv.col_progress': 'ಪ್ರಗತಿಯಲ್ಲಿದೆ',
    'interv.col_completed': 'ಪೂರ್ಣಗೊಂಡಿದೆ',
    'interv.add.title': 'ಸುಧಾರಣಾ ಅಭಿಯಾನವನ್ನು ವಿನ್ಯಾಸಗೊಳಿಸಿ',
    'interv.add.title_en': 'ಅಭಿಯಾನದ ಶೀರ್ಷಿಕೆ (ಇಂಗ್ಲಿಷ್)',
    'interv.add.title_kn': 'ಅಭಿಯಾನದ ಶೀರ್ಷಿಕೆ (ಕನ್ನಡ)',
    'interv.add.desc_en': 'ಅಭಿಯಾನದ ವಿವರಣೆ (ಇಂಗ್ಲಿಷ್)',
    'interv.add.desc_kn': 'ಅಭಿಯಾನದ ವಿವರಣೆ (ಕನ್ನಡ)',
    'interv.add.school': 'ಗುರಿ ಶಾಲೆ',
    'interv.add.type': 'ಸುಧಾರಣಾ ವರ್ಗ',
    'interv.add.submit': 'ಅಭಿಯಾನವನ್ನು ಪ್ರಾರಂಭಿಸಿ',
    'interv.assignee': 'ಅಧಿಕಾರಿ',
    'interv.target': 'ಗಡುವು',
    'interv.cat.bilingual': 'ದ್ವಿಭಾಷಾ ಸೇತುವೆ ಪುಸ್ತಕಗಳು',
    'interv.cat.attendance': 'ಗೈರುಹಾಜರಿ ಸಂಪರ್ಕ ಅಭಿಯಾನ',
    'interv.cat.kits': 'ಭಾಷಾ ಪ್ರಯೋಗಾಲಯ ಕಿಟ್‌ಗಳು',
    'interv.cat.transport': 'ಪ್ರಯಾಣ ಭತ್ಯೆ ಸಹಾಯ',

    // Reports Page
    'reports.title': 'ವರದಿಗಳು ಮತ್ತು ರಫ್ತುಗಳು',
    'reports.subtitle': 'ಶಾಸನಬದ್ಧ ಅನುಸರಣೆ ವರದಿಗಳು, ಸ್ಥಳೀಯ ಪಂಚಾಯತ್ ದಾಖಲೆಗಳನ್ನು ಡೌನ್ಲೋಡ್ ಮಾಡಿ ಅಥವಾ ಬ್ಯಾಚ್ ದತ್ತಾಂಶ ಅಪ್ಲೋಡ್ ಮಾಡಿ.',
    'reports.export_pdf': 'ವಿಶ್ಲೇಷಣಾತ್ಮಕ ವರದಿ ಡೌನ್ಲೋಡ್ ಮಾಡಿ (PDF)',
    'reports.export_csv': 'ಸ್ಪ್ರೆಡ್‌ಶೀಟ್ ರಫ್ತು ಮಾಡಿ (CSV)',
    'reports.upload_title': 'ವಿದ್ಯಾರ್ಥಿ ದಾಖಲಾತಿಗಳ ಅಪ್ಲೋಡರ್',
    'reports.upload_desc': 'ಅಧಿಕೃತ ದಾಖಲಾತಿ CSV ಫೈಲ್ ಅನ್ನು ಇಲ್ಲಿ ಎಳೆಯಿರಿ ಅಥವಾ ಅಪ್ಲೋಡ್ ಮಾಡಲು ಕ್ಲಿಕ್ ಮಾಡಿ.',
    'reports.upload_success': 'ಶಾಲಾ ದಾಖಲಾತಿಗಳ ದತ್ತಾಂಶವನ್ನು ಯಶಸ್ವಿಯಾಗಿ ನವೀಕರಿಸಲಾಗಿದೆ!',
    'reports.preview_pdf': 'ಅಧಿಕೃತ ಕಾರ್ಯನಿರ್ವಾಹಕ ವರದಿ (ಕರಡು)',
    'reports.pdf_intro': 'ಈ ವರದಿಯು ಸರ್ಕಾರಿ ಶಾಲೆಗಳ ಶೈಕ್ಷಣಿಕ ದಾಖಲಾತಿ, ಗೈರುಹಾಜರಿ ಮುನ್ಸೂಚನೆಗಳು ಮತ್ತು ನಿಯೋಜಿಸಲಾದ ಸುಧಾರಣಾ ಕ್ರಮಗಳ ಪರಿಣಾಮಗಳನ್ನು ವಿಶ್ಲೇಷಿಸುತ್ತದೆ.',

    // Common Utilities
    'common.search': 'ಹುಡುಕಿ',
    'common.filter': 'ಫಿಲ್ಟರ್',
    'common.save': 'ಉಳಿಸಿ',
    'common.cancel': 'ರದ್ದುಗೊಳಿಸಿ',
    'common.confirm': 'ಖಚಿತಪಡಿಸಿ',
    'common.success': 'ಯಶಸ್ವಿ',
    'common.error': 'ದೋಷ',
    'common.loading': 'ವಿವರಗಳನ್ನು ಕ್ರೋಢೀಕರಿಸಲಾಗುತ್ತಿದೆ...',
    'common.status': 'ಸ್ಥಿತಿ',
    'common.view': 'ವಿವರಗಳು',
    'common.no_records': 'ಹುಡುಕಾಟಕ್ಕೆ ಯಾವುದೇ ಫಲಿತಾಂಶಗಳು ಸಿಕ್ಕಿಲ್ಲ.',
  },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('en');

  // Load language preference from localstorage on mount
  useEffect(() => {
    const savedLang = localStorage.getItem('kannada_seva_lang') as Language;
    if (savedLang === 'en' || savedLang === 'kn') {
      setLanguage(savedLang);
    }
  }, []);

  const toggleLanguage = () => {
    const newLang = language === 'en' ? 'kn' : 'en';
    setLanguage(newLang);
    localStorage.setItem('kannada_seva_lang', newLang);
  };

  const t = (key: string): string => {
    return translations[language][key] || translations['en'][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useTranslation = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useTranslation must be used within a LanguageProvider');
  }
  return context;
};
