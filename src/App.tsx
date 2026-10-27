import React, { useState, useMemo } from 'react';
import { useInkspirerStore } from './hooks/useInkspirerStore';
import { Category, Article } from './types';
import { Navbar } from './components/Navbar';
import { Masthead } from './components/Masthead';
import { CampusBulletin } from './components/CampusBulletin';
import { StoryFilter } from './components/StoryFilter';
import { LeadStory } from './components/LeadStory';
import { StoryGrid } from './components/StoryGrid';
import { ArticleReaderModal } from './components/ArticleReaderModal';
import { SubmitStoryModal } from './components/SubmitStoryModal';
import { DownloadPortalModal } from './components/DownloadPortalModal';
import { EditorialDeskModal } from './components/EditorialDeskModal';
import { Footer } from './components/Footer';

export default function App() {
  const {
    articles,
    announcements,
    submissions,
    staff,
    categories,
    bookmarks,
    likedArticles,
    toggleBookmark,
    toggleLike,
    incrementView,
    addSubmission,
    updateSubmissionStatus,
    publishSubmissionAsArticle,
    createArticle,
    updateArticle,
    deleteArticle,
    addAnnouncement,
    deleteAnnouncement,
    togglePinAnnouncement,
    addCategory,
    updateCategory,
    deleteCategory,
    resetToDefaults,
  } = useInkspirerStore();

  // Navigation & Filter State
  const [activeCategory, setActiveCategory] = useState<Category | 'All'>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'latest' | 'popular' | 'readTime'>('latest');
  const [showingBookmarksOnly, setShowingBookmarksOnly] = useState(false);

  // Modals
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [isSubmitOpen, setIsSubmitOpen] = useState(false);
  const [isDownloadOpen, setIsDownloadOpen] = useState(false);
  const [isEditorialDeskOpen, setIsEditorialDeskOpen] = useState(false);

  // Filtered and Sorted Articles
  const filteredArticles = useMemo(() => {
    return articles
      .filter((art) => {
        // Bookmarks filter
        if (showingBookmarksOnly && !bookmarks.includes(art.id)) {
          return false;
        }

        // Category filter
        if (activeCategory !== 'All' && art.category !== activeCategory) {
          return false;
        }

        // Search query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase().trim();
          const matchTitle = art.title.toLowerCase().includes(q);
          const matchDeck = art.deck.toLowerCase().includes(q);
          const matchAuthor = art.author.toLowerCase().includes(q);
          const matchContent = art.content.some((p) => p.toLowerCase().includes(q));
          const matchCategory = art.category.toLowerCase().includes(q);
          return matchTitle || matchDeck || matchAuthor || matchContent || matchCategory;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'popular') {
          return (b.views + b.likes * 2) - (a.views + a.likes * 2);
        }
        // Default latest: preserve array order or lead priority
        return 0;
      });
  }, [articles, activeCategory, searchQuery, sortBy, showingBookmarksOnly, bookmarks]);

  // Lead story calculation
  const leadStory = useMemo(() => {
    if (showingBookmarksOnly || searchQuery.trim() || activeCategory === 'Announcements') {
      return null;
    }
    // Check if an article is flagged leadStory in current category
    const specificLead = filteredArticles.find((a) => a.leadStory);
    if (specificLead) return specificLead;

    // Otherwise, first featured story if viewing All
    if (activeCategory === 'All') {
      return filteredArticles[0] || null;
    }
    return null;
  }, [filteredArticles, showingBookmarksOnly, searchQuery, activeCategory]);

  // Remaining articles excluding lead story
  const gridArticles = useMemo(() => {
    if (!leadStory) return filteredArticles;
    return filteredArticles.filter((a) => a.id !== leadStory.id);
  }, [filteredArticles, leadStory]);

  // Open article in full reader
  const handleSelectArticle = (art: Article) => {
    incrementView(art.id);
    setSelectedArticle(art);
  };

  const handleToggleBookmarkClick = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    toggleBookmark(id);
  };

  const handleToggleLikeClick = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    toggleLike(id);
  };

  const scrollToStories = () => {
    const el = document.getElementById('stories-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleResetFilters = () => {
    setActiveCategory('All');
    setSearchQuery('');
    setShowingBookmarksOnly(false);
  };

  const pendingSubmissionsCount = submissions.filter((s) => s.status === 'pending').length;

  return (
    <div className="min-h-screen flex flex-col bg-[#4A0E17] text-[#1C1917] selection:bg-[#D4AF37]/30 selection:text-white">
      {/* Top Bar Contract (1 line Brand — 4-5 nav links — 1 primary action) */}
      <Navbar
        activeCategory={activeCategory}
        onSelectCategory={(cat) => {
          setActiveCategory(cat);
          setShowingBookmarksOnly(false);
        }}
        onOpenSubmit={() => setIsSubmitOpen(true)}
        onOpenEditorialDesk={() => setIsEditorialDeskOpen(true)}
        onOpenDownloadPortal={() => setIsDownloadOpen(true)}
        pendingSubmissionsCount={pendingSubmissionsCount}
        categories={categories}
      />

      {/* Campus Announcements Bulletin Ticker */}
      <CampusBulletin announcements={announcements} />

      {/* Authentic School Publication Masthead */}
      <Masthead
        onOpenSubmit={() => setIsSubmitOpen(true)}
        onOpenDownloadPortal={() => setIsDownloadOpen(true)}
        onOpenEditorialDesk={() => setIsEditorialDeskOpen(true)}
        onScrollToStories={scrollToStories}
        bookmarksCount={bookmarks.length}
        onFilterBookmarks={() => setShowingBookmarksOnly((prev) => !prev)}
        showingBookmarks={showingBookmarksOnly}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {/* Story Filters, Search, and Category Selector */}
        <StoryFilter
          activeCategory={activeCategory}
          onSelectCategory={(cat) => {
            setActiveCategory(cat);
            setShowingBookmarksOnly(false);
          }}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          sortBy={sortBy}
          onSortChange={setSortBy}
          totalStoriesCount={
            activeCategory === 'Announcements'
              ? announcements.length
              : filteredArticles.length
          }
          onOpenEditorialDesk={() => setIsEditorialDeskOpen(true)}
          categoriesList={categories}
        />

        {/* Lead Story Presentation (Editorial Salience Tier 1) */}
        {leadStory && (
          <LeadStory
            article={leadStory}
            onSelect={handleSelectArticle}
            isBookmarked={bookmarks.includes(leadStory.id)}
            onToggleBookmark={handleToggleBookmarkClick}
            isLiked={likedArticles.includes(leadStory.id)}
            onToggleLike={handleToggleLikeClick}
          />
        )}

        {/* Story Grid / Department List / Announcements */}
        <StoryGrid
          articles={gridArticles}
          announcements={announcements}
          activeCategory={activeCategory}
          searchQuery={searchQuery}
          onSelectArticle={handleSelectArticle}
          bookmarks={bookmarks}
          onToggleBookmark={handleToggleBookmarkClick}
          likedArticles={likedArticles}
          onToggleLike={handleToggleLikeClick}
          onOpenSubmit={() => setIsSubmitOpen(true)}
          onResetFilters={handleResetFilters}
          showingBookmarks={showingBookmarksOnly}
        />
      </main>

      {/* Footer */}
      <Footer
        onSelectCategory={(cat) => {
          setActiveCategory(cat);
          setShowingBookmarksOnly(false);
          scrollToStories();
        }}
        onOpenSubmit={() => setIsSubmitOpen(true)}
        onOpenDownloadPortal={() => setIsDownloadOpen(true)}
        onOpenEditorialDesk={() => setIsEditorialDeskOpen(true)}
        categories={categories}
      />

      {/* Reader Modal */}
      <ArticleReaderModal
        article={selectedArticle}
        onClose={() => setSelectedArticle(null)}
        isBookmarked={selectedArticle ? bookmarks.includes(selectedArticle.id) : false}
        onToggleBookmark={handleToggleBookmarkClick}
        isLiked={selectedArticle ? likedArticles.includes(selectedArticle.id) : false}
        onToggleLike={handleToggleLikeClick}
      />

      {/* Submit Story Modal (Dual action: Download .txt and/or Save to Editorial Desk) */}
      <SubmitStoryModal
        isOpen={isSubmitOpen}
        onClose={() => setIsSubmitOpen(false)}
        onSubmit={addSubmission}
        onOpenEditorialDesk={() => setIsEditorialDeskOpen(true)}
        categories={categories}
      />

      {/* Download Portal Modal (Single-file HTML website download) */}
      <DownloadPortalModal
        isOpen={isDownloadOpen}
        onClose={() => setIsDownloadOpen(false)}
        articles={articles}
        announcements={announcements}
        onOpenEditorialDesk={() => setIsEditorialDeskOpen(true)}
      />

      {/* Editorial Desk / Adviser Management Console */}
      <EditorialDeskModal
        isOpen={isEditorialDeskOpen}
        onClose={() => setIsEditorialDeskOpen(false)}
        articles={articles}
        announcements={announcements}
        submissions={submissions}
        staff={staff}
        categories={categories}
        onPublishSubmission={publishSubmissionAsArticle}
        onUpdateSubmissionStatus={updateSubmissionStatus}
        onCreateArticle={createArticle}
        onUpdateArticle={updateArticle}
        onDeleteArticle={deleteArticle}
        onAddAnnouncement={addAnnouncement}
        onDeleteAnnouncement={deleteAnnouncement}
        onTogglePinAnnouncement={togglePinAnnouncement}
        onAddCategory={addCategory}
        onUpdateCategory={updateCategory}
        onDeleteCategory={deleteCategory}
        onResetDefaults={resetToDefaults}
      />
    </div>
  );
}
