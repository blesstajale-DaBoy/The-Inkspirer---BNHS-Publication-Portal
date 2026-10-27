import React, { useState, useEffect } from 'react';
import {
  X,
  Shield,
  FileCheck,
  PlusCircle,
  Megaphone,
  Users,
  CheckCircle2,
  AlertCircle,
  Trash2,
  Edit3,
  ExternalLink,
  Upload,
  Lock,
  Unlock,
  Eye,
  Download,
  RotateCcw,
  Sparkles,
  Mail,
  Tag,
  Tags,
  Palette,
  Image as ImageIcon,
  Trophy,
  Feather,
  Newspaper,
  Camera,
  BookOpen,
  Globe,
  Flame,
  Heart,
  AlertTriangle,
  FolderPlus,
} from 'lucide-react';
import {
  Article,
  Announcement,
  StorySubmission,
  EditorialMember,
  Category,
  NewsletterSubscriber,
  PublicationCategory,
} from '../types';
import { downloadSubmissionTextFile } from '../utils/exporter';
import { useAuth } from '../context/AuthContext';

// Curated preset palettes for categories
const COLOR_PRESETS = [
  { name: 'Warm Amber / Orange', color: '#FB923C', badgeBg: 'bg-orange-50', badgeText: 'text-orange-900' },
  { name: 'Sky Blue', color: '#38BDF8', badgeBg: 'bg-sky-50', badgeText: 'text-sky-900' },
  { name: 'Imitation Gold', color: '#D4AF37', badgeBg: 'bg-amber-50', badgeText: 'text-amber-900' },
  { name: 'Signal Yellow', color: '#FACC15', badgeBg: 'bg-yellow-50', badgeText: 'text-yellow-900' },
  { name: 'Lilac Purple', color: '#C084FC', badgeBg: 'bg-purple-50', badgeText: 'text-purple-900' },
  { name: 'Emerald Green', color: '#10B981', badgeBg: 'bg-emerald-50', badgeText: 'text-emerald-900' },
  { name: 'Rose Red', color: '#F43F5E', badgeBg: 'bg-rose-50', badgeText: 'text-rose-900' },
  { name: 'Indigo Blue', color: '#6366F1', badgeBg: 'bg-indigo-50', badgeText: 'text-indigo-900' },
  { name: 'Cyan Teal', color: '#06B6D4', badgeBg: 'bg-cyan-50', badgeText: 'text-cyan-900' },
  { name: 'Crimson / Maroon', color: '#991B1B', badgeBg: 'bg-red-50', badgeText: 'text-red-900' },
];

const ICON_OPTIONS = [
  { id: 'newspaper', label: 'Newspaper', icon: Newspaper },
  { id: 'sparkles', label: 'Sparkles', icon: Sparkles },
  { id: 'feather', label: 'Pen / Feather', icon: Feather },
  { id: 'trophy', label: 'Trophy', icon: Trophy },
  { id: 'megaphone', label: 'Megaphone', icon: Megaphone },
  { id: 'camera', label: 'Camera', icon: Camera },
  { id: 'book', label: 'Book / Literature', icon: BookOpen },
  { id: 'globe', label: 'Globe / World', icon: Globe },
  { id: 'flame', label: 'Flame / Hot', icon: Flame },
  { id: 'heart', label: 'Heart / Feature', icon: Heart },
];

