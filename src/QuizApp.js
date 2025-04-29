import React, { useState, useEffect } from "react";
import "./App.css";

const mockApi = {
  quizzes: [],
  questions: {},
  createQuiz(quiz) {
    const newQuiz = { ...quiz, id: Date.now(), createdAt: new Date().toISOString(), questions: [] };
    this.quizzes.push(newQuiz);
    return newQuiz;
  },
  updateQuiz(id, data) {
    const index = this.quizzes.findIndex(q => q.id === id);
    if (index !== -1) Object.assign(this.quizzes[index], data);
  },
  deleteQuiz(id) {
    this.updateQuiz(id, { status: "Inactive" });
  },
  createQuestion(quizId, question) {
    const quiz = this.quizzes.find(q => q.id === quizId);
    if (quiz) quiz.questions.push({ id: Date.now(), ...question });
  },
  updateQuestion(quizId, questionId, data) {
    const quiz = this.quizzes.find(q => q.id === quizId);
    if (quiz) {
      const qIndex = quiz.questions.findIndex(q => q.id === questionId);
      if (qIndex !== -1) Object.assign(quiz.questions[qIndex], data);
    }
  }
};

export default function QuizApp() {
  const [quizzes, setQuizzes] = useState([]);
  const [openQuizDialog, setOpenQuizDialog] = useState(false);
  const [editQuiz, setEditQuiz] = useState(null);
  const [viewingQuestions, setViewingQuestions] = useState(null);
  const [questionDialog, setQuestionDialog] = useState(false);
  const [editQuestion, setEditQuestion] = useState(null);

  const [quizForm, setQuizForm] = useState({ title: "", note: "", status: "Active" });
  const [questionForm, setQuestionForm] = useState({ question: "", answers: ["", "", "", ""], correctIndex: 0 });

  useEffect(() => {
    setQuizzes([...mockApi.quizzes]);
  }, []);

  const handleQuizSubmit = () => {
    if (editQuiz) {
      mockApi.updateQuiz(editQuiz.id, quizForm);
    } else {
      mockApi.createQuiz({ ...quizForm });
    }
    setQuizzes([...mockApi.quizzes]);
    setOpenQuizDialog(false);
    setEditQuiz(null);
    setQuizForm({ title: "", note: "", status: "Active" });
  };

  const handleQuestionSubmit = () => {
    const questionData = {
      question: questionForm.question,
      answers: questionForm.answers,
      correctIndex: questionForm.correctIndex
    };
    if (editQuestion) {
      mockApi.updateQuestion(viewingQuestions.id, editQuestion.id, questionData);
    } else {
      mockApi.createQuestion(viewingQuestions.id, questionData);
    }
    setQuizzes([...mockApi.quizzes]);
    setQuestionDialog(false);
    setEditQuestion(null);
    setQuestionForm({ question: "", answers: ["", "", "", ""], correctIndex: 0 });
  };

  return (
    <div className="container">
      <h1 className="main-title">📚 Real-Time Quiz Management</h1>
      <p className="subtitle">Create engaging quizzes, manage questions, and simulate a real-time test environment.</p>
      <button className="primary-btn" onClick={() => setOpenQuizDialog(true)}>➕ Create a New Quiz</button>
      <div className="quiz-list">
        {quizzes.map((quiz) => (
          <div key={quiz.id} className="quiz-card">
            <h2>{quiz.title}</h2>
            <p><strong>Note:</strong> {quiz.note}</p>
            <p><strong>Questions:</strong> {quiz.questions.length}</p>
            <p><strong>Status:</strong> {quiz.status}</p>
            <p><strong>Created At:</strong> {new Date(quiz.createdAt).toLocaleString()}</p>
            <div className="btn-group">
              <button className="secondary-btn" onClick={() => { setEditQuiz(quiz); setQuizForm(quiz); setOpenQuizDialog(true); }}>✏️ Edit</button>
              <button className="danger-btn" onClick={() => { mockApi.deleteQuiz(quiz.id); setQuizzes([...mockApi.quizzes]); }}>🗑️ Delete</button>
              <button className="primary-btn" onClick={() => setViewingQuestions(quiz)}>📋 Questions</button>
            </div>
          </div>
        ))}
      </div>

      {openQuizDialog && (
        <div className="dialog">
          <h3>{editQuiz ? "✏️ Edit Quiz" : "📝 Create Quiz"}</h3>
          <input
            type="text"
            placeholder="Quiz Title"
            value={quizForm.title}
            onChange={(e) => setQuizForm({ ...quizForm, title: e.target.value })}
          />
          <input
            type="text"
            placeholder="Quiz Note"
            value={quizForm.note}
            onChange={(e) => setQuizForm({ ...quizForm, note: e.target.value })}
          />
          <select value={quizForm.status} onChange={(e) => setQuizForm({ ...quizForm, status: e.target.value })}>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
          <button className="primary-btn" onClick={handleQuizSubmit}>✅ Submit</button>
        </div>
      )}

      {viewingQuestions && (
        <div style={{ marginTop: 30 }}>
          <h2>📘 Questions for: {viewingQuestions.title}</h2>
          <button className="primary-btn" onClick={() => setQuestionDialog(true)}>➕ Add Question</button>
          <div>
            {viewingQuestions.questions.map((q, index) => (
              <div key={q.id} className="question-card">
                <strong>Q{index + 1}: {q.question}</strong>
                <ul>
                  {q.answers.map((ans, i) => (
                    <li key={i} className={q.correctIndex === i ? "correct-answer" : ""}>{q.correctIndex === i ? '✔️ ' : ''}{ans}</li>
                  ))}
                </ul>
                <button className="secondary-btn" onClick={() => { setEditQuestion(q); setQuestionForm({ question: q.question, answers: q.answers, correctIndex: q.correctIndex }); setQuestionDialog(true); }}>✏️ Edit</button>
              </div>
            ))}
          </div>
        </div>
      )}

      {questionDialog && (
        <div className="dialog">
          <h3>{editQuestion ? "✏️ Edit Question" : "➕ Add Question"}</h3>
          <input
            type="text"
            placeholder="Question"
            value={questionForm.question}
            onChange={(e) => setQuestionForm({ ...questionForm, question: e.target.value })}
          />
          {questionForm.answers.map((ans, idx) => (
            <div className="answer-input" key={idx}>
              <input
                type="radio"
                checked={questionForm.correctIndex === idx}
                onChange={() => setQuestionForm({ ...questionForm, correctIndex: idx })}
              />
              <input
                type="text"
                placeholder={`Answer ${idx + 1}`}
                value={ans}
                onChange={(e) => {
                  const newAnswers = [...questionForm.answers];
                  newAnswers[idx] = e.target.value;
                  setQuestionForm({ ...questionForm, answers: newAnswers });
                }}
              />
            </div>
          ))}
          <button className="primary-btn" onClick={handleQuestionSubmit}>✅ Submit</button>
        </div>
      )}
    </div>
  );
}
