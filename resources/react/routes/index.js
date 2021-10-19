import React from "react";
import { Redirect } from "react-router-dom";

import { Login, Register } from '../pages/Authentication';
import LoginSuccess from '../pages/Authentication/Login/LoginSuccess';

import Main from '../pages/Main';
import { Profile, MyPage } from '../pages/Profile';
import { About, StudioBooking } from '../pages/About';
import { Feature, FeatureDetail } from '../pages/Feature';
import { History, SongCamp } from '../pages/WMM';
import { BeatboxProgram } from '../pages/BeatBox';
import { VinylProgram, LpLibrary, LpLibraryDetail } from '../pages/VINYL';
import PolicyPage from '../pages/Policy';
import Search from '../pages/Search/index';
import FaqPage from '../pages/FAQ';
import NoticePage from '../pages/Notice';
import NoticeDetail from '../pages/Notice/NoticeDetail';
import RDA from "../pages/RDA";

import { AdminLogin, AdminRegister } from '../admin/Auth';
import { MemberList, MemberForm, MemberDetail } from "../admin/Member";
import { MainBanner, MediumBanner, BottomBanner, EventContent, VideoContent } from "../admin/Main";
import { FeatureContentList, FeatureContentDetail } from '../admin/Feature';
import { WMMContent, WMMLayer, WMMLayerList, WMMPuzzle } from '../admin/WMMHistory';
import { WMMCampList, WMMCampApplicant, WMMCampApplicantDetail, WMMCampApplicantList, WMMApplicantDocuments, WMMApplicantDocument } from '../admin/WMMCamp';
import { BBCampList, BBCampApplicantList, BBCampApplicant, BBCampApplicantDetail, BBApplicantDocuments, BBApplicantDocument } from '../admin/BBProgram';
import { VINYLCampList, VINYLCampApplicantList, VINYLCampApplicant, VINYLCampApplicantDetail, VINYLApplicantDocuments, VINYLApplicantDocument } from '../admin/VINYLProgram';
import { VINYLLibList, VINYLLibDetail, VINYLCategory } from '../admin/VINYLLibrary';
import { RdaCampaignList, RdaList, RdaBanner, RdaLogos, RdaMusics, RdaSettings, RdaContents, RdaFaqList } from '../admin/RDA';
import { UseCasePolicy, PersonalInfoPolicy } from '../admin/Policy';
import FaqAdminPage from '../admin/FAQ';
import NoticeAdminPage from '../admin/Notice';

const publicRoutes = [
  { path: "/main",            component: Main,          layout: 'common' },
  { path: "/login",           component: Login,         layout: 'common' },
  { path: "/register",        component: Register,      layout: 'common' },
  { path: "/login_success/:code", component: LoginSuccess,         layout: 'common' },
  { path: "/admin/login",     component: AdminLogin,    },

  { path: "/search",          component: Search,        layout: 'common'},
  { path: "/faq",          component: FaqPage,        layout: 'common'},
  { path: "/notices",          component: NoticePage,        layout: 'common'},
  { path: "/notice/:id",          component: NoticeDetail,        layout: 'common'},
  
  { path: "/profile/:id",     component: Profile,   layout: 'common' },
  { path: "/my_page",     component: MyPage,    layout: 'common' },

  { path: "/about",               component: About,         layout: 'common' },
  // { path: "/about_studiobooking", component: StudioBooking, layout: 'common' },

  { path: "/magazine/:type?",             component: Feature,       layout: 'common'},
  { path: "/feature_detail/:id",  component: FeatureDetail, layout: 'common'},

  { path: "/wmm2021",   component: RDA,   layout: 'common' },
  { path: "/wmm_history",   component: History,   layout: 'common' },
  { path: "/wmm_songcamp",  component: SongCamp,  layout: 'common' },

  { path: "/beatbox_program", component: BeatboxProgram,  layout: 'common' },

  { path: "/vinyl_program", component: VinylProgram,  layout: 'common' },
  { path: "/vinyl_library", component: LpLibrary,     layout: 'common' },
  { path: "/vinyl_library_detail/:id", component: LpLibraryDetail,     layout: 'common' },

  { path: "/rda", component: RDA,     layout: '' },

  { path: "/privacy_policy",   component: PolicyPage,      layout: 'common' },

  { path: "/admin", component: () => <Redirect to="/admin/login" /> },
  { path: "/",      component: () => <Redirect to="/main" /> }
];

