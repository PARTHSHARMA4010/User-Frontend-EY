import axios from 'axios';

// ==========================================
// 1. CONFIGURATION
// ==========================================

// YOUR Backend (For Dashboard, Auth, & Saving Logs)
// ✅ Use this for the Live App:
const API_URL = "https://carapi-2goc.onrender.com";
// 🛠️ Use this if testing locally on your laptop:
// const API_URL = "http://127.0.0.1:8000";

// TEAMMATE'S Backend (For Booking Service)
const TEAMMATE_API_URL = "https://booking-and-log-service-ey.onrender.com/book-service";


// ==========================================
// 2. API FUNCTIONS
// ==========================================
export const api = {
  
  // --- A. AUTHENTICATION & DASHBOARD ---

  // 1. Login
  login: async (userId: string, phone: string) => {
    try {
      const response = await axios.get(`${API_URL}/get-dashboard/${userId}`);
      if (response.data && response.data.user_profile.phone === phone) {
        return { success: true, user: response.data.user_profile };
      } else {
        return { success: false, message: "Invalid Phone Number" };
      }
    } catch (error) {
      console.error("Login Error:", error);
      return { success: false, message: "User ID not found or Server Error" };
    }
  },

  // 2. Get Dashboard Data
  getDashboard: async (userId: string) => {
    try {
      const response = await axios.get(`${API_URL}/get-dashboard/${userId}`);
      return response.data;
    } catch (error) {
      console.error("API Error (Dashboard):", error);
      return null;
    }
  },

  // --- B. VEHICLE MANAGEMENT ---

  // 3. Add Vehicle (For future use)
  addVehicle: async (vehicleData: any) => {
    try {
      const response = await axios.post(`${API_URL}/add-vehicle`, vehicleData);
      return response.data;
    } catch (error) {
      console.error("API Error (Add Vehicle):", error);
      return null;
    }
  },

  // 4. Update Sensor (For Simulation Button)
  updateSensor: async (vehicleId: string, updates: any) => {
    try {
      const response = await axios.post(`${API_URL}/update-sensor`, {
        vehicleId: vehicleId,
        updates: updates
      });
      return response.data;
    } catch (error) {
      console.error("API Error (Update Sensor):", error);
      return null;
    }
  },

  // --- C. BOOKING & HISTORY (NEW FEATURES) ---

  // 5. Send Booking Request (To Teammate's API)
  bookService: async (bookingData: any) => {
    try {
      console.log("📡 Sending Booking Request to Teammate...");
      
      // CALL TEAMMATE'S API
      const response = await axios.post(TEAMMATE_API_URL, bookingData);
      
      console.log("✅ Booking Success:", response.data);
      return { success: true, data: response.data };

    } catch (error) {
      console.error("❌ Booking Failed (Teammate API Error):", error);
      return { success: false };
    }
  },

  // 6. Save Log (To YOUR Database)
  saveLog: async (logData: any) => {
    try {
      // We save a copy of the log/booking in YOUR database history
      const response = await axios.post(`${API_URL}/add-log`, logData);
      return response.data;
    } catch (error) {
      console.error("Logging Error:", error);
      return null;
    }
  },

  // 7. Get Service History (From YOUR Database)
  getLogs: async (vehicleId: string) => {
    try {
      const response = await axios.get(`${API_URL}/get-logs/${vehicleId}`);
      return response.data;
    } catch (error) {
      console.error("Fetch Logs Error:", error);
      return [];
    }
  }
};