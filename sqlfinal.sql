create database kulaabhooshanam_new;
use kulaabhooshanam_new;

create table adoptionagency (
	agency_id int unsigned primary key not null auto_increment, 
    agency_name varchar(45) not null, 
    location varchar(45) not null, 
    address varchar(45) not null, 
    phno varchar(13) not null unique, 
    check (phno regexp "^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$"), 
    email_id varchar(45) not null, 
    check (email_id  regexp '^[A-Za-z0-9._%-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,4}$'), 
    numkids int not null, 
    num_succ_ad int not null
);

ALTER TABLE adoptionagency AUTO_INCREMENT = 100;


-- SELECT * FROM adoptionagency;
    
create table children(
	child_id int primary key not null auto_increment, 
    c_name varchar(45), 
    dob date, 
    sex enum ('male' ,'female', 'other'), 
    date_admitted datetime, 
    adoption_status enum ('inhouse', 'adopted'),  # adoptable removed
    genetic_disorder varchar(100), 
    agency_id int unsigned,
    age int,
    FOREIGN KEY (agency_id) REFERENCES adoptionagency(agency_id)
);

SET SQL_SAFE_UPDATES = 0;
UPDATE children
SET age = TIMESTAMPDIFF(YEAR, dob, CURRENT_DATE);

# Update age by above command


-- SELECT * FROM children;


create table parents (
	p_id varchar(15) unique not null primary key, 
    check (p_id regexp "^[2-9]{1}[0-9]{3}\\s[0-9]{4}\\s[0-9]{4}$"), 
    p_name varchar(45) not null, 
    email_id varchar (45) not null, 
    check (email_id regexp '^[A-Za-z0-9._%-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,4}$'), 
    pswd varchar(100) not null, 
    n_bio_kids int not null, 
    n_adopted_kids int not null, 
    appln_status enum ('pending', 'rejected', 'successful', 'null'), 
    c_id INT UNSIGNED DEFAULT NULL REFERENCES children(child_id),
    phno varchar(13) not null unique, 
    check (phno regexp "^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$"), 
    sex enum ('male', 'female', 'other') not null, 
    annual_income int not null, 
    bank_details varchar(45)  not null, 
    marital_status enum ('married', 'divorced', 'single', 'widowed') not null, 
    age int not null, 
    spouse_age int default (0), 
    spouse_name varchar(45) default NULL, 
    spouse_aadhar varchar(15) default NULL, 
    address varchar(45) not null, 
    financial_status enum ('BPL', 'middleclass', 'rich') not null, 
    caste varchar(45) default NULL
);


-- SELECT * FROM parents;
    
create table application (
	app_id int primary key not null auto_increment, 
    appln_status enum ('pending', 'successful', 'rejected') default 'pending', 
    p_id varchar (15) not null unique references parents(p_id), 
    sex enum ('male', 'female', 'other') not null, 
    child_age int, 
    g_disorder enum('yes', 'no') not null, 
    c_id int unsigned references children(child_id)
);

ALTER TABLE application AUTO_INCREMENT=1000;

-- SELECT * FROM application;
    

-- alter table parents add constraint chk_age 
-- 	check ((spouse_aadhar is null and age <= 55) or (spouse_aadhar is not null and age + spouse_age <= 110));
    
SELECT * FROM children; # id from 1
-- SELECT * FROM parents; # id is aadhar
-- SELECT * FROM adoptionagency; # id is from 100
-- SELECT * FROM application; # id is from 1000

