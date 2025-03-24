from models.country import Country
from models.user import User
from extensions import db
from sqlalchemy import func

class ProgressService:
    @staticmethod
    def get_user_progress(user_id):
        user = User.query.get(user_id)
        if not user:
            return None
            
        # 获取已解锁的国家
        unlocked_countries = []
        if user.current_location:
            current_country = Country.query.get(user.current_location)
            if current_country:
                unlocked_countries.append(current_country)
                # 添加已解锁的邻国
                for neighbour_iso in Country.get_neighbours(current_country.ISO):
                    neighbour = Country.query.get(neighbour_iso)
                    if neighbour:
                        unlocked_countries.append(neighbour)
        
        # 获取所有国家
        all_countries = Country.query.all()
        
        # 计算进度
        total_countries = len(all_countries)
        unlocked_count = len(unlocked_countries)
        progress_percentage = (unlocked_count / total_countries) * 100 if total_countries > 0 else 0
        
        return {
            'user': user.to_dict(),
            'progress': {
                'total_countries': total_countries,
                'unlocked_countries': unlocked_count,
                'progress_percentage': round(progress_percentage, 2)
            },
            'unlocked_countries': [country.to_dict() for country in unlocked_countries],
            'all_countries': [country.to_dict() for country in all_countries]
        }
    
    @staticmethod
    def update_user_score(user_id, is_correct):
        user = User.query.get(user_id)
        if not user:
            return False
            
        if is_correct:
            user.score += 10
            db.session.commit()
            return True
        return False 