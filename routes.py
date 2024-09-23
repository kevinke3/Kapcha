from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from werkzeug.security import generate_password_hash, check_password_hash
from models import db, User

app = Blueprint('app', __name__)

@app.route('/register', methods=['POST'])
def register():
    data = request.json
    existing_user = User.query.filter((User.username == data['username']) | 
                                       (User.email == data['email'])).first()
    if existing_user:
        return jsonify({"msg": "User already exists"}), 409
    
    hashed_password = generate_password_hash(data['password'], method='pbkdf2:sha256')
    new_user = User(username=data['username'], email=data['email'], password=hashed_password)
    db.session.add(new_user)
    db.session.commit()
    return jsonify({"msg": "User registered"}), 201

@app.route('/login', methods=['POST'])
def login():
    data = request.json
    user = User.query.filter_by(email=data['email']).first()
    if user and check_password_hash(user.password, data['password']):
        access_token = create_access_token(identity=user.id)
        return jsonify(access_token=access_token), 200
    return jsonify({"msg": "Bad credentials"}), 401

# User Profile Management

@app.route('/profile', methods=['GET'])
@jwt_required()
def get_profile():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    if not user:
        return jsonify({"msg": "User not found"}), 404
    
    return jsonify({
        "username": user.username,
        "email": user.email
    }), 200

@app.route('/profile/update', methods=['PUT'])
@jwt_required()
def update_profile():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    if not user:
        return jsonify({"msg": "User not found"}), 404
    
    data = request.json
    if 'username' in data:
        user.username = data['username']
    if 'email' in data:
        user.email = data['email']
    if 'password' in data:
        user.password = generate_password_hash(data['password'], method='pbkdf2:sha256')
    
    db.session.commit()
    return jsonify({"msg": "Profile updated"}), 200

# Image Upload

@app.route('/upload', methods=['POST'])
@jwt_required()
def upload_image():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    if not user:
        return jsonify({"msg": "User not found"}), 404
    
    if 'image' not in request.files:
        return jsonify({"msg": "No file part"}), 400

    file = request.files['image']
    if file.filename == '':
        return jsonify({"msg": "No selected file"}), 400

    if file:
        filename = secure_filename(file.filename)
        file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
        return jsonify({"msg": "Image uploaded successfully", "filename": filename}), 201

    return jsonify({"msg": "Failed to upload image"}), 500

# likes and comments

@app.route('/images/<int:image_id>/like', methods=['POST'])
@jwt_required()
def like_image(image_id):
    image = Image.query.get(image_id)
    if not image:
        return jsonify({"msg": "Image not found"}), 404

    image.likes += 1
    db.session.commit()
    return jsonify({"msg": "Image liked", "likes": image.likes}), 200

@app.route('/images/<int:image_id>/comments', methods=['POST'])
@jwt_required()
def post_comment(image_id):
    image = Image.query.get(image_id)
    if not image:
        return jsonify({"msg": "Image not found"}), 404

    data = request.json
    if 'content' not in data:
        return jsonify({"msg": "Content is required"}), 400

    comment = Comment(
        image_id=image.id,
        user_id=get_jwt_identity(),
        content=data['content']
    )
    db.session.add(comment)
    db.session.commit()
    return jsonify({"msg": "Comment posted"}), 201

@app.route('/images/<int:image_id>/comments', methods=['GET'])
def get_comments(image_id):
    image = Image.query.get(image_id)
    if not image:
        return jsonify({"msg": "Image not found"}), 404

    comments = Comment.query.filter_by(image_id=image.id).all()
    return jsonify([{"content": comment.content, "user_id": comment.user_id} for comment in comments]), 200

# private profile

@app.route('/profile/private', methods=['PUT'])
@jwt_required()
def toggle_private_account():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    if not user:
        return jsonify({"msg": "User not found"}), 404

    user.is_private = not user.is_private  # Toggle the privacy setting
    db.session.commit()
    return jsonify({"msg": "Account privacy updated", "is_private": user.is_private}), 200

# search

@app.route('/api/users/search', methods=['GET'])
def search_users():
    username = request.args.get('username')
    if username:
        users = User.query.filter(User.username.like(f'%{username}%')).all()
        results = [{'id': user.id, 'username': user.username} for user in users]
        return jsonify(results), 200
    return jsonify([]), 200
