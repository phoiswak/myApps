/*
    Author: Khorommbi Irvin Phosiwa
    Date: 20 January 2023
    Purpose: Creating a Hangman game using Windows Forms
    OS: Windows 11
*/

using System;
using System.Collections.Generic;
using System.Drawing;
using System.Linq;
using System.Windows.Forms;

namespace Hangman_project
{
    public partial class Form1 : Form
    {
        string Word = "";
        List<Label> labels = new List<Label>();
        int amount = 0;

        // Stores ALL guessed letters (correct and wrong)
        HashSet<char> guessedLetters = new HashSet<char>();

        string[] words = { "snail", "bath", "board", "frog", "cloud", "corn", "suit" };

        public Form1()
        {
            InitializeComponent();
        }

        enum BodyParts
        {
            Rope,
            Head,
            Left_Eye,
            Right_Eye,
            Mouth,
            Body,
            Left_Arm,
            Right_Arm,
            Left_Leg,
            Right_Leg
        }

        private void Form1_Shown(object sender, EventArgs e)
        {
            this.KeyPreview = true;
            this.KeyPress += Form1_KeyPress;

            StartGame();
        }

        void StartGame()
        {
            panel1.Refresh();
            DrawHangPost();
            MakeLabels();

            guessedLetters.Clear();
            amount = 0;
            label2.Text = "Missed: ";
        }

        void DrawHangPost()
        {
            Graphics g = panel1.CreateGraphics();
            Pen p = new Pen(Color.Black, 5);

            g.DrawLine(p, new Point(242, 404), new Point(242, 5));
            g.DrawLine(p, new Point(247, 5), new Point(65, 5));
            g.DrawLine(p, new Point(60, 0), new Point(60, 40));
        }

        void DrawBodyPart(BodyParts bp)
        {
            Graphics g = panel1.CreateGraphics();
            Pen p = new Pen(Color.Black, 2);
            SolidBrush s = new SolidBrush(Color.Black);

            switch (bp)
            {
                case BodyParts.Rope:
                    g.DrawLine(p, new Point(60, 0), new Point(60, 50));
                    break;

                case BodyParts.Head:
                    g.DrawEllipse(p, 40, 50, 40, 40);
                    break;

                case BodyParts.Left_Eye:
                    g.FillEllipse(s, 50, 60, 5, 5);
                    break;

                case BodyParts.Right_Eye:
                    g.FillEllipse(s, 63, 60, 5, 5);
                    break;

                case BodyParts.Mouth:
                    g.DrawArc(p, 50, 70, 20, 20, 225, 90);
                    break;

                case BodyParts.Body:
                    g.DrawLine(p, new Point(60, 90), new Point(60, 190));
                    break;

                case BodyParts.Left_Arm:
                    g.DrawLine(p, new Point(60, 100), new Point(30, 85));
                    break;

                case BodyParts.Right_Arm:
                    g.DrawLine(p, new Point(60, 100), new Point(90, 85));
                    break;

                case BodyParts.Left_Leg:
                    g.DrawLine(p, new Point(60, 190), new Point(30, 250));
                    break;

                case BodyParts.Right_Leg:
                    g.DrawLine(p, new Point(60, 190), new Point(90, 250));
                    break;
            }
        }

        void MakeLabels()
        {
            Word = GetRandomWord();
            labels.Clear();
            groupBox2.Controls.Clear();

            char[] chars = Word.ToCharArray();
            int between = 506 / chars.Length - 1;

            for (int i = 0; i < chars.Length; i++)
            {
                Label lbl = new Label();
                lbl.Location = new Point(i * between + 10, 50);
                lbl.Text = "_";
                lbl.AutoSize = true;
                lbl.Font = new Font("Arial", 20, FontStyle.Bold);
                groupBox2.Controls.Add(lbl);
                labels.Add(lbl);
            }

            label1.Text = "Word Length: " + Word.Length;
        }

        string GetRandomWord()
        {
            Random ran = new Random();
            return words[ran.Next(words.Length)];
        }

        private void Form1_KeyPress(object sender, KeyPressEventArgs e)
        {
            char guessedChar = Char.ToLower(e.KeyChar);

            if (!char.IsLetter(guessedChar))
                return;

            if (guessedLetters.Contains(guessedChar))
                return; // Already guessed

            guessedLetters.Add(guessedChar);

            if (Word.Contains(guessedChar))
            {
                UpdateLabels();
                CheckForWin();
            }
            else
            {
                DrawBodyPart((BodyParts)amount);
                amount++;
                label2.Text += " " + guessedChar;
                CheckForLoss();
            }
        }

        void UpdateLabels()
        {
            for (int i = 0; i < Word.Length; i++)
            {
                if (guessedLetters.Contains(Word[i]))
                {
                    labels[i].Text = Word[i].ToString();
                }
            }
        }

        void CheckForWin()
        {
            if (labels.All(l => l.Text != "_"))
            {
                MessageBox.Show(" Congratulations! You guessed the word!");
                StartGame();
            }
        }

        void CheckForLoss()
        {
            if (amount >= Enum.GetNames(typeof(BodyParts)).Length)
            {
                MessageBox.Show(" You lost! The word was: " + Word);
                StartGame();
            }
        }

        private void button3_Click(object sender, EventArgs e)
        {
            // New Game
            StartGame();
        }

        private void button4_Click(object sender, EventArgs e)
        {
            // Quit
            Application.Exit();
        }

        private void btnScore_Click(object sender, EventArgs e)
        {
            int correct = guessedLetters.Count(c => Word.Contains(c));
            int incorrect = guessedLetters.Count(c => !Word.Contains(c));

            MessageBox.Show($"Correct Guesses: {correct}\nIncorrect Guesses: {incorrect}");
        }
    }
}