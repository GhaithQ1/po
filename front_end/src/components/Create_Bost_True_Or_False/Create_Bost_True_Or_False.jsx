import React, { useState } from 'react';
import "./Create_Bost_True_Or_False.css";
import Menu from '../main_menu/Menu';
import Chat from '../chat/Chat';
import { useNavigate } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import axios from 'axios';

const Create_Bost_True_Or_False = () => {
  const [formErrors, setFormErrors] = useState({});
  const [questions, setQuestions] = useState([{ question: '', condition: '' }]); // البداية مع سؤال واحد
  const Navigate = useNavigate();
  const [cookies] = useCookies(["token"]);

  // تحديث الأسئلة
  const handleQuestionChange = (index, event) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index][event.target.name] = event.target.value;
    setQuestions(updatedQuestions);
  };

  // تغيير حالة الإجابة
  const handleConditionChange = (index, value) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index].condition = value;
    setQuestions(updatedQuestions);
  };

  // إضافة سؤال جديد بعد تعبئة السؤال الحالي
  const handleAddQuestion = () => {
    setQuestions([...questions, { question: '', condition: '' }]); // إضافة سؤال جديد
    // التمرير إلى آخر عنصر بعد إضافته
    setTimeout(() => {
      const lastQuestion = document.querySelector('.form:last-child');
      lastQuestion?.scrollIntoView({ behavior: 'smooth' });
    }, 0);
  };

    const handleRemoveForm = (index) => {
    setQuestions((prevForms) => prevForms.filter((_, idx) => idx !== index)); // إزالة النموذج
  };
  // إرسال البيانات إلى الخادم
  const handleSubmit = () => {
    axios.post('http://localhost:8000/api/v2/post/post_3', {
      questions: questions.map(q => ({
        question: q.question,
        condition: q.condition === 'true' ? true : false
      }))
    }, {
      headers: {
        Authorization: `Bearer ${cookies.token}`,
      },
    }).then((res) => {
      Navigate('/');
    }).catch((err) => {
      if (err.response?.data?.errors) {
        const formattedErrors = {};
        err.response.data.errors.forEach(error => {
          formattedErrors[error.path] = error.msg;
        });
        setFormErrors(formattedErrors);
      }
    });
  };

  return (
    <div className="home">
      <div className="container">
        <Menu />
        <div className="Create_Bost_True_Or_False">
          <h2>Create Bost True Or False</h2>
          <div className="all_form">
            {questions.map((question, index) => {
              return (
                <div key={index} className="form">
                                  <button
                  type="button"
                  className="remove_form_btn"
                  onClick={() => handleRemoveForm(index)}
                >
                  X
                </button>
                  <div className="diverrors">
                    {formErrors[`questions[${index}].question`] && (
                      <p className="errors">{formErrors[`questions[${index}].question`]}</p>
                    )}
                    <input
                      type="text"
                      placeholder={`Put the question ${index + 1}.`}
                      value={question.question}
                      name="question"
                      onChange={(e) => handleQuestionChange(index, e)}
                    />
                  </div>
                  <div className="inpots">
                    <span
                      className={question.condition === "true" ? "active" : ""}
                      onClick={() => handleConditionChange(index, "true")}>
                      True
                    </span>
                    <span
                      className={question.condition === "false" ? "active" : ""}
                      onClick={() => handleConditionChange(index, "false")}>
                      False
                    </span>
                  </div>
                </div>
              );
            })}

          </div>
          <div className="butin">
          <button type="button" className="add-question-btn" onClick={handleAddQuestion}>
  <span className="icon">＋</span> Another Question
</button>
            <button type="submit" className="submit_btn" onClick={handleSubmit}>Submit</button>
          </div>
        </div>
        <Chat />
      </div>
    </div>
  );
};

export default Create_Bost_True_Or_False;
