import os
from flask import Flask
from flask_migrate import Migrate
from models import db
from routes import app as routes_app

app = Flask(__name__)
app.config.from_object('config.Config')
db.init_app(app)

# Initialize Flask-Migrate
migrate = Migrate(app, db)

# Create the uploads directory if it doesn't exist
UPLOAD_FOLDER = os.path.join(os.getcwd(), 'uploads')
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

with app.app_context():
    db.create_all()

app.register_blueprint(routes_app)

if __name__ == '__main__':
    app.run(debug=True)
