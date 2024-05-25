import dapit_model, {IDapit} from "../models/dapit_model";
import { BaseController } from "./base_controller";
import e, { Request, Response } from "express";
import axios from 'axios';

import { AuthResquest } from "../common/auth_middleware";
import {extractUserName, toJSONFile} from "../common/utils";
import { FilterQuery } from "mongoose";
import { filterExists,filterPartOf ,filterByTags, filterByProfessionalFieldsTospesificData, filterParseInt, filterStringUsingIn, filterByDate ,escapeRegExp , professionalFields, professionalFieldsHas, finalFields} from "../common/utils";
import exp from "constants";
import * as fs from 'fs';
import * as fc from 'fast-csv';
const base = process.env.URL;
import {toCSVFile} from "../common/utils";
import { file } from "mock-fs/lib/filesystem";
import path from 'path';

class dapit_Controller extends BaseController<IDapit>{
    constructor() {
        super(dapit_model)
    }
    //THIS RUN GREAT!
    async get (req: Request, res: Response) {
        //console.log("get all dapit - get controller");
        try {
            const obj = await this.model.find();
            res.status(200).send(obj);
        } catch (error) {
            //console.error('Error fetching dapit:', error);
            res.status(500).send({ message: 'Error fetching dapit' });
        }
    }
    async getByFilter(req: Request, res: Response) {
        //console.log("getByFilter - get controller");
    
        // Initialize filter as an empty array
        let filters: any[] = filterExists(req, professionalFields);
    
        //console.log("filters in getByFilter: " + JSON.stringify(filters));
    
        // Initialize filter object
        const filterObject: any = {};
    
        // Populate filter object based on query logic
        if (req.query.logic === "and") {
            filterObject.$and = filters;
        } else if (req.query.logic === "or") {
            //console.log("or logic");
            filterObject.$or = filters;
        } else {
            return res.status(400).send({ message: 'Invalid query logic' });
        }
    
        try {
            const obj = await this.model.find(filterObject);
            res.status(200).send(obj);
        } catch (error) {
            //console.error('Error fetching dapit:', error);
            res.status(500).send({ message: 'Error fetching dapit' });
        }
    }
    async getCSVfile(req: Request, res: Response) {
        //console.log("getCSVfile - get controller");
        try {
            const data = await this.model.find();
            const bool = toCSVFile(data, "csv/allCSV.csv");
            if (bool)
                res.status(200).send({ message: 'CSV file created successfully' });
            else
                res.status(500).send({ message: 'Error creating CSV file' });
        } catch (error) {
            //console.error('Error fetching dapit:', error);
            res.status(500).send({ message: 'Error fetching dapit' });
        }
    }
    async getCSVfiletrainerId(req: Request, res: Response) {
        try {
            const trainerId = req.params.trainerId;
            //console.log("getCSVfiletrainerId: " + trainerId);
        
            const data = await this.model.find({ idTrainer: trainerId });
            const name = data[0].nameTrainer;
            //console.log("name: " + name);
            const bool = toCSVFile(data, "csv/" + name+"1.csv");    
            if (bool)
                res.status(200).send({ message: 'CSV file created successfully' });
            else
                res.status(500).send({ message: 'Error creating CSV file' });
            } catch (error) {
            //console.error('Error fetching dapit:', error);
            res.status(500).send({ message: 'Error fetching dapit' });
            }
      }

    async getDocumentbyFilter(req: Request, res: Response) {
        //console.log("getDocumentbyFilter - get controller");
        try {
            const query = req.query;
            //console.log(" getDocumentbyFilter query: " + JSON.stringify(query));
            let data;
            let fileName;
            if (Object.keys(query).length === 0) {
                data =await this.model.find();
                fileName = "all.json";
            }
            else {
                //console.log("in the else getDocumentbyFilter query: ");
                data = await this.model.find(query);
                //console.log("data: " + JSON.stringify(data));
                fileName = data[0]._id + ".json";
            }
            if (data.length === 0) {
                res.status(404).send({ message: 'No documents found' });
            }
            const filepath = "json/" + fileName
            const success = await toJSONFile(data, filepath);
            if (success) {
                res.status(200).send({ message: 'JSON file created successfully', filepath });
            } else {
                res.status(500).send({ message: 'Error creating JSON file' });
            }
        } catch (error) {
                //console.error('Error fetching data:', error);
                res.status(500).send({ message: 'Error fetching data' });
        }
    }
      


