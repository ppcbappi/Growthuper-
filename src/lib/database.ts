import { cn } from './utils';

// Multi-Channel Bangladesh Payment Types
export type PaymentMethod = 'bkash' | 'nagad' | 'rocket';
export type PaymentStatus = 'pending' | 'verified' | 'rejected';
export type UserRole = 'student' | 'instructor' | 'admin' | 'super_admin';

export interface User {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  role: UserRole;
  status?: 'active' | 'blocked'; // active or blocked/suspended
  loginHistory?: string[];      // list of login date strings
  createdAt: string;
}

export interface Course {
  id: string;
  title: string;
  slug: string;
  description: string;
  price: string;
  duration: string;
  rating: string;
  image: string;
  features: string[];
}

export interface Module {
  id: string;
  courseId: string;
  title: string;
  orderIndex: number;
}

export interface Lesson {
  id: string;
  moduleId: string;
  title: string;
  duration: string;
  videoUrl: string;
  previewUrl?: string; // Optional public preview video link (e.g. YouTube/Vimeo embed)
  resources?: string[]; // Downloadable slide decks, GTM templates or spreadsheets
  orderIndex: number;
}

export interface Transaction {
  id: string;
  userId: string;
  userEmail: string;
  courseId: string;
  courseTitle: string;
  method: PaymentMethod;
  senderNumber: string;
  transactionId: string;
  status: PaymentStatus;
  amount: string;
  createdAt: string;
}

export interface Purchase {
  id: string;
  userId: string;
  courseId: string;
  transactionId: string;
  unlockedAt: string;
}

export interface LessonProgress {
  userId: string;
  lessonId: string;
  isCompleted: boolean;
  watchTime: number; // in seconds
  updatedAt: string;
}

export interface Certificate {
  id: string;
  userId: string;
  userName: string;
  courseId: string;
  courseTitle: string;
  issuedAt: string;
  verificationId: string; // Unique Certificate ID
}

export interface ContactMessage {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  websiteUrl: string;
  service: string;
  budgetRange?: string; // budget levels e.g. Under $1,000, $1k - $5k, etc.
  message: string;
  isRead: boolean;
  status?: 'pending' | 'replied' | 'cancelled' | 'archived'; // modern message status workflows
  createdAt: string;
}

// FULL WordPress-style CMS System Schemas
export interface Blog {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  readTime: string;
  image: string;
  author: string;
  category?: string; // CMS Blog Category Support
  tags?: string[];   // SEO Tag Indexing
  createdAt: string;
}

export interface FAQ {
  id: string;
  question: string;
  answer: string;
  category?: string; // Page mapping: 'home', 'services', 'courses', 'general'
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  company: string;
  feedback: string;
  rating: number;
  image: string;
}

export interface ServiceCard {
  id: string;
  title: string;
  description: string;
  iconName: string;
  category?: 'google_ads' | 'ga4' | 'gtm' | 'meta' | 'shopify' | 'advanced'; // Enhanced Service taxonomy
  features: string[];
}

export interface PricingPlan {
  id: string;
  name: string;
  price: string;
  timeframe: string;
  description: string;
  features: string[];
  popular: boolean;
  ctaText: string;
}

export interface SiteSettings {
  logoText: string;
  heroBadge: string;
  heroTitle: string;
  heroSubtitle: string;
  primaryCtaText: string;
  secondaryCtaText: string;
  contactEmail: string;
  contactPhone: string;
  whatsappLink: string;
  footerText: string;
  primaryColor: string;
  secondaryColor: string;
  seoTitle: string;
  seoDescription: string;
  officeLocation: string;
  // Dynamic CTA Content Sections CMS
  ctaTitle?: string;
  ctaSubtitle?: string;
  ctaBtnText?: string;
  headingThemeGlow?: boolean; // high-tech gradient neon layout options or smooth colors
  // Analytics visuals options
  infographicsTotalSales?: string;
  infographicsConversionRate?: string;
}

// Initial Seeding Content
const INITIAL_COURSES: Course[] = [
  {
    id: "course-1",
    title: "Mastering Server-Side Tracking",
    slug: "mastering-server-side-tracking",
    description: "Learn how to bypass ad-blockers, dodge iOS 14+ tracking limitations, and set up robust first-party cloud server loops to stream high-fidelity conversion events straight to Meta and Google.",
    price: "$297",
    duration: "4.5 Hours",
    rating: "5.0",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=800&h=500",
    features: [
      "Custom GTM Server Container setup",
      "Stripe, Meta Conversions API (CAPI) deduplication",
      "Shopify DataLayer optimization with Liquid templates",
      "Custom Subdomain and First-Party cookie setup"
    ]
  },
  {
    id: "course-2",
    title: "Advanced GA4 & GTM Architecture",
    slug: "advanced-ga4-gtm-architecture",
    description: "Map complex multi-funnel digital pathways cleanly inside custom Google Tag Manager tags. Includes full GA4 custom dimensions setups and military-grade event pipelines.",
    price: "$197",
    duration: "3 Hours",
    rating: "4.9",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800&h=500",
    features: [
      "Dynamic value mapping & User Data variables",
      "Advanced trigger criteria configuration",
      "Automated e-commerce purchase push objects",
      "Debugging & QA audits with live tools"
    ]
  },
  {
    id: "course-3",
    title: "Ecommerce Analytics 3.0",
    slug: "ecommerce-analytics-3",
    description: "The ultimate scaling playbook for modern stores. Track customer lifetimes, calculate real margins, run automated funnel audits, and build high-level custom metrics dashboards.",
    price: "$497",
    duration: "8 Hours",
    rating: "5.0",
    image: "https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?auto=format&fit=crop&q=80&w=800&h=500",
    features: [
      "Cohort analysis & retention formulas",
      "Shopify headless checkout tracking",
      "Multi-channel ad attribution modeling",
      "Proprietary Google Looker Studio setups"
    ]
  }
];

