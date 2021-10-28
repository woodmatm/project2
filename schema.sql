DROP TABLE IF EXISTS grades;

CREATE TABLE grades (
  id SERIAL PRIMARY KEY,
  class char(4),
  course_id INT,
  year INT,
  month INT,
  grade_num INT,
  grade_letter char(2),
  test_desc TEXT,
  is_deleted INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
