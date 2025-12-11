/**
 * Reset Page Component
 * Clears all local storage and redirects to landing
 */

import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Droplets } from "lucide-react";

const Reset = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Clear all storage
    localStorage.clear();
    sessionStorage.clear();
    
    // Redirect to landing after a short delay
    setTimeout(() => {
      navigate("/", { replace: true });
    }, 500);
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-primary flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin mb-4 flex justify-center">
          <Droplets className="h-12 w-12 text-white" />
        </div>
        <p className="text-white text-lg">Clearing data...</p>
      </div>
    </div>
  );
};

export default Reset;
