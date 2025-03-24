from extensions import db
import bcrypt

class User(db.Model):
    __tablename__ = 'users'
    
    user_id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(128), nullable=False)
    nationality = db.Column(db.String(2))  # ISO国家代码
    current_location = db.Column(db.String(2))  # ISO国家代码
    score = db.Column(db.Integer, default=0)
    
    def set_password(self, password):
        salt = bcrypt.gensalt()
        self.password = bcrypt.hashpw(password.encode('utf-8'), salt).decode('utf-8')
    
    def check_password(self, password):
        return bcrypt.checkpw(password.encode('utf-8'), self.password.encode('utf-8'))
    
    def to_dict(self):
        return {
            'user_id': self.user_id,
            'email': self.email,
            'nationality': self.nationality,
            'current_location': self.current_location,
            'score': self.score
        } 