//json to ts
//duration porque nao existe nenhum datatype para Timespan

import {Ingredient} from "./ingredient";
import {Profile} from "./profile";

export interface Duration {
    ticks: number | undefined;
    days: number | undefined;
    hours: number | undefined;
    milliseconds: number | undefined;
    minutes: number | undefined;
    seconds: number | undefined;
    totalDays: number | undefined;
    totalHours: number | undefined;
    totalMilliseconds: number | undefined;
    totalMinutes: number | undefined;
    totalSeconds: number | undefined;
}

export interface Recipe {
    id: string;
    title: string;
    difficulty: string;
    duration: Duration | any | null;
    createdAt: Date | null;
    ownerUsername?: string;
    cookers?: Profile[];
    ingredients:Ingredient[];
}

