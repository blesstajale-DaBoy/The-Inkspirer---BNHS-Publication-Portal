import React from 'react';
import { Download, Feather, Newspaper, Bookmark, Printer, ShieldCheck } from 'lucide-react';
import { InkspirerLogo } from './InkspirerLogo';
import { FacebookQrCode } from './FacebookQrCode';

interface MastheadProps {
  onOpenSubmit: () => void;
  onOpenDownloadPortal: () => void;
  onOpenEditorialDesk: () => void;
  onScrollToStories: () => void;
  bookmarksCount: number;
  onFilterBookmarks: () => void;
  showingBookmarks: boolean;
}

export const Masthead: React.FC<MastheadProps> = ({
  onOpenSubmit,
  onOpenDownloadPortal,
  onOpenEditorialDesk,
  onScrollToStories,
  bookmarksCount,
  onFilterBookmarks,
  showingBookmarks,
}) => {
  return (
    <div className="border-b border-[#58111A] bg-[#4A0E17] text-white">
      {/* Upper Publication Dateline & Accreditation */}
      <div className="border-b border-[#58111A] bg-[#3B0910] px-6 py-2">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3 text-xs text-stone-300">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-[#F3C562] tracking-wide">
              REPUBLIC OF THE PHILIPPINES
            </span>
            <span aria-hidden="true" className="text-stone-500">·</span>
            <span>Department of Education</span>
            <span aria-hidden="true" className="text-stone-500">·</span>
            <span>Region XIII Caraga</span>
            <span aria-hidden="true" className="text-stone-500">·</span>
            <span>Division of Surigao del Sur</span>
          </div>

          <div className="flex items-center gap-4 text-stone-300">
            <span>Vol. XXIV · Issue No. 1</span>
            <span aria-hidden="true" className="text-stone-500">·</span>
            <span>Academic Year 2026–2027</span>
            <span aria-hidden="true" className="text-stone-500">·</span>
            <button
              onClick={() => window.print()}
              className="hover:text-white inline-flex items-center gap-1 transition-colors text-stone-300"
              title="Print newspaper edition"
            >
              <Printer className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>Print Edition</span>
            </button>
          </div>
        </div>
      </div>

      {/* Hero Masthead Presentation */}
      <div className="max-w-7xl mx-auto px-6 py-8 sm:py-12 text-center relative">
        {/* Facebook Page QR Code pinned at the top right side */}
        <div className="absolute top-2 right-3 sm:top-4 sm:right-6 md:top-6 md:right-8 z-30">
          <FacebookQrCode size={62} className="scale-85 sm:scale-100 origin-top-right shadow-2xl" />
        </div>

        {/* Uploaded Barobo National High School Official Seal */}
        <div className="flex flex-col items-center justify-center mb-3">
          <div className="relative group p-1 rounded-full bg-white/10 backdrop-blur-xs border-2 border-[#D4AF37]/80 shadow-2xl hover:border-[#F3C562] transition-all">
            <img
              src="/assets/aistudio/BNHS_LOGO_29bb7e4c.jpg"
              alt="Barobo National High School Official Seal"
              className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 object-contain rounded-full shadow-inner transform group-hover:scale-105 transition-transform duration-300"
              loading="eager"
            />
          </div>
        </div>

        {/* School Name and Seal Framing */}
        <div className="inline-flex items-center gap-2 mb-4 text-xs uppercase tracking-[0.25em] font-semibold text-[#F3C562]">
          <span className="h-px w-8 bg-[#D4AF37]/60" />
          <span>Barobo National High School</span>
          <span className="h-px w-8 bg-[#D4AF37]/60" />
        </div>

        {/* The Inkspirer Official Publication Emblem Logo above THE INKSPIRER */}
        <div className="flex flex-col items-center justify-center mb-2">
          <InkspirerLogo size="hero" className="hover:scale-105 transition-transform duration-300" />
        </div>

        {/* Master Newspaper Name */}
        <h1 className="font-brand text-5xl sm:text-7xl lg:text-8xl font-black tracking-tight text-white mb-3 drop-shadow-sm">
          THE INKSPIRER
        </h1>

        {/* Tagline & Subtitle */}
        <div className="space-y-2 mb-8">
          <p className="text-xs sm:text-sm font-semibold tracking-[0.2em] uppercase text-[#D4AF37]">
            THE OFFICIAL DIGITAL NEWSLETTER PORTAL
          </p>
          <p className="font-serif italic text-xl sm:text-2xl text-stone-100">
            “Ideas in ink. Voices in motion.”
          </p>
          <p className="max-w-2xl mx-auto text-sm sm:text-base text-stone-200 leading-relaxed pt-2">
            Campus news, student perspectives, inspiring features, sports highlights, and school announcements—all in one place.
          </p>
        </div>

        {/* Hero Interactive CTAs */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <button
            onClick={onScrollToStories}
            className="px-6 py-2.5 text-sm font-bold text-stone-900 bg-[#D4AF37] hover:bg-[#E5BE4A] rounded transition-all shadow-xs flex items-center gap-2"
          >
            <span>Explore Stories</span>
            <span aria-hidden="true">↓</span>
          </button>

          <button
            onClick={onOpenSubmit}
            className="px-6 py-2.5 text-sm font-medium text-white bg-[#5C1521] border border-[#781B2B] rounded hover:bg-[#6D1B29] transition-all flex items-center gap-2"
          >
            <Feather className="w-4 h-4 text-[#D4AF37]" />
            <span>Submit a Story</span>
          </button>

          <button
            onClick={onOpenEditorialDesk}
            className="px-5 py-2.5 text-sm font-bold text-stone-900 bg-[#F3C562] hover:bg-[#E5BE4A] rounded shadow-xs flex items-center gap-2 transition-all border border-[#D4AF37]"
            title="Create, edit, delete, and upload photos for all Publication Categories"
          >
            <ShieldCheck className="w-4 h-4 text-[#4A0E17]" />
            <span>Editorial Desk & Categories</span>
          </button>

          <button
            onClick={onOpenDownloadPortal}
            className="px-4 py-2.5 text-xs sm:text-sm font-medium text-stone-200 bg-[#3B0910] border border-[#58111A] rounded hover:bg-[#480D15] transition-colors flex items-center gap-2"
            title="Download offline website file"
          >
            <Download className="w-4 h-4 text-[#D4AF37]" />
            <span>Download Portal (HTML)</span>
          </button>

          {bookmarksCount > 0 && (
            <button
              onClick={onFilterBookmarks}
              className={`px-4 py-2.5 text-xs sm:text-sm font-medium rounded border transition-colors flex items-center gap-2 ${
                showingBookmarks
                  ? 'bg-amber-400 text-stone-900 border-amber-300 font-semibold'
                  : 'bg-[#3B0910] border-[#58111A] text-stone-200 hover:bg-[#480D15]'
              }`}
            >
              <Bookmark className="w-4 h-4 text-amber-400 fill-amber-400" />
              <span>Saved Articles ({bookmarksCount})</span>
            </button>
          )}
        </div>
      </div>

      {/* Editorial Quality & Trust Line */}
      <div className="border-t border-[#58111A] bg-[#38080F]/90 py-2.5 px-6">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between text-xs text-stone-300 gap-4">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#34D399]" />
            <span>Regulated by Republic Act No. 7079 (Campus Journalism Act of 1991)</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-stone-200 font-medium">Circulation: 2,800+ Students & Faculty</span>
            <span aria-hidden="true" className="text-stone-500">·</span>
            <span>ISSN 2984-7125 (Electronic)</span>
          </div>
        </div>
      </div>
    </div>
  );
};
