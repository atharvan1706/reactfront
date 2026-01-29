// frontend/src/services/dashboardService.js - FIXED VERSION
const API_URL = import.meta.env.VITE_API_URL || 'http://13.232.81.24:3001/api';

// Helper function to safely extract plantId from user object
const getPlantId = (user) => {
  if (!user) {
    console.error('❌ No user object provided');
    return null;
  }
  
  if (user.plantId) {
    return user.plantId;
  }
  
  if (user.plantAccess && Array.isArray(user.plantAccess) && user.plantAccess.length > 0) {
    return user.plantAccess[0].plantId;
  }
  
  console.error('❌ No plantId found in user object:', user);
  return null;
};

class DashboardService {
  getAuthHeaders() {
    const token = localStorage.getItem('token');
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };
  }

  async getAllDashboards() {
    try {
      const response = await fetch(`${API_URL}/dashboards`, {
        method: 'GET',
        headers: this.getAuthHeaders()
      });

      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.message || 'Failed to fetch dashboards');
      }

      return data.dashboards;
    } catch (error) {
      console.error('Error fetching dashboards:', error);
      throw error;
    }
  }

  async getDashboard(dashboardId) {
    try {
      const response = await fetch(`${API_URL}/dashboards/${dashboardId}`, {
        method: 'GET',
        headers: this.getAuthHeaders()
      });

      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.message || 'Failed to fetch dashboard');
      }

      return data.dashboard;
    } catch (error) {
      console.error('Error fetching dashboard:', error);
      throw error;
    }
  }

  async createDashboard(name, plantId, panels = [], isDefault = false) {
    try {
      const response = await fetch(`${API_URL}/dashboards`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify({ name, plantId, panels, isDefault })
      });

      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.message || 'Failed to create dashboard');
      }

      return data.dashboard;
    } catch (error) {
      console.error('Error creating dashboard:', error);
      throw error;
    }
  }

  async updateDashboard(dashboardId, updates) {
    try {
      const response = await fetch(`${API_URL}/dashboards/${dashboardId}`, {
        method: 'PUT',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(updates)
      });

      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.message || 'Failed to update dashboard');
      }

      return data.dashboard;
    } catch (error) {
      console.error('Error updating dashboard:', error);
      throw error;
    }
  }

  async deleteDashboard(dashboardId) {
    try {
      const response = await fetch(`${API_URL}/dashboards/${dashboardId}`, {
        method: 'DELETE',
        headers: this.getAuthHeaders()
      });

      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.message || 'Failed to delete dashboard');
      }

      return data;
    } catch (error) {
      console.error('Error deleting dashboard:', error);
      throw error;
    }
  }

  async updatePanels(dashboardId, panels) {
    try {
      const response = await fetch(`${API_URL}/dashboards/${dashboardId}/panels`, {
        method: 'PATCH',
        headers: this.getAuthHeaders(),
        body: JSON.stringify({ panels })
      });

      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.message || 'Failed to update panels');
      }

      return data.dashboard;
    } catch (error) {
      console.error('Error updating panels:', error);
      throw error;
    }
  }

  // Sync dashboards between localStorage and MongoDB - FIXED VERSION
  async syncDashboards() {
    try {
      // Get dashboards from MongoDB
      const remoteDashboards = await this.getAllDashboards();
      
      // Get local dashboards
      const localDashboards = JSON.parse(localStorage.getItem('miralys_dashboards') || '[]');
      
      // If remote is empty but local has data, push local to remote
      if (remoteDashboards.length === 0 && localDashboards.length > 0) {
        const user = JSON.parse(localStorage.getItem('user'));
        const plantId = getPlantId(user); // ✅ FIXED: Use helper function
        
        if (plantId) {
          console.log('📤 Migrating local dashboards to MongoDB for plant:', plantId);
          for (const dashboard of localDashboards) {
            await this.createDashboard(
              dashboard.name,
              plantId,
              dashboard.panels,
              false
            );
          }
          
          // Fetch updated remote dashboards
          const updatedRemote = await this.getAllDashboards();
          console.log('✅ Migration complete:', updatedRemote.length, 'dashboards');
          return updatedRemote;
        } else {
          console.error('❌ Cannot migrate: no plantId found');
        }
      }
      
      // Otherwise, use remote as source of truth
      console.log('📥 Using remote dashboards:', remoteDashboards.length);
      return remoteDashboards;
    } catch (error) {
      console.error('Error syncing dashboards:', error);
      // Fallback to localStorage if sync fails
      const fallback = JSON.parse(localStorage.getItem('miralys_dashboards') || '[]');
      console.log('⚠️  Falling back to localStorage:', fallback.length, 'dashboards');
      return fallback;
    }
  }
}

const dashboardService = new DashboardService();
export default dashboardService;
