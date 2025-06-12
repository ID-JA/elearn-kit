const { searchSparql } = require("../services/graphdb");
const express = require("express");
const router = express.Router();

function buildSearchQuery(keyword, topic) {
  let query = `
    PREFIX lucene: <http://www.ontotext.com/connectors/lucene#>
    PREFIX luc-index: <http://www.ontotext.com/connectors/lucene/instance#>
    PREFIX edu: <http://example.org/elearning-onto#>
    PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>

    SELECT ?entity ?title ?score ?typeLabel ?difficultyLevel ?duration ?description WHERE {
      # Full-text search
      ?search a luc-index:elearnkit_search ;
              lucene:query "{{KEYWORD}}" ;      # to be replaced with user input
              lucene:entities ?entity .
      ?entity lucene:score ?score .

      OPTIONAL { ?entity edu:title ?title . }
      OPTIONAL { ?entity edu:description ?description . }

      # Get type label and additional info
      {
        ?entity rdf:type edu:Course ;
                edu:difficultyLevel ?difficultyLevel ;
                edu:creditHours ?duration .
        BIND("Course" AS ?typeLabel)
      } UNION {
        ?entity rdf:type edu:Module .
        BIND("Module" AS ?typeLabel)
      } UNION {
        ?entity rdf:type edu:Lesson .
        BIND("Lesson" AS ?typeLabel)
      }

      # Optional Topic Filter
      OPTIONAL {
        ?entity edu:coversConcept ?concept .
        ?concept edu:relatedTopic <{{TOPIC}}> .  # only apply if user selected a topic
      }
    }
    ORDER BY DESC(?score)  
  `; // paste template

  query = query.replace('{{KEYWORD}}', keyword);

  if (topic) {
    query = query.replace('<{{TOPIC}}>', `<${topic}>`);
  } else {
    // Remove OPTIONAL block if no topic selected
    query = query.replace(/OPTIONAL\s*{[^}]*<\{\{TOPIC\}\}>[^}]*}/, '');
  }

  return query;
}

const searchCourses = async (req, res) => {
  const query = req.query.q;

  const sparqlQuery =  buildSearchQuery(query, req.query.topic);

  console.log("Generated SPARQL Query:", sparqlQuery);
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
    // Base fields
    const uri = binding.entity.value;
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

const getTopics = async (req, res)=>{
  const sparqlQuery = `
  PREFIX edu: <http://example.org/elearning-onto#>
  PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
  SELECT DISTINCT ?topic ?label
  WHERE {
    ?concept edu:relatedTopic ?topic .
    OPTIONAL { ?topic edu:topicName ?label . }
  }  
  `

  const rawResults = await searchSparql(sparqlQuery);

  const topics = rawResults.map((binding) => {
    return {
      uri: binding.topic.value,
      label: binding.label?.value ?? null,
    };
  });

  return res.json(topics);
}

router.get("/search", searchCourses);
router.get("/topics", getTopics);

module.exports = router;
