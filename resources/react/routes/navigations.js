export const nav_menus = [
    {
        heading: 'About',
        headingLink: '/about',
        submenus: [
            {title: 'About', link: '/about'},
            // {title: 'Studio booking', link: '/about_studiobooking'},
        ]
    },
    {
        heading: 'MAGAZINE',
        headingLink: '/magazine',
        linkable: true,
        submenus: [
            {title: 'NEWS', link: '/magazine/news'},
            {title: 'INTERVIEW', link: '/magazine/interview'},
            {title: 'FEATURE', link: '/magazine/feature'},
            // {title: 'MUSIC', link: '/magazine/MUSIC'},
            // {title: 'TUTORIAL', link: '/magazine/TUTORIAL'},
            // {title: 'LIFESTYLE', link: '/magazine/LIFESTYLE'}
        ]
    },
    {
        heading: 'WMM',
        headingLink: '/wmm',
        submenus: [
            {title: 'WMM2021', link: '/wmm2021'},
            {title: 'History', link: '/wmm_history'},
            // {title: 'Songcamp', link: '/wmm_songcamp'},
        ]
    },
    // {
    //     heading: 'Beatbox',
    //     headingLink: '/beatbox',
    //     submenus: [
    //         {title: 'Program', link: '/beatbox_program'},
    //     ]
    // },
    {
        heading: 'VINYL',
        headingLink: '/vinyl',
        submenus: [
            {title: 'Program', link: '/vinyl_program'},
            {title: 'LP Library', link: '/vinyl_library'}
        ]
    },
    // {
    //     heading: 'RDA',
    //     headingLink: '/rda',
    //     submenus: [
    //         {title: 'RDA', link: '/rda'}
    //     ]
    // }
];
// MEMBER, MAIN, MAGAZINE, WMM, BEATBOX, VINYL
export const admin_menus = [
    { type: 'title', label: '회원관리', permission: 'MEMBER'},
    { type: 'menu', link: '/admin/members', label: '회원목록', permission: 'MEMBER'},

    { type: 'title', label: '메인관리', permission: 'MAIN'},
    { type: 'menu', link: '/admin/main_banner', label: '메인 비쥬얼 배너', permission: 'MAIN'},
    { type: 'menu', link: '/admin/medium_banner', label: '중간 배너', permission: 'MAIN'},
    { type: 'menu', link: '/admin/bottom_banner', label: '하단 배너', permission: 'MAIN'},
    { type: 'menu', link: '/admin/event_content', label: 'EVENT영역 콘텐츠', permission: 'MAIN'},
    { type: 'menu', link: '/admin/video_content', label: 'VIDEO영역 콘텐츠', permission: 'MAIN'},
    
    { type: 'title', label: '콘텐츠관리', permission: 'MAGAZINE,WMM,BEATBOX,VINYL'},
    { type: 'menu', link: '/admin/feature', label: 'MAGAZINE', permission: 'MAGAZINE',
        submenu: [
            { type: 'sub-menu', link: '/admin/feature_list', label: '콘텐츠 목록'},
            { type: 'sub-menu', link: '/admin/feature_detail', label: '콘텐츠'},
        ]
    },

    { type: 'menu', link: '/admin/wmm_history', label: 'WMM History', permission: 'WMM', 
        submenu: [
            { type: 'sub-menu', link: '/admin/wmm_history_puzzle', label: '퍼즐배너관리'},
            { type: 'sub-menu', link: '/admin/wmm_history_content', label: '배너관리'},
            { type: 'sub-menu', link: '/admin/wmm_history_layer_list', label: '콘텐츠[레이어팝업] 목록'},
            { type: 'sub-menu', link: '/admin/wmm_history_layer', label: '콘텐츠[레이어팝업]'},
        ]
    },

    { type: 'menu', link: '/admin/wmm_camp', label: 'WMM SONGCAMP', permission: 'WMM',
        submenu: [
            { type: 'sub-menu', link: '/admin/wmm_camp_list', label: '캠페인 목록'},
            // { type: 'sub-menu', link: '/admin/wmm_camp_detail', label: '캠페인 정보'},
            { type: 'sub-menu', link: '/admin/wmm_camp_applicants', label: '캠페인 신청자 목록'},
            { type: 'sub-menu', link: '/admin/wmm_camp_documents', label: '캠페인 신청양식'},
        ]
    },

    { type: 'menu', link: '/admin/beatbox_camp', label: 'BEATBOX PROGRAM', permission: 'BEATBOX',
        submenu: [
            { type: 'sub-menu', link: '/admin/beatbox_camp_list', label: '캠페인 목록'},
            // { type: 'sub-menu', link: '/admin/beatbox_camp_detail', label: '캠페인 정보'},
            { type: 'sub-menu', link: '/admin/beatbox_camp_applicants', label: '캠페인 신청자 목록'},
            { type: 'sub-menu', link: '/admin/beatbox_camp_documents', label: '캠페인 신청양식'},
        ]
    },

    { type: 'menu', link: '/admin/vinyl_camp', label: 'VINYL PROGRAM', permission: 'VINYL',
        submenu: [
            { type: 'sub-menu', link: '/admin/vinyl_camp_list', label: '캠페인 목록'},
            { type: 'sub-menu', link: '/admin/vinyl_camp_applicants', label: '캠페인 신청자 목록'},
            { type: 'sub-menu', link: '/admin/vinyl_camp_documents', label: '캠페인 신청양식'},
        ]
    },
    
    { type: 'menu', link: '/admin/vinyl_lib', label: 'VINYL LP LIBRARY', permission: 'VINYL',
        submenu: [
            { type: 'sub-menu', link: '/admin/vinyl_lib_category', label: '콘텐츠 장르 카테고리'},
            { type: 'sub-menu', link: '/admin/vinyl_lib_list', label: '콘텐츠 목록'},
            // { type: 'sub-menu', link: '/admin/vinyl_lib_detail', label: '콘텐츠'},
        ]
    },
    
    { type: 'menu', link: '/admin/rda', label: 'RDA', permission: 'RDA',
        submenu: [
            { type: 'sub-menu', link: '/admin/rda_campaigns', label: '참가 캠페인 목록'},
            { type: 'sub-menu', link: '/admin/rda_list', label: '신청자 목록'},
            { type: 'sub-menu', link: '/admin/rda_banners', label: 'RDA 배너'},
            { type: 'sub-menu', link: '/admin/rda_contents', label: '콘텐츠'},
            { type: 'sub-menu', link: '/admin/rda_logos', label: '로고 목록'},
            { type: 'sub-menu', link: '/admin/rda_musics', label: '뮤지션 목록'},
            { type: 'sub-menu', link: '/admin/rda_faqs', label: 'FAQ 목록'},
            { type: 'sub-menu', link: '/admin/rda_settings', label: '환경설정'},
        ]
    },

    { type: 'title', label: '사이트관리'},
    { type: 'menu', link: '/admin/service', label: '서비스약관',
        submenu: [
            { type: 'sub-menu', link: '/admin/serivce_terms', label: '이용약관'},
            { type: 'sub-menu', link: '/admin/service_personal_info', label: '개인정보취급방침'},
        ]
    },
    { type: 'menu', link: '/admin/faq_list', label: 'FAQ'},
    { type: 'menu', link: '/admin/notice_list', label: 'NOTICE'},
];

