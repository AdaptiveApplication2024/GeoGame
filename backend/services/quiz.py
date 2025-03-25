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
        # Get user information
        user = User.query.get(user_id)
        if not user:
            return None

        # Get list of available countries (based on user's current location or nationality)
        available_countries = []
        if user.current_location:
            # Start from current location
            current_country = Country.query.get(user.current_location)
            if current_country:
                available_countries.append(current_country)
                # Add unlocked neighboring countries
                for neighbour_name in current_country.Neighbours.split(',') if current_country.Neighbours else []:
                    neighbour = Country.query.get(neighbour_name)
                    if neighbour and neighbour_name in user.get_unlocked_countries():
                        available_countries.append(neighbour)
        elif user.nationality:
            # Start from nationality country
            nationality_country = Country.query.get(user.nationality)
            if nationality_country:
                available_countries.append(nationality_country)
                # Add unlocked neighboring countries
                for neighbour_name in nationality_country.Neighbours.split(',') if nationality_country.Neighbours else []:
                    neighbour = Country.query.get(neighbour_name)
                    if neighbour and neighbour_name in user.get_unlocked_countries():
                        available_countries.append(neighbour)

        if not available_countries:
            return None

        # Randomly select a country and question type
        target_country = random.choice(available_countries)
        question_type = random.choice(list(QuizService.QUESTION_TEMPLATES.keys()))

        # Generate question
        question = QuizService.QUESTION_TEMPLATES[question_type].format(
            country=target_country.Country
        )

        # Generate options
        correct_answer = getattr(target_country, question_type)
        options = [correct_answer]

        # Get distractors from other countries
        other_countries = Country.query.filter(Country.Country != target_country.Country).all()
        random.shuffle(other_countries)

        for country in other_countries:
            if len(options) >= 4:
                break
            option = getattr(country, question_type)
            if option not in options:
                options.append(option)

        random.shuffle(options)

        return {
            'question_id': f"{target_country.Country}_{question_type}",
            'question': question,
            'options': options,
            'country_iso': target_country.ISO,
            'question_type': question_type
        }

    @staticmethod
    def check_answer(question_id, user_answer, user_id):
        country_name, question_type = question_id.split('_')
        country = Country.query.get(country_name)
        if not country:
            return False, "Country does not exist"

        correct_answer = getattr(country, question_type)
        is_correct = user_answer == correct_answer

        if is_correct:
            # 获取用户信息
            user = User.query.get(user_id)
            if user:
                # 解锁当前国家
                user.add_unlocked_country(country_name)
                # 解锁邻国
                if country.Neighbours:
                    for neighbour_name in country.Neighbours.split(','):
                        user.add_unlocked_country(neighbour_name)
                # 更新用户分数
                user.score += 10
                db.session.commit()

        return is_correct, {
            'correct': is_correct,
            'correct_answer': correct_answer,
            'explanation': f"The {question_type.lower()} of {country.Country} is {correct_answer}."
        }
