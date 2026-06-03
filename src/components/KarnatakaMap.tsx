'use client';

import React, { useState } from 'react';
import { useTranslation } from '@/context/LanguageContext';
import { MapPin, Info } from 'lucide-react';

interface KarnatakaMapProps {
  selectedDistrict: string | null;
  onSelectDistrict: (district: string | null) => void;
  schoolsData: Array<{ district: string; risk_score: number }>;
}

interface DistrictMapData {
  id: string;
  name_en: string;
  name_kn: string;
  // Visual coordinates for a beautiful stylized polygonal outline representation of Karnataka
  path: string;
  textX: number;
  textY: number;
  baseRisk: number;
}

export const KarnatakaMap: React.FC<KarnatakaMapProps> = ({
  selectedDistrict,
  onSelectDistrict,
  schoolsData
}) => {
  const { language, t } = useTranslation();
  const [hoveredDistrict, setHoveredDistrict] = useState<DistrictMapData | null>(null);

  // High-fidelity stylized vector coordinate representations mapping districts in Karnataka
  const districts: DistrictMapData[] = [
    {
      id: 'dist-belagavi',
      name_en: 'Belagavi',
      name_kn: 'ಬೆಳಗಾವಿ',
      path: 'M 90 40 L 150 20 L 170 70 L 130 110 L 95 90 Z',
      textX: 130,
      textY: 60,
      baseRisk: 52
    },
    {
      id: 'dist-shimoga',
      name_en: 'Shimoga',
      name_kn: 'ಶಿವಮೊಗ್ಗ',
      path: 'M 100 160 L 140 140 L 180 170 L 150 220 L 110 200 Z',
      textX: 140,
      textY: 185,
      baseRisk: 53
    },
    {
      id: 'dist-udupi',
      name_en: 'Udupi',
      name_kn: 'ಉಡುಪಿ',
      path: 'M 90 215 L 125 210 L 120 255 L 85 260 Z',
      textX: 92,
      textY: 235,
      baseRisk: 50
    },
    {
      id: 'dist-dk',
      name_en: 'Dakshina Kannada',
      name_kn: 'ದಕ್ಷಿಣ ಕನ್ನಡ',
      path: 'M 95 270 L 130 265 L 155 315 L 115 330 Z',
      textX: 110,
      textY: 300,
      baseRisk: 72
    },
    {
      id: 'dist-tumkur',
      name_en: 'Tumkur',
      name_kn: 'ತುಮಕೂರು',
      path: 'M 210 200 L 255 210 L 260 270 L 215 250 Z',
      textX: 235,
      textY: 235,
      baseRisk: 60
    },
    {
      id: 'dist-bangalore',
      name_en: 'Bangalore Urban',
      name_kn: 'ಬೆಂಗಳೂರು',
      path: 'M 255 285 L 290 280 L 285 315 L 250 310 Z',
      textX: 280,
      textY: 305,
      baseRisk: 79
    },
    {
      id: 'dist-mysore',
      name_en: 'Mysore',
      name_kn: 'ಮೈಸೂರು',
      path: 'M 175 330 L 220 310 L 225 365 L 180 375 Z',
      textX: 200,
      textY: 350,
      baseRisk: 69
    },
    {
      id: 'dist-chamaraja',
      name_en: 'Chamarajanagar',
      name_kn: 'ಚಾಮರಾಜನಗರ',
      path: 'M 215 375 L 260 360 L 255 420 L 210 410 Z',
      textX: 235,
      textY: 395,
      baseRisk: 93
    }
  ];

  // Helper to resolve real-time updated risk score based on actual current school data
  const getRiskScore = (districtName: string, base: number) => {
    const matched = schoolsData.filter(s => s.district.toLowerCase() === districtName.toLowerCase());
    if (matched.length === 0) return base;
    const sum = matched.reduce((acc, s) => acc + s.risk_score, 0);
    return Math.round(sum / matched.length);
  };

  const getColorClass = (score: number) => {
    if (score >= 80) return {
      fill: 'fill-neon-pink/20 hover:fill-neon-pink/40',
      stroke: 'stroke-neon-pink',
      glow: 'shadow-[0_0_15px_rgba(236,72,153,0.5)]',
      colorName: 'text-neon-pink'
    };
    if (score >= 65) return {
      fill: 'fill-neon-purple/20 hover:fill-neon-purple/40',
      stroke: 'stroke-neon-purple',
      glow: 'shadow-[0_0_15px_rgba(168,85,247,0.5)]',
      colorName: 'text-neon-purple'
    };
    if (score >= 50) return {
      fill: 'fill-neon-cyan/20 hover:fill-neon-cyan/40',
      stroke: 'stroke-neon-cyan',
      glow: 'shadow-[0_0_15px_rgba(6,182,212,0.5)]',
      colorName: 'text-neon-cyan'
    };
    return {
      fill: 'fill-neon-teal/20 hover:fill-neon-teal/40',
      stroke: 'stroke-neon-teal',
      glow: 'shadow-[0_0_15px_rgba(20,184,166,0.5)]',
      colorName: 'text-neon-teal'
    };
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex justify-between items-center mb-3">
        <div>
          <span className="text-xs uppercase text-slate-500 font-mono tracking-widest block">{t('dash.district_filter_title')}</span>
          <span className="text-xs text-slate-400 font-sans block">{t('dash.district_filter_desc')}</span>
        </div>
        {selectedDistrict && (
          <button
            onClick={() => onSelectDistrict(null)}
            className="text-xs text-neon-cyan hover:underline font-mono"
          >
            Reset Filter [X]
          </button>
        )}
      </div>

      <div className="relative flex-1 flex items-center justify-center p-3 rounded-xl border border-slate-900 bg-slate-950/40 overflow-hidden h-[380px] md:h-[420px]">
        {/* Futuristic Map Overlay Radar grid */}
        <div className="absolute inset-0 pointer-events-none opacity-20 bg-[radial-gradient(ellipse_at_center,rgba(6,182,212,0.15),transparent_60%)]" />

        {/* Visual Map SVG representation */}
        <svg 
          viewBox="0 0 380 440" 
          className="w-full h-full max-h-[380px] md:max-h-[400px] select-none"
        >
          {/* Main Karnataka State Outlines */}
          <g className="cursor-pointer">
            {districts.map((dist) => {
              const currentRisk = getRiskScore(dist.name_en, dist.baseRisk);
              const theme = getColorClass(currentRisk);
              const isSelected = selectedDistrict === dist.name_en;
              
              return (
                <g 
                  key={dist.id}
                  onClick={() => onSelectDistrict(isSelected ? null : dist.name_en)}
                  onMouseEnter={() => setHoveredDistrict(dist)}
                  onMouseLeave={() => setHoveredDistrict(null)}
                >
                  {/* Glowing Outline Background for Selected */}
                  <path
                    d={dist.path}
                    className={`transition-all duration-300 ${theme.stroke} stroke-[3] ${
                      isSelected ? 'fill-neon-cyan/20 filter drop-shadow-[0_0_10px_rgba(6,182,212,0.4)]' : 'fill-transparent'
                    }`}
                  />
                  {/* Core District Polygon */}
                  <path
                    d={dist.path}
                    className={`transition-all duration-300 stroke-[1.5] ${theme.stroke} ${theme.fill} ${
                      isSelected ? 'fill-opacity-50 stroke-[2.5]' : ''
                    }`}
                  />

                  {/* District Text Dot Locator */}
                  <circle
                    cx={dist.textX}
                    cy={dist.textY - 12}
                    r="3.5"
                    className={`${theme.stroke} ${
                      isSelected ? 'fill-white animate-ping' : 'fill-slate-900'
                    }`}
                  />

                  {/* Visual Text Label */}
                  <text
                    x={dist.textX}
                    y={dist.textY + 2}
                    className="text-[9px] font-mono font-bold fill-slate-300 pointer-events-none text-anchor-middle"
                    textAnchor="middle"
                  >
                    {language === 'en' ? dist.name_en.split(' ')[0] : dist.name_kn.slice(0, 4)}
                  </text>
                </g>
              );
            })}
          </g>
        </svg>

        {/* Hover Map Tooltip Widget */}
        {hoveredDistrict && (
          <div className="absolute bottom-4 left-4 right-4 p-3 rounded-lg border border-neon-cyan/30 bg-slate-950/90 backdrop-blur-xl shadow-glow-cyan/10 flex items-center space-x-3 pointer-events-none animate-in fade-in slide-in-from-bottom-2 duration-150">
            <div className="w-8 h-8 rounded-lg bg-neon-cyan/10 flex items-center justify-center">
              <MapPin className="w-4 h-4 text-neon-cyan animate-bounce" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-white">
                {language === 'en' ? hoveredDistrict.name_en : hoveredDistrict.name_kn}
              </p>
              <p className="text-[10px] text-slate-400 font-mono">
                {t('school.district')} • Karnataka State
              </p>
            </div>
            <div className="text-right">
              <span className="text-[10px] uppercase text-slate-500 font-mono tracking-widest block">{t('dash.risk_score')}</span>
              <span className={`text-sm font-bold font-mono ${
                getColorClass(getRiskScore(hoveredDistrict.name_en, hoveredDistrict.baseRisk)).colorName
              }`}>
                {getRiskScore(hoveredDistrict.name_en, hoveredDistrict.baseRisk)}%
              </span>
            </div>
          </div>
        )}

        {/* Legend Panel */}
        <div className="absolute top-4 right-4 p-2.5 rounded-lg border border-slate-900 bg-slate-950/80 backdrop-blur-sm text-[10px] space-y-1.5 pointer-events-none">
          <div className="flex items-center space-x-1.5">
            <span className="w-2 h-2 rounded-full bg-neon-pink" />
            <span className="text-slate-400 font-mono font-semibold">{t('risk.high')} (&gt;80%)</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <span className="w-2 h-2 rounded-full bg-neon-purple" />
            <span className="text-slate-400 font-mono font-semibold">Elevated (65-80%)</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <span className="w-2 h-2 rounded-full bg-neon-cyan" />
            <span className="text-slate-400 font-mono font-semibold">Moderate (50-65%)</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <span className="w-2 h-2 rounded-full bg-neon-teal" />
            <span className="text-slate-400 font-mono font-semibold">{t('risk.low')} (&lt;50%)</span>
          </div>
        </div>
      </div>
    </div>
  );
};
