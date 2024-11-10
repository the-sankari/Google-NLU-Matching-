import express from "express";
import axios from "axios";
import dotenv from "dotenv";
dotenv.config();
const app = express();

// Use process.env.PORT for the Vercel environment
const port = process.env.PORT || 8080;

// Google Cloud NLP API Key and URL
const API_KEY = process.env.GOOGLE_API_KEY; // Ensure this is correctly set in your .env file
const NLP_URL = `https://language.googleapis.com/v1/documents:analyzeSentiment?key=${API_KEY}`;
const NLP_ENTITY_URL = `https://language.googleapis.com/v1/documents:analyzeEntities?key=${API_KEY}`;
const NLP_SYNTAX_URL = `https://language.googleapis.com/v1/documents:analyzeSyntax?key=${API_KEY}`;
const DATA_URL = "https://github.com/alextrandev/junction_2024_challenge/raw/main/db.json";

// Function to fetch data from the URL
async function fetchData() {
  try {
    const response = await axios.get(DATA_URL);
    return response.data;
  } catch (error) {
    console.error("Error fetching data:", error.message);
    return null;
  }
}

const data = await fetchData(); // Fetch data each time the route is hit
// Function to analyze text using Google Cloud NLP API
async function analyzeDocument(text, analysisType) {
  const document = {
    document: {
      content: text,
      type: "PLAIN_TEXT",
    },
  };

  const url =
    analysisType === "sentiment"
      ? NLP_URL
      : analysisType === "entities"
      ? NLP_ENTITY_URL
      : NLP_SYNTAX_URL;

  try {
    console.log(`Sending request to ${url} with data:`, document); // Log request
    const response = await axios.post(url, document);
    console.log(`Response from ${analysisType}:`, response.data); // Log response
    return response.data;
  } catch (error) {
    console.error(
      `Error with ${analysisType} analysis:`,
      error.response ? error.response.data : error.message
    );
    return null;
  }
}

// Function to analyze sentiment, entities, and syntax
async function analyzeText(text) {
  if (!text || text.trim() === "") {
    console.log("Empty or invalid text input for analysis");
    return {
      sentimentScore: 0,
      sentimentMagnitude: 0,
      entities: [],
      syntax: [],
    };
  }

  try {
    const sentimentResponse = await analyzeDocument(text, "sentiment");
    const sentimentScore = sentimentResponse
      ? sentimentResponse.documentSentiment.score
      : 0;
    const sentimentMagnitude = sentimentResponse
      ? sentimentResponse.documentSentiment.magnitude
      : 0;

    const entityResponse = await analyzeDocument(text, "entities");
    const entities = entityResponse
      ? entityResponse.entities.map((entity) => entity.name)
      : [];

    const syntaxResponse = await analyzeDocument(text, "syntax");
    const syntax = syntaxResponse
      ? syntaxResponse.tokens.map((token) => ({
          text: token.text.content,
          partOfSpeech: token.partOfSpeech.tag,
        }))
      : [];

    return {
      sentimentScore,
      sentimentMagnitude,
      entities,
      syntax,
    };
  } catch (error) {
    console.error("Error analyzing text:", error.message);
    return {
      sentimentScore: 0,
      sentimentMagnitude: 0,
      entities: [],
      syntax: [],
    };
  }
}