const adminRoutes = [
  { path: "/admin/members", component: MemberList,     layout: 'admin'},
  { path: "/admin/member/:id?", component: MemberForm,     layout: 'admin'},
  { path: "/admin/member_detail/:id", component: MemberDetail,     layout: 'admin'},

  { path: "/admin/main_banner", component: MainBanner,     layout: 'admin'},
  { path: "/admin/medium_banner", component: MediumBanner,     layout: 'admin'},
  { path: "/admin/bottom_banner", component: BottomBanner,     layout: 'admin'},
  { path: "/admin/event_content", component: EventContent,     layout: 'admin'},
  { path: "/admin/video_content", component: VideoContent,     layout: 'admin'},

  { path: "/admin/feature_list", component: FeatureContentList,     layout: 'admin'},
  { path: "/admin/feature_detail/:id?", component: FeatureContentDetail,     layout: 'admin'},

  { path: "/admin/wmm_history_content", component: WMMContent,     layout: 'admin'},
  { path: "/admin/wmm_history_puzzle", component: WMMPuzzle,     layout: 'admin'},
  { path: "/admin/wmm_history_layer_list", component: WMMLayerList,     layout: 'admin'},
  { path: "/admin/wmm_history_layer/:id?", component: WMMLayer,     layout: 'admin'},

  { path: "/admin/wmm_camp_list", component: WMMCampList,     layout: 'admin'},
  { path: "/admin/wmm_camp_applicants", component: WMMCampApplicantList,     layout: 'admin'},
  { path: "/admin/wmm_camp_applicant/:id", component: WMMCampApplicant,     layout: 'admin'},
  { path: "/admin/wmm_camp_applicant_detail/:id", component: WMMCampApplicantDetail,     layout: 'admin'},
  { path: "/admin/wmm_camp_documents", component: WMMApplicantDocuments,     layout: 'admin'},
  { path: "/admin/wmm_camp_document/:id?", component: WMMApplicantDocument,     layout: 'admin'},

  { path: "/admin/beatbox_camp_list", component: BBCampList,     layout: 'admin'},
  { path: "/admin/beatbox_camp_applicants", component: BBCampApplicantList,     layout: 'admin'},
  { path: "/admin/beatbox_camp_applicant/:id", component: BBCampApplicant,     layout: 'admin'},
  { path: "/admin/beatbox_camp_applicant_detail/:id", component: BBCampApplicantDetail,     layout: 'admin'},
  { path: "/admin/beatbox_camp_documents", component: BBApplicantDocuments,     layout: 'admin'},
  { path: "/admin/beatbox_camp_document/:id?", component: BBApplicantDocument,     layout: 'admin'},

  { path: "/admin/vinyl_camp_list", component: VINYLCampList,     layout: 'admin'},
  { path: "/admin/vinyl_camp_applicants", component: VINYLCampApplicantList,     layout: 'admin'},
  { path: "/admin/vinyl_camp_applicant/:id", component: VINYLCampApplicant,     layout: 'admin'},
  { path: "/admin/vinyl_camp_applicant_detail/:id", component: VINYLCampApplicantDetail,     layout: 'admin'},
  { path: "/admin/vinyl_camp_documents", component: VINYLApplicantDocuments,     layout: 'admin'},
  { path: "/admin/vinyl_camp_document/:id?", component: VINYLApplicantDocument,     layout: 'admin'},

  { path: "/admin/vinyl_lib_list", component: VINYLLibList,     layout: 'admin'},
  { path: "/admin/vinyl_lib_category", component: VINYLCategory,     layout: 'admin'},
  { path: "/admin/vinyl_lib_detail/:id?", component: VINYLLibDetail,     layout: 'admin'},

  { path: "/admin/rda_campaigns", component: RdaCampaignList,     layout: 'admin'},
  { path: "/admin/rda_campaign_detail/:id", component: RdaList,     layout: 'admin'},
  { path: "/admin/rda_list", component: RdaList,     layout: 'admin'},
  { path: "/admin/rda_banners", component: RdaBanner,     layout: 'admin'},
  { path: "/admin/rda_logos", component: RdaLogos,     layout: 'admin'},
  { path: "/admin/rda_musics", component: RdaMusics,     layout: 'admin'},
  { path: "/admin/rda_settings", component: RdaSettings,     layout: 'admin'},
  { path: "/admin/rda_contents", component: RdaContents,     layout: 'admin'},
  { path: "/admin/rda_faqs", component: RdaFaqList,     layout: 'admin'},

  { path: "/admin/serivce_terms", component: UseCasePolicy,     layout: 'admin'},
  { path: "/admin/service_personal_info", component: PersonalInfoPolicy,     layout: 'admin'},

  { path: "/admin/faq_list", component: FaqAdminPage,     layout: 'admin'},

  { path: "/admin/notice_list", component: NoticeAdminPage,     layout: 'admin'},

  { path: "/admin/login", component: () => <Redirect to="/admin/members" /> },
  { path: "/admin/", component: () => <Redirect to="/admin/members" /> },
];

