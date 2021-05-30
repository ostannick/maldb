import pandas as pd
from ionizer import Ionizer

def get_training_data(path: str):

    df = pd.read_csv(path)

    train_data = []
    train_labels = []

    for index, row in df.iterrows():  
        train_data.append(Ionizer(row['sequence'], row['ionized']).calculate_feature_vector())
        train_labels.append(row['ionized'])

    return (train_data, train_labels)