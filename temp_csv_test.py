import sys
from pathlib import Path

sys.path.insert(0, str(Path(r'E:\gramai\gramai-twin-backend').resolve()))

from fastapi.testclient import TestClient
from app.main import app

csv_text = 'name,district,state,population,water,crop,flood_risk,latitude,longitude\nDemo Village,Test District,Test State,2500,64,Healthy,Low,28.1,77.1\n'
client = TestClient(app)
response = client.post('/data-pipeline/upload-csv', files={'file': ('demo.csv', csv_text, 'text/csv')})
print(response.status_code)
print(response.text)