const INITIAL_MODULES: Module[] = [
  { id: "mod-1-1", courseId: "course-1", title: "Module 1: Server Side Foundations", orderIndex: 1 },
  { id: "mod-1-2", courseId: "course-1", title: "Module 2: Cloud Ingress & DNS Customization", orderIndex: 2 },
  { id: "mod-1-3", courseId: "course-1", title: "Module 3: Meta Conversions API (CAPI) Setup", orderIndex: 3 },

  { id: "mod-2-1", courseId: "course-2", title: "Module 1: GA4 Measurement Protocols", orderIndex: 1 },
  { id: "mod-2-2", courseId: "course-2", title: "Module 2: Setting up Client GTM Triggers", orderIndex: 2 },

  { id: "mod-3-1", courseId: "course-3", title: "Module 1: Lifetime Value (LTV) Mapping", orderIndex: 1 }
];

const INITIAL_LESSONS: Lesson[] = [
  { id: "les-1-1-1", moduleId: "mod-1-1", title: "1.1 Welcome to the World of First-Party Tracking", duration: "12:45", videoUrl: "https://vimeo.com/placeholder-1", orderIndex: 1 },
  { id: "les-1-1-2", moduleId: "mod-1-1", title: "1.2 Installing Your GTM Server Container", duration: "18:20", videoUrl: "https://vimeo.com/placeholder-2", orderIndex: 2 },
  { id: "les-1-2-1", moduleId: "mod-1-2", title: "2.1 Mapping DNS records & bypass-block configs", duration: "15:10", videoUrl: "https://vimeo.com/placeholder-3", orderIndex: 1 },
  { id: "les-1-3-1", moduleId: "mod-1-3", title: "3.1 Meta Event Deduplication with Event ID", duration: "25:00", videoUrl: "https://vimeo.com/placeholder-4", orderIndex: 1 },
  { id: "les-1-3-2", moduleId: "mod-1-3", title: "3.2 Live Pipeline Quality Audit in Meta Events Manager", duration: "10:30", videoUrl: "https://vimeo.com/placeholder-5", orderIndex: 2 },

  { id: "les-2-1-1", moduleId: "mod-2-1", title: "1.1 Crafting Custom GA4 measurement payloads", duration: "14:15", videoUrl: "https://vimeo.com/placeholder-6", orderIndex: 1 },
  { id: "les-2-2-1", moduleId: "mod-2-2", title: "2.1 Dom triggers and advanced element visibility listeners", duration: "22:05", videoUrl: "https://vimeo.com/placeholder-7", orderIndex: 1 },

  { id: "les-3-1-1", moduleId: "mod-3-1", title: "1.1 Tracking Shopify dynamic recurring subscriptions", duration: "32:10", videoUrl: "https://vimeo.com/placeholder-8", orderIndex: 1 }
];

const INITIAL_SERVICES: ServiceCard[] = [
  {
    id: "srv-ga4",
    title: "Google Analytics 4 (GA4) Integration",
    description: "We orchestrate robust custom dimension schemas, user property parameters, and military-grade measurement pipelines so you view precise cohort tracking results.",
    iconName: "BarChart3",
    features: ["Enhanced Ecommerce Object Mapping", "User-ID Identity Stitching", "BigQuery Raw Export Bridges"]
  },
  {
    id: "srv-server",
    title: "Secure Server-Side Tracking",
    description: "Bypass iOS 14+ ad-blocking layouts and cookie expiration scripts with first-party DNS cloaking. Host your container in dedicated cloud slots to recapture 30%+ user hits.",
    iconName: "Zap",
    features: ["Cloud GTM Host Provisioning", "Safari ITP bypass solutions", "Full client data privacy gateways"]
  },
  {
    id: "srv-meta",
    title: "Meta / TikTok Conversions API (CAPI)",
    description: "Establish dedicated server-to-server triggers with exact Event-ID pairs. Boost your Meta Quality Match score to improve bid distribution and lower customer costs.",
    iconName: "Target",
    features: ["Automatic Event-ID Generation", "Customer Data Parameter Hash", "Real-Time Event Quality Match Scoring"]
  },
  {
    id: "srv-shopify",
    title: "Shopify Custom DataLayer Dev",
    description: "Clean event triggers mapped directly via Liquid logic, Checkout custom Web-pixels, and cart actions to eliminate standard data leakage loops.",
    iconName: "Shield",
    features: ["Add-To-Cart trigger validation", "Dynamic discount tracking logic", "Checkout steps and drop-off tracking"]
  }
];

