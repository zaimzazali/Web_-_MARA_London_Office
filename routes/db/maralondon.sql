DROP VIEW IF EXISTS view_contactUsMessages;
DROP VIEW IF EXISTS view_userPreviousPassword;
DROP VIEW IF EXISTS view_userLogin;
DROP VIEW IF EXISTS view_userEducationDetails;
DROP VIEW IF EXISTS view_userDetails;
DROP VIEW IF EXISTS view_userAccount;

DROP TABLE IF EXISTS contactUs_student;
DROP TABLE IF EXISTS contactUs_messages;
DROP TABLE IF EXISTS userEducationDetails_list;
DROP TABLE IF EXISTS studySubject_list;
DROP TABLE IF EXISTS institute_list;
DROP TABLE IF EXISTS userDetails_list;
DROP TABLE IF EXISTS address_list;
DROP TABLE IF EXISTS postTown_list;
DROP TABLE IF EXISTS userLogin_list;
DROP TABLE IF EXISTS historyPassword_list;
DROP TABLE IF EXISTS userPassword_list;
DROP TABLE IF EXISTS user_list;

DROP TABLE IF EXISTS studyLevel_list;
DROP TABLE IF EXISTS studyField_list;
DROP TABLE IF EXISTS country_list;
DROP TABLE IF EXISTS religion_list;
DROP TABLE IF EXISTS marital_list;
DROP TABLE IF EXISTS state_list;
DROP TABLE IF EXISTS ethnicity_list;
DROP TABLE IF EXISTS gender_list;
DROP TABLE IF EXISTS userType_list;

/*
-----------------------------------------------------------------------------------------------------------------------
-- Independent Tables - (Listing)
*/

CREATE TABLE userType_list (
	userTypeCode INTEGER NOT NULL,
	userTypeName TEXT(100) DEFAULT NA NOT NULL,
	CONSTRAINT userType_list_PK PRIMARY KEY (userTypeCode),
	CONSTRAINT userType_list_UN UNIQUE (userTypeName)
);

CREATE TABLE gender_list (
	genderCode INTEGER NOT NULL,
	genderName TEXT(100) DEFAULT NA NOT NULL,
	CONSTRAINT gender_list_PK PRIMARY KEY (genderCode),
	CONSTRAINT gender_list_UN UNIQUE (genderName)
);

CREATE TABLE ethnicity_list (
	ethnicityCode INTEGER NOT NULL,
	ethnicityName TEXT(100) DEFAULT NA NOT NULL,
	CONSTRAINT ethnicity_list_PK PRIMARY KEY (ethnicityCode),
	CONSTRAINT ethnicity_list_UN UNIQUE (ethnicityName)
);

CREATE TABLE state_list (
	stateCode INTEGER NOT NULL,
	stateName TEXT(100) DEFAULT NA NOT NULL,
	CONSTRAINT state_list_PK PRIMARY KEY (stateCode),
	CONSTRAINT state_list_UN UNIQUE (stateName)
);

CREATE TABLE marital_list (
	maritalCode INTEGER NOT NULL,
	maritalName TEXT(100) DEFAULT NA NOT NULL,
	CONSTRAINT marital_list_PK PRIMARY KEY (maritalCode),
	CONSTRAINT marital_list_UN UNIQUE (maritalName)
);

CREATE TABLE religion_list (
	religionCode INTEGER NOT NULL,
	religionName TEXT(100) DEFAULT NA NOT NULL,
	CONSTRAINT religion_list_PK PRIMARY KEY (religionCode),
	CONSTRAINT religion_list_UN UNIQUE (religionName)
);

CREATE TABLE country_list (
	countryCode INTEGER NOT NULL,
	countryName TEXT(250) DEFAULT NA NOT NULL,
	CONSTRAINT country_list_PK PRIMARY KEY (countryCode),
	CONSTRAINT country_list_UN UNIQUE (countryName)
);

CREATE TABLE studyField_list (
	studyFieldCode INTEGER NOT NULL,
	studyFieldName TEXT(500) DEFAULT NA NOT NULL,
	CONSTRAINT studyField_list_PK PRIMARY KEY (studyFieldCode),
	CONSTRAINT studyField_list_UN UNIQUE (studyFieldName)
);

