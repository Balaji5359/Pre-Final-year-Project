import React, { Suspense, lazy, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import "./App.css";
import "./styles/LoadingSpinner.css";
import "./modern-styles.css"; // Import modern styles
import "./Main/common-styles.css"; // Import common styles for sections

// Layout components
import Navbar from "./Main/Navbar.jsx";
import Login_Navbar from "./RegisterFiles/Login_Navbar.jsx";
import LoadingSpinner from "./components/LoadingSpinner.jsx";
import ScrollToTop from "./components/ScrollToTop.jsx";
import Activities from "./GenAI_Folders/Activites.jsx";
import Activities2 from "./GenAI_Folders/Activities2.jsx";

// Main page components
const WelcomeSection = lazy(() => import("./Main/WelcomeSection.jsx"));
const AboutSection = lazy(() => import("./Main/AboutSection.jsx"));
const WebsiteUseRoute = lazy(() => import("./Main/WebsiteUseRoute.jsx"));
const HighlightsSection = lazy(() => import("./Main/HighlightsSection.jsx"));
const SelfAssessment = lazy(() => import("./Main/SelfAssessment.jsx"));
const MotivationSection = lazy(() => import("./Main/MotivationSession.jsx"));
const ResourceSection = lazy(() => import("./Main/ResourceSection.jsx"));
const ContactSection = lazy(() => import("./Main/ContactSection.jsx"));
const MapSection = lazy(() => import("./Main/MapSection.jsx")); // Updated map section with fixed iframe
const Footer = lazy(() => import("./Main/Footer.jsx"));
// const Services = lazy(() => import("./Main/Services.jsx"));

// Auth components
const Signup = lazy(() => import("./RegisterFiles/Signup.jsx"));


// Profile components
const ProfileCreation = lazy(() => import("./StudentProfileFiles/ProfileCreation.jsx"));
const ProfileData = lazy(() => import("./StudentProfileFiles/ProfileData.jsx"));
const Progress = lazy(() => import("./StudentProfileFiles/Progress.jsx"));
const RoadMap = lazy(() => import("./StudentProfileFiles/RoadMap.jsx"));

//Mentor Profile components

const Mentor = lazy(() => import("./MentorProfilefiles/Mentor.jsx"));
const MentorProfile = lazy(() => import("./MentorProfilefiles/MentorProfile.jsx"));
const MentorProfileCreate = lazy(() => import("./MentorProfilefiles/MentorProfileCreate.jsx"));

// const GenAI_Interviewer_Res = lazy(() => import("./GenAI_Folders/GenAI_Interviewer_Res.jsx"));
// const PollyPlayer = lazy(() => import("./GenAI_Folders/PollyPlayer.jsx"));
// Field selection components
const TechList_page = lazy(() => import("./FieldSelectionFiles/TechList.jsx"));
const Tech = lazy(() => import("./FieldSelectionFiles/Tech.jsx"));
const Tech_Selection = lazy(() => import("./FieldSelectionFiles/TechSelection.jsx"));
const PlacementPrediction1 = lazy(() => import("./FieldSelectionFiles/Placement_Prediction1.jsx"));
const PlacementRatingForm = lazy(() => import("./FieldSelectionFiles/PlacementRatingForm.jsx"));
const GenAIInterviewerRes = lazy(() => import('./GenAI_Folders/GenAI_Interviewer_Res'));
const GenAI_PronunciationTestSpoken = lazy(() => import('./GenAI_Folders/GenAI_PronunciationTestSpoken.jsx'));
const GenAI_JAM = lazy(() => import('./GenAI_Folders/GenAI_JAM'));
const GenAI_Guidance = lazy(() => import('./GenAI_Folders/GenAI_Guidence.jsx'));
const GenAI_Prev_Q_Interviewer = lazy(() => import('./GenAI_Folders/GenAI_Prev_Q_Interviewer.jsx'));
const GenAI_Personality_Test = lazy(() => import('./GenAI_Folders/GenAI_Personality_Test.jsx'));
const GenAI_Test_Tech = lazy(() => import('./GenAI_Folders/GenAI_Test_Tech.jsx'));
// Layout components
const MainLayout = ({ children }) => (
  <>
    <main className="main-content">
      <Suspense fallback={<LoadingSpinner />}>
        {children}
      </Suspense>
    </main>
  </>
);

// Auth layout is not needed as Login/Signup components handle their own layout
const AuthLayout = ({ children }) => (
  <Suspense fallback={<LoadingSpinner />}>
    {children}
  </Suspense>
);

const DashboardLayout = ({ children }) => (
  <>
    <Login_Navbar />
    <main className="dashboard-content">
      <Suspense fallback={<LoadingSpinner />}>
        {children}
      </Suspense>
    </main>
  </>
);

// Auth guard - redirects to login if not authenticated
const ProtectedRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem("email");
  return isAuthenticated ? children : <Navigate to="/signup" />;
};

// Reset global styles when navigating between routes
const RouteChangeHandler = () => {
  useEffect(() => {
    // Reset body styles to default
    document.body.style = "";
    document.body.className = "";
    
    return () => {
      // Cleanup if needed
    };
  }, []);
  
  return null;
};

