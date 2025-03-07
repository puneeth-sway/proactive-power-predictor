
from flask import Flask
from flask_cors import CORS
import os
import json
from models import init_db
from routes.product_routes import product_bp
from routes.contractor_routes import contractor_bp
from routes.notification_routes import notification_bp
from routes.db_init_routes import db_init_bp

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Initialize database
DB_PATH = 'sqlite:///data.db'
engine = init_db(DB_PATH)

# Register blueprints
app.register_blueprint(product_bp, url_prefix='/api')
app.register_blueprint(contractor_bp, url_prefix='/api')
app.register_blueprint(notification_bp, url_prefix='/api')
app.register_blueprint(db_init_bp, url_prefix='/api')

if __name__ == '__main__':
    # Create data directory if it doesn't exist (for SQLite database)
    os.makedirs('data', exist_ok=True)
    
    # Start the server
    app.run(debug=True, port=5000)