CREATE TABLE studyLevel_list (
	studyLevelCode INTEGER NOT NULL,
	studyLevelName TEXT(250) DEFAULT NA NOT NULL,
	CONSTRAINT studyLevel_list_PK PRIMARY KEY (studyLevelCode),
	CONSTRAINT studyLevel_list_UN UNIQUE (studyLevelName)
);

/*
-----------------------------------------------------------------------------------------------------------------------
*/

CREATE TABLE user_list (
	userID TEXT(100) DEFAULT NA NOT NULL,
	isRegistered TEXT(5) DEFAULT NO NOT NULL,
	isAccountActive TEXT(5) DEFAULT NO NOT NULL,
	userTypeCode INTEGER DEFAULT 0 NOT NULL,
	CONSTRAINT user_list_PK PRIMARY KEY (userID),
	CONSTRAINT user_list_FK FOREIGN KEY (userTypeCode) REFERENCES userType_list(userTypeCode) ON UPDATE CASCADE
);

/*
-----------------------------------------------------------------------------------------------------------------------
*/

CREATE TABLE userPassword_list (
	num INTEGER NOT NULL,
	userPassword TEXT DEFAULT NA NOT NULL,
	userID TEXT(100) DEFAULT NA NOT NULL, 
    needReset TEXT(5) DEFAULT YES NOT NULL,
	CONSTRAINT userPassword_list_PK PRIMARY KEY (num),
	CONSTRAINT userPassword_list_FK FOREIGN KEY (userID) REFERENCES user_list(userID)
);

CREATE TABLE historyPassword_list (
	num INTEGER NOT NULL,
	timeStampGMT0 TEXT(250) DEFAULT NA NOT NULL,
	userID TEXT(100) DEFAULT NA NOT NULL,
	previousPassword TEXT DEFAULT NA NOT NULL,
	CONSTRAINT historyPassword_list_PK PRIMARY KEY (num),
	CONSTRAINT historyPassword_list_FK FOREIGN KEY (userID) REFERENCES user_list(userID)
);

/*
-----------------------------------------------------------------------------------------------------------------------
*/

CREATE TABLE userLogin_list (
	num INTEGER NOT NULL,
	sessionID TEXT DEFAULT NA NOT NULL,
	timeStampGMT0 TEXT(250) DEFAULT NA NOT NULL,
	userID TEXT(100) DEFAULT NA NOT NULL,
	userIsLoggedIn TEXT(5) DEFAULT NO NOT NULL,
	CONSTRAINT userLogin_list_PK PRIMARY KEY (num),
	CONSTRAINT userLogin_list_UN UNIQUE (sessionID, timeStampGMT0, userID),
	CONSTRAINT userLogin_list_FK FOREIGN KEY (userID) REFERENCES user_list(userID)
);

/*
-----------------------------------------------------------------------------------------------------------------------
*/

CREATE TABLE postTown_list (
	postTownCode INTEGER NOT NULL,
	postTownName TEXT(100) DEFAULT NA NOT NULL,
	countryCode INTEGER DEFAULT 0 NOT NULL,
	CONSTRAINT postTown_list_PK PRIMARY KEY (postTownCode),
	CONSTRAINT postTown_list_UN UNIQUE (postTownName),
	CONSTRAINT postTown_list_FK FOREIGN KEY (countryCode) REFERENCES country_list(countryCode) ON UPDATE CASCADE
);

CREATE TABLE address_list (
	addressCode INTEGER NOT NULL,
	addressLine TEXT(500) DEFAULT NA NOT NULL,
	postTownCode INTEGER NOT NULL,
	postCode TEXT(100) DEFAULT NA NOT NULL,
	CONSTRAINT address_list_PK PRIMARY KEY (addressCode),
	CONSTRAINT address_list_FK FOREIGN KEY (postTownCode) REFERENCES postTown_list(postTownCode) ON UPDATE CASCADE
);

/*
-----------------------------------------------------------------------------------------------------------------------
*/

