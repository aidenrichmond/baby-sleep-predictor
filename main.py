from sklearn.linear_model import LinearRegression
from sklearn.ensemble import RandomForestRegressor
import pandas as pd
import numpy as np

def to_minutes(x):
    if pd.isna(x) or x == "":
        return 0.0

    x = str(x)

    if len(x.split(":")) == 2:
        x += ":00"

    return pd.to_timedelta(x).total_seconds() / 60

def time_features(timestamp):
    hour = timestamp.hour + timestamp.minute / 60

    time_sin = np.sin(2 * np.pi * hour / 24)
    time_cos = np.cos(2 * np.pi * hour / 24)

    return time_sin, time_cos

def main():
    # Load data
    df = pd.read_csv("./baby_data.csv")

    # Features:
    X = [
        # [
        # previous sleep duration,
        # awake duration,
        # minutes since last feed,
        # feed_duration,
        # average nap length last 3 days,
        # time sin,
        # time cos,
        # naps today,
        # age days
        # ]
    ]

    # Labels
    y = [
        #correct sleep time
    ]

    # Predictions
    predictions = [
        #[Prediction, Real time, Difference]
    ]

    baseline_predictions = []

    # Sort data
    df = df.sort_values("Start")

    # Separate sleep and feed data
    sleep_df = df[df["Type"] == "Sleep"].copy()
    feed_df = df[df["Type"] == "Feed"].copy()

    # Remove sleep times under certain amount
    sleep_df = sleep_df[(pd.to_timedelta(sleep_df["Duration"] + ":00").dt.total_seconds() / 60).astype(int) >= 30]

    # Convert dates
    sleep_df["Start"] = pd.to_datetime(sleep_df["Start"])
    sleep_df["End"] = pd.to_datetime(sleep_df["End"])
    feed_df["Start"] = pd.to_datetime(feed_df["Start"])
    feed_df["End"] = pd.to_datetime(feed_df["End"])

    # Create Date column
    sleep_df["Date"] = sleep_df["Start"].dt.date
    feed_df["Date"] = feed_df["Start"].dt.date

    sleep_df["SleepMinutes"] = sleep_df["Duration"].apply(to_minutes)

    if len(sleep_df["Date"].unique()) < 4:
        print("Need at least 4 days of data")
        return

    model = RandomForestRegressor(
        n_estimators=100,
        random_state=42
    )

    birth_date = sleep_df["Date"].min()

    dates = sorted(sleep_df["Date"].unique())

    for i in range(len(sleep_df) - 1):

        current_date = sleep_df.iloc[i]["Date"]

        date_index = dates.index(current_date)

        if date_index < 3:
            continue

        # Current nap starts here
        current_sleep_start = sleep_df.iloc[i + 1]["Start"]

        # Find feeds before this nap
        feeds = feed_df[
            (feed_df["End"] >= sleep_df.iloc[i]["End"]) &
            (feed_df["Start"] <= current_sleep_start)
        ]

        # Get total oz from bottle, 0.0 if none
        # Convert to integer, sum all Amounts, Amounts == 0 if breast fed so nothing has to change otherwise
        #feeds["Amount"] = pd.to_numeric(feeds["Amount"], errors="coerce")
        #feed_amount = feeds[feeds["Notes"] == "Bottle"]["Amount"].sum()

        if len(feeds) > 0:
            feed_duration = feeds["Duration"].apply(to_minutes).sum()
            last_feed_end = feeds["End"].max()
        else:
            feed_duration = 0.0
            last_feed_end = current_sleep_start


        # Minutes since last feed
        minutes_since_feed = (
            current_sleep_start - last_feed_end
        ).total_seconds() / 60

        # Previous sleep duration
        sleep_duration = sleep_df.iloc[i]["Duration"]

        window = 3

        previous_days = dates[
            dates.index(current_date)-window : dates.index(current_date)
        ]

        previous_sleep_values = sleep_df[
            sleep_df["Date"].isin(previous_days)
        ]["SleepMinutes"]

        average_window_sleep = previous_sleep_values.mean()

        # Awake time between sleeps
        awake_duration = (
            sleep_df.iloc[i + 1]["Start"] -
            sleep_df.iloc[i]["End"]
        )

        # Time baby fell asleep
        sleep_start = sleep_df.iloc[i + 1]["Start"]

        time_sin, time_cos = time_features(sleep_start)

        # Number of naps already taken today before this one
        previous_naps_today = len(
            sleep_df[
                (sleep_df["Date"] == current_date) &
                (sleep_df["Start"] < current_sleep_start)
            ]
        )

        age_days = (
            current_date - birth_date
        ).days

        # Convert features to numbers
        new_data = [
            to_minutes(sleep_duration),
            awake_duration.total_seconds() / 60,
            minutes_since_feed,
            feed_duration,
            #feed_amount,
            average_window_sleep,
            time_sin,
            time_cos,
            previous_naps_today,
            age_days
        ]

        # Next sleep duration (target)
        next_sleep_duration = sleep_df.iloc[i + 1]["Duration"]

        if len(X) >= 20:
            model.fit(X, y)

            prediction = model.predict([new_data])

            real_time = to_minutes(next_sleep_duration)

            # Baseline prediction: average nap length from previous 3 days
            baseline_prediction = average_window_sleep

            baseline_diff = baseline_prediction - real_time

            baseline_predictions.append([
                baseline_prediction,
                real_time,
                baseline_diff
            ])

            diff = prediction - real_time

            predictions.append([
                prediction[0],
                real_time,
                diff[0],
                new_data
            ])

            if abs(diff[0]) > 90:
                print("BAD PREDICTION")
                print("Predicted:", prediction[0])
                print("Actual:", real_time)
                print("Features:", new_data)

        # Add training example
        X.append(new_data)

        y.append(
            to_minutes(next_sleep_duration)
        )

    errors = np.array([x[2] for x in predictions])
    baseline_errors = np.array([x[2] for x in baseline_predictions])

    print(
        "Baseline MAE:",
        np.mean(np.abs(baseline_errors))
    )

    print(
        "Random Forest MAE:",
        np.mean(np.abs(errors))
    )

    print(
        "Average error:",
        np.mean(errors)
    )

    print(
        "Best:",
        np.min(np.abs(errors))
    )

    print(
        "Worst:",
        np.max(np.abs(errors))
    )


if __name__ == "__main__":
    main()