const INITIAL_PRICING: PricingPlan[] = [
  {
    id: "plan-self",
    name: "Syllabus Video Track",
    price: "$197",
    timeframe: "per course",
    description: "Best for self-paced software engineers, marketers, and tracking beginners looking for high-quality instruction guides.",
    features: ["Step-by-step video classroom modules", "Code snippets & template downloads", "Unique downloadable verify certificate", "Lifetime syllabus updates library"],
    popular: false,
    ctaText: "Enroll In Course"
  },
  {
    id: "plan-elite",
    name: "Elite Academy Pass",
    price: "$497",
    timeframe: "unlimited access",
    description: "Our ultimate, highly popular analytics flagship masterminds cohort containing all courses, exclusive lessons, andQA.",
    features: ["Unlimited access to all published LMS programs", "Priority support inside private Discord tracks", "Live monthly analytics audits and guest calls", "High-conversion GTM tag templates setup", "Direct 1-on-1 assignments feedback"],
    popular: true,
    ctaText: "Enroll In All Courses"
  },
  {
    id: "plan-agency",
    name: "Full Agency Implementation",
    price: "$1,497",
    timeframe: "consulting + setup",
    description: "Perfect for high-volume ecommerce stores or modern SaaS platforms requiring military-grade setup built by our team.",
    features: ["Complete GA4/GTM layout audit session", "Done-For-You Server-Side first-party tagging setup", "Deduplicated Conversions API (CAPI) pipelines", "Custom Looker Studio attribution report dashboards", "1 Year direct post-launch support hotline"],
    popular: false,
    ctaText: "Hire Growthuper Agency"
  }
];

const INITIAL_TESTIMONIALS: Testimonial[] = [
  {
    id: "tst-1",
    name: "Maruf Hasan",
    role: "Growth Marketer Specialist",
    company: "Aura Media Agency",
    feedback: "Growthuper literally revived our $180k/month Meta campaigns. Our attribution rate rose from 64% to 94% using server-side conversions API deduplication mapping.",
    rating: 5,
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150&h=150"
  },
  {
    id: "tst-2",
    name: "Sarah Jenkins",
    role: "CEO & Co-Founder",
    company: "SaaSify Systems",
    feedback: "The Elite Academy syllabus was incredibly clean, actionable, and free of fluff. Setting up a customized Google Analytic Server GTM configuration felt trivial.",
    rating: 5,
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150&h=150"
  },
  {
    id: "tst-3",
    name: "Dave Warren",
    role: "E-Commerce Director",
    company: "Luxe Thread Stores",
    feedback: "Before Growthuper, ad blockers were destroying our target audiences. With first-party cloud tags proxy, our remarketing lists are fully populated again.",
    rating: 5,
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150&h=150"
  }
];

const INITIAL_FAQS: FAQ[] = [
  {
    id: "faq-1",
    question: "What is Server-Side GTM Tracking?",
    answer: "Traditional tracking runs directly inside the client browser, easily blocked by extensions or Brave browser rules. Server-side tracking routes hits securely through a virtual machine container (Cloud Container hosted under your own subdomain), giving you 100% control over incoming cookie definitions."
  },
  {
    id: "faq-2",
    question: "How does payment verification work outside automated channels?",
    answer: "To bypass high Stripe fee commissions in Bangladesh, you perform a secure manual bKash, Nagad, or Rocket transition to our secure business number +8801336339475. Submit your Unique transaction ID and sender phone number, and dashboard system validates access immediately."
  },
  {
    id: "faq-3",
    question: "Is the generated academy certificate internationally recognized?",
    answer: "Yes, every certificate dynamically logs an automated entry in our databases. The certificate features a custom verification QR / Code link which anyone (future employers or teams) can query directly to audit qualifications."
  },
  {
    id: "faq-4",
    question: "Can we hire Growthuper for custom setup besides courses?",
    answer: "Absolutely! We operate both a flagship education SaaS platform and an elite digital analytics implementation agency. Review our custom plans under the services/pricing directories, or use the direct client contact form."
  }
];

