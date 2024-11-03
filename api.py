from flask_restful import Resource, Api, fields, marshal_with, reqparse
from model import db
from model import Album, Song, Playlist, Association
from werkzeug.exceptions import HTTPException
from flask_cors import CORS
import json
from flask import make_response
from flask_security import auth_required, roles_required
api = Api()
from functools import wraps
from flask import abort
from flask_security import roles_accepted

def any_role_required(*roles):
    def wrapper(fn):
        @wraps(fn)
        def decorator(*args, **kwargs):
            if not roles_accepted(*roles):
                abort(403, description="Insufficient permissions")
            return fn(*args, **kwargs)
        return decorator
    return wrapper

class NotFoundError(HTTPException):
    def __init__(self,status_code):
        message = {"error_code":"BE1009","error_message":"Not Found"}
        self.response = make_response(json.dumps(message), status_code)

class BusinessValidationError(HTTPException):
    def __init__(self, status_code, error_code, error_message):
        message = {"error_code":error_code,"error_message":error_message}
        self.response = make_response(json.dumps(message), status_code)

Album_fields = {
    "id":fields.Integer,
    "name":fields.String,
    "artist":fields.String,
    "active":fields.Boolean
}

Song_fields = {
    "id":fields.Integer,
    "name":fields.String,
    "genre":fields.String,
    "duration":fields.String,
    "lyrics":fields.String,
    "date_created":fields.String,
    "album_id": fields.Integer
}

playlist_fields = {
    "id":fields.Integer,
    "user_id":fields.Integer,
    "song_id":fields.Integer,
    "song_name":fields.String,
}

create_Album_parser = reqparse.RequestParser()
create_Album_parser.add_argument('name')
create_Album_parser.add_argument('artist')
create_Album_parser.add_argument('active')

create_Song_parser = reqparse.RequestParser()
create_Song_parser.add_argument('name')
create_Song_parser.add_argument('genre')
create_Song_parser.add_argument('duration')
create_Song_parser.add_argument('lyrics')
create_Song_parser.add_argument('date_created')
create_Song_parser.add_argument('album_id')

create_playlist_parser = reqparse.RequestParser()
create_playlist_parser.add_argument('user_id')  
create_playlist_parser.add_argument('song_id')
create_playlist_parser.add_argument('song_name')


update_Album_parser = reqparse.RequestParser()
update_Album_parser.add_argument('name')
update_Album_parser.add_argument('artist')
update_Album_parser.add_argument('active')

update_Song_parser = reqparse.RequestParser()
update_Song_parser.add_argument('name')
update_Song_parser.add_argument('genre')
update_Song_parser.add_argument('duration')
update_Song_parser.add_argument('lyrics')
update_Song_parser.add_argument('date_created')
update_Song_parser.add_argument('album_id')


class Album_Api(Resource):
    @auth_required('token')
    @any_role_required('Admin','Creator','User')
    def get(self):
        data = []
        album = Album.query.all()
        if album is None:
            return NotFoundError(status_code=404)
        else:
            for i in album:
                data.append({"id":i.id, "name":i.name, "artist":i.artist, "active":i.active})
            return data

    @marshal_with(Album_fields)
    @any_role_required('Admin','Creator')
    @auth_required('token')
    def post(self):
        args = create_Album_parser.parse_args()
        name = args.get("name",None)
        artist = args.get("artist",None)
        active = args.get("active",None)
        if active is not None:
            active = active.lower() == 'true'
        if name is None:
            raise BusinessValidationError(status_code=400,error_code="BE1001",error_message="Album name is required")
        album = Album.query.filter_by(name = name).first()
        if album:
            raise BusinessValidationError(status_code=400,error_code="BE1004",error_message="duplicate Album")
        new_Album = Album(name=name,active=active)
        db.session.add(new_Album)
        db.session.commit()
        return new_Album, 201
    
    @any_role_required('Admin','Creator')
    @auth_required('token')
    @marshal_with(Album_fields)
    def put(self,id):
        args = update_Album_parser.parse_args()
        name = args.get("name")
        artist = args.get("artist")
        active = args.get("active",None)
        if active is not None:
            active = active.lower() == 'true'
        if name is None:
            return BusinessValidationError(status_code=400, error_code="name", error_message="Album Name is required")
        album = Album.query.filter_by(id = id).first()
        if album is None:
            raise NotFoundError(status_code=404)
        Album.query.filter(Album.id==id).update({'name':name, 'artist':artist, 'active':active})
        db.session.commit()
        return album

    @roles_required('Admin')
    @auth_required('token')
    def delete(self, id):
        album = Album.query.get(id)
        if album:
            db.session.query(Association).filter_by(album_id=id).delete()
            db.session.query(Song).filter_by(album_id=id).delete()
            db.session.delete(album)
            db.session.commit()
            return "Deleted Album", 201
        return NotFoundError(status_code=404)


