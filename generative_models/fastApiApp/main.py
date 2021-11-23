from fastapi import FastAPI 
from fastapi.responses import FileResponse
from fastapi.middleware.cors import CORSMiddleware
from literature_generator_script import *
from music_generate_script import Malody_Generator
import ipfsapi
import requests
import json
import os
app = FastAPI() # Instantiating FastApi App Object.

# Enabling CORS options.
origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

#Defining Api end-points
@app.get('/')
def get_root():
    return {"greetings": "Welcome to Encheres AI model's API"}


@app.get('/literature-generation')
def get_generated_literature(seed_text: str, next_words_count: int):
    
    model = load_model('literature-generator.h5', compile=False)

    generated_literature = generate_literature(model, seed_text, next_words_count)

    return {"generated_literature": generated_literature}

@app.get('/music-generation', responses={200:{"desc":"a mid file found"}})
def get_music_generation( note_count: int):
    #f = open('./music-generated/Melody_Generated.mid', "rt")
    '''with open('./music-generated/text-format.txt','wb') as f:
        f.write(buffer)
        response = requests.post('https://ipfs.infura.io:5001/api/v0/add', files=f)
    '''
    #p = response.json()
    #hash = p['Hash']
    #print(hash)
    #Melody = Malody_Generator(note_count)
    #Melody.write('midi','./music-generated/Melody_Generated.mid')
    path = os.getcwd()
    file_path = os.path.join(path, "music-generated/Melody_Generated.mid")
    if os.path.exists(file_path):
        return FileResponse(file_path, media_type="audio/midi", filename='Melody_Generated.mid')
    else:
        return {"result":"no file found"}
    