const INITIAL_BLOGS: Blog[] = [
  {
    id: "blog-1",
    title: "How to Bypass Brave & Safari Tracking Blockers in 2026",
    slug: "safari-brave-tracking-blockers-2026",
    excerpt: "Learn how first-party proxy setups restore missing marketing analytics events and prevent data loss from third-party cookie restrictions.",
    content: `The modern web has declared war on third-party tracking. Safari's Intelligent Tracking Prevention (ITP) and Brave browser ad-blockers routinely destroy basic client-side tags and analytics code. This means that up to 30% to 40% of conversion event transactions are left unrecorded in standard dashboards.

By setting up a customized Server-Side tracking wrapper, you route incoming payloads through a virtual machine server acting as a first-party proxy under your main brand domain (e.g., tracking.yourbrand.com).

This guide walks you through the comprehensive strategy:
1. Creating a cloud container in Google Cloud or Stape.
2. Generating a first-party DNS record mapped to your subdomain.
3. Repointing client web scripts to stream signals straight to the newly forged cloud proxy container.

This completely preserves cookie longevity, increases reporting accuracy, and improves your attribution match scores.`,
    readTime: "5 Min Read",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=800",
    author: "Leon Chowdhury",
    createdAt: "2026-05-18T10:00:00Z"
  },
  {
    id: "blog-2",
    title: "Meta Conversions API (CAPI) Event Deduplication Guide",
    slug: "meta-capi-event-deduplication",
    excerpt: "Master the event_id protocol to prevent double-counting of sales conversions when sending both server and client payloads.",
    content: `Precision tracking requires streaming both browser-level events and server-level data layers. However, when streaming identical signals (e.g. Purchase events) from two separate pipelines, Meta Ads Manager will record duplicate metrics unless proper deduplication is established.

The exact deduplication mechanics involve:
- Structuring a custom event_id key generated at transaction event initialization.
- Passing the identical event_id inside both browser tracking scripts and Server CAPI payloads.
- Matching incoming payloads on Meta side within a 48-hour deduplication window.

By utilizing GTM Server-Side variables to automate transaction-id stitching, you achieve stellar Event Quality Match results and dramatically scale Meta target learning capabilities.`,
    readTime: "8 Min Read",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800",
    author: "Leon Chowdhury",
    createdAt: "2026-05-10T09:30:00Z"
  }
];

const INITIAL_SETTINGS: SiteSettings = {
  logoText: "Growthuper",
  heroBadge: "The future of scaling with analytics",
  heroTitle: "Measure Exactly What Drives Revenue.",
  heroSubtitle: "Growthuper installs military-grade tracking systems and provides premium courses to help software and agency founders scale predictably in 2026.",
  primaryCtaText: "Explore Services",
  secondaryCtaText: "View Premium Courses",
  contactEmail: "hello@growthuper.com",
  contactPhone: "+880 133 633 9475",
  whatsappLink: "https://wa.me/8801336339475",
  footerText: "Premium analytics agency and digital education platform dedicated to scaling your business with precision data.",
  primaryColor: "#6C5CE7",
  secondaryColor: "#00D2FF",
  seoTitle: "Growthuper | Precision First-Party Tagging & Conversions API",
  seoDescription: "Bypass ad-blockers and Safari cookie expiration limits with server-side proxy containers. Train your team with our premium courses or hire our agency.",
  officeLocation: "Dhaka, Bangladesh"
};

class RelationalDatabase {
  constructor() {
    this.init();
  }

  private init() {
    if (!localStorage.getItem('gt_users')) {
      // Create seed administrators & dynamic student
      const adminUser: User = {
        id: "admin-id",
        fullName: "Super Admin",
        email: "admin@growthuper.com",
        phone: "+8801336339475",
        role: "super_admin",
        status: "active",
        loginHistory: [new Date().toLocaleString()],
        createdAt: new Date().toISOString()
      };
      const demoStudent: User = {
        id: "demo-student-id",
        fullName: "Test Student",
        email: "user@demo.com",
        phone: "+8801999999999",
        role: "student",
        status: "active",
        loginHistory: [new Date().toLocaleString()],
        createdAt: new Date().toISOString()
      };
      
      localStorage.setItem('gt_users', JSON.stringify([adminUser, demoStudent]));
      localStorage.setItem('gt_passwords', JSON.stringify({
        "admin@growthuper.com": "admin123",
        "user@demo.com": "password"
      }));
    }

    if (!localStorage.getItem('gt_courses')) {
      localStorage.setItem('gt_courses', JSON.stringify(INITIAL_COURSES));
    }
    if (!localStorage.getItem('gt_modules')) {
      localStorage.setItem('gt_modules', JSON.stringify(INITIAL_MODULES));
    }
    if (!localStorage.getItem('gt_lessons')) {
      localStorage.setItem('gt_lessons', JSON.stringify(INITIAL_LESSONS));
    }
    if (!localStorage.getItem('gt_transactions')) {
      localStorage.setItem('gt_transactions', JSON.stringify([]));
    }
    if (!localStorage.getItem('gt_purchases')) {
      const seedPurchase: Purchase = {
        id: "pur-1",
        userId: "demo-student-id",
        courseId: "course-1",
        transactionId: "trx-seed-1",
        unlockedAt: new Date().toISOString()
      };
      localStorage.setItem('gt_purchases', JSON.stringify([seedPurchase]));
    }
    if (!localStorage.getItem('gt_progress')) {
      localStorage.setItem('gt_progress', JSON.stringify([]));
    }
    if (!localStorage.getItem('gt_certificates')) {
      localStorage.setItem('gt_certificates', JSON.stringify([]));
    }
    if (!localStorage.getItem('gt_contact_messages')) {
      localStorage.setItem('gt_contact_messages', JSON.stringify([]));
    }

    // New WordPress-style CMS seeds
    if (!localStorage.getItem('gt_settings')) {
      localStorage.setItem('gt_settings', JSON.stringify(INITIAL_SETTINGS));
    }
    if (!localStorage.getItem('gt_blogs')) {
      localStorage.setItem('gt_blogs', JSON.stringify(INITIAL_BLOGS));
    }
    if (!localStorage.getItem('gt_faqs')) {
      localStorage.setItem('gt_faqs', JSON.stringify(INITIAL_FAQS));
    }
    if (!localStorage.getItem('gt_testimonials')) {
      localStorage.setItem('gt_testimonials', JSON.stringify(INITIAL_TESTIMONIALS));
    }
    if (!localStorage.getItem('gt_services')) {
      localStorage.setItem('gt_services', JSON.stringify(INITIAL_SERVICES));
    }
    if (!localStorage.getItem('gt_pricing')) {
      localStorage.setItem('gt_pricing', JSON.stringify(INITIAL_PRICING));
    }
  }

