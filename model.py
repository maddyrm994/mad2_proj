from flask_sqlalchemy import SQLAlchemy
from flask_security import UserMixin, RoleMixin

db = SQLAlchemy()

class RolesUsers(db.Model):
    __tablename__ = 'roles_users'
    id = db.Column(db.Integer(), primary_key=True)
    user_id = db.Column('user_id', db.Integer(), db.ForeignKey('user.id'))
    role_id = db.Column('role_id', db.Integer(), db.ForeignKey('role.id'))

class User(db.Model, UserMixin):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String, unique=False)
    email = db.Column(db.String, unique=True)
    password = db.Column(db.String(255))
    active = db.Column(db.Boolean())
    fs_uniquifier = db.Column(db.String(255), unique=True, nullable=False)
    roles = db.relationship('Role', secondary='roles_users', backref=db.backref('users', lazy='dynamic'))

class Role(db.Model, RoleMixin):
    id = db.Column(db.Integer, primary_key = True, autoincrement = True)
    name = db.Column(db.String, nullable = False, unique = True)
    description = db.Column(db.String)

class Album(db.Model):
    id = db.Column(db.Integer, primary_key=True, autoincrement = True)
    name = db.Column(db.String(100), nullable=False)
    active = db.Column(db.Boolean())
    artist = db.Column(db.String(100))
    song_relation = db.relationship("Song",backref="album_relation", secondary="association") 

class Song(db.Model):
    id = db.Column(db.Integer, primary_key=True, autoincrement = True)
    name = db.Column(db.String(100), nullable=False)
    genre = db.Column(db.String(100))
    duration = db.Column(db.String(100))
    lyrics = db.Column(db.String(100))
    date_created = db.Column(db.String(100))
    album_id=db.Column(db.Integer, db.ForeignKey("album.id"), nullable=False)

class Playlist(db.Model):
    id = db.Column(db.Integer, primary_key=True, autoincrement = True)
    user_id = db.Column(db.Integer, db.ForeignKey("user.id"))
    song_id=db.Column(db.Integer, db.ForeignKey("song.id"))
    song_name=db.Column(db.String(100), db.ForeignKey("song.name"))

class Association(db.Model):
    album_id = db.Column(db.Integer, db.ForeignKey("album.id"),primary_key = True, nullable=False)
    song_id = db.Column(db.Integer, db.ForeignKey("song.id"),primary_key = True, nullable=False)
