from user import User
from bson import ObjectId
from database import client, DB, USERS
from flask import Flask, redirect, render_template, request, jsonify, url_for
from flask_login import LoginManager, UserMixin, login_required, login_user




# Setting up the Flask App
app = Flask(__name__)
app.secret_key = 'SECRET'


#Setting Up the login_manager
manager = LoginManager()
manager.init_app(app)
manager.login_view = '/'


# Sets up the User class and loads all the pre-stored data
user_instances = {}

data = USERS.find({},{'username' : 1, '_id' : 1, 'password' : 1})
for i in data:
    user = User(i['_id'],i['username'],i['password'])
    user_instances[i['username']] = user


# Base user loader decorator
@manager.user_loader
def load_user(user_id: str):
    global user_instances

    username = USERS.find_one({'_id':ObjectId(user_id)})
    if username:
        return user_instances[username['username']]
    return None


# endpoint for the homepage
@app.route("/",methods=['GET'])
def index():
    return render_template('index.html')


# Handles the login of the user
@app.route('/handle_login', methods=['POST'])
def handle_login():
    global user_instances

    # Parse the data received
    if request.headers['Content-Type'] == "application/json":
        data = request.get_json()
        identity, password = data['user'], data['pass']
        customer = data['customer']

        # if user is trying to login
        if customer:
            # If the username is valid
            if identity in user_instances:
                user = user_instances[identity]
                if user.password == password:
                    # logs the user in using flask login
                    login_user(user)
                    return redirect(url_for('notes', name = identity))
                else:
                    return jsonify({'is_user': 1})
            #Return wrong username
            else:
                return jsonify({'is_user': 0})

        # If user is creating a account
        else:   
            # IF the username is taken throw a error
            if identity in user_instances:
                return jsonify({'is_user': 2})
            # Create  a account and parse it into database
            else:
                result = USERS.insert_one({'username': identity, 'password': password, 'collection': f'data-{identity.lower()}'})
                user = User(result.inserted_id, identity, password)
                user_instances[identity] = user
                login_user(user)
                return redirect(url_for('notes', name = identity))

# dashboard endpoint
@app.route('/<name>')
@login_required
def notes(name):
    data = {}
    collection = DB.get_collection(f'data-{name.lower()}')
    context = collection.find({},{'_id':1, 'heading':1, 'body': 1})

    for i in context:
        data[i['heading']] = {'body': i['body'],'_id': str(i['_id'])}

    # Returns all the notes the user ever created
    return render_template('notes.html', user_data=data, owner = name)


# Post endpoint for saving a note
@app.route('/<name>/save_note',methods=["POST"])
@login_required
def specific(name: str):
    client = request.get_json()
    new_head, new_para, heading_id = client['head'], client['para'], client['heading_id']
    data = DB.get_collection(f'data-{name.lower()}')

    if heading_id is not None:
        data.find_one_and_update(
            {'_id': ObjectId(heading_id)},
            {'$set': {'heading': new_head, 'body': new_para}})
        return jsonify({'response': True})

    else:
        data.insert_one({'_id': ObjectId(heading_id), 'heading': new_head, 'body': new_para})
        return jsonify({'response': True})


# Post endpoint for deleting a note
@app.route('/<name>/trash',methods=['POST'])
@login_required
def trash(name):
    client = request.get_json()
    heading = client['key']
    
    data = DB.get_collection(f'data-{name.lower()}')
    data.find_one_and_delete({'_id': ObjectId(heading)})

    return jsonify({'response': True})


if __name__ == '__main__':

    # run the server
    app.run(host='0.0.0.0')

    #closes the connection to mongodb
    client.close()
