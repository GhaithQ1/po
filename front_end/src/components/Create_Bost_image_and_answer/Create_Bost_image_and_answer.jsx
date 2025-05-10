import React, { useState } from 'react';
import "./Create_Bost_image_and_answer.css";
import Menu from '../main_menu/Menu';
import Chat from '../chat/Chat';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useCookies } from 'react-cookie';

const Create_Bost_image_and_answer = () => {
  const [questions, setQuestions] = useState([
    { img: null, word_1: "", word_2: "", word_3: "", word_4: "", correctWord: "" }
  ]);
  const [formErrors, setFormErrors] = useState({});
  const [cookies] = useCookies(['token']);
  const navigate = useNavigate();

  const addNewQuestion = () => {
    setQuestions([...questions, { img: null, word_1: "", word_2: "", word_3: "", word_4: "", correctWord: "" }]);
    setTimeout(() => {
      const lastQuestion = document.querySelector('.form:last-child');
      console.log(lastQuestion)
      lastQuestion?.scrollIntoView({ behavior: 'smooth' });
    }, );
  };
    const handleRemoveForm = (index) => {
    setQuestions((prevForms) => prevForms.filter((_, idx) => idx !== index)); // إزالة النموذج
  };

  const handleImageChange = (e, index) => {
    const file = e.target.files[0];
    if (file) {
      const updatedQuestions = [...questions];
      updatedQuestions[index].img = file;
      setQuestions(updatedQuestions);
    }
  };

  const handleInputChange = (questionIndex, field, value) => {
    const updatedQuestions = [...questions];
    updatedQuestions[questionIndex][field] = value;
    setQuestions(updatedQuestions);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
  
    try {
      const formData = new FormData();
  
      // تحضير الأسئلة وإجاباتها مع ترتيب عشوائي
      const preparedQuestions = questions.map((q) => {
        const answers = [q.word_1, q.word_2, q.word_3, q.word_4];
        const correctAnswer = q.word_1;
  
        // إزالة الإجابة الصحيحة وخلط الباقي
        const otherAnswers = answers.filter(answer => answer !== correctAnswer);
  
        const shuffleArray = (array) => {
          for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
          }
        };
  
        shuffleArray(otherAnswers);
  
        // إدخال الإجابة الصحيحة في مكان عشوائي
        const randomIndex = Math.floor(Math.random() * 4);
        otherAnswers.splice(randomIndex, 0, correctAnswer);
  
        const [word_1, word_2, word_3, word_4] = otherAnswers;
  
        return {
          question: q.question,  // إضافة السؤال
          word_1,
          word_2,
          word_3,
          word_4,
          correctWord: correctAnswer,
          img: q.img || null  // التأكد من إضافة الصورة إذا كانت موجودة
        };
      });
  
      // تعبئة البيانات في formData
      preparedQuestions.forEach((q, index) => {
        formData.append(`questions[${index}][question]`, q.question);
        if (q.img) {
          formData.append(`questions[${index}][img]`, q.img);
        }
        formData.append(`questions[${index}][word_1]`, q.word_1);
        formData.append(`questions[${index}][word_2]`, q.word_2);
        formData.append(`questions[${index}][word_3]`, q.word_3);
        formData.append(`questions[${index}][word_4]`, q.word_4);
        formData.append(`questions[${index}][correctWord]`, q.correctWord);
      });
  
      // إرسال البيانات إلى الخادم
      await axios.post('http://localhost:8000/api/v2/post/post_4', formData, {
        headers: {
          Authorization: `Bearer ${cookies.token}`,
        },
      });
  
      navigate('/'); // التوجيه إلى الصفحة الرئيسية بعد الإرسال
    } catch (err) {
      if (err.response?.data?.errors) {
        const formattedErrors = {};
        err.response.data.errors.forEach(error => {
          formattedErrors[error.path] = error.msg;
        });
        setFormErrors(formattedErrors);
        console.log(formattedErrors); // طباعة الأخطاء إذا حدثت
      }
    }
  };
  



  return (
    <div className="home">
      <div className="container">
        <Menu />
        <div className="Create_Bost_image_and_answer">
          <h2>Create Bost Image And Word</h2>
          <form className="unified_form" onSubmit={handleSubmit}>
            {questions.map((question, index) => (
              <div key={index} className="form">
                <button
                  type="button"
                  className="remove_form_btn"
                  onClick={() => handleRemoveForm(index)}
                >
                  X
                </button>
                <label className="image-box">
                  {question.img ? (
                    <img src={URL.createObjectURL(question.img)} alt="preview" className="preview-image" />
                  ) : formErrors[`questions[${index}].img`] ? (
                    <p className="image_error">{formErrors[`questions[${index}].img`]}</p>
                  ) : (
                    <span className="plus-sign">+</span>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    style={{ display: 'none' }}
                    onChange={(e) => handleImageChange(e, index)}
                  />
                </label>
                <div className="all_input_answer">
                  <div className="word_error">
                  {formErrors[`questions`] && (
                      <p className="_error">{formErrors[`questions`]}</p>
                    )}
                    <input
                      className="input_ward"
                      type="text"
                      placeholder="Word 1"
                      value={question.word_1}
                      onChange={(e) => handleInputChange(index, "word_1", e.target.value)}
                    />
                  </div>

                  <div className="word_error">

                    <input
                      className="input_ward"
                      type="text"
                      placeholder="Word 2"
                      value={question.word_2}
                      onChange={(e) => handleInputChange(index, "word_2", e.target.value)}
                    />
                  </div>

                  <div className="word_error">
    
                    <input
                      className="input_ward"
                      type="text"
                      placeholder="Word 3"
                      value={question.word_3}
                      onChange={(e) => handleInputChange(index, "word_3", e.target.value)}
                    />
                  </div>

                  <div className="word_error">

                    <input
                      className="input_ward"
                      type="text"
                      placeholder="Word 4"
                      value={question.word_4}
                      onChange={(e) => handleInputChange(index, "word_4", e.target.value)}
                    />
                  </div>
                </div>
              </div>
            ))}
<button type="button" className="add-question-btn" onClick={addNewQuestion}>
  <span className="icon">＋</span> Another Question
</button>

            <button type="submit" className="submit_btn">Submit</button>
          </form>
        </div>
        <Chat />
      </div>
    </div>
  );
};

export default Create_Bost_image_and_answer;