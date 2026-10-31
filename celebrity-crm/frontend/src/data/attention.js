import { events } from "./schedule";
import { projects } from "./projects";
import { isSameDay, startOfDay } from "../utils/dates";

const order = { overdue: 0, today: 1, week: 2 };

export const getAttention = () => {
  const today = startOfDay(new Date());
  const items = [];

  events
    .filter((event) => event.status === "updated" && event.date >= today)
    .forEach((event) => {
      items.push({
        id: `event-${event.id}`,
        kind: "schedule",
        title: "Call time changed",
        detail: `${event.project}, now ${event.callTime}`,
        urgency: isSameDay(event.date, today) ? "today" : "week",
        action: "Confirm",
        target: "schedule",
        date: event.date,
      });
    });

  projects
    .filter((project) => project.contract === "awaiting")
    .forEach((project) => {
      items.push({
        id: `contract-${project.id}`,
        kind: "contract",
        title: "Sign your contract",
        detail: project.title,
        urgency: "week",
        action: "Sign now",
        target: "contracts",
      });
    });

  items.push({
    id: "ad-cut",
    kind: "approve",
    title: "Approve the watch ad cut",
    detail: "30 second festival film",
    urgency: "today",
    action: "Review",
    target: "deals",
  });

  return items.sort((a, b) => order[a.urgency] - order[b.urgency]);
};
