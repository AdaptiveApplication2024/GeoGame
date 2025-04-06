import json
from extensions import db
import bcrypt


class User(db.Model):
    __tablename__ = 'users'

    user_id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(128), nullable=False)
    nationality = db.Column(db.String(200)) 
    current_location = db.Column(db.String(200))
    name = db.Column(db.String(128), nullable=False)
    age = db.Column(db.Integer)
    score = db.Column(db.Integer, default=0)
    interested_in = db.Column(db.String(1000), nullable=False)
    unlocked_countries = db.Column(db.String(1000))
    topic_progress = db.Column(db.Text, default='{}')

    def set_password(self, password):
        salt = bcrypt.gensalt()
        self.password = bcrypt.hashpw(password.encode('utf-8'), salt).decode('utf-8')

    def check_password(self, password):
        return bcrypt.checkpw(password.encode('utf-8'), self.password.encode('utf-8'))

    def get_unlocked_countries(self):
        return self.unlocked_countries.split(',') if self.unlocked_countries else []

    def add_unlocked_country(self, country_name):
        if not self.unlocked_countries:
            self.unlocked_countries = country_name
        elif country_name not in self.unlocked_countries:
            self.unlocked_countries += f',{country_name}'
    
    def get_interested_topics(self):
        return self.interested_in.split(',') if self.interested_in else []

    def add_topic_progress(self, country, topic):
        progress = json.loads(self.topic_progress) if self.topic_progress else {}

        if country not in progress:
            progress[country] = {}
        

        if topic not in progress[country]:
            progress[country][topic] = 0

        progress[country][topic] += 1
        self.topic_progress = json.dumps(progress)

    def get_topic_progress(self):
        return json.loads(self.topic_progress) if self.topic_progress else {}


    def to_dict(self):
        return {
            'user_id': self.user_id,
            'name': self.name,
            'age': self.age,
            'email': self.email,
            'nationality': self.nationality,
            'current_location': self.current_location,
            'score': self.score,
            'unlocked_countries': self.get_unlocked_countries(),
            'interested_in': self.get_interested_topics(),
            'topic_progress': self.get_topic_progress()
        }
