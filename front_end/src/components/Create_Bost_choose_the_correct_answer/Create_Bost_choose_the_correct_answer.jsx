import React, { useState } from 'react';
import "./Create_Bost_choose_the_correct_answer.css";
import Menu from '../main_menu/Menu';
import Chat from '../chat/Chat';
import { useNavigate } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import axios from 'axios';

const Create_Bost_choose_the_correct_answer = () => {
  const Navigate = useNavigate();
  const [cookies] = useCookies(["token"]);
  const [errors, setErrors] = useState({});

  const [questions, setQuestions] = useState([
    { question: '', Answer_1: '', Answer_2: '', Answer_3: '', Answer_4: '' }
  ]);

  const addNewQuestion = () => {
    setQuestions(prev => {
      const newQuestions = [...prev, { question: '', Answer_1: '', Answer_2: '', Answer_3: '', Answer_4: '' }];
      // التمرير إلى آخر عنصر بعد إضافته
      setTimeout(() => {
        const lastQuestion = document.querySelector('.form:last-child');
        lastQuestion?.scrollIntoView({ behavior: 'smooth' });
      },0); // تأخير بسيط لضمان إضافة السؤال أولًا
      return newQuestions;
    });
  };

  const handleInputChange = (index, field, value) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index][field] = value;
    setQuestions(updatedQuestions);
  };

  const handleSubmit = async () => {
    try {
      const preparedQuestions = questions.map((q) => {
        // اجمع الإجابات في مصفوفة
        const answers = [q.Answer_1, q.Answer_2, q.Answer_3, q.Answer_4];
        
        // حدد الإجابة الصحيحة
        const correctAnswer = q.Answer_1;
        
        // قم بإزالة الإجابة الصحيحة من المصفوفة
        const otherAnswers = answers.filter(answer => answer !== correctAnswer);
        
        // امزج الإجابات الأخرى عشوائيًا باستخدام خوارزمية Fisher-Yates
        const shuffleArray = (array) => {
          for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1)); // اختر فهرس عشوائي
            [array[i], array[j]] = [array[j], array[i]]; // تبديل العناصر
          }
        };
        
        shuffleArray(otherAnswers); // خلط الإجابات الأخرى عشوائيًا
        
        // ضع الإجابة الصحيحة في مكان عشوائي
        const randomIndex = Math.floor(Math.random() * 4); // اختر مكان عشوائي
        otherAnswers.splice(randomIndex, 0, correctAnswer); // إضافة الإجابة الصحيحة في مكان عشوائي
  
        // وضع الإجابات في الحقول المناسبة
        const [Answer_1, Answer_2, Answer_3, Answer_4] = otherAnswers;
        
        return {
          question: q.question,
          Answer_1: Answer_1,
          Answer_2: Answer_2,
          Answer_3: Answer_3,
          Answer_4: Answer_4,
          correctAnswer: correctAnswer, // يمكن أن تكون موجودة أيضًا للإشارة إلى الإجابة الصحيحة
        };
      });
  
      // إرسال البيانات إلى الخادم
      await axios.post(`http://localhost:8000/api/v2/post/post_2`, {
        questions: preparedQuestions
      }, {
        headers: {
          Authorization: `Bearer ${cookies.token}`,
        },
      });
  
      // بعد الإرسال، نقوم بتوجيه المستخدم إلى الصفحة الرئيسية
      Navigate('/');
      console.log("ddddd")
    } catch (err) {
      if (err.response?.data?.errors) {
        const formattedErrors = {};
        err.response.data.errors.forEach(error => {
          formattedErrors[error.path] = error.msg;
        });
        setErrors(formattedErrors);
        console.log(formattedErrors);
        console.log("rrrrrr")
      }
    }
  };
  
  
  
  
  
  
  

  return (
    <div className="home">
      <div className="container">
        <Menu />
        <div className="Create_Bost_choose_the_correct_answer">
          <h2>Create Bost Choose The Correct Answer</h2>

          <div className="all_form">
            {questions.map((q, idx) => (
              <div className="form" key={idx}>
                <div className="question_error">
                  {errors[`questions[${idx}]`] && (
                    <p className='errors'>{errors[`questions[${idx}]`]}</p>
                  )}
                  <input
                    type="text"
                    placeholder={`Question ${idx + 1}`}
                    value={q.question}
                    onChange={(e) => handleInputChange(idx, 'question', e.target.value)}
                  />
                </div>

                <div className="inpots">
                  {["Answer_1", "Answer_2", "Answer_3", "Answer_4"].map((answerKey, i) => (
                    <div key={i} className="div_error">

                      <input
                        type="text"
                        placeholder={`Answer ${i + 1}`}
                        value={q[answerKey]}
                        onChange={(e) => handleInputChange(idx, answerKey, e.target.value)}
                      />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
            <div className="butin">
            <button type="button" className="add-question-btn" onClick={addNewQuestion}>
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

export default Create_Bost_choose_the_correct_answer;