  // Active Session Store
  public getSession(): User | null {
    const session = localStorage.getItem('gt_session');
    return session ? JSON.parse(session) : null;
  }

  // Session verification and cookie-like session matching
  public setSession(user: User | null) {
    if (user) {
      localStorage.setItem('gt_session', JSON.stringify(user));
    } else {
      localStorage.removeItem('gt_session');
    }
  }

  // --- Authentications ---
  public signup(fullName: string, email: string, phone: string, pass: string): { success: boolean, user?: User, error?: string } {
    const users: User[] = JSON.parse(localStorage.getItem('gt_users') || '[]');
    const passwords = JSON.parse(localStorage.getItem('gt_passwords') || '{}');

    if (users.some(u => u.email.toLowerCase() === email.toLowerCase())) {
      return { success: false, error: "Email already registered" };
    }

    const newUser: User = {
      id: "usr-" + Math.random().toString(36).substr(2, 9),
      fullName,
      email,
      phone,
      role: 'student',
      status: 'active',
      loginHistory: [new Date().toLocaleString()],
      createdAt: new Date().toISOString()
    };

    users.push(newUser);
    passwords[email] = pass;

    localStorage.setItem('gt_users', JSON.stringify(users));
    localStorage.setItem('gt_passwords', JSON.stringify(passwords));
    this.setSession(newUser);

    return { success: true, user: newUser };
  }

  public login(identifier: string, pass: string): { success: boolean, user?: User, error?: string } {
    const users: User[] = JSON.parse(localStorage.getItem('gt_users') || '[]');
    const passwords = JSON.parse(localStorage.getItem('gt_passwords') || '{}');

    const user = users.find(u => u.email.toLowerCase() === identifier.toLowerCase() || u.phone === identifier);
    if (!user) {
      return { success: false, error: "Incorrect credentials. Check details and password again." };
    }

    if (user.status === 'blocked') {
      return { success: false, error: "Security Suspension: Access to this student profile has been blocked by administrators." };
    }

    const correctPassword = passwords[user.email];
    if (correctPassword !== pass) {
      return { success: false, error: "Incorrect credentials. Check details and password again." };
    }

    // Append history
    if (!user.loginHistory) user.loginHistory = [];
    user.loginHistory.push(new Date().toLocaleString());

    const userIndex = users.findIndex(u => u.id === user.id);
    if (userIndex !== -1) {
      users[userIndex] = user;
      localStorage.setItem('gt_users', JSON.stringify(users));
    }

    this.setSession(user);
    return { success: true, user };
  }

  // --- Courses Store ---
  public getCourses(): Course[] {
    return JSON.parse(localStorage.getItem('gt_courses') || '[]');
  }

  public addCourse(course: Omit<Course, 'id'>): Course {
    const courses = this.getCourses();
    const newId = "course-" + Math.random().toString(36).substr(2, 9);
    const newCourse: Course = { ...course, id: newId };
    courses.push(newCourse);
    localStorage.setItem('gt_courses', JSON.stringify(courses));
    return newCourse;
  }

  public updateCourse(id: string, updated: Partial<Course>) {
    const courses = this.getCourses();
    const index = courses.findIndex(c => c.id === id);
    if (index !== -1) {
      courses[index] = { ...courses[index], ...updated };
      localStorage.setItem('gt_courses', JSON.stringify(courses));
    }
  }

  public deleteCourse(id: string) {
    const courses = this.getCourses();
    const filtered = courses.filter(c => c.id !== id);
    localStorage.setItem('gt_courses', JSON.stringify(filtered));
  }

  public getModules(courseId?: string): Module[] {
    const mods: Module[] = JSON.parse(localStorage.getItem('gt_modules') || '[]');
    if (courseId) return mods.filter(m => m.courseId === courseId).sort((a,b) => a.orderIndex - b.orderIndex);
    return mods;
  }

  public addModule(moduleId: string, courseId: string, title: string) {
    const mods = this.getModules();
    const newMod: Module = { id: moduleId, courseId, title, orderIndex: mods.length + 1 };
    mods.push(newMod);
    localStorage.setItem('gt_modules', JSON.stringify(mods));
  }

  public getLessons(moduleId?: string): Lesson[] {
    const lessons: Lesson[] = JSON.parse(localStorage.getItem('gt_lessons') || '[]');
    if (moduleId) return lessons.filter(l => l.moduleId === moduleId).sort((a,b) => a.orderIndex - b.orderIndex);
    return lessons;
  }

  public addLesson(lesson: Omit<Lesson, 'id' | 'orderIndex'>): Lesson {
    const lessons = this.getLessons();
    const newId = "les-" + Math.random().toString(36).substr(2, 9);
    const newLesson: Lesson = { ...lesson, id: newId, orderIndex: lessons.length + 1 };
    lessons.push(newLesson);
    localStorage.setItem('gt_lessons', JSON.stringify(lessons));
    return newLesson;
  }

