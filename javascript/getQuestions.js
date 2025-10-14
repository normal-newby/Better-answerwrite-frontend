import { getCluster } from "./cluster.js";
import { getExamsSelectionValue } from "./getExams.js";
import { getIAsSelectionValue } from "./getIAs.js";

const getQuestionsButton = document.getElementById("getQuestions");
const messages = document.getElementById("messages");

//for display
const question = document.getElementById("question");
const answers = document.querySelectorAll(".answerButton");
const ia = document.getElementById("ia");
const specificIA = document.getElementById("specificIA");
const correctAnswer = document.getElementById("correctAnswer");
const description = document.getElementById("description");
const nextButton = document.getElementById("nextButton");
const previousButton = document.getElementById("prevButton");
let questions;
let curQuestion = 0;

getQuestionsButton.addEventListener("click", (e) => {
    e.preventDefault();
    const cluster = getCluster();
    if (cluster == null){
        return;
    }
    const exam = getExamsSelectionValue();
    const ias = Array.from(getIAsSelectionValue())
    if (ias.length == 0){
        messages.innerHTML = "Please select IA(s)";
        return;
    } else {
        fetch(`http://localhost:8080/api/getExams/${cluster}/${exam}/questions`,
            {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({ias: ias})
            }
        )
            .then(response => response.json())
            .then(q => {
                if (q.length == 0){
                    messages.innerHTML = "None available";
                    return;
                }
                messages.innerHTML = `Questions retrieved ${q.length} (MAX 1000)`;
                questions = q;
                curQuestion = 0;
                newQuestion();
                setHTML(curQuestion);
            })
            .catch(e => console.log(e));
        }
})
function newQuestion(){ //updates state of answer buttons (dont mind the naming)
    updateAnswerButtons();
    answers.forEach(a => {
        a.disabled = false;
        a.style.backgroundColor = "rgb(255,255,255)";
    })
}
function updateAnswerButtons(){ //respond to clicks on questions a, b, c, d
    answers.forEach(answer => {
        answer.addEventListener("click", (e) => {
            if (e.target.value === questions[curQuestion].correctAnswer){
                answer.style.backgroundColor = "rgba(135, 224, 139, 1)";
            } else {
                answer.style.backgroundColor = "rgba(235, 118, 118, 1)";
                const correct = Array.from(answers).find(a => a.value === questions[curQuestion].correctAnswer);
                correct.style.backgroundColor = "rgba(135, 224, 139, 1)";
            }
            changeInformation(false);
            answers.forEach(a => a.disabled = true);
        })
    });
}
function setHTML(curQuestion){ //dynamically changes html
    console.log(curQuestion);
    question.innerHTML = "Question: " + questions[curQuestion].question;
    answers.forEach(answer => {
        let ans = `answer${answer.value}`;
        console.log(questions[curQuestion][ans]);
        answer.innerHTML = questions[curQuestion][ans];
    })
    changeInformation(true);
    ia.innerHTML = "IA: " + questions[curQuestion].ia;
    specificIA.innerHTML = "Specific IA: " + questions[curQuestion].specificIA;
    correctAnswer.innerHTML = "Correct Answer: " + questions[curQuestion].correctAnswer;
    description.innerHTML = "Description: " + questions[curQuestion].description;
}
function changeInformation(hidden){
    ia.hidden = hidden;
    specificIA.hidden = hidden;
    correctAnswer.hidden = hidden;
    description.hidden = hidden;
}
nextButton.addEventListener("click", () => {
    newQuestion();
    setHTML(++curQuestion);
});
previousButton.addEventListener("click", () => {
    newQuestion();
    setHTML(--curQuestion);
})