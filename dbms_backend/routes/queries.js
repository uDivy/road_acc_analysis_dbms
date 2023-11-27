var express = require('express');
var router = express.Router();
const sequelize = require('../database/oracle');


router.get('/drugAlcoholVision', async function(req, res){
   let data = await sequelize.query(`with alcoholAccidents as (
      SELECT DISTINCT caseID, 1 as alcoholAccident
      FROM inglePranil.Alcohol
      WHERE alcoholResult between 80 and 940
      ),
      drugAccidents as (SELECT DISTINCT caseID, 1 as drugAccident
      FROM inglepranil.Drug
      WHERE drugresult between 100 and 295 OR drugResult between 300 and 395 OR drugResult between 400 and 495
      OR drugResult between 500 and 595  OR drugResult between 600 and 695 OR drugResult between 700 and 795
      MINUS 
      SELECT * FROM alcoholAccidents
      ),
      visionAccidents as (
      SELECT DISTINCT caseID,1 as visionAccident FROM inglepranil.Vision WHERE obscurityLevel not in(0,99)
      ),
      finalAccidentTable as (
      SELECT Accident.CASEID,crashTime,visionAccident,alcoholAccident,drugAccident,
      CASE WHEN EXTRACT(hour from crashtime) >= 5 AND EXTRACT(hour from crashtime) <= 11 THEN 'Morning(5am to 11:59am)'
         WHEN EXTRACT(hour from crashtime) >= 12 AND EXTRACT(hour from crashtime) <= 16 THEN 'Afternoon(12pm to 4:59pm)'
         WHEN EXTRACT(hour from crashtime) >= 17 AND EXTRACT(hour from crashtime) <= 18 THEN 'Evening(5pm to 6:59pm)'
         WHEN (EXTRACT(hour from crashtime) >= 19 AND EXTRACT(hour from crashtime) <= 23) OR (EXTRACT(hour from crashtime) <= 4) THEN 'Night(7pm to 4:59am)'
         END as timeOfDay
      FROM inglepranil.Accident
      LEFT OUTER JOIN drugAccidents ON Accident.caseId = drugAccidents.caseID
      LEFT OUTER JOIN visionAccidents ON Accident.caseId = visionAccidents.caseID
      LEFT OUTER JOIN alcoholAccidents ON Accident.caseId = alcoholAccidents.caseID
      WHERE EXTRACT(hour from crashtime) != 0 and EXTRACT(minute from crashtime) != 0
      )
      SELECT (COUNT(CASE WHEN visionAccident = 1 THEN 1 END)/count(*))*100 as visionAccidents,
      (COUNT(CASE WHEN drugAccident = 1 THEN 1 END)/count(*))*100 as drugAccidents,
      (COUNT(CASE WHEN alcoholAccident = 1 THEN 1 END)/count(*))*100 as alcoholAccidents,
      (COUNT(CASE WHEN alcoholAccident IS NULL AND drugAccident IS NULL AND visionAccident IS NULL THEN 1 END)/count(*))*100 as unKnownReasonAccidents,
      timeOfDay
      FROM finalAccidentTable
      GROUP BY timeOfDay;`);
   res.send(data);
});
router.get('/fatalitiesPerSeason', async function(req, res){
    let data = await sequelize.query(`with fatalities as (SELECT count(*) as peopleKilled, caseID
    FROM inglepranil.Person
    WHERE INJURYSEVERITY = 4
    GROUP BY caseID),
    totalPersons as(SELECT count(*) as totalInvolvedPeople, caseID
    FROM inglepranil.Person
    GROUP BY caseID),
    seasoncases as (SELECT caseID,weatherName,
    CASE WHEN TO_NUMBER(to_char(crashtime, 'mm')) >= 3 AND TO_NUMBER(to_char(crashtime, 'mm')) <= 5 THEN 'Spring'
       WHEN TO_NUMBER(to_char(crashtime, 'mm')) >= 6 AND TO_NUMBER(to_char(crashtime, 'mm')) <= 8 THEN 'Summer'
       WHEN TO_NUMBER(to_char(crashtime, 'mm')) >= 9 AND TO_NUMBER(to_char(crashtime, 'mm')) <= 11 THEN 'Autumn'
       ELSE 'Winter' END as season
    FROM inglepranil.Accident NATURAL JOIN Weather)
    SELECT weatherName,season, (SUM(peoplekilled)/SUM(totalInvolvedPeople))*100 as fatalityRate FROM seasoncases NATURAL JOIN fatalities
    NATURAL JOIN totalPersons
    GROUP BY season,weatherName;`);
    res.send(data);
 });
