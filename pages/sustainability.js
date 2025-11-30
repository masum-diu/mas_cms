import React from "react";
import CrmLayout from "./components/CrmLayout";
import Sustenability from "./components/Sustenability";

const AboutPage  = () => {
  return (
    // <ProtectedRoute>
      <CrmLayout>
        <Sustenability />
      </CrmLayout>
    // </ProtectedRoute>
  );
};

export default AboutPage;
