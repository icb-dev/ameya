import { Routes, Route, useLocation, useParams, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import ScrollToTop from "./components/ScrollToTop";
import Navbar from "./components/Navbar"; 
import Home from "./pages/Home";
import Home2 from "./pages/home2";  
import About2 from "./pages/About-us.jsx";
import Projects from "./pages/Projects";
import Allcommercialprojects from "./pages/Allcommercialprojects";
import Projectdetail from "./pages/Projectdetail";
import Prodetail from "./pages/Prodetail";
import Contact from "./pages/Contact";
import Contactus from "./pages/Contactus";
import Newsandinsights from "./pages/Newsandinsights";
import Blogdetailed from "./pages/Blogdetailed";
import PrivacyPolicy from "./pages/Privacy";
import Disclaimer from "./pages/Disclaimer";
import ResidentialDetail from "./pages/property/ResidentialDetail";
import CommercialDetail from "./pages/property/CommercialDetail"; 
import Leasing from "./pages/Leasing";
import Career from "./pages/Career";
import AdminLogin from "./admin/pages/Login";
import AdminDashboard from "./admin/pages/Dashboard";
import AdminUpload from "./admin/pages/Upload";
import AdminManageProperties from "./admin/pages/ManageProperties";
import AdminEditProperty from "./admin/pages/EditProperty";
import AddResidence from "./admin/pages/add-residence";
import HomeBanner from "./admin/pages/HomeBanner";
import ChangePassword from "./admin/pages/ChangePassword";
import ChangePopupImage from "./admin/pages/ChangePopupImage";
import ManageResidence from "./admin/pages/ManageResidence";
import EditResidence from "./admin/pages/EditResidence";
import Blogs from "./admin/pages/blogs";
import AddKeywords from "./admin/pages/AddKeywords";
import Privacypolicy from "./pages/Privacypolicy";
import Residentialproject from "./pages/Residentialproject";
import Resipage from "./pages/Resipage";
import Allprojects from "./pages/Allprojects";
import { getProjectBySlug } from "../services/projectService";

// Wrapper component to route based on project type
const ProjectRouter = () => {
  const { slug } = useParams();
  const [projectType, setProjectType] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkProjectType = async () => {
      try {
        const project = await getProjectBySlug(slug);
        if (project && project.project_type) {
          setProjectType(project.project_type);
        }
      } catch (error) {
        console.error("Error checking project type:", error);
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      checkProjectType();
    }
  }, [slug]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="inline-block h-10 w-10 animate-spin rounded-full border-2 border-[#28659b] border-t-transparent" />
          <p className="mt-4 text-gray-600">Loading project…</p>
        </div>
      </div>
    );
  }

  return projectType === 'residential' ? <Resipage /> : <Prodetail />;
};


 function App() {
  const location = useLocation();
  
  // Pages where navbar should be hidden
  const hideNavbarPaths = [
    '/property/residential',
    '/property/commercial',
    '/admin/login',
    '/admin/dashboard',
    '/admin/home-banner',
    '/admin/popup-image',
    '/admin/upload',
    '/admin/manage-properties',
    '/admin/edit-property',
    '/admin/add-residence',
    '/admin/change-password',
    '/admin/manage-residence',
    '/admin/edit-residence',
    '/admin/blogs',
    '/admin/keywords'
  ];
  
  // Check if current path should hide navbar
  const shouldHideNavbar = hideNavbarPaths.some(path => 
    location.pathname.startsWith(path)
  );

  return (
    <>
      <ScrollToTop />
      {!shouldHideNavbar && <Navbar />}
      <Routes>
        <Route path="/Home" element={<Home />} />
        <Route path="/" element={<Home2 />} />  
        <Route path="/About-us" element={<About2 />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/Allcommercialprojects" element={<Allcommercialprojects />} />
        <Route path="/Projectdetail" element={<Projectdetail />} />
        <Route path="/Prodetail" element={<Prodetail />} />
        <Route path="/Leasing" element={<Leasing />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/contactus" element={<Contactus />} />
        <Route path="/Newsandinsights" element={<Newsandinsights />} />
        <Route path="/Blogdetailed" element={<Navigate to="/Newsandinsights" replace />} />
        <Route path="/Blogdetailed/:slug" element={<Blogdetailed />} />
        <Route path="/privacy" element={<PrivacyPolicy />} />
        <Route path="/disclaimer" element={<Disclaimer />} />
        <Route path="/property/residential/:title" element={<ResidentialDetail />} />
        <Route path="/property/commercial/:title" element={<CommercialDetail />} />
        <Route path="/career" element={<Career />} /> 
        <Route path="/Privacypolicy" element={<Privacypolicy />} />
        <Route path="/Residentialproject" element={<Residentialproject />} />
        <Route path="/Resipage" element={<Resipage />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/home-banner" element={<HomeBanner />} />
        <Route path="/admin/popup-image" element={<ChangePopupImage />} />
        <Route path="/admin/upload" element={<AdminUpload />} />
        <Route path="/admin/add-residence" element={<AddResidence />} />
        <Route path="/admin/manage-properties" element={<AdminManageProperties />} />
        <Route path="/admin/edit-property/:id" element={<AdminEditProperty />} />
        <Route path="/admin/change-password" element={<ChangePassword />} />
        <Route path="/admin/manage-residence" element={<ManageResidence />} />
        <Route path="/admin/edit-residence/:id" element={<EditResidence />} />
        <Route path="/admin/blogs" element={<Blogs />} />
        <Route path="/admin/keywords" element={<AddKeywords />} /> 
        <Route path="/projects/:slug" element={<ProjectRouter />} />

        <Route path="/Allprojects" element={<Allprojects />} />
      </Routes>
    </>
  );
}

export default App;