import React, { Suspense, lazy, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import "./App.css";
import "./styles/LoadingSpinner.css";

// Layout components
import Navbar from "./Main/Navbar.jsx";
import Login_Navbar from "./RegisterFiles/Login_Navbar.jsx";
import LoadingSpinner from "./components/LoadingSpinner.jsx";

// Main page components
const WelcomeSection = lazy(() => import("./Main/WelcomeSection.jsx"));
const AboutSection = lazy(() => import("./Main/AboutSection.jsx"));
const HighlightsSection = lazy(() => import("./Main/HighlightsSection.jsx"));
const SelfAssessment = lazy(() => import("./Main/SelfAssessment.jsx"));
const MotivationSection = lazy(() => import("./Main/MotivationSession.jsx"));
const ResourceSection = lazy(() => import("./Main/ResourceSection.jsx"));
const ContactSection = lazy(() => import("./Main/ContactSection.jsx"));
const MapSection = lazy(() => import("./Main/MapSection.jsx"));
const Services = lazy(() => import("./Main/Services.jsx"));

// Auth components
const Login = lazy(() => import("./RegisterFiles/Login.jsx"));
const Signup = lazy(() => import("./RegisterFiles/Signup.jsx"));

// Profile components
const ProfileCreation = lazy(() => import("./StudentProfileFiles/ProfileCreation.jsx"));
const ProfileData = lazy(() => import("./StudentProfileFiles/ProfileData.jsx"));

// Field selection components
const TechList_page = lazy(() => import("./FieldSelectionFiles/TechList.jsx"));
const Tech = lazy(() => import("./FieldSelectionFiles/Tech.jsx"));
const Tech_Selection = lazy(() => import("./FieldSelectionFiles/TechSelection.jsx"));
const PlacementPrediction1 = lazy(() => import("./FieldSelectionFiles/Placement_Prediction1.jsx"));
const PlacementRatingForm = lazy(() => import("./FieldSelectionFiles/PlacementRatingForm.jsx"));

// Layout components
const MainLayout = ({ children }) => (
  <>
    <Navbar />
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
  return isAuthenticated ? children : <Navigate to="/login" />;
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
      <Suspense fallback={<LoadingSpinner />}>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={
            <MainLayout>
              <>
                <WelcomeSection />
                <AboutSection />
                <HighlightsSection />
                <SelfAssessment />
                <MotivationSection />
                <ResourceSection />
                <ContactSection />
                <MapSection />
              </>
            </MainLayout>
          } />
          
          <Route path="/about" element={
            <MainLayout>
              <AboutSection />
            </MainLayout>
          } />
          
          <Route path="/contact" element={
            <MainLayout>
              <ContactSection />
            </MainLayout>
          } />
          
          <Route path="/services" element={
            <MainLayout>
              <Services />
            </MainLayout>
          } />
          
          <Route path="/highlights" element={
            <MainLayout>
              <HighlightsSection />
            </MainLayout>
          } />

          {/* Auth routes */}
          <Route path="/login" element={
            <AuthLayout>
              <Login />
            </AuthLayout>
          } />
          
          <Route path="/signup" element={
            <AuthLayout>
              <Signup />
            </AuthLayout>
          } />

          {/* Protected routes */}
          <Route path="/profilecreation" element={
            <ProtectedRoute>
              <DashboardLayout>
                <ProfileCreation />
              </DashboardLayout>
            </ProtectedRoute>
          } />
          
          <Route path="/profiledata" element={
            <ProtectedRoute>
              <DashboardLayout>
                <ProfileData />
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

          {/* Catch all route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;