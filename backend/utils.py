
from datetime import datetime, timedelta
import random
import json

def format_datetime(obj):
    """Convert datetime objects to ISO format strings"""
    if isinstance(obj, datetime):
        return obj.isoformat()
    return obj

def calculate_health_status(product, hours_remaining):
    """Calculate health status based on multiple factors"""
    # Get days since installation
    install_date = datetime.fromisoformat(product['installDate']) if isinstance(product['installDate'], str) else product['installDate']
    days_since_install = (datetime.now() - install_date).days
    
    # Get days since last service
    last_service_date = None
    if product.get('lastServiceDate'):
        last_service_date = datetime.fromisoformat(product['lastServiceDate']) if isinstance(product['lastServiceDate'], str) else product['lastServiceDate']
        days_since_service = (datetime.now() - last_service_date).days
    else:
        days_since_service = days_since_install
    
    # Calculate health status based on hours, time since service, etc.
    if product['totalHoursRun'] > 350 and days_since_service > 300:
        return "Critical"
    elif (product['totalHoursRun'] > 200 and days_since_service > 180) or (product['totalHoursRun'] > 300):
        return "Warning"
    else:
        return "Healthy"

def calculate_predictions(product, recommendations):
    """
    Calculate predictive maintenance information based on:
    - Usage patterns
    - Hours run
    - Manufacturer recommendations
    """
    # Get routine maintenance recommendation
    routine_rec = next((r for r in recommendations if r['maintenanceType'] == 'Routine'), None)
    
    if not routine_rec:
        return {
            "status": "No maintenance data available",
            "predictions": []
        }
    
    # Get hours interval from recommendation
    hours_interval = routine_rec.get('hoursInterval', 100)
    
    # Calculate hours until next maintenance
    hours_run = product['totalHoursRun']
    hours_remaining = max(0, hours_interval - (hours_run % hours_interval))
    
    # Calculate date of next maintenance
    # Assuming average usage of 1 hour per day
    next_maintenance_date = datetime.now() + timedelta(days=hours_remaining)
    
    # Calculate health status
    health_status = calculate_health_status(product, hours_remaining)
    
    # Generate warning message based on status
    warning_message = None
    if health_status == "Critical":
        warning_message = f"URGENT: {product['name']} requires immediate maintenance! System at risk of failure."
    elif health_status == "Warning":
        warning_message = f"ATTENTION: {product['name']} is showing signs of degradation. Schedule maintenance soon."
    elif hours_remaining < 50:
        warning_message = f"NOTIFICATION: {product['name']} will need routine maintenance in {hours_remaining} hours."
    
    # Add some randomness to predictions to simulate real-world variability
    efficiency_impact = random.randint(-5, -1) if health_status != "Healthy" else random.randint(-2, 0)
    reliability_impact = random.randint(-8, -3) if health_status == "Critical" else random.randint(-4, -1) if health_status == "Warning" else 0
    
    return {
        "status": health_status,
        "hoursUntilMaintenance": hours_remaining,
        "nextMaintenanceDate": next_maintenance_date.isoformat(),
        "warningMessage": warning_message,
        "predictions": [
            {
                "component": "Overall System",
                "healthScore": 100 + efficiency_impact + reliability_impact,
                "maintenanceRecommendation": "Schedule routine maintenance" if hours_remaining < 50 else "No immediate action needed",
                "potentialIssues": ["Performance degradation", "Reduced efficiency"] if health_status != "Healthy" else []
            },
            {
                "component": "Engine",
                "healthScore": 100 + efficiency_impact * 1.5,
                "maintenanceRecommendation": "Check oil levels and condition",
                "potentialIssues": ["Oil degradation", "Combustion inefficiency"] if health_status != "Healthy" else []
            },
            {
                "component": "Filter System",
                "healthScore": 100 + reliability_impact * 1.2,
                "maintenanceRecommendation": "Inspect air filter" if hours_run > 50 else "No action needed",
                "potentialIssues": ["Reduced airflow", "Increased fuel consumption"] if health_status != "Healthy" else []
            }
        ]
    }