  // --- Purchases & Verification Pipelines ---
  public getPurchases(userId?: string): Purchase[] {
    const pur: Purchase[] = JSON.parse(localStorage.getItem('gt_purchases') || '[]');
    if (userId) return pur.filter(p => p.userId === userId);
    return pur;
  }

  public createTransaction(userId: string, userEmail: string, courseId: string, method: PaymentMethod, senderNumber: string, transactionId: string, amount: string): Transaction {
    const txs: Transaction[] = JSON.parse(localStorage.getItem('gt_transactions') || '[]');
    const course = this.getCourses().find(c => c.id === courseId);
    
    const newTx: Transaction = {
      id: "trx-" + Math.random().toString(36).substr(2, 9),
      userId,
      userEmail,
      courseId,
      courseTitle: course?.title || "Premium Course",
      method,
      senderNumber,
      transactionId,
      status: 'pending',
      amount,
      createdAt: new Date().toISOString()
    };

    txs.push(newTx);
    localStorage.setItem('gt_transactions', JSON.stringify(txs));
    return newTx;
  }

  public getTransactions(): Transaction[] {
    return JSON.parse(localStorage.getItem('gt_transactions') || '[]');
  }

  public verifyPayment(trxId: string, action: 'verified' | 'rejected') {
    const txs = this.getTransactions();
    const txIndex = txs.findIndex(t => t.id === trxId);
    if (txIndex === -1) return;

    txs[txIndex].status = action;
    localStorage.setItem('gt_transactions', JSON.stringify(txs));

    if (action === 'verified') {
      const target = txs[txIndex];
      const purchases = this.getPurchases();
      
      // Prevent duplicates
      if (!purchases.some(p => p.userId === target.userId && p.courseId === target.courseId)) {
        const newPurchase: Purchase = {
          id: "pur-" + Math.random().toString(36).substr(2, 9),
          userId: target.userId,
          courseId: target.courseId,
          transactionId: target.id,
          unlockedAt: new Date().toISOString()
        };
        purchases.push(newPurchase);
        localStorage.setItem('gt_purchases', JSON.stringify(purchases));
      }
    }
  }

  // --- Lesson Progress tracking ---
  public getProgress(userId: string): LessonProgress[] {
    const prog: LessonProgress[] = JSON.parse(localStorage.getItem('gt_progress') || '[]');
    return prog.filter(p => p.userId === userId);
  }

  public saveProgress(userId: string, lessonId: string, isCompleted: boolean) {
    const prog: LessonProgress[] = JSON.parse(localStorage.getItem('gt_progress') || '[]');
    const index = prog.findIndex(p => p.userId === userId && p.lessonId === lessonId);
    
    if (index !== -1) {
      prog[index].isCompleted = isCompleted;
      prog[index].updatedAt = new Date().toISOString();
    } else {
      prog.push({
        userId,
        lessonId,
        isCompleted,
        watchTime: 0,
        updatedAt: new Date().toISOString()
      });
    }

    localStorage.setItem('gt_progress', JSON.stringify(prog));

    // Check Auto course completion metrics state for certificate generation!
    this.checkAndGenerateCertificate(userId, lessonId);
  }

  private checkAndGenerateCertificate(userId: string, lessonId: string) {
    const lessons = this.getLessons();
    const triggerLesson = lessons.find(l => l.id === lessonId);
    if (!triggerLesson) return;

    const moduleObj = this.getModules().find(m => m.id === triggerLesson.moduleId);
    if (!moduleObj) return;

    const courseId = moduleObj.courseId;
    const course = this.getCourses().find(c => c.id === courseId);
    if (!course) return;

    // Get all lessons for this course
    const courseModules = this.getModules(courseId).map(m => m.id);
    const courseLessons = lessons.filter(l => courseModules.includes(l.moduleId));

    // Get progress for this student
    const studentProg = this.getProgress(userId);
    const completedCount = courseLessons.filter(cl => studentProg.some(sp => sp.lessonId === cl.id && sp.isCompleted)).length;

    if (completedCount === courseLessons.length && courseLessons.length > 0) {
      // All lessons completed! Generate automatic certificate
      const certs = this.getCertificates(userId);
      if (!certs.some(c => c.courseId === courseId)) {
        const users: User[] = JSON.parse(localStorage.getItem('gt_users') || '[]');
        const student = users.find(u => u.id === userId);
        const certId = "GT-" + Math.random().toString(36).substr(2, 6).toUpperCase();

        const cert: Certificate = {
          id: "cert-" + Math.random().toString(36).substr(2, 9),
          userId,
          userName: student?.fullName || "Valued Student",
          courseId,
          courseTitle: course.title,
          issuedAt: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
          verificationId: certId
        };

        const allCerts = JSON.parse(localStorage.getItem('gt_certificates') || '[]');
        allCerts.push(cert);
        localStorage.setItem('gt_certificates', JSON.stringify(allCerts));
      }
    }
  }

  // --- Certificates ---
  public getCertificates(userId?: string): Certificate[] {
    const certs: Certificate[] = JSON.parse(localStorage.getItem('gt_certificates') || '[]');
    if (userId) return certs.filter(c => c.userId === userId);
    return certs;
  }

