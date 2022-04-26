//json to ts
//duration porque nao existe nenhum datatype para Timespan

export interface Duration {
    ticks: number;
    days: number;
    hours: number;
    milliseconds: number;
    minutes: number;
    seconds: number;
    totalDays: number;
    totalHours: number;
    totalMilliseconds: number;
    totalMinutes: number;
    totalSeconds: number;
}

export interface Recipe {
    id: string;
    title: string;
    difficulty: string;
    duration: Duration;
    createdAt: Date;
}