router.get('/crashSeverityIndex', async function(req, res){
   let data = await sequelize.query(`with injuriesAndFatalities as (
      SELECT caseID,COUNT(CASE WHEN injurySeverity = 4 THEN 1 END) as fatalities,
      COUNT(CASE WHEN injurySeverity = 3 THEN 1 END) as seriousInjuries,
      COUNT(CASE WHEN injurySeverity = 2 THEN 1 END) as minorInjuries
      FROM  Person   
      GROUP BY caseID),
      propertyDamage as (
      SELECT caseID,COUNT(CASE WHEN extentOfDamage in (4,6) THEN 1 END) as propertyDamage
      FROM Vehicle 
      GROUP BY caseID
      ),
      driverGroup as (
      SELECT 
              CASE 
                  WHEN P.Age >= 50 THEN 
                      CASE 
                          WHEN P.Sex = 1 THEN 'Senior Citizen Male'
                          WHEN P.Sex = 2 THEN 'Senior Citizen Female'
                          ELSE 'Senior Citizen Others'
                      END
                  WHEN P.Age BETWEEN 31 AND 50 THEN 
                      CASE 
                          WHEN P.Sex = 1 THEN 'Middle Age Male'
                          WHEN P.Sex = 2 THEN 'Middle Age Female'
                          ELSE 'Middle Age Others'
                      END
                  WHEN P.Age BETWEEN 18 AND 30 THEN 
                      CASE 
                          WHEN P.Sex = 1 THEN 'Young Male'
                          WHEN P.Sex = 2 THEN 'Young Female'
                          ELSE 'Young Others'
                      END
                  ELSE 'Unknown' 
              END AS CombinedGroup,caseID
              FROM Person P
              WHERE PersonType = 1
      )
      SELECT CombinedGroup,EXTRACT(year from crashTime) as year, 
      AVG(fatalities)*10 + AVG(seriousInjuries)*5 + AVG(minorInjuries)*1 + AVG(propertyDamage)*1 as crashSeverityIndex
      FROM Accident NATURAL JOIN injuriesAndFatalities
      NATURAL JOIN propertyDamage
      NATURAL JOIN driverGroup
      GROUP BY CombinedGroup,EXTRACT(year from crashTime)
      ORDER BY EXTRACT(year from crashTime);`);
   res.send(data);
});
router.get('/perHundredThousandPopulation', async function(req, res){
   let data = await sequelize.query(`WITH AccidentCounts AS (
      SELECT
          A.stateID,
          TO_NUMBER(to_char(A.crashtime, 'yyyy')) AS year,
          COUNT(A.caseID) AS total_accidents
      FROM
          inglepranil.Accident A
      GROUP BY
          A.stateID,
          EXTRACT(YEAR FROM A.crashTime)
  ),
  PopulationData AS (
      SELECT
          P.populationID,
          A.stateID,
          TO_NUMBER(to_char(A.crashtime, 'yyyy')) AS year,
          P.count AS population,
          COUNT(A.caseID) AS total_accidents
      FROM
          inglepranil.Population P
      JOIN
          inglepranil.Accident A ON P.stateID = A.stateID AND P.year = TO_NUMBER(to_char(A.crashtime, 'yyyy'))
      GROUP BY
          P.populationID,
          A.stateID,
          TO_NUMBER(to_char(A.crashtime, 'yyyy')),
          P.count
  )
  SELECT
      populationID,
      stateName,
      year,
      population,
      total_accidents,
      (total_accidents / population * 100000) AS accidents_per_100k
  FROM
      PopulationData
      NATURAL JOIN State
ORDER BY year`);
   res.send(data);
});
router.get('/responseTime', async function(req, res){
    let data = await sequelize.query(`with fatalitiesByCase as (
        SELECT SUM(CASE WHEN P.injurySeverity = 4 THEN 1 ELSE 0 END) AS TotalFatalities,
        COUNT(*) AS TotalInjuries,
        caseId
        FROM inglepranil.Person P
        GROUP BY caseID
        )
        SELECT 
           S.StateName,
           AVG((CAST(EMS.responseTime AS DATE) - CAST(A.crashTime AS DATE)) * 24 * 60) AS AvgResponseTimeMinutes,
           AVG(TotalFatalities/TotalInjuries) AS FATALITYTOINJURYRATIO
        FROM 
           inglepranil.Accident A
        JOIN 
           inglepranil.EmergencyMedicalServices EMS ON A.caseID = EMS.caseID
        JOIN 
           inglepranil.State S ON A.stateID = S.stateID
        JOIN fatalitiesByCase ON fatalitiesByCase.caseId = A.caseID
        WHERE (EXTRACT(hour from crashtime) != 0 AND EXTRACT(minute from crashtime) != 0)
        AND (EXTRACT(minute from responseTime) != 0) AND A.caseID != '1807622019'
        GROUP BY 
           S.StateName
        ORDER BY 
           FATALITYTOINJURYRATIO`);
    res.send(data);
 });
router.get('/tableCount', async function(req, res){
   let data = await sequelize.query(`
   SELECT SUM(cnt) AS total_count
FROM (
    SELECT COUNT(*) AS cnt FROM inglepranil.Accident
    UNION ALL
    SELECT COUNT(*) AS cnt FROM inglepranil.Population
    UNION ALL
    SELECT COUNT(*) AS cnt FROM inglepranil.Drug
    UNION ALL
    SELECT COUNT(*) AS cnt FROM inglepranil.Alcohol
    UNION ALL
    SELECT COUNT(*) AS cnt FROM inglepranil.State
    UNION ALL
    SELECT COUNT(*) AS cnt FROM inglepranil.Weather
    UNION ALL
    SELECT COUNT(*) AS cnt FROM inglepranil.Person
    UNION ALL
    SELECT COUNT(*) AS cnt FROM inglepranil.Vision
    UNION ALL
    SELECT COUNT(*) AS cnt FROM inglepranil.Vehicle
    UNION ALL
    SELECT COUNT(*) AS cnt FROM inglepranil.EmergencyMedicalServices
)
 `);
    res.send(data);
 });
//export this router to use in our index.js
module.exports = router;