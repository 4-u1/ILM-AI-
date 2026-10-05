import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles } from 'lucide-react';

export interface IlmBrandLogoProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  showSubtitle?: boolean;
  className?: string;
  onClick?: () => void;
  withAura?: boolean;
  textColor?: string;
  kasrahColor?: string;
  subtitleColor?: string;
  horizontal?: boolean;
  interactive?: boolean;
}

/**
 * 🌟 IlmBrandLogo - شعار منصة عِلم الأصيل والملكي
 * - أحرف مشبوكة ومتصلة بدقة وبخط أنحف وأرقى: عِـلـم
 * - بنفس خلفية الصفحة/الحاوية تماماً دون مربع داكن وبدون إطار
 * - حواف ضبابية ذهبية ناعمة (Golden Blurred Edges / Glow)
 * - الميزة والعلامة الموجودة تحت حرف الـ عِ بالكحلي الأصيل (#0F2B5C)
 * - تأثير تفاعلي مبهر عند النقر: دوران كامل 360° حول نفسه يتبعه نبض مستمر يرمز للمعرفة المتجددة
 */
export const IlmBrandLogo: React.FC<IlmBrandLogoProps> = ({
  size = 'md',
  showSubtitle = true,
  className = '',
  onClick,
  withAura = true,
  textColor,
  kasrahColor,
  subtitleColor,
  horizontal = false,
  interactive = true,
}) => {
  const [isSpinning, setIsSpinning] = useState(false);
  const [spinKey, setSpinKey] = useState(0);

  // Size Configurations - Refined with lighter/thinner elegant font weight
  const sizeConfig = {
    xs: {
      text: 'text-xl sm:text-2xl',
      kasrah: 'text-lg sm:text-xl -bottom-1.5 right-0.5 sm:right-1',
      subtitle: 'text-[8px] tracking-wider',
      line: 'w-2 h-[1px]',
      gap: 'gap-1',
      shadow: 'drop-shadow-[0_0_8px_rgba(212,175,55,0.45)]',
      sparkleSize: 'w-2.5 h-2.5',
    },
    sm: {
      text: 'text-2xl sm:text-3xl',
      kasrah: 'text-xl sm:text-2xl -bottom-1.5 right-1',
      subtitle: 'text-[9px] tracking-wider',
      line: 'w-2.5 h-[1.5px]',
      gap: 'gap-1',
      shadow: 'drop-shadow-[0_0_10px_rgba(212,175,55,0.5)]',
      sparkleSize: 'w-3 h-3',
    },
    md: {
      text: 'text-3xl sm:text-4xl',
      kasrah: 'text-2xl sm:text-3xl -bottom-2 right-1.5',
      subtitle: 'text-[10px] sm:text-[11px] tracking-widest',
      line: 'w-3 h-[1.5px]',
      gap: 'gap-1.5',
      shadow: 'drop-shadow-[0_0_12px_rgba(212,175,55,0.55)] drop-shadow-[0_0_20px_rgba(245,158,11,0.25)]',
      sparkleSize: 'w-3.5 h-3.5',
    },
    lg: {
      text: 'text-5xl sm:text-6xl',
      kasrah: 'text-4xl sm:text-5xl -bottom-2.5 sm:-bottom-3 right-2 sm:right-2.5',
      subtitle: 'text-xs font-semibold tracking-widest',
      line: 'w-4 h-[2px]',
      gap: 'gap-2',
      shadow: 'drop-shadow-[0_0_16px_rgba(212,175,55,0.6)] drop-shadow-[0_0_28px_rgba(245,158,11,0.3)]',
      sparkleSize: 'w-5 h-5',
    },
    xl: {
      text: 'text-6xl sm:text-7xl',
      kasrah: 'text-5xl sm:text-6xl -bottom-3 sm:-bottom-3.5 right-2.5 sm:right-3',
      subtitle: 'text-xs sm:text-sm font-semibold tracking-[0.25em]',
      line: 'w-5 h-[2px]',
      gap: 'gap-2.5',
      shadow: 'drop-shadow-[0_0_20px_rgba(212,175,55,0.65)] drop-shadow-[0_0_36px_rgba(245,158,11,0.35)]',
      sparkleSize: 'w-6 h-6',
    },
  }[size];

  const mainTextColor = textColor || 'text-slate-900';
  const markKasrahColor = kasrahColor || '#0F2B5C';
  const subColor = subtitleColor || '#0F2B5C';

  const handleClick = (e: React.MouseEvent) => {
    if (onClick) {
      onClick();
    }
    
    if (interactive && !isSpinning) {
      // Trigger a single 360-degree rotation and settle firmly
      setIsSpinning(true);
      setSpinKey(prev => prev + 1);
    }
  };

  const handleAnimationComplete = () => {
    if (isSpinning) {
      setIsSpinning(false);
    }
  };

  return (
    <div
      onClick={handleClick}
      className={`relative inline-flex ${horizontal ? 'flex-row items-center gap-2' : 'flex-col items-center justify-center'} select-none bg-transparent group cursor-pointer transition-transform active:scale-95 ${className}`}
      dir="rtl"
      title="انقر على الشعار للدوران وتجديد نور المعرفة ✨"
      style={{ perspective: 1000 }}
    >
      {/* 🌟 1. Golden blurred edges aura */}
      {withAura && (
        <>
          <motion.div
            className="absolute inset-0 bg-gradient-to-tr from-amber-400/40 via-yellow-400/35 to-amber-500/30 rounded-full blur-2xl pointer-events-none scale-150"
            animate={
              isSpinning
                ? { scale: [1.3, 2.1, 1.3], opacity: [0.35, 0.9, 0.35] }
                : { scale: 1.3, opacity: 0.35 }
            }
            transition={{
              duration: isSpinning ? 0.95 : 0.4,
              ease: 'easeInOut',
            }}
          />
          <motion.div
            className="absolute -inset-2 bg-amber-400/25 rounded-full blur-xl pointer-events-none"
            animate={
              isSpinning
                ? { scale: [1, 1.5, 1], opacity: [0.25, 0.8, 0.25] }
                : { opacity: 0.25 }
            }
            transition={{
              duration: isSpinning ? 0.95 : 0.4,
              ease: 'easeInOut',
            }}
          />
        </>
      )}

      {/* 🌟 Sparkle burst particles on rotation */}
      <AnimatePresence>
        {isSpinning && (
          <motion.div
            key={spinKey}
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: [0, 1, 0], scale: [0.6, 1.3, 1.6], rotate: [0, 90] }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.9, ease: 'easeOut' }}
            className="absolute inset-0 pointer-events-none flex items-center justify-center z-30"
          >
            <Sparkles className={`${sizeConfig.sparkleSize} text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.9)] absolute -top-1 -right-1`} />
            <Sparkles className={`${sizeConfig.sparkleSize} text-yellow-300 drop-shadow-[0_0_8px_rgba(253,224,71,0.9)] absolute -bottom-1 -left-1`} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* 🌟 2. Rotating Logo Container - Exactly 1 full 360 degree spin and then settles firmly */}
      <motion.div
        key={spinKey}
        className="flex flex-col items-center justify-center"
        initial={{ rotateY: 0, scale: 1 }}
        animate={
          isSpinning
            ? {
                rotateY: [0, 360],
                scale: [1, 1.15, 1],
                filter: [
                  'drop-shadow(0 0 6px rgba(212,175,55,0.4))',
                  'drop-shadow(0 0 20px rgba(212,175,55,0.95))',
                  'drop-shadow(0 0 6px rgba(212,175,55,0.4))',
                ],
              }
            : {
                rotateY: 0,
                scale: 1,
                filter: 'drop-shadow(0 0 6px rgba(212,175,55,0.4))',
              }
        }
        transition={{
          duration: 0.95,
          ease: [0.25, 1, 0.5, 1], // Smooth organic deceleration that settles solidly
        }}
        onAnimationComplete={handleAnimationComplete}
      >
        {/* The Connected Logo Word: عِـلـم with thinner, elegant calligraphy font */}
        <div className={`relative z-10 font-brand font-medium tracking-tight ${mainTextColor} flex items-center justify-center ${sizeConfig.text} ${sizeConfig.shadow}`}>
          {/* Connected Arabic letters: عـلـم */}
          <span className="relative inline-block font-serif">
            {/* Base joined cursive text: عـلـم with medium/thinner weight */}
            <span className="tracking-normal font-medium font-brand">عـلـم</span>
            
            {/* 🌊 The distinctive navy blue feature / mark under the letter 'عِ' (الميزة الكحلية تحت حرف ال عِ) */}
            <span
              aria-hidden="true"
              className={`absolute z-20 font-semibold pointer-events-none select-none drop-shadow-[0_0_6px_rgba(15,43,92,0.45)] ${sizeConfig.kasrah}`}
              style={{
                color: markKasrahColor,
                fontFamily: "'Amiri', 'Noto Naskh Arabic', serif",
                lineHeight: 1,
              }}
            >
              ِ
            </span>
          </span>
        </div>

        {/* 🌟 3. Navy blue feature line and subtitle mark under 'عِ' */}
        {showSubtitle && (
          <div className={`relative z-10 flex items-center ${sizeConfig.gap} ${horizontal ? '' : 'mt-0.5 sm:mt-1'}`}>
            <span className={`${sizeConfig.line} rounded-full`} style={{ backgroundColor: subColor }} />
            <span
              className={`${sizeConfig.subtitle} font-bold uppercase font-sans drop-shadow-2xs`}
              style={{ color: subColor }}
            >
              ILM
            </span>
            <span className={`${sizeConfig.line} rounded-full`} style={{ backgroundColor: subColor }} />
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default IlmBrandLogo;
