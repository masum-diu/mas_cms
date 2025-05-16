import React from "react";
import CrmLayout from "./components/CrmLayout";
import ProtectedRoute from "./components/ProtectedRoute";

function contact() {
  return (
    // <ProtectedRoute>
      <CrmLayout>
        <h1>Contact Us</h1>
        <p>If you have any questions, feel free to reach out!</p>
        <p>Email:</p>
      </CrmLayout>
    // </ProtectedRoute>
  );
}

export default contact;
