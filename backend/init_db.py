from app import app
from extensions import db
import json
import os


def init_db():
    with app.app_context():
        # Create all tables
        db.create_all()

        # Check if countries.json exists
        data_path = os.path.join(os.path.dirname(__file__), 'data', 'countries.json')
        if not os.path.exists(data_path):
            print(f"Warning: countries.json file does not exist at {data_path}")
            return

        # Read and import country data
        with open(data_path, 'r', encoding='utf-8') as f:
            countries = json.load(f)

        from models.country import Country

        # Clear existing data
        Country.query.delete()

        # Add country data one by one
        for country_data in countries:
            try:
                # Handle NationalSport field, take the first one if it's a list
                national_sport = country_data['NationalSport']
                if isinstance(national_sport, list):
                    national_sport = national_sport[0]

                languages = country_data['Languages']
                if isinstance(languages, list):
                    languages = languages[0]

                country = Country(
                    Country=country_data['Country'],
                    ISO=country_data['ISO'],
                    Capital=country_data['Capital'],
                    Currency=country_data['Currency'],
                    NationalSport=national_sport,
                    Neighbours=country_data['Neighbours'],
                    latitude=float(country_data.get('latitude', 0.0)),
                    longitude=float(country_data.get('longitude', 0.0)),
                    Continent=country_data['Continent'],
                    Population=int(country_data['Population']),
                    Languages=languages
                )
                db.session.add(country)
                db.session.commit()
            except Exception as e:
                db.session.rollback()
                print(f"Error importing country {country_data.get('Country')}: {str(e)}")
                continue

        print("Database initialized successfully!")


if __name__ == '__main__':
    init_db()