CREATE TABLE userDetails_list (
	num INTEGER NOT NULL,
    updatedInfo TEXT(5) DEFAULT NO NOT NULL,
	userID TEXT(100) DEFAULT NA NOT NULL,
	userFullName TEXT(250) DEFAULT NA NOT NULL,
	userShortName TEXT(250) DEFAULT NA NOT NULL,
	userMyKad TEXT(100) DEFAULT NA NOT NULL,
	userPassport TEXT(100) DEFAULT NA NOT NULL,
	userEmail TEXT(250) DEFAULT NA NOT NULL,
	userDOB TEXT(100) DEFAULT NA NOT NULL,
	userTelHome TEXT(100) DEFAULT NA NOT NULL,
	userTelMobile TEXT(100) DEFAULT NA NOT NULL,
	maritalCode INTEGER DEFAULT 0 NOT NULL,
	religionCode INTEGER DEFAULT 0 NOT NULL,
	genderCode INTEGER DEFAULT 0 NOT NULL,
	ethnicityCode INTEGER DEFAULT 0 NOT NULL,
	stateCode INTEGER DEFAULT 0 NOT NULL,
	addressCode INTEGER DEFAULT 0 NOT NULL,
	CONSTRAINT userDetails_list_PK PRIMARY KEY (num),
	CONSTRAINT userDetails_list_UN_1 UNIQUE (userID),
	CONSTRAINT userDetails_list_UN_2 UNIQUE (userMyKad),
	CONSTRAINT userDetails_list_UN_3 UNIQUE (userPassport),
	CONSTRAINT userDetails_list_FK_1 FOREIGN KEY (maritalCode) REFERENCES marital_list(maritalCode) ON UPDATE CASCADE,
	CONSTRAINT userDetails_list_FK_2 FOREIGN KEY (religionCode) REFERENCES religion_list(religionCode) ON UPDATE CASCADE,
	CONSTRAINT userDetails_list_FK_3 FOREIGN KEY (genderCode) REFERENCES gender_list(genderCode) ON UPDATE CASCADE,
	CONSTRAINT userDetails_list_FK_4 FOREIGN KEY (ethnicityCode) REFERENCES ethnicity_list(ethnicityCode) ON UPDATE CASCADE,
	CONSTRAINT userDetails_list_FK_5 FOREIGN KEY (stateCode) REFERENCES state_list(stateCode) ON UPDATE CASCADE,
	CONSTRAINT userDetails_list_FK_6 FOREIGN KEY (addressCode) REFERENCES address_list(addressCode) ON UPDATE CASCADE,
	CONSTRAINT userDetails_list_FK_7 FOREIGN KEY (userID) REFERENCES user_list(userID)
);

/*
-----------------------------------------------------------------------------------------------------------------------
*/

CREATE TABLE institute_list (
	instituteCode INTEGER NOT NULL,
	instituteName TEXT(250) DEFAULT NA NOT NULL,
	countryCode INTEGER DEFAULT 0 NOT NULL,
	CONSTRAINT institute_list_PK PRIMARY KEY (instituteCode),
	CONSTRAINT institute_list_UN UNIQUE (instituteName),
	CONSTRAINT institute_list_FK FOREIGN KEY (countryCode) REFERENCES country_list(countryCode) ON UPDATE CASCADE
);

CREATE TABLE studySubject_list (
	studySubjectCode INTEGER NOT NULL,
	studySubjectName TEXT(500) DEFAULT NA NOT NULL,
	studyFieldCode INTEGER DEFAULT 0 NOT NULL,
	CONSTRAINT studySubject_list_PK PRIMARY KEY (studySubjectCode),
	CONSTRAINT studySubject_list_UN UNIQUE (studySubjectName),
	CONSTRAINT studySubject_list_FK FOREIGN KEY (studyFieldCode) REFERENCES studyField_list(studyFieldCode) ON UPDATE CASCADE
);