function App() {
  return (
    <Router>
      <RouteChangeHandler />
      <ScrollToTop />
      <Suspense fallback={<LoadingSpinner />}>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={
            <MainLayout>
              <>
                <Navbar/>
                <WelcomeSection />
                <AboutSection />
                <WebsiteUseRoute />
                <HighlightsSection />
                <SelfAssessment />
                <MotivationSection />
                <ResourceSection />
                <ContactSection />
                <MapSection />
                <Footer />
              </>
            </MainLayout>
          } />
          
          <Route path="/about" element={
            <MainLayout>
              <AboutSection />
              <MotivationSection />
              <ResourceSection />
              <Footer />
            </MainLayout>
          } />
          
          <Route path="/contact" element={
            <MainLayout>
              <ContactSection />
              <MapSection />
              <Footer />
            </MainLayout>
          } />
          
          
          
          <Route path="/highlights" element={
            <MainLayout>
              <HighlightsSection />
              <SelfAssessment />
              <Footer />
            </MainLayout>
          } />

          {/* Auth routes */}
          
          
          <Route path="/signup" element={
            <AuthLayout>
              <Signup />
            </AuthLayout>
          } />
          
          <Route path="/mentor" element={
            <AuthLayout>
              <Mentor />
            </AuthLayout>
          } />
          
          <Route path="/mentor_profile" element={
            <AuthLayout>
              <MentorProfile/>
            </AuthLayout>
          }/>

          <Route path="/mentor_profile_create" element={
            <AuthLayout>
              <MentorProfileCreate/>
            </AuthLayout>
          }/>

          {/* Protected routes */}
          <Route path="/profilecreation" element={
            <MainLayout>
              <ProfileCreation />
            </MainLayout>
          } />
          
          <Route path="/profiledata" element={
            <ProtectedRoute>
              <DashboardLayout>
                <ProfileData />
              </DashboardLayout>
            </ProtectedRoute>
          } />

          <Route path="/progress" element={
            <ProtectedRoute>
              <DashboardLayout>
                <Progress />
              </DashboardLayout>
            </ProtectedRoute>
          } />

          <Route path="/roadmap" element={
            <ProtectedRoute>
              <DashboardLayout>
                <RoadMap />
              </DashboardLayout>
            </ProtectedRoute>
          } />


          {/* Field selection routes */}
          <Route path="/skill-assessment" element={
            <ProtectedRoute>
              <DashboardLayout>
                <GenAIInterviewerRes/>
              </DashboardLayout>
            </ProtectedRoute>
          } />
          
          <Route path="/tech-list" element={
            <ProtectedRoute>
              <DashboardLayout>
                <TechList_page />
              </DashboardLayout>
            </ProtectedRoute>
          } />
          
          <Route path="/tech-card" element={
            <ProtectedRoute>
              <DashboardLayout>
                <Tech />
              </DashboardLayout>
            </ProtectedRoute>
          } />
          
          <Route path="/tech-selection" element={
            <ProtectedRoute>
              <DashboardLayout>
                <Tech_Selection />
              </DashboardLayout>
            </ProtectedRoute>
          } />
          
          <Route path="/placement-prediction1" element={
            <ProtectedRoute>
              <DashboardLayout>
                <PlacementPrediction1 />
              </DashboardLayout>
            </ProtectedRoute>
          } />
          
          <Route path="/placement-prediction1/:field" element={
            <ProtectedRoute>
              <DashboardLayout>
                <PlacementRatingForm />
              </DashboardLayout>
            </ProtectedRoute>
          } />
          <Route path="/activities" element={
            <ProtectedRoute>
              <DashboardLayout>
                <Activities />
              </DashboardLayout>
            </ProtectedRoute>
          } />
          <Route path="/activities2" element={
            <ProtectedRoute>
              <DashboardLayout>
                <Activities2 />
              </DashboardLayout>
            </ProtectedRoute>
          } />

          <Route path="/genai-interviewer-res" element={
            <ProtectedRoute>
              <DashboardLayout>
                <GenAIInterviewerRes />
              </DashboardLayout>
            </ProtectedRoute>
          } />
          <Route path="/genai-jam" element={
            <ProtectedRoute>
              <DashboardLayout>
                <GenAI_JAM />
              </DashboardLayout>
            </ProtectedRoute>
          } />

          <Route path="/genai-pronunciation-test-spoken" element={
            <ProtectedRoute>
              <DashboardLayout>
                <GenAI_PronunciationTestSpoken />
              </DashboardLayout>
            </ProtectedRoute>
          } />
          <Route path="/genai-guidance" element={
            <ProtectedRoute>
              <DashboardLayout>
                <GenAI_Guidance />
              </DashboardLayout>
            </ProtectedRoute>
          } />
                

          {/* Fallback route for non-existent paths */}
          <Route path="/not-found" element={
            <MainLayout>
              <h1>Page Not Found</h1>
              <p>The page you are looking for does not exist.</p>
            </MainLayout>
          } />
          <Route path="/genai-prev-q-interviewer" element={
            <ProtectedRoute>
              <DashboardLayout>
                <GenAI_Prev_Q_Interviewer />
              </DashboardLayout>
            </ProtectedRoute>
          } />
          <Route path="/genai-personality-test" element={
            <ProtectedRoute>
              <DashboardLayout>
                <GenAI_Personality_Test />
              </DashboardLayout>
            </ProtectedRoute>
          } />
          <Route path="/genai-test-tech" element={
            <ProtectedRoute>
              <DashboardLayout>
                <GenAI_Test_Tech />
              </DashboardLayout>
            </ProtectedRoute>
          } />
          
          {/* Fallback route */}

          {/* Catch all route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </Router>
    
  );
}

export default App;