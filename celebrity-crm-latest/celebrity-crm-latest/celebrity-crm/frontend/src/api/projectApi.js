import axios from "axios";

const http = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

const tints = [
  "from-[#5a3f10] via-[#2a1d0b] to-[#13101a]",
  "from-[#17314a] via-[#14202e] to-[#13101a]",
  "from-[#0f4a3f] via-[#12261f] to-[#13101a]",
  "from-[#33205f] via-[#1c1530] to-[#13101a]",
  "from-[#4a1730] via-[#241320] to-[#13101a]",
  "from-[#5a2f10] via-[#2a180c] to-[#13101a]",
];

export const getProjects = () =>
  http
    .get("/projects")
    .then((res) =>
      res.data.map((project) => ({
        ...project,
        tint: tints[project.id % tints.length],
      })),
    );