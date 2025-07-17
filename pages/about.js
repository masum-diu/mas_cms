import React from "react";
import CrmLayout from "./components/CrmLayout";
import AboutSection from "./components/AboutSection";

const AboutPage  = () => {
  return (
    // <ProtectedRoute>
      <CrmLayout>
        <AboutSection />
      </CrmLayout>
    // </ProtectedRoute>
  );
};

export default AboutPage;
