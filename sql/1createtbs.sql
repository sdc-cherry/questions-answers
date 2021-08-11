-- brew services start postgresql
-- psql postgres
-- \l
-- \dt
-- \d questions

-- \i ~/Git/HackReactor/cohort/SDC/questions-api/routes/schema.sql;
-- \i ./routes/schema.sql;
-- \i schema.sql;
\l
\c postgres
DROP DATABASE IF EXISTS sdc;
CREATE DATABASE sdc;
\c sdc;

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
