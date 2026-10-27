export type Category = string;

export interface PublicationCategory {
  id: string;
  name: string;
  slug: string;
  description: string;
  color: string;
  badgeBg: string;
  badgeText: string;
  iconName?: string;
  imageUrl?: string;
  isDefault?: boolean;
}

export interface Article {
  id: string;
  title: string;
  deck: string;
  category: Category;
  author: string;
  authorRole: string;
  authorBio?: string;
  authorAvatar?: string;
  date: string;
  readTime: string;
  featured?: boolean;
  leadStory?: boolean;
  content: string[];
  pullQuote?: string;
  imageCaption?: string;
  imageUrl?: string;
  categoryTheme: {
    accentColor: string;
    badgeBg: string;
    badgeText: string;
  };
  views: number;
  likes: number;
  issue: string;
}

export interface Announcement {
  id: string;
  title: string;
  type: 'Urgent' | 'Academic' | 'Press' | 'Event' | 'General';
  date: string;
  deadline?: string;
  location?: string;
  content: string;
  urgent?: boolean;
  isPinned?: boolean;
}

export interface StorySubmission {
  id: string;
  studentName: string;
  gradeSection: string;
  email: string;
  category: Category;
  headline: string;
  summary: string;
  content: string;
  notesToEditor?: string;
  submittedAt: string;
  status: 'pending' | 'approved' | 'revision_requested' | 'rejected';
  editorFeedback?: string;
}

export interface EditorialMember {
  id: string;
  name: string;
  role: string;
  gradeOrDesignation: string;
  department: string;
  avatarSeed: string;
}

export interface NewsletterSubscriber {
  id: string;
  email: string;
  role: 'Student' | 'Parent / Guardian' | 'Faculty & Staff' | 'Alumni' | 'Community Supporter';
  preferredBeats: (Category | 'All')[];
  subscribedAt: string;
}

export interface ArticleComment {
  id: string;
  articleId: string;
  authorName: string;
  authorRole?: string;
  message: string;
  createdAt: string;
  likes: number;
}
