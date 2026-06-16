import os
import joblib
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import accuracy_score, classification_report, confusion_matrix
from sklearn.linear_model import LogisticRegression
from sklearn.tree import DecisionTreeClassifier
from sklearn.ensemble import RandomForestClassifier, IsolationForest
from sklearn.neighbors import KNeighborsClassifier
from sklearn.svm import SVC
from xgboost import XGBClassifier
df = pd.read_csv(r"C:\FraudShieldAI\backend\dataset\balanced_creditcard_new.csv")
print("Dataset Loaded Successfully")
print("Shape:", df.shape)
print("\nFraud Label Count:")
print(df["Fraud_Label"].value_counts())
drop_columns = [
    "Transaction_ID",
    "Timestamp",
    "IP_Address",
    "GPS_Location"
]
df = df.drop(columns=[col for col in drop_columns if col in df.columns])
X = df.drop("Fraud_Label", axis=1)
y = df["Fraud_Label"]
X = pd.get_dummies(X, drop_first=True)
X = X.fillna(0)
os.makedirs(r"C:\FraudShieldAI\backend\models", exist_ok=True)
joblib.dump(X.columns.tolist(), r"C:\FraudShieldAI\backend\models\columns.pkl")
X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.2,
    random_state=42,
    stratify=y
)
scaler = StandardScaler()
X_train_scaled = scaler.fit_transform(X_train)
X_test_scaled = scaler.transform(X_test)
joblib.dump(scaler, r"C:\FraudShieldAI\backend\models\scaler.pkl")
models = {
    "Logistic Regression": LogisticRegression(max_iter=1000),
    "Decision Tree": DecisionTreeClassifier(random_state=42),
    "Random Forest": RandomForestClassifier(n_estimators=100, random_state=42, n_jobs=-1),
    "KNN": KNeighborsClassifier(n_neighbors=5),
    "SVM": SVC(kernel="rbf", probability=True),
    "XGBoost": XGBClassifier(
        n_estimators=100, 
        max_depth=5, 
        learning_rate=0.1, 
        subsample=0.8, 
        colsample_bytree=0.8, 
        eval_metric="logloss", 
        random_state=42
        )
}
results = {}
print("\nTraining All Models...\n")
for name, model in models.items():
    print("=" * 50)
    print("Training:", name)
    if name in ["Logistic Regression", "KNN", "SVM"]:
        model.fit(X_train_scaled, y_train)
        y_pred = model.predict(X_test_scaled)
    else:
        model.fit(X_train, y_train)
        y_pred = model.predict(X_test)
    acc = accuracy_score(y_test, y_pred)
    results[name] = acc
    print("Accuracy:", round(acc * 100, 2), "%")
    print(classification_report(y_test, y_pred))
    print(confusion_matrix(y_test, y_pred))
    filename = name.replace(" ", "_").lower()
    joblib.dump(model, rf"C:\FraudShieldAI\backend\models\{filename}.pkl")
print("=" * 50)
print("Training Isolation Forest")
isolation_model = IsolationForest(
    n_estimators=100,
    contamination=0.5,
    random_state=42,
    n_jobs=-1
)
isolation_model.fit(X_train_scaled)
iso_pred = isolation_model.predict(X_test_scaled)
iso_pred = [0 if x == 1 else 1 for x in iso_pred]
iso_acc = accuracy_score(y_test, iso_pred)
results["Isolation Forest"] = iso_acc
print("Isolation Forest Accuracy:", round(iso_acc * 100, 2), "%")
print(classification_report(y_test, iso_pred))
print(confusion_matrix(y_test, iso_pred))
joblib.dump(isolation_model, r"C:\FraudShieldAI\backend\models\isolation_forest.pkl")
best_model = max(results, key=results.get)
print("\nMODEL COMPARISON")
for model, acc in results.items():
    print(f"{model}: {round(acc * 100, 2)}%")
print("\nBest Model:", best_model)
print("Best Accuracy:", round(results[best_model] * 100, 2), "%")
results_df = pd.DataFrame({
    "Model": list(results.keys()),
    "Accuracy": [round(acc * 100, 2) for acc in results.values()]
})
results_df.to_csv(r"C:\FraudShieldAI\backend\models\model_comparison.csv", index=False)
print("\nAll models saved successfully.")