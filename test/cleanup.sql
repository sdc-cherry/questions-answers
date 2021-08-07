-- brew services start postgresql
-- psql postgres
-- \l
-- \dt
-- \d questions

-- \i ~/Git/HackReactor/cohort/SDC/questions-api/test/cleanup.sql;
-- \i ./test/cleanup.sql;
-- \i cleanup.sql;
-- \l
\c sdctest;
\c sdc;

-- FOR local:
-- WITH new_ap as (SELECT * FROM answers_photos WHERE id>2064304) SELECT (SELECT COUNT(*) FROM new_ap) as new_ap_ct, (SELECT id FROM new_ap group by id order by id ASC limit 1) as min, (SELECT id FROM new_ap group by id order by id DESC limit 1) as max;
-- WITH new_a as (SELECT * FROM answers WHERE id>6879498) SELECT (SELECT COUNT(*) FROM new_a) as new_a_ct, (SELECT id FROM new_a group by id order by id ASC limit 1) as min, (SELECT id FROM new_a group by id order by id DESC limit 1) as max;

-- Q
-- WITH new_q as (SELECT * FROM questions WHERE id>3519200) SELECT (SELECT COUNT(*) FROM new_q) as new_q_ct, (SELECT id FROM new_q group by id order by id ASC limit 1) as min, (SELECT id FROM new_q group by id order by id DESC limit 1) as max;
-- SELECT (select count(*) from questions where id>3519200 and helpful>0) as new_helpful_q;

SELECT (SELECT COUNT(*) FROM answers_photos WHERE id>2064304) as ap_ct, (SELECT COUNT(*) FROM answers WHERE id>6879498) as a_ct, (SELECT COUNT(*) FROM questions WHERE id>3519200) as q_ct;

DELETE FROM answers_photos WHERE id>2064304;
DELETE FROM answers WHERE id>6879498;
DELETE FROM questions WHERE id>3519200;

SELECT (SELECT COUNT(*) FROM answers_photos WHERE id>2064304) as ap_ct, (SELECT COUNT(*) FROM answers WHERE id>6879498) as a_ct, (SELECT COUNT(*) FROM questions WHERE id>3519200) as q_ct;

-- -- FOR AWS:
-- SELECT (SELECT COUNT(*) FROM answers_photos WHERE id>2063759) as ap_ct, (SELECT COUNT(*) FROM answers WHERE id>6879306) as a_ct, (SELECT COUNT(*) FROM questions WHERE id>3518963) as q_ct;

-- DELETE FROM answers_photos WHERE id>2063759;
-- DELETE FROM answers WHERE id>6879306;
-- DELETE FROM questions WHERE id>3518963;

-- SELECT (SELECT COUNT(*) FROM answers_photos WHERE id>2063759) as ap_ct, (SELECT COUNT(*) FROM answers WHERE id>6879306) as a_ct, (SELECT COUNT(*) FROM questions WHERE id>3518963) as q_ct;