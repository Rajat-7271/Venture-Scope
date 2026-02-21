import axios from "axios";
import type { VercelRequest, VercelResponse } from "@vercel/node";

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { name, website } = req.body || {};

    if (!name) {
      return res.status(400).json({ error: "Company name missing" });
    }

    const safeWebsite =
      typeof website === "string" && website.trim() !== ""
        ? website.startsWith("http")
          ? website
          : `https://${website}`
        : `https://${name.toLowerCase().replace(/\s+/g, "")}.com`;

    let pageText = "";

    try {
      const response = await axios.get(safeWebsite, { timeout: 5000 });
      pageText = response.data;
    } catch (err) {
      console.warn("Website fetch failed → fallback mock");
    }

    const enrichment = {
      summary: pageText
        ? `${name} website successfully fetched for enrichment.`
        : `${name} is a fast-growing company operating in the tech space.`,

      whatTheyDo: [
        "Live website data pull attempted",
        pageText ? "Real content fetched" : "Fallback mock used",
        "Structured enrichment generated",
      ],

      keywords: ["Live Data", "Enrichment", "AI Scout", "VC Intelligence"],

      signals: [
        {
          text: pageText ? "Website reachable" : "Website fetch failed",
          date: "Live Check",
        },
        {
          text: "Enrichment generated server-side",
          date: "System",
        },
      ],

      score: pageText ? 85 : 70,
      risk: pageText ? "Lower" : "Medium",
      verdict: pageText
        ? "Validated via Live Pull"
        : "Mock Fallback",

      timestamp: new Date().toLocaleString(),

      sources: [{ label: "Homepage", url: safeWebsite }],
    };

    return res.status(200).json(enrichment);

  } catch (error) {
    console.error("Enrichment error:", error);
    return res.status(500).json({ error: "Enrichment failed" });
  }
}