import mongoose, { FilterQuery, PipelineStage } from "mongoose";
import user_model from "../models/user_model";
import course_model, { ICourse } from "../models/course_model";
import dapit_model from "../models/dapit_model";
import { IDapit } from "../models/dapit_model";
import post_model from "../models/post_model";
import { Request } from "express";
import * as fc from 'fast-csv';
import fs from 'fs';
const nodemailer = require('nodemailer');
const outlook_pwd = process.env.OUTLOOK_PWD;
const outlook_host = process.env.OUTLOOK_HOST;
const outlook_port = process.env.OUTLOOK_PORT;
const outlook_user = process.env.OUTLOOK_USER;

export function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
}
export const professionalFields = [
    'identification', 'payload', 'decryption', 'workingMethod',
    'understandingTheAir', 'flight', 'theoretical', 'thinkingInAir',
    'safety', 'briefing', 'debriefing', 'debriefingInAir',
    'implementationExecise', 'dealingWithFailures', 'dealingWithStress',
    'makingDecisions', 'pilotNature', 'crewMember'
];

export const professionalFieldsHas = [
    'has_identification', 'has_payload', 'has_decryption', 'has_workingMethod',
    'has_understandingTheAir', 'has_flight', 'has_theoretical', 'has_thinkingInAir',
    'has_safety', 'has_briefing', 'has_debriefing', 'has_debriefingInAir',
    'has_implementationExecise', 'has_dealingWithFailures', 'has_dealingWithStress',
    'has_makingDecisions', 'has_pilotNature', 'has_crewMember'
];

export const finalFields = [
    'finalGrade', 'summerize', "changeTobeCommender"
]; 

export function filterExists(req: Request, filterFields: string[]): any[] {
    const filters: any[] = [];
    filterFields.forEach((field) => {
        if (req.query["has_" + field]) {
            filters.push({ [field + ".value"]: { $exists: true } });
        }
    });
    return filters;
}

export function filterByDate(req: Request) {
    const filter: any = {};
    if (req.query.startDate && req.query.endDate) {
        filter.date = {
            $gte: new Date(req.query.startDate as string),
            $lte: new Date(req.query.endDate as string)
        };
    }
    else if (req.query.startDate) {
        filter.date = { $gte: new Date(req.query.startDate as string) };
    }
    else if (req.query.endDate) {
        filter.date = { $lte: new Date(req.query.endDate as string) };
    }
    return filter;
}
export function filterByProfessionalFieldsTospesificData(req: Request, filterFields: string[]) {
    const filter: any = {};
    filterFields.forEach((field) => {
        
        if (req.query[field + "Val"]) {
            console.log (field + "Val === crewMemberVal")
            console.log("field: ", field);
            console.log("req.query[field] in filterByProfessionalFieldsTospesificData: ", req.query[field+"Val"]);
            filter[field + ".value"] = parseInt(req.query[field+"Val"] as string);
        }
        if (req.query[field + "Description"]) {
            const escaped = escapeRegExp(req.query[field + "Description"] as string);
            filter[field + ".description"] = { $regex: new RegExp(escaped, 'i') };
        }
    });
    return filter;
}

export function filterParseInt(req: Request, filterFields: string[]) {
    const filter: any = {};
    filterFields.forEach((field) => {
        if (req.query[field]) {
            filter[field] = parseInt(req.query[field] as string);
        }
    });
    return filter;
}

export function filterStringUsingIn(req: Request, filterFields: string[]) {
    const filter: any = {};
    filterFields.forEach((field) => {
        if (req.query[field]) {
            filter[field] = { $in: [req.query[field]] };
        }
    });
    return filter;
}

export function filterByTags(req: Request, Logic: string) {
    const filter: any = {};
    if (req.query.tags) {
        if (Logic === "and") {
            console.log("in side the if and");
            filter.tags = { $all: req.query.tags as string[] };
        } else {
            filter.tags = { $in: req.query.tags as string[] };
        }
    }
    return filter;
}

export function filterPartOf(req: Request, filterFields: string[]) {
    const filter: any = {}; // Initialize filter object as an empty object
    filterFields.forEach((field) => {
        if (req.query[field]) {
            const escaped = escapeRegExp(req.query[field] as string);
            if (Array.isArray(req.query[field])) {
                const values = req.query[field] as string[];
                const regex = values.map((value: string) => new RegExp(escapeRegExp(value), 'i'));
                filter[field] = { $in: regex };
            } else {
                filter[field] = { $regex: new RegExp(escaped, 'i') };
            }
        }
    });
    return filter;
}

