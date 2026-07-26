export interface User {
  uid: string;
  fullName: string;
  email: string;
  createdAt: Date;
}

export interface LectureNote {
  noteId: string;
  userId: string;
  lectureTopic: string;
  subject: string;
  academicLevel: string;
  language: string;
  outputType: string;
  generatedNotes: string;
  favorite: boolean;
  createdAt: Date;
}
