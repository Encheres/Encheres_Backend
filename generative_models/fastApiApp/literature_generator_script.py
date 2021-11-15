from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing.text import Tokenizer
from tensorflow.keras.preprocessing.sequence import pad_sequences
from tensorflow.keras import backend 
import numpy as np
import sys

def generate_literature(model, seed_text, next_words):

    # Instantiating Tokeinzer
    tokenizer = Tokenizer()
    data = open('./literature-generation/literature-generation.txt', encoding="utf8").read()

    corpus = data.lower().split("\n")

    # Fitting Tokenizer on Corpus.
    tokenizer.fit_on_texts(corpus)
    
    for _ in range(next_words):
        token_list = tokenizer.texts_to_sequences([seed_text])[0]
        token_list = pad_sequences([token_list], maxlen=15, padding='pre')
        prediction=model.predict(token_list) 
        predicted=np.argmax(prediction,axis=1)
        output_word = ""
        for word, index in tokenizer.word_index.items():
            if index == predicted:
                output_word = word
                break
        seed_text += " " + output_word
    
    return seed_text
