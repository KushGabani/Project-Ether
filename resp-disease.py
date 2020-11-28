import sys
import os
import librosa
from tensorflow.keras.models import load_model

audioFile = os.listdir(os.getcwd() + "/uploaded-data/")[0]
print(audioFile)
clip, sr = librosa.load(audioFile)
mfccs = librosa.feature.mfcc(y = clip, sr = sr, n_mfcc = 40)
if mfccs.shape[1] == 862:
    model = load_model("./static/tfjs-models/Respiratory-disease-detection-model/respiratory-model.h5")
    mfccs = mfccs.reshape(1, 40, 862, 1)
    predictions = model.predict(mfccs)
    predictions =  [(round(pred * 100)) for pred in predictions[0]]
    print(predictions)
    os.remove(audioFile)
else:
    print("Cannot process audio file")
