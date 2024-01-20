from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi
from dotenv import load_dotenv
import os

load_dotenv()

# Connection Link
uri = os.getenv('URI')


# Create a new client and connect to the server
client = MongoClient(uri, server_api=ServerApi('1'))

# Try three times to establish a connection and Send a ping to confirm a successful connection
for _ in range(1,4):
    try:
        client.admin.command('ping')
        DB = client.get_database('Todo')
        USERS = DB.get_collection('Users')
        print(f'Connected on trial No: {_}')
        break
    except Exception as e:
        continue
