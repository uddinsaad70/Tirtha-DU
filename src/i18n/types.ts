// Defines the canonical shape of a translation dictionary.
// Both bn.ts and en.ts must satisfy this interface —
// TypeScript will error if either file is missing a key.

export type Lang = "bn" | "en";

export interface Dictionary {
  // ── Navbar ──────────────────────────────────────────────────────────────
  nav: {
    home: string;
    about: string;
    committee: string;
    activities: string;
    news: string;
    members: string;
    contact: string;
    langToggleLabel: string; // Accessibility label for the toggle button
  };

  // ── Common UI ────────────────────────────────────────────────────────────
  common: {
    save: string;
    cancel: string;
    delete: string;
    edit: string;
    publish: string;
    draft: string;
    loading: string;
    confirm: string;
    search: string;
    back: string;
    viewAll: string;
    addNew: string;
    noData: string;
    readmore: string;
  };

  // ── Committee page ───────────────────────────────────────────────────────
  committee: {
    pageSupertitle: string; // "তীর্থ পরিচালনা পর্ষদ" / "tirtho Governing Body"
    pageTitle: string;
    pageSubtitle: string;
    tabCurrent: string; // year is appended in component via interpolation
    tabAlumni: string;
    sessionLabel: string;
    alumniNote: string;
    emptyState: string;
  };

  // ── Admin: Member form ────────────────────────────────────────────────────
  adminMembers: {
    newPageTitle: string;
    editPageTitle: string;
    fieldName: string;
    fieldDesignation: string;
    fieldDepartment: string;
    fieldSession: string;
    fieldFacebook: string;
    fieldPhoto: string;
    fieldIsAlumni: string;
    fieldTermEnd: string;
    selectDesignationPlaceholder: string;
    sectionBasicInfo: string;
    sectionPhoto: string;
    sectionSettings: string;
    photoHint: string;
    saveButton: string;
    savingButton: string;
    fieldCommitteeYear: string;
  };

  // ── Admin: Designation optgroup labels ────────────────────────────────────
  // These mirror DESIGNATION_GROUPS[].groupLabel but live here so the
  // Navbar/form can use the same language context without importing designations
  designationGroups: {
    advisors: string;
    topLeadership: string;
    secretaries: string;
    others: string;
  };

  members: {
    // Hero
    pageSupertitle: string;
    pageTitle: string;
    pageSubtitle: string;
    // Stats strip
    statTotal: string;
    statCurrent: string;
    statAlumni: string;
    statCommittee: string;
    statBloodGroups: string;
    // Tabs
    tabAll: string;
    tabCurrent: string;
    tabAlumni: string;
    // Search
    searchPlaceholder: string;
    // Badges
    badgeAlumni: string;
    // Card
    cardHoverCta: string;
    // Modal
    modalClose: string;
    modalFacebookCta: string;
    // Modal info row labels
    fieldDepartment: string;
    fieldSession: string;
    fieldCommittee: string;
    fieldPhone: string;
    fieldBio: string;
    // Empty state
    emptyState: string;
    emptyStateSearchHint: string;
    emptyStateClearCta: string;
    tabBlood: string;
    filterBloodGroup: string;
    emptyStateClearFilters: string;
  };

