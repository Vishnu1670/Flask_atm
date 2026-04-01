from flask import Flask  #importing the flask class from the moduel
from models import db  #Importing the database object (db) from models.py
from flask_migrate import Migrate  #It is used for database migration management and Migrate = track & apply database changes automatically
from view import api  #It imports the Blueprint (api) from view.py into app.py

#Create a web app and name it using this file
app = Flask(__name__) 

#To connect the python and Mysql
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+pymysql://root:1122@localhost/atm'
#It disables tracking of object changes in SQLAlchemy.
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

#To connect database object to the flask app
db.init_app(app) 
#To reflect the table package everytime to the sql we use migrate
migrate = Migrate(app,db) 

#It connects the routes (APIs) from view.py to your main Flask app
app.register_blueprint(api) 
  
#Run this code only when this file is executed directly
if __name__ == "__main__":
    app.run(debug=True)