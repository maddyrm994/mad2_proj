from app import app
from sec import datastore
from model import db, Role, Album, Song, Association
from flask_security import hash_password
from werkzeug.security import generate_password_hash

with app.app_context():
    db.create_all()
    datastore.find_or_create_role(name="Admin", description="user is Admin")
    datastore.find_or_create_role(name="Creator", description="user is Creator")
    datastore.find_or_create_role(name="User", description="user is User")
    db.session.commit()
    if not datastore.find_user(email="admin@gmail.com"):
        datastore.create_user(
            username="admin",
            email="admin@gmail.com",
            password= generate_password_hash("admin"),
            roles=["Admin"])
    if not datastore.find_user(email="creator@gmail.com"):
        datastore.create_user(
            username="creator",
            email="creator@gmail.com",
            password=generate_password_hash("creator"),
            roles=["Creator"], active=False)
    if not datastore.find_user(email="user@gmail.com"):
        datastore.create_user(
            username="user",
            email="user@gmail.com",
            password=generate_password_hash("user"),
            roles=["User"])
    db.session.commit()

    albums = [
        {
            "name": "So Far So Good",
            "active": True,
            "artist": "The Chainsmokers"
        }
        ,
        {
            "name": "1989",
            "active": True,
            "artist": "Taylor Swift"
        }
        ,
        {
            "name": "CHARLIE",
            "active": True,
            "artist": "Charlie Puth"
        }
        ,
    ]

    for album in albums:
        db.session.add(Album(**album))
    db.session.commit()

    songs = [
        {
            "name": "Something Different",
            "genre": "Pop",
            "duration": "02:34",
            "lyrics": "/static/lyrics/1_something_different.txt",
            "date_created" : "2022-05-13",
            "album_id": 1,
        }
        ,
        {
            "name": "Riptide",
            "genre": "Pop",
            "duration": "02:51",
            "lyrics": "/static/lyrics/1_riptide.txt",
            "date_created" : "2022-05-13",
            "album_id": 1,
        }
        ,
        {
            "name": "High",
            "genre": "Pop",
            "duration": "02:55",
            "lyrics": "/static/lyrics/1_high.txt",
            "date_created" : "2022-05-13",
            "album_id": 1,
        }
        ,
        {
            "name": "If You're Serious",
            "genre": "Pop",
            "duration": "03:44",
            "lyrics": "/static/lyrics/1_if_youre_serious.txt",
            "date_created" : "2022-05-13",
            "album_id": 1,
        }
        ,
        {
            "name": "Style",
            "genre": "Synth Pop",
            "duration": "03:51",
            "lyrics": "/static/lyrics/2_style.txt",
            "date_created" : "2014-10-27",
            "album_id": 2,
        }
        ,
        {
            "name": "Shake It Off",
            "genre": "Synth Pop",
            "duration": "03:39",
            "lyrics": "/static/lyrics/2_shake_it_off.txt",
            "date_created" : "2014-10-27",
            "album_id": 2,
        }
        ,
        {
            "name": "Wildest Dreams",
            "genre": "Synth Pop",
            "duration": "03:40",
            "lyrics": "/static/lyrics/2_wildest_dreams.txt",
            "date_created" : "2014-10-27",
            "album_id": 2,
        }
        ,
        {
            "name": "Clean",
            "genre": "Synth Pop",
            "duration": "04:31",
            "lyrics": "/static/lyrics/2_clean.txt",
            "date_created" : "2014-10-27",
            "album_id": 2,
        }
        ,
        {
            "name": "Blank Space",
            "genre": "Synth Pop",
            "duration": "03:51",
            "lyrics": "/static/lyrics/2_blank_space.txt",
            "date_created" : "2014-10-27",
            "album_id": 2,
        }
        ,
        {
            "name": "That's Hilarious",
            "genre": "Christian",
            "duration": "02:26",
            "lyrics": "/static/lyrics/3_thats_hilarious.txt",
            "date_created" : "2022-10-07",
            "album_id": 3,
        }
        ,
        {
            "name": "Light Switch",
            "genre": "Christian",
            "duration": "03:07",
            "lyrics": "/static/lyrics/3_light_switch.txt",
            "date_created" : "2022-10-07",
            "album_id": 3,
        }
        ,
        {
            "name": "Smells Like Me",
            "genre": "Christian",
            "duration": "03:24",
            "lyrics": "/static/lyrics/3_smells_like_me.txt",
            "date_created" : "2022-10-07",
            "album_id": 3,
        }
        ,
        {
            "name": "Left and Right",
            "genre": "Christian",
            "duration": "02:34",
            "lyrics": "/static/lyrics/3_left_and_right.txt",
            "date_created" : "2022-10-07",
            "album_id": 3,
        }
        ,
        {
            "name": "Loser",
            "genre": "Christian",
            "duration": "03:24",
            "lyrics": "/static/lyrics/3_loser.txt",
            "date_created" : "2022-10-07",
            "album_id": 3,
        }
        ,
        {
            "name": "I Don't Think That I Like Her",
            "genre": "Christian",
            "duration": "03:08",
            "lyrics": "/static/lyrics/3_I_dont_think_that_I_like_her.txt",
            "date_created" : "2022-10-07",
            "album_id": 3,
        }
        ,
    ]

    for song in songs:
        db.session.add(Song(**song))
    db.session.commit()

    for song in songs:
        s = Song.query.filter_by(name=song["name"]).first()
        if s:
            sid = s.id
            aid = s.album_id
            existing_association = Association.query.filter_by(album_id=aid, song_id=sid).first()

            if not existing_association:
                asso = Association(album_id=aid, song_id=sid)
                db.session.add(asso)
    db.session.commit()