class Song_Api(Resource):
    @auth_required('token')
    @any_role_required('Admin','Creator','User')
    def get(self,id):
        a = Album.query.get(id)
        songs = a.song_relation
        data = []
        if songs is None:
            return NotFoundError(status_code=404)
        else:
            for i in songs:
                data.append({"id":i.id,"name":i.name,"genre":i.genre,"duration":i.duration,"lyrics":i.lyrics,"date_created":i.date_created,"album_id":i.album_id})
            return data

    @auth_required('token')
    @roles_required('Creator')
    @marshal_with(Song_fields)
    def post(self,id):
        args = create_Song_parser.parse_args()
        name = args.get("name",None)
        genre = args.get("genre",None)
        duration = args.get("duration",None)
        lyrics = args.get("lyrics",None)
        date_created = args.get("date_created",None)
        album_id = id
        if name is None:
            raise BusinessValidationError(status_code=400,error_code="BE1001",error_message="Song name is required")
        if genre is None:
            raise BusinessValidationError(status_code=400,error_code="BE1002",error_message="Song genre is required")
        if duration is None:
            raise BusinessValidationError(status_code=400,error_code="BE1003",error_message="Song duration is required")
        if lyrics is None:
            raise BusinessValidationError(status_code=400,error_code="BE1003",error_message="Song lyrics is required")
        if date_created is None:
            raise BusinessValidationError(status_code=400,error_code="BE1005",error_message="Song date_created is required")
        if album_id is None:
            raise BusinessValidationError(status_code=400,error_code="BE1007",error_message="Song album_id is required")
        
        song = Song.query.filter_by(name = name, genre= genre, duration= duration, lyrics= lyrics, date_created=date_created, album_id=album_id).first()
        if song:
            raise BusinessValidationError(status_code=400,error_code="BE1004",error_message="duplicate Song")
        new_Song = Song(name = name, genre= genre, duration= duration, lyrics= lyrics, date_created=date_created, album_id=album_id)

        db.session.add(new_Song)
        db.session.commit()
        s = Song.query.filter_by(name = name, genre= genre, duration= duration, lyrics= lyrics, date_created=date_created, album_id=album_id).first()
        sid = s.id
        asso = Association(album_id=album_id,song_id=sid)
        db.session.add(asso)
        db.session.commit()
        return new_Song, 201
    
    @roles_required('Creator')
    @auth_required('token')
    @marshal_with(Song_fields)
    def put(self,id):
        args = update_Song_parser.parse_args()
        name = args.get("name",None)
        genre = args.get("genre",None)
        duration = args.get("duration",None)
        lyrics = args.get("lyrics",None)
        date_created = args.get("date_created",None)
        album_id = id
        if name is None:
            raise BusinessValidationError(status_code=400,error_code="BE1001",error_message="Song name is required")
        if genre is None:
            raise BusinessValidationError(status_code=400,error_code="BE1002",error_message="Song genre is required")
        if duration is None:
            raise BusinessValidationError(status_code=400,error_code="BE1003",error_message="Song duration is required")
        if lyrics is None:
            raise BusinessValidationError(status_code=400,error_code="BE1003",error_message="Song lyrics is required")
        if date_created is None:
            raise BusinessValidationError(status_code=400,error_code="BE1005",error_message="Song date_created is required")
        if album_id is None:
            raise BusinessValidationError(status_code=400,error_code="BE1007",error_message="Song album_id is required")
     
        song = Song.query.filter_by(id = id).first()
        if song is None:
            raise NotFoundError(status_code=404)
        Song.query.filter(Song.id==id).update({'name':name,'genre':genre, 'duration':duration, 'lyrics': lyrics, 'date_created':date_created, 'album_id':album_id})
        db.session.commit()
        return song, 201

    @roles_required('Creator')
    @auth_required('token')
    def delete(self, id):
        S1 = Song.query.get(id)
        if S1 is not None:
            db.session.delete(S1)
            db.session.commit()
            return "Deleted Song", 201
        return NotFoundError(status_code=404)

class Albumget_Api(Resource):
    @marshal_with(Album_fields)
    @auth_required('token')
    @any_role_required('Admin','Creator','User')
    def get(self,id):
        album = Album.query.filter_by(id = id).first()
        if album is None:
            return NotFoundError(status_code=404)
        else:
            return album
        
class Songget_Api(Resource):
    @auth_required('token')
    @any_role_required('Admin','Creator','User')
    @marshal_with(Song_fields)
    def get(self,id):
        song = Song.query.filter_by(id = id).first()
        if song is None:
            return NotFoundError(status_code=404)
        else:
            return song

class Playlist_Api(Resource):
    @auth_required('token')
    @any_role_required('User')
    @marshal_with(playlist_fields)
    def get(self,id):
        playlist = Playlist.query.filter_by(user_id = id).all()
        if playlist is None:
            return NotFoundError(status_code=404)
        else:
            return playlist

    @auth_required('token')
    @any_role_required('User') 
    @marshal_with(playlist_fields)
    def post(self):
        args = create_playlist_parser.parse_args()
        user_id = args.get("user_id",None)
        song_id = args.get("song_id",None)
        song_name = args.get("song_name",None)
        if user_id is None:
            raise BusinessValidationError(status_code=400,error_code="BE1001",error_message="user_id is required")
        if song_id is None:
            raise BusinessValidationError(status_code=400,error_code="BE1002",error_message="song_id is required")
        if song_name is None:
            raise BusinessValidationError(status_code=400,error_code="BE1003",error_message="song_name is required")
        new_playlist = Playlist(user_id=user_id,song_id=song_id,song_name=song_name)
        db.session.add(new_playlist)
        db.session.commit()
        return new_playlist,201
    
    @auth_required('token')
    @any_role_required('User')
    @marshal_with(playlist_fields)
    def delete(self,id):
        playlist = Playlist.query.filter_by(id = id).all()
        if playlist is None:
            return NotFoundError(status_code=404)
        else:
            for i in playlist:
                db.session.delete(i)
            db.session.commit()
            return "deleted playlist",201


api.add_resource(Album_Api, "/api/album/<int:id>", "/api/album", )
api.add_resource(Albumget_Api, "/api/albumget/<int:id>")
api.add_resource(Song_Api, "/api/song/<int:id>", "/api/song",)
api.add_resource(Songget_Api, "/api/songget/<int:id>")
api.add_resource(Playlist_Api, "/api/playlist/<int:id>", "/api/playlist",)
