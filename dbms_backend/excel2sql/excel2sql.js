
const fs = require('fs');
require('dotenv').config({path:'../.env'});
const sequelize = require('../database/oracle');
const path = require('path');
const csv=require('csvtojson');
console.log(process.env.DB_USER)
async function addRows(){
    for(let year = 2021;year<=2021;year++){
        // const populationCsvFilePath = 'C:\\Users\\ingle\\OneDrive\\Documents\\DBMS\\Project code\\backend\\dataToAdd\\population.csv';
        // let populationArray=await csv().fromFile(populationCsvFilePath);
        // await addPopulation(populationArray,year);
        const folderPath = 'C:\\Users\\ingle\\OneDrive\\Documents\\DBMS\\Project code\\backend\\dataToAdd\\' + year;
        let csvFilePath = folderPath + '\\accident.csv';
        let jsonArray=await csv().fromFile(csvFilePath);
        // await addStates(jsonArray)
        // await addWeather(jsonArray);
        // await addAccident(jsonArray,year);
        // await addEMS(jsonArray,year)
        // csvFilePath = folderPath + '\\vision.csv';
        // jsonArray=await csv().fromFile(csvFilePath);
        // await addVision(jsonArray,year)
        // csvFilePath = folderPath + '\\vehicle.csv';
        // jsonArray=await csv().fromFile(csvFilePath);
        // await addVehicle(jsonArray,year)
        csvFilePath = folderPath + '\\person.csv';
        jsonArray=await csv().fromFile(csvFilePath);
        // await addPerson(jsonArray,year);
        await addAlcohol(jsonArray,year);
        // csvFilePath = folderPath + '\\drugs.csv';
        // jsonArray=await csv().fromFile(csvFilePath);
        // await addDrugs(jsonArray,year)

    }
}

async function addPopulation(jsonArray,year){
    let statesData = await sequelize.query(`SELECT * FROM State`);
    statesData = statesData[0]
    for(let statePopulation of jsonArray){
        let stateData = statesData.find((single)=>{
            // console.log(single['STATENAME'].toLowerCase(), statePopulation['State'].toLowerCase() , statePopulation[''+year] , ''+year)
            return (single['STATENAME'].toLowerCase() == statePopulation['State'].toLowerCase())
        })
        await sequelize.query(`INSERT INTO POPULATION (POPULATIONID,STATEID, YEAR, COUNT) VALUES ('${''+ year+ stateData['STATEID']}','${stateData['STATEID']}',${year},'${statePopulation[''+year].replace(/,/g,'')}')`)
    }
}

async function addDrugs(jsonArray,year){
    let i =Math.ceil(new Date().getTime()/10000000);
    for(let row of jsonArray){
        if (row['DRUGSPEC'] == 0) continue;
        await sequelize.query(`
                INSERT INTO DRUG (drugTestId,CASEID, drugResult, PERSONNO) VALUES ('${''+ year+ i}','${''+row['ST_CASE']+year}','${row['DRUGRES']}','${row['PER_NO']}')
            `)
            i++;
    }
}

async function addAlcohol(jsonArray,year){
    let i =Math.ceil(new Date().getTime()/10000000);
    for(let row of jsonArray){
        if (row['ALC_STATUS'] == 2)
        await sequelize.query(`
                INSERT INTO ALCOHOL (alcoholTestId,CASEID, alcoholResult, PERSONNO) VALUES ('${''+ year+ i}','${''+row['ST_CASE']+year}','${row['ALC_RES']}','${row['PER_NO']}')
            `)
        i++;
    }
}

async function addVision(jsonArray,year){
    let i =Math.ceil(new Date().getTime()/10000000);
    for(let row of jsonArray){
        await sequelize.query(`
                INSERT INTO Vision (VISIONID, CASEID, OBSCURITYLEVEL, VEHICLENO) VALUES ('${''+ year+ i}','${''+row['ST_CASE']+year}',${row['VISION'] || row['MVISOBSC']},'${row['VEH_NO']}')
            `)
        i++;
    }
}

async function addPerson(jsonArray,year){
    let i =Math.ceil(new Date().getTime()/10000000);
    for(let row of jsonArray){
        await sequelize.query(`
                INSERT INTO Person (PERSONID, CASEID, INJURYSEVERITY, AGE, SEX, PERSONTYPE, PERSONNO) VALUES ('${''+ year+ i}','${''+row['ST_CASE']+year}','${row['INJ_SEV']}','${row['AGE']}','${row['SEX']}','${row['PER_TYP']}','${row['PER_NO']}')
            `)
        i++;
    }
}

async function addVehicle(jsonArray,year){
    let i = Math.ceil(new Date().getTime()/10000000);
    for(let row of jsonArray){
        await sequelize.query(`
                INSERT INTO Vehicle (VIN, CASEID, extentOfDamage, VEHICLENO) VALUES ('${row['VIN'] || (''+ year+ i)}','${''+row['ST_CASE']+year}','${row['DEFORMED']}','${row['VEH_NO']}')
            `).catch(async (reason)=>{
                await sequelize.query(`
                INSERT INTO Vehicle (VIN, CASEID, extentOfDamage, VEHICLENO) VALUES ('${''+ year+ i}','${''+row['ST_CASE']+year}','${row['DEFORMED']}','${row['VEH_NO']}')
            `)
            })
        i++;
    }
}

