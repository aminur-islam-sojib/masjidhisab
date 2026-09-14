"use client";

import React, { useState } from "react";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
 

const ConfirmationModalView: React.FC = () => {
  const [isLogoutOpen, setIsLogoutOpen] = useState(false);
 
  const handleLogout = () => {
    // Handle logout action
    alert("Logged out successfully!");
    setIsLogoutOpen(false);
  };
 
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-3">
    
        <Button
          onClick={() => setIsLogoutOpen(true)}
          variant="default"
          
        >
          Logout
        </Button>
  
      </div>

      

      {/* Logout Confirmation Modal */}
      <Modal
        open={isLogoutOpen}
        onClose={() => setIsLogoutOpen(false)}
        title="Confirm Logout"
        
      >
        <div className="space-y-4">
          <div className="flex items-center space-x-3">
            <div className="shrink-0">
              <svg
                className="h-10 w-10 text-orange-500"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75"
                />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                Logout Confirmation
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Are you sure you want to logout? You will need to sign in again
                to access your account.
              </p>
            </div>
          </div>

          <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-md p-3">
            <p className="text-sm text-orange-700 dark:text-orange-300">
              Any unsaved changes will be lost. Make sure to save your work
              before logging out.
            </p>
          </div>

          <div className="flex justify-end space-x-3">
            <Button onClick={() => setIsLogoutOpen(false)} variant="outline">
              Stay Logged In
            </Button>
            <Button
              onClick={handleLogout}
              variant="default"
              className="bg-orange-500 hover:bg-orange-600"
            >
              Logout
            </Button>
          </div>
        </div>
      </Modal>

    
    </div>
  );
};

export default ConfirmationModalView;
