import { Injectable } from '@angular/core';

interface Answer {
  text: string;
  isCorrect: boolean;
}

interface Question {
  text: string;
  answers: Answer[];
  category?: string;
  group?: string;
}

@Injectable({
  providedIn: 'root'
})
export class QuestionService {
  private questions: Question[] = [];

  addQuestion(question: Question) {
    this.questions.push(question);
  }

  getQuestions(): Question[] {
    return this.questions;
  }

  setQuestions(questions: Question[]) {
    this.questions = questions;
  }
}
