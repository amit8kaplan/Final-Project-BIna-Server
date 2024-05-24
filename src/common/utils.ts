import mongoose, { FilterQuery } from "mongoose";
import user_model from "../models/user_model";
import course_model, { ICourse } from "../models/course_model";
import { Request } from "express";
import * as fc from 'fast-csv';
import fs from 'fs';
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
    'finalGrade', 'summerize'
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
