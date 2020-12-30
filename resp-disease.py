import sys
import os
import librosa
import tensorflow as tf
from tensorflow.keras.models import load_model

audioPath = "./uploaded-data/" + os.listdir(os.getcwd() + "/uploaded-data/")[0]
if audioPath.split(".")[-1] not in ["wav", "mp3", "m4a"]:
  audioPath = "./uploaded-data/" + os.listdir(os.getcwd() + "/uploaded-data/")[1]

clip, sr = librosa.load(audioPath)
mfccs = librosa.feature.mfcc(y = clip, sr = sr, n_mfcc = 40)
if mfccs.shape[1] == 862:
    model = load_model("./static/tfjs-models/Respiratory-disease-detection-model/respiratory-model.h5")
    print(audioPath)
    mfccs = mfccs.reshape(1, 40, 862, 1)
    predictions = model.predict(mfccs)
    predictions =  [(round(pred * 100)) for pred in predictions[0]]
    print(predictions)
    os.remove(audioPath)
else:
    print("Cannot process audio file")