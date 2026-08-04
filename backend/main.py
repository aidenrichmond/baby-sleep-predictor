from sklearn.ensemble import RandomForestRegressor
import pandas as pd
import numpy as np

# Convert time string to minutes
def to_minutes(x):
    if pd.isna(x) or x == "":
        return 0.0

    x = str(x)

    if len(x.split(":")) == 2:
        x += ":00"

    return pd.to_timedelta(x).total_seconds() / 60

def main():
    # Load data
    df = pd.read_csv("./baby_data.csv")

    # Initialize counters for prediction accuracy
    under_fifteen = 0
    fifteen_thirty = 0
    thirty_sixty = 0
    sixty_plus = 0

    X = [
        # Features:
        # [
        # current hour,
        # previous sleep duration,
        # time between last feed and sleep,
        # total feeding duration,
        # average sleep duration over previous window
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

    # Convert Start and End columns to datetime
    df["Start"] = pd.to_datetime(df["Start"])
    df["End"] = pd.to_datetime(df["End"])

    # Separate sleep and feed data
    sleep_df = df[df["Type"] == "Sleep"].copy()
    feed_df = df[df["Type"] == "Feed"].copy()

    # Remove sleep times under certain amount
    sleep_df = sleep_df[(sleep_df["Duration"].apply(to_minutes) >= 30)]

    # Create Date column
    sleep_df["Date"] = sleep_df["Start"].dt.date

    # Convert Duration to minutes
    sleep_df["SleepMinutes"] = sleep_df["Duration"].apply(to_minutes)

    # Check if we have enough data to train the model
    window = 4
    if len(sleep_df["Date"].unique()) < window + 1:
        print(f"Need at least {window+1} days of data")
        return

    # Initialize Random Forest Regressor
    model = RandomForestRegressor(
        n_estimators=100,
        random_state=42
    )

    # Get unique dates in sorted order
    dates = sorted(sleep_df["Date"].unique())

    # Loop through sleep data to create training examples and make predictions
    for i in range(len(sleep_df) - 1):

        # Skip if we don't have enough previous days to calculate average sleep duration
        current_date = sleep_df.iloc[i]["Date"]
        date_index = dates.index(current_date)
        if date_index < window:
            continue

        # Current sleep start time
        current_sleep_start = sleep_df.iloc[i + 1]["Start"]

        # Find feeds before this nap and after the last sleep ended
        feeds = feed_df[
            (feed_df["Start"] >= sleep_df.iloc[i]["End"]) &
            (feed_df["End"] <= current_sleep_start)
        ]

        # Calculate time from last feed to current sleep start
        if len(feeds) > 0:
            last_feed_end = feeds["End"].max()

            feed_to_sleep_time = (
                current_sleep_start - last_feed_end
            ).total_seconds() / 60

            feed_duration = feeds["Duration"].apply(to_minutes).sum()
        else:
            feed_to_sleep_time = -1
            feed_duration = 0.0

        # Previous sleep duration
        sleep_duration = sleep_df.iloc[i]["Duration"]

        # Calculate average sleep duration over the previous window of days
        previous_days = dates[date_index-window:date_index]

        # Average sleep durations for the previous days
        average_window_sleep = sleep_df[
            sleep_df["Date"].isin(previous_days)
        ]["SleepMinutes"].mean()

        # Calculate average sleep duration for the current hour based on past data
        current_hour = current_sleep_start.hour

        # Get past sleep data before the current sleep start time
        past_sleep = sleep_df[
            sleep_df["Start"] < current_sleep_start
        ]

        past_sleeps = past_sleep.tail(window)

        # Create new data point for prediction, current MAE = 32.023, baseline MAE = 37.81
        new_data = [
            current_hour,
            to_minutes(sleep_duration),
            feed_to_sleep_time,
            feed_duration,
            past_sleeps["SleepMinutes"].mean(),
            average_window_sleep
        ]

        # Next sleep duration (target)
        next_sleep_duration = sleep_df.iloc[i + 1]["Duration"]

        # Train the model and make predictions if we have enough training data
        if len(X) >= 20:

            # Train the model and make predictions
            if len(predictions) % 38 == 0:
                print(f"{i // 38 * 10}% complete.")

            # Train the model on the current training data
            model.fit(X, y)
            prediction = model.predict([new_data])

            real_time = to_minutes(next_sleep_duration)

            # Baseline prediction: average nap length from previous {window} days
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

            difference = abs(diff[0])

            if difference <= 15:
                under_fifteen += 1
            elif difference <= 30:
                fifteen_thirty += 1
            elif difference <= 60:
                thirty_sixty += 1
            else:
                print("BAD PREDICTION")
                print("Predicted:", prediction[0])
                print("Actual:", real_time)
                print("Features:", new_data)
                sixty_plus += 1

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

    print("Within 15 minutes:", under_fifteen)
    print("Within 16-30 minutes:", fifteen_thirty)
    print("Within 31-60 minutes:", thirty_sixty)
    print("Beyond 60 minutes:", sixty_plus)

if __name__ == "__main__":
    main()