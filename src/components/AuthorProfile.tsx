import React from 'react';
import { Feather, Award, BookOpen, PenTool, CheckCircle2 } from 'lucide-react';

interface AuthorProfileProps {
  author: string;
  role: string;
  bio?: string;
  avatarSeed?: string;
  variant?: 'card' | 'reader-header' | 'reader-card';
  className?: string;
}

// Generate distinct editorial colors based on author name for cohesive personality
const getAuthorAvatarStyle = (name: string) => {
  const hash = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const colorPalettes = [
    { bg: 'bg-[#4A0E17]', text: 'text-[#F3C562]', border: 'border-[#D4AF37]' },
    { bg: 'bg-[#0B2545]', text: 'text-[#93C5FD]', border: 'border-[#60A5FA]' },
    { bg: 'bg-[#064E3B]', text: 'text-[#6EE7B7]', border: 'border-[#34D399]' },
    { bg: 'bg-[#581C87]', text: 'text-[#E9D5FF]', border: 'border-[#C084FC]' },
    { bg: 'bg-[#7C2D12]', text: 'text-[#FED7AA]', border: 'border-[#FB923C]' },
    { bg: 'bg-[#1E293B]', text: 'text-[#FDE047]', border: 'border-[#FACC15]' },
  ];
  return colorPalettes[hash % colorPalettes.length];
};

const getInitials = (name: string) => {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

export const AuthorProfile: React.FC<AuthorProfileProps> = ({
  author,
  role,
  bio,
  avatarSeed,
  variant = 'card',
  className = '',
}) => {
  const avatarStyle = getAuthorAvatarStyle(author);
  const initials = getInitials(author);
  const displayBio =
    bio ||
    `Staff writer at Barobo National High School's official publication, The Inkspirer.`;

  // Variant 1: For StoryCard / StoryGrid
  if (variant === 'card') {
    return (
      <div className={`flex items-start gap-2.5 text-left w-full ${className}`}>
        {/* Small Profile Icon / Avatar */}
        <div className="relative shrink-0 mt-0.5">
          <div
            className={`w-8 h-8 rounded-full ${avatarStyle.bg} ${avatarStyle.text} border ${avatarStyle.border} flex items-center justify-center font-bold text-xs tracking-wider shadow-xs select-none`}
            title={`${author} · ${role}`}
          >
            {initials}
          </div>
          <span
            className="absolute -bottom-1 -right-1 bg-white rounded-full p-0.5 shadow-xs border border-stone-200"
            title="Verified BNHS Student Journalist"
          >
            <Feather className="w-2.5 h-2.5 text-[#4A0E17]" />
          </span>
        </div>

        {/* Writer Name & Bio Details */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="font-semibold text-stone-900 text-xs truncate max-w-[170px]">
              {author}
            </span>
            <span className="text-[10px] text-stone-500 font-medium truncate">
              · {role}
            </span>
          </div>
          {/* Short Bio */}
          <p
            className="text-[11px] text-stone-600 line-clamp-2 leading-relaxed mt-0.5 font-normal"
            title={displayBio}
          >
            {displayBio}
          </p>
        </div>
      </div>
    );
  }

  // Variant 2: For ArticleReaderModal Header Byline
  if (variant === 'reader-header') {
    return (
      <div className={`flex items-center gap-3 text-left ${className}`}>
        {/* Small Profile Icon / Avatar */}
        <div className="relative shrink-0">
          <div
            className={`w-10 h-10 rounded-full ${avatarStyle.bg} ${avatarStyle.text} border-2 ${avatarStyle.border} flex items-center justify-center font-bold text-sm tracking-wider shadow-sm select-none`}
          >
            {initials}
          </div>
          <span className="absolute -bottom-1 -right-1 bg-white rounded-full p-0.5 shadow-xs border border-stone-200">
            <Feather className="w-3 h-3 text-[#4A0E17]" />
          </span>
        </div>

        {/* Name, Role & Short Bio snippet */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-bold text-stone-900 text-sm">{author}</span>
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#4A0E17] bg-[#4A0E17]/10 px-2 py-0.5 rounded">
              <CheckCircle2 className="w-3 h-3 text-[#4A0E17]" />
              {role}
            </span>
          </div>
          <p className="text-xs text-stone-600 line-clamp-1 mt-0.5">
            {displayBio}
          </p>
        </div>
      </div>
    );
  }

  // Variant 3: Dedicated "About the Author" Editorial Card in ArticleReaderModal
  return (
    <div
      className={`p-5 rounded-lg border border-stone-200 bg-white shadow-xs ${className}`}
    >
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
        {/* Profile Icon with decorative ring */}
        <div className="relative shrink-0">
          <div
            className={`w-14 h-14 rounded-full ${avatarStyle.bg} ${avatarStyle.text} border-2 ${avatarStyle.border} flex items-center justify-center font-bold text-lg tracking-wider shadow-md select-none`}
          >
            {initials}
          </div>
          <div className="absolute -bottom-1 -right-1 bg-[#D4AF37] text-stone-900 rounded-full p-1 shadow-xs border-2 border-white">
            <Feather className="w-3 h-3" />
          </div>
        </div>

        {/* Details & Full Bio */}
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider text-[#4A0E17]">
              Written by
            </span>
            <span className="text-stone-300">·</span>
            <h4 className="font-serif text-lg font-bold text-stone-900 leading-snug">
              {author}
            </h4>
            <span className="text-xs font-semibold text-stone-600 bg-stone-100 border border-stone-200 px-2.5 py-0.5 rounded-full">
              {role}
            </span>
          </div>

          <p className="text-xs sm:text-sm text-stone-700 leading-relaxed font-sans mb-2">
            {displayBio}
          </p>

          <div className="flex flex-wrap items-center gap-3 text-[11px] text-stone-500 pt-1 border-t border-stone-100">
            <span className="flex items-center gap-1 text-stone-600">
              <BookOpen className="w-3 h-3 text-[#D4AF37]" />
              The Inkspirer Student Publication
            </span>
            <span aria-hidden="true" className="text-stone-300">·</span>
            <span>Barobo National High School</span>
            <span aria-hidden="true" className="text-stone-300">·</span>
            <span className="text-emerald-700 font-medium">DepEd Region XIII Caraga</span>
          </div>
        </div>
      </div>
    </div>
  );
};
