import React from "react";
import CrmLayout from "./components/CrmLayout";
import ProtectedRoute from "./components/ProtectedRoute";

const about = () => {
  return (
    // <ProtectedRoute>
      <CrmLayout>
        <h1>About Us</h1>
        <p>This is the about page of our CRM application.</p>
        <p>Here you can find information about our company and services.</p>
        <p>Contact us for more details!</p>
      </CrmLayout>
    // </ProtectedRoute>
  );
};

export default about;
