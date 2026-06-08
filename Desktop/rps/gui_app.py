import tkinter as tk
import random

# Main window
root = tk.Tk()
root.title("Rock Paper Scissors")
root.geometry("400x500")
root.configure(bg="#1e1e2e")
root.resizable(False, False)

choices = ["Rock", "Paper", "Scissors"]

# Functions
def play(user_choice):
    computer_choice = random.choice(choices)

    result = ""
    if user_choice == computer_choice:
        result = "It's a Tie 😐"
    elif (
        (user_choice == "Rock" and computer_choice == "Scissors") or
        (user_choice == "Paper" and computer_choice == "Rock") or
        (user_choice == "Scissors" and computer_choice == "Paper")
    ):
        result = "You Win 🎉"
    else:
        result = "You Lose 😢"

    user_label.config(text=f"You: {user_choice}")
    comp_label.config(text=f"Computer: {computer_choice}")
    result_label.config(text=result)

# UI Components
title = tk.Label(root, text="Rock Paper Scissors", font=("Arial", 20, "bold"),
                 bg="#1e1e2e", fg="#f5c2e7")
title.pack(pady=20)

user_label = tk.Label(root, text="You: ", font=("Arial", 14),
                      bg="#1e1e2e", fg="white")
user_label.pack()

comp_label = tk.Label(root, text="Computer: ", font=("Arial", 14),
                      bg="#1e1e2e", fg="white")
comp_label.pack()

result_label = tk.Label(root, text="", font=("Arial", 16, "bold"),
                        bg="#1e1e2e", fg="#a6e3a1")
result_label.pack(pady=20)

# Buttons
btn_frame = tk.Frame(root, bg="#1e1e2e")
btn_frame.pack(pady=30)

tk.Button(btn_frame, text="🪨 Rock", font=("Arial", 12),
          width=10, bg="#fab387",
          command=lambda: play("Rock")).grid(row=0, column=0, padx=10)

tk.Button(btn_frame, text="📄 Paper", font=("Arial", 12),
          width=10, bg="#89b4fa",
          command=lambda: play("Paper")).grid(row=0, column=1, padx=10)

tk.Button(btn_frame, text="✂ Scissors", font=("Arial", 12),
          width=10, bg="#f38ba8",
          command=lambda: play("Scissors")).grid(row=0, column=2, padx=10)

# Start app
root.mainloop()
