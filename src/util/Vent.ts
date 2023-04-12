import {QuickDB} from "quick.db";
const db = new QuickDB();
const ventsID = "vents";

export interface ventContent {
  message: string;
  date: Date;
  ventID?: string;
};

export async function setVent(message: string) {
  return await db.push<ventContent>(ventsID, { message, date: new Date(), ventID: Date.now().toString() });
};

export async function getVents() {
  return await db.get<ventContent[]>(ventsID);
};

export async function deleteVent(ventID: string) {
  try {
    const vents = await getVents();
    if (!vents?.length) return null;

    return await db.set<ventContent[]>(ventsID, vents.filter(val => val.ventID !== ventID));
  } catch (error) {
    console.error(error);
    return null;
  };
};