const PRESET_PHOTOS = [
  { label: 'Campus & News', url: 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?auto=format&fit=crop&w=800&q=80' },
  { label: 'Writing & Literary', url: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=800&q=80' },
  { label: 'Editorials & Opinions', url: 'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?auto=format&fit=crop&w=800&q=80' },
  { label: 'Sports & Athletics', url: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=800&q=80' },
  { label: 'Announcements & Meetings', url: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=800&q=80' },
  { label: 'Science & Technology', url: 'https://images.unsplash.com/photo-1507668077129-56e32842fceb?auto=format&fit=crop&w=800&q=80' },
  { label: 'Arts & Culture', url: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=800&q=80' },
  { label: 'Library & Research', url: 'https://images.unsplash.com/photo-1474366521946-c3d4b507abf2?auto=format&fit=crop&w=800&q=80' },
];

const CategoryIcon: React.FC<{ name?: string; className?: string }> = ({ name, className = 'w-4 h-4' }) => {
  switch (name?.toLowerCase()) {
    case 'newspaper':
      return <Newspaper className={className} />;
    case 'sparkles':
      return <Sparkles className={className} />;
    case 'feather':
      return <Feather className={className} />;
    case 'trophy':
      return <Trophy className={className} />;
    case 'megaphone':
      return <Megaphone className={className} />;
    case 'camera':
      return <Camera className={className} />;
    case 'book':
    case 'bookopen':
      return <BookOpen className={className} />;
    case 'globe':
      return <Globe className={className} />;
    case 'flame':
      return <Flame className={className} />;
    case 'heart':
      return <Heart className={className} />;
    default:
      return <Tag className={className} />;
  }
};

interface EditorialDeskModalProps {
  isOpen: boolean;
  onClose: () => void;
  articles: Article[];
  announcements: Announcement[];
  submissions: StorySubmission[];
  staff: EditorialMember[];
  categories: PublicationCategory[];
  onPublishSubmission: (id: string) => Article | null;
  onUpdateSubmissionStatus: (id: string, status: StorySubmission['status'], feedback?: string) => void;
  onCreateArticle: (art: Omit<Article, 'id' | 'views' | 'likes'>) => Article;
  onUpdateArticle: (art: Article) => void;
  onDeleteArticle: (id: string) => void;
  onAddAnnouncement: (ann: Omit<Announcement, 'id'>) => Announcement;
  onDeleteAnnouncement: (id: string) => void;
  onTogglePinAnnouncement: (id: string) => void;
  onAddCategory: (cat: Omit<PublicationCategory, 'id' | 'slug'>) => PublicationCategory;
  onUpdateCategory: (id: string, updated: Partial<PublicationCategory>) => void;
  onDeleteCategory: (id: string, fallbackCategoryName?: string) => void;
  onResetDefaults: () => void;
}

export const EditorialDeskModal: React.FC<EditorialDeskModalProps> = ({
  isOpen,
  onClose,
  articles,
  announcements,
  submissions,
  staff,
  categories,
  onPublishSubmission,
  onUpdateSubmissionStatus,
  onCreateArticle,
  onUpdateArticle,
  onDeleteArticle,
  onAddAnnouncement,
  onDeleteAnnouncement,
  onTogglePinAnnouncement,
  onAddCategory,
  onUpdateCategory,
  onDeleteCategory,
  onResetDefaults,
}) => {
  // Firebase Authentication & Role Management
  const {
    currentUser,
    userProfile,
    loginWithGoogle,
    loginAsAdviserDemo,
    loginAsEditorDemo,
    logout,
    isAuthorizedStaff,
    isAdviser,
  } = useAuth();

  const [isPinUnlocked, setIsPinUnlocked] = useState(false);
  const isAuthenticated = isAuthorizedStaff || isPinUnlocked || !!userProfile;
  const [pinCode, setPinCode] = useState('');
  const [authError, setAuthError] = useState('');

  // Auto-fill author info based on active logged-in profile
  useEffect(() => {
    if (userProfile?.displayName) {
      setComposerAuthor(userProfile.displayName);
      setComposerRole(
        userProfile.designation ||
          (userProfile.role === 'adviser' ? 'Publication Adviser' : 'Editor-in-Chief')
      );
    }
  }, [userProfile]);

  // Active tab in management desk
  const [activeTab, setActiveTab] = useState<'submissions' | 'compose' | 'articles' | 'announcements' | 'categories' | 'staff' | 'subscribers'>('submissions');
  const [subscribersList, setSubscribersList] = useState<NewsletterSubscriber[]>([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('the_inkspirer_subscribers_v1');
      if (stored) {
        setSubscribersList(JSON.parse(stored));
      }
    } catch {
      // fallback
    }
  }, [activeTab]);

  // Selected submission to review
  const [selectedSubmission, setSelectedSubmission] = useState<StorySubmission | null>(null);
  const [feedbackNote, setFeedbackNote] = useState('');
  const [deskToast, setDeskToast] = useState('');

  // Article composer state
  const [composerTitle, setComposerTitle] = useState('');
  const [composerDeck, setComposerDeck] = useState('');
  const [composerCategory, setComposerCategory] = useState<Category>('News');
  const [composerAuthor, setComposerAuthor] = useState('John Cedric Morales');
  const [composerRole, setComposerRole] = useState('Editor-in-Chief');
  const [composerLeadStory, setComposerLeadStory] = useState(false);
  const [composerFeatured, setComposerFeatured] = useState(false);
  const [composerPullQuote, setComposerPullQuote] = useState('');
  const [composerCaption, setComposerCaption] = useState('');
  const [composerImageUrl, setComposerImageUrl] = useState('');
  const [composerContent, setComposerContent] = useState('');

  // Announcement composer state
  const [annTitle, setAnnTitle] = useState('');
  const [annType, setAnnType] = useState<Announcement['type']>('Academic');
  const [annDeadline, setAnnDeadline] = useState('');
  const [annLocation, setAnnLocation] = useState('');
  const [annUrgent, setAnnUrgent] = useState(false);
  const [annContent, setAnnContent] = useState('');

  // Editing article form state
  const [editingArticle, setEditingArticle] = useState<Article | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDeck, setEditDeck] = useState('');
  const [editCategory, setEditCategory] = useState<Category>('News');
  const [editAuthor, setEditAuthor] = useState('');
  const [editRole, setEditRole] = useState('');
  const [editContent, setEditContent] = useState('');
  const [editPullQuote, setEditPullQuote] = useState('');
  const [editCaption, setEditCaption] = useState('');
  const [editImageUrl, setEditImageUrl] = useState('');
  const [editLeadStory, setEditLeadStory] = useState(false);
  const [editFeatured, setEditFeatured] = useState(false);
  const [articleCategoryFilter, setArticleCategoryFilter] = useState<Category | 'All'>('All');
  const [articleSearchQuery, setArticleSearchQuery] = useState('');

  // Category management state
  const [isAddCategoryOpen, setIsAddCategoryOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<PublicationCategory | null>(null);
  const [deletingCategory, setDeletingCategory] = useState<PublicationCategory | null>(null);
  const [deleteFallbackCategory, setDeleteFallbackCategory] = useState<string>('');

  // Add category form
  const [newCatName, setNewCatName] = useState('');
  const [newCatDesc, setNewCatDesc] = useState('');
  const [newCatColor, setNewCatColor] = useState('#FB923C');
  const [newCatBadgeBg, setNewCatBadgeBg] = useState('bg-orange-50');
  const [newCatBadgeText, setNewCatBadgeText] = useState('text-orange-900');
  const [newCatIcon, setNewCatIcon] = useState('newspaper');
  const [newCatImageUrl, setNewCatImageUrl] = useState('');

  // Edit category form
  const [editCatName, setEditCatName] = useState('');
  const [editCatDesc, setEditCatDesc] = useState('');
  const [editCatColor, setEditCatColor] = useState('#FB923C');
  const [editCatBadgeBg, setEditCatBadgeBg] = useState('bg-orange-50');
  const [editCatBadgeText, setEditCatBadgeText] = useState('text-orange-900');
  const [editCatIcon, setEditCatIcon] = useState('newspaper');
  const [editCatImageUrl, setEditCatImageUrl] = useState('');

  if (!isOpen) return null;

  const showToast = (msg: string) => {
    setDeskToast(msg);
    setTimeout(() => setDeskToast(''), 3000);
  };

  const handleOpenAddCategory = () => {
    setNewCatName('');
    setNewCatDesc('');
    setNewCatColor('#FB923C');
    setNewCatBadgeBg('bg-orange-50');
    setNewCatBadgeText('text-orange-900');
    setNewCatIcon('newspaper');
    setNewCatImageUrl('');
    setIsAddCategoryOpen(true);
  };

  const handleOpenEditCategory = (cat: PublicationCategory) => {
    setEditingCategory(cat);
    setEditCatName(cat.name);
    setEditCatDesc(cat.description || '');
    setEditCatColor(cat.color);
    setEditCatBadgeBg(cat.badgeBg || 'bg-stone-50');
    setEditCatBadgeText(cat.badgeText || 'text-stone-900');
    setEditCatIcon(cat.iconName || 'newspaper');
    setEditCatImageUrl(cat.imageUrl || '');
  };

  const handleCreateCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim()) {
      alert('Please enter a category name.');
      return;
    }
    // Check duplicates
    if (categories.some((c) => c.name.toLowerCase() === newCatName.trim().toLowerCase())) {
      alert(`A category named "${newCatName.trim()}" already exists.`);
      return;
    }

    onAddCategory({
      name: newCatName.trim(),
      description: newCatDesc.trim() || `Articles and stories under the ${newCatName.trim()} desk.`,
      color: newCatColor,
      badgeBg: newCatBadgeBg,
      badgeText: newCatBadgeText,
      iconName: newCatIcon,
      imageUrl: newCatImageUrl.trim() || undefined,
    });

    showToast(`Created category "${newCatName.trim()}"!`);
    setIsAddCategoryOpen(false);
  };

  const handleSaveEditCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCategory || !editCatName.trim()) {
      alert('Please enter a category name.');
      return;
    }

    onUpdateCategory(editingCategory.id, {
      name: editCatName.trim(),
      description: editCatDesc.trim(),
      color: editCatColor,
      badgeBg: editCatBadgeBg,
      badgeText: editCatBadgeText,
      iconName: editCatIcon,
      imageUrl: editCatImageUrl.trim() || undefined,
    });

    showToast(`Updated category "${editCatName.trim()}"!`);
    setEditingCategory(null);
  };

  const handleOpenDeleteCategory = (cat: PublicationCategory) => {
    if (categories.length <= 1) {
      alert('Cannot delete the only remaining publication category.');
      return;
    }
    const otherCats = categories.filter((c) => c.id !== cat.id);
    setDeleteFallbackCategory(otherCats[0]?.name || 'News');
    setDeletingCategory(cat);
  };

  const handleConfirmDeleteCategory = () => {
    if (!deletingCategory) return;
    onDeleteCategory(deletingCategory.id, deleteFallbackCategory);
    showToast(`Deleted category "${deletingCategory.name}"`);
    setDeletingCategory(null);
  };

  const handleCategoryPhotoUpload = (e: React.ChangeEvent<HTMLInputElement>, isEdit: boolean) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          if (isEdit) {
            setEditCatImageUrl(reader.result);
          } else {
            setNewCatImageUrl(reader.result);
          }
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleOpenEditArticle = (art: Article) => {
    setEditingArticle(art);
    setEditTitle(art.title);
    setEditDeck(art.deck || '');
    setEditCategory(art.category);
    setEditAuthor(art.author);
    setEditRole(art.authorRole || '');
    setEditContent(Array.isArray(art.content) ? art.content.join('\n\n') : (art.content || ''));
    setEditPullQuote(art.pullQuote || '');
    setEditCaption(art.imageCaption || '');
    setEditImageUrl(art.imageUrl || '');
    setEditLeadStory(!!art.leadStory);
    setEditFeatured(!!art.featured);
  };

  const handleEditImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          setEditImageUrl(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveEditedArticle = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingArticle || !editTitle.trim() || !editContent.trim()) {
      alert('Please fill in headline and story content.');
      return;
    }

    const paragraphs = editContent
      .split('\n\n')
      .map((p) => p.trim())
      .filter(Boolean);

    const matchedCat = categories.find((c) => c.name.toLowerCase() === editCategory.toLowerCase());
    const catTheme = matchedCat
      ? { accentColor: matchedCat.color, badgeBg: matchedCat.badgeBg, badgeText: matchedCat.badgeText }
      : editingArticle.categoryTheme;

    const updated: Article = {
      ...editingArticle,
      title: editTitle.trim(),
      deck: editDeck.trim() || editTitle.trim(),
      category: editCategory,
      author: editAuthor.trim() || editingArticle.author,
      authorRole: editRole.trim() || editingArticle.authorRole,
      content: paragraphs.length > 0 ? paragraphs : [editContent.trim()],
      pullQuote: editPullQuote.trim() || undefined,
      imageCaption: editCaption.trim() || undefined,
      imageUrl: editImageUrl.trim() || undefined,
      leadStory: editLeadStory,
      featured: editFeatured,
      categoryTheme: catTheme,
    };

    onUpdateArticle(updated);
    setEditingArticle(null);
    showToast(`Updated "${updated.title}" successfully!`);
  };

  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinCode === '1991' || pinCode.toLowerCase() === 'bnhs' || pinCode === 'admin' || pinCode === '1234') {
      setIsPinUnlocked(true);
      loginAsAdviserDemo();
      setAuthError('');
      showToast('Welcome, Mrs. Maria Elena Delos Reyes (Publication Adviser)');
    } else {
      setAuthError('Incorrect PIN. (Tip: Try 1991 or click Quick Login below)');
    }
  };

  const handleApproveAndPublish = (sub: StorySubmission) => {
    const published = onPublishSubmission(sub.id);
    if (published) {
      showToast(`Published “${sub.headline}” to The Inkspirer!`);
      setSelectedSubmission(null);
    }
  };

  const handleRequestRevision = (sub: StorySubmission) => {
    if (!feedbackNote.trim()) {
      alert('Please write feedback for the student writer before requesting revisions.');
      return;
    }
    onUpdateSubmissionStatus(sub.id, 'revision_requested', feedbackNote);
    showToast(`Revision requested for “${sub.headline}”`);
    setSelectedSubmission(null);
    setFeedbackNote('');
  };

  const handlePublishNewArticle = (e: React.FormEvent) => {
    e.preventDefault();
    if (!composerTitle.trim() || !composerContent.trim()) {
      alert('Please fill in headline and story content.');
      return;
    }

    const paragraphs = composerContent
      .split('\n\n')
      .map((p) => p.trim())
      .filter(Boolean);

    const matchedCat = categories.find((c) => c.name.toLowerCase() === composerCategory.toLowerCase());
    const categoryTheme = matchedCat
      ? { accentColor: matchedCat.color, badgeBg: matchedCat.badgeBg, badgeText: matchedCat.badgeText }
      : { accentColor: '#FB923C', badgeBg: 'bg-orange-50', badgeText: 'text-orange-900' };

    onCreateArticle({
      title: composerTitle,
      deck: composerDeck || composerTitle,
      category: composerCategory,
      author: composerAuthor || 'The Inkspirer Editorial Staff',
      authorRole: composerRole || 'Student Journalist',
      date: new Date().toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      }),
      readTime: `${Math.max(2, Math.ceil(composerContent.split(' ').length / 200))} min read`,
      featured: composerFeatured,
      leadStory: composerLeadStory,
      content: paragraphs.length > 0 ? paragraphs : [composerContent],
      pullQuote: composerPullQuote || undefined,
      imageCaption: composerCaption || undefined,
      categoryTheme,
      issue: 'Vol. XXIV · Issue 1',
    });

    showToast('Article published successfully to live publication!');
    // Reset composer
    setComposerTitle('');
    setComposerDeck('');
    setComposerContent('');
    setComposerPullQuote('');
    setComposerCaption('');
    setComposerImageUrl('');
    setComposerLeadStory(false);
    setComposerFeatured(false);
    setActiveTab('articles');
  };

  const handleCreateAnnouncement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!annTitle.trim() || !annContent.trim()) {
      alert('Please provide announcement title and content.');
      return;
    }

    onAddAnnouncement({
      title: annTitle,
      type: annType,
      deadline: annDeadline || undefined,
      location: annLocation || undefined,
      urgent: annUrgent,
      isPinned: annUrgent,
      date: new Date().toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      }),
      content: annContent,
    });

    showToast('Campus announcement dispatched to bulletin!');
    setAnnTitle('');
    setAnnDeadline('');
    setAnnLocation('');
    setAnnUrgent(false);
    setAnnContent('');
  };

  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          setComposerImageUrl(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const pendingCount = submissions.filter((s) => s.status === 'pending').length;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/80 backdrop-blur-xs flex justify-center p-2 sm:p-4 md:p-6">
      <div className="bg-white text-[#1C1917] w-full max-w-5xl rounded-lg shadow-2xl border border-stone-200 flex flex-col overflow-hidden my-auto max-h-[92vh]">
        {/* Header Strip */}
        <div className="bg-[#0B2545] text-white px-6 py-4 flex items-center justify-between border-b border-[#07192F]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded bg-[#D4AF37]/20 flex items-center justify-center text-[#D4AF37]">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[10px] font-bold tracking-widest uppercase text-[#D4AF37]">
                Barobo National High School · Publication Office
              </div>
              <h2 className="font-brand text-xl font-bold tracking-tight">
                The Inkspirer Editorial Desk & Management Portal
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {deskToast && (
              <span className="hidden sm:inline-block text-xs bg-emerald-700/80 text-white px-2.5 py-1 rounded">
                {deskToast}
              </span>
            )}
            <button
              onClick={onClose}
              className="p-1 rounded text-stone-300 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Auth Gate Screen (if locked) */}
        {!isAuthenticated ? (
          <div className="p-8 sm:p-12 text-center max-w-md mx-auto my-auto space-y-5">
            <div className="w-14 h-14 rounded-full bg-blue-50 text-[#0B2545] flex items-center justify-center mx-auto">
              <Lock className="w-7 h-7" />
            </div>
            <div>
              <h3 className="font-serif text-2xl font-bold text-stone-900">
                Editorial Board Authorization
              </h3>
              <p className="text-xs text-stone-600 mt-1">
                Enter your Adviser PIN or Student Editor Access Code to manage publications, review submissions, and post announcements.
              </p>
            </div>

            <form onSubmit={handleAuthSubmit} className="space-y-3">
              <input
                type="password"
                value={pinCode}
                onChange={(e) => setPinCode(e.target.value)}
                placeholder="Enter PIN (e.g. 1991)"
                className="w-full text-center px-4 py-2 text-sm border border-stone-300 rounded font-mono tracking-widest focus:ring-1 focus:ring-[#0B2545] focus:outline-none"
              />
              {authError && <div className="text-xs text-red-600 font-medium">{authError}</div>}
              <button
                type="submit"
                className="w-full py-2.5 text-xs font-semibold text-white bg-[#0B2545] hover:bg-[#133E87] rounded transition-colors"
              >
                Verify & Enter Editorial Desk
              </button>
            </form>

            <div className="space-y-2 pt-2 border-t border-stone-200">
              <div className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider">
                Instant Staff Sign-In (Official Credentials)
              </div>
              <button
                type="button"
                onClick={() => {
                  loginAsAdviserDemo();
                  setIsPinUnlocked(true);
                  showToast('Signed in as Mrs. Maria Elena Delos Reyes (Publication Adviser)');
                }}
                className="w-full py-2 px-3 text-xs font-semibold rounded bg-[#4A0E17] hover:bg-[#5C1521] text-[#F3C562] border border-[#6B1420] transition-colors flex items-center justify-center gap-2"
              >
                <span>🔑 Log in as Mrs. Maria Elena Delos Reyes (Publication Adviser)</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  loginAsEditorDemo();
                  setIsPinUnlocked(true);
                  showToast('Signed in as John Cedric Morales (Editor-in-Chief)');
                }}
                className="w-full py-2 px-3 text-xs font-semibold rounded bg-[#0B2545] hover:bg-[#133E87] text-white border border-[#07192F] transition-colors flex items-center justify-center gap-2"
              >
                <span>✍️ Log in as John Cedric Morales (Editor-in-Chief)</span>
              </button>

              <button
                type="button"
                onClick={async () => {
                  try {
                    await loginWithGoogle();
                    setIsPinUnlocked(true);
                    showToast('Signed in with Google Account');
                  } catch (err: unknown) {
                    const message = err instanceof Error ? err.message : 'Google Sign-in was cancelled';
                    setAuthError(message);
                  }
                }}
                className="w-full py-2 px-3 text-xs font-semibold rounded bg-white hover:bg-stone-50 text-stone-800 border border-stone-300 transition-colors flex items-center justify-center gap-2"
              >
                <span>🌐 Sign in with DepEd / Google Account</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Navigation Tabs Bar */}
            <div className="bg-[#FBF9F5] border-b border-stone-200 px-6 flex items-center justify-between overflow-x-auto gap-2">
              <div className="flex items-center gap-1 py-2">
                <button
                  onClick={() => setActiveTab('submissions')}
                  className={`px-3.5 py-1.5 text-xs font-medium rounded transition-colors whitespace-nowrap flex items-center gap-1.5 ${
                    activeTab === 'submissions'
                      ? 'bg-[#0B2545] text-white font-semibold'
                      : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200'
                  }`}
                >
                  <FileCheck className="w-3.5 h-3.5" />
                  <span>Submissions Queue</span>
                  {pendingCount > 0 && (
                    <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-[#D4AF37] text-stone-900">
                      {pendingCount}
                    </span>
                  )}
                </button>

                <button
                  onClick={() => setActiveTab('compose')}
                  className={`px-3.5 py-1.5 text-xs font-medium rounded transition-colors whitespace-nowrap flex items-center gap-1.5 ${
                    activeTab === 'compose'
                      ? 'bg-[#0B2545] text-white font-semibold'
                      : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200'
                  }`}
                >
                  <PlusCircle className="w-3.5 h-3.5" />
                  <span>Publish New Story</span>
                </button>

                <button
                  onClick={() => setActiveTab('articles')}
                  className={`px-3.5 py-1.5 text-xs font-medium rounded transition-colors whitespace-nowrap flex items-center gap-1.5 ${
                    activeTab === 'articles'
                      ? 'bg-[#0B2545] text-white font-semibold'
                      : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200'
                  }`}
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Live Articles ({articles.length})</span>
                </button>

                <button
                  onClick={() => setActiveTab('announcements')}
                  className={`px-3.5 py-1.5 text-xs font-medium rounded transition-colors whitespace-nowrap flex items-center gap-1.5 ${
                    activeTab === 'announcements'
                      ? 'bg-[#0B2545] text-white font-semibold'
                      : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200'
                  }`}
                >
                  <Megaphone className="w-3.5 h-3.5" />
                  <span>Announcements ({announcements.length})</span>
                </button>

                <button
                  onClick={() => setActiveTab('categories')}
                  className={`px-3.5 py-1.5 text-xs font-medium rounded transition-colors whitespace-nowrap flex items-center gap-1.5 ${
                    activeTab === 'categories'
                      ? 'bg-[#0B2545] text-white font-semibold'
                      : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200'
                  }`}
                >
                  <Tags className="w-3.5 h-3.5" />
                  <span>Category Management ({categories.length})</span>
                </button>

                <button
                  onClick={() => setActiveTab('staff')}
                  className={`px-3.5 py-1.5 text-xs font-medium rounded transition-colors whitespace-nowrap flex items-center gap-1.5 ${
                    activeTab === 'staff'
                      ? 'bg-[#0B2545] text-white font-semibold'
                      : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200'
                  }`}
                >
                  <Users className="w-3.5 h-3.5" />
                  <span>Editorial Board Staff</span>
                </button>

                <button
                  onClick={() => setActiveTab('subscribers')}
                  className={`px-3.5 py-1.5 text-xs font-medium rounded transition-colors whitespace-nowrap flex items-center gap-1.5 ${
                    activeTab === 'subscribers'
                      ? 'bg-[#0B2545] text-white font-semibold'
                      : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200'
                  }`}
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>Newsletter Subscribers ({subscribersList.length + 342})</span>
                </button>
              </div>

              <div className="flex items-center gap-2 shrink-0 py-2">
                {userProfile && (
                  <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 bg-stone-100 border border-stone-300 rounded text-xs text-stone-800">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    <span className="font-semibold text-stone-900 truncate max-w-[150px]">
                      {userProfile.displayName}
                    </span>
                    <span className="text-[10px] uppercase font-bold text-stone-500 px-1 py-0.2 bg-stone-200 rounded">
                      {userProfile.role === 'adviser' ? 'Adviser' : 'Editor'}
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        logout();
                        setIsPinUnlocked(false);
                        showToast('Signed out of Editorial Desk');
                      }}
                      className="ml-1 text-[11px] text-red-700 hover:underline font-medium"
                      title="Sign Out or switch accounts"
                    >
                      Sign Out
                    </button>
                  </div>
                )}

                <button
                  onClick={() => {
                    if (confirm('Reset all stories, submissions, and notices back to initial demo state?')) {
                      onResetDefaults();
                      showToast('Database reset to official default state');
                    }
                  }}
                  className="p-1.5 rounded text-stone-500 hover:text-stone-800 hover:bg-stone-200 text-xs flex items-center gap-1 transition-colors"
                  title="Reset sample data"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Reset Demo</span>
                </button>
              </div>
            </div>

            {/* TAB BODY */}
            <div className="flex-1 overflow-y-auto p-6">
              {/* TAB 1: SUBMISSIONS QUEUE */}
              {activeTab === 'submissions' && (
                <div className="space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-200 pb-3">
                    <div>
                      <h3 className="font-serif text-xl font-bold text-stone-900">
                        Aspiring Student Writer Submissions
                      </h3>
                      <p className="text-xs text-stone-500">
                        Review incoming articles submitted by BNHS learners. Click any submission to inspect manuscript, provide feedback, or publish live to the newsletter.
                      </p>
                    </div>
                    <div className="text-xs text-stone-600 bg-stone-100 px-3 py-1 rounded">
                      {pendingCount} Pending Review
                    </div>
                  </div>

                  {submissions.length === 0 ? (
                    <div className="py-12 text-center text-stone-500 text-xs">
                      No submissions in queue. Students can submit articles through the "Submit a Story" modal.
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 gap-4">
                      {submissions.map((sub) => {
                        const statusColors = {
                          pending: 'bg-amber-50 text-amber-800 border-amber-200',
                          approved: 'bg-emerald-50 text-emerald-800 border-emerald-200',
                          revision_requested: 'bg-blue-50 text-blue-800 border-blue-200',
                          rejected: 'bg-stone-100 text-stone-600 border-stone-300',
                        };

                        const statusLabels = {
                          pending: 'Pending Review',
                          approved: 'Approved & Published',
                          revision_requested: 'Revisions Requested',
                          rejected: 'Archived',
                        };

                        return (
                          <div
                            key={sub.id}
                            className={`border rounded-lg p-5 bg-white transition-all ${
                              selectedSubmission?.id === sub.id
                                ? 'border-[#0B2545] ring-1 ring-[#0B2545]'
                                : 'border-stone-200 hover:border-stone-400'
                            }`}
                          >
                            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-2">
                              <div>
                                <div className="flex items-center gap-2 text-xs text-stone-500 mb-1">
                                  <span className="font-bold text-[#133E87] uppercase tracking-wide">
                                    {sub.category} Desk
                                  </span>
                                  <span aria-hidden="true">·</span>
                                  <span>{sub.submittedAt}</span>
                                </div>
                                <h4 className="font-serif text-lg font-bold text-stone-900 leading-snug">
                                  {sub.headline}
                                </h4>
                              </div>

                              <div className="flex items-center gap-2 shrink-0">
                                <span
                                  className={`text-[11px] font-semibold px-2.5 py-0.5 rounded border ${
                                    statusColors[sub.status]
                                  }`}
                                >
                                  {statusLabels[sub.status]}
                                </span>
                              </div>
                            </div>

                            {/* Author & Summary */}
                            <div className="text-xs text-stone-600 mb-3 space-y-1 bg-stone-50 p-3 rounded border border-stone-100">
                              <div className="flex items-center gap-2">
                                <span className="font-semibold text-stone-800">{sub.studentName}</span>
                                <span className="text-stone-400">({sub.gradeSection})</span>
                                <span aria-hidden="true">·</span>
                                <span className="text-stone-500">{sub.email}</span>
                              </div>
                              <p className="text-stone-700 italic">“{sub.summary}”</p>
                              {sub.notesToEditor && (
                                <div className="text-[11px] text-stone-500 pt-1">
                                  <strong>Student Note:</strong> {sub.notesToEditor}
                                </div>
                              )}
                              {sub.editorFeedback && (
                                <div className="text-[11px] text-[#133E87] font-medium pt-1 border-t border-stone-200">
                                  <strong>Editor Feedback:</strong> {sub.editorFeedback}
                                </div>
                              )}
                            </div>

                            {/* Action Row */}
                            <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-stone-100">
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => setSelectedSubmission(sub)}
                                  className="px-3 py-1.5 text-xs font-semibold text-stone-700 bg-stone-100 hover:bg-stone-200 rounded transition-colors flex items-center gap-1.5"
                                >
                                  <Eye className="w-3.5 h-3.5" />
                                  <span>Inspect Manuscript</span>
                                </button>

                                <button
                                  onClick={() => downloadSubmissionTextFile(sub)}
                                  className="px-3 py-1.5 text-xs font-medium text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded transition-colors flex items-center gap-1"
                                  title="Download manuscript text file"
                                >
                                  <Download className="w-3.5 h-3.5" />
                                  <span>Download .txt</span>
                                </button>
                              </div>

                              <div className="flex items-center gap-2">
                                {sub.status !== 'approved' && (
                                  <button
                                    onClick={() => handleApproveAndPublish(sub)}
                                    className="px-3 py-1.5 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded transition-colors flex items-center gap-1.5 shadow-2xs"
                                  >
                                    <CheckCircle2 className="w-3.5 h-3.5" />
                                    <span>Approve & Publish Live</span>
                                  </button>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* Submission Detail Modal / Drawer */}
                  {selectedSubmission && (
                    <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
                      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full p-6 border border-stone-200 max-h-[85vh] overflow-y-auto">
                        <div className="flex items-start justify-between gap-4 mb-4">
                          <div>
                            <div className="text-xs font-bold uppercase tracking-wider text-[#133E87] mb-1">
                              {selectedSubmission.category} Manuscript Inspection
                            </div>
                            <h3 className="font-serif text-xl font-bold text-stone-900">
                              {selectedSubmission.headline}
                            </h3>
                            <div className="text-xs text-stone-500 mt-1">
                              By {selectedSubmission.studentName} ({selectedSubmission.gradeSection}) · {selectedSubmission.email}
                            </div>
                          </div>
                          <button
                            onClick={() => setSelectedSubmission(null)}
                            className="p-1 rounded text-stone-400 hover:text-stone-600"
                          >
                            <X className="w-5 h-5" />
                          </button>
                        </div>

                        <div className="bg-[#FBF9F5] p-4 rounded border border-stone-200 text-xs space-y-2 mb-4">
                          <div>
                            <strong className="text-stone-700">Catchy Summary / Deck:</strong>
                            <p className="text-stone-600 mt-0.5">{selectedSubmission.summary}</p>
                          </div>
                          {selectedSubmission.notesToEditor && (
                            <div className="pt-2 border-t border-stone-200">
                              <strong className="text-stone-700">Author Notes to Editors:</strong>
                              <p className="text-stone-600 mt-0.5">{selectedSubmission.notesToEditor}</p>
                            </div>
                          )}
                        </div>

                        <div className="mb-6">
                          <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">
                            Complete Article Manuscript:
                          </label>
                          <div className="p-4 bg-stone-50 rounded border border-stone-200 text-xs text-stone-800 font-sans leading-relaxed whitespace-pre-line max-h-60 overflow-y-auto">
                            {selectedSubmission.content}
                          </div>
                        </div>

                        {/* Editor Feedback Input */}
                        <div className="mb-6">
                          <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                            Adviser / Editor Feedback or Revision Notes:
                          </label>
                          <textarea
                            rows={2}
                            value={feedbackNote}
                            onChange={(e) => setFeedbackNote(e.target.value)}
                            placeholder="Provide constructive feedback for student development (e.g. 'Strong lead! Please clarify paragraph 3...')"
                            className="w-full px-3 py-2 text-xs border border-stone-300 rounded focus:ring-1 focus:ring-[#0B2545] focus:outline-none"
                          />
                        </div>

                        <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-stone-200">
                          <button
                            onClick={() => downloadSubmissionTextFile(selectedSubmission)}
                            className="px-3 py-2 text-xs font-medium text-stone-700 bg-stone-100 hover:bg-stone-200 rounded transition-colors flex items-center gap-1.5"
                          >
                            <Download className="w-3.5 h-3.5" />
                            <span>Export Manuscript (.txt)</span>
                          </button>

                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleRequestRevision(selectedSubmission)}
                              className="px-3 py-2 text-xs font-semibold text-blue-900 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded transition-colors"
                            >
                              Request Revision
                            </button>

                            <button
                              onClick={() => handleApproveAndPublish(selectedSubmission)}
                              className="px-4 py-2 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded transition-colors flex items-center gap-1.5 shadow-2xs"
                            >
                              <CheckCircle2 className="w-4 h-4" />
                              <span>Publish to Portal</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* TAB 2: COMPOSE NEW STORY */}
              {activeTab === 'compose' && (
                <div className="max-w-3xl mx-auto space-y-6">
                  <div className="border-b border-stone-200 pb-3">
                    <h3 className="font-serif text-2xl font-bold text-stone-900">
                      Publish a New Story
                    </h3>
                    <p className="text-xs text-stone-500 mt-1">
                      Compose campus articles, assign student bylines, attach photos, and publish directly to The Inkspirer without touching code.
                    </p>
                  </div>

                  <form onSubmit={handlePublishNewArticle} className="space-y-5">
                    {/* Category & Status Flags */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-stone-700 mb-1">
                          Publication Category <span className="text-red-500">*</span>
                        </label>
                        <select
                          value={composerCategory}
                          onChange={(e) => setComposerCategory(e.target.value as Category)}
                          className="w-full px-3 py-2 text-xs border border-stone-300 rounded bg-white font-medium focus:ring-1 focus:ring-[#0B2545] focus:outline-none"
                        >
                          {categories.map((c) => (
                            <option key={c.id} value={c.name}>
                              {c.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="flex items-center gap-2 pt-6">
                        <label className="inline-flex items-center gap-2 cursor-pointer text-xs font-medium text-stone-700">
                          <input
                            type="checkbox"
                            checked={composerLeadStory}
                            onChange={(e) => setComposerLeadStory(e.target.checked)}
                            className="rounded border-stone-300 text-[#0B2545] focus:ring-[#0B2545]"
                          />
                          <span>Set as Front-Page Lead Story</span>
                        </label>
                      </div>

                      <div className="flex items-center gap-2 pt-6">
                        <label className="inline-flex items-center gap-2 cursor-pointer text-xs font-medium text-stone-700">
                          <input
                            type="checkbox"
                            checked={composerFeatured}
                            onChange={(e) => setComposerFeatured(e.target.checked)}
                            className="rounded border-stone-300 text-[#0B2545] focus:ring-[#0B2545]"
                          />
                          <span>Mark as Special Feature</span>
                        </label>
                      </div>
                    </div>

                    {/* Headline */}
                    <div>
                      <label className="block text-xs font-semibold text-stone-700 mb-1">
                        Article Headline <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={composerTitle}
                        onChange={(e) => setComposerTitle(e.target.value)}
                        placeholder="e.g. BNHS Environmental Club Launches Native Mangrove Seedling Nursery"
                        className="w-full px-3 py-2 text-sm font-serif border border-stone-300 rounded focus:ring-1 focus:ring-[#0B2545] focus:outline-none font-bold text-stone-900"
                      />
                    </div>

                    {/* Deck / Subtitle */}
                    <div>
                      <label className="block text-xs font-semibold text-stone-700 mb-1">
                        Deck / Summary (Sub-headline)
                      </label>
                      <input
                        type="text"
                        value={composerDeck}
                        onChange={(e) => setComposerDeck(e.target.value)}
                        placeholder="A concise, engaging secondary deck that summarizes the core development..."
                        className="w-full px-3 py-2 text-xs border border-stone-300 rounded focus:ring-1 focus:ring-[#0B2545] focus:outline-none"
                      />
                    </div>

                    {/* Author Byline */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-stone-700 mb-1">
                          Writer / Journalist Name <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          value={composerAuthor}
                          onChange={(e) => setComposerAuthor(e.target.value)}
                          placeholder="e.g. John Cedric Morales"
                          className="w-full px-3 py-2 text-xs border border-stone-300 rounded focus:ring-1 focus:ring-[#0B2545] focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-stone-700 mb-1">
                          Author Role or Grade Level
                        </label>
                        <input
                          type="text"
                          value={composerRole}
                          onChange={(e) => setComposerRole(e.target.value)}
                          placeholder="e.g. Editor-in-Chief / Grade 12 HUMSS"
                          className="w-full px-3 py-2 text-xs border border-stone-300 rounded focus:ring-1 focus:ring-[#0B2545] focus:outline-none"
                        />
                      </div>
                    </div>

                    {/* Story Content */}
                    <div>
                      <label className="block text-xs font-semibold text-stone-700 mb-1">
                        Story Narrative (Separate paragraphs with double enter) <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        required
                        rows={8}
                        value={composerContent}
                        onChange={(e) => setComposerContent(e.target.value)}
                        placeholder="BAROBO, SURIGAO DEL SUR — Write the complete journalistic article here..."
                        className="w-full px-3 py-2 text-xs border border-stone-300 rounded font-sans leading-relaxed focus:ring-1 focus:ring-[#0B2545] focus:outline-none"
                      />
                    </div>

                    {/* Pull Quote & Photo Options */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-stone-700 mb-1">
                          Editorial Pull Quote (Optional)
                        </label>
                        <input
                          type="text"
                          value={composerPullQuote}
                          onChange={(e) => setComposerPullQuote(e.target.value)}
                          placeholder="“A poignant excerpt or key quote from the article...”"
                          className="w-full px-3 py-2 text-xs border border-stone-300 rounded focus:ring-1 focus:ring-[#0B2545] focus:outline-none italic"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-stone-700 mb-1">
                          Photo Caption (Optional)
                        </label>
                        <input
                          type="text"
                          value={composerCaption}
                          onChange={(e) => setComposerCaption(e.target.value)}
                          placeholder="e.g. Student researchers analyzing water specimens in Lab 2."
                          className="w-full px-3 py-2 text-xs border border-stone-300 rounded focus:ring-1 focus:ring-[#0B2545] focus:outline-none"
                        />
                      </div>
                    </div>

                    {/* Image Attachment (File upload or URL) */}
                    <div className="border border-stone-200 bg-[#FBF9F5] p-4 rounded-lg space-y-3">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-bold uppercase tracking-wider text-stone-700 flex items-center gap-1.5">
                          <Upload className="w-3.5 h-3.5 text-[#133E87]" />
                          <span>Attach Photo or Artwork</span>
                        </label>
                        <span className="text-[11px] text-stone-400">
                          (Defaults to custom category SVG artwork if none uploaded)
                        </span>
                      </div>

                      <div className="flex flex-col sm:flex-row items-center gap-3">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageFileChange}
                          className="w-full text-xs text-stone-500 file:mr-3 file:py-1.5 file:px-3 file:rounded file:border-0 file:text-xs file:font-semibold file:bg-[#0B2545] file:text-white hover:file:bg-[#133E87]"
                        />
                        <span className="text-xs text-stone-400">or</span>
                        <input
                          type="text"
                          value={composerImageUrl}
                          onChange={(e) => setComposerImageUrl(e.target.value)}
                          placeholder="Paste image URL (e.g. https://...)"
                          className="w-full px-3 py-1.5 text-xs border border-stone-300 rounded bg-white focus:ring-1 focus:ring-[#0B2545] focus:outline-none"
                        />
                      </div>

                      {composerImageUrl && (
                        <div className="mt-2 flex items-center gap-3 bg-white p-2 rounded border border-stone-200">
                          <img
                            src={composerImageUrl}
                            alt="Preview"
                            className="w-16 h-12 object-cover rounded border border-stone-200"
                          />
                          <div className="text-xs text-stone-600 flex-1 truncate">
                            Image attached successfully
                          </div>
                          <button
                            type="button"
                            onClick={() => setComposerImageUrl('')}
                            className="text-xs text-red-600 hover:underline"
                          >
                            Remove
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Publish Action Button */}
                    <div className="flex justify-end gap-3 pt-3 border-t border-stone-200">
                      <button
                        type="submit"
                        className="px-6 py-2.5 text-xs font-semibold text-white bg-[#0B2545] hover:bg-[#133E87] rounded transition-colors flex items-center gap-2 shadow-xs"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Publish Article to Live Portal</span>
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* TAB 3: MANAGE PUBLISHED ARTICLES & CATEGORIES */}
              {activeTab === 'articles' && (
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-200 pb-3">
                    <div>
                      <h3 className="font-serif text-xl font-bold text-stone-900">
                        Manage Published Articles & Categories
                      </h3>
                      <p className="text-xs text-stone-500">
                        Create, edit, update, delete stories, change publication categories, and upload/replace story photos.
                      </p>
                    </div>
                    <button
                      onClick={() => setActiveTab('compose')}
                      className="px-3.5 py-2 text-xs font-semibold text-white bg-[#0B2545] hover:bg-[#133E87] rounded transition-colors flex items-center gap-1.5 shrink-0 shadow-xs"
                    >
                      <PlusCircle className="w-3.5 h-3.5" />
                      <span>Create New Story</span>
                    </button>
                  </div>

                  {/* Filter & Search Bar */}
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-stone-50 p-2.5 rounded-lg border border-stone-200">
                    <div className="flex items-center gap-1 overflow-x-auto">
                      <button
                        type="button"
                        onClick={() => setArticleCategoryFilter('All')}
                        className={`px-3 py-1 text-xs rounded font-medium transition-colors whitespace-nowrap ${
                          articleCategoryFilter === 'All'
                            ? 'bg-[#0B2545] text-white font-semibold'
                            : 'text-stone-600 hover:bg-stone-200'
                        }`}
                      >
                        <span>All</span>
                        <span className="ml-1 text-[10px] opacity-75">({articles.length})</span>
                      </button>
                      {categories.map((cat) => {
                        const count = articles.filter(
                          (a) => a.category.toLowerCase() === cat.name.toLowerCase()
                        ).length;
                        return (
                          <button
                            key={cat.id}
                            type="button"
                            onClick={() => setArticleCategoryFilter(cat.name)}
                            className={`px-3 py-1 text-xs rounded font-medium transition-colors whitespace-nowrap flex items-center gap-1.5 ${
                              articleCategoryFilter.toLowerCase() === cat.name.toLowerCase()
                                ? 'bg-[#0B2545] text-white font-semibold'
                                : 'text-stone-600 hover:bg-stone-200'
                            }`}
                          >
                            <span
                              className="w-1.5 h-1.5 rounded-full"
                              style={{ backgroundColor: cat.color }}
                            />
                            <span>{cat.name}</span>
                            <span className="text-[10px] opacity-75">({count})</span>
                          </button>
                        );
                      })}
                    </div>

                    <input
                      type="text"
                      value={articleSearchQuery}
                      onChange={(e) => setArticleSearchQuery(e.target.value)}
                      placeholder="Search title or author..."
                      className="px-3 py-1 text-xs border border-stone-300 rounded bg-white text-stone-800 focus:outline-none focus:ring-1 focus:ring-[#0B2545] w-full sm:w-56"
                    />
                  </div>

                  {/* Articles List */}
                  <div className="space-y-3">
                    {articles
                      .filter((art) => {
                        if (articleCategoryFilter !== 'All' && art.category !== articleCategoryFilter) return false;
                        if (articleSearchQuery.trim()) {
                          const q = articleSearchQuery.toLowerCase();
                          return art.title.toLowerCase().includes(q) || art.author.toLowerCase().includes(q);
                        }
                        return true;
                      })
                      .map((art) => (
                        <div
                          key={art.id}
                          className="bg-white border border-stone-200 rounded-lg p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:border-stone-400 transition-colors shadow-2xs"
                        >
                          <div className="flex items-start gap-3 max-w-xl">
                            {/* Photo Thumbnail */}
                            <div className="w-16 h-14 sm:w-20 sm:h-16 rounded overflow-hidden bg-stone-100 border border-stone-200 shrink-0 flex items-center justify-center">
                              {art.imageUrl ? (
                                <img
                                  src={art.imageUrl}
                                  alt={art.title}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="text-[10px] font-bold uppercase tracking-wider text-stone-400 text-center px-1">
                                  {art.category}
                                </div>
                              )}
                            </div>

                            <div className="space-y-1">
                              <div className="flex items-center gap-2 text-xs text-stone-500 flex-wrap">
                                <span className="font-bold text-[#133E87] uppercase tracking-wide bg-blue-50 px-2 py-0.5 rounded border border-blue-200 text-[10px]">
                                  {art.category} Desk
                                </span>
                                <span aria-hidden="true">·</span>
                                <span>{art.date}</span>
                                {art.leadStory && (
                                  <span className="text-[10px] font-bold text-amber-900 bg-amber-100 px-1.5 py-0.2 rounded">
                                    ★ Front-Page Lead
                                  </span>
                                )}
                                {art.featured && (
                                  <span className="text-[10px] font-bold text-emerald-900 bg-emerald-100 px-1.5 py-0.2 rounded">
                                    Featured
                                  </span>
                                )}
                              </div>
                              <h4 className="font-serif text-base font-bold text-stone-900 leading-snug line-clamp-1">
                                {art.title}
                              </h4>
                              <div className="text-xs text-stone-500">
                                By {art.author} ({art.authorRole}) · {art.views} views · {art.likes} likes
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                            {/* Edit Button */}
                            <button
                              type="button"
                              onClick={() => handleOpenEditArticle(art)}
                              className="px-3 py-1.5 text-xs rounded border border-[#0B2545] text-[#0B2545] hover:bg-[#0B2545] hover:text-white font-medium transition-colors flex items-center gap-1.5 shadow-2xs"
                              title="Edit headline, content, category, and photo"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                              <span>Edit Story & Photo</span>
                            </button>

                            {/* Lead Story Toggle */}
                            <button
                              type="button"
                              onClick={() => {
                                onUpdateArticle({
                                  ...art,
                                  leadStory: !art.leadStory,
                                });
                                showToast(
                                  art.leadStory
                                    ? 'Unset from lead story'
                                    : 'Promoted to Front-Page Lead Story!'
                                );
                              }}
                              className={`px-2.5 py-1.5 text-xs rounded border transition-colors ${
                                art.leadStory
                                  ? 'bg-amber-100 border-amber-300 text-amber-900 font-semibold'
                                  : 'bg-stone-50 border-stone-200 text-stone-600 hover:bg-stone-100'
                              }`}
                              title={art.leadStory ? 'Demote from front-page lead' : 'Promote to front-page lead'}
                            >
                              {art.leadStory ? 'Lead ★' : 'Make Lead'}
                            </button>

                            {/* Delete Button */}
                            <button
                              type="button"
                              onClick={() => {
                                if (confirm(`Delete story "${art.title}" from portal?`)) {
                                  onDeleteArticle(art.id);
                                  showToast('Story deleted from portal');
                                }
                              }}
                              className="p-1.5 rounded text-stone-400 hover:text-red-600 hover:bg-red-50 transition-colors border border-transparent hover:border-red-200"
                              title="Delete article permanently"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                  </div>

                  {/* EDIT ARTICLE MODAL */}
                  {editingArticle && (
                    <div className="fixed inset-0 z-60 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs">
                      <div className="bg-white rounded-lg shadow-2xl max-w-3xl w-full p-6 border border-stone-200 max-h-[90vh] overflow-y-auto">
                        <div className="flex items-start justify-between gap-4 mb-4 border-b border-stone-200 pb-3">
                          <div>
                            <div className="text-xs font-bold uppercase tracking-wider text-[#133E87] mb-0.5">
                              Edit Publication Story & Photo
                            </div>
                            <h3 className="font-serif text-xl font-bold text-stone-900">
                              Edit: {editingArticle.title}
                            </h3>
                          </div>
                          <button
                            type="button"
                            onClick={() => setEditingArticle(null)}
                            className="p-1 rounded text-stone-400 hover:text-stone-700"
                          >
                            <X className="w-5 h-5" />
                          </button>
                        </div>

                        <form onSubmit={handleSaveEditedArticle} className="space-y-4">
                          {/* Category and Toggles */}
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                            <div>
                              <label className="block text-xs font-semibold text-stone-700 mb-1">
                                Category <span className="text-red-500">*</span>
                              </label>
                              <select
                                value={editCategory}
                                onChange={(e) => setEditCategory(e.target.value as Category)}
                                className="w-full px-3 py-1.5 text-xs border border-stone-300 rounded bg-white font-medium focus:ring-1 focus:ring-[#0B2545] focus:outline-none"
                              >
                                {categories.map((c) => (
                                  <option key={c.id} value={c.name}>
                                    {c.name}
                                  </option>
                                ))}
                              </select>
                            </div>

                            <div className="flex items-center gap-2 pt-5">
                              <label className="inline-flex items-center gap-2 cursor-pointer text-xs font-medium text-stone-700">
                                <input
                                  type="checkbox"
                                  checked={editLeadStory}
                                  onChange={(e) => setEditLeadStory(e.target.checked)}
                                  className="rounded border-stone-300 text-[#0B2545] focus:ring-[#0B2545]"
                                />
                                <span>Set as Lead Story</span>
                              </label>
                            </div>

                            <div className="flex items-center gap-2 pt-5">
                              <label className="inline-flex items-center gap-2 cursor-pointer text-xs font-medium text-stone-700">
                                <input
                                  type="checkbox"
                                  checked={editFeatured}
                                  onChange={(e) => setEditFeatured(e.target.checked)}
                                  className="rounded border-stone-300 text-[#0B2545] focus:ring-[#0B2545]"
                                />
                                <span>Mark as Featured</span>
                              </label>
                            </div>
                          </div>

                          {/* Headline */}
                          <div>
                            <label className="block text-xs font-semibold text-stone-700 mb-1">
                              Headline / Title <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="text"
                              required
                              value={editTitle}
                              onChange={(e) => setEditTitle(e.target.value)}
                              className="w-full px-3 py-1.5 text-sm font-serif font-bold text-stone-900 border border-stone-300 rounded focus:ring-1 focus:ring-[#0B2545] focus:outline-none"
                            />
                          </div>

                          {/* Deck */}
                          <div>
                            <label className="block text-xs font-semibold text-stone-700 mb-1">
                              Deck / Sub-headline
                            </label>
                            <input
                              type="text"
                              value={editDeck}
                              onChange={(e) => setEditDeck(e.target.value)}
                              className="w-full px-3 py-1.5 text-xs border border-stone-300 rounded focus:ring-1 focus:ring-[#0B2545] focus:outline-none"
                            />
                          </div>

                          {/* Author & Role */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div>
                              <label className="block text-xs font-semibold text-stone-700 mb-1">
                                Author Name
                              </label>
                              <input
                                type="text"
                                value={editAuthor}
                                onChange={(e) => setEditAuthor(e.target.value)}
                                className="w-full px-3 py-1.5 text-xs border border-stone-300 rounded focus:ring-1 focus:ring-[#0B2545] focus:outline-none"
                              />
                            </div>

                            <div>
                              <label className="block text-xs font-semibold text-stone-700 mb-1">
                                Author Role or Section
                              </label>
                              <input
                                type="text"
                                value={editRole}
                                onChange={(e) => setEditRole(e.target.value)}
                                className="w-full px-3 py-1.5 text-xs border border-stone-300 rounded focus:ring-1 focus:ring-[#0B2545] focus:outline-none"
                              />
                            </div>
                          </div>

                          {/* Story Narrative */}
                          <div>
                            <label className="block text-xs font-semibold text-stone-700 mb-1">
                              Story Narrative (Paragraphs separated by double enter) <span className="text-red-500">*</span>
                            </label>
                            <textarea
                              required
                              rows={6}
                              value={editContent}
                              onChange={(e) => setEditContent(e.target.value)}
                              className="w-full px-3 py-2 text-xs border border-stone-300 rounded font-sans leading-relaxed focus:ring-1 focus:ring-[#0B2545] focus:outline-none"
                            />
                          </div>

                          {/* Pull Quote & Caption */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div>
                              <label className="block text-xs font-semibold text-stone-700 mb-1">
                                Pull Quote
                              </label>
                              <input
                                type="text"
                                value={editPullQuote}
                                onChange={(e) => setEditPullQuote(e.target.value)}
                                placeholder="“Memorable excerpt...”"
                                className="w-full px-3 py-1.5 text-xs border border-stone-300 rounded italic focus:ring-1 focus:ring-[#0B2545] focus:outline-none"
                              />
                            </div>

                            <div>
                              <label className="block text-xs font-semibold text-stone-700 mb-1">
                                Photo Caption
                              </label>
                              <input
                                type="text"
                                value={editCaption}
                                onChange={(e) => setEditCaption(e.target.value)}
                                placeholder="Description of the photo..."
                                className="w-full px-3 py-1.5 text-xs border border-stone-300 rounded focus:ring-1 focus:ring-[#0B2545] focus:outline-none"
                              />
                            </div>
                          </div>

                          {/* PHOTO UPLOAD & MANAGEMENT */}
                          <div className="border border-stone-200 bg-[#FBF9F5] p-3.5 rounded-lg space-y-2">
                            <label className="text-xs font-bold uppercase tracking-wider text-stone-700 flex items-center gap-1.5">
                              <Upload className="w-3.5 h-3.5 text-[#133E87]" />
                              <span>Upload or Replace Story Photo</span>
                            </label>

                            <div className="flex flex-col sm:flex-row items-center gap-3">
                              <input
                                type="file"
                                accept="image/*"
                                onChange={handleEditImageUpload}
                                className="w-full text-xs text-stone-500 file:mr-3 file:py-1 file:px-3 file:rounded file:border-0 file:text-xs file:font-semibold file:bg-[#0B2545] file:text-white hover:file:bg-[#133E87]"
                              />
                              <span className="text-xs text-stone-400">or</span>
                              <input
                                type="text"
                                value={editImageUrl}
                                onChange={(e) => setEditImageUrl(e.target.value)}
                                placeholder="Paste image URL (https://...)"
                                className="w-full px-3 py-1.5 text-xs border border-stone-300 rounded bg-white focus:ring-1 focus:ring-[#0B2545] focus:outline-none"
                              />
                            </div>

                            {editImageUrl && (
                              <div className="mt-2 flex items-center gap-3 bg-white p-2 rounded border border-stone-200">
                                <img
                                  src={editImageUrl}
                                  alt="Photo Preview"
                                  className="w-16 h-12 object-cover rounded border border-stone-200"
                                />
                                <div className="text-xs text-stone-600 flex-1 truncate">
                                  Photo attached successfully
                                </div>
                                <button
                                  type="button"
                                  onClick={() => setEditImageUrl('')}
                                  className="text-xs text-red-600 hover:underline"
                                >
                                  Remove Photo
                                </button>
                              </div>
                            )}
                          </div>

                          {/* Action Buttons */}
                          <div className="flex justify-end gap-2 pt-3 border-t border-stone-200">
                            <button
                              type="button"
                              onClick={() => setEditingArticle(null)}
                              className="px-4 py-2 text-xs font-semibold text-stone-600 hover:bg-stone-100 rounded transition-colors"
                            >
                              Cancel
                            </button>
                            <button
                              type="submit"
                              className="px-5 py-2 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded transition-colors flex items-center gap-1.5 shadow-xs"
                            >
                              <CheckCircle2 className="w-4 h-4" />
                              <span>Save & Update Story</span>
                            </button>
                          </div>
                        </form>
                      </div>
                    </div>
                  )}
                </div>
              )}


              {/* TAB 4: CAMPUS ANNOUNCEMENTS */}
              {activeTab === 'announcements' && (
                <div className="space-y-6">
                  <div className="border-b border-stone-200 pb-3">
                    <h3 className="font-serif text-xl font-bold text-stone-900">
                      Manage Campus Announcements & Circulars
                    </h3>
                    <p className="text-xs text-stone-500 mt-1">
                      Post examination schedules, press conferences, and school notices to the top announcement ticker and gazette.
                    </p>
                  </div>

                  {/* Add Announcement Form */}
                  <form
                    onSubmit={handleCreateAnnouncement}
                    className="bg-[#FBF9F5] border border-stone-200 rounded-lg p-5 space-y-4"
                  >
                    <div className="text-xs font-bold uppercase tracking-wider text-[#0B2545] flex items-center gap-1.5">
                      <Megaphone className="w-4 h-4 text-[#133E87]" />
                      <span>Post a New Campus Notice</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="sm:col-span-2">
                        <label className="block text-xs font-semibold text-stone-700 mb-1">
                          Notice Title <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          value={annTitle}
                          onChange={(e) => setAnnTitle(e.target.value)}
                          placeholder="e.g. Schedule of 2nd Quarter Periodic Examinations"
                          className="w-full px-3 py-1.5 text-xs border border-stone-300 rounded bg-white focus:ring-1 focus:ring-[#0B2545] focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-stone-700 mb-1">
                          Bulletin Category
                        </label>
                        <select
                          value={annType}
                          onChange={(e) => setAnnType(e.target.value as Announcement['type'])}
                          className="w-full px-3 py-1.5 text-xs border border-stone-300 rounded bg-white focus:ring-1 focus:ring-[#0B2545] focus:outline-none font-medium"
                        >
                          <option value="Academic">Academic Notice</option>
                          <option value="Press">Press Conference</option>
                          <option value="Event">Campus Event</option>
                          <option value="Urgent">Urgent / Safety</option>
                          <option value="General">General Notice</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-stone-700 mb-1">
                          Effective Date or Deadline
                        </label>
                        <input
                          type="text"
                          value={annDeadline}
                          onChange={(e) => setAnnDeadline(e.target.value)}
                          placeholder="e.g. November 6–7, 2026"
                          className="w-full px-3 py-1.5 text-xs border border-stone-300 rounded bg-white focus:ring-1 focus:ring-[#0B2545] focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-stone-700 mb-1">
                          Venue or Location
                        </label>
                        <input
                          type="text"
                          value={annLocation}
                          onChange={(e) => setAnnLocation(e.target.value)}
                          placeholder="e.g. BNHS Gymnasium / Audio-Visual Room"
                          className="w-full px-3 py-1.5 text-xs border border-stone-300 rounded bg-white focus:ring-1 focus:ring-[#0B2545] focus:outline-none"
                        />
                      </div>

                      <div className="flex items-center gap-2 pt-6">
                        <label className="inline-flex items-center gap-2 cursor-pointer text-xs font-medium text-stone-700">
                          <input
                            type="checkbox"
                            checked={annUrgent}
                            onChange={(e) => setAnnUrgent(e.target.checked)}
                            className="rounded border-stone-300 text-red-600 focus:ring-red-500"
                          />
                          <span>Pin to Top as Urgent Notice</span>
                        </label>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-stone-700 mb-1">
                        Notice Details & Instructions <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        required
                        rows={3}
                        value={annContent}
                        onChange={(e) => setAnnContent(e.target.value)}
                        placeholder="Provide details, permits required, and instructions for learners and parents..."
                        className="w-full px-3 py-1.5 text-xs border border-stone-300 rounded bg-white focus:ring-1 focus:ring-[#0B2545] focus:outline-none"
                      />
                    </div>

                    <div className="flex justify-end">
                      <button
                        type="submit"
                        className="px-4 py-2 text-xs font-semibold text-white bg-[#0B2545] hover:bg-[#133E87] rounded transition-colors flex items-center gap-1.5"
                      >
                        <PlusCircle className="w-3.5 h-3.5" />
                        <span>Post Announcement</span>
                      </button>
                    </div>
                  </form>

                  {/* List of Announcements */}
                  <div className="space-y-3">
                    {announcements.map((ann) => (
                      <div
                        key={ann.id}
                        className="bg-white border border-stone-200 rounded p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-xs">
                            <span className="font-bold text-[#991B1B] uppercase tracking-wide">
                              {ann.type} Notice
                            </span>
                            <span aria-hidden="true">·</span>
                            <span className="text-stone-500">{ann.date}</span>
                            {ann.isPinned && (
                              <span className="text-[10px] font-bold text-amber-900 bg-amber-100 px-1.5 py-0.2 rounded">
                                Pinned
                              </span>
                            )}
                          </div>
                          <h4 className="font-serif font-bold text-stone-900 text-base">
                            {ann.title}
                          </h4>
                          <p className="text-xs text-stone-600 line-clamp-2 max-w-xl">
                            {ann.content}
                          </p>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <button
                            onClick={() => {
                              onTogglePinAnnouncement(ann.id);
                              showToast(ann.isPinned ? 'Unpinned notice' : 'Pinned notice to top');
                            }}
                            className={`px-2.5 py-1 text-xs rounded border transition-colors ${
                              ann.isPinned
                                ? 'bg-amber-100 border-amber-300 text-amber-900 font-semibold'
                                : 'bg-stone-50 border-stone-200 text-stone-600 hover:bg-stone-100'
                            }`}
                          >
                            {ann.isPinned ? 'Pinned ★' : 'Pin to Top'}
                          </button>

                          <button
                            onClick={() => {
                              if (confirm(`Delete announcement "${ann.title}"?`)) {
                                onDeleteAnnouncement(ann.id);
                                showToast('Announcement removed');
                              }
                            }}
                            className="p-1.5 rounded text-stone-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                            title="Delete announcement"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB: PUBLICATION CATEGORIES & BEATS MANAGEMENT */}
              {activeTab === 'categories' && (
                <div className="space-y-6">
                  {/* Category Management Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200 pb-4">
                    <div>
                      <div className="text-xs font-bold uppercase tracking-wider text-[#D4AF37] mb-0.5">
                        Publication Beats & Menus Architecture
                      </div>
                      <h3 className="font-serif text-2xl font-bold text-stone-900">
                        Category & Beat Management
                      </h3>
                      <p className="text-xs text-stone-500 mt-1 max-w-2xl">
                        Add, edit, rename, or delete publication categories. Upload display cover photos, customize color badges, and assign icons. All updates cascade across the masthead, reader, filters, and story archives.
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={handleOpenAddCategory}
                        className="px-4 py-2 text-xs font-bold text-white bg-[#0B2545] hover:bg-[#133E87] rounded-md transition-colors flex items-center gap-2 shadow-xs shrink-0"
                      >
                        <PlusCircle className="w-4 h-4 text-[#D4AF37]" />
                        <span>Add New Category</span>
                      </button>
                    </div>
                  </div>

                  {/* Summary Bar */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div className="bg-stone-50 border border-stone-200 rounded-lg p-3">
                      <div className="text-[11px] font-medium text-stone-500 uppercase tracking-wider">
                        Active Categories
                      </div>
                      <div className="text-xl font-bold text-stone-900 mt-0.5">
                        {categories.length}
                      </div>
                    </div>
                    <div className="bg-stone-50 border border-stone-200 rounded-lg p-3">
                      <div className="text-[11px] font-medium text-stone-500 uppercase tracking-wider">
                        Categorized Stories
                      </div>
                      <div className="text-xl font-bold text-[#0B2545] mt-0.5">
                        {articles.length}
                      </div>
                    </div>
                    <div className="bg-stone-50 border border-stone-200 rounded-lg p-3">
                      <div className="text-[11px] font-medium text-stone-500 uppercase tracking-wider">
                        Pending In Review
                      </div>
                      <div className="text-xl font-bold text-amber-700 mt-0.5">
                        {pendingCount}
                      </div>
                    </div>
                    <div className="bg-stone-50 border border-stone-200 rounded-lg p-3">
                      <div className="text-[11px] font-medium text-stone-500 uppercase tracking-wider">
                        Photo Banners
                      </div>
                      <div className="text-xl font-bold text-emerald-700 mt-0.5">
                        {categories.filter((c) => !!c.imageUrl).length} / {categories.length}
                      </div>
                    </div>
                  </div>

                  {/* Categories Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {categories.map((cat) => {
                      const storyCount = articles.filter(
                        (a) => a.category.toLowerCase() === cat.name.toLowerCase()
                      ).length;
                      const subCount = submissions.filter(
                        (s) => s.category.toLowerCase() === cat.name.toLowerCase()
                      ).length;

                      return (
                        <div
                          key={cat.id}
                          className="bg-white border border-stone-200 rounded-lg overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col group"
                        >
                          {/* Category Cover Photo / Image Banner */}
                          <div className="relative h-36 bg-stone-900 overflow-hidden">
                            {cat.imageUrl ? (
                              <img
                                src={cat.imageUrl}
                                alt={cat.name}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                              />
                            ) : (
                              <div
                                className="w-full h-full opacity-90 flex items-center justify-center"
                                style={{
                                  background: `linear-gradient(135deg, ${cat.color} 0%, #1c1917 100%)`,
                                }}
                              >
                                <CategoryIcon
                                  name={cat.iconName}
                                  className="w-12 h-12 text-white/40"
                                />
                              </div>
                            )}

                            {/* Dark Gradient Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/20" />

                            {/* Top Badges */}
                            <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between">
                              <span
                                className="px-2.5 py-1 rounded text-xs font-bold text-white shadow-sm flex items-center gap-1.5"
                                style={{ backgroundColor: cat.color }}
                              >
                                <CategoryIcon name={cat.iconName} className="w-3.5 h-3.5" />
                                <span>{cat.name}</span>
                              </span>

                              <div className="flex items-center gap-1.5">
                                {cat.isDefault && (
                                  <span className="text-[10px] font-semibold bg-white/90 text-stone-800 px-2 py-0.5 rounded shadow-xs">
                                    Default Beat
                                  </span>
                                )}
                                <span className="text-[10px] font-semibold bg-black/60 text-white backdrop-blur-xs px-2 py-0.5 rounded">
                                  {storyCount} {storyCount === 1 ? 'story' : 'stories'}
                                </span>
                              </div>
                            </div>

                            {/* Bottom Title in Banner */}
                            <div className="absolute bottom-2.5 left-3 right-3 text-white">
                              <div className="font-serif font-bold text-lg leading-tight drop-shadow-sm flex items-center gap-2">
                                <span>{cat.name} Desk</span>
                              </div>
                              <div className="text-[10px] text-stone-300 font-mono">
                                #{cat.slug}
                              </div>
                            </div>
                          </div>

                          {/* Card Body */}
                          <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                            <p className="text-xs text-stone-600 line-clamp-2 min-h-[32px] leading-relaxed">
                              {cat.description || 'No description provided.'}
                            </p>

                            {/* Badge Preview Strip */}
                            <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-xs">
                              <span className="text-stone-400 text-[11px]">Theme Preview:</span>
                              <span
                                className={`px-2 py-0.5 text-[11px] font-semibold rounded border ${cat.badgeBg} ${cat.badgeText}`}
                              >
                                {cat.name}
                              </span>
                            </div>

                            {/* Story Stats Meta */}
                            <div className="flex items-center justify-between text-[11px] text-stone-500 bg-stone-50 px-2.5 py-1.5 rounded">
                              <span>
                                <strong>{storyCount}</strong> live articles
                              </span>
                              <span>
                                <strong>{subCount}</strong> submissions
                              </span>
                            </div>

                            {/* Action Buttons */}
                            <div className="pt-2 flex items-center justify-between gap-2 border-t border-stone-100">
                              <button
                                type="button"
                                onClick={() => handleOpenEditCategory(cat)}
                                className="flex-1 px-3 py-1.5 text-xs font-semibold rounded border border-[#0B2545] text-[#0B2545] hover:bg-[#0B2545] hover:text-white transition-colors flex items-center justify-center gap-1.5 shadow-2xs"
                              >
                                <Edit3 className="w-3.5 h-3.5" />
                                <span>Edit & Photo</span>
                              </button>

                              <button
                                type="button"
                                onClick={() => handleOpenDeleteCategory(cat)}
                                className="p-1.5 text-stone-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors border border-transparent hover:border-red-200"
                                title={`Delete ${cat.name} category`}
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* ADD CATEGORY MODAL */}
                  {isAddCategoryOpen && (
                    <div className="fixed inset-0 z-60 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs">
                      <div className="bg-white rounded-lg shadow-2xl max-w-2xl w-full p-6 border border-stone-200 max-h-[90vh] overflow-y-auto">
                        <div className="flex items-start justify-between gap-4 mb-4 border-b border-stone-200 pb-3">
                          <div>
                            <div className="text-xs font-bold uppercase tracking-wider text-[#0B2545] mb-0.5">
                              Create Publication Beat
                            </div>
                            <h3 className="font-serif text-xl font-bold text-stone-900">
                              Add New Category
                            </h3>
                          </div>
                          <button
                            type="button"
                            onClick={() => setIsAddCategoryOpen(false)}
                            className="p-1 rounded text-stone-400 hover:text-stone-700"
                          >
                            <X className="w-5 h-5" />
                          </button>
                        </div>

                        <form onSubmit={handleCreateCategory} className="space-y-4">
                          {/* Name & Icon */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-xs font-semibold text-stone-700 mb-1">
                                Category Name <span className="text-red-500">*</span>
                              </label>
                              <input
                                type="text"
                                required
                                value={newCatName}
                                onChange={(e) => setNewCatName(e.target.value)}
                                placeholder="e.g. Science & Technology, Arts & Culture"
                                className="w-full px-3 py-2 text-xs border border-stone-300 rounded focus:ring-1 focus:ring-[#0B2545] focus:outline-none"
                              />
                            </div>

                            <div>
                              <label className="block text-xs font-semibold text-stone-700 mb-1">
                                Category Icon
                              </label>
                              <select
                                value={newCatIcon}
                                onChange={(e) => setNewCatIcon(e.target.value)}
                                className="w-full px-3 py-2 text-xs border border-stone-300 rounded bg-white font-medium focus:ring-1 focus:ring-[#0B2545] focus:outline-none"
                              >
                                {ICON_OPTIONS.map((opt) => (
                                  <option key={opt.id} value={opt.id}>
                                    {opt.label}
                                  </option>
                                ))}
                              </select>
                            </div>
                          </div>

                          {/* Description */}
                          <div>
                            <label className="block text-xs font-semibold text-stone-700 mb-1">
                              Description / Editorial Scope
                            </label>
                            <textarea
                              rows={2}
                              value={newCatDesc}
                              onChange={(e) => setNewCatDesc(e.target.value)}
                              placeholder="Describe what kind of campus articles and stories fall under this beat..."
                              className="w-full px-3 py-2 text-xs border border-stone-300 rounded focus:ring-1 focus:ring-[#0B2545] focus:outline-none resize-none"
                            />
                          </div>

                          {/* Color Palette Selection */}
                          <div>
                            <label className="block text-xs font-semibold text-stone-700 mb-2">
                              Color Theme & Accent
                            </label>
                            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                              {COLOR_PRESETS.map((preset) => (
                                <button
                                  key={preset.name}
                                  type="button"
                                  onClick={() => {
                                    setNewCatColor(preset.color);
                                    setNewCatBadgeBg(preset.badgeBg);
                                    setNewCatBadgeText(preset.badgeText);
                                  }}
                                  className={`p-2 rounded border text-left text-[11px] transition-all flex items-center gap-2 ${
                                    newCatColor === preset.color
                                      ? 'border-[#0B2545] ring-1 ring-[#0B2545] bg-stone-50 font-bold'
                                      : 'border-stone-200 hover:border-stone-400'
                                  }`}
                                >
                                  <span
                                    className="w-3.5 h-3.5 rounded-full shrink-0 shadow-2xs"
                                    style={{ backgroundColor: preset.color }}
                                  />
                                  <span className="truncate">{preset.name}</span>
                                </button>
                              ))}
                            </div>
                          </div>

                          {/* Cover Photo / Image Upload Section */}
                          <div className="border border-stone-200 bg-stone-50 p-4 rounded-lg space-y-3">
                            <label className="block text-xs font-bold text-stone-800">
                              Display Cover Photo / Header Image
                            </label>

                            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                              {/* File Upload Button */}
                              <label className="px-3 py-2 bg-white border border-stone-300 hover:bg-stone-100 rounded text-xs font-medium cursor-pointer text-stone-700 flex items-center justify-center gap-1.5 transition-colors shadow-2xs">
                                <Upload className="w-3.5 h-3.5 text-[#0B2545]" />
                                <span>Upload Photo File</span>
                                <input
                                  type="file"
                                  accept="image/*"
                                  className="hidden"
                                  onChange={(e) => handleCategoryPhotoUpload(e, false)}
                                />
                              </label>

                              <span className="text-xs text-stone-400 text-center sm:text-left">or enter image web URL:</span>

                              <input
                                type="url"
                                value={newCatImageUrl}
                                onChange={(e) => setNewCatImageUrl(e.target.value)}
                                placeholder="https://example.com/cover-photo.jpg"
                                className="flex-1 px-3 py-2 text-xs border border-stone-300 rounded bg-white focus:outline-none focus:ring-1 focus:ring-[#0B2545]"
                              />
                            </div>

                            {/* Preset Photo Suggestions */}
                            <div>
                              <div className="text-[11px] text-stone-500 mb-1.5">
                                Or choose a curated preset image:
                              </div>
                              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                                {PRESET_PHOTOS.map((preset) => (
                                  <button
                                    key={preset.label}
                                    type="button"
                                    onClick={() => setNewCatImageUrl(preset.url)}
                                    className={`relative h-14 rounded overflow-hidden border text-left group transition-all ${
                                      newCatImageUrl === preset.url
                                        ? 'border-[#0B2545] ring-2 ring-[#0B2545]'
                                        : 'border-stone-200 opacity-80 hover:opacity-100'
                                    }`}
                                  >
                                    <img
                                      src={preset.url}
                                      alt={preset.label}
                                      className="w-full h-full object-cover"
                                    />
                                    <div className="absolute inset-0 bg-black/40 flex items-end p-1 text-[9px] text-white font-medium leading-tight">
                                      {preset.label}
                                    </div>
                                  </button>
                                ))}
                              </div>
                            </div>

                            {/* Image Preview */}
                            {newCatImageUrl && (
                              <div className="relative h-28 rounded-lg overflow-hidden border border-stone-200 mt-2">
                                <img
                                  src={newCatImageUrl}
                                  alt="Cover Preview"
                                  className="w-full h-full object-cover"
                                />
                                <div className="absolute top-2 right-2">
                                  <button
                                    type="button"
                                    onClick={() => setNewCatImageUrl('')}
                                    className="p-1 rounded bg-black/70 text-white hover:bg-black transition-colors text-xs"
                                    title="Remove photo"
                                  >
                                    <X className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                                <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded text-[10px] font-semibold bg-black/70 text-white">
                                  Live Banner Preview
                                </div>
                              </div>
                            )}
                          </div>

                          {/* Submit Actions */}
                          <div className="flex items-center justify-end gap-3 pt-3 border-t border-stone-200">
                            <button
                              type="button"
                              onClick={() => setIsAddCategoryOpen(false)}
                              className="px-4 py-2 text-xs font-medium text-stone-600 hover:text-stone-900"
                            >
                              Cancel
                            </button>
                            <button
                              type="submit"
                              className="px-5 py-2 text-xs font-bold text-white bg-[#0B2545] hover:bg-[#133E87] rounded transition-colors shadow-xs"
                            >
                              Create Category
                            </button>
                          </div>
                        </form>
                      </div>
                    </div>
                  )}

                  {/* EDIT CATEGORY MODAL */}
                  {editingCategory && (
                    <div className="fixed inset-0 z-60 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs">
                      <div className="bg-white rounded-lg shadow-2xl max-w-2xl w-full p-6 border border-stone-200 max-h-[90vh] overflow-y-auto">
                        <div className="flex items-start justify-between gap-4 mb-4 border-b border-stone-200 pb-3">
                          <div>
                            <div className="text-xs font-bold uppercase tracking-wider text-[#0B2545] mb-0.5">
                              Edit Publication Beat
                            </div>
                            <h3 className="font-serif text-xl font-bold text-stone-900">
                              Edit Category: {editingCategory.name}
                            </h3>
                          </div>
                          <button
                            type="button"
                            onClick={() => setEditingCategory(null)}
                            className="p-1 rounded text-stone-400 hover:text-stone-700"
                          >
                            <X className="w-5 h-5" />
                          </button>
                        </div>

                        <form onSubmit={handleSaveEditCategory} className="space-y-4">
                          {/* Name & Icon */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-xs font-semibold text-stone-700 mb-1">
                                Category Name <span className="text-red-500">*</span>
                              </label>
                              <input
                                type="text"
                                required
                                value={editCatName}
                                onChange={(e) => setEditCatName(e.target.value)}
                                className="w-full px-3 py-2 text-xs border border-stone-300 rounded focus:ring-1 focus:ring-[#0B2545] focus:outline-none font-medium"
                              />
                            </div>

                            <div>
                              <label className="block text-xs font-semibold text-stone-700 mb-1">
                                Category Icon
                              </label>
                              <select
                                value={editCatIcon}
                                onChange={(e) => setEditCatIcon(e.target.value)}
                                className="w-full px-3 py-2 text-xs border border-stone-300 rounded bg-white font-medium focus:ring-1 focus:ring-[#0B2545] focus:outline-none"
                              >
                                {ICON_OPTIONS.map((opt) => (
                                  <option key={opt.id} value={opt.id}>
                                    {opt.label}
                                  </option>
                                ))}
                              </select>
                            </div>
                          </div>

                          {/* Description */}
                          <div>
                            <label className="block text-xs font-semibold text-stone-700 mb-1">
                              Description / Scope
                            </label>
                            <textarea
                              rows={2}
                              value={editCatDesc}
                              onChange={(e) => setEditCatDesc(e.target.value)}
                              className="w-full px-3 py-2 text-xs border border-stone-300 rounded focus:ring-1 focus:ring-[#0B2545] focus:outline-none resize-none"
                            />
                          </div>

                          {/* Color Palette */}
                          <div>
                            <label className="block text-xs font-semibold text-stone-700 mb-2">
                              Color Accent & Theme
                            </label>
                            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                              {COLOR_PRESETS.map((preset) => (
                                <button
                                  key={preset.name}
                                  type="button"
                                  onClick={() => {
                                    setEditCatColor(preset.color);
                                    setEditCatBadgeBg(preset.badgeBg);
                                    setEditCatBadgeText(preset.badgeText);
                                  }}
                                  className={`p-2 rounded border text-left text-[11px] transition-all flex items-center gap-2 ${
                                    editCatColor === preset.color
                                      ? 'border-[#0B2545] ring-1 ring-[#0B2545] bg-stone-50 font-bold'
                                      : 'border-stone-200 hover:border-stone-400'
                                  }`}
                                >
                                  <span
                                    className="w-3.5 h-3.5 rounded-full shrink-0 shadow-2xs"
                                    style={{ backgroundColor: preset.color }}
                                  />
                                  <span className="truncate">{preset.name}</span>
                                </button>
                              ))}
                            </div>
                          </div>

                          {/* Cover Photo / Image Upload Section */}
                          <div className="border border-stone-200 bg-stone-50 p-4 rounded-lg space-y-3">
                            <label className="block text-xs font-bold text-stone-800">
                              Display Cover Photo / Banner
                            </label>

                            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                              {/* File Upload Button */}
                              <label className="px-3 py-2 bg-white border border-stone-300 hover:bg-stone-100 rounded text-xs font-medium cursor-pointer text-stone-700 flex items-center justify-center gap-1.5 transition-colors shadow-2xs">
                                <Upload className="w-3.5 h-3.5 text-[#0B2545]" />
                                <span>Upload New Photo</span>
                                <input
                                  type="file"
                                  accept="image/*"
                                  className="hidden"
                                  onChange={(e) => handleCategoryPhotoUpload(e, true)}
                                />
                              </label>

                              <span className="text-xs text-stone-400 text-center sm:text-left">or edit image URL:</span>

                              <input
                                type="url"
                                value={editCatImageUrl}
                                onChange={(e) => setEditCatImageUrl(e.target.value)}
                                placeholder="https://example.com/cover-photo.jpg"
                                className="flex-1 px-3 py-2 text-xs border border-stone-300 rounded bg-white focus:outline-none focus:ring-1 focus:ring-[#0B2545]"
                              />
                            </div>

                            {/* Preset Options */}
                            <div>
                              <div className="text-[11px] text-stone-500 mb-1.5">
                                Select from preset campus imagery:
                              </div>
                              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                                {PRESET_PHOTOS.map((preset) => (
                                  <button
                                    key={preset.label}
                                    type="button"
                                    onClick={() => setEditCatImageUrl(preset.url)}
                                    className={`relative h-14 rounded overflow-hidden border text-left group transition-all ${
                                      editCatImageUrl === preset.url
                                        ? 'border-[#0B2545] ring-2 ring-[#0B2545]'
                                        : 'border-stone-200 opacity-80 hover:opacity-100'
                                    }`}
                                  >
                                    <img
                                      src={preset.url}
                                      alt={preset.label}
                                      className="w-full h-full object-cover"
                                    />
                                    <div className="absolute inset-0 bg-black/40 flex items-end p-1 text-[9px] text-white font-medium leading-tight">
                                      {preset.label}
                                    </div>
                                  </button>
                                ))}
                              </div>
                            </div>

                            {/* Image Preview */}
                            {editCatImageUrl && (
                              <div className="relative h-28 rounded-lg overflow-hidden border border-stone-200 mt-2">
                                <img
                                  src={editCatImageUrl}
                                  alt="Cover Preview"
                                  className="w-full h-full object-cover"
                                />
                                <div className="absolute top-2 right-2">
                                  <button
                                    type="button"
                                    onClick={() => setEditCatImageUrl('')}
                                    className="p-1 rounded bg-black/70 text-white hover:bg-black transition-colors text-xs"
                                    title="Remove photo"
                                  >
                                    <X className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                                <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded text-[10px] font-semibold bg-black/70 text-white">
                                  Live Banner Preview
                                </div>
                              </div>
                            )}
                          </div>

                          {/* Submit Actions */}
                          <div className="flex items-center justify-end gap-3 pt-3 border-t border-stone-200">
                            <button
                              type="button"
                              onClick={() => setEditingCategory(null)}
                              className="px-4 py-2 text-xs font-medium text-stone-600 hover:text-stone-900"
                            >
                              Cancel
                            </button>
                            <button
                              type="submit"
                              className="px-5 py-2 text-xs font-bold text-white bg-[#0B2545] hover:bg-[#133E87] rounded transition-colors shadow-xs"
                            >
                              Save Category Changes
                            </button>
                          </div>
                        </form>
                      </div>
                    </div>
                  )}

                  {/* DELETE CATEGORY CONFIRMATION MODAL */}
                  {deletingCategory && (
                    <div className="fixed inset-0 z-60 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs">
                      <div className="bg-white rounded-lg shadow-2xl max-w-md w-full p-6 border border-stone-200">
                        <div className="flex items-center gap-3 mb-4 text-red-600">
                          <AlertTriangle className="w-6 h-6 shrink-0" />
                          <h3 className="font-serif text-lg font-bold text-stone-900">
                            Delete Category: {deletingCategory.name}
                          </h3>
                        </div>

                        <p className="text-xs text-stone-600 leading-relaxed mb-4">
                          Are you sure you want to delete the{' '}
                          <strong className="text-stone-900">{deletingCategory.name}</strong> category?
                          Articles and submissions currently filed under this category will not be lost, but will be safely reassigned.
                        </p>

                        <div className="bg-stone-50 border border-stone-200 rounded p-3 mb-4 space-y-2 text-xs">
                          <label className="block font-semibold text-stone-800">
                            Reassign existing stories to:
                          </label>
                          <select
                            value={deleteFallbackCategory}
                            onChange={(e) => setDeleteFallbackCategory(e.target.value)}
                            className="w-full px-3 py-1.5 border border-stone-300 rounded bg-white font-medium focus:ring-1 focus:ring-[#0B2545]"
                          >
                            {categories
                              .filter((c) => c.id !== deletingCategory.id)
                              .map((c) => (
                                <option key={c.id} value={c.name}>
                                  {c.name}
                                </option>
                              ))}
                          </select>
                        </div>

                        <div className="flex items-center justify-end gap-3 pt-2">
                          <button
                            type="button"
                            onClick={() => setDeletingCategory(null)}
                            className="px-4 py-2 text-xs font-medium text-stone-600 hover:text-stone-900"
                          >
                            Cancel
                          </button>
                          <button
                            type="button"
                            onClick={handleConfirmDeleteCategory}
                            className="px-4 py-2 text-xs font-bold text-white bg-red-600 hover:bg-red-700 rounded transition-colors shadow-xs"
                          >
                            Confirm Delete & Reassign
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* TAB 5: EDITORIAL STAFF */}
              {activeTab === 'staff' && (
                <div className="space-y-6">
                  <div className="border-b border-stone-200 pb-3">
                    <h3 className="font-serif text-xl font-bold text-stone-900">
                      The Inkspirer Editorial Board & Masthead Roster
                    </h3>
                    <p className="text-xs text-stone-500 mt-1">
                      Official publication advisers and student editorial staff of Barobo National High School (A.Y. 2026–2027).
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {staff.map((member) => (
                      <div
                        key={member.id}
                        className="bg-white border border-stone-200 rounded-lg p-4 flex items-center gap-4"
                      >
                        <div className="w-12 h-12 rounded-full bg-[#0B2545] text-white flex items-center justify-center font-bold text-sm tracking-wide shrink-0">
                          {member.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-bold text-stone-900 text-sm">{member.name}</h4>
                          <div className="text-xs font-semibold text-[#133E87]">{member.role}</div>
                          <div className="text-xs text-stone-500 mt-0.5">{member.gradeOrDesignation}</div>
                          <div className="text-[11px] text-stone-400 mt-0.5">{member.department}</div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="border border-stone-200 bg-[#FBF9F5] p-4 rounded text-xs text-stone-600">
                    <strong className="text-stone-800">School Publication Adviser Note:</strong>{' '}
                    The Inkspirer is the official high school paper of Barobo National High School, fostering free, ethical, and courageous campus journalism in Surigao del Sur under the guidance of the English and Filipino Departments.
                  </div>
                </div>
              )}

              {/* TAB 6: NEWSLETTER SUBSCRIBERS */}
              {activeTab === 'subscribers' && (
                <div className="space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-200 pb-3">
                    <div>
                      <h3 className="font-serif text-xl font-bold text-stone-900">
                        Monthly Digital Newsletter Subscribers
                      </h3>
                      <p className="text-xs text-stone-500 mt-1">
                        Active community readers, parents, alumni, and students signed up for monthly school publication highlights.
                      </p>
                    </div>

                    <button
                      onClick={() => {
                        const csvContent =
                          'data:text/csv;charset=utf-8,' +
                          ['Email,Role,Subscribed Date,Beats']
                            .concat(
                              subscribersList.map(
                                (s) =>
                                  `"${s.email}","${s.role}","${s.subscribedAt}","${s.preferredBeats.join('; ')}"`
                              )
                            )
                            .join('\n');
                        const encodedUri = encodeURI(csvContent);
                        const link = document.createElement('a');
                        link.setAttribute('href', encodedUri);
                        link.setAttribute('download', 'inkspirer-subscribers-list.csv');
                        document.body.appendChild(link);
                        link.click();
                        document.body.removeChild(link);
                        showToast('Subscribers CSV exported');
                      }}
                      className="px-3.5 py-1.5 text-xs font-semibold text-stone-700 bg-stone-100 hover:bg-stone-200 rounded transition-colors flex items-center gap-1.5 self-start sm:self-auto"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Export Subscribers (.csv)</span>
                    </button>
                  </div>

                  {/* Summary Metric Strip */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div className="bg-[#FBF9F5] border border-stone-200 rounded p-3 text-center">
                      <div className="text-xl font-bold font-serif text-[#0B2545]">
                        {subscribersList.length + 342}
                      </div>
                      <div className="text-[11px] text-stone-500 uppercase tracking-wider">
                        Total Audience
                      </div>
                    </div>
                    <div className="bg-[#FBF9F5] border border-stone-200 rounded p-3 text-center">
                      <div className="text-xl font-bold font-serif text-emerald-700">98.4%</div>
                      <div className="text-[11px] text-stone-500 uppercase tracking-wider">
                        Deliverability
                      </div>
                    </div>
                    <div className="bg-[#FBF9F5] border border-stone-200 rounded p-3 text-center">
                      <div className="text-xl font-bold font-serif text-[#FB923C]">Monthly</div>
                      <div className="text-[11px] text-stone-500 uppercase tracking-wider">
                        1st Monday Schedule
                      </div>
                    </div>
                    <div className="bg-[#FBF9F5] border border-stone-200 rounded p-3 text-center">
                      <div className="text-xl font-bold font-serif text-[#C084FC]">Zero Spam</div>
                      <div className="text-[11px] text-stone-500 uppercase tracking-wider">
                        DepEd Privacy
                      </div>
                    </div>
                  </div>

                  {/* Subscriber Table */}
                  <div className="bg-white border border-stone-200 rounded-lg overflow-hidden">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-stone-50 border-b border-stone-200 text-stone-600 font-semibold uppercase tracking-wider text-[10px]">
                        <tr>
                          <th className="px-4 py-3">Subscriber Email</th>
                          <th className="px-4 py-3">Community Role</th>
                          <th className="px-4 py-3">Preferred Beats</th>
                          <th className="px-4 py-3">Date Subscribed</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-stone-100">
                        {/* Sample Baseline subscribers */}
                        <tr className="hover:bg-stone-50">
                          <td className="px-4 py-3 font-medium text-stone-900">
                            principal.arturo@bnhs.deped.edu.ph
                          </td>
                          <td className="px-4 py-3 text-stone-600">Faculty & Staff</td>
                          <td className="px-4 py-3">
                            <span className="text-[10px] bg-stone-100 text-stone-700 px-2 py-0.5 rounded">
                              All Stories
                            </span>
                          </td>
                          <td className="px-4 py-3 text-stone-500">October 20, 2026</td>
                        </tr>
                        <tr className="hover:bg-stone-50">
                          <td className="px-4 py-3 font-medium text-stone-900">
                            alumni.pres.claros@gmail.com
                          </td>
                          <td className="px-4 py-3 text-stone-600">Alumni</td>
                          <td className="px-4 py-3">
                            <span className="text-[10px] bg-blue-50 text-blue-800 px-2 py-0.5 rounded mr-1">
                              Features
                            </span>
                            <span className="text-[10px] bg-amber-50 text-amber-800 px-2 py-0.5 rounded">
                              Sports
                            </span>
                          </td>
                          <td className="px-4 py-3 text-stone-500">October 22, 2026</td>
                        </tr>
                        <tr className="hover:bg-stone-50">
                          <td className="px-4 py-3 font-medium text-stone-900">
                            pta.barobo.council@yahoo.com
                          </td>
                          <td className="px-4 py-3 text-stone-600">Parent / Guardian</td>
                          <td className="px-4 py-3">
                            <span className="text-[10px] bg-purple-50 text-purple-800 px-2 py-0.5 rounded">
                              Announcements
                            </span>
                          </td>
                          <td className="px-4 py-3 text-stone-500">October 23, 2026</td>
                        </tr>

                        {/* User registered subscribers */}
                        {subscribersList.map((sub) => (
                          <tr key={sub.id} className="hover:bg-stone-50 bg-amber-50/20">
                            <td className="px-4 py-3 font-medium text-stone-900">{sub.email}</td>
                            <td className="px-4 py-3 text-stone-600">{sub.role}</td>
                            <td className="px-4 py-3">
                              <div className="flex flex-wrap gap-1">
                                {sub.preferredBeats.map((b) => (
                                  <span
                                    key={b}
                                    className="text-[10px] bg-stone-100 text-stone-700 px-1.5 py-0.5 rounded"
                                  >
                                    {b}
                                  </span>
                                ))}
                              </div>
                            </td>
                            <td className="px-4 py-3 text-stone-500">{sub.subscribedAt}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
