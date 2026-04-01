from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class Account(db.Model):
    __tablename__ = "accounts"

    acc_no = db.Column(db.String(50), primary_key=True)
    name = db.Column(db.String(50), nullable=False)
    phone = db.Column(db.String(50), nullable=False)
    pin = db.Column(db.Integer, nullable=False)
    balance = db.Column(db.Float, default=0.0)
    email = db.Column(db.String(50), nullable=False)
    cc_email = db.Column(db.String(50), nullable=True)

    transactions = db.relationship("Transaction", backref="account", lazy=True)


class Transaction(db.Model):
    __tablename__ = "transactions"

    id = db.Column(db.Integer, primary_key=True)
    acc_no = db.Column(db.String(50), db.ForeignKey("accounts.acc_no"))
    message = db.Column(db.String(50))
    created_at = db.Column(db.DateTime)

def create_table():
    db.create_all()