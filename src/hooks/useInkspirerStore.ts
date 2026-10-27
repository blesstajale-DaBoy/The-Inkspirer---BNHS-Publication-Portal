import { useState, useEffect } from 'react';
import {
  Article,
  Announcement,
  StorySubmission,
  EditorialMember,
  Category,
  PublicationCategory,
} from '../types';
import {
  INITIAL_ARTICLES,
  INITIAL_ANNOUNCEMENTS,
  INITIAL_SUBMISSIONS,
  INITIAL_EDITORIAL_STAFF,
  INITIAL_CATEGORIES,
} from '../data/initialData';
import {
  collection,
  doc,
  setDoc,
  deleteDoc,
  onSnapshot,
} from 'firebase/firestore';
import { db } from '../lib/firebase';

const STORAGE_KEYS = {
  ARTICLES: 'the_inkspirer_articles_v1',
  ANNOUNCEMENTS: 'the_inkspirer_announcements_v1',
  SUBMISSIONS: 'the_inkspirer_submissions_v1',
  STAFF: 'the_inkspirer_staff_v1',
  BOOKMARKS: 'the_inkspirer_bookmarks_v1',
  LIKED: 'the_inkspirer_liked_v1',
  CATEGORIES: 'the_inkspirer_categories_v1',
};

