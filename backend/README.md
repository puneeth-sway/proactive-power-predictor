
# Predictive Maintenance API

This is the backend API for the predictive maintenance application.

## Setup

1. Create a virtual environment (optional but recommended):
   ```
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

2. Install dependencies:
   ```
   pip install -r requirements.txt
   ```

3. Run the application:
   ```
   python app.py
   ```

The API will be available at http://localhost:5000.

## API Endpoints

- `GET /api/products` - Get all products
- `GET /api/products/<product_id>` - Get a specific product
- `GET /api/products/<product_id>/recommendations` - Get maintenance recommendations for a product
- `GET /api/predict/<product_id>` - Get predictive maintenance data for a product
- `POST /api/initialize` - Initialize the database with sample data

## Data Storage

The application stores data in JSON files in the `data` directory:
- `products.json` - Product data
- `maintenance_recommendations.json` - Maintenance recommendations

## Integration with Frontend

To integrate with the React frontend, update the API URLs in your frontend code to point to this backend. For local development, the base URL would be `http://localhost:5000/api`.
