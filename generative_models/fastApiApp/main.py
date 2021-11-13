from fastapi import FastAPI
from literature_generator_script import *


app = FastAPI() # Instantiating FastApi App Object.


#Defining Api end-points

@app.get('/')
def get_root():
    return {"greetings": "Welcome to Encheres AI model's API"}


@app.get('/literature-generation')
def get_generated_literature(seed_text: str, next_words_count: int):
    
    model = load_model('literature-generator.h5', compile=False)

    generated_literature = generate_literature(model, seed_text, next_words_count)

    return {"generated_literature": generated_literature}