export function useInkspirerStore() {
  const [articles, setArticles] = useState<Article[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.ARTICLES);
      if (!stored) return INITIAL_ARTICLES;
      const parsed: Article[] = JSON.parse(stored);
      return parsed.map((item) => {
        const initialMatch = INITIAL_ARTICLES.find((a) => a.id === item.id);
        return {
          ...item,
          authorBio: item.authorBio || initialMatch?.authorBio || `Contributing campus writer at Barobo National High School's The Inkspirer.`,
          authorAvatar: item.authorAvatar || initialMatch?.authorAvatar || 'default',
        };
      });
    } catch {
      return INITIAL_ARTICLES;
    }
  });

  const [announcements, setAnnouncements] = useState<Announcement[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.ANNOUNCEMENTS);
      return stored ? JSON.parse(stored) : INITIAL_ANNOUNCEMENTS;
    } catch {
      return INITIAL_ANNOUNCEMENTS;
    }
  });

  const [submissions, setSubmissions] = useState<StorySubmission[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.SUBMISSIONS);
      return stored ? JSON.parse(stored) : INITIAL_SUBMISSIONS;
    } catch {
      return INITIAL_SUBMISSIONS;
    }
  });

  const [staff, setStaff] = useState<EditorialMember[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.STAFF);
      return stored ? JSON.parse(stored) : INITIAL_EDITORIAL_STAFF;
    } catch {
      return INITIAL_EDITORIAL_STAFF;
    }
  });

  const [categories, setCategories] = useState<PublicationCategory[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.CATEGORIES);
      if (!stored) return INITIAL_CATEGORIES;
      const parsed: PublicationCategory[] = JSON.parse(stored);
      if (!Array.isArray(parsed) || parsed.length === 0) return INITIAL_CATEGORIES;
      return parsed;
    } catch {
      return INITIAL_CATEGORIES;
    }
  });

  const [bookmarks, setBookmarks] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.BOOKMARKS);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const [likedArticles, setLikedArticles] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.LIKED);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  // Real-time Firestore sync & Auto-seeding
  useEffect(() => {
    // 1. Articles Firestore listener
    const unsubArticles = onSnapshot(
      collection(db, 'articles'),
      (snap) => {
        if (!snap.empty) {
          const cloudArts = snap.docs.map((d) => d.data() as Article);
          setArticles(cloudArts);
          localStorage.setItem(STORAGE_KEYS.ARTICLES, JSON.stringify(cloudArts));
        } else {
          // Seed initial articles
          INITIAL_ARTICLES.forEach((art) => {
            setDoc(doc(db, 'articles', art.id), art).catch(() => {});
          });
        }
      },
      (err) => {
        console.warn('Firestore articles listener info:', err.message);
      }
    );

    // 2. Announcements Firestore listener
    const unsubAnnouncements = onSnapshot(
      collection(db, 'announcements'),
      (snap) => {
        if (!snap.empty) {
          const cloudAnn = snap.docs.map((d) => d.data() as Announcement);
          setAnnouncements(cloudAnn);
          localStorage.setItem(STORAGE_KEYS.ANNOUNCEMENTS, JSON.stringify(cloudAnn));
        } else {
          INITIAL_ANNOUNCEMENTS.forEach((ann) => {
            setDoc(doc(db, 'announcements', ann.id), ann).catch(() => {});
          });
        }
      },
      (err) => {
        console.warn('Firestore announcements listener info:', err.message);
      }
    );

    // 3. Categories Firestore listener
    const unsubCategories = onSnapshot(
      collection(db, 'categories'),
      (snap) => {
        if (!snap.empty) {
          const cloudCats = snap.docs.map((d) => d.data() as PublicationCategory);
          setCategories(cloudCats);
          localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(cloudCats));
        } else {
          INITIAL_CATEGORIES.forEach((cat) => {
            setDoc(doc(db, 'categories', cat.id), cat).catch(() => {});
          });
        }
      },
      (err) => {
        console.warn('Firestore categories listener info:', err.message);
      }
    );

    // 4. Submissions Firestore listener
    const unsubSubmissions = onSnapshot(
      collection(db, 'submissions'),
      (snap) => {
        if (!snap.empty) {
          const cloudSubs = snap.docs.map((d) => d.data() as StorySubmission);
          setSubmissions(cloudSubs);
          localStorage.setItem(STORAGE_KEYS.SUBMISSIONS, JSON.stringify(cloudSubs));
        } else {
          INITIAL_SUBMISSIONS.forEach((sub) => {
            setDoc(doc(db, 'submissions', sub.id), sub).catch(() => {});
          });
        }
      },
      (err) => {
        console.warn('Firestore submissions listener info:', err.message);
      }
    );

    // 5. Staff Firestore listener
    const unsubStaff = onSnapshot(
      collection(db, 'editorialStaff'),
      (snap) => {
        if (!snap.empty) {
          const cloudStaff = snap.docs.map((d) => d.data() as EditorialMember);
          setStaff(cloudStaff);
          localStorage.setItem(STORAGE_KEYS.STAFF, JSON.stringify(cloudStaff));
        } else {
          INITIAL_EDITORIAL_STAFF.forEach((member) => {
            setDoc(doc(db, 'editorialStaff', member.id), member).catch(() => {});
          });
        }
      },
      (err) => {
        console.warn('Firestore staff listener info:', err.message);
      }
    );

    return () => {
      unsubArticles();
      unsubAnnouncements();
      unsubCategories();
      unsubSubmissions();
      unsubStaff();
    };
  }, []);

  // Save local preferences
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.BOOKMARKS, JSON.stringify(bookmarks));
    } catch (e) {
      console.warn(e);
    }
  }, [bookmarks]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.LIKED, JSON.stringify(likedArticles));
    } catch (e) {
      console.warn(e);
    }
  }, [likedArticles]);

  // Bookmarking
  const toggleBookmark = (id: string) => {
    setBookmarks((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Like article
  const toggleLike = (id: string) => {
    const isLiked = likedArticles.includes(id);
    setLikedArticles((prev) =>
      isLiked ? prev.filter((item) => item !== id) : [...prev, id]
    );
    setArticles((prev) =>
      prev.map((art) => {
        if (art.id === id) {
          const updatedArt = {
            ...art,
            likes: isLiked ? Math.max(0, art.likes - 1) : art.likes + 1,
          };
          setDoc(doc(db, 'articles', id), updatedArt).catch(() => {});
          return updatedArt;
        }
        return art;
      })
    );
  };

  // Increment view
  const incrementView = (id: string) => {
    setArticles((prev) =>
      prev.map((art) => {
        if (art.id === id) {
          const updated = { ...art, views: art.views + 1 };
          setDoc(doc(db, 'articles', id), updated).catch(() => {});
          return updated;
        }
        return art;
      })
    );
  };

  // Student Submissions
  const addSubmission = (
    newSub: Omit<StorySubmission, 'id' | 'submittedAt' | 'status'>
  ): StorySubmission => {
    const created: StorySubmission = {
      ...newSub,
      id: `sub-${Date.now()}`,
      submittedAt: new Date().toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }),
      status: 'pending',
    };
    setSubmissions((prev) => [created, ...prev]);
    setDoc(doc(db, 'submissions', created.id), created).catch(() => {});
    return created;
  };

  const updateSubmissionStatus = (
    id: string,
    status: StorySubmission['status'],
    feedback?: string
  ) => {
    setSubmissions((prev) =>
      prev.map((sub) => {
        if (sub.id === id) {
          const updated: StorySubmission = {
            ...sub,
            status,
            editorFeedback: feedback ?? sub.editorFeedback,
          };
          setDoc(doc(db, 'submissions', id), updated).catch(() => {});
          return updated;
        }
        return sub;
      })
    );
  };

  // Publication Adviser / Editor actions
  const publishSubmissionAsArticle = (submissionId: string) => {
    const sub = submissions.find((s) => s.id === submissionId);
    if (!sub) return null;

    const matchedCat = categories.find((c) => c.name.toLowerCase() === sub.category.toLowerCase());
    const categoryTheme = matchedCat
      ? { accentColor: matchedCat.color, badgeBg: matchedCat.badgeBg, badgeText: matchedCat.badgeText }
      : { accentColor: '#FB923C', badgeBg: 'bg-orange-50', badgeText: 'text-orange-900' };

    const paragraphs = sub.content
      .split('\n\n')
      .map((p) => p.trim())
      .filter(Boolean);

    const newArticle: Article = {
      id: `art-${Date.now()}`,
      title: sub.headline,
      deck: sub.summary,
      category: sub.category,
      author: sub.studentName,
      authorRole: `${sub.gradeSection} (Student Contributor)`,
      authorBio: sub.notesToEditor || `Student journalist from ${sub.gradeSection} writing for The Inkspirer at Barobo National High School.`,
      authorAvatar: 'student-contributor',
      date: new Date().toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      }),
      readTime: `${Math.max(2, Math.ceil(sub.content.split(' ').length / 200))} min read`,
      featured: false,
      leadStory: false,
      content: paragraphs.length > 0 ? paragraphs : [sub.content],
      pullQuote: paragraphs[0] ? `“${paragraphs[0].slice(0, 140)}...”` : undefined,
      categoryTheme,
      views: 1,
      likes: 0,
      issue: 'Vol. XXIV · Issue 1',
    };

    setArticles((prev) => [newArticle, ...prev]);
    setDoc(doc(db, 'articles', newArticle.id), newArticle).catch(() => {});

    updateSubmissionStatus(
      submissionId,
      'approved',
      'Article approved and published to The Inkspirer live portal!'
    );
    return newArticle;
  };

  const createArticle = (art: Omit<Article, 'id' | 'views' | 'likes'>) => {
    const newArt: Article = {
      ...art,
      id: `art-${Date.now()}`,
      views: 0,
      likes: 0,
    };
    if (newArt.leadStory) {
      setArticles((prev) => {
        const updated = [
          newArt,
          ...prev.map((item) => {
            if (item.leadStory) {
              const demoted = { ...item, leadStory: false };
              setDoc(doc(db, 'articles', item.id), demoted).catch(() => {});
              return demoted;
            }
            return item;
          }),
        ];
        return updated;
      });
    } else {
      setArticles((prev) => [newArt, ...prev]);
    }
    setDoc(doc(db, 'articles', newArt.id), newArt).catch(() => {});
    return newArt;
  };

  const updateArticle = (updated: Article) => {
    setArticles((prev) =>
      prev.map((item) => {
        if (item.id === updated.id) {
          setDoc(doc(db, 'articles', updated.id), updated).catch(() => {});
          return updated;
        }
        if (updated.leadStory && item.leadStory && item.id !== updated.id) {
          const demoted = { ...item, leadStory: false };
          setDoc(doc(db, 'articles', item.id), demoted).catch(() => {});
          return demoted;
        }
        return item;
      })
    );
  };

  const deleteArticle = (id: string) => {
    setArticles((prev) => prev.filter((a) => a.id !== id));
    deleteDoc(doc(db, 'articles', id)).catch(() => {});
  };

  // Announcements management
  const addAnnouncement = (ann: Omit<Announcement, 'id'>) => {
    const newAnn: Announcement = {
      ...ann,
      id: `ann-${Date.now()}`,
    };
    setAnnouncements((prev) => [newAnn, ...prev]);
    setDoc(doc(db, 'announcements', newAnn.id), newAnn).catch(() => {});
    return newAnn;
  };

  const deleteAnnouncement = (id: string) => {
    setAnnouncements((prev) => prev.filter((a) => a.id !== id));
    deleteDoc(doc(db, 'announcements', id)).catch(() => {});
  };

  const togglePinAnnouncement = (id: string) => {
    setAnnouncements((prev) =>
      prev.map((a) => {
        if (a.id === id) {
          const updated = { ...a, isPinned: !a.isPinned };
          setDoc(doc(db, 'announcements', id), updated).catch(() => {});
          return updated;
        }
        return a;
      })
    );
  };

  // Category Management CRUD
  const addCategory = (cat: Omit<PublicationCategory, 'id' | 'slug'>): PublicationCategory => {
    const slug = cat.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || `cat-${Date.now()}`;
    const newCategory: PublicationCategory = {
      ...cat,
      id: `cat-${Date.now()}`,
      slug,
      isDefault: false,
    };
    setCategories((prev) => [...prev, newCategory]);
    setDoc(doc(db, 'categories', newCategory.id), newCategory).catch(() => {});
    return newCategory;
  };

  const updateCategory = (id: string, updated: Partial<PublicationCategory>) => {
    const existing = categories.find((c) => c.id === id);
    if (!existing) return;

    const oldName = existing.name;
    const newName = updated.name?.trim() || oldName;
    const merged: PublicationCategory = {
      ...existing,
      ...updated,
      name: newName,
    };

    setCategories((prev) => prev.map((c) => (c.id === id ? merged : c)));
    setDoc(doc(db, 'categories', id), merged).catch(() => {});

    // If category name or colors changed, update existing articles in state and Firestore
    if (oldName !== newName || updated.color || updated.badgeBg || updated.badgeText) {
      setArticles((prev) =>
        prev.map((art) => {
          if (art.category.toLowerCase() === oldName.toLowerCase()) {
            const updArt: Article = {
              ...art,
              category: newName,
              categoryTheme: {
                accentColor: updated.color || art.categoryTheme.accentColor,
                badgeBg: updated.badgeBg || art.categoryTheme.badgeBg,
                badgeText: updated.badgeText || art.categoryTheme.badgeText,
              },
            };
            setDoc(doc(db, 'articles', art.id), updArt).catch(() => {});
            return updArt;
          }
          return art;
        })
      );

      // Also cascade to submissions
      setSubmissions((prev) =>
        prev.map((sub) => {
          if (sub.category.toLowerCase() === oldName.toLowerCase()) {
            const updSub = { ...sub, category: newName };
            setDoc(doc(db, 'submissions', sub.id), updSub).catch(() => {});
            return updSub;
          }
          return sub;
        })
      );
    }
  };

  const deleteCategory = (id: string, fallbackCategoryName?: string) => {
    const target = categories.find((c) => c.id === id);
    if (!target) return;

    const remaining = categories.filter((c) => c.id !== id);
    const replacement = fallbackCategoryName || remaining[0]?.name || 'News';

    setCategories(remaining);
    deleteDoc(doc(db, 'categories', id)).catch(() => {});

    // Reassign articles under deleted category to replacement
    setArticles((prev) =>
      prev.map((art) => {
        if (art.category.toLowerCase() === target.name.toLowerCase()) {
          const repCat = remaining.find((c) => c.name.toLowerCase() === replacement.toLowerCase());
          const updArt: Article = {
            ...art,
            category: replacement,
            categoryTheme: repCat
              ? { accentColor: repCat.color, badgeBg: repCat.badgeBg, badgeText: repCat.badgeText }
              : art.categoryTheme,
          };
          setDoc(doc(db, 'articles', art.id), updArt).catch(() => {});
          return updArt;
        }
        return art;
      })
    );

    // Reassign submissions
    setSubmissions((prev) =>
      prev.map((sub) => {
        if (sub.category.toLowerCase() === target.name.toLowerCase()) {
          const updSub = { ...sub, category: replacement };
          setDoc(doc(db, 'submissions', sub.id), updSub).catch(() => {});
          return updSub;
        }
        return sub;
      })
    );
  };

  // Reset to factory demo data in state & Firestore
  const resetToDefaults = () => {
    setArticles(INITIAL_ARTICLES);
    setAnnouncements(INITIAL_ANNOUNCEMENTS);
    setSubmissions(INITIAL_SUBMISSIONS);
    setStaff(INITIAL_EDITORIAL_STAFF);
    setCategories(INITIAL_CATEGORIES);
    setBookmarks([]);
    setLikedArticles([]);
    localStorage.clear();

    INITIAL_ARTICLES.forEach((art) => {
      setDoc(doc(db, 'articles', art.id), art).catch(() => {});
    });
    INITIAL_ANNOUNCEMENTS.forEach((ann) => {
      setDoc(doc(db, 'announcements', ann.id), ann).catch(() => {});
    });
    INITIAL_CATEGORIES.forEach((cat) => {
      setDoc(doc(db, 'categories', cat.id), cat).catch(() => {});
    });
    INITIAL_SUBMISSIONS.forEach((sub) => {
      setDoc(doc(db, 'submissions', sub.id), sub).catch(() => {});
    });
    INITIAL_EDITORIAL_STAFF.forEach((member) => {
      setDoc(doc(db, 'editorialStaff', member.id), member).catch(() => {});
    });
  };

  return {
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
  };
}
