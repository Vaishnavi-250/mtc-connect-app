from flask import Flask, render_template, request, jsonify
import random

app = Flask(__name__)

choices = ["Rock", "Paper", "Scissors"]


def evaluate(user_choice, computer_choice, win_streak=0):
    if user_choice == computer_choice:
        points = 5
        outcome = "tie"
        result_text = "It's a Tie 😐"
        streak_text = "Tie keeps the game tense."
    elif (
        (user_choice == "Rock" and computer_choice == "Scissors") or
        (user_choice == "Paper" and computer_choice == "Rock") or
        (user_choice == "Scissors" and computer_choice == "Paper")
    ):
        points = 10
        outcome = "win"
        bonus = 0
        result_text = "You Win 🎉"
        streak_text = "You're on a roll!"
        if win_streak >= 3:
            bonus = 5
            points += bonus
            streak_text = "Combo bonus activated!"
        return outcome, result_text, points, bonus, streak_text
    else:
        points = -5
        outcome = "loss"
        result_text = "You Lose 😢"
        streak_text = "Don't give up. Learn and strike back."

    return outcome, result_text, points, 0, streak_text


@app.route('/')
def index():
    return render_template('index.html')

@app.route('/play', methods=['POST'])
def play():
    data = request.get_json() or {}
    user_choice = data.get('choice')
    win_streak = int(data.get('win_streak', 0) or 0)

    if user_choice not in choices:
        return jsonify({'error': 'Invalid choice'}), 400

    computer_choice = random.choice(choices)
    outcome, result_text, points, bonus, streak_text = evaluate(user_choice, computer_choice, win_streak)

    return jsonify({
        'user': user_choice,
        'computer': computer_choice,
        'result': result_text,
        'outcome': outcome,
        'points': points,
        'bonus': bonus,
        'streakText': streak_text
    })

if __name__ == '__main__':
    app.run(host='127.0.0.1', port=5000, debug=True)