CREATE TABLE userEducationDetails_list (
	num INTEGER NOT NULL,
    updatedInfo TEXT(5) DEFAULT NO NOT NULL,
	userID TEXT(100) DEFAULT NA NOT NULL,
	instituteCode INTEGER DEFAULT 0 NOT NULL,
	studySubjectCode INTEGER DEFAULT 0 NOT NULL,
	studyLevelCode INTEGER DEFAULT 0 NOT NULL,
	studyCompletionDate TEXT(250) DEFAULT NA NOT NULL,
	isStudyCompleted TEXT(5) DEFAULT NO NOT NULL,
	CONSTRAINT userEducationDetails_list_PK PRIMARY KEY (num),
	CONSTRAINT userEducationDetails_list_UN UNIQUE (userID),
	CONSTRAINT userEducationDetails_list_FK_1 FOREIGN KEY (instituteCode) REFERENCES institute_list(instituteCode) ON UPDATE CASCADE,
	CONSTRAINT userEducationDetails_list_FK_2 FOREIGN KEY (studySubjectCode) REFERENCES studySubject_list(studySubjectCode) ON UPDATE CASCADE,
	CONSTRAINT userEducationDetails_list_FK_3 FOREIGN KEY (studyLevelCode) REFERENCES studyLevel_list(studyLevelCode) ON UPDATE CASCADE,
	CONSTRAINT userEducationDetails_list_FK_4 FOREIGN KEY (userID) REFERENCES user_list(userID)
);

/*
-----------------------------------------------------------------------------------------------------------------------
*/

CREATE TABLE contactUs_messages (
	refNum INTEGER NOT NULL,
	timeStampGMT0 TEXT(250) DEFAULT NA NOT NULL,
	senderName TEXT(250) DEFAULT NA NOT NULL,
	senderEmail TEXT(250) DEFAULT NA NOT NULL,
	senderMARAid TEXT(250) DEFAULT NA NULL,
	senderMessage TEXT DEFAULT NA NOT NULL,
	isExternal TEXT(5) DEFAULT YES NOT NULL,
	CONSTRAINT contactUs_messages_PK PRIMARY KEY (refNum),
	CONSTRAINT contactUs_messages_FK FOREIGN KEY (senderMARAid) REFERENCES user_list(userID)
);

CREATE TABLE contactUs_student (
	num INTEGER NOT NULL,
	refNum INTEGER DEFAULT 0 NOT NULL,
	userID TEXT(100) DEFAULT NA NOT NULL, 
	CONSTRAINT contactUs_student_PK PRIMARY KEY (num),
	CONSTRAINT contactUs_student_FK_1 FOREIGN KEY (refNum) REFERENCES contactUs_messages(refNum) ON UPDATE CASCADE,
	CONSTRAINT contactUs_student_FK_2 FOREIGN KEY (userID) REFERENCES user_list(userID)
);

/*
-----------------------------------------------------------------------------------------------------------------------
*/

CREATE VIEW view_userAccount AS 
SELECT 
	`user_list`.userID AS user_ID,
	`user_list`.isRegistered AS user_is_registered,
	`user_list`.isAccountActive AS account_is_active,
	`userType_list`.userTypeName AS account_type,
	`userPassword_list`.userPassword AS password,
	`userPassword_list`.needReset AS password_need_reset
FROM
    `user_list`
LEFT OUTER JOIN `userType_list` ON `user_list`.userTypeCode = `userType_list`.userTypeCode
LEFT OUTER JOIN `userPassword_list` ON `user_list`.userID = `userPassword_list`.userID;


CREATE VIEW view_userDetails AS 
SELECT 
	`user_list`.userID AS user_ID,
	`userDetails_list`.updatedInfo AS latest_info,
	`userDetails_list`.userFullName AS full_name,
	`userDetails_list`.userMyKad AS myKad,
	`userDetails_list`.userPassport AS passport,
	`userDetails_list`.userEmail AS email,
	`userDetails_list`.userDOB AS DOB,
	`userDetails_list`.userTelHome AS tel_home,
	`userDetails_list`.userTelMobile AS tel_mobile,
	`gender_list`.genderName AS gender,
	`marital_list`.maritalName AS marital_status,
	`religion_list`.religionName AS religion,
	`ethnicity_list`.ethnicityName AS ethnic,
	`state_list`.stateName AS born_state,
	`country_list`.countryName AS current_country,
	`postTown_list`.postTownName AS current_town,
	`address_list`.postCode AS current_postcode,
	`address_list`.addressLine AS current_address
