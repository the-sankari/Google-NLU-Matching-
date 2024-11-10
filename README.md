# googleNlu
Job matchin ananlysis with Google NLU

## Resquse for companies: http://localhost:8080/recruiter-match
response

```json
[
  {
    "jobSeeker": "Experienced Full Stack Developer",
    "jobSeekerId": "JS12345",
    "matches": [
      {
        "companyName": "CompanyName",
        "jobPost": "Software Development Technical Lead",
        "matchPercentage": "100.00"
      },
      {
        "companyName": "TechInnovators",
        "jobPost": "Data Scientist",
        "matchPercentage": "27.27"
      },
      {
        "companyName": "HealthTech Corp",
        "jobPost": "Healthcare Product Manager",
        "matchPercentage": "63.64"
      },
      {
        "companyName": "GreenTech Solutions",
        "jobPost": "Environmental Engineer",
        "matchPercentage": "27.27"
      },
      {
        "companyName": "FinServe Ltd.",
        "jobPost": "Financial Analyst",
        "matchPercentage": "27.27"
      }
    ]
  },
  {
    "jobSeeker": "Senior Software Engineer",
    "jobSeekerId": "JS67890",
    "matches": [
      {
        "companyName": "CompanyName",
        "jobPost": "Software Development Technical Lead",
        "matchPercentage": "66.67"
      },
      {
        "companyName": "TechInnovators",
        "jobPost": "Data Scientist",
        "matchPercentage": "27.27"
      },
      {
        "companyName": "HealthTech Corp",
        "jobPost": "Healthcare Product Manager",
        "matchPercentage": "33.33"
      },
      {
        "companyName": "GreenTech Solutions",
        "jobPost": "Environmental Engineer",
        "matchPercentage": "33.33"
      },
      {
        "companyName": "FinServe Ltd.",
        "jobPost": "Financial Analyst",
        "matchPercentage": "33.33"
      }
    ]
  },
  {
    "jobSeeker": "Junior Data Scientist",
    "jobSeekerId": "JS22345",
    "matches": [
      {
        "companyName": "CompanyName",
        "jobPost": "Software Development Technical Lead",
        "matchPercentage": "33.33"
      },
      {
        "companyName": "TechInnovators",
        "jobPost": "Data Scientist",
        "matchPercentage": "63.64"
      },
      {
        "companyName": "HealthTech Corp",
        "jobPost": "Healthcare Product Manager",
        "matchPercentage": "33.33"
      },
      {
        "companyName": "GreenTech Solutions",
        "jobPost": "Environmental Engineer",
        "matchPercentage": "33.33"
      },
      {
        "companyName": "FinServe Ltd.",
        "jobPost": "Financial Analyst",
        "matchPercentage": "33.33"
      }
    ]
  },
  {
    "jobSeeker": "Project Manager",
    "jobSeekerId": "JS33456",
    "matches": [
      {
        "companyName": "CompanyName",
        "jobPost": "Software Development Technical Lead",
        "matchPercentage": "41.67"
      },
      {
        "companyName": "TechInnovators",
        "jobPost": "Data Scientist",
        "matchPercentage": "0.00"
      },
      {
        "companyName": "HealthTech Corp",
        "jobPost": "Healthcare Product Manager",
        "matchPercentage": "66.67"
      },
      {
        "companyName": "GreenTech Solutions",
        "jobPost": "Environmental Engineer",
        "matchPercentage": "8.33"
      },
      {
        "companyName": "FinServe Ltd.",
        "jobPost": "Financial Analyst",
        "matchPercentage": "33.33"
      }
    ]
  },
  {
    "jobSeeker": "Marketing Specialist",
    "jobSeekerId": "JS44567",
    "matches": [
      {
        "companyName": "CompanyName",
        "jobPost": "Software Development Technical Lead",
        "matchPercentage": "33.33"
      },
      {
        "companyName": "TechInnovators",
        "jobPost": "Data Scientist",
        "matchPercentage": "63.64"
      },
      {
        "companyName": "HealthTech Corp",
        "jobPost": "Healthcare Product Manager",
        "matchPercentage": "33.33"
      },
      {
        "companyName": "GreenTech Solutions",
        "jobPost": "Environmental Engineer",
        "matchPercentage": "66.67"
      },
      {
        "companyName": "FinServe Ltd.",
        "jobPost": "Financial Analyst",
        "matchPercentage": "66.67"
      }
    ]
  }
]
```

## Request from the jobseeker with id
http://localhost:8080/jobseeker-match/JS22345

### Response

```json
{
  "jobSeeker": "Junior Data Scientist",
  "matches": [
    {
      "companyName": "CompanyName",
      "jobPost": "Software Development Technical Lead",
      "matchPercentage": "33.33"
    },
    {
      "companyName": "TechInnovators",
      "jobPost": "Data Scientist",
      "matchPercentage": "63.64"
    },
    {
      "companyName": "HealthTech Corp",
      "jobPost": "Healthcare Product Manager",
      "matchPercentage": "33.33"
    },
    {
      "companyName": "GreenTech Solutions",
      "jobPost": "Environmental Engineer",
      "matchPercentage": "33.33"
    },
    {
      "companyName": "FinServe Ltd.",
      "jobPost": "Financial Analyst",
      "matchPercentage": "33.33"
    }
  ]
}
```
### Local development

- clone 
- npm install
- npm start
- open browser and navigate to http://localhost:8080/jobseeker-match/JS22345
- you can also use postman to test the API
- you can also use curl to test the API

