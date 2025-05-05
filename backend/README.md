# overall structure

```
backend/
├── app/
│   ├── __init__.py
│   ├── main.py
│   ├── api/
│   │   ├── __init__.py
│   │   ├── routes/
│   │   │   ├── __init__.py
│   │   │   ├── predictions.py
│   │   │   ├── commodities.py
│   │   │   └── users.py
│   │   └── dependencies.py
│   ├── core/
│   │   ├── __init__.py
│   │   ├── config.py
│   │   ├── security.py
│   │   └── logging.py
│   ├── db/
│   │   ├── __init__.py
│   │   ├── session.py
│   │   └── models/
│   │       ├── __init__.py
│   │       ├── commodity.py
│   │       └── prediction.py
│   └── services/
│       ├── __init__.py
│       └── prediction_service.py
├── ml/
│   ├── __init__.py
│   ├── data/
│   │   ├── __init__.py
│   │   ├── preprocessing.py
│   │   └── loaders.py
│   ├── models/
│   │   ├── __init__.py
│   │   ├── gemini_model.py
│   │   └── evaluation.py
│   ├── training/
│   │   ├── __init__.py
│   │   ├── train.py
│   │   └── hyperparameters.py
│   └── notebooks/
│       ├── exploratory_analysis.ipynb
│       └── model_training.ipynb
├── tests/
│   ├── __init__.py
│   ├── conftest.py
│   ├── test_api/
│   │   ├── __init__.py
│   │   └── test_predictions.py
│   └── test_ml/
│       ├── __init__.py
│       └── test_gemini_model.py
├── requirements.txt
└── Dockerfile
```