  public verifyCertificate(verificationId: string): Certificate | null {
    const certs: Certificate[] = JSON.parse(localStorage.getItem('gt_certificates') || '[]');
    return certs.find(c => c.verificationId.toLowerCase() === verificationId.toLowerCase() || c.id === verificationId) || null;
  }

  // --- Contact Submissions ---
  public submitContact(
    firstName: string, 
    lastName: string, 
    email: string, 
    phone: string, 
    websiteUrl: string, 
    service: string, 
    budgetRange: string, 
    message: string
  ): ContactMessage {
    const msgs: ContactMessage[] = JSON.parse(localStorage.getItem('gt_contact_messages') || '[]');
    const newMsg: ContactMessage = {
      id: "msg-" + Math.random().toString(36).substr(2, 9),
      firstName,
      lastName,
      email,
      phone,
      websiteUrl,
      service,
      budgetRange,
      message,
      isRead: false,
      status: 'pending',
      createdAt: new Date().toISOString()
    };
    msgs.push(newMsg);
    localStorage.setItem('gt_contact_messages', JSON.stringify(msgs));
    return newMsg;
  }

  public getContactMessages(): ContactMessage[] {
    const msgs: ContactMessage[] = JSON.parse(localStorage.getItem('gt_contact_messages') || '[]');
    // Backfill statuses if empty for backwards safety
    let updated = false;
    const cleanMsgs = msgs.map(m => {
      if (!m.status) {
        m.status = 'pending';
        updated = true;
      }
      return m;
    });
    if (updated) {
      localStorage.setItem('gt_contact_messages', JSON.stringify(cleanMsgs));
    }
    return cleanMsgs;
  }

  public markContactRead(id: string) {
    const msgs = this.getContactMessages();
    const index = msgs.findIndex(m => m.id === id);
    if (index !== -1) {
      msgs[index].isRead = true;
      localStorage.setItem('gt_contact_messages', JSON.stringify(msgs));
    }
  }

  public updateContactStatus(id: string, status: 'pending' | 'replied' | 'cancelled' | 'archived') {
    const msgs = this.getContactMessages();
    const index = msgs.findIndex(m => m.id === id);
    if (index !== -1) {
      msgs[index].status = status;
      if (status === 'replied') {
        msgs[index].isRead = true;
      }
      localStorage.setItem('gt_contact_messages', JSON.stringify(msgs));
    }
  }

  // --- User Directory Operations ---
  public getUsers(): User[] {
    const users: User[] = JSON.parse(localStorage.getItem('gt_users') || '[]');
    // Backfill statuses/loginHistory for legacy safety
    let updated = false;
    const cleanUsers = users.map(u => {
      if (!u.status) {
        u.status = 'active';
        updated = true;
      }
      if (!u.loginHistory) {
        u.loginHistory = [u.createdAt || new Date().toLocaleString()];
        updated = true;
      }
      return u;
    });
    if (updated) {
      localStorage.setItem('gt_users', JSON.stringify(cleanUsers));
    }
    return cleanUsers;
  }

  public updateUserRole(id: string, role: UserRole) {
    const users = this.getUsers();
    const index = users.findIndex(u => u.id === id);
    if (index !== -1) {
      users[index].role = role;
      localStorage.setItem('gt_users', JSON.stringify(users));
      
      const currentSession = this.getSession();
      if (currentSession && currentSession.id === id) {
        currentSession.role = role;
        this.setSession(currentSession);
      }
    }
  }

  public blockUser(id: string, blockState: boolean) {
    const users = this.getUsers();
    const index = users.findIndex(u => u.id === id);
    if (index !== -1) {
      users[index].status = blockState ? 'blocked' : 'active';
      localStorage.setItem('gt_users', JSON.stringify(users));
      
      // If blocked user is currently logged in, force session eviction
      const currentSession = this.getSession();
      if (currentSession && currentSession.id === id && blockState) {
        this.setSession(null);
      }
    }
  }

  public deleteUser(id: string) {
    const users = this.getUsers();
    const filtered = users.filter(u => u.id !== id);
    localStorage.setItem('gt_users', JSON.stringify(filtered));

    // Cleanup session if matches
    const currentSession = this.getSession();
    if (currentSession && currentSession.id === id) {
      this.setSession(null);
    }
  }

  public resetUserPassword(userId: string, newPass: string) {
    const users = this.getUsers();
    const user = users.find(u => u.id === userId);
    if (!user) return;

    const passwords = JSON.parse(localStorage.getItem('gt_passwords') || '{}');
    passwords[user.email] = newPass;
    localStorage.setItem('gt_passwords', JSON.stringify(passwords));
  }

  // --- WordPress-style CMS Dynamic Methods ---
  public getSettings(): SiteSettings {
    const data = localStorage.getItem('gt_settings');
    return data ? JSON.parse(data) : INITIAL_SETTINGS;
  }

  public saveSettings(settings: Partial<SiteSettings>) {
    const current = this.getSettings();
    const updated = { ...current, ...settings };
    localStorage.setItem('gt_settings', JSON.stringify(updated));
  }

