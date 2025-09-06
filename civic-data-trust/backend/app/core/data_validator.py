import pandas as pd
import numpy as np
from typing import Dict, List, Tuple, Optional, Any
from dataclasses import dataclass
from enum import Enum


class ValidationLevel(Enum):
    """Validation severity levels"""
    INFO = "info"
    WARNING = "warning"
    ERROR = "error"
    CRITICAL = "critical"


@dataclass
class ValidationResult:
    """Result of data validation check"""
    level: ValidationLevel
    message: str
    column: Optional[str] = None
    details: Optional[Dict[str, Any]] = None


class DataValidator:
    """Comprehensive data validator for research-grade analytics"""
    
    # Expected schema for matplotlib_test_data.csv
    EXPECTED_SCHEMA = {
        'month': {'type': 'object', 'required': True, 'description': 'Month names'},
        'sales_revenue': {'type': 'numeric', 'required': True, 'min': 0, 'description': 'Sales revenue in currency'},
        'marketing_spend': {'type': 'numeric', 'required': True, 'min': 0, 'description': 'Marketing expenditure'},
        'customer_count': {'type': 'numeric', 'required': True, 'min': 0, 'description': 'Number of customers'},
        'conversion_rate': {'type': 'numeric', 'required': True, 'min': 0, 'max': 100, 'description': 'Conversion rate percentage'},
        'avg_order_value': {'type': 'numeric', 'required': True, 'min': 0, 'description': 'Average order value'},
        'website_visits': {'type': 'numeric', 'required': True, 'min': 0, 'description': 'Website visit count'}
    }
    
    def __init__(self):
        self.validation_results: List[ValidationResult] = []
        
    def validate_dataframe(self, df: pd.DataFrame, schema: Optional[Dict] = None) -> List[ValidationResult]:
        """Comprehensive validation of DataFrame for research analytics"""
        self.validation_results = []
        schema = schema or self.EXPECTED_SCHEMA
        
        # Basic structure validation
        self._validate_structure(df, schema)
        
        # Data quality validation
        self._validate_data_quality(df, schema)
        
        # Statistical validation
        self._validate_statistical_properties(df, schema)
        
        # Research-specific validation
        self._validate_research_requirements(df, schema)
        
        return self.validation_results
    
    def _validate_structure(self, df: pd.DataFrame, schema: Dict) -> None:
        """Validate DataFrame structure against expected schema"""
        
        # Check if DataFrame is empty
        if df.empty:
            self.validation_results.append(ValidationResult(
                level=ValidationLevel.CRITICAL,
                message="DataFrame is empty - no data to analyze"
            ))
            return
            
        # Check minimum row count for statistical analysis
        if len(df) < 5:
            self.validation_results.append(ValidationResult(
                level=ValidationLevel.WARNING,
                message=f"Dataset has only {len(df)} rows - may be insufficient for robust analysis",
                details={'row_count': len(df), 'recommended_minimum': 10}
            ))
        
        # Check for required columns
        missing_columns = []
        for col_name, col_spec in schema.items():
            if col_spec.get('required', False) and col_name not in df.columns:
                missing_columns.append(col_name)
                
        if missing_columns:
            self.validation_results.append(ValidationResult(
                level=ValidationLevel.ERROR,
                message=f"Missing required columns: {', '.join(missing_columns)}",
                details={'missing_columns': missing_columns, 'available_columns': list(df.columns)}
            ))
            
        # Check for unexpected columns
        unexpected_columns = [col for col in df.columns if col not in schema]
        if unexpected_columns:
            self.validation_results.append(ValidationResult(
                level=ValidationLevel.INFO,
                message=f"Additional columns found: {', '.join(unexpected_columns)}",
                details={'unexpected_columns': unexpected_columns}
            ))
    
    def _validate_data_quality(self, df: pd.DataFrame, schema: Dict) -> None:
        """Validate data quality for each column"""
        
        for col_name, col_spec in schema.items():
            if col_name not in df.columns:
                continue
                
            column = df[col_name]
            
            # Check data types
            expected_type = col_spec.get('type')
            if expected_type == 'numeric':
                if not pd.api.types.is_numeric_dtype(column):
                    self.validation_results.append(ValidationResult(
                        level=ValidationLevel.ERROR,
                        message=f"Column '{col_name}' should be numeric but found {column.dtype}",
                        column=col_name,
                        details={'expected_type': 'numeric', 'actual_type': str(column.dtype)}
                    ))
                    continue
                    
            # Check for missing values
            missing_count = column.isnull().sum()
            if missing_count > 0:
                missing_percentage = (missing_count / len(column)) * 100
                level = ValidationLevel.WARNING if missing_percentage < 10 else ValidationLevel.ERROR
                
                self.validation_results.append(ValidationResult(
                    level=level,
                    message=f"Column '{col_name}' has {missing_count} missing values ({missing_percentage:.1f}%)",
                    column=col_name,
                    details={'missing_count': missing_count, 'missing_percentage': missing_percentage}
                ))
                
            # Check value ranges for numeric columns
            if expected_type == 'numeric' and pd.api.types.is_numeric_dtype(column):
                non_null_values = column.dropna()
                
                if 'min' in col_spec:
                    min_violations = (non_null_values < col_spec['min']).sum()
                    if min_violations > 0:
                        self.validation_results.append(ValidationResult(
                            level=ValidationLevel.ERROR,
                            message=f"Column '{col_name}' has {min_violations} values below minimum ({col_spec['min']})",
                            column=col_name,
                            details={'min_expected': col_spec['min'], 'violations': min_violations}
                        ))
                        
                if 'max' in col_spec:
                    max_violations = (non_null_values > col_spec['max']).sum()
                    if max_violations > 0:
                        self.validation_results.append(ValidationResult(
                            level=ValidationLevel.ERROR,
                            message=f"Column '{col_name}' has {max_violations} values above maximum ({col_spec['max']})",
                            column=col_name,
                            details={'max_expected': col_spec['max'], 'violations': max_violations}
                        ))
    
    def _validate_statistical_properties(self, df: pd.DataFrame, schema: Dict) -> None:
        """Validate statistical properties for research quality"""
        
        numeric_columns = [col for col, spec in schema.items() 
                          if spec.get('type') == 'numeric' and col in df.columns]
        
        for col_name in numeric_columns:
            column = df[col_name].dropna()
            
            if len(column) == 0:
                continue
                
            # Check for constant values (no variance)
            if column.nunique() == 1:
                self.validation_results.append(ValidationResult(
                    level=ValidationLevel.WARNING,
                    message=f"Column '{col_name}' has constant values - no variance for analysis",
                    column=col_name,
                    details={'unique_values': 1, 'constant_value': column.iloc[0]}
                ))
                continue
                
            # Check for extreme outliers using IQR method
            Q1 = column.quantile(0.25)
            Q3 = column.quantile(0.75)
            IQR = Q3 - Q1
            
            if IQR > 0:  # Avoid division by zero
                lower_bound = Q1 - 3 * IQR
                upper_bound = Q3 + 3 * IQR
                
                outliers = ((column < lower_bound) | (column > upper_bound)).sum()
                if outliers > 0:
                    outlier_percentage = (outliers / len(column)) * 100
                    level = ValidationLevel.INFO if outlier_percentage < 5 else ValidationLevel.WARNING
                    
                    self.validation_results.append(ValidationResult(
                        level=level,
                        message=f"Column '{col_name}' has {outliers} potential outliers ({outlier_percentage:.1f}%)",
                        column=col_name,
                        details={
                            'outlier_count': outliers,
                            'outlier_percentage': outlier_percentage,
                            'bounds': {'lower': lower_bound, 'upper': upper_bound}
                        }
                    ))
            
            # Check for sufficient variance
            coefficient_of_variation = column.std() / column.mean() if column.mean() != 0 else 0
            if coefficient_of_variation < 0.01:  # Less than 1% variation
                self.validation_results.append(ValidationResult(
                    level=ValidationLevel.WARNING,
                    message=f"Column '{col_name}' has very low variance (CV: {coefficient_of_variation:.4f})",
                    column=col_name,
                    details={'coefficient_of_variation': coefficient_of_variation}
                ))
    
    def _validate_research_requirements(self, df: pd.DataFrame, schema: Dict) -> None:
        """Validate specific requirements for research-grade analysis"""
        
        # Check sample size adequacy
        sample_size = len(df)
        if sample_size < 30:
            self.validation_results.append(ValidationResult(
                level=ValidationLevel.WARNING,
                message=f"Sample size ({sample_size}) may be insufficient for robust statistical analysis",
                details={'sample_size': sample_size, 'recommended_minimum': 30}
            ))
            
        # Check for temporal consistency (if month column exists)
        if 'month' in df.columns:
            month_col = df['month']
            expected_months = [
                'January', 'February', 'March', 'April', 'May', 'June',
                'July', 'August', 'September', 'October', 'November', 'December'
            ]
            
            # Check if all months are present
            missing_months = set(expected_months) - set(month_col.values)
            if missing_months:
                self.validation_results.append(ValidationResult(
                    level=ValidationLevel.INFO,
                    message=f"Missing months in dataset: {', '.join(sorted(missing_months))}",
                    column='month',
                    details={'missing_months': list(missing_months)}
                ))
                
            # Check for duplicate months
            duplicate_months = month_col[month_col.duplicated()].unique()
            if len(duplicate_months) > 0:
                self.validation_results.append(ValidationResult(
                    level=ValidationLevel.WARNING,
                    message=f"Duplicate months found: {', '.join(duplicate_months)}",
                    column='month',
                    details={'duplicate_months': list(duplicate_months)}
                ))
        
        # Check correlation structure for multivariate analysis
        numeric_columns = df.select_dtypes(include=[np.number]).columns
        if len(numeric_columns) >= 2:
            correlation_matrix = df[numeric_columns].corr()
            
            # Check for perfect correlations (excluding diagonal)
            perfect_corr_pairs = []
            for i in range(len(correlation_matrix.columns)):
                for j in range(i+1, len(correlation_matrix.columns)):
                    corr_value = abs(correlation_matrix.iloc[i, j])
                    if corr_value > 0.99:  # Near-perfect correlation
                        col1, col2 = correlation_matrix.columns[i], correlation_matrix.columns[j]
                        perfect_corr_pairs.append((col1, col2, corr_value))
                        
            if perfect_corr_pairs:
                self.validation_results.append(ValidationResult(
                    level=ValidationLevel.WARNING,
                    message=f"High correlations detected between variables (may indicate multicollinearity)",
                    details={'high_correlations': perfect_corr_pairs}
                ))
    
    def validate_matplotlib_test_data(self, df: pd.DataFrame) -> Dict[str, Any]:
        """Specific validation for matplotlib_test_data.csv format"""
        validation_results = self.validate_dataframe(df, self.EXPECTED_SCHEMA)
        
        # Additional matplotlib-specific checks
        matplotlib_results = []
        
        # Check if data is suitable for time series visualization
        if 'month' in df.columns and len(df) == 12:
            matplotlib_results.append(ValidationResult(
                level=ValidationLevel.INFO,
                message="Dataset appears to be complete annual time series - excellent for trend analysis",
                details={'time_series_complete': True, 'periods': 12}
            ))
        
        # Check if numeric ranges are suitable for visualization
        numeric_cols = df.select_dtypes(include=[np.number]).columns
        for col in numeric_cols:
            col_range = df[col].max() - df[col].min()
            col_mean = df[col].mean()
            
            if col_range / col_mean > 10:  # High dynamic range
                matplotlib_results.append(ValidationResult(
                    level=ValidationLevel.INFO,
                    message=f"Column '{col}' has high dynamic range - consider log scaling for visualization",
                    column=col,
                    details={'dynamic_range_ratio': col_range / col_mean}
                ))
        
        # Combine all results
        all_results = validation_results + matplotlib_results
        
        # Generate summary
        summary = {
            'total_checks': len(all_results),
            'critical_issues': len([r for r in all_results if r.level == ValidationLevel.CRITICAL]),
            'errors': len([r for r in all_results if r.level == ValidationLevel.ERROR]),
            'warnings': len([r for r in all_results if r.level == ValidationLevel.WARNING]),
            'info': len([r for r in all_results if r.level == ValidationLevel.INFO]),
            'validation_passed': len([r for r in all_results if r.level in [ValidationLevel.CRITICAL, ValidationLevel.ERROR]]) == 0,
            'results': [{
                'level': r.level.value,
                'message': r.message,
                'column': r.column,
                'details': r.details
            } for r in all_results]
        }
        
        return summary
    
    def get_data_quality_score(self, validation_summary: Dict[str, Any]) -> float:
        """Calculate overall data quality score (0-100)"""
        total_checks = validation_summary['total_checks']
        if total_checks == 0:
            return 100.0
            
        # Weight different issue types
        weights = {
            'critical_issues': -50,
            'errors': -20,
            'warnings': -5,
            'info': 0
        }
        
        penalty = sum(validation_summary[issue_type] * weight 
                     for issue_type, weight in weights.items())
        
        # Calculate score (minimum 0, maximum 100)
        score = max(0, min(100, 100 + penalty))
        return score
    
    def generate_recommendations(self, validation_summary: Dict[str, Any]) -> List[str]:
        """Generate actionable recommendations based on validation results"""
        recommendations = []
        
        if validation_summary['critical_issues'] > 0:
            recommendations.append("🚨 Critical issues detected - data cannot be processed safely")
            
        if validation_summary['errors'] > 0:
            recommendations.append("❌ Data errors found - clean data before analysis")
            
        if validation_summary['warnings'] > 0:
            recommendations.append("⚠️ Data quality warnings - review before proceeding with analysis")
            
        # Specific recommendations based on results
        for result in validation_summary['results']:
            if result['level'] == 'error' and 'missing_columns' in (result['details'] or {}):
                recommendations.append(f"📋 Add missing columns: {', '.join(result['details']['missing_columns'])}")
                
            if result['level'] == 'warning' and 'missing_percentage' in (result['details'] or {}):
                if result['details']['missing_percentage'] > 20:
                    recommendations.append(f"🔧 Address high missing data rate in '{result['column']}' column")
                    
            if result['level'] == 'warning' and 'outlier_percentage' in (result['details'] or {}):
                if result['details']['outlier_percentage'] > 10:
                    recommendations.append(f"📊 Investigate outliers in '{result['column']}' column")
        
        if not recommendations:
            recommendations.append("✅ Data quality is excellent - ready for research-grade analysis")
            
        return recommendations


# Utility functions for easy integration
def validate_csv_for_matplotlib(csv_content: str) -> Dict[str, Any]:
    """Quick validation function for CSV content"""
    try:
        import io
        df = pd.read_csv(io.StringIO(csv_content))
        validator = DataValidator()
        return validator.validate_matplotlib_test_data(df)
    except Exception as e:
        return {
            'validation_passed': False,
            'error': str(e),
            'total_checks': 0,
            'critical_issues': 1,
            'errors': 0,
            'warnings': 0,
            'info': 0,
            'results': [{
                'level': 'critical',
                'message': f"Failed to parse CSV: {str(e)}",
                'column': None,
                'details': None
            }]
        }


def validate_dataframe_for_research(df: pd.DataFrame) -> Dict[str, Any]:
    """Quick validation function for DataFrame"""
    validator = DataValidator()
    return validator.validate_matplotlib_test_data(df)