  home: {
    // Ticker
    tickerLabel: string;
    // Notice card badges + actions
    fileBadgePdf: string;
    fileBadgeImage: string;
    noticeDownload: string;
    noticeView: string;
    // Hero
    heroBadge: string;
    heroTitlePrefix: string;
    heroTitleHighlight: string;
    heroTagline: string;
    heroMotto: string;
    heroCtaAbout: string;
    heroCtaActivities: string;
    // Activities strip — keyed object so ACTIVITY_KEYS can index directly
    activities: {
      academic: { label: string; desc: string };
      blood: { label: string; desc: string };
      humanitarian: { label: string; desc: string };
      cultural: { label: string; desc: string };
    };
    // Notices section
    noticesSuperLabel: string;
    noticesTitle: string;
    noticesEmpty: string;
    noticesViewAllMobile: string;
    // Facebook CTA
    facebookCtaText: string;
    facebookCtaButton: string;
    heroCtaBlood: string;
  };
  activities: {
    // Hero
    pageSupertitle: string;
    pageTitle: string;
    pageSubtitle: string;
    // Category config — label (full) and shortLabel (abbreviated) per key
    // Keyed by the exact DB-stored English category string
    categories: {
      "Academic Care": { label: string; shortLabel: string };
      "Blood Donation": { label: string; shortLabel: string };
      "Humanitarian Support": { label: string; shortLabel: string };
      "Cultural Programs": { label: string; shortLabel: string };
    };
    // Section subtitle template — {label} is replaced at runtime
    categorySubtitle: string;
    // Card
    cardReadMore: string;
    // Modal
    modalClose: string;
    // Empty state
    emptyState: string;
    emptyStateSoon: string;
  };
  news: {
    // Hero
    pageSupertitle: string;
    pageTitle: string;
    pageSubtitle: string;
    // Tabs
    tabNotices: string;
    tabGallery: string;
    // Notice modal
    badgeNew: string;
    modalClose: string;
    modalAttachedImage: string;
    modalAttachedDocument: string;
    modalDownloadPdf: string;
    modalViewImage: string;
    // Notices empty state
    noticesEmpty: string;
    // Gallery / album card
    albumViewCta: string;
    galleryEmpty: string;
    galleryEmptySoon: string;
    // Lightbox accessibility
    lightboxClose: string;
    lightboxPrev: string;
    lightboxNext: string;
    lightboxImageAlt: string; // prefix: "Album Title — {lightboxImageAlt} 3"
    lightboxThumbnail: string; // prefix: "{lightboxThumbnail} 3"
  };
  about: {
    // Hero
    heroBadge: string;
    heroTitle: string;
    heroSubtitle: string;
    heroMotto: string;
    // Stats labels only
    statLabels: {
      years: string;
      members: string;
      blood: string;
      students: string;
    };
    // Pillars
    pillarsSuperTitle: string;
    pillarsTitle: string;
    pillars: { icon: string; title: string; body: string }[];
    // Mission & Vision
    missionSuperTitle: string;
    missionBody: string;
    visionSuperTitle: string;
    visionBody: string;
    // Timeline
    timelineSuperTitle: string;
    timelineTitle: string;
    timeline: { year: string; title: string; body: string }[];
    // CTA
    ctaTitle: string;
    ctaSubtitle: string;
    ctaContactBtn: string;
    ctaFacebookBtn: string;
  };
  contact: {
    heroBadge: string;
    heroTitle: string;
    heroSubtitle: string;
    addressTitle: string;
    addressDesc: string;
    officeLabel: string;
    officeAddress1: string;
    officeAddress2: string;
    emailLabel: string;
    socialLabel: string;
    fbGroupText: string;
    formTitle: string;
    successMessage: string;
    nameLabel: string;
    namePlaceholder: string;
    contactLabel: string;
    contactPlaceholder: string;
    messageLabel: string;
    messagePlaceholder: string;
    submitBtn: string;
    submittingBtn: string;
    successTitle: string;
  };
  footer: {
    motto: string;
    description: string;
    quickLinksTitle: string;
    links: {
      about: string;
      committee: string;
      activities: string;
      news: string;
      members: string;
      contact: string;
    };
    contactTitle: string;
    emailLabel: string;
    facebookLabel: string;
    addressLabel: string;
    addressValue: string;
    copyright: string;
  };
  adminDashboard: {
    supertitle: string;
    title: string;
    welcomeMsg: string;
    statLabels: {
      totalMembers: string;
      membersSubtext: string;
      publishedNotices: string;
      noticesSubtext: string;
      totalActivities: string;
      activitiesSubtext: string;
      bloodUnits: string;
      bloodSubtext: string;
    };
    recentActivity: {
      title: string;
      subtitle: string;
      empty: string; // ← নতুন: কোনো ডেটা না থাকলে
      prefixNotice: string; // ← নতুন: "নোটিশ:", "Notice:"
      prefixMember: string; // ← নতুন: "সদস্য:", "Member:"
      prefixActivity: string; // ← নতুন: "অ্যাক্টিভিটি:", "Activity:"
    };
    quickActions: {
      title: string;
      newNotice: string;
      newNoticeDesc: string;
      addMember: string;
      addMemberDesc: string;
      addActivity: string;
      addActivityDesc: string;
    };
    motto: string;
  };
  adminSidebar: {
    brand: string;
    brandSub: string;
    menuLabel: string;
    nav: {
      dashboard: string;
      notices: string;
      members: string;
      activities: string;
      gallery: string;
    };
    viewSite: string;
    logout: string;
    loggingOut: string;
  };
  adminMembersList: {
    supertitle: string;
    title: string;
    total: string;
    current: string;
    alumni: string;
    addBtn: string;
    emptyTitle: string;
    emptyDesc: string;
    table: {
      member: string;
      department: string;
      bloodGroup: string;
      status: string;
      action: string;
    };
    statusCurrent: string;
    statusAlumni: string;
    editBtn: string;
    deleteBtn: string;
    deleting: string;
    deleteConfirm: string;
  };
  adminMembersEdit: {
    back: string;
    supertitle: string;
    title: string;
    sectionPersonal: string;
    fieldName: string;
    fieldDept: string;
    fieldSession: string;
    fieldBlood: string;
    selectPlaceholder: string;
    fieldPhone: string;
    fieldFb: string;
    fieldPhoto: string;
    photoHint: string;
    fieldBio: string;
    sectionMembership: string;
    fieldType: string;
    typeCurrent: string;
    typeAlumni: string;
    fieldRole: string;
    roleGeneral: string;
    roleCommittee: string;
    fieldDesignation: string;
    fieldCommitteeYear: string;
    committeeYearHint: string;
    cancelBtn: string;
    updateBtn: string;
    updatingBtn: string;
  };
  adminNoticesList: {
    supertitle: string;
    title: string;
    total: string;
    published: string;
    ticker: string;
    addBtn: string;
    emptyTitle: string;
    emptyDesc: string;
    table: {
      title: string;
      file: string;
      ticker: string;
      status: string;
      action: string;
    };
    badgePdf: string;
    badgeImg: string;
    badgeTickerYes: string;
    badgeTickerNo: string;
    badgePubYes: string;
    badgePubNo: string;
    viewBtn: string;
    editBtn: string;
    expiresPrefix: string;
    delete: {
      confirmPrompt: string;
      confirmYes: string;
      confirmNo: string;
      deleting: string;
      deleteBtn: string;
    };
  };
  adminNoticesEdit: {
    back: string;
    supertitle: string;
    titleNew: string;
    titleEdit: string;
    sectionBasic: string;
    fieldTitle: string;
    fieldTitleHint: string;
    fieldTitlePlaceholder: string;
    fieldBody: string;
    fieldBodyHint: string;
    fieldBodyPlaceholder: string;
    fieldExpiry: string;
    fieldExpiryHint: string;
    sectionFile: string;
    fieldFile: string;
    fieldFileHint: string;
    fileChangeHint: string;
    fileUploadLabel: string;
    fileUploadHint: string;
    fileReplaceLabel: string;
    fileKeepPrev: string;
    fileCurrentLabel: string;
    fileViewNewTab: string;
    fileRemoveBtn: string;
    sectionDisplay: string;
    fieldTicker: string;
    fieldTickerHint: string;
    tickerNo: string;
    tickerYes: string;
    fieldStatus: string;
    fieldStatusHint: string;
    statusPub: string;
    statusDraft: string;
    cancelBtn: string;
    publishBtn: string;
    publishingBtn: string;
    updateBtn: string;
    updatingBtn: string;
    fieldPublishedAt: string;
    fieldPublishedAtHint: string;
  };
  adminActivitiesList: {
    supertitle: string;
    title: string;
    total: string;
    published: string;
    unpublished: string;
    addBtn: string;
    emptyTitle: string;
    emptyDesc: string;
    table: {
      activity: string;
      status: string;
      date: string;
      action: string;
    };
    badgePubYes: string;
    badgePubNo: string;
    editBtn: string;
    delete: {
      confirmPrompt: string;
      confirmYes: string;
      confirmNo: string;
      deleting: string;
      deleteBtn: string;
    };
    fieldImpact: string;
    fieldImpactHint: string;
  };
  adminActivitiesEdit: {
    back: string;
    supertitle: string;
    titleNew: string;
    titleEdit: string;
    sectionBasic: string;
    fieldTitle: string;
    fieldTitleHint: string;
    fieldTitlePlaceholder: string;
    fieldCategory: string;
    fieldCategoryHint: string;
    selectPlaceholder: string;
    catAcademic: string;
    catBlood: string;
    catHumanitarian: string;
    catCultural: string;
    fieldBody: string;
    fieldBodyHint: string;
    fieldBodyPlaceholder: string;
    sectionPhoto: string;
    fieldPhoto: string;
    fieldPhotoHint: string;
    photoCurrent: string;
    photoRemove: string;
    photoReplace: string;
    photoChangeHint: string;
    photoUploadLabel: string;
    photoUploadHint: string;
    photoKeepPrev: string;
    sectionDisplay: string;
    fieldStatus: string;
    fieldStatusHint: string;
    statusPub: string;
    statusDraft: string;
    cancelBtn: string;
    publishBtn: string;
    publishingBtn: string;
    updateBtn: string;
    updatingBtn: string;
    fieldImpact: string;
    fieldImpactHint: string;
  };
  adminGalleryList: {
    supertitle: string;
    title: string;
    totalPrefix: string;
    totalSuffix: string;
    addBtn: string;
    emptyTitle: string;
    emptyDesc: string;
    addFirstBtn: string;
    photosSuffix: string;
    noDate: string;
    editBtn: string;
    delete: {
      confirmPrompt: string;
      confirmYes: string;
      confirmNo: string;
      deleting: string;
      deleteBtn: string;
    };
  };
  adminGalleryEdit: {
    back: string;
    supertitle: string;
    titleNew: string;
    titleEdit: string;
    sectionBasic: string;
    fieldTitle: string;
    fieldTitleHint: string;
    fieldTitlePlaceholder: string;
    fieldEvent: string;
    fieldEventHint: string;
    fieldEventPlaceholder: string;
    fieldDate: string;
    fieldDateHint: string;
    sectionImages: string;
    currentImagesTitle: string;
    noCurrentImagesHint: string;
    removeImageBtn: string;
    fieldNewImages: string;
    fieldNewImagesHint: string;
    uploadLabel: string;
    uploadHint: string;
    badgeCover: string;
    badgeNew: string;
    cancelBtn: string;
    saveBtn: string;
    savingBtn: string;
    updateBtn: string;
    updatingBtn: string;
  };
  login: {
    back: string;
    title: string;
    subtitle: string;
    emailLabel: string;
    emailPlaceholder: string;
    passwordLabel: string;
    passwordPlaceholder: string;
    showPassword: string;
    hidePassword: string;
    loginBtn: string;
    loggingInBtn: string;
    footerNote: string;
    copyright: string;
    error: {
      invalidCredentials: string;
      unconfirmedEmail: string;
      tooManyRequests: string;
      general: string;
    };
  };
}
