from extensions import db


class Country(db.Model):
    __tablename__ = 'countries'

    Country = db.Column(db.String(100), primary_key=True)
    ISO = db.Column(db.String(2), nullable=False)
    Capital = db.Column(db.String(100))
    Currency = db.Column(db.String(100))
    NationalSport = db.Column(db.String(100))
    Neighbours = db.Column(db.String(500))  # Stored as comma-separated
    latitude = db.Column(db.Float)
    longitude = db.Column(db.Float)

    def to_dict(self):
        return {
            'country': self.Country,
            'iso': self.ISO,
            'capital': self.Capital,
            'currency': self.Currency,
            'national_sport': self.NationalSport,
            'neighbours': self.Neighbours.split(',') if self.Neighbours else [],
            'latitude': self.latitude,
            'longitude': self.longitude
        }

    @classmethod
    def get_neighbours(cls, country_name):
        country = cls.query.get(country_name)
        if country and country.Neighbours:
            return country.Neighbours.split(',')
        return []