from app import app
from extensions import db
import json
import os

def init_db():
    with app.app_context():
        # 创建所有表
        db.create_all()
        
        # 检查countries.json是否存在
        data_path = os.path.join(os.path.dirname(__file__), 'data', 'countries.json')
        if not os.path.exists(data_path):
            print(f"警告: countries.json 文件不存在于 {data_path}")
            return
        
        # 读取并导入国家数据
        with open(data_path, 'r', encoding='utf-8') as f:
            countries = json.load(f)
            
        from models.country import Country
        
        # 清空现有数据
        Country.query.delete()
        
        # 逐个添加国家数据
        for country_data in countries:
            try:
                # 处理NationalSport字段，如果是列表则取第一个
                national_sport = country_data['NationalSport']
                if isinstance(national_sport, list):
                    national_sport = national_sport[0]
                
                country = Country(
                    ISO=country_data['ISO'],
                    Country=country_data['Country'],
                    Capital=country_data['Capital'],
                    Currency=country_data['Currency'],
                    NationalSport=national_sport,
                    Neighbours=country_data['Neighbours'],
                    latitude=float(country_data.get('latitude', 0.0)),
                    longitude=float(country_data.get('longitude', 0.0))
                )
                db.session.add(country)
                db.session.commit()
            except Exception as e:
                db.session.rollback()
                print(f"导入国家 {country_data.get('Country')} 时出错: {str(e)}")
                continue
        
        print("数据库初始化成功！")

if __name__ == '__main__':
    init_db() 