  // Blogs Management
  public getBlogs(): Blog[] {
    return JSON.parse(localStorage.getItem('gt_blogs') || '[]');
  }

  public saveBlog(blog: Omit<Blog, 'id' | 'createdAt'> & { id?: string }): Blog {
    const blogs = this.getBlogs();
    if (blog.id) {
      const index = blogs.findIndex(b => b.id === blog.id);
      if (index !== -1) {
        blogs[index] = { ...blogs[index], ...blog } as Blog;
      }
    } else {
      const newId = "blog-" + Math.random().toString(36).substr(2, 9);
      const newBlog: Blog = {
        ...blog,
        id: newId,
        createdAt: new Date().toISOString()
      } as Blog;
      blogs.push(newBlog);
    }
    localStorage.setItem('gt_blogs', JSON.stringify(blogs));
    return blog as Blog;
  }

  public deleteBlog(id: string) {
    const blogs = this.getBlogs();
    const filtered = blogs.filter(b => b.id !== id);
    localStorage.setItem('gt_blogs', JSON.stringify(filtered));
  }

  // FAQs Management
  public getFAQs(): FAQ[] {
    return JSON.parse(localStorage.getItem('gt_faqs') || '[]');
  }

  public saveFAQ(faq: { id?: string, question: string, answer: string }): FAQ {
    const faqs = this.getFAQs();
    if (faq.id) {
      const index = faqs.findIndex(f => f.id === faq.id);
      if (index !== -1) {
        faqs[index] = faq as FAQ;
      }
    } else {
      const newId = "faq-" + Math.random().toString(36).substr(2, 9);
      const newFAQ: FAQ = {
        ...faq,
        id: newId
      };
      faqs.push(newFAQ);
    }
    localStorage.setItem('gt_faqs', JSON.stringify(faqs));
    return faq as FAQ;
  }

  public deleteFAQ(id: string) {
    const faqs = this.getFAQs();
    const filtered = faqs.filter(f => f.id !== id);
    localStorage.setItem('gt_faqs', JSON.stringify(filtered));
  }

  // Testimonials Management
  public getTestimonials(): Testimonial[] {
    return JSON.parse(localStorage.getItem('gt_testimonials') || '[]');
  }

  public saveTestimonial(testimonial: { id?: string, name: string, role: string, company: string, feedback: string, rating: number, image: string }): Testimonial {
    const testimonials = this.getTestimonials();
    if (testimonial.id) {
      const index = testimonials.findIndex(t => t.id === testimonial.id);
      if (index !== -1) {
        testimonials[index] = testimonial as Testimonial;
      }
    } else {
      const newId = "tst-" + Math.random().toString(36).substr(2, 9);
      const newTestimonial: Testimonial = {
        ...testimonial,
        id: newId
      };
      testimonials.push(newTestimonial);
    }
    localStorage.setItem('gt_testimonials', JSON.stringify(testimonials));
    return testimonial as Testimonial;
  }

  public deleteTestimonial(id: string) {
    const testimonials = this.getTestimonials();
    const filtered = testimonials.filter(t => t.id !== id);
    localStorage.setItem('gt_testimonials', JSON.stringify(filtered));
  }

  // Services Setup Management
  public getServices(): ServiceCard[] {
    return JSON.parse(localStorage.getItem('gt_services') || '[]');
  }

  public saveService(service: { id?: string, title: string, description: string, iconName: string, features: string[] }): ServiceCard {
    const services = this.getServices();
    if (service.id) {
      const index = services.findIndex(s => s.id === service.id);
      if (index !== -1) {
        services[index] = service as ServiceCard;
      }
    } else {
      const newId = "srv-" + Math.random().toString(36).substr(2, 9);
      const newService: ServiceCard = {
        ...service,
        id: newId
      };
      services.push(newService);
    }
    localStorage.setItem('gt_services', JSON.stringify(services));
    return service as ServiceCard;
  }

  public deleteService(id: string) {
    const services = this.getServices();
    const filtered = services.filter(s => s.id !== id);
    localStorage.setItem('gt_services', JSON.stringify(filtered));
  }

  // Pricing Plans Setup Management
  public getPricingPlans(): PricingPlan[] {
    return JSON.parse(localStorage.getItem('gt_pricing') || '[]');
  }

  public savePricingPlan(plan: { id?: string, name: string, price: string, timeframe: string, description: string, features: string[], popular: boolean, ctaText: string }): PricingPlan {
    const plans = this.getPricingPlans();
    if (plan.id) {
      const index = plans.findIndex(p => p.id === plan.id);
      if (index !== -1) {
        plans[index] = plan as PricingPlan;
      }
    } else {
      const newId = "plan-" + Math.random().toString(36).substr(2, 9);
      const newPlan: PricingPlan = {
        ...plan,
        id: newId
      };
      plans.push(newPlan);
    }
    localStorage.setItem('gt_pricing', JSON.stringify(plans));
    return plan as PricingPlan;
  }

  public deletePricingPlan(id: string) {
    const plans = this.getPricingPlans();
    const filtered = plans.filter(p => p.id !== id);
    localStorage.setItem('gt_pricing', JSON.stringify(filtered));
  }
}

export const db = new RelationalDatabase();
