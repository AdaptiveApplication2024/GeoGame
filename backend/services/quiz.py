from models.country import Country
from models.user import User
from extensions import db
from sqlalchemy import func
import random


class QuizService:
    QUESTION_TEMPLATES = {
        'Capital': 'What is the capital of {country}?',
        'Currency': 'What currency is used in {country}?',
        'NationalSport': 'What is the national sport of {country}?',
        'Continent': 'What is the continent of {country}?',
        'Population': 'What is the population of {country}?',
        'Languages': 'What languages are spoken in {country}?',
        'Country': 'Where is {country}?'
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
            #print(f"User current location: {user.current_location}")
            # Start from current location
            current_country = Country.query.get(user.current_location)
            #print(f"Current country found: {current_country.Country}")
            #print('current_country',current_country)
            
            #print(current_country not in user.get_unlocked_countries())
            if current_country and user.current_location not in user.get_unlocked_countries():
                available_countries.append(current_country)
                # Add unlocked neighboring countries
                for neighbour_name in current_country.Neighbours.split(',') if current_country.Neighbours else []:
                    #print(f"Neighbor name from database: {neighbour_name}")
                    neighbour = Country.query.get(neighbour_name)
                    #print('available_countries:',available_countries)
                    #print('neighbour',neighbour)
                    #print('neighbour_name',neighbour_name)
                    #print('unlocked_countries',user.get_unlocked_countries())
                    #print(neighbour_name not in user.get_unlocked_countries())
                    if neighbour and neighbour_name not in user.get_unlocked_countries() and neighbour_name not in available_countries:
                        #print(f"Neighbor found and unlocked: {neighbour.Country}")
                        available_countries.append(neighbour)
                        for neighbour_name_lvl2 in neighbour.Neighbours.split(',') if neighbour.Neighbours else []:
                            neighbour_lvl2 = Country.query.get(neighbour_name_lvl2)
                            if neighbour_lvl2 and neighbour_name_lvl2 not in user.get_unlocked_countries() and neighbour_name_lvl2 not in available_countries:
                                available_countries.append(neighbour_lvl2)

        if user.nationality:
            # Start from nationality country
            nationality_country = Country.query.get(user.nationality)
            if nationality_country and user.nationality not in user.get_unlocked_countries():
                available_countries.append(nationality_country)
                # Add unlocked neighboring countries
                for neighbour_name in nationality_country.Neighbours.split(',') if nationality_country.Neighbours else []:
                    neighbour = Country.query.get(neighbour_name)
                    if neighbour and neighbour_name not in user.get_unlocked_countries() and neighbour_name not in available_countries:
                        #print(f"Neighbor found and unlocked: {neighbour.Country}")
                        available_countries.append(neighbour)
                        for neighbour_name_lvl2 in neighbour.Neighbours.split(',') if neighbour.Neighbours else []:
                            neighbour_lvl2 = Country.query.get(neighbour_name_lvl2)
                            if neighbour_lvl2 and neighbour_name_lvl2 not in user.get_unlocked_countries() and neighbour_name_lvl2 not in available_countries:
                                available_countries.append(neighbour_lvl2)

        #print('available_countries:',available_countries)

        #print(available_countries)

        if not available_countries and user.get_unlocked_countries():
            for country in user.get_unlocked_countries():
                unlk_country = Country.query.get(country)
                for neighbour_name in unlk_country.Neighbours.split(',') if unlk_country.Neighbours else []:
                    neighbour = Country.query.get(neighbour_name)
                    if neighbour and neighbour_name not in user.get_unlocked_countries() and neighbour_name not in available_countries:
                        #print(f"Neighbor found and unlocked: {neighbour.Country}")
                        available_countries.append(neighbour)


        if not available_countries and user.get_unlocked_countries():
            random_country = ""
            while True:
                random_country = Country.query.order_by(func.random()).first()
                if random_country not in user.get_unlocked_countries():
                    break
            available_countries.append(random_country)

        #print(available_countries)
        
        if not available_countries:
            return None

        unique_countries = set(available_countries)
        available_countries = list(unique_countries)

        # Randomly select a country and question type
        target_country = random.choice(available_countries)
        question_topic = list(QuizService.QUESTION_TEMPLATES.keys())
        interested_in_topics = [item.strip() for item in user.interested_in.split(',')]
        question_topic = [topic for topic in question_topic if topic in interested_in_topics]
        question_topic.append('Country')
        #print(question_topic)
        question_type = random.choice(question_topic)
        
        
        # Generate question
        question = QuizService.QUESTION_TEMPLATES[question_type].format(
            country=target_country.Country
        )

        # Generate options
        correct_answer = getattr(target_country, question_type)
        #print(f'Correct Answer :{correct_answer}')
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
        if question_type == 'Country':
            options = None

        # Convert Country objects to dictionaries
        available_countries_dicts = []
        for country in available_countries:
            available_countries_dicts.append({
                'ISO': country.ISO,
                'Country': country.Country,
                # Add other attributes you need
            })

        return {
            'question_id': f"{target_country.Country}_{question_type}",
            'question': question,
            'options': options,
            'country_iso': target_country.ISO,
            'question_type': question_type,
            'available_countries': available_countries_dicts,
            'continent': target_country.Continent,
        }

    @staticmethod
    def check_answer(question_id, user_answer, user_id):
        country_name, question_type = question_id.split('_')
        country = Country.query.get(country_name)
        if not country:
            return False, "Country does not exist"
        user = User.query.get(user_id)
        if not user:
            return False, "User does not exist"

        interested_in_topics = [item.strip() for item in user.interested_in.split(',')]
        interested_in_topics.append('Country')
        if question_type not in interested_in_topics:
            return False, "Invalid Topic for the User"

        correct_answer = getattr(country, question_type)
        is_correct = user_answer == correct_answer
        
        

        if is_correct:
            
            user.add_topic_progress(country.Country, question_type)

            '''user.add_unlocked_country(country_name)
            if country.Neighbours:
                for neighbour_name in country.Neighbours.split(','):
                    user.add_unlocked_country(neighbour_name)'''
            user.score += 10
            db.session.commit()
        

        progress = user.get_topic_progress()

        country_progress = progress.get(country.Country, {})

        if all(topic in country_progress and country_progress[topic] > 0 for topic in interested_in_topics):
        # Load or initialize unlocked countries
            user.add_unlocked_country(country.Country)
            user.score += 50
            db.session.commit()

            

        return is_correct, {
            'correct': is_correct,
            'correct_answer': correct_answer,
            'explanation': f"The {question_type.lower()} of {country.Country} is {correct_answer}."
        }
