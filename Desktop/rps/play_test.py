import random

choices = ["Rock", "Paper", "Scissors"]


def evaluate(user_choice, computer_choice):
    if user_choice == computer_choice:
        return "Tie"
    elif (
        (user_choice == "Rock" and computer_choice == "Scissors") or
        (user_choice == "Paper" and computer_choice == "Rock") or
        (user_choice == "Scissors" and computer_choice == "Paper")
    ):
        return "User"
    else:
        return "Computer"


if __name__ == "__main__":
    # Run 10 random rounds for each user choice
    for user_choice in choices:
        print(f"--- Testing user choice: {user_choice} ---")
        for i in range(10):
            comp = random.choice(choices)
            winner = evaluate(user_choice, comp)
            print(f"User: {user_choice} | Computer: {comp} -> {winner}")
        print()
