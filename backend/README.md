
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

## Database

The application uses SQLite for data storage. The database file is created automatically as `data.db` when you start the application.

## API Endpoints

- `GET /api/products` - Get all products
- `GET /api/products/<product_id>` - Get a specific product
- `GET /api/products/<product_id>/recommendations` - Get maintenance recommendations for a product
- `GET /api/predict/<product_id>` - Get predictive maintenance data for a product
- `GET /api/contractors` - Get all contractors
- `GET /api/contractors/<contractor_id>` - Get a specific contractor
- `GET /api/contractors/<contractor_id>/products` - Get products for a specific contractor
- `POST /api/contractors/<contractor_id>/send-notification` - Send a notification from a contractor
- `GET /api/notifications` - Get all notifications or filter by recipient
- `POST /api/initialize` - Initialize the database with sample data

## Integration with Frontend

To integrate with the React frontend, update the API URLs in your frontend code to point to this backend. For local development, the base URL would be `http://localhost:5000/api`.
