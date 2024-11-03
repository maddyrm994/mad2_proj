from flask import Flask, render_template ,request,redirect, url_for, jsonify
from model import *
from api import *
from flask_cors import CORS
from config import MusicConfig
from flask_security import Security, SQLAlchemyUserDatastore, UserMixin, RoleMixin, login_required
from flask_security import auth_required, roles_required, current_user
from werkzeug.security import check_password_hash, generate_password_hash
from flask_restful import marshal, fields
from sec import datastore
from sqlalchemy.orm.exc import NoResultFound
from worker import celery_init_app
from tasks import create_resource_csv, daily_reminder, monthly_report
from flask import send_file
from celery.result import AsyncResult
import flask_excel as excel
from celery.schedules import crontab
from mailservice import send_message
from flask_mail import Message
from psycopg2 import *

def create_app():
    app = Flask(__name__)
    app.config.from_object(MusicConfig)
    CORS(app)
    api.init_app(app)
    db.init_app(app)
    excel.init_excel(app)
    app.security = Security(app, datastore)
    app.app_context().push()
    celery_app = celery_init_app(app)
    return app, celery_app

app,celery_app = create_app()

def get_user_roles():
    if current_user.is_authenticated:
        return [role.name for role in current_user.roles]
    else:
        return []

@app.get('/')
def index():
    return render_template('index.html')

@app.get('/admin')
@auth_required("token")
@roles_required("Admin")
def Admin():
    return "Hello Admin"

@app.get('/activate/creator/<int:id>')
@auth_required("token")
@roles_required("Admin")
def activate_user(id):
    User.query.filter_by(id = id).update({'active':True})
    db.session.commit()
    return jsonify({"message":"Creator activated"})

@app.get('/deactivate/creator/<int:id>')
@auth_required("token")
@roles_required("Admin")
def deactivate_user(id):
    User.query.filter_by(id = id).update({'active':False})
    db.session.commit()
    return jsonify({"message":"Creator deactivated"})

@app.get('/activate/album/<int:id>')
@auth_required("token")
@roles_required("Admin")
def activate_album(id):
    Album.query.filter_by(id = id).update({'active':True})
    db.session.commit()
    return jsonify({"message":"Album activated"})

@app.get('/deactivate/album/<int:id>')
@auth_required("token")
@roles_required("Admin")
def deactivate_album(id):
    Album.query.filter_by(id = id).update({'active':False})
    db.session.commit()
    return jsonify({"message":"Album deactivated"})

@app.post('/user-login')
def user_login():
    data = request.get_json()
    email = data.get('email')
    if not email:
        return jsonify({"message": "Email not provided"}), 400

    user = datastore.find_user(email=email)
    if not user:
        return jsonify({"message": "User Not Found"}), 404

    if not user.active:
        return jsonify({"message": "User Not Activated"}), 400

    if check_password_hash(user.password, data.get("password")):
        return jsonify({"token": user.get_auth_token(), "email": user.email, "role": user.roles[0].name, "username": user.username, "id": user.id})
    else:
        return jsonify({"message": "Wrong Password"}), 400
    
@app.post('/user-registration')
def user_registration():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')
    username = data.get('username')
    if not email:
        return jsonify({"message": "Email not provided"}), 400
    if not password:
        return jsonify({"message": "Password not provided"}), 400
    if not username:
        return jsonify({"message": "Username not provided"}), 400
    if datastore.find_user(email=email):
        return jsonify({"message": "User Already Exists"}), 400
    else:
        datastore.create_user(username=username, email=email, password=generate_password_hash(password), roles=["User"])
        db.session.commit()
        return jsonify({"message": "User Created"}), 201

@app.post('/creator-registration')
def creator_registration():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')
    username = data.get('username')
    if not email:
        return jsonify({"message": "Email not provided"}), 400
    if not password:
        return jsonify({"message": "Password not provided"}), 400
    if not username:
        return jsonify({"message": "Username not provided"}), 400
    if datastore.find_user(email=email):
        return jsonify({"message": "User Already Exists"}), 400
    else:
        datastore.create_user(username=username, email=email, password=generate_password_hash(password), roles=["Creator"],active=False)
        db.session.commit()
        return jsonify({"message": "User Created"}), 201

user_fields = {
    "id": fields.Integer,
    "username": fields.String,
    "email": fields.String,
    "active": fields.Boolean,
}

@app.get('/users')
@auth_required("token")
@roles_required("Admin")
def all_users():
    users = User.query.all()
    if len(users) == 0:
        return jsonify({"message": "No User Found"}), 404
    return marshal(users, user_fields)

@app.get('/download_csv')
@auth_required("token")
@roles_required("Creator")
def download_csv():
    task = create_resource_csv.delay()
    return jsonify({"task-id": task.id})
    

@app.get('/get-csv/<task_id>')
def get_csv(task_id):
    res = AsyncResult(task_id)
    if res.ready():
        filename = res.result
        return send_file(filename, as_attachment=True)
    else:
        return jsonify({"message": "Task Pending"}), 404

@celery_app.on_after_configure.connect
def send_email(sender, **kwargs):
    sender.add_periodic_task(
        crontab(hour=8, minute=20),
        daily_reminder.s('admin@gmail.com', 'Daily Test'),
    )

@celery_app.on_after_configure.connect
def send_report(sender, **kwargs):
    sender.add_periodic_task(
        crontab(hour=8, minute=20),
        monthly_report.s('admin@gmail.com', 'Monthly Report'),)

if __name__ == '__main__':
    app.run(debug=True, port=5000)