    async getByFilterBasicInfo(req: Request, res: Response) {
        let filter = {}; // Initialize filter object as an empty object
        //console.log("getByFilterBasicInfo - get controller");
        //console.log("Logic: " + req.query.tagsLogic)
        // Get filter conditions from different filter functions
        filter = {
            ...filterPartOf(req, ['advantage', 'disavantage', 'nameInstractor', 'namePersonalInstractor', 'nameTrainer', 'group', 'idPersonalInstractor', 'idInstractor', 'idTrainer', 'session', 'summerize']), // Spread operator
            ...filterByDate(req),
            ...filterParseInt(req, ['silabus', 'finalGrade', 'changeTobeCommender']),
            ...filterByProfessionalFieldsTospesificData(req, ['identification', 'payload', 'decryption', 'workingMethod', 'understandingTheAir', 'flight', 'theortical', 'thinkingInAir', 'safety', 'briefing', 'debriefing', 'debriefingInAir', 'implementationExecise', 'dealingWithFailures', 'dealingWithStress', 'makingDecisions', 'pilotNautre', 'crewMember']),
            //its alyaws need to be a tagsOrLogic
            ...filterByTags(req, req.query.tagsLogic as string)
        
        };
        //console.log("filer in controller: " + JSON.stringify(filter, null, 2));
        if (req.query.date){
            filter["date"] = new Date(req.query.date as string);
        }      
        try {
          const obj = await this.model.find(filter);
          res.status(200).send(obj);
        } catch (error) {
          //console.error('Error fetching dapit:', error);
          res.status(500).send({ message: 'Error fetching dapit' });
        }
      }
      
    

    async post (req: Request, res: Response) {
        //console.log("post - post controller");
        try {
            const obj = new this.model(req.body);
            await obj.save();
            res.status(200).send(obj);
        } catch (error) {
            //console.error('Error creating dapit:', error);
            res.status(500).send({ message: 'Error creating dapit' });
        }
    }

    async putById (req: Request, res: Response) {
        //console.log("put by id - put controller");
        try {
            const obj = await this.model.findByIdAndUpdate(req.params.id, req.body, { new: true });
            res.status(200).send(obj);
        } catch (error) {
            //console.error('Error updating dapit:', error);
            res.status(500).send({ message: 'Error updating dapit' });
        }
    }
    async deleteById (req: Request, res: Response) {
        //console.log("delete by id - delete controller");
        //console.log("id" + req.params.id);
        try {
            await this.model.findByIdAndDelete(req.params.id);
            res.status(200).send({ message: 'Deleted successfully' , deletedId: req.params.id});
        } catch (error) {
            //console.error('Error deleting dapit:', error);
            res.status(500).send({ message: 'Error deleting dapit' });
        }
    }   
    async getSementically(req: Request, res: Response) {
        const gradingCategories = [
            "identification",
            "payload",
            "decryption",
            "workingMethod",
            "understandingTheAir",
            "flight",
            "theoretical",
            "thinkingInAir",
            "safety",
            "briefing",
            "debriefing",
            "debriefingInAir",
            "implementationExecise",
            "dealingWithFailures",
            "dealingWithStress",
            "makingDecisions",
            "pilotNature",
            "crewMember",
          ];
          
        
        console.log("getSementically - get controller");
        console.log("id: " + req.params.id);
        try {
            const transformedObj = {
                text: [], // initialize empty text array
              };
            const idDapit = req.params.id;
            const obj = await this.model.find({_id: idDapit});
            for (const category  of gradingCategories) {
                console.log("category: " + category)
                // console.log("obj[0][category]: " + obj[0][category])
                // console.log("obj[0][category].description: " + obj[0][category][0].description)
                if (obj[0][category] && obj[0][category].length > 0 && obj[0][category][0].description)
                {
                    transformedObj.text.push(`${category}: ${obj[0][category][0].description}`);
                }
            }
            if (obj[0].summerize && obj[0].summerize.length > 0) {
                transformedObj.text.push("summary: " + obj[0].summerize);
            }
            const labelSums: {[label: string]: number} = {};
            const flaskres = await axios.post('http://127.0.0.1:5000/sentimental', transformedObj);
            console.log("flaskres: " + JSON.stringify(flaskres.data));
            console.log("transformedObj: " + JSON.stringify(transformedObj));
            console.log("obj: " + JSON.stringify(obj));
            console.log("flaskres.data.length: " + flaskres.data.length);
            for (let i = 0; i < flaskres.data.length-1; i++) {
                console.log("inside the loop")
                console.log("flaskres.data[i].scores: " + JSON.stringify(flaskres.data[i].scores));
                const scores = flaskres.data[i];
                
                for (const score of scores) {
                    labelSums[score.label] = (labelSums[score.label] || 0) + score.score;
                }
            }
            console.log("flaskres.data[flaskres.data.length-1].scores: " + JSON.stringify(flaskres.data[flaskres.data.length-1].scores));
            const scoreLast = flaskres.data[flaskres.data.length-1];
            for (const score of scoreLast) {
                console.log("inside the last one")
                labelSums[score.label] = (labelSums[score.label] || 0) + score.score*1.2;
            }
            console.log("labelSums: " + JSON.stringify(labelSums));
            res.status(200).send(labelSums);
        } catch (error) {
            // console.error('Error fetching dapit:', error);
            res.status(500).send({ message: 'Error fetching dapit' });
        }
    }
   
}

export default new dapit_Controller;