export const member_menus = [
    { type: 'title', label: '회원관리', permission: 'MEMBER'},
    { type: 'menu', link: '/admin/members', label: '회원목록', permission: 'MEMBER'},
];

export const main_menus = [
    { type: 'title', label: '메인관리', permission: 'MAIN'},
    { type: 'menu', link: '/admin/main_banner', label: '메인 비쥬얼 배너', permission: 'MAIN'},
    { type: 'menu', link: '/admin/medium_banner', label: '중간 배너', permission: 'MAIN'},
    { type: 'menu', link: '/admin/bottom_banner', label: '하단 배너', permission: 'MAIN'},
    { type: 'menu', link: '/admin/event_content', label: 'EVENT영역 콘텐츠', permission: 'MAIN'},
    { type: 'menu', link: '/admin/video_content', label: 'VIDEO영역 콘텐츠', permission: 'MAIN'},
];

export const feature_menus = [
    { type: 'title', label: 'MAGAZINE 관리'},
    { type: 'menu', link: '/admin/feature_list', label: '콘텐츠 목록'},
    { type: 'menu', link: '/admin/feature_detail', label: '콘텐츠'},
];

export const wmm_menus = [
    { type: 'title', label: 'WMM History 관리'},
    { type: 'menu', link: '/admin/wmm_history_puzzle', label: '퍼즐배너관리'},
    { type: 'menu', link: '/admin/wmm_history_content', label: '배너관리'},
    { type: 'menu', link: '/admin/wmm_history_layer_list', label: '콘텐츠[레이어팝업] 목록'},
    { type: 'menu', link: '/admin/wmm_history_layer', label: '콘텐츠[레이어팝업]'},

    { type: 'title', label: 'WMM SONGCAMP 관리'},
    { type: 'menu', link: '/admin/wmm_camp_list', label: '캠페인 목록'},
    { type: 'menu', link: '/admin/wmm_camp_applicants', label: '캠페인 신청자 목록'},
    { type: 'menu', link: '/admin/wmm_camp_documents', label: '캠페인 신청양식'},
];

export const beatbox_menus = [
    { type: 'title', label: 'BEATBOX PROGRAM 관리'},
    { type: 'menu', link: '/admin/beatbox_camp_list', label: '캠페인 목록'},
    { type: 'menu', link: '/admin/beatbox_camp_applicants', label: '캠페인 신청자 목록'},
    { type: 'menu', link: '/admin/beatbox_camp_documents', label: '캠페인 신청양식'},
];

export const vinyl_menus = [
    { type: 'title', label: 'VINYL PROGRAM 관리'},
    { type: 'menu', link: '/admin/vinyl_camp_list', label: '캠페인 목록'},
    { type: 'menu', link: '/admin/vinyl_camp_applicants', label: '캠페인 신청자 목록'},
    { type: 'menu', link: '/admin/vinyl_camp_documents', label: '캠페인 신청양식'},

    { type: 'title', label: 'VINYL LP LIBRARY 관리'},
    { type: 'menu', link: '/admin/vinyl_lib_category', label: '콘텐츠 장르 카테고리'},
    { type: 'menu', link: '/admin/vinyl_lib_list', label: '콘텐츠 목록'},
    { type: 'menu', link: '/admin/vinyl_lib_detail', label: '콘텐츠'},
];
