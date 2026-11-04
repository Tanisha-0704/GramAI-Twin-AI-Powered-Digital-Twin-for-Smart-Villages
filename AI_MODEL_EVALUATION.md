# AI Model Inventory and Evaluation Notes

## Scope

The current application has one registered model: the crop-health demonstration classifier. Its inventory is available to system administrators at `/admin/models`. The inventory reports unavailable training date, version, and evaluation metrics as unavailable; it does not fill these values with estimates.

## Crop-health demonstration classifier

| Field | Verified information |
|---|---|
| Prediction task | Crop-health classification |
| Algorithm | `StandardScaler` and `OneHotEncoder` preprocessing followed by `RandomForestClassifier` with 200 estimators and balanced class weights |
| Dataset | `gramai-twin-backend/ml/gramai_crop_health_synthetic.csv` |
| Dataset type | Synthetic demonstration data |
| Training date | Not recorded with the model artifact |
| Version | Not recorded with the model artifact |
| Evaluation metrics | Not retained with the artifact or API |
| Production status | Not validated for real-world agricultural decisions |

The training script creates a stratified 80/20 train/test split with a fixed random seed and prints accuracy and a classification report when run. Those output values are not stored as a versioned evaluation record. They are intentionally not reproduced here or represented as production metrics. Do not rerun training as part of deployment without reviewing the artifact change and recording the exact dataset and evaluation output.

## Rule-based screens

Flood-risk screening uses submitted rainfall thresholds; water-scarcity screening uses submitted water-percentage thresholds. These are illustrative rules, not trained models. They have no model accuracy, precision, recall, F1, MAE, RMSE, or R² score.

## Requirements before claiming validated performance

Before any real-world performance claim:

1. Document lawful data provenance, collection dates, geographic coverage, units, missing-data handling, and consent/privacy controls.
2. Separate training, tuning, and independently held-out evaluation data by time and geography where appropriate; prevent leakage between samples.
3. Record immutable dataset and artifact hashes, preprocessing, code revision, training date, model version, and evaluation protocol.
4. For classification, report task-appropriate per-class precision/recall/F1, confusion matrix, class distribution, and calibration/uncertainty analysis where justified.
5. For regression tasks, report appropriate MAE/RMSE/R² with a documented baseline and clearly scoped test set.
6. Obtain review by qualified agricultural/domain experts and evaluate performance across relevant crops, regions, seasons, and data-quality conditions.
7. Establish drift monitoring, human oversight, an appeal path, and a rollback process before operational use.

Until that work is complete, model outputs remain advisory demonstrations. They must not make or automate eligibility, funding, enforcement, or public-safety decisions.