// MEMBER, MAIN, MAGAZINE, WMM, BEATBOX, VINYL
const memberRoutes = [
  { path: "/admin/members", component: MemberList,     layout: 'admin'},

  { path: "/admin/login", component: () => <Redirect to="/admin/members" /> },
  { path: "/admin/", component: () => <Redirect to="/admin/members" /> },
];

const mainRoutes = [
  { path: "/admin/main_banner", component: MainBanner,     layout: 'admin'},
  { path: "/admin/medium_banner", component: MediumBanner,     layout: 'admin'},
  { path: "/admin/bottom_banner", component: BottomBanner,     layout: 'admin'},
  { path: "/admin/event_content", component: EventContent,     layout: 'admin'},
  { path: "/admin/video_content", component: VideoContent,     layout: 'admin'},

  { path: "/admin/login", component: () => <Redirect to="/admin/main_banner" /> },
  { path: "/admin/", component: () => <Redirect to="/admin/main_banner" /> },
];

const featureRoutes = [
  { path: "/admin/feature_list", component: FeatureContentList,     layout: 'admin'},
  { path: "/admin/feature_detail/:id?", component: FeatureContentDetail,     layout: 'admin'},

  { path: "/admin/login", component: () => <Redirect to="/admin/feature_list" /> },
  { path: "/admin/", component: () => <Redirect to="/admin/feature_list" /> },
];

const wmmRoutes = [
  { path: "/admin/wmm_history_puzzle", component: WMMPuzzle,     layout: 'admin'},
  { path: "/admin/wmm_history_content", component: WMMContent,     layout: 'admin'},
  { path: "/admin/wmm_history_layer_list", component: WMMLayerList,     layout: 'admin'},
  { path: "/admin/wmm_history_layer/:id?", component: WMMLayer,     layout: 'admin'},

  { path: "/admin/wmm_camp_list", component: WMMCampList,     layout: 'admin'},
  // { path: "/admin/wmm_camp_detail", component: WMMCampDetail,     layout: 'admin'},
  { path: "/admin/wmm_camp_applicants", component: WMMCampApplicantList,     layout: 'admin'},
  { path: "/admin/wmm_camp_applicant/:id", component: WMMCampApplicant,     layout: 'admin'},
  { path: "/admin/wmm_camp_documents", component: WMMApplicantDocuments,     layout: 'admin'},
  { path: "/admin/wmm_camp_document/:id?", component: WMMApplicantDocument,     layout: 'admin'},

  { path: "/admin/login", component: () => <Redirect to="/admin/wmm_history_puzzle" /> },
  { path: "/admin/", component: () => <Redirect to="/admin/wmm_history_puzzle" /> },
];

const beatboxRoutes = [
  { path: "/admin/beatbox_camp_list", component: BBCampList,     layout: 'admin'},
  { path: "/admin/beatbox_camp_applicants", component: BBCampApplicantList,     layout: 'admin'},
  { path: "/admin/beatbox_camp_applicant/:id", component: BBCampApplicant,     layout: 'admin'},
  { path: "/admin/beatbox_camp_documents", component: BBApplicantDocuments,     layout: 'admin'},
  { path: "/admin/beatbox_camp_document/:id?", component: BBApplicantDocument,     layout: 'admin'},

  { path: "/admin/login", component: () => <Redirect to="/admin/beatbox_camp_list" /> },
  { path: "/admin/", component: () => <Redirect to="/admin/beatbox_camp_list" /> },
]

const vinylboxRoutes = [
  { path: "/admin/vinyl_camp_list", component: VINYLCampList,     layout: 'admin'},
  { path: "/admin/vinyl_camp_applicants", component: VINYLCampApplicantList,     layout: 'admin'},
  { path: "/admin/vinyl_camp_applicant/:id", component: VINYLCampApplicant,     layout: 'admin'},
  { path: "/admin/vinyl_camp_documents", component: VINYLApplicantDocuments,     layout: 'admin'},
  { path: "/admin/vinyl_camp_document/:id?", component: VINYLApplicantDocument,     layout: 'admin'},

  { path: "/admin/vinyl_lib_list", component: VINYLLibList,     layout: 'admin'},
  { path: "/admin/vinyl_lib_category", component: VINYLCategory,     layout: 'admin'},
  // { path: "/admin/vinyl_lib_detail", component: VINYLLibDetail,     layout: 'admin'},

  { path: "/admin/login", component: () => <Redirect to="/admin/vinyl_camp_list" /> },
  { path: "/admin/", component: () => <Redirect to="/admin/vinyl_camp_list" /> },
]

export { publicRoutes, adminRoutes, memberRoutes, mainRoutes, featureRoutes, wmmRoutes, beatboxRoutes, vinylboxRoutes };
