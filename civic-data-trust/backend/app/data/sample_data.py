import pandas as pd
from typing import Dict

def get_sample_datasets() -> Dict[str, pd.DataFrame]:
    """Get sample datasets for testing and development"""
    
    # Users dataset - Employee information
    users_data = pd.DataFrame({
        'id': [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
        'name': ['Alice Johnson', 'Bob Smith', 'Charlie Brown', 'Diana Prince', 'Eve Adams',
                'Frank Miller', 'Grace Lee', 'Henry Wong', 'Iris Chen', 'Jack Wilson'],
        'age': [25, 34, 28, 42, 31, 29, 35, 27, 33, 38],
        'salary': [50000, 75000, 60000, 90000, 65000, 58000, 82000, 55000, 70000, 78000],
        'department': ['Engineering', 'Marketing', 'Engineering', 'Management', 'Marketing',
                      'Engineering', 'Sales', 'Engineering', 'Marketing', 'Sales'],
        'years_experience': [3, 8, 4, 15, 6, 4, 10, 2, 7, 12],
        'performance_score': [8.5, 9.2, 7.8, 9.5, 8.1, 7.9, 9.0, 8.3, 8.8, 9.1]
    })
    
    # Sales dataset - Monthly sales data
    sales_data = pd.DataFrame({
        'date': pd.date_range('2024-01-01', periods=12, freq='MS'),
        'revenue': [120000, 135000, 128000, 145000, 158000, 162000,
                   175000, 168000, 182000, 195000, 188000, 210000],
        'units_sold': [1200, 1350, 1280, 1450, 1580, 1620, 1750, 1680, 1820, 1950, 1880, 2100],
        'region': ['North', 'South', 'East', 'West', 'North', 'South',
                  'East', 'West', 'North', 'South', 'East', 'West']
    })
    
    # Products dataset - Product information
    products_data = pd.DataFrame({
        'product_id': [1, 2, 3, 4, 5, 6, 7, 8],
        'product_name': ['Laptop Pro', 'Wireless Mouse', 'Keyboard Elite', 'Monitor 4K', 
                        'Tablet Mini', 'Headphones', 'Webcam HD', 'Speaker Set'],
        'category': ['Electronics', 'Accessories', 'Accessories', 'Electronics',
                    'Electronics', 'Accessories', 'Accessories', 'Electronics'],
        'price': [1299.99, 29.99, 89.99, 399.99, 499.99, 199.99, 79.99, 149.99],
        'stock_quantity': [50, 200, 150, 75, 100, 120, 80, 60],
        'rating': [4.5, 4.2, 4.7, 4.4, 4.3, 4.6, 4.1, 4.0]
    })
    
    # Customer orders dataset - Order transactions
    orders_data = pd.DataFrame({
        'order_id': [1001, 1002, 1003, 1004, 1005, 1006, 1007, 1008, 1009, 1010],
        'customer_id': [201, 202, 203, 204, 205, 201, 203, 206, 207, 202],
        'product_id': [1, 2, 3, 1, 4, 5, 2, 6, 7, 8],
        'quantity': [1, 2, 1, 1, 1, 1, 3, 1, 2, 1],
        'order_date': pd.date_range('2024-01-15', periods=10, freq='3D'),
        'order_total': [1299.99, 59.98, 89.99, 1299.99, 499.99, 499.99, 89.97, 199.99, 159.98, 149.99],
        'status': ['Delivered', 'Shipped', 'Delivered', 'Processing', 'Delivered', 
                  'Shipped', 'Delivered', 'Processing', 'Shipped', 'Delivered']
    })
    
    return {
        'users': users_data,
        'sales': sales_data,
        'products': products_data,
        'orders': orders_data
    }

# Global sample data instance
SAMPLE_DATA = get_sample_datasets()