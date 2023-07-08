from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.staticfiles import StaticFiles

app = FastAPI()

answer='TRAIN'

@app.get('/answer')
def get_answer():
    return answer

app.mount("/", StaticFiles(directory=r"C:\Users\MalRang\Desktop\vs\wordle\static",html=True), name ="static")