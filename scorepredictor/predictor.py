import pandas as pd
from sklearn.linear_model import LinearRegression
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_squared_error, r2_score
from datetime import datetime
import numpy as np

# Step 1: Data collection
# http://www.howstat.com/cricket/Statistics/Players/PlayerProgressSummary_ODI.asp?PlayerID=3474
data = pd.read_csv('player_data.csv')

# Step 2: Data preprocessing
# X = data[['Match No', 'Versus', 'Ground']] # features
X = data[['Match No', 'Versus', 'Ground', 'Age']] # features
y = data['Batting Runs'] # target variable
# X['Date'] = pd.to_datetime(X['Date']) # convert date strings to datetime format
# X['Date'] = datetime.strptime(X['Date'], '%d/%m/%Y')


X = pd.get_dummies(X, columns=['Versus', 'Ground']) # one-hot encode categorical features
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.1, random_state=0) # split into training and test sets

# Step 3: Feature selection
# You can use techniques like correlation analysis, recursive feature elimination, or principal component analysis to select relevant features

# Step 4: Model training
lr = LinearRegression()
lr.fit(X_train, y_train)

# Step 5: Model evaluation
y_pred = lr.predict(X_test)
mse = mean_squared_error(y_test, y_pred)
rmse = np.sqrt(mse)
r2 = r2_score(y_test, y_pred)
print(f'Mean squared error: {mse:.2f}')
print(f'Root mean squared error: {rmse:.2f}')
print(f'R-squared: {r2:.2f}')

# # Step 6: Prediction
next_match = pd.DataFrame({
    'Match No': [data['Match No'].max() + 1],
    'Versus': ['Australia'],
    'Ground': ['Sydney Cricket Ground'],
    'Age': [12520]
})
# print(next_match)
# next_match = pd.get_dummies(next_match, columns=['Versus', 'Ground']) # one-hot encode categorical features
# print(next_match)
# next_match_pred = lr.predict(next_match)
# print(f'Predicted score for next match: {next_match_pred[0]:.2f}')
