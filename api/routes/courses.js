const { searchSparql } = require("../services/graphdb");
const express = require("express");
const router = express.Router();

function buildSearchQuery(keyword, topics) {
  let query = `
  PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
  PREFIX lucene: <http://www.ontotext.com/connectors/lucene#>
  PREFIX luc-index: <http://www.ontotext.com/connectors/lucene/instance#>
  PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
  PREFIX ex: <http://example.org/elearning-onto#>
   SELECT DISTINCT ?resource ?title ?description ?difficultyLevel ?duration ?typeLabel ?score WHERE {
  
  # Block 1: Filter resources based on a full-text search first for performance.
  ?search a luc-index:elearnkit_search ;
          lucene:query "{{KEYWORD}}" ; # <-- User search query
          lucene:entities ?resource .
  ?resource lucene:score ?score .

  # Block 2: Further filter the search results by topic.
  # This pattern is now applied only to the smaller set of text-matched resources.
  VALUES ?topic {  <<TOPICS>> }
  ?concept ex:relatedTopic ?topic .
  ?resource ex:coversConcept ?concept .
  
  # Block 3: Get optional metadata for the filtered resources.
  OPTIONAL { ?resource ex:title ?title . }
  OPTIONAL { ?resource ex:description ?description . }
  
  # Block 4: Determine the type of the resource for a user-friendly label.
  # This now correctly operates on the generic '?resource' variable.
  {
    ?resource rdf:type ex:Course;
        ex:difficultyLevel ?difficultyLevel ;
        ex:creditHours ?duration .
    BIND("Course" AS ?typeLabel)
  } UNION {
    ?resource rdf:type ex:Module .
    BIND("Module" AS ?typeLabel)
  } UNION {
    ?resource rdf:type ex:Lesson .
    BIND("Lesson" AS ?typeLabel)
  } UNION {
    ?resource rdf:type ex:Document .
    BIND("Document" AS ?typeLabel)
  }
}
ORDER BY DESC(?score)

  `;

  query = query.replace("{{KEYWORD}}", keyword);
  console.log({topics})
  const topicsList = Array.isArray(topics)
    ? topics.map(t => `<${t}>`).join(" ")
    : topics ? `<${topics}>` : "";
  query = query.replace("<<TOPICS>>", topicsList);

  return query;
}

async function keywordsExtractor(query) {
  const res = await fetch(`http://localhost:5000/extract_keywords`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query }),
  });
  const data = await res.json();
  const keywords = data.keywords.join(" ");
  return keywords;
}

const searchCourses = async (req, res) => {
  const query = req.query.q;

  if (!query) {
    return res
      .status(400)
      .json({ error: "Missing search query parameter 'q'" });
  }

  const keywords = await keywordsExtractor(query);

  const sparqlQuery = buildSearchQuery(keywords ?? query, req.query.topics.split(","));
  console.log("Generated SPARQL Query:", sparqlQuery);
  console.log("Keywords extracted:", keywords);
  console.log("Original query:", query);
  // SELECT ?course ?title ?score ?description {
  //   ?search a luc-index:elearnkit_search ;
  //       lucene:query "${query}" ;
  //       lucene:entities ?course .
  //       ?course lucene:score ?score.

  //     ?course edu:title ?title; edu:description ?description.
  // } ORDER BY DESC(?score)
  const rawResults = await searchSparql(sparqlQuery);

  // Map each SPARQL binding to a plain JS object
  const results = rawResults.map((binding) => {
    console.log("Binding:", binding);
    // Base fields
    const uri = binding.resource.value;
    const title = binding.title?.value ?? null;
    const score = binding.score ? parseFloat(binding.score.value) : null;
    const type = binding.typeLabel?.value ?? null;

    // Optional fields
    const description = binding.description?.value ?? null;
    const difficultyLevel = binding.difficultyLevel?.value ?? null;
    const duration = binding.duration?.value ?? null;

    // If you want `course` instead of `uri` when type is Course:
    const course = type === "Course" ? uri : undefined;

    return {
      uri, // always present
      course, // only for courses
      type, // "Course" | "Module" | "Lesson"
      title,
      score,
      description,
      difficultyLevel,
      duration,
    };
  });

  return res.json(results);
};

