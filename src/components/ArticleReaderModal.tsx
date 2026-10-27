import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Bookmark,
  Heart,
  Share2,
  Printer,
  Calendar,
  Clock,
  User,
  Quote,
  Check,
  Volume2,
  VolumeX,
} from 'lucide-react';
import { Article } from '../types';
import { EditorialArtwork } from './EditorialArtwork';
import { InkspirerLogo } from './InkspirerLogo';
import { AuthorProfile } from './AuthorProfile';
import { ArticleComments } from './ArticleComments';

interface ArticleReaderModalProps {
  article: Article | null;
  onClose: () => void;
  isBookmarked: boolean;
  onToggleBookmark: (id: string, e: React.MouseEvent) => void;
  isLiked: boolean;
  onToggleLike: (id: string, e: React.MouseEvent) => void;
}

export const ArticleReaderModal: React.FC<ArticleReaderModalProps> = ({
  article,
  onClose,
  isBookmarked,
  onToggleBookmark,
  isLiked,
  onToggleLike,
}) => {
  const [fontSize, setFontSize] = useState<'normal' | 'large' | 'xl'>('normal');
  const [copiedShare, setCopiedShare] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [readingProgress, setReadingProgress] = useState(0);
  const outerContainerRef = useRef<HTMLDivElement>(null);
  const articleBodyRef = useRef<HTMLDivElement>(null);

  // Reset reading progress when opening a new article
  useEffect(() => {
    setReadingProgress(0);
  }, [article?.id]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.speechSynthesis?.cancel();
    };
  }, [onClose]);

  if (!article) return null;

  const handleScroll = (e: React.UIEvent<HTMLElement>) => {
    const target = e.currentTarget;
    const scrollTop = target.scrollTop;
    const maxScroll = target.scrollHeight - target.clientHeight;
    if (maxScroll > 10) {
      const progress = Math.min(100, Math.max(0, (scrollTop / maxScroll) * 100));
      setReadingProgress(progress);
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(
      `"${article.title}" — Read on The Inkspirer (Barobo National High School Official Publication)`
    );
    setCopiedShare(true);
    setTimeout(() => setCopiedShare(false), 2500);
  };

  const handleSpeechToggle = () => {
    if (!window.speechSynthesis) return;

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    } else {
      const textToRead = `${article.title}. By ${article.author}. ${article.deck}. ${article.content.join(' ')}`;
      const utterance = new SpeechSynthesisUtterance(textToRead);
      utterance.rate = 1.0;
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
      setIsSpeaking(true);
    }
  };

  const getFontSizeClass = () => {
    switch (fontSize) {
      case 'large':
        return 'text-lg leading-relaxed';
      case 'xl':
        return 'text-xl leading-loose';
      default:
        return 'text-base leading-relaxed';
    }
  };

  return (
    <div
      ref={outerContainerRef}
      onScroll={handleScroll}
      className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/80 backdrop-blur-xs flex justify-center p-0 sm:p-4 md:p-6"
    >
      <div className="bg-[#FBF9F5] text-[#1C1917] w-full max-w-4xl min-h-screen sm:min-h-0 sm:rounded-lg shadow-2xl border border-stone-200 flex flex-col overflow-hidden my-auto relative">
        {/* Scroll-Linked Reading Progress Bar Pinned at Top of Modal */}
        <div
          className="sticky top-0 left-0 right-0 z-30 w-full h-1.5 sm:h-2 bg-stone-200/90 overflow-hidden shadow-inner"
          role="progressbar"
          aria-valuenow={Math.round(readingProgress)}
          aria-valuemin={0}
          aria-valuemax={100}
          title={`Reading progress: ${Math.round(readingProgress)}%`}
        >
          <div
            className="h-full bg-linear-to-r from-[#D4AF37] via-[#FB923C] to-[#781423] transition-[width] duration-150 ease-out rounded-r-full shadow-xs"
            style={{ width: `${readingProgress}%` }}
          />
        </div>

        {/* Sticky Utility Header */}
        <div className="sticky top-1.5 sm:top-2 z-20 bg-white/95 backdrop-blur-sm border-b border-stone-200 px-6 py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2.5 text-xs text-stone-500 truncate">
            {/* BNHS Logo & Inkspirer Emblem */}
            <img
              src="/assets/aistudio/BNHS_LOGO_29bb7e4c.jpg"
              alt="BNHS Logo"
              className="w-5 h-5 object-contain rounded-full border border-[#D4AF37]/80 shrink-0"
            />
            <InkspirerLogo size="sm" className="w-5 h-5 shrink-0 hidden xs:inline-flex" />
            <span className="font-semibold text-[#0B2545] font-brand hidden sm:inline">
              THE INKSPIRER
            </span>
            <span className="hidden sm:inline" aria-hidden="true">·</span>
            <span className="font-semibold text-[#133E87]">{article.category} Desk</span>
            <span aria-hidden="true">·</span>
            <span className="truncate hidden md:inline">{article.issue}</span>

            {/* Reading progress badge in header */}
            <span className="ml-1 inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-stone-100 text-[#4A0E17] border border-stone-200 shrink-0">
              <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]" />
              <span>{Math.round(readingProgress)}%</span>
            </span>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {/* Font Size Selector */}
            <div className="hidden sm:flex items-center bg-stone-100 rounded border border-stone-200 p-0.5 text-xs text-stone-700">
              <button
                onClick={() => setFontSize('normal')}
                className={`px-2 py-0.5 rounded ${fontSize === 'normal' ? 'bg-white font-bold shadow-2xs' : ''}`}
                title="Default text size"
              >
                A
              </button>
              <button
                onClick={() => setFontSize('large')}
                className={`px-2 py-0.5 rounded ${fontSize === 'large' ? 'bg-white font-bold shadow-2xs' : ''}`}
                title="Larger text size"
              >
                A+
              </button>
              <button
                onClick={() => setFontSize('xl')}
                className={`px-2 py-0.5 rounded ${fontSize === 'xl' ? 'bg-white font-bold shadow-2xs' : ''}`}
                title="Maximum text size"
              >
                A++
              </button>
            </div>

            {/* Audio Reader */}
            <button
              onClick={handleSpeechToggle}
              className={`p-2 rounded text-stone-600 hover:text-stone-900 hover:bg-stone-100 transition-colors ${
                isSpeaking ? 'text-[#133E87] bg-blue-50' : ''
              }`}
              title={isSpeaking ? 'Stop listening' : 'Listen to story'}
            >
              {isSpeaking ? <VolumeX className="w-4 h-4 text-blue-700" /> : <Volume2 className="w-4 h-4" />}
            </button>

            {/* Print */}
            <button
              onClick={() => window.print()}
              className="p-2 rounded text-stone-600 hover:text-stone-900 hover:bg-stone-100 transition-colors"
              title="Print article"
            >
              <Printer className="w-4 h-4" />
            </button>

            {/* Share */}
            <button
              onClick={handleShare}
              className="p-2 rounded text-stone-600 hover:text-stone-900 hover:bg-stone-100 transition-colors relative"
              title="Copy share link"
            >
              {copiedShare ? (
                <Check className="w-4 h-4 text-emerald-600" />
              ) : (
                <Share2 className="w-4 h-4" />
              )}
            </button>

            {/* Like */}
            <button
              onClick={(e) => onToggleLike(article.id, e)}
              className={`p-2 rounded transition-colors ${
                isLiked ? 'text-rose-600 bg-rose-50' : 'text-stone-600 hover:bg-stone-100'
              }`}
              title="Like article"
            >
              <Heart className={`w-4 h-4 ${isLiked ? 'fill-rose-600' : ''}`} />
            </button>

            {/* Bookmark */}
            <button
              onClick={(e) => onToggleBookmark(article.id, e)}
              className={`p-2 rounded transition-colors ${
                isBookmarked ? 'text-amber-700 bg-amber-50' : 'text-stone-600 hover:bg-stone-100'
              }`}
              title={isBookmarked ? 'Saved to bookmarks' : 'Bookmark article'}
            >
              <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-amber-600 text-amber-600' : ''}`} />
            </button>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="p-2 rounded text-stone-500 hover:text-stone-900 hover:bg-stone-100 transition-colors ml-1"
              title="Close reader"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Article Body */}
        <div
          ref={articleBodyRef}
          onScroll={handleScroll}
          className="p-6 sm:p-10 lg:p-12 overflow-y-auto max-w-3xl mx-auto w-full"
        >
          {/* Category & Date Metadata Header */}
          {(() => {
            const contentString = Array.isArray(article.content) ? article.content.join(' ') : (article.content || '');
            const totalWords = `${article.title || ''} ${article.deck || ''} ${contentString} ${article.pullQuote || ''}`
              .trim()
              .split(/\s+/)
              .filter(Boolean).length;
            const calculatedMinutes = Math.max(1, Math.ceil(totalWords / 200));
            const calculatedReadTime = `${calculatedMinutes} min read`;

            return (
              <div className="flex flex-wrap items-center gap-2 text-xs text-stone-500 mb-3">
                <span className="font-bold uppercase tracking-wider text-[#133E87]">
                  {article.category}
                </span>
                <span aria-hidden="true">·</span>
                <span>Published {article.date}</span>
                <span aria-hidden="true">·</span>
                <span className="flex items-center gap-1 font-medium text-stone-700">
                  <Clock className="w-3.5 h-3.5 text-stone-400" />
                  <span>{calculatedReadTime}</span>
                </span>
                <span aria-hidden="true">·</span>
                <span className="tabular-nums">{article.views} views</span>
              </div>
            );
          })()}

          {/* Headline */}
          <h1
            className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-stone-900 leading-[1.2] tracking-tight mb-4"
            style={{ textWrap: 'balance' }}
          >
            {article.title}
          </h1>

          {/* Subtitle / Deck */}
          <p className="font-sans text-lg sm:text-xl text-stone-600 leading-relaxed mb-6 font-normal">
            {article.deck}
          </p>

          {/* Byline Strip with Author Component */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-y border-stone-200 py-3.5 mb-8 gap-3">
            <AuthorProfile
              author={article.author}
              role={article.authorRole}
              bio={article.authorBio}
              variant="reader-header"
            />

            <div className="text-left sm:text-right text-stone-500 text-xs shrink-0 pl-12 sm:pl-0">
              <div className="font-medium text-stone-700">Barobo National High School</div>
              <div className="text-[11px]">Region XIII Caraga · DepEd Division Surigao del Sur</div>
            </div>
          </div>

          {/* Editorial Artwork Hero */}
          <div className="mb-8 rounded border border-stone-200 overflow-hidden shadow-xs">
            <EditorialArtwork
              category={article.category}
              customImageUrl={article.imageUrl}
              className="w-full h-64 sm:h-80"
              variant="lead"
            />
            {article.imageCaption && (
              <div className="bg-white p-3 border-t border-stone-100 text-xs font-serif italic text-stone-600">
                {article.imageCaption}
              </div>
            )}
          </div>

          {/* Pull Quote Highlight */}
          {article.pullQuote && (
            <div className="my-8 py-6 border-y-2 border-stone-200 bg-white/70 px-6 sm:px-8 text-center">
              <Quote className="w-6 h-6 text-[#133E87]/40 mx-auto mb-2" />
              <blockquote className="font-serif italic text-xl sm:text-2xl text-stone-800 leading-relaxed">
                {article.pullQuote}
              </blockquote>
            </div>
          )}

          {/* Story Paragraphs with Drop Cap on the First Paragraph */}
          <div className={`space-y-6 text-stone-800 font-sans ${getFontSizeClass()}`}>
            {article.content.map((paragraph, index) => {
              if (index === 0) {
                // First letter drop cap
                const firstLetter = paragraph.charAt(0);
                const restOfParagraph = paragraph.slice(1);
                return (
                  <p key={index} className="leading-relaxed">
                    <span className="float-left text-5xl sm:text-6xl font-serif font-bold text-[#0B2545] leading-none pr-3 pt-1">
                      {firstLetter}
                    </span>
                    {restOfParagraph}
                  </p>
                );
              }
              return (
                <p key={index} className="leading-relaxed">
                  {paragraph}
                </p>
              );
            })}
          </div>

          {/* Article Footer & Full Author Editorial Profile */}
          <div className="mt-12 pt-8 border-t border-stone-300 space-y-6">
            {/* Dedicated Author Editorial Card */}
            <AuthorProfile
              author={article.author}
              role={article.authorRole}
              bio={article.authorBio}
              variant="reader-card"
            />

            {/* Publication Accreditation & Reader Actions */}
            <div className="bg-white p-5 rounded-lg border border-stone-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <div className="text-xs font-semibold uppercase tracking-wider text-[#4A0E17]">
                  Published by The Inkspirer
                </div>
                <div className="text-sm font-bold text-stone-900 mt-0.5">
                  Official Campus Journalism Division of Barobo National High School
                </div>
                <p className="text-xs text-stone-600 mt-1 max-w-md">
                  Articles published on this portal reflect student journalism excellence, community reporting, and free student expression under Republic Act No. 7079.
                </p>
              </div>

              <div className="flex items-center gap-2.5 shrink-0">
                <button
                  onClick={(e) => onToggleLike(article.id, e)}
                  className={`px-3.5 py-2 text-xs font-semibold rounded flex items-center gap-1.5 transition-colors ${
                    isLiked
                      ? 'bg-rose-50 text-rose-700 border border-rose-200 shadow-2xs'
                      : 'bg-stone-100 text-stone-700 hover:bg-stone-200 border border-stone-200'
                  }`}
                >
                  <Heart className={`w-3.5 h-3.5 ${isLiked ? 'fill-rose-600 text-rose-600' : ''}`} />
                  <span>{article.likes} Likes</span>
                </button>

                <button
                  onClick={(e) => onToggleBookmark(article.id, e)}
                  className={`px-3.5 py-2 text-xs font-semibold rounded flex items-center gap-1.5 transition-colors ${
                    isBookmarked
                      ? 'bg-amber-50 text-amber-800 border border-amber-200 shadow-2xs'
                      : 'bg-stone-100 text-stone-700 hover:bg-stone-200 border border-stone-200'
                  }`}
                >
                  <Bookmark className={`w-3.5 h-3.5 ${isBookmarked ? 'fill-amber-600 text-amber-600' : ''}`} />
                  <span>{isBookmarked ? 'Bookmarked' : 'Save Story'}</span>
                </button>
              </div>
            </div>

            {/* Reader Comments & Interactive Community Discussion */}
            <ArticleComments articleId={article.id} articleTitle={article.title} />
          </div>
        </div>
      </div>
    </div>
  );
};
