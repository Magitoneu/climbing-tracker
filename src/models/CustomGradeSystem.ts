// CustomGradeSystem model for user-defined climbing grade systems

export interface CustomGrade {
  name: string;
  color: string; // HEX or Tailwind color string
}

export interface CustomGradeSystem {
  id: string;
  name: string;
  grades: CustomGrade[];
}