export async function toCSVFile(data: any[], path: string) {
    
    try{ 
        if(fs.existsSync(path)) {
            fs.unlinkSync(path);
            console.log("file deleted");
        }
        const csvStream = fc.format({ headers: true });
        const writableStream = fs.createWriteStream(path);

        csvStream.pipe(writableStream).on('end', () => {
            console.log("end");
        });
        

        data.forEach((doc) => {
            const filteredDoc = { ...doc.toJSON() };
            delete filteredDoc._id;

            // Handle nested objects:
            const nestedObjectKeys = [
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

            for (const key of nestedObjectKeys) {
                if (filteredDoc[key]) {
                    for (const item of filteredDoc[key]) {
                        for (const subKey in item) {
                            if (subKey !== "_id")
                                filteredDoc[`${key}.${subKey}`] = item[subKey];
                        }
                    }
                    delete filteredDoc[key];
                }
            }

            csvStream.write(filteredDoc);
        });

        csvStream.end();
        return true;
    } catch (error) {
        console.error('Error fetching dapit:', error);
        return false;
    }
}

import fs1 from 'fs/promises';
import path from 'path';

// Function to save data to a JSON file
export async function toJSONFile(data: any[], filePath: string) {
    try {
        // Ensure the directory exists
        const directoryPath = path.dirname(filePath);
        if (!fs.existsSync(directoryPath)) {
            await fs1.mkdir(directoryPath, { recursive: true });
        }

        // Delete the file if it exists
        if (fs.existsSync(filePath)) {
            await fs1.unlink(filePath);
            console.log("File deleted");
        }

        // Write data to JSON file
        const jsonData = JSON.stringify(data, null, 2);
        await fs1.writeFile(filePath, jsonData, 'utf-8');
        console.log(`Data written to JSON file: ${filePath}`);
        return true;
    } catch (error) {
        console.error('Error writing to JSON file:', error);
        return false;
    } 
}


export async function extractUserName(id : string) {
    const objId = new mongoose.Types.ObjectId(id);
        const userModel = await user_model.findById(objId);
        return userModel.user_name;
}

export async function incCountInCourseName(id: string) {
    try {
        const courseModel = await course_model.findOneAndUpdate(
            { _id: id }, 
            { $inc: { Count: 1 } }, 
            { new: true }
        );
        return (courseModel as ICourse).Count;
    } catch (err) {
        return { message: err.message };
    }
}


export async function decCountInCourseName(id: string | number | mongoose.mongo.BSON.ObjectId | Uint8Array | mongoose.mongo.BSON.ObjectIdLike) {
    const objId = new mongoose.Types.ObjectId(id);
    try{
        const course_obj =await course_model.findById(objId);
            course_obj.Count = course_obj.Count - 1;
            const count = await course_model.findByIdAndUpdate({_id: objId}, {$set: {Count: course_obj.Count}});
            return count.Count
        
    }
    catch (err) {
        return { message: err.message };
    }

}

export  async  function PostPipeline(id: string) {
   const postPipeline: PipelineStage[] = [
        {
            $match: { idTrainer: id },
        },
        {
            $sort: { date: -1 }, // Sort posts by date ascending
        },
        {
            $lookup: {
                from: "responses",
                let: { postId: "$_id" }, // Define variable to hold the ObjectId as string
                pipeline: [
                    {
                        $match: {
                            $expr: { $eq: ["$idPost", { $toString: "$$postId" }] }, // Convert ObjectId to string for comparison
                        },
                    },
                ],
                as: "responses",
            },
        },
    ];
    return postPipeline;
}

export async function DapitPipeline(id: string) {
    const dapitPipeline: PipelineStage[] = [
        {
            $match: { idTrainer: id },
        },
        {
            $sort: { date: -1 }, // Sort dapits by date ascending
        },
        {
            $lookup: {
                from: "responses",
                let: { dapitId: "$_id" }, // Define variable to hold the ObjectId as string
                pipeline: [
                    {
                        $match: {
                            $expr: { $eq: ["$idDapit", { $toString: "$$dapitId" }] }, // Convert ObjectId to string for comparison
                        },
                    },
                ],
                as: "responses",
            },
        },
    ];
    return dapitPipeline;
}

export async function aggregateDataWall (dapitPipeline: PipelineStage[],postPipeline: PipelineStage[] ){
    try {
        const [dapits, posts] = await Promise.all([
            dapit_model.aggregate(dapitPipeline),
            post_model.aggregate(postPipeline),
        ]);
        return { dapits, posts };
    } catch (error) {
        console.error('Error fetching dapit:', error);
        return { dapits: [null], posts: [null]};
    }

}


export async function sentEmailToUser (email: string) {
    const smtpConfig = {
        host: outlook_host,
        port: outlook_port,
        secure: false, // true for 465, false for other ports
        auth: {
            user: outlook_user, // your Outlook email
            pass: outlook_pwd // your email password
        }
    }; 
    const mailOptions = {
        from: outlook_user, // sender address
        to: email, // list of receivers
        subject: 'Test Email', // Subject line
        text: 'This is a test email sent from a Node.js script.' // plain text body
    };

    try {
        // Create a transporter
        let transporter = nodemailer.createTransport(smtpConfig);

        // Send mail with defined transport object
        let info = await transporter.sendMail(mailOptions);
        return info;
    } catch (error) {
        return { message: error.message };
    }
}
export function jsonToTextWithInsertion(jsonData: object, insertBeforeKey: string, insertText: string): string {
    // Helper function to parse JSON recursively
    function parseObject(obj: any, indentLevel: number = 0): string {
      let result = '';
      const indent = '  '.repeat(indentLevel); // Indentation for nested objects
  
      for (const [key, value] of Object.entries(obj)) {
        // Insert the custom text before the specified key
        if (key === insertBeforeKey) {
          result += `${indent}${insertText}\n`;
        }
  
        // Add the key and its value
        result += `${indent}${key}: `;
  
        if (typeof value === 'object' && !Array.isArray(value)) {
          result += '\n' + parseObject(value, indentLevel + 1); // Recursively parse nested objects
        } else if (Array.isArray(value)) {
          result += value.join(' ') + '\n'; // Flatten arrays
        } else {
          result += `${value}\n`;
        }
      }
      return result;
    }
  
    // Convert the JSON object into a formatted string
    return parseObject(jsonData).trim();
  }
  
  // Example usage:
  const jsonData = {
    // Your JSON data here...
    // (Same structure as the one you provided)
  };
  
  const insertBeforeKey = "identification"; // Specify the key before which the custom text should be inserted
  const insertText = "  This is custom text inserted here!"; // Custom text to insert
  
  console.log(jsonToTextWithInsertion(jsonData, insertBeforeKey, insertText));
  
// export function jsonToTextWithInsertion_OnDapit (obj: object) {
    // const json = obj as IDapit;
    // const indentLevel:number = 0;
    // let summerize:string = "";
    // let advantage = "";
    // let disavantage = "";
    // let finalGrade = "";
    // let changeTobeCommender = "";
    // let result = "this is the form that writen on the trainer "+ json.nameTrainer + " after is flight. The Instactor in the flight was " + json.nameInstractor +".\n" +
    // "The silabus is " + json.silabus + ", in the session"  + json.session + ".\n" + "These are the things he is being tested on, during the flight:\n"; 
    // let indent = ' '.repeat(indentLevel)
    // for (const [key, value] of Object.entries(json)) {
    //     if (key != "nameTrainer" && key != "nameInstractor" && key != "silabus" && key != "session" && key!= "date" && key != "tags" && key != "_id" && key != "idPersonalInstractor" && key != "idInstractor" && key != "idTrainer") {
    //         if (key === "summerize") {
    //             summerize = value;
    //         }
    //         else if (key === "advantage") {
    //             advantage = value;
    //         }
    //         else if (key === "disavantage") {
    //             disavantage = value;
    //         }
    //         else if (key === "finalGrade") {
    //             finalGrade = value;
    //         }
    //         else if (key === "changeTobeCommender") {
    //             changeTobeCommender = value;
    //         }
    //         else if (Array.isArray(value)) {
    //             if (typeof value[0] === 'object') {
    //               result += '\n' + value.map(item => parseObject(item, indentLevel + 1)).join('');
    //             } else {
    //               result += value.join(' ') + '\n'; // Flatten arrays
    //             }
    //         }
    //          // Handle simple key-value pairs
    //         else {
    //             result += `${value}\n`;
    //         }
        
    //     }
    // }
    // if (advantage != "") {
    //     result += "The advantage of the trainer is: " + advantage + ".\n";
    // }
    // else if (disavantage != "") {
    //     result += "The disavantage of the trainer is: " + disavantage + ".\n";
    // }
    // else if (summerize != "") {
    //     result += "The summerize of the flight is: " + summerize + ".\n";
    // }
    // else if (finalGrade != "")
    // {
    //     result += "The final Grade is: " + finalGrade + ".\n";
    // }
    // else if (changeTobeCommender != "")
    // {
    //     result += "The change to be commender is: " + changeTobeCommender + ".\n";
    // }
    // return result;}

// function parseObject(item: any, arg1: number): any {
//     throw new Error("Function not implemented.");
// }
