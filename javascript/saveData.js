let data = [];
class IAData{
    constructor(ia){
        this.ia = ia;
        this.questionsDone = 0;
        this.questionsCorrect = 0;
    }
    getQuestionsDone(){
        return this.questionsDone;
    }
    getQuestionsCorrect(){
        return this.questionsCorrect;
    }
    getPercentageCorrect(){
        if (this.questionsDone === 0) return -1;
        else return this.questionsCorrect/this.questionsDone;
    }
}