DELIMITER //
-- drop procedure MapChildToParent;
-- drop procedure MapChildToParent;
CREATE PROCEDURE MapChildToParent(IN p_sex VARCHAR(10), IN p_age INT, IN p_genetic_disorder VARCHAR(100), IN p_parent_id VARCHAR(15))
BEGIN
    DECLARE v_child_id INT;
    DECLARE v_parent_age INT;
    DECLARE v_marital_status VARCHAR(10);
    DECLARE v_parent_sex ENUM('male', 'female', 'other');
    DECLARE v_spouse_age INT;

    -- Check eligibility based on constraints
    SELECT child_id
    INTO v_child_id
    FROM children
    WHERE sex = p_sex
        AND age = p_age
        AND genetic_disorder = p_genetic_disorder
        AND adoption_status <> 'adopted'
    LIMIT 1;

    IF v_child_id IS NOT NULL THEN
        -- Check additional eligibility constraints
        SELECT age, marital_status, sex, spouse_age
        INTO v_parent_age, v_marital_status, v_parent_sex, v_spouse_age
        FROM parents
        WHERE p_id = p_parent_id;

        IF v_parent_sex = 'male' AND v_marital_status <> 'Married' AND p_sex = 'Female' THEN
            -- SIGNAL SQLSTATE '45000'
            SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'Failure: Single male cannot adopt a girl child';
        ELSE
            IF p_age <= 2 THEN
                -- Age group: Upto 2 years
                IF v_marital_status = 'Married' THEN
                    -- Couple adoption constraint
                    IF (v_parent_age + v_spouse_age) <= 85 AND ABS(v_parent_age - p_age AND v_spouse_age - p_age) >= 25 THEN
                        -- Update parent's c_id
                        UPDATE parents
                        SET c_id = v_child_id
                        WHERE p_id = p_parent_id;
                    ELSE
                        SIGNAL SQLSTATE '45000'
                        SET MESSAGE_TEXT = 'Failure: Couple adoption constraint not met';
                    END IF;
                ELSE
                    -- Single adoption constraint
                    IF v_parent_age <= 40 THEN
                        -- Update parent's c_id
                        UPDATE parents
                        SET c_id = v_child_id
                        WHERE p_id = p_parent_id;
                    ELSE
                        SIGNAL SQLSTATE '45000'
                        SET MESSAGE_TEXT = 'Failure: Single adoption constraint not met';
                    END IF;
                END IF;
            ELSEIF p_age > 2 AND p_age <= 4 THEN
                -- Age group: Above 2 and Upto 4 years
                IF v_marital_status = 'Married' THEN
                    -- Couple adoption constraint
                    IF (v_parent_age + v_spouse_age) <= 90 AND ABS(v_parent_age - p_age AND v_spouse_age - p_age) >= 25 THEN
                        -- Update parent's c_id
                        UPDATE parents
                        SET c_id = v_child_id
                        WHERE p_id = p_parent_id;
                    ELSE
                        SIGNAL SQLSTATE '45000'
                        SET MESSAGE_TEXT = 'Failure: Couple adoption constraint not met';
                    END IF;
                ELSE
                    -- Single adoption constraint
                    IF v_parent_age <= 45 THEN
                        -- Update parent's c_id
                        UPDATE parents
                        SET c_id = v_child_id
                        WHERE p_id = p_parent_id;
                    ELSE
                        SIGNAL SQLSTATE '45000'
                        SET MESSAGE_TEXT = 'Failure: Single adoption constraint not met';
                    END IF;
                END IF;
            ELSEIF p_age > 4 AND p_age <= 8 THEN
                -- Age group: Above 4 and Upto 8 years
                IF v_marital_status = 'Married' THEN
                    -- Couple adoption constraint
                    IF (v_parent_age + v_spouse_age) <= 100 AND ABS(v_parent_age - p_age AND v_spouse_age - p_age) >= 25 THEN
                        -- Update parent's c_id
                        UPDATE parents
                        SET c_id = v_child_id
                        WHERE p_id = p_parent_id;
                    ELSE
                        SIGNAL SQLSTATE '45000'
                        SET MESSAGE_TEXT = 'Failure: Couple adoption constraint not met';
                    END IF;
                ELSE
                    -- Single adoption constraint
                    IF v_parent_age <= 50 THEN
                        -- Update parent's c_id
                        UPDATE parents
                        SET c_id = v_child_id
                        WHERE p_id = p_parent_id;
                    ELSE
                        SIGNAL SQLSTATE '45000'
                        SET MESSAGE_TEXT = 'Failure: Single adoption constraint not met';
                    END IF;
                END IF;
            ELSEIF p_age > 8 AND p_age <= 18 THEN
                -- Age group: Above 8 and Upto 18 years
                IF v_marital_status = 'Married' THEN
                    -- Couple adoption constraint
                    IF (v_parent_age + v_spouse_age) <= 110 AND ABS(v_parent_age - p_age AND v_spouse_age - p_age) >= 25 THEN
                        -- Update parent's c_id
                        UPDATE parents
                        SET c_id = v_child_id
                        WHERE p_id = p_parent_id;
                    ELSE
                        SIGNAL SQLSTATE '45000'
                        SET MESSAGE_TEXT = 'Failure: Couple adoption constraint not met';
                    END IF;
                ELSE
                    -- Single adoption constraint
                    IF v_parent_age <= 55 THEN
                        -- Update parent's c_id
                        UPDATE parents
                        SET c_id = v_child_id
                        WHERE p_id = p_parent_id;
                    ELSE
                        SIGNAL SQLSTATE '45000'
                        SET MESSAGE_TEXT = 'Failure: Single adoption constraint not met';
                    END IF;
                END IF;
            END IF;
        END IF;
    ELSE
        SELECT 'Failure: Child not found' AS STATUS;
    END IF;
END;

DELIMITER ;



SELECT child_id
    FROM children
    WHERE sex = 'male'
        AND age = 4
        AND genetic_disorder = 'None'
        AND adoption_status <> 'adopted';


DELIMITER //
-- drop trigger child_update_trigger;
CREATE TRIGGER child_update_trigger
AFTER UPDATE ON children
FOR EACH ROW
BEGIN
    DECLARE current_status VARCHAR(10);

    -- Get the current adoption_status
    SELECT adoption_status INTO current_status
    FROM children
    WHERE child_id = NEW.child_id;

    -- Check if adoption_status is 'adopted'
    IF current_status = 'adopted' THEN
        -- Update application table
        UPDATE application
        SET appln_status = 'successful'
        WHERE c_id = NEW.child_id;

        -- Update parent table
        UPDATE parents
        SET appln_status = 'successful',
            n_adopted_kids = n_adopted_kids + 1
        WHERE c_id = NEW.child_id;

        -- Increase successful adoptions count in adoptionagency table
        UPDATE adoptionagency
        SET num_succ_ad = num_succ_ad + 1
        WHERE agency_id = NEW.agency_id;
    END IF;
END;
//
DELIMITER ;


SELECT * FROM parents;

INSERT INTO adoptionagency(agency_name, location, address, phno, email_id, numkids, num_succ_ad) VALUES
("Children of the Society", "Noida, India", "Opp. SNR apts, RK Colony", "+919887899234", 
"chilsoc@gmail.com", 200, 90);


INSERT INTO children (c_name, dob, sex, date_admitted, adoption_status, genetic_disorder, agency_id, age)
VALUES ("Ashok Sinha", "2019-02-02", "male", "2019-06-04", "inhouse", "None", 100, 4);

SELECT * FROM children;
SELECT * FROM parents;