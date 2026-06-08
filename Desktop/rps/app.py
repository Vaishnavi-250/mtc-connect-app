from flask import Flask, render_template, request, jsonify
import random

app = Flask(__name__)

choices = ["Rock", "Paper", "Scissors"]

def evaluate(user_choice, computer_choice):
    if user_choice == computer_choice:
        return "It's a Tie 😐"
    elif (
        (user_choice == "Rock" and computer_choice == "Scissors") or
        (user_choice == "Paper" and computer_choice == "Rock") or
        (user_choice == "Scissors" and computer_choice == "Paper")
    ):
        return "You Win 🎉"
    else:
        return "You Lose 😢"

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/play', methods=['POST'])
def play():
    data = request.get_json() or {}
    user_choice = data.get('choice')
    if user_choice not in choices:
        return jsonify({'error': 'Invalid choice'}), 400
    computer_choice = random.choice(choices)
    result = evaluate(user_choice, computer_choice)
    return jsonify({'user': user_choice, 'computer': computer_choice, 'result': result})

if __name__ == '__main__':
    app.run(host='127.0.0.1', port=5000, debug=True)