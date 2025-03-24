from flask import Flask, request, jsonify
from extensions import db, migrate, cors
from services.quiz import QuizService
from services.progress import ProgressService
import os

app = Flask(__name__)

# 配置
basedir = os.path.abspath(os.path.dirname(__file__))
app.config['SQLALCHEMY_DATABASE_URI'] = f'sqlite:///{os.path.join(basedir, "db", "geo_app.db")}'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY', 'dev')

# 初始化扩展
db.init_app(app)
migrate.init_app(app, db)
cors.init_app(app)

# 导入模型
from models.country import Country
from models.user import User

# 路由
@app.route('/api/register', methods=['POST'])
def register():
    data = request.get_json()
    if not data or 'email' not in data or 'password' not in data:
        return jsonify({"error": "缺少必要字段"}), 400
        
    if User.query.filter_by(email=data['email']).first():
        return jsonify({"error": "邮箱已被注册"}), 400
        
    user = User(
        email=data['email'],
        nationality=data.get('nationality'),
        current_location=data.get('current_location')
    )
    user.set_password(data['password'])
    
    try:
        db.session.add(user)
        db.session.commit()
        return jsonify({"message": "注册成功", "user": user.to_dict()}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500

@app.route('/api/login', methods=['POST'])
def login():
    data = request.get_json()
    if not data or 'email' not in data or 'password' not in data:
        return jsonify({"error": "缺少必要字段"}), 400
        
    user = User.query.filter_by(email=data['email']).first()
    if not user or not user.check_password(data['password']):
        return jsonify({"error": "邮箱或密码错误"}), 401
        
    return jsonify({"message": "登录成功", "user": user.to_dict()})

@app.route('/api/quiz', methods=['GET'])
def get_quiz():
    user_id = request.args.get('user_id')
    if not user_id:
        return jsonify({"error": "缺少用户ID"}), 400
        
    question = QuizService.get_question(user_id)
    if not question:
        return jsonify({"error": "无法生成问题"}), 404
        
    return jsonify(question)

@app.route('/api/submit', methods=['POST'])
def submit_answer():
    data = request.get_json()
    if not data or 'user_id' not in data or 'question_id' not in data or 'answer' not in data:
        return jsonify({"error": "缺少必要字段"}), 400
        
    is_correct, result = QuizService.check_answer(data['question_id'], data['answer'])
    
    # 更新用户分数
    if is_correct:
        ProgressService.update_user_score(data['user_id'], True)
    
    return jsonify(result)

@app.route('/api/progress', methods=['GET'])
def get_progress():
    user_id = request.args.get('user_id')
    if not user_id:
        return jsonify({"error": "缺少用户ID"}), 400
        
    progress = ProgressService.get_user_progress(user_id)
    if not progress:
        return jsonify({"error": "用户不存在"}), 404
        
    return jsonify(progress)

@app.route('/api/countries', methods=['GET'])
def get_countries():
    user_id = request.args.get('user_id')
    progress = ProgressService.get_user_progress(user_id) if user_id else None
    
    if progress:
        return jsonify({
            'countries': progress['all_countries'],
            'unlocked_countries': progress['unlocked_countries']
        })
    else:
        countries = Country.query.all()
        return jsonify({
            'countries': [country.to_dict() for country in countries],
            'unlocked_countries': []
        })

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001, debug=True) 