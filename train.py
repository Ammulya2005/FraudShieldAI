#Train and evaluate multipl
import os
import joblib
import pandas as pd
import sklearn
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder, StandardScaler
from sklearn.metrics import accuracy_score, classification_report, confusion_matrix
from sklearn.linear_model import LogisticRegression
from sklearn.tree import DecisionTreeClassifier
from sklearn.ensemble import RandomForestClassifier, IsolationForest
from sklearn.neighbors import KNeighborsClassifier
from sklearn.svm import SVC
from xgboost import XGBClassifier
df = pd.read_csv(r"backend\ML\data\processed\balanced_creditcard_new.csv")
print("Dataset Loaded Successfully")
print("Shape:", df.shape)
print("\nFraud Label Count:")
print(df["Fraud_Label"].value_counts())
drop_columns = ["Transaction_ID", "User_ID", "Timestamp"]
for col in drop_columns:
    if col in df.columns:
        df.drop(col, axis=1, inplace=True)
# Separate features and target
X = df.drop("Fraud_Label", axis=1)
y = df["Fraud_Label"]

# Identify categorical columns
categorical_cols = X.select_dtypes(include=['object', 'string']).columns

# Encode ALL categorical columns safely
from sklearn.preprocessing import LabelEncoder

for col in categorical_cols:
    le = LabelEncoder()
    X[col] = le.fit_transform(X[col].astype(str))

X = X.apply(pd.to_numeric, errors='coerce')
X.fillna(0, inplace=True)
X = X.astype('float32')

os.makedirs("backend\\models", exist_ok=True)
joblib.dump(X.columns.tolist(), "backend\\models\\columns.pkl")
X_train, X_test, y_train, y_test = train_test_split(
    X, y,
    test_size=0.2,
    random_state=42,
    stratify=y
)
scaler = StandardScaler()
X_train_scaled = scaler.fit_transform(X_train)
X_test_scaled = scaler.transform(X_test)
joblib.dump(scaler, "backend\\models\\scaler.pkl")
models = {
    "Logistic Regression": LogisticRegression(max_iter=1000),
    "Decision Tree": DecisionTreeClassifier(random_state=42),
    "Random Forest": RandomForestClassifier(n_estimators=100, random_state=42),
    "KNN": KNeighborsClassifier(n_neighbors=5),
    "SVM": SVC(kernel="rbf", probability=True),
    "XGBoost": XGBClassifier(n_estimators=100, random_state=42)
}
results = {}
print("\nTraining Supervised ML Models...\n")
for name, model in models.items():
    print("=" * 50)
    print("Training:", name)
    if name in ["Logistic Regression", "KNN", "SVM"]:
        model.fit(X_train_scaled, y_train)
        y_pred = model.predict(X_test_scaled)
    else:
        model.fit(X_train, y_train)
        y_pred = model.predict(X_test)
    accuracy = accuracy_score(y_test, y_pred)
    results[name] = accuracy
    print("Accuracy:", round(accuracy * 100, 2), "%")
    print("\nClassification Report:")
    print(classification_report(y_test, y_pred))
    print("Confusion Matrix:")
    print(confusion_matrix(y_test, y_pred))
    joblib.dump(model, f"backend\\models\\{name.replace(' ', '_').lower()}.pkl")
print("=" * 50)
print("Training Isolation Forest for Anomaly Detection")
isolation_model = IsolationForest(
    n_estimators=100,
    contamination=0.5,
    random_state=42
)
isolation_model.fit(X_train_scaled)
iso_pred = isolation_model.predict(X_test_scaled)
iso_pred = [0 if pred == 1 else 1 for pred in iso_pred]
iso_accuracy = accuracy_score(y_test, iso_pred)
results["Isolation Forest"] = iso_accuracy
print("Isolation Forest Accuracy:", round(iso_accuracy * 100, 2), "%")
print("\nClassification Report:")
print(classification_report(y_test, iso_pred))
print("Confusion Matrix:")
print(confusion_matrix(y_test, iso_pred))
joblib.dump(isolation_model, "backend\\models\\isolation_forest.pkl")
best_model_name = max(results, key=results.get)
best_accuracy = results[best_model_name]
print("\n" + "=" * 50)
print("MODEL COMPARISON RESULTS")
print("=" * 50)
for model_name, acc in results.items():
    print(f"{model_name}: {round(acc * 100, 2)}%")
print("\nBest Model:", best_model_name)
print("Best Accuracy:", round(best_accuracy * 100, 2), "%")
results_df = pd.DataFrame({
    "Model": list(results.keys()),
    "Accuracy": [round(acc * 100, 2) for acc in results.values()]
})
results_df.to_csv("backend\\models\\model_comparison.csv", index=False)
print("\nAll models saved inside backend\\models\\")
print("Model comparison saved as backend\\models\\model_comparison.csv")