    import axios from "axios";
    import express from "express";
    import { createServer } from "http";
    import { setupVite } from "./vite";

    const app = express();
    const server = createServer(app);

    app.use(express.json());

    app.post("/api/enrich", async (req, res) => {
      try {
        const { name, website } = req.body || {};

        // ✅ Validate input
        if (!name) {
          return res.status(400).json({ error: "Company name missing" });
        }

        // ✅ SAFE website handling
        const safeWebsite =
          typeof website === "string" && website.trim() !== ""
            ? website.startsWith("http")
              ? website
              : `https://${website}`
            : `https://${name.toLowerCase().replace(/\s+/g, "")}.com`;

        // ✅ Live website fetch
        let pageText = "";

        try {
          const response = await axios.get(safeWebsite, {
            timeout: 5000,
          });

          pageText = response.data;
        } catch (err) {
          console.warn("⚠ Website fetch failed, fallback to mock");
        }

        // ✅ Enrichment response
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

        // ✅ Send response
        res.json(enrichment);

      } catch (error) {
        console.error("❌ ENRICH ERROR:", error);
        res.status(500).json({ error: "Enrichment failed" });
      }
    });

    // ✅ Start server (OUTSIDE route)
    async function start() {
      console.log("Setting up Vite...");
      await setupVite(server, app);

      const PORT = process.env.PORT || 5000;

      server.listen(PORT, () => {
        console.log(`✅ Server running on port ${PORT}`);
      });
    }

    start();