import {QuickDB} from "quick.db";
const db = new QuickDB();

export interface ventContent {
  message: string;
  date: Date;
};

export async function setVent(message: string) {
  return await db.push<ventContent>("vents", {message, date: new Date()});
};

export async function getVents() {
  return await db.get<ventContent[]>("vents");
};