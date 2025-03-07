
from flask import Blueprint, jsonify, request
from datetime import datetime
from models import Product, MaintenanceRecommendation, Session
from utils import calculate_predictions

product_bp = Blueprint('product_routes', __name__)

@product_bp.route('/products', methods=['GET'])
def get_products():
    session = Session()
    products = session.query(Product).all()
    result = [product.to_dict() for product in products]
    session.close()
    return jsonify(result)

@product_bp.route('/products/<product_id>', methods=['GET'])
def get_product(product_id):
    session = Session()
    product = session.query(Product).filter(Product.id == product_id).first()
    
    if product:
        result = product.to_dict()
        session.close()
        return jsonify(result)
    else:
        session.close()
        return jsonify({"error": "Product not found"}), 404

@product_bp.route('/products/<product_id>/recommendations', methods=['GET'])
def get_recommendations(product_id):
    session = Session()
    product = session.query(Product).filter(Product.id == product_id).first()
    
    if not product:
        session.close()
        return jsonify({"error": "Product not found"}), 404
    
    product_type = product.type
    recommendations = session.query(MaintenanceRecommendation).filter(
        MaintenanceRecommendation.product_type == product_type
    ).all()
    
    result = [recommendation.to_dict() for recommendation in recommendations]
    session.close()
    return jsonify(result)

@product_bp.route('/predict/<product_id>', methods=['GET'])
def predict_maintenance(product_id):
    """Predict maintenance needs based on product data"""
    session = Session()
    product = session.query(Product).filter(Product.id == product_id).first()
    
    if not product:
        session.close()
        return jsonify({"error": "Product not found"}), 404
    
    # Get recommendations for this product type
    product_type = product.type
    recommendations = session.query(MaintenanceRecommendation).filter(
        MaintenanceRecommendation.product_type == product_type
    ).all()
    
    # Convert product and recommendations to dicts for the prediction function
    product_dict = product.to_dict()
    recommendation_dicts = [rec.to_dict() for rec in recommendations]
    
    # Calculate maintenance predictions
    predictions = calculate_predictions(product_dict, recommendation_dicts)
    session.close()
    
    return jsonify(predictions)
