
import { Product, MaintenanceRecommendation, mockProducts, maintenanceRecommendations } from './mockData';

// API base URL - change to your Python backend URL
export const API_BASE_URL = 'http://localhost:5000/api';

// Flag to switch between mock data and real API
const USE_MOCK_DATA = true; // Set to false to use the Python backend

// Fetch all products
export const fetchProducts = async (): Promise<Product[]> => {
  if (USE_MOCK_DATA) {
    return mockProducts;
  }

  try {
    const response = await fetch(`${API_BASE_URL}/products`);
    if (!response.ok) {
      throw new Error('Failed to fetch products');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching products:', error);
    // Fallback to mock data if API fails
    return mockProducts;
  }
};

// Fetch a single product by ID
export const fetchProductById = async (id: string): Promise<Product | undefined> => {
  if (USE_MOCK_DATA) {
    return mockProducts.find(product => product.id === id);
  }

  try {
    const response = await fetch(`${API_BASE_URL}/products/${id}`);
    if (!response.ok) {
      throw new Error('Failed to fetch product');
    }
    return await response.json();
  } catch (error) {
    console.error(`Error fetching product ${id}:`, error);
    // Fallback to mock data if API fails
    return mockProducts.find(product => product.id === id);
  }
};

// Fetch maintenance recommendations for a product
export const fetchRecommendationsForProduct = async (productId: string): Promise<MaintenanceRecommendation[]> => {
  if (USE_MOCK_DATA) {
    const product = mockProducts.find(p => p.id === productId);
    return product ? maintenanceRecommendations.filter(rec => rec.productType === product.type) : [];
  }

  try {
    const response = await fetch(`${API_BASE_URL}/products/${productId}/recommendations`);
    if (!response.ok) {
      throw new Error('Failed to fetch recommendations');
    }
    return await response.json();
  } catch (error) {
    console.error(`Error fetching recommendations for product ${productId}:`, error);
    // Fallback to mock data if API fails
    const product = mockProducts.find(p => p.id === productId);
    return product ? maintenanceRecommendations.filter(rec => rec.productType === product.type) : [];
  }
};

// Fetch predictive maintenance data for a product
export const fetchPredictiveData = async (productId: string): Promise<any> => {
  if (USE_MOCK_DATA) {
    // Return simplified mock prediction data
    const product = mockProducts.find(p => p.id === productId);
    if (!product) return null;
    
    return {
      status: product.status,
      hoursUntilMaintenance: product.hoursUntilMaintenance,
      nextMaintenanceDate: product.nextMaintenanceDate,
      warningMessage: product.status !== 'Healthy' ? 
        `${product.name} requires maintenance attention.` : null,
      predictions: [
        {
          component: "Overall System",
          healthScore: product.performanceMetrics?.reliability || 80,
          maintenanceRecommendation: product.hoursUntilMaintenance && product.hoursUntilMaintenance < 50 ? 
            "Schedule routine maintenance" : "No immediate action needed",
          potentialIssues: product.status !== 'Healthy' ? ["Performance degradation"] : []
        }
      ]
    };
  }

  try {
    const response = await fetch(`${API_BASE_URL}/predict/${productId}`);
    if (!response.ok) {
      throw new Error('Failed to fetch predictive data');
    }
    return await response.json();
  } catch (error) {
    console.error(`Error fetching predictive data for product ${productId}:`, error);
    // Return null or simplified data if API fails
    return null;
  }
};

// Initialize the backend with our mock data
export const initializeBackend = async (): Promise<boolean> => {
  if (USE_MOCK_DATA) {
    return true; // No need to initialize when using mock data
  }

  try {
    const response = await fetch(`${API_BASE_URL}/initialize`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        products: mockProducts,
        recommendations: maintenanceRecommendations
      })
    });
    
    return response.ok;
  } catch (error) {
    console.error('Error initializing backend:', error);
    return false;
  }
};
