from flask_login import UserMixin

# Base class to handle users
class User(UserMixin):
    def __init__(self, user_id , username, password):
        self.id = user_id
        self.username = username
        self.password = password
