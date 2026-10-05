import React, { useState, useEffect, useMemo } from 'react';
import { Language } from '../types';
import { 
  PenLine, 
  Plus, 
  Trash2, 
  Copy, 
  Check, 
  Download, 
  Sparkles, 
  Lightbulb, 
  HelpCircle, 
  BookOpen, 
  ChevronDown, 
  ChevronUp, 
  Clock, 
  Bookmark, 
  Search, 
  X, 
  Filter, 
  FileText, 
  CheckCheck,
  Layers,
  Brain
} from 'lucide-react';

export type NoteCategory = 'memorize' | 'comprehension' | 'inquiry' | 'reflection' | 'action';

export interface NoteItem {
  id: string;
  stageId: string;
  stageTitle: string;
  stageNumber?: number;
  text: string;
  category: NoteCategory;
  timestamp: string;
  dateStr: string;
}

interface LearnerNotepadProps {
  stageId: string;
  stageTitle: string;
  stageNumber: number;
  language: Language;
  defaultExpanded?: boolean;
}

export const LearnerNotepad: React.FC<LearnerNotepadProps> = ({
  stageId,
  stageTitle,
  stageNumber,
  language,
  defaultExpanded = false,
}) => {
  const isAr = language === 'ar';
  const isUr = language === 'ur';
  const isRtl = isAr || isUr;

  const [isExpanded, setIsExpanded] = useState(defaultExpanded);
  const [notes, setNotes] = useState<NoteItem[]>([]);
  const [inputText, setInputText] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<NoteCategory>('comprehension');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilterCategory, setActiveFilterCategory] = useState<'all' | NoteCategory>('all');
  const [scopeFilter, setScopeFilter] = useState<'current_stage' | 'all_stages'>('current_stage');
  
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [justSaved, setJustSaved] = useState(false);
  const [exportSuccess, setExportSuccess] = useState(false);

  // Storage key for all notes
  const STORAGE_KEY = 'eilm_learner_notes_v1';

  // Load all notes from localStorage
  const loadAllNotes = (): NoteItem[] => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (e) {
      console.warn('Error reading notes from localStorage:', e);
      return [];
    }
  };

  // Reload notes when stageId or storage changes
  useEffect(() => {
    const allNotes = loadAllNotes();
    setNotes(allNotes);
  }, [stageId]);

  // Categories definitions (حفظ، فهم، استفسار، تدبر، تطبيق)
  const categories: { 
    id: NoteCategory; 
    labelAr: string; 
    labelEn: string; 
    labelUr: string; 
    icon: string; 
    badgeColor: string; 
    bgHover: string;
    border: string;
  }[] = [
    {
      id: 'memorize',
      labelAr: 'حفظ وتثبيت',
      labelEn: 'Memorize',
      labelUr: 'حفظ و یادداشت',
      icon: '📌',
      badgeColor: 'bg-amber-100 text-amber-900 border-amber-300',
      bgHover: 'hover:bg-amber-50',
      border: 'border-amber-200',
    },
    {
      id: 'comprehension',
      labelAr: 'فهم واستيعاب',
      labelEn: 'Comprehension',
      labelUr: 'فہم و ادراک',
      icon: '💡',
      badgeColor: 'bg-emerald-100 text-emerald-900 border-emerald-300',
      bgHover: 'hover:bg-emerald-50',
      border: 'border-emerald-200',
    },
    {
      id: 'inquiry',
      labelAr: 'استفسار وسؤال',
      labelEn: 'Inquiry',
      labelUr: 'استفسار و سوال',
      icon: '❓',
      badgeColor: 'bg-blue-100 text-blue-900 border-blue-300',
      bgHover: 'hover:bg-blue-50',
      border: 'border-blue-200',
    },
    {
      id: 'reflection',
      labelAr: 'تدبر واستحضار',
      labelEn: 'Reflection',
      labelUr: 'تدبر و تفکر',
      icon: '🌸',
      badgeColor: 'bg-purple-100 text-purple-900 border-purple-300',
      bgHover: 'hover:bg-purple-50',
      border: 'border-purple-200',
    },
    {
      id: 'action',
      labelAr: 'تطبيق وسلوك',
      labelEn: 'Action & Practice',
      labelUr: 'عملی تطبیق',
      icon: '🌿',
      badgeColor: 'bg-teal-100 text-teal-900 border-teal-300',
      bgHover: 'hover:bg-teal-50',
      border: 'border-teal-200',
    },
  ];

  // Notes filtered for current stage
  const currentStageNotes = useMemo(() => {
    return notes.filter((n) => n.stageId === stageId);
  }, [notes, stageId]);

  // Notes filtered by search query, category, and scope
  const filteredNotes = useMemo(() => {
    const baseList = scopeFilter === 'current_stage' ? currentStageNotes : notes;
    
    return baseList.filter((note) => {
      // 1. Category Filter
      const matchCategory = activeFilterCategory === 'all' || note.category === activeFilterCategory;

      // 2. Search Query (Matches note text or stage title)
      const q = searchQuery.trim().toLowerCase();
      const matchQuery = !q || 
        note.text.toLowerCase().includes(q) || 
        note.stageTitle.toLowerCase().includes(q);

      return matchCategory && matchQuery;
    });
  }, [notes, currentStageNotes, scopeFilter, activeFilterCategory, searchQuery]);

  // Category counts for badges
  const categoryCounts = useMemo(() => {
    const targetList = scopeFilter === 'current_stage' ? currentStageNotes : notes;
    const counts: Record<string, number> = { all: targetList.length };
    categories.forEach((c) => {
      counts[c.id] = targetList.filter((n) => n.category === c.id).length;
    });
    return counts;
  }, [notes, currentStageNotes, scopeFilter]);

  // Add new note
  const handleAddNote = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const trimmed = inputText.trim();
    if (!trimmed) return;

    const newNote: NoteItem = {
      id: `note_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      stageId,
      stageTitle,
      stageNumber,
      text: trimmed,
      category: selectedCategory,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      dateStr: new Date().toLocaleDateString(isAr ? 'ar-SA' : 'en-US'),
    };

    try {
      const allNotes = loadAllNotes();
      const updatedAll = [newNote, ...allNotes];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedAll));
      
      setNotes(updatedAll);
      setInputText('');
      setJustSaved(true);
      setTimeout(() => setJustSaved(false), 2000);
    } catch (err) {
      console.error('Error saving note to localStorage:', err);
    }
  };

  // Delete note
  const handleDeleteNote = (noteId: string) => {
    try {
      const allNotes = loadAllNotes();
      const updatedAll = allNotes.filter((n) => n.id !== noteId);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedAll));
      setNotes(updatedAll);
    } catch (err) {
      console.error('Error deleting note from localStorage:', err);
    }
  };

  // Copy note text
  const handleCopyNote = async (note: NoteItem) => {
    try {
      const catObj = categories.find((c) => c.id === note.category);
      const catLabel = isAr ? catObj?.labelAr : catObj?.labelEn;
      const formatted = `📝 [${note.stageTitle}] - ${catLabel} ${catObj?.icon || ''}\n«${note.text}»\n(منصة عِلم المعرفية | ILM Platform)`;
      await navigator.clipboard.writeText(formatted);
      setCopiedId(note.id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      console.warn('Copy error:', err);
    }
  };

  // 📥 Export Stage or All Notes to formatted Text file (.txt or .md)
  const handleExportNotes = (format: 'txt' | 'md' = 'txt') => {
    const listToExport = scopeFilter === 'current_stage' ? currentStageNotes : notes;
    if (listToExport.length === 0) return;

    const isAll = scopeFilter === 'all_stages';
    const timestamp = new Date().toLocaleString(isAr ? 'ar-SA' : 'en-US');
    
    let content = '';

    if (format === 'md') {
      content = `# 📖 مفكرة فوائد وتدبرات منصة عِلم | ILM Platform Notes\n\n` +
        `> **نطاق التصدير**: ${isAll ? 'كافة المحطات والمسارات التعليمية' : `المحطة (${stageNumber}): ${stageTitle}`}\n` +
        `> **تاريخ التصدير**: ${timestamp}\n` +
        `> **إجمالي الملاحظات**: ${listToExport.length} ملاحظة وفائدة\n\n` +
        `---\n\n`;

      listToExport.forEach((n, idx) => {
        const cat = categories.find((c) => c.id === n.category);
        const catLabel = isAr ? cat?.labelAr : cat?.labelEn;
        content += `### ${idx + 1}. ${cat?.icon} ${catLabel} — [${n.stageTitle}]\n` +
          `*التاريخ*: ${n.dateStr} | ${n.timestamp}\n\n` +
          `> ${n.text}\n\n` +
          `---\n\n`;
      });

      content += `\n*المصادر المعتمدة: مجمع الملك فهد لطباعة المصحف الشريف وموسوعات الدرر السنية.*`;
    } else {
      content = `========================================================\n` +
        `📖 مفكرة فوائد وتدبرات منصة عِلم | ILM Platform Notes\n` +
        `نطاق التصدير: ${isAll ? 'كافة المحطات والمسارات التعليمية' : `المحطة (${stageNumber}): ${stageTitle}`}\n` +
        `تاريخ التصدير: ${timestamp}\n` +
        `إجمالي الملاحظات: ${listToExport.length} ملاحظة\n` +
        `========================================================\n\n`;

      listToExport.forEach((n, idx) => {
        const cat = categories.find((c) => c.id === n.category);
        const catLabel = isAr ? cat?.labelAr : cat?.labelEn;
        content += `[${idx + 1}] ${cat?.icon} [${catLabel}] (${n.stageTitle})\n` +
          `الوقت: ${n.timestamp} - ${n.dateStr}\n` +
          `--------------------------------------------------------\n` +
          `${n.text}\n\n`;
      });

      content += `\n✦ المصادر المعتمدة: مجمع الملك فهد لطباعة المصحف الشريف وموسوعات الدرر السنية.`;
    }

    const mimeType = format === 'md' ? 'text/markdown;charset=utf-8' : 'text/plain;charset=utf-8';
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    const scopePrefix = isAll ? 'All-Stages' : `Stage-${stageNumber}`;
    link.download = `ILM-Learner-Notes-${scopePrefix}-${new Date().toISOString().slice(0, 10)}.${format}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setExportSuccess(true);
    setTimeout(() => setExportSuccess(false), 2500);
  };

  return (
    <div className="bg-gradient-to-br from-[#FFFDF9] via-white to-[#FAF7F2] rounded-3xl border border-[#EAE3D6] shadow-xs overflow-hidden transition-all duration-300 luxury-card-glow my-6" dir={isRtl ? 'rtl' : 'ltr'}>
      
      {/* 🧭 Header Bar (Always Visible / Clickable to Toggle) */}
      <div 
        onClick={() => setIsExpanded(!isExpanded)}
        className="p-4 sm:p-5 flex items-center justify-between cursor-pointer hover:bg-amber-50/40 transition select-none"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-900 border border-amber-300/60 flex items-center justify-center shadow-2xs shrink-0">
            <PenLine className="w-5 h-5 text-amber-800" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm sm:text-base font-bold text-slate-900 font-serif">
                {isAr ? 'مفكرة المتعلم والفوائد المقيدة' : isUr ? 'متعلم کی ذاتی نوٹ پیڈ' : 'Learner\'s Notepad & Reflections'}
              </h3>
              {currentStageNotes.length > 0 && (
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-amber-500 text-white shadow-3xs">
                  {currentStageNotes.length}
                </span>
              )}
            </div>
            <p className="text-[11px] text-slate-500">
              {isAr 
                ? 'قيّد شوارد العلم والفوائد (حفظ • فهم • استفسار • تدبر • تطبيق)' 
                : 'Categorize and search your study notes (Memorize • Comprehension • Inquiry)'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {justSaved && (
            <span className="hidden sm:inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full animate-in fade-in">
              <Check className="w-3.5 h-3.5 text-emerald-600" />
              <span>{isAr ? 'تم الحفظ محلياً' : 'Saved'}</span>
            </span>
          )}
          {exportSuccess && (
            <span className="hidden sm:inline-flex items-center gap-1 text-xs font-bold text-blue-700 bg-blue-50 border border-blue-200 px-2.5 py-1 rounded-full animate-in fade-in">
              <CheckCheck className="w-3.5 h-3.5 text-blue-600" />
              <span>{isAr ? 'تم التصدير بنجاح' : 'Exported'}</span>
            </span>
          )}
          <button 
            type="button"
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
            aria-label={isExpanded ? 'Collapse' : 'Expand'}
          >
            {isExpanded ? <ChevronUp className="w-5 h-5 text-amber-800" /> : <ChevronDown className="w-5 h-5 text-slate-500" />}
          </button>
        </div>
      </div>

      {/* 📝 Expandable Notepad Content */}
      {isExpanded && (
        <div className="p-4 sm:p-6 pt-0 border-t border-[#EAE3D6]/70 space-y-5 animate-in fade-in duration-200">
          
          {/* Note Input Box & Category Selector */}
          <form onSubmit={handleAddNote} className="space-y-3 pt-4">
            
            {/* Category Tags Selector with Explicit Options (حفظ، فهم، استفسار، تدبر، تطبيق) */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
              <span className="text-xs font-bold text-slate-500 shrink-0 flex items-center gap-1">
                <Brain className="w-3.5 h-3.5 text-amber-700" />
                <span>{isAr ? 'تصنيف الملاحظة:' : 'Tag Note:'}</span>
              </span>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shrink-0 cursor-pointer border ${
                    selectedCategory === cat.id
                      ? 'bg-amber-900 text-white border-amber-950 shadow-xs'
                      : 'bg-white text-slate-700 hover:bg-amber-50/60 border-slate-200'
                  }`}
                >
                  <span>{cat.icon}</span>
                  <span>{isAr ? cat.labelAr : isUr ? cat.labelUr : cat.labelEn}</span>
                </button>
              ))}
            </div>

            {/* Textarea Input Area */}
            <div className="relative">
              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder={
                  selectedCategory === 'memorize' 
                    ? (isAr ? 'اكتب الآية، الحديث، أو النص المراد حفظه وتثبيته...' : 'Record scripture or text to memorize...')
                    : selectedCategory === 'inquiry'
                    ? (isAr ? 'اكتب سؤالك أو استفسارك الذي ترغب في بحثه أو طرحه على المعلم الذكي...' : 'Record a question or inquiry to review...')
                    : (isAr ? 'اكتب خاطرتك، فائدتك المستخلصة، أو تدبرك في هذه المحطة...' : 'Write down your key takeaway, insight, or reflection...')
                }
                rows={2}
                className="w-full px-4 py-3 bg-white rounded-2xl border border-slate-200 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 transition resize-none shadow-3xs"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleAddNote();
                  }
                }}
              />

              <div className="flex items-center justify-between pt-2">
                <span className="text-[11px] text-slate-400">
                  {isAr ? 'اضغط Enter للحفظ السريع في المتصفح' : 'Press Enter to save note locally'}
                </span>

                <button
                  type="submit"
                  disabled={!inputText.trim()}
                  className="px-4 py-2 rounded-xl bg-amber-800 hover:bg-amber-900 disabled:opacity-40 text-white text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-xs disabled:cursor-not-allowed"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>{isAr ? 'حفظ الملاحظة' : 'Save Note'}</span>
                </button>
              </div>
            </div>
          </form>

          {/* 🔍 Search & Category Filter Control Hub */}
          <div className="p-3.5 bg-white rounded-2xl border border-slate-200/80 shadow-3xs space-y-3">
            
            {/* Search Input and Scope Toggle */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
              
              {/* Search Bar */}
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={isAr ? 'بحث سريع في الملاحظات والفوائد...' : 'Search notes & takeaways...'}
                  className="w-full pr-9 pl-8 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:bg-white focus:ring-2 focus:ring-amber-400/30 transition"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Scope Switcher (Current Stage vs All Stages) */}
              <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl border border-slate-200 text-xs shrink-0">
                <button
                  type="button"
                  onClick={() => setScopeFilter('current_stage')}
                  className={`px-3 py-1 rounded-lg font-bold transition ${
                    scopeFilter === 'current_stage'
                      ? 'bg-white text-slate-900 shadow-3xs'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  {isAr ? 'هذه المحطة' : 'This Stage'} ({currentStageNotes.length})
                </button>
                <button
                  type="button"
                  onClick={() => setScopeFilter('all_stages')}
                  className={`px-3 py-1 rounded-lg font-bold transition ${
                    scopeFilter === 'all_stages'
                      ? 'bg-white text-slate-900 shadow-3xs'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  {isAr ? 'كافة المحطات' : 'All Stages'} ({notes.length})
                </button>
              </div>

            </div>

            {/* Filter Category Tabs with Dynamic Badges */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-[11px]">
              <button
                type="button"
                onClick={() => setActiveFilterCategory('all')}
                className={`px-2.5 py-1 rounded-lg font-bold transition flex items-center gap-1 shrink-0 ${
                  activeFilterCategory === 'all'
                    ? 'bg-slate-900 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                <span>{isAr ? 'الكل' : 'All'}</span>
                <span className="font-mono text-[10px]">({categoryCounts.all || 0})</span>
              </button>

              {categories.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setActiveFilterCategory(c.id)}
                  className={`px-2.5 py-1 rounded-lg font-bold transition flex items-center gap-1 shrink-0 ${
                    activeFilterCategory === c.id
                      ? 'bg-amber-800 text-white shadow-3xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  <span>{c.icon}</span>
                  <span>{isAr ? c.labelAr : c.labelEn}</span>
                  <span className="font-mono text-[10px]">({categoryCounts[c.id] || 0})</span>
                </button>
              ))}
            </div>

          </div>

          {/* Notes List & Export Action Header */}
          <div className="space-y-3 pt-1">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <Bookmark className="w-3.5 h-3.5 text-amber-700" />
                <span>
                  {scopeFilter === 'current_stage' 
                    ? (isAr ? 'الملاحظات المطابقة للمحطة' : 'Notes for this Milestone') 
                    : (isAr ? 'كافة الملاحظات المحفوظة' : 'All Recorded Notes')}
                </span>
                <span className="text-slate-400 font-normal font-mono">({filteredNotes.length})</span>
              </span>

              {/* Multi-format Export Actions */}
              {filteredNotes.length > 0 && (
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleExportNotes('txt')}
                    className="text-[11px] font-bold text-amber-900 bg-amber-50 hover:bg-amber-100 border border-amber-200 px-2.5 py-1 rounded-lg flex items-center gap-1 cursor-pointer transition shadow-3xs"
                    title={isAr ? 'تصدير كمستند نصي TXT' : 'Export as text file'}
                  >
                    <Download className="w-3 h-3 text-amber-700" />
                    <span>TXT</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleExportNotes('md')}
                    className="text-[11px] font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200 px-2.5 py-1 rounded-lg flex items-center gap-1 cursor-pointer transition shadow-3xs"
                    title={isAr ? 'تصدير كملف ماركداون Markdown' : 'Export as Markdown'}
                  >
                    <FileText className="w-3 h-3 text-slate-600" />
                    <span>MD</span>
                  </button>
                </div>
              )}
            </div>

            {/* Empty State */}
            {filteredNotes.length === 0 ? (
              <div className="text-center py-6 px-4 bg-white/60 rounded-2xl border border-dashed border-slate-200 text-slate-400 space-y-1.5">
                <Lightbulb className="w-6 h-6 mx-auto text-amber-400/80" />
                <p className="text-xs font-medium text-slate-600">
                  {searchQuery 
                    ? (isAr ? 'لا توجد ملاحظات تطابق معايير البحث الحالية.' : 'No notes match the search query.')
                    : (isAr ? 'لم تقيّد أي ملاحظة في هذا التصنيف بعد.' : 'No notes in this category yet.')}
                </p>
                <p className="text-[11px] text-slate-400">
                  {isAr ? '«قيّدوا العلم بالكتابة» - اختر تصنيفاً (حفظ • فهم • استفسار) ودوّن فائدتك.' : 'Choose a category to record and classify your insights.'}
                </p>
              </div>
            ) : (
              /* Notes Stream */
              <div className="space-y-2.5 max-h-80 overflow-y-auto pr-1">
                {filteredNotes.map((note) => {
                  const cat = categories.find((c) => c.id === note.category) || categories[1];
                  return (
                    <div
                      key={note.id}
                      className="p-3.5 bg-white rounded-2xl border border-slate-200/80 shadow-3xs space-y-2 hover:border-amber-300/70 transition group relative"
                    >
                      <div className="flex items-center justify-between text-[11px]">
                        <div className="flex items-center gap-2">
                          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-lg font-bold border ${cat.badgeColor}`}>
                            <span>{cat.icon}</span>
                            <span>{isAr ? cat.labelAr : cat.labelEn}</span>
                          </span>

                          {scopeFilter === 'all_stages' && (
                            <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md truncate max-w-[140px]">
                              {note.stageTitle}
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-2 text-slate-400">
                          <span className="flex items-center gap-1 font-mono text-[10px]">
                            <Clock className="w-3 h-3" />
                            <span>{note.timestamp}</span>
                          </span>

                          <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition">
                            <button
                              type="button"
                              onClick={() => handleCopyNote(note)}
                              className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer"
                              title={isAr ? 'نسخ الملاحظة' : 'Copy'}
                            >
                              {copiedId === note.id ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                            </button>

                            <button
                              type="button"
                              onClick={() => handleDeleteNote(note.id)}
                              className="p-1 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition cursor-pointer"
                              title={isAr ? 'حذف' : 'Delete'}
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>

                      <p className="text-xs sm:text-sm text-slate-800 leading-relaxed font-sans whitespace-pre-wrap">
                        {note.text}
                      </p>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

        </div>
      )}

    </div>
  );
};
