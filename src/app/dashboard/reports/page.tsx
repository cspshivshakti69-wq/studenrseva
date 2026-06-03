'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from '@/context/LanguageContext';
import { mockDB, School, Intervention } from '@/lib/mockData';
import { 
  Download, UploadCloud, FileText, CheckCircle2, AlertTriangle, 
  Sparkles, FileSpreadsheet, Printer, FileDown, Info, Trash2
} from 'lucide-react';

export default function ReportsPage() {
  const { language, t } = useTranslation();
  
  // Local Database States
  const [schools, setSchools] = useState<School[]>([]);
  const [interventions, setInterventions] = useState<Intervention[]>([]);
  
  // CSV Uploader States
  const [dragActive, setDragActive] = useState(false);
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Print Mode state
  const printAreaRef = useRef<HTMLDivElement>(null);

  // Load data
  const loadData = () => {
    setSchools(mockDB.getSchools());
    setInterventions(mockDB.getInterventions());
  };

  useEffect(() => {
    loadData();
    
    // Listen for custom state refreshes if any form modifications trigger
    window.addEventListener('storage', loadData);
    return () => window.removeEventListener('storage', loadData);
  }, []);

  // Summary Metrics Calculations
  const totalSchools = schools.length;
  const avgRiskScore = totalSchools > 0 
    ? (schools.reduce((acc, curr) => acc + curr.risk_score, 0) / totalSchools).toFixed(1)
    : '0';
  const totalAtRisk = schools.reduce((acc, curr) => acc + curr.at_risk_students, 0);
  const avgDeclineRate = totalSchools > 0
    ? (schools.reduce((acc, curr) => acc + curr.enrolment_decline_rate, 0) / totalSchools).toFixed(1)
    : '0';
  const activeInterventions = interventions.filter(i => i.status !== 'completed').length;
  const completedInterventions = interventions.filter(i => i.status === 'completed').length;

  // ----------------------------------------------------
  // EXPORTS UTILITY METHODS
  // ----------------------------------------------------
  
  // 1. Download Template CSV
  const handleDownloadTemplate = () => {
    const headers = 'School Name,District,Taluk,Total Enrolled,Decline Rate,Primary Medium\n';
    const sampleRows = [
      '"GHPS Hassan Town","Hassan","Hassan",142,3.8,"kannada"',
      '"GHS Mandya West","Mandya","Mandya",220,1.9,"both"',
      '"GHPS Kolar Gold Fields","Kolar","KGF",95,6.4,"kannada"',
      '"GHPS Shimoga Rural","Shimoga","Shimoga",110,4.2,"kannada"'
    ].join('\n');
    
    const csvContent = 'data:text/csv;charset=utf-8,' + encodeURIComponent(headers + sampleRows);
    const link = document.createElement('a');
    link.setAttribute('href', csvContent);
    link.setAttribute('download', 'kannada_seva_school_template.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // 2. Export Schools Data to CSV
  const handleExportSchoolsCSV = () => {
    const headers = 'School Registry ID,School Name (English),School Name (Kannada),District,Taluk,Total Enrolled Students,At-Risk Students,Annual Decline Rate (%),Risk Index Score (%)\n';
    
    const rows = schools.map(sch => {
      return [
        sch.id,
        `"${sch.name_en.replace(/"/g, '""')}"`,
        `"${sch.name_kn.replace(/"/g, '""')}"`,
        `"${sch.district}"`,
        `"${sch.taluk}"`,
        sch.total_students,
        sch.at_risk_students,
        sch.enrolment_decline_rate,
        sch.risk_score
      ].join(',');
    }).join('\n');

    const csvContent = 'data:text/csv;charset=utf-8,' + encodeURIComponent(headers + rows);
    const link = document.createElement('a');
    link.setAttribute('href', csvContent);
    link.setAttribute('download', `kannada_seva_schools_report_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // 3. Export Interventions to CSV
  const handleExportInterventionsCSV = () => {
    const headers = 'Intervention ID,Target School (English),Target School (Kannada),Campaign Title (English),Campaign Title (Kannada),Category,Status,Assigned Officer,Target Date,Created Date\n';
    
    const rows = interventions.map(i => {
      return [
        i.id,
        `"${i.school_name_en.replace(/"/g, '""')}"`,
        `"${i.school_name_kn.replace(/"/g, '""')}"`,
        `"${i.title_en.replace(/"/g, '""')}"`,
        `"${i.title_kn.replace(/"/g, '""')}"`,
        i.category.toUpperCase(),
        i.status.toUpperCase(),
        `"${i.assigned_to_name}"`,
        i.target_date,
        i.created_at
      ].join(',');
    }).join('\n');

    const csvContent = 'data:text/csv;charset=utf-8,' + encodeURIComponent(headers + rows);
    const link = document.createElement('a');
    link.setAttribute('href', csvContent);
    link.setAttribute('download', `kannada_seva_interventions_report_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // 4. Print Executive PDF Summary
  const handlePrintPDF = () => {
    window.print();
  };

  // ----------------------------------------------------
  // DRAG & DROP CSV PARSER METHODS
  // ----------------------------------------------------

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    setUploadError(null);
    setUploadSuccess(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      validateAndSetFile(file);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setUploadError(null);
    setUploadSuccess(false);

    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      validateAndSetFile(file);
    }
  };

  const validateAndSetFile = (file: File) => {
    if (file.type !== "text/csv" && !file.name.endsWith('.csv')) {
      setUploadError("Invalid file type. Please upload a valid .csv file.");
      setUploadFile(null);
      return;
    }
    if (file.size > 2 * 1024 * 1024) { // 2MB Limit
      setUploadError("File is too large. Maximum allowed size is 2MB.");
      setUploadFile(null);
      return;
    }
    setUploadFile(file);
  };

  const handleUploadSubmit = () => {
    if (!uploadFile) return;

    setIsProcessing(true);
    setUploadError(null);
    
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      
      // Artificial delay for futuristic system compiling visual
      setTimeout(() => {
        const success = mockDB.uploadCSVData(text);
        setIsProcessing(false);
        
        if (success) {
          setUploadSuccess(true);
          setUploadFile(null);
          loadData(); // reload statistics and schools
          
          // Reset success state after 4 seconds
          setTimeout(() => setUploadSuccess(false), 4000);
        } else {
          setUploadError("Failed to parse CSV. Check columns alignment (School Name, District, Taluk, Total, Decline, Medium).");
        }
      }, 1500);
    };
    reader.onerror = () => {
      setUploadError("Error reading file.");
      setIsProcessing(false);
    };
    reader.readAsText(uploadFile);
  };

  return (
    <div className="space-y-6">
      
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-900 pb-5 print:hidden">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white flex items-center space-x-2.5">
            <span className="w-1.5 h-7 rounded bg-gradient-to-t from-neon-purple to-neon-cyan inline-block shadow-glow-cyan" />
            <span>{t('reports.title')}</span>
          </h1>
          <p className="text-xs md:text-sm text-slate-400 mt-1">
            {t('reports.subtitle')}
          </p>
        </div>
      </div>

      {/* Grid panels: Action Center & Drag/Drop Sync */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 print:hidden">
        
        {/* Left Panel: Download Center */}
        <div className="lg:col-span-5 space-y-6">
          <div className="p-6 rounded-2xl border border-slate-900 bg-slate-950/20 backdrop-blur-sm cyber-glass flex flex-col justify-between h-full">
            <div className="space-y-5">
              <h3 className="text-sm md:text-base font-extrabold text-white flex items-center space-x-2">
                <Sparkles className="w-4 h-4 text-neon-cyan" />
                <span>Analytical Export Hub</span>
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Compile comprehensive educational datasets dynamically. Choose between downloading legal executive PDF summaries or spreadsheets representing the entire reactive local state database.
              </p>
              
              <div className="space-y-3.5 pt-3">
                {/* 1. PDF Dossier Print */}
                <button
                  onClick={handlePrintPDF}
                  className="w-full flex items-center justify-between px-4 py-3 rounded-xl border border-neon-cyan/20 hover:border-neon-cyan/50 bg-slate-950/40 hover:bg-neon-cyan/5 text-slate-200 hover:text-white transition-all font-semibold text-xs md:text-sm hover-glow-sweep group"
                >
                  <div className="flex items-center space-x-3">
                    <div className="p-2 rounded-lg bg-neon-cyan/10 text-neon-cyan group-hover:scale-105 transition-transform">
                      <Printer className="w-4.5 h-4.5" />
                    </div>
                    <span className="text-left">{t('reports.export_pdf')}</span>
                  </div>
                  <Download className="w-4 h-4 text-slate-500 group-hover:text-neon-cyan" />
                </button>

                {/* 2. CSV Schools Export */}
                <button
                  onClick={handleExportSchoolsCSV}
                  className="w-full flex items-center justify-between px-4 py-3 rounded-xl border border-neon-purple/20 hover:border-neon-purple/50 bg-slate-950/40 hover:bg-neon-purple/5 text-slate-200 hover:text-white transition-all font-semibold text-xs md:text-sm hover-glow-sweep group"
                >
                  <div className="flex items-center space-x-3">
                    <div className="p-2 rounded-lg bg-neon-purple/10 text-neon-purple group-hover:scale-105 transition-transform">
                      <FileSpreadsheet className="w-4.5 h-4.5" />
                    </div>
                    <span className="text-left">{t('reports.export_csv')}</span>
                  </div>
                  <Download className="w-4 h-4 text-slate-500 group-hover:text-neon-purple" />
                </button>

                {/* 3. CSV Interventions Export */}
                <button
                  onClick={handleExportInterventionsCSV}
                  className="w-full flex items-center justify-between px-4 py-3 rounded-xl border border-neon-teal/20 hover:border-neon-teal/50 bg-slate-950/40 hover:bg-neon-teal/5 text-slate-200 hover:text-white transition-all font-semibold text-xs md:text-sm hover-glow-sweep group"
                >
                  <div className="flex items-center space-x-3">
                    <div className="p-2 rounded-lg bg-neon-teal/10 text-neon-teal group-hover:scale-105 transition-transform">
                      <FileSpreadsheet className="w-4.5 h-4.5" />
                    </div>
                    <span className="text-left">Export Interventions logs (CSV)</span>
                  </div>
                  <Download className="w-4 h-4 text-slate-500 group-hover:text-neon-teal" />
                </button>
              </div>
            </div>

            <div className="border-t border-slate-900 pt-5 mt-6 flex items-start space-x-2 text-[10px] text-slate-500 font-mono leading-normal">
              <Info className="w-3.5 h-3.5 text-neon-cyan shrink-0 mt-0.5" />
              <span>
                Report matrices are automatically compiled from local database transactions. PDF generator incorporates active CSS printing protocols.
              </span>
            </div>
          </div>
        </div>

        {/* Right Panel: CSV Drag & Drop Sync */}
        <div className="lg:col-span-7 space-y-6">
          <div className="p-6 rounded-2xl border border-slate-900 bg-slate-950/20 backdrop-blur-sm cyber-glass flex flex-col justify-between h-full">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-sm md:text-base font-extrabold text-white flex items-center space-x-2">
                  <UploadCloud className="w-4.5 h-4.5 text-neon-purple" />
                  <span>{t('reports.upload_title')}</span>
                </h3>
                <button
                  onClick={handleDownloadTemplate}
                  className="flex items-center space-x-1 px-2.5 py-1 rounded-lg border border-slate-800 bg-slate-950/40 hover:bg-slate-900 hover:border-slate-700 text-[10px] font-mono text-slate-400 hover:text-neon-cyan transition-all"
                >
                  <FileDown className="w-3.5 h-3.5" />
                  <span>Download CSV Template</span>
                </button>
              </div>
              
              <p className="text-xs text-slate-400 leading-relaxed">
                {t('reports.upload_desc')} Dynamic parser matches names and computes preliminary risk ratios seamlessly inside localStorage state.
              </p>

              {/* Upload Drag Box Container */}
              <div 
                className={`relative border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center text-center transition-all duration-200 ${
                  dragActive 
                    ? "border-neon-cyan bg-neon-cyan/5 scale-[1.01]" 
                    : uploadFile 
                      ? "border-neon-teal/40 bg-neon-teal/5" 
                      : "border-slate-800 bg-slate-950/30 hover:border-slate-700"
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <input 
                  type="file"
                  id="csv-file-upload"
                  accept=".csv"
                  className="hidden"
                  onChange={handleFileChange}
                />

                {uploadSuccess ? (
                  <div className="space-y-2 animate-in zoom-in-95 duration-200">
                    <div className="w-12 h-12 rounded-full bg-neon-teal/20 flex items-center justify-center mx-auto text-neon-teal border border-neon-teal/40 shadow-[0_0_15px_rgba(20,184,166,0.15)]">
                      <CheckCircle2 className="w-6 h-6 animate-bounce" />
                    </div>
                    <p className="text-xs font-bold text-neon-teal font-mono">{t('reports.upload_success')}</p>
                    <p className="text-[10px] text-slate-500 font-mono">Monitored parameters refreshed in memory.</p>
                  </div>
                ) : isProcessing ? (
                  <div className="space-y-4 font-mono py-4">
                    <div className="w-8 h-8 rounded-lg border-2 border-neon-purple border-t-transparent animate-spin mx-auto" />
                    <p className="text-[11px] text-neon-purple uppercase tracking-widest animate-pulse font-bold">{t('common.loading')}</p>
                  </div>
                ) : uploadFile ? (
                  <div className="space-y-4 w-full max-w-sm">
                    <div className="p-3 rounded-lg border border-neon-teal/20 bg-slate-950/80 flex items-center justify-between">
                      <div className="flex items-center space-x-3 min-w-0">
                        <FileText className="w-7 h-7 text-neon-teal shrink-0" />
                        <div className="text-left min-w-0">
                          <p className="text-xs font-semibold text-slate-200 truncate">{uploadFile.name}</p>
                          <p className="text-[9px] text-slate-500 font-mono">{(uploadFile.size / 1024).toFixed(1)} KB</p>
                        </div>
                      </div>
                      <button 
                        onClick={() => setUploadFile(null)}
                        className="p-1 rounded bg-slate-900 border border-slate-800 text-slate-400 hover:text-neon-pink transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <button
                      onClick={handleUploadSubmit}
                      className="w-full py-2.5 rounded-xl font-bold bg-gradient-to-r from-neon-purple to-neon-cyan text-white text-xs hover:shadow-glow-cyan/30 hover:scale-102 transition-all font-mono"
                    >
                      Process & Synchronise Records
                    </button>
                  </div>
                ) : (
                  <label 
                    htmlFor="csv-file-upload" 
                    className="cursor-pointer space-y-3 flex flex-col items-center py-2"
                  >
                    <div className="w-11 h-11 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-neon-cyan hover:border-neon-cyan/30 transition-all">
                      <UploadCloud className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-300">
                        Drag and drop file or <span className="text-neon-cyan hover:underline">browse files</span>
                      </p>
                      <p className="text-[10px] text-slate-500 mt-1 font-mono">CSV format up to 2MB. (Primary columns matched dynamically)</p>
                    </div>
                  </label>
                )}
              </div>

              {uploadError && (
                <div className="p-3.5 rounded-xl border border-neon-pink/30 bg-neon-pink/10 text-neon-pink text-[11px] font-mono text-center flex items-center justify-center space-x-2">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  <span>{uploadError}</span>
                </div>
              )}
            </div>

            <div className="border-t border-slate-900 pt-4.5 mt-5 flex items-start space-x-2 text-[10px] text-slate-500 font-mono">
              <Info className="w-3.5 h-3.5 text-neon-purple shrink-0 mt-0.5" />
              <span>
                To test the parser, download our template, modify values, and drop back. System will create schools and automatically allocate student registries in state!
              </span>
            </div>
          </div>
        </div>

      </div>

      {/* Official Executive Summary Section */}
      <div className="space-y-4">
        <h3 className="text-sm md:text-base font-extrabold text-white flex items-center space-x-2 print:hidden">
          <FileText className="w-4.5 h-4.5 text-neon-cyan" />
          <span>{t('reports.preview_pdf')}</span>
        </h3>
        
        {/* Printable Executive Dossier Card */}
        <div 
          ref={printAreaRef}
          className="p-6 md:p-8 lg:p-10 rounded-2xl border border-slate-900 bg-cyber-card relative overflow-hidden shadow-2xl print:border-none print:bg-white print:text-black print:p-0 print:m-0"
          id="reports-printable-dossier"
        >
          {/* Cyber Mesh Background (hidden on print) */}
          <div className="absolute inset-0 pointer-events-none opacity-20 bg-[linear-gradient(rgba(6,182,212,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(6,182,212,0.02)_1px,transparent_1px)] bg-[size:30px_30px] print:hidden" />

          {/* Letterhead Grid */}
          <div className="relative border-b-2 border-slate-800 print:border-black pb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div className="space-y-2">
              <div className="flex items-center space-x-2.5">
                <div className="w-2.5 h-7 rounded bg-gradient-to-t from-neon-purple to-neon-cyan print:bg-black inline-block shadow-glow-cyan print:shadow-none" />
                <span className="text-xl md:text-2xl font-extrabold tracking-tight text-white print:text-black font-mono">
                  {language === 'en' ? 'KANNADA SEVA' : 'ಕನ್ನಡ ಸೇವಾ'}
                </span>
              </div>
              <p className="text-[10px] uppercase font-mono tracking-widest text-neon-cyan print:text-slate-600 font-bold">
                {t('brand.tagline')}
              </p>
              <p className="text-[10px] text-slate-500 font-mono print:text-slate-600">
                EDUCATION DEPARTMENT ADMINISTRATIVE COMPLIANCE REGISTRY
              </p>
            </div>

            <div className="text-left md:text-right font-mono text-[10px] text-slate-400 print:text-slate-700 space-y-1">
              <p className="font-bold text-white print:text-black">GOVERNMENT OF KARNATAKA</p>
              <p>State Education Board Portal</p>
              <p>Reference: KS-AI-2026-COMP-094</p>
              <p>Compiled: {new Date().toLocaleDateString(language === 'en' ? 'en-US' : 'kn-IN', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
            </div>
          </div>

          {/* Executive Intro */}
          <div className="relative py-6 border-b border-slate-900 print:border-slate-300">
            <h4 className="text-xs md:text-sm font-bold uppercase tracking-wider text-slate-200 print:text-black mb-2.5 font-mono">
              1. Executive Outline
            </h4>
            <p className="text-xs text-slate-400 print:text-slate-800 leading-relaxed font-sans">
              {t('reports.pdf_intro')} The platform continuously monitors taluk-level demographic shifts, linguistic comprehension margins, and chronic absenteeism, allowing department officers to execute immediate, targeted educational interventions to protect school mediums.
            </p>
          </div>

          {/* Key Metrics Grid */}
          <div className="relative py-6 border-b border-slate-900 print:border-slate-300">
            <h4 className="text-xs md:text-sm font-bold uppercase tracking-wider text-slate-200 print:text-black mb-4 font-mono">
              2. Consolidated State Performance Statistics
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div className="p-3.5 rounded-xl border border-slate-900 bg-slate-950/40 print:border-slate-300 print:bg-slate-50">
                <span className="text-[9px] uppercase tracking-wider text-slate-500 print:text-slate-600 font-mono block">MONITORED SCHOOLS</span>
                <span className="text-lg md:text-2xl font-black text-white print:text-black font-mono block mt-1">{totalSchools}</span>
              </div>
              <div className="p-3.5 rounded-xl border border-slate-900 bg-slate-950/40 print:border-slate-300 print:bg-slate-50">
                <span className="text-[9px] uppercase tracking-wider text-slate-500 print:text-slate-600 font-mono block">STATE RISK PROFILE</span>
                <span className="text-lg md:text-2xl font-black text-neon-pink print:text-black font-mono block mt-1">{avgRiskScore}%</span>
              </div>
              <div className="p-3.5 rounded-xl border border-slate-900 bg-slate-950/40 print:border-slate-300 print:bg-slate-50">
                <span className="text-[9px] uppercase tracking-wider text-slate-500 print:text-slate-600 font-mono block">DROPOUT THREAT LEVEL</span>
                <span className="text-lg md:text-2xl font-black text-neon-purple print:text-black font-mono block mt-1">{totalAtRisk} Students</span>
              </div>
              <div className="p-3.5 rounded-xl border border-slate-900 bg-slate-950/40 print:border-slate-300 print:bg-slate-50">
                <span className="text-[9px] uppercase tracking-wider text-slate-500 print:text-slate-600 font-mono block">MED. ANNUAL DECLINE</span>
                <span className="text-lg md:text-2xl font-black text-neon-teal print:text-black font-mono block mt-1">-{avgDeclineRate}%</span>
              </div>
            </div>
          </div>

          {/* Detailed Schools Dossier List */}
          <div className="relative py-6 border-b border-slate-900 print:border-slate-300">
            <h4 className="text-xs md:text-sm font-bold uppercase tracking-wider text-slate-200 print:text-black mb-3 font-mono">
              3. Schools Performance Profile
            </h4>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead>
                  <tr className="border-b border-slate-900 print:border-black text-[9px] uppercase text-slate-500 print:text-slate-700">
                    <th className="py-2.5 font-bold">School Name</th>
                    <th className="py-2.5 font-bold">Taluk / Dist</th>
                    <th className="py-2.5 font-bold text-center">Enrolled</th>
                    <th className="py-2.5 font-bold text-center">Threat Count</th>
                    <th className="py-2.5 font-bold text-center">Decline Rate</th>
                    <th className="py-2.5 font-bold text-right">Risk Index</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-900/60 print:divide-slate-200 text-slate-300 print:text-black">
                  {schools.slice(0, 5).map((sch) => (
                    <tr key={sch.id} className="hover:bg-slate-900/20 print:hover:bg-transparent">
                      <td className="py-2.5 font-semibold text-slate-200 print:text-black max-w-[150px] truncate">
                        {language === 'en' ? sch.name_en : sch.name_kn}
                      </td>
                      <td className="py-2.5 text-slate-400 print:text-slate-600">{sch.taluk} ({sch.district.slice(0, 8)})</td>
                      <td className="py-2.5 text-center">{sch.total_students}</td>
                      <td className="py-2.5 text-center text-neon-purple print:text-black font-bold">{sch.at_risk_students}</td>
                      <td className="py-2.5 text-center text-neon-pink print:text-black">-{sch.enrolment_decline_rate}%</td>
                      <td className="py-2.5 text-right text-neon-cyan print:text-black font-bold">{sch.risk_score}%</td>
                    </tr>
                  ))}
                  {schools.length > 5 && (
                    <tr>
                      <td colSpan={6} className="py-2.5 text-center text-[10px] text-slate-500 font-bold uppercase italic tracking-widest">
                        ... And {schools.length - 5} other monitored government schools registered ...
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Intervention Tracking Dossier List */}
          <div className="relative py-6 pb-2">
            <h4 className="text-xs md:text-sm font-bold uppercase tracking-wider text-slate-200 print:text-black mb-3 font-mono">
              4. Targeted Educational Intervention Log
            </h4>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead>
                  <tr className="border-b border-slate-900 print:border-black text-[9px] uppercase text-slate-500 print:text-slate-700">
                    <th className="py-2.5 font-bold">Campaign Title</th>
                    <th className="py-2.5 font-bold">Target Institute</th>
                    <th className="py-2.5 font-bold">Category</th>
                    <th className="py-2.5 font-bold">Assigned Officer</th>
                    <th className="py-2.5 font-bold text-center">Status</th>
                    <th className="py-2.5 font-bold text-right">Target Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-900/60 print:divide-slate-200 text-slate-300 print:text-black">
                  {interventions.slice(0, 4).map((i) => (
                    <tr key={i.id} className="hover:bg-slate-900/20 print:hover:bg-transparent">
                      <td className="py-2.5 font-semibold text-slate-200 print:text-black max-w-[150px] truncate">
                        {language === 'en' ? i.title_en : i.title_kn}
                      </td>
                      <td className="py-2.5 text-slate-400 print:text-slate-600 truncate max-w-[130px]">
                        {language === 'en' ? i.school_name_en : i.school_name_kn}
                      </td>
                      <td className="py-2.5 text-neon-cyan print:text-black text-[10px] font-bold uppercase">{i.category}</td>
                      <td className="py-2.5 text-slate-400 print:text-slate-600">{i.assigned_to_name}</td>
                      <td className="py-2.5 text-center">
                        <span className={`px-2 py-0.5 rounded text-[9px] font-bold font-mono uppercase ${
                          i.status === 'completed' 
                            ? 'bg-neon-teal/15 text-neon-teal print:text-black' 
                            : i.status === 'in_progress' 
                              ? 'bg-neon-purple/15 text-neon-purple print:text-black' 
                              : 'bg-slate-800 text-slate-400 print:text-black'
                        }`}>
                          {i.status === 'completed' ? 'RESOLVED' : i.status === 'in_progress' ? 'IN ACTION' : 'ASSIGNED'}
                        </span>
                      </td>
                      <td className="py-2.5 text-right text-slate-400 print:text-black">{i.target_date}</td>
                    </tr>
                  ))}
                  {interventions.length > 4 && (
                    <tr>
                      <td colSpan={6} className="py-2.5 text-center text-[10px] text-slate-500 font-bold uppercase italic tracking-widest">
                        ... And {interventions.length - 4} other active and archived targeted campaigns ...
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Official Seal/Signature Block */}
          <div className="relative mt-8 pt-8 border-t border-slate-900 print:border-slate-300 flex flex-col sm:flex-row justify-between items-center gap-6">
            <div className="text-[10px] font-mono text-slate-500 print:text-slate-600 text-center sm:text-left space-y-1">
              <p>Security Clearance Hash: SHA256-54B78A9C</p>
              <p>Validated via Kannada Seva ML-Predictive Core V1.2</p>
            </div>
            
            <div className="text-center font-mono text-[10px] space-y-1 sm:text-right">
              <div className="w-36 h-0.5 bg-slate-800 print:bg-black mx-auto sm:ml-auto mb-2" />
              <p className="font-bold text-slate-300 print:text-black">Commissioner of Public Instruction</p>
              <p className="text-slate-500 print:text-slate-600">Department of School Education, Karnataka</p>
            </div>
          </div>

        </div>
      </div>
      
      {/* Dynamic CSS Styling for Printing */}
      <style jsx global>{`
        @media print {
          /* Hide everything except the printable container */
          body * {
            visibility: hidden;
            background: white !important;
            color: black !important;
          }
          #reports-printable-dossier, #reports-printable-dossier * {
            visibility: visible;
          }
          #reports-printable-dossier {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            border: none !important;
            box-shadow: none !important;
            padding: 0 !important;
            margin: 0 !important;
          }
          /* Fix layout colors for black ink */
          .text-neon-pink, .text-neon-purple, .text-neon-teal, .text-neon-cyan {
            color: black !important;
            font-weight: bold !important;
          }
          .bg-neon-teal\/15, .bg-neon-purple\/15 {
            background: transparent !important;
            border: 1px solid black !important;
            padding: 1px 4px !important;
          }
          .border-b-2 {
            border-bottom-width: 2px !important;
          }
        }
      `}</style>

    </div>
  );
}
