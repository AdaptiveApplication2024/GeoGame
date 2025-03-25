from extensions import db


class Country(db.Model):
    __tablename__ = 'countries'

    ISO = db.Column(db.String(2), primary_key=True)
    Country = db.Column(db.String(100), nullable=False)
    Capital = db.Column(db.String(100))
    Currency = db.Column(db.String(100))
    NationalSport = db.Column(db.String(100))
    Neighbours = db.Column(db.String(500))  # Stored as comma-separated
    latitude = db.Column(db.Float)
    longitude = db.Column(db.Float)

    def to_dict(self):
        return {
            'iso': self.ISO,
            'country': self.Country,
            'capital': self.Capital,
            'currency': self.Currency,
            'national_sport': self.NationalSport,
            'neighbours': self.Neighbours.split(',') if self.Neighbours else [],
            'latitude': self.latitude,
            'longitude': self.longitude
        }

    @classmethod
    def get_neighbours(cls, iso):
        country = cls.query.get(iso)
        if country and country.Neighbours:
            return country.Neighbours.split(',')
        return []