// Function to calculate match score between a job seeker and a job position
async function calculateMatchScore(jobSeeker, jobPosition) {
  let score = 0;
  let totalWeight = 0;

  // Compare work style compatibility
  if (jobSeeker.workStyles && jobPosition.workStyles) {
    const workStyleMatch = jobSeeker.workStyles.some((style) =>
      jobPosition.workStyles.includes(style)
    );
    if (workStyleMatch) {
      score += 15;
    }
    totalWeight += 15;
  }

  // Compare values
  if (jobSeeker.values && jobPosition.values) {
    const valueMatch = jobSeeker.values.some((value) =>
      jobPosition.values.includes(value)
    );
    if (valueMatch) {
      score += 10;
    }
    totalWeight += 10;
  }

  // Compare flexibility (working conditions)
  if (
    jobSeeker.workingConditions &&
    jobSeeker.workingConditions.flexibility &&
    jobPosition.workingConditions
  ) {
    const flexibilityMatch = jobSeeker.workingConditions.flexibility.some(
      (flex) => jobPosition.workingConditions.flexibility.includes(flex)
    );
    if (flexibilityMatch) {
      score += 10;
    }
    totalWeight += 10;
  }

  // Location match (remote, hybrid, onsite, proximity)
  if (
    jobSeeker.workingConditions &&
    jobSeeker.workingConditions.location &&
    jobPosition.selectionCriteria &&
    jobPosition.selectionCriteria.location
  ) {
    const preferredLocation =
      jobSeeker.workingConditions.location.preferred === "Remote" ? 1 : 0;
    const locationMatch =
      preferredLocation === 1 ||
      parseInt(jobSeeker.distance, 10) <=
        parseInt(jobPosition.selectionCriteria.location.radius, 10); // Fix location distance matching
    if (locationMatch) {
      score += 15;
    }
    totalWeight += 15;
  }

  // Skills match
  if (
    jobSeeker.skills &&
    jobPosition.selectionCriteria &&
    jobPosition.selectionCriteria.skills
  ) {
    const skillMatch = jobSeeker.skills.every((skill) =>
      jobPosition.selectionCriteria.skills.includes(skill)
    );
    if (skillMatch) {
      score += 20;
    }
    totalWeight += 20;
  }

  // Experience match
  if (
    jobSeeker.experience !== undefined &&
    jobPosition.selectionCriteria &&
    jobPosition.selectionCriteria.experience !== undefined
  ) {
    if (jobSeeker.experience === jobPosition.selectionCriteria.experience) {
      score += 20;
    }
    totalWeight += 20;
  }

  // Analyze Sentiment and Emotion of Job Seeker's Headline and Job Position Title
  const jobSeekerText =
    jobSeeker.headline +
    " " +
    jobSeeker.positionHistory.map((p) => p.position).join(" ");
  const jobPositionText = jobPosition.title;

  const jobSeekerAnalysis = await analyzeText(jobSeekerText);
  const jobPositionAnalysis = await analyzeText(jobPositionText);

  // Sentiment match: Compare the sentiment of job seeker and job position
  if (
    Math.abs(
      jobSeekerAnalysis.sentimentScore - jobPositionAnalysis.sentimentScore
    ) < 0.2
  ) {
    score += 5;
    totalWeight += 5;
  }

  // Entity match: Compare entities (like skills, company names, etc.)
  const commonEntities = jobSeekerAnalysis.entities.filter((entity) =>
    jobPositionAnalysis.entities.includes(entity)
  );
  if (commonEntities.length > 0) {
    score += 5;
    totalWeight += 5;
  }

  // Normalize match score to percentage
  const percentageMatch = (score / totalWeight) * 100;
  return percentageMatch;
}

// API to get all job seekers and their match score for the recruiter (company)
app.get("/recruiter-match", async (req, res) => {
  const data = await fetchData(); // Fetch data asynchronously
  if (!data) {
    return res.status(500).json({ error: "Failed to fetch data" });
  }
  try {
    const jobSeekersWithMatch = await Promise.all(
      data.JobSeeker.map(async (jobSeeker) => {
        const companyMatches = await Promise.all(
          data.Company.map(async (company) => {
            const matchPercentage = await calculateMatchScore(
              jobSeeker,
              company.jobPosition
            );
            return {
              companyName: company.name,
              jobPost: company.jobPosition.title,
              matchPercentage: matchPercentage.toFixed(2),
            };
          })
        );
        return {
          jobSeeker: jobSeeker.headline,
          jobSeekerId: jobSeeker.id,
          matches: companyMatches,
        };
      })
    );
    res.json(jobSeekersWithMatch);
  } catch (error) {
    console.error("Error fetching job seekers:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
});

// API to get a job seeker's match score with all companies
app.get("/jobseeker-match/:id", async (req, res) => {
  const data = await fetchData(); // Fetch data asynchronously
  if (!data) {
    return res.status(500).json({ error: "Failed to fetch data" });
  }
  const jobSeekerId = req.params.id;
  const jobSeeker = data.JobSeeker.find((seeker) => seeker.id === jobSeekerId);

  if (!jobSeeker) {
    return res.status(404).json({ error: "Job seeker not found" });
  }

  try {
    const companyMatches = await Promise.all(
      data.Company.map(async (company) => {
        const matchPercentage = await calculateMatchScore(
          jobSeeker,
          company.jobPosition
        );
        return {
          companyName: company.name,
          jobPost: company.jobPosition.title,
          matchPercentage: matchPercentage.toFixed(2),
        };
      })
    );
    res.json({
      jobSeeker: jobSeeker.headline,
      matches: companyMatches,
    });
  } catch (error) {
    console.error("Error fetching job seeker match:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Start the server (Vercel handles this dynamically)
app.listen(port, () => {
  console.log(
    `Server is running on ${
      process.env.VERCEL_URL || `http://localhost:${port}`
    }`
  );
});