FROM
    `user_list`
LEFT OUTER JOIN `userDetails_list` ON `user_list`.userID = `userDetails_list`.userID
LEFT OUTER JOIN `gender_list` ON `userDetails_list`.genderCode = `gender_list`.genderCode
LEFT OUTER JOIN `marital_list` ON `userDetails_list`.maritalCode = `marital_list`.maritalCode
LEFT OUTER JOIN `religion_list` ON `userDetails_list`.religionCode = `religion_list`.religionCode
LEFT OUTER JOIN `ethnicity_list` ON `userDetails_list`.ethnicityCode = `ethnicity_list`.ethnicityCode
LEFT OUTER JOIN `state_list` ON `userDetails_list`.stateCode = `state_list`.stateCode
LEFT OUTER JOIN `address_list` ON `userDetails_list`.addressCode = `address_list`.addressCode
LEFT OUTER JOIN `postTown_list` ON `address_list`.postTownCode = `postTown_list`.postTownCode
LEFT OUTER JOIN `country_list` ON `postTown_list`.countryCode = `country_list`.countryCode;


CREATE VIEW view_userEducationDetails AS 
SELECT 
	`user_list`.userID AS user_ID,
    `userEducationDetails_list`.updatedInfo AS latest_info,
	`institute_list`.instituteName AS institution_name,
	`country_list`.countryName AS country_name,
	`studySubject_list`.studySubjectName AS subject_of_study,
	`studyField_list`.studyFieldName AS field_of_study,
	`studyLevel_list`.studyLevelName AS study_level,
	`userEducationDetails_list`.studyCompletionDate AS completion_date,
	`userEducationDetails_list`.isStudyCompleted AS finished_study
FROM
	`user_list`
LEFT OUTER JOIN `userEducationDetails_list` ON `user_list`.userID = `userEducationDetails_list`.userID
LEFT OUTER JOIN `institute_list` ON `userEducationDetails_list`.instituteCode = `institute_list`.instituteCode
LEFT OUTER JOIN `country_list` ON `institute_list`.countryCode = `country_list`.countryCode
LEFT OUTER JOIN `studySubject_list` ON `userEducationDetails_list`.studySubjectCode = `studySubject_list`.studySubjectCode
LEFT OUTER JOIN `studyField_list` ON `studySubject_list`.studyFieldCode = `studyField_list`.studyFieldCode
LEFT OUTER JOIN `studyLevel_list` ON `userEducationDetails_list`.studyLevelCode = `studyLevel_list`.studyLevelCode;


CREATE VIEW view_userLogin AS 
SELECT 
	`user_list`.userID AS user_ID,
	`userLogin_list`.sessionID AS session_ID,
	`userLogin_list`.timeStampGMT0 AS time_log,
	`userLogin_list`.userIsLoggedIn AS log_activity
FROM
	`user_list`
LEFT OUTER JOIN `userLogin_list` ON `user_list`.userID = `userLogin_list`.userID;


CREATE VIEW view_userPreviousPassword AS 
SELECT 
	`user_list`.userID AS user_ID,
	`historyPassword_list`.timeStampGMT0 AS time_changing,
	`historyPassword_list`.previousPassword AS previous_password
FROM
	`user_list`
LEFT OUTER JOIN `historyPassword_list` ON `user_list`.userID = `historyPassword_list`.userID;


CREATE VIEW view_contactUsMessages AS 
SELECT 
	`contactUs_messages`.refNum AS reference_num,
	`contactUs_messages`.senderMARAid AS user_ID,
	`contactUs_messages`.timeStampGMT0 AS time_sent,
	`contactUs_messages`.senderName AS sender_name,
	`contactUs_messages`.senderEmail AS sender_email,
	`contactUs_messages`.senderMessage AS sender_message,
	`contactUs_messages`.isExternal AS sender_not_student
FROM
	`contactUs_messages`
LEFT OUTER JOIN `contactUs_student` ON `contactUs_messages`.refNum = `contactUs_student`.refNum;
