# Music Streaming Application Version 2

This is version 2 of a music streaming web application. The application enables users to play songs, view lyrics, and create playlists. Admins oversee the app data, while creators can upload and manage their own songs.

## Features
- **Roles**:
  - **Admin**: Manages all data, approves albums, and can send reminder and report emails.
  - **User**: Can view songs, create playlists, and enjoy streaming features.
  - **Creator**: Can upload songs, suggest albums (admin approval required), and manage their content.

- **Functionalities**:
  - Play songs, view lyrics, and create personal playlists.
  - Token-based authentication for secure access and role-based permissions.
  - Admins can send daily reminder emails to users and monthly report emails to creators.
  - Batch processing via Celery and Redis for scheduled jobs and caching.

## Technologies Used
- **Backend**: Flask, Flask-SQLAlchemy, Redis, Celery, Werkzeug
- **Frontend**: VueJS
- **Database**: SQLite
- **Caching and Task Queue**: Redis and Celery

## Database Design
The database schema is structured to ensure data normalization, integrity, and flexibility. Primary and foreign key constraints are applied to enforce relationships, and fields are nullable where appropriate to allow optional data.

## API Design
A RESTful API, built with Flask, supports CRUD operations (`GET`, `POST`, `PUT`, and `DELETE`) for managing albums, songs, and playlists.

## Architecture
This application follows a modular architecture:
- **Models**: Defined in `model.py`, covering entities such as Album, Song, User, Role, Playlist, and associations.
- **Controllers**: Defined in `app.py` and `api.py`, handling application logic and API routes.
- **Token-based Authentication**: Implemented to secure access and authorize actions for Admin, User, and Creator roles.
---