async function addEMS(jsonArray,year){
    for(let row of jsonArray){
        let caseId = ''+row['ST_CASE']+year;
        if(Number(row['ARR_HOUR']) > 23){
            row['ARR_HOUR'] = 0;
            row['ARR_MIN'] = 0;
            row['YEAR']=3000;
            continue;
        }
        else if(Number(row['ARR_MIN']) > 59){
            row['ARR_MIN'] = 0;
        }
        let arrivalTimestamp = `${row['YEAR']}-${row['MONTH']}-${row['DAY']} ${row['ARR_HOUR']}:${row['ARR_MIN']}:00`;
        if(Number(row['ARR_HOUR']) <= 23 && Number(row['HOUR']) > Number(row['ARR_HOUR'])){
            let arrivalDate = new Date(arrivalTimestamp);
            arrivalDate.setDate(arrivalDate.getDate() + 1)
            arrivalTimestamp = [arrivalDate.getFullYear(),arrivalDate.getMonth()+1,
                arrivalDate.getDate()
                ].join('-')+' '+
               [arrivalDate.getHours(),
                arrivalDate.getMinutes(),
                arrivalDate.getSeconds()].join(':');
        }
        await sequelize.query(`
                INSERT INTO EmergencyMedicalServices (EMSID, CASEID, RESPONSETIME) VALUES ('${caseId}','${caseId}',TIMESTAMP '${arrivalTimestamp}')
            `)
    }
}

async function addAccident(jsonArray,year){
    for(let row of jsonArray){
        let weatherId = row['WEATHER'];
        let stateId = row['STATE'];
        let caseId = ''+row['ST_CASE']+year;
        if(Number(row['HOUR']) > 23){
            row['HOUR'] = 0;
            row['MINUTE'] = 0;
        }
        if(Number(row['MINUTE']) > 59){
            row['MINUTE'] = 0;
        }
        await sequelize.query(`
                INSERT INTO Accident (WEATHERID, CASEID, STATEID, CRASHTIME) VALUES ('${weatherId}','${caseId}','${stateId}',TIMESTAMP '${row['YEAR']}-${row['MONTH']}-${row['DAY']} ${row['HOUR']}:${row['MINUTE']}:00')
            `)
    }
}

async function addWeather(jsonArray){
    let weathersAdded = []
    for(let row of jsonArray){
        let weatherId = row['WEATHER'];
        let weatherName = row['WEATHERNAME']
        if(!weathersAdded.includes(weatherName)){
            await sequelize.query(`
                INSERT INTO WEATHER (WEATHERID, WEATHERNAME) VALUES ('${weatherId}','${weatherName}')
            `).catch(()=>{
                
            })
            weathersAdded.push(weatherName)
        }
    }
}



async function addStates(jsonArray){
    let statesAdded = []
    for(let row of jsonArray){
        let stateId = row['STATE'];
        let stateName = row['STATENAME']
        if(!statesAdded.includes(stateName)){
            await sequelize.query(`
                INSERT INTO STATE (STATEID, STATENAME) VALUES ('${stateId}','${stateName}')
            `).catch(()=>{

            })
            statesAdded.push(stateName)
        }
    }
}
addRows()

// CREATE TABLE Vision
// (
//     visionID numeric(10) not null,
//     caseID numeric(10) not null,
//     obscurityLevel numeric(10) not null,
//     vehicleNo numeric(10) not null,
//     PRIMARY KEY(visionID),
//     FOREIGN KEY (caseID) REFERENCES Accident(caseID)
// )


// CREATE TABLE Population
// (
//     populationId numeric(10) not null,
//     stateId numeric(10) not null,
//     year numeric(10) not null,
//     count numeric(10) not null,
//     PRIMARY KEY(populationId),
//     FOREIGN KEY (stateId) REFERENCES State(stateId)
// );

// CREATE TABLE Vehicle
// (
//     VIN varchar(30) not null,
//     caseID numeric(10) not null,
//     extentOfDamage numeric(10) not null,
//     vehicleNo numeric(10) not null,
//     PRIMARY KEY(VIN),
//     FOREIGN KEY (caseID) REFERENCES Accident(caseID)
// )

// CREATE TABLE DRUG
// (
//     drugTestId numeric(10) not null,
//     caseID numeric(10) not null,
//     drugResult numeric(10) not null,
//     personNo numeric(10) not null,
//     PRIMARY KEY(drugTestId),
//     FOREIGN KEY (caseID) REFERENCES Accident(caseID)
// );
// CREATE TABLE ALCOHOL
// (
//     alcoholTestId numeric(10),
//     caseID numeric(10) not null,
//     alcoholResult numeric(10) not null,
//     personNo numeric(10) not null,
//     PRIMARY KEY(alcoholTestId),
//     FOREIGN KEY (caseID) REFERENCES Accident(caseID)
// );