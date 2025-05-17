import React from "react";
import CrmLayout from "./components/CrmLayout";
import ProtectedRoute from "./components/ProtectedRoute";
import ContactSection from "./components/ContactSection";

function contact() {
  return (
    // <ProtectedRoute>
      <CrmLayout>
       <ContactSection/>
      </CrmLayout>
    // </ProtectedRoute>
  );
}

export default contact;