const getTopics = async (req, res) => {
  const sparqlQuery = `
  PREFIX edu: <http://example.org/elearning-onto#>
  PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
  SELECT DISTINCT ?topic ?label
  WHERE {
    ?concept edu:relatedTopic ?topic .
    OPTIONAL { ?topic edu:topicName ?label . }
  }  
  `;

  const rawResults = await searchSparql(sparqlQuery);

  const topics = rawResults.map((binding) => {
    return {
      uri: binding.topic.value,
      label: binding.label?.value ?? null,
    };
  });

  return res.json(topics);
};

const getConcepts = async (req, res) => {
  const sparqlQuery = `
  PREFIX edu: <http://example.org/elearning-onto#>

  SELECT DISTINCT ?concept ?label (GROUP_CONCAT(DISTINCT ?topic; separator=", ") AS ?topics)
        (GROUP_CONCAT(DISTINCT ?topicLabel; separator=", ") AS ?topicLabels)
  WHERE {
    ?concept a edu:Concept .
    OPTIONAL { ?concept edu:preferredLabel ?label . }
    OPTIONAL {
      ?concept edu:relatedTopic ?topic .
      OPTIONAL { ?topic edu:topicName ?topicLabel . }
    }
  }
  GROUP BY ?concept ?label

  `;

  const rawResults = await searchSparql(sparqlQuery);

  const concepts = rawResults.map((binding) => {
    return {
      uri: binding.concept.value,
      label: binding.label?.value ?? null,
      topic: binding.topics.value,
      topicLabel: binding.topicLabels?.value ?? null,
    };
  });

  return res.json(concepts);
}

const getAllCourse = async (req, res)=>{
  const sparqlQuery = `
PREFIX edu: <http://example.org/elearning-onto#>

SELECT ?course ?title ?description ?difficultyLevel ?duration ?typeLabel
       (GROUP_CONCAT(DISTINCT ?conceptLabel; separator=", ") AS ?concepts)
       (GROUP_CONCAT(DISTINCT ?prereqLabel; separator=", ") AS ?prerequisites)
       (GROUP_CONCAT(DISTINCT ?requiredConceptLabel; separator=", ") AS ?requiredConcepts)

WHERE {
  ?course a edu:Course ;
          edu:title ?title ;
          edu:description ?description ;
          edu:difficultyLevel ?difficultyLevel ;
          # Note: I've renamed ?duration to ?creditHours to match the property
          edu:creditHours ?creditHours ; 
          edu:coversConcept ?concept .

  OPTIONAL {
    ?concept edu:preferredLabel ?conceptLabel .
  }

  OPTIONAL {
    ?course edu:hasPrerequisite ?prereq .
    ?prereq edu:title ?prereqLabel .
  }


  OPTIONAL {
    ?course edu:requiresConcept ?requiredConcept .
    ?requiredConcept edu:preferredLabel ?requiredConceptLabel .
  }

  BIND("Course" AS ?typeLabel)
}

GROUP BY ?course ?title ?description ?difficultyLevel ?creditHours ?typeLabel ?duration
  `;

  const rawResults = await searchSparql(sparqlQuery);

  const courses = rawResults.map((binding) => {
    return {
      uri: binding.course.value,
      title: binding.title?.value ?? null,
      description: binding.description?.value ?? null,
      difficultyLevel: binding.difficultyLevel?.value ?? null,
      duration: binding.duration?.value ?? null,
      concepts: binding.concepts?.value ? binding.concepts.value.split(", ") : [],
      prerequisites: binding.prerequisites?.value ? binding.prerequisites.value.split(", ") : [],
      typeLabel: binding.typeLabel?.value ?? "Course",
      requiredConcepts: binding.requiredConcepts?.value ? binding.requiredConcepts.value.split(", ") : [],
    };
  });

  return res.json(courses);
}

router.get("/search", searchCourses);
router.get("/topics", getTopics);
router.get("/concepts", getConcepts);
router.get("/all", getAllCourse);
module.exports = router;
