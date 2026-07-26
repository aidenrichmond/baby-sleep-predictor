from sklearn.linear_model import LinearRegression
import pandas as pd
import numpy as np

# Features:
df = pd.read_csv("./baby_data.csv")

X = [
    #[Previous sleep duration, Awake duration (Including feeding: sleep[1] - sleep[0]), Feed duration]
]

y = [
    #correct sleeptime
]

predictions = [
    #[Prediction, Real time, Difference]
]

df = df.sort_values("Start")

sleep_df = df[df["Type"] == "Sleep"].copy()
feed_df = df[df["Type"] == "Feed"].copy()

sleep_df["Start"] = pd.to_datetime(df["Start"])
sleep_df["End"] = pd.to_datetime(df["End"])
feed_df["Start"] = pd.to_datetime(df["Start"])
feed_df["End"] = pd.to_datetime(df["End"])

model = LinearRegression()

print(sleep_df)
for i in range(len(sleep_df) - 1):
    feeds = feed_df[
        (feed_df["Start"] >= sleep_df.iloc[i]["Start"]) &
        (feed_df["Start"] <= sleep_df.iloc[i+1]["End"])
    ]

    if len(feeds) > 0:
        feed_duration = (
            feeds["Duration"]
            .apply(lambda x: pd.to_timedelta(x + ":00").total_seconds() / 60)
            .sum()
        )
    else:
        feed_duration = 0.0

    sleep_duration = sleep_df.iloc[i]["Duration"]

    awake_duration = sleep_df.iloc[i+1]["Start"] - sleep_df.iloc[i]["End"]
    
    #converted to int so model can understand
    new_data = [pd.to_timedelta(sleep_duration + ":00").total_seconds() / 60, awake_duration.total_seconds() / 60, feed_duration]

    next_sleep_duration = sleep_df.iloc[i+1]["Duration"]

    if X:
        model.fit(X,y)
        prediction = model.predict([new_data])
        real_time = pd.to_timedelta(next_sleep_duration + ":00").total_seconds() / 60
        diff = prediction - real_time
        predictions.append([prediction, real_time, diff])

    X.append(new_data)
    y.append(
        pd.to_timedelta(next_sleep_duration + ":00").total_seconds() / 60
    )

print(f"Predictions: {predictions}")
print(9999989898989898989898989898)
print(f"baby_data: {X}")
print(9898989898989898989898989898989898989898989898989898989898123456789009876543211234567876543)
differences = [x[2] for x in predictions]
errors = np.array([x[0] for x in differences])

print("MAE:", np.mean(np.abs(errors)))
print("Average error:", np.mean(errors))
print("Best:", np.min(np.abs(errors)))
print("Worst:", np.max(np.abs(errors)))
