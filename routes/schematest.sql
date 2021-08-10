-- brew services start postgresql
-- psql postgres
-- \l
-- \dt
-- \d questions

-- \i ~/Git/HackReactor/cohort/SDC/questions-api/routes/schematest.sql;
-- \i ./routes/schematest.sql;
-- \i schematest.sql;
\l
DROP DATABASE IF EXISTS sdctest;
CREATE DATABASE sdctest;
\c sdctest;

CREATE TABLE product (
	id serial PRIMARY KEY,
	name VARCHAR ( 50 ),
	slogan text,
	description text,
	category VARCHAR ( 50 ),
  default_price real
);


CREATE TABLE questions (
  id serial PRIMARY KEY,
  product_id INT NOT NULL,
  body text,
  date_written bigint,
  asker_name VARCHAR ( 50 ),
  asker_email VARCHAR ( 50 ),
  reported INT,
  helpful INT DEFAULT 0,
  FOREIGN KEY (product_id)
      REFERENCES product (id)
);


CREATE TABLE answers (
  id serial PRIMARY KEY,
  question_id INT NOT NULL,
  body text,
  date_written bigint,
  answerer_name VARCHAR ( 50 ),
  answerer_email VARCHAR ( 50 ),
  reported INT,
  helpful INT DEFAULT 0,
  FOREIGN KEY (question_id)
      REFERENCES questions (id)
);


CREATE TABLE answers_photos (
  id serial PRIMARY KEY,
  answer_id INT NOT NULL,
  url VARCHAR ( 255 ),
  FOREIGN KEY (answer_id)
      REFERENCES answers (id)
);

\dt

\COPY product FROM '~/Git/HackReactor/cohort/FinalOutput/SDC/DBTest/product.csv' DELIMITER ',' CSV HEADER;
\COPY questions FROM '~/Git/HackReactor/cohort/FinalOutput/SDC/DBTest/questions.csv' DELIMITER ',' CSV HEADER;
\COPY answers FROM '~/Git/HackReactor/cohort/FinalOutput/SDC/DBTest/answers.csv' DELIMITER ',' CSV HEADER;
\COPY answers_photos FROM '~/Git/HackReactor/cohort/FinalOutput/SDC/DBTest/answers_photos.csv' DELIMITER ',' CSV HEADER;

SELECT DATE_WRITTEN FROM questions
WHERE id = 2;

ALTER TABLE questions ALTER COLUMN reported DROP DEFAULT;
ALTER TABLE  questions
  -- ALTER COLUMN date_written TYPE VARCHAR(50) USING TO_CHAR(TO_TIMESTAMP(date_written / 1000) ::timestamp at time zone 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS"Z"'),
  -- SELECT TO_CHAR(date_written ::timestamp at time zone 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS"Z"');
  ALTER COLUMN date_written TYPE TIMESTAMP USING TO_TIMESTAMP(date_written / 1000),
  ALTER COLUMN reported TYPE BOOLEAN USING reported::BOOLEAN;
  -- ALTER COLUMN reported TYPE BOOLEAN USING CASE WHEN reported=0 THEN FALSE ELSE TRUE END;
ALTER TABLE questions
  ALTER COLUMN date_written SET DEFAULT CURRENT_TIMESTAMP(0),
  ALTER COLUMN reported SET DEFAULT FALSE;

SELECT DATE_WRITTEN FROM questions
WHERE id = 2;

SELECT DATE_WRITTEN FROM answers
WHERE id = 2;

ALTER TABLE answers ALTER COLUMN reported DROP DEFAULT;
ALTER TABLE answers
  -- ALTER COLUMN date_written TYPE VARCHAR(50) USING TO_CHAR(TO_TIMESTAMP(date_written / 1000) ::timestamp at time zone 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS"Z"'),
  -- SELECT TO_CHAR(date_written ::timestamp at time zone 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS"Z"');
  ALTER COLUMN date_written TYPE TIMESTAMP USING TO_TIMESTAMP(date_written / 1000),
  ALTER COLUMN reported TYPE BOOLEAN USING reported::BOOLEAN;
  -- ALTER COLUMN reported TYPE BOOLEAN USING CASE WHEN reported=0 THEN FALSE ELSE TRUE END;
ALTER TABLE answers
  ALTER COLUMN date_written SET DEFAULT CURRENT_TIMESTAMP(0),
  ALTER COLUMN reported SET DEFAULT FALSE;

SELECT DATE_WRITTEN FROM answers
WHERE id = 2;

SELECT setval(pg_get_serial_sequence('product', 'id'), MAX(id)) FROM product;
SELECT setval(pg_get_serial_sequence('questions', 'id'), MAX(id)) FROM questions;
SELECT setval(pg_get_serial_sequence('answers', 'id'), MAX(id)) FROM answers;
SELECT setval(pg_get_serial_sequence('answers_photos', 'id'), MAX(id)) FROM answers_photos;

CREATE INDEX idx_questions_product_id
ON questions(product_id);
CREATE INDEX idx_answers_question_id
ON answers(question_id);
CREATE INDEX idx_answers_photos_answer_id
ON answers_photos(answer_id);

-- TEST Joint Tables
SELECT
p.id, name, slogan, description, category, default_price,
q.id, product_id, body, date_written, asker_name, asker_email, reported, helpful
FROM product p
INNER JOIN questions q
ON  product_id = p.id
WHERE p.id = 1
ORDER by q.id ASC;

SELECT
q.id, product_id, q.body, q.date_written, asker_name, asker_email, q.reported, q.helpful,
a.id, question_id, a.body, a.date_written, answerer_name, answerer_email, a.reported, a.helpful
FROM questions q
INNER JOIN answers a
ON  question_id = q.id
WHERE product_id = 1;

SELECT
answers.id, question_id, body, date_written, answerer_name, answerer_email, reported, helpful,
answers_photos.id, answer_id, url
FROM answers
INNER JOIN answers_photos
ON  answer_id = answers.id
WHERE question_id = 1;

SELECT
q.id, product_id, q.body, q.date_written, asker_name, asker_email, q.reported, q.helpful,
a.id, question_id, a.body, a.date_written, answerer_name, answerer_email, a.reported, a.helpful,
ap.id, answer_id, url
FROM questions q
INNER JOIN answers a ON question_id = q.id
INNER JOIN answers_photos ap ON answer_id = a.id
WHERE product_id = 1
ORDER by q.id ASC;
