from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from literature_generator_script import *


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