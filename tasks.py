from celery import shared_task
from model import Song, User, Role
import flask_excel as excel
# from .mail_service import send_message
from model import User, Role
from jinja2 import Template
from mailservice import send_message
import os

from datetime import datetime, timedelta
from flask import render_template_string
from flask_mail import Message
from sqlalchemy import func
# from . import mail  # Assuming you have a Flask-Mail instance named 'mail'
from model import User

@shared_task(ignore_result=False)
def create_resource_csv():
    song_tab = Song.query.with_entities(Song.name, Song.genre, Song.lyrics, Song.duration, Song.date_created).all()

    csv_output = excel.make_response_from_query_sets(
        song_tab, ["name", "genre", "lyrics", "duration", "date_created"], "csv")
    filename = "test.csv"

    with open(filename, 'wb') as f:
        f.write(csv_output.data)
    return filename

@shared_task(ignore_result=True)
def daily_reminder(to, subject):
    users = User.query.filter(User.roles.any(Role.name == 'User')).all()
    for user in users:
        email_content = render_template_string(
        """
        <h1>Music Streaming App Visit</h1>
        <p>Hello {{name}},</p>
        <p>We hope this message finds you well. We wanted to remind you that there are new songs available in our music streaming app.</p>
        <p>We are looking forward for your visit soon.</p>
        <p>Best regards,</p>
        <p>The Amplifi Music Streaming App Team</p>
        """,
        name=user.username
        )
        send_message( user.email, subject,email_content)
    return "OK"

@shared_task(ignore_result=True)
def monthly_report(to, subject):
    Creator = User.query.filter(User.roles.any(Role.name == 'Creator')).all()
    c = datetime.now()
    current_date = c.strftime('%Y-%m-%d')
    past_date = (c - timedelta(days=30)).strftime('%Y-%m-%d')

    viewed = Playlist.query.with_entities(Playlist.user_id, Playlist.song_id, Playlist.song_name).all()

    for creator in Creator:
        html_report = render_template_string("""
            <html>
                <head></head>
                <body>
                    <h2>Monthly Report</h2>
                    <h3> Hello {{ creatorname }}</h3>  
                    <p>Here is the monthly report of the songs viewed in the last 30 days</p>
                    <p>from {{past_date}} to {{current_date}} </p>             
                    <table border="1">
                        <tr>
                            <th>User ID</th>
                            <th>Song ID</th>
                            <th>Song Name</th>
                        </tr>
                        {% for view in viewed %}
                            <tr>
                                <td>{{ view.user_id }}</td>
                                <td>{{ view.song_id }}</td>
                                <td>{{ view.song_name }}</td>
                            </tr>
                        {% endfor %}
                    </table>
                </body>
            </html>
        """,  viewed=viewed, creatorname=creator.username, past_date=past_date, current_date=current_date)
        send_message(creator.email, subject, html_report)
    return "OK"
