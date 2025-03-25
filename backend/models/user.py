from extensions import db
import bcrypt


class User(db.Model):
    __tablename__ = 'users'

    user_id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(128), nullable=False)
    nationality = db.Column(db.String(2))  # ISO country code
    current_location = db.Column(db.String(2))  # ISO country code
    score = db.Column(db.Integer, default=0)
    unlocked_countries = db.Column(db.String(1000))  # 存储已解锁的国家，用逗号分隔

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

    def to_dict(self):
        return {
            'user_id': self.user_id,
            'email': self.email,
            'nationality': self.nationality,
            'current_location': self.current_location,
            'score': self.score,
            'unlocked_countries': self.get_unlocked_countries()
        }
