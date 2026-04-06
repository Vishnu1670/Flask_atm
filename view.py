from flask import Blueprint, request, render_template, jsonify#Used for API response
from models import db,Account,Transaction
from datetime import datetime

api = Blueprint('api', __name__)

@api.route('/home')
def home():
    return render_template("index.html")

@api.route('/home/login', methods=['GET','POST'])
def login():
    if request.method == 'POST':
        acc_no = request.form['accno']
        pin = request.form['pin']
        
        reg = Account.query.filter_by(acc_no=acc_no, pin=int(pin)).first()

        if reg:
            return jsonify({
                "message": "Login successful",
                "acc_no": reg.acc_no,
                "name": reg.name
            }), 200
        else:
            return jsonify({
                "error": "Invalid account number or PIN"
            }), 401
    return render_template("index.html")

@api.route('/home/register_page')
def register_page():
    return render_template("register.html")

@api.route('/home/register', methods=['POST'])
def register():

    acc_no = request.form.get('acc_no')
    name = request.form.get('name')
    phone = request.form.get('phone')
    email = request.form.get('email')
    cc_email = request.form.get('cc_email')
    pin = request.form.get('pin')
    balance = request.form.get('balance')

    # Validation
    if not acc_no or not name or not phone or not email or not pin:
        return jsonify({"error": "Missing required fields"}), 400

    # check duplicate account
    existing = Account.query.filter_by(acc_no=acc_no).first()
    if existing:
        return jsonify({"error": "Account already exists"}), 409

    # validate phone
    if not phone.isdigit() or len(phone) != 10:
        return jsonify({"error": "Invalid phone number"}), 400

    # validate pin
    if not pin.isdigit() or len(pin) != 4:
        return jsonify({"error": "PIN must be 4 digits"}), 400

    try:
        balance = float(balance)
        if balance <= 0:
            return jsonify({"error": "Balance must be > 0"}), 400
    except:
        return jsonify({"error": "Invalid balance"}), 400

    # Create account
    new_account = Account(
        acc_no=acc_no,
        name=name,
        phone=phone,
        email=email,
        cc_email=cc_email if cc_email else None,
        pin=int(pin),
        balance=balance
    )

    db.session.add(new_account)
    db.session.commit()

    return jsonify({
        "message": "Account created successfully"
    }), 201

@api.route('/home/dashboard/<acc_no>')
def dashboard(acc_no):
    account = Account.query.filter_by(acc_no=acc_no).first()

    if not account:
        return "Account not found", 404

    return render_template("dashboard.html", account=account)


@api.route('/home/deposit', methods=['POST'])
def deposit():
    acc_no = request.form.get('acc_no')
    amount = float(request.form.get('amount'))

    account = Account.query.get(acc_no)

    if not account:
        return jsonify({"error": "Account not found"}), 404

    account.balance += amount

    txn = Transaction(
        acc_no=acc_no,
        message=f"Deposited ₹{amount}",
        created_at=datetime.now()
    )

    db.session.add(txn)
    db.session.commit()

    return jsonify({"message": "Deposit successful"})


# WITHDRAW
@api.route('/home/withdraw', methods=['POST'])
def withdraw():
    acc_no = request.form.get('acc_no')
    amount = float(request.form.get('amount'))

    account = Account.query.get(acc_no)

    if not account:
        return jsonify({"error": "Account not found"}), 404

    if account.balance < amount:
        return jsonify({"error": "Insufficient balance"}), 400

    account.balance -= amount

    txn = Transaction(
        acc_no=acc_no,
        message=f"Withdraw ₹{amount}",
        created_at=datetime.now()
    )

    db.session.add(txn)
    db.session.commit()

    return jsonify({"message": "Withdraw successful"})


# BALANCE
@api.route('/home/balance/<acc_no>')
def balance(acc_no):
    account = Account.query.get(acc_no)

    if not account:
        return jsonify({"error": "Account not found"}), 404

    return jsonify({"balance": account.balance})


# CHANGE PIN
@api.route('/home/change_pin', methods=['POST'])
def change_pin():
    acc_no = request.form.get('acc_no')
    old_pin = request.form.get('old_pin')
    new_pin = request.form.get('new_pin')

    account = Account.query.get(acc_no)

    if not account or account.pin != int(old_pin):
        return jsonify({"error": "Invalid PIN"}), 400

    account.pin = int(new_pin)
    db.session.commit()

    return jsonify({"message": "PIN changed successfully"})


# FUND TRANSFER
@api.route('/home/transfer', methods=['POST'])
def transfer():
    from_acc = request.form.get('from_acc')
    to_acc = request.form.get('to_acc')
    amount = float(request.form.get('amount'))

    sender = Account.query.get(from_acc)
    receiver = Account.query.get(to_acc)

    if not sender or not receiver:
        return jsonify({"error": "Account not found"}), 404

    if sender.balance < amount:
        return jsonify({"error": "Insufficient balance"}), 400

    sender.balance -= amount
    receiver.balance += amount

    db.session.add(Transaction(acc_no=from_acc, message=f"Sent ₹{amount} to {to_acc}", created_at=datetime.now()))
    db.session.add(Transaction(acc_no=to_acc, message=f"Received ₹{amount} from {from_acc}", created_at=datetime.now()))

    db.session.commit()

    return jsonify({"message": "Transfer successful"})


# STATEMENT
@api.route('/home/transactions/<acc_no>')
def transactions(acc_no):
    txns = Transaction.query.filter_by(acc_no=acc_no).all()

    data = []
    for t in txns:
        data.append({
            "message": t.message,
            "date": t.created_at.strftime("%Y-%m-%d %H:%M")
        })

    return jsonify(data)


# DELETE ACCOUNT
@api.route('/home/delete/<acc_no>', methods=['DELETE'])
def delete(acc_no):
    account = Account.query.get(acc_no)

    if not account:
        return jsonify({"error": "Account not found"}), 404

    db.session.delete(account)
    db.session.commit()

    return jsonify({"message": "Account deleted"})