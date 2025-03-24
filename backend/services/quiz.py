from models.country import Country
from models.user import User
from extensions import db
import random

class QuizService:
    QUESTION_TEMPLATES = {
        'Capital': 'What is the capital of {country}?',
        'Currency': 'What currency is used in {country}?',
        'NationalSport': 'What is the national sport of {country}?'
    }
    
    @staticmethod
    def get_question(user_id):
        # 获取用户信息
        user = User.query.get(user_id)
        if not user:
            return None
            
        # 获取可用的国家列表（基于用户当前位置或国籍）
        available_countries = []
        if user.current_location:
            # 从当前位置开始
            current_country = Country.query.get(user.current_location)
            if current_country:
                available_countries.append(current_country)
                # 添加已解锁的邻国
                for neighbour_iso in current_country.Neighbours.split(',') if current_country.Neighbours else []:
                    neighbour = Country.query.get(neighbour_iso)
                    if neighbour:
                        available_countries.append(neighbour)
        elif user.nationality:
            # 从国籍国家开始
            nationality_country = Country.query.get(user.nationality)
            if nationality_country:
                available_countries.append(nationality_country)
                # 添加已解锁的邻国
                for neighbour_iso in nationality_country.Neighbours.split(',') if nationality_country.Neighbours else []:
                    neighbour = Country.query.get(neighbour_iso)
                    if neighbour:
                        available_countries.append(neighbour)
        
        if not available_countries:
            return None
            
        # 随机选择一个国家和问题类型
        target_country = random.choice(available_countries)
        question_type = random.choice(list(QuizService.QUESTION_TEMPLATES.keys()))
        
        # 生成问题
        question = QuizService.QUESTION_TEMPLATES[question_type].format(
            country=target_country.Country
        )
        
        # 生成选项
        correct_answer = getattr(target_country, question_type)
        options = [correct_answer]
        
        # 从其他国家获取干扰项
        other_countries = Country.query.filter(Country.ISO != target_country.ISO).all()
        random.shuffle(other_countries)
        
        for country in other_countries:
            if len(options) >= 4:
                break
            option = getattr(country, question_type)
            if option not in options:
                options.append(option)
        
        random.shuffle(options)
        
        return {
            'question_id': f"{target_country.ISO}_{question_type}",
            'question': question,
            'options': options,
            'country_iso': target_country.ISO,
            'question_type': question_type
        }
    
    @staticmethod
    def check_answer(question_id, user_answer):
        country_iso, question_type = question_id.split('_')
        country = Country.query.get(country_iso)
        if not country:
            return False, "国家不存在"
            
        correct_answer = getattr(country, question_type)
        is_correct = user_answer == correct_answer
        
        return is_correct, {
            'correct': is_correct,
            'correct_answer': correct_answer,
            'explanation': f"{country.Country}的{question_type.lower()}是{correct_answer}。"
        } 