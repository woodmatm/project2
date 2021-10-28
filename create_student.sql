DROP DATABASE IF EXISTS student;
DROP USER IF EXISTS student_user@localhost;

CREATE DATABASE student CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci;
CREATE USER student_user@localhost IDENTIFIED WITH mysql_native_password BY 'password';
GRANT ALL PRIVILEGES ON student.* TO student_user@localhost;
