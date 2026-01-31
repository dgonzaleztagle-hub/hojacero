"use client";

import { useState, useEffect } from "react";

export type ExtraHourEntry = {
    date: string;
    hours: number;
    paid: boolean;
    notes?: string;
};

export function useHoursExtra() {
    const [entries, setEntries] = useState<ExtraHourEntry[]>([]);
    const [cycleStartDay, setCycleStartDay] = useState(15);

    useEffect(() => {
        const saved = localStorage.getItem("h0_love_hours");
        if (saved) {
            setEntries(JSON.parse(saved));
        }
    }, []);

    useEffect(() => {
        localStorage.setItem("h0_love_hours", JSON.stringify(entries));
    }, [entries]);

    const addEntry = (entry: ExtraHourEntry) => {
        setEntries((prev) => {
            const filtered = prev.filter((e) => e.date !== entry.date);
            return [...filtered, entry];
        });
    };

    const markAsPaid = (beforeDate: string) => {
        setEntries((prev) =>
            prev.map((e) => (new Date(e.date) <= new Date(beforeDate) ? { ...e, paid: true } : e))
        );
    };

    const getCycleStats = () => {
        const now = new Date();
        let start = new Date(now.getFullYear(), now.getMonth(), cycleStartDay);
        if (now.getDate() < cycleStartDay) {
            start.setMonth(start.getMonth() - 1);
        }

        const end = new Date(start);
        end.setMonth(end.getMonth() + 1);

        const pendingHours = entries
            .filter((e) => !e.paid && new Date(e.date) >= start && new Date(e.date) < end)
            .reduce((acc, curr) => acc + curr.hours, 0);

        const totalHistory = entries
            .filter((e) => !e.paid)
            .reduce((acc, curr) => acc + curr.hours, 0);

        return { pendingHours, totalHistory, start, end };
    };

    return { entries, addEntry, markAsPaid, getCycleStats };
}
