<div align="center">
  <img src="https://elearn-kit.vercel.app/assets/swiss-knife-learning-3d-BWIAOXPT.png" width="300px" alt="Swiss Knife Learning">
  <h3>Smart, personalized learning powered by semantic technology.</h3>
  <p>AI-driven course recommendations, concept based search, and prerequisite aware guidance for a truly adaptive learning experience.</p>
</div>

A smart, knowledge-aware web application that enables users to explore and interact with e-learning content using semantic technologies. The platform integrates an ontology-based knowledge graph, full-text semantic search, recommendation features, and prerequisite verification logic.


> [!WARNING]  
> This project is an assignment for my Master's degree program, isn't ready for production use.


## 🚀 Features

### 1. 🔍 Semantic Search Engine for E-Learning

Search across courses, modules, and lessons using natural language and semantic filters (e.g. by topics, difficulty levels).

### 2. ✅ Prerequisite Knowledge Verification System

Verify whether a learner has the required background knowledge (concepts/courses) to enroll in a new course.


## 🛌 Tech Stack

* **Frontend**: [React](https://react.dev/) + [TailwindCSS](https://tailwindcss.com/)
* **Backend**: [Node.js](https://nodejs.org/en) + [ExpreeJS](https://expressjs.com/)
* **Knowledge Graph**: [GraphDB](https://graphdb.ontotext.com/) (RDF Triplestore)
* **Query Language**: SPARQL + [Lucene Full-Text Searc](https://lucene.apache.org/core/)h
* **Ontology Editor**: [Protégé](https://protege.stanford.edu/)



## ⚖️ Ontology Overview
You can view the full ontology structure through this [link](https://service.tib.eu/webvowl/#iri=https://gist.githubusercontent.com/ID-JA/2784b5ade02a47a171b4eddc08054fc9/raw/b244f6235491594ecefa80b52f16c09ba6abd9c0/ontology.ttl)
* **Entities**:

| Class               | Description                                                                 |
|---------------------|-----------------------------------------------------------------------------|
| `Concept`           | Represents a specific knowledge unit or skill (e.g., Regression, Algorithms). |
| `EducationalEntity` | A general superclass for all educational components (Course, Lesson, etc.). |
| `Assessment`        | A quiz, test, or exam that evaluates learner understanding.                 |
| `Course`            | A full educational offering made up of modules and covering key concepts.   |
| `Lesson`            | The smallest learning unit; typically part of a module and teaches a concept.|
| `Module`            | A structured grouping of lessons within a course, focusing on a sub-topic.  |
| `Resource`          | Any digital material (video, document, slide) that supports learning.        |
| `Document`          | A subtype of `Resource`, usually a PDF or text-based educational material.   |
| `ExternalLink`      | A type of `Resource` pointing to an external online page or tool.            |
| `SlideDeck`         | A presentation-based resource, such as a PowerPoint or PDF slides.           |
| `Video`             | A multimedia learning resource, typically a lecture or tutorial.             |
| `Topic`             | A broader thematic category like “Mathematics”, “Programming”, or “ML”.      |


* **Key Properties**:
  
| Data Property        | Description                                                                |
|----------------------|----------------------------------------------------------------------------|
| `altLabel`           | An alternative label or synonym for a concept or topic.                    |
| `assessmentID`       | A unique identifier assigned to an assessment.                             |
| `conceptDefinition`  | A formal or textual definition of a concept.                               |
| `conceptID`          | A unique identifier for a concept.                                         |
| `courseID`           | A unique identifier for a course.                                          |
| `creditHours`        | The number of academic credit hours assigned to a course.                  |
| `description`        | A textual description of an entity (course, lesson, module, etc.).         |
| `duration`           | The length of a lesson or resource (typically in ISO 8601 duration format).|
| `format`             | The media format of a resource (e.g., `video/mp4`, `application/pdf`).     |
| `lessonID`           | A unique identifier for a lesson.                                          |
| `moduleID`           | A unique identifier for a module.                                          |
| `preferredLabel`     | The preferred human-readable label for a concept.                          |
| `resourceID`         | A unique identifier for a resource.                                        |
| `title`              | The title or name of a course, module, lesson, or resource.                |
| `topicID`            | A unique identifier for a topic.                                           |
| `topicName`          | The human-readable name of a topic (e.g., “Programming”).                  |
| `url`                | The URL where a digital resource (video, document, etc.) is located.       |


| Object Property             | Description                                                                                |
|----------------------|--------------------------------------------------------------------------------------------|
| `hasAssessment`      | Links a lesson or module to an assessment (quiz, test) that evaluates understanding.       |
| `assessmentFor`      | Indicates which concept, lesson, or module the assessment is meant to evaluate.            |
| `coversConcept`      | Shows that a course, lesson, or module teaches a specific concept.                         |
| `hasLesson`          | Connects a module to the lessons it contains.                                              |
| `hasModule`          | Connects a course to its modules.                                                          |
| `hasPrerequisite`    | Indicates that a course or module requires another course/module to be completed first.    |
| `hasResource`        | Associates a lesson or module with learning resources like videos, PDFs, or slides.        |
| `isLessonOf`         | Inverse of `hasLesson`; shows that a lesson belongs to a specific module.                  |
| `isModuleOf`         | Inverse of `hasModule`; shows that a module is part of a course.                           |
| `isPrerequisiteFor`  | Inverse of `hasPrerequisite`; shows that a course is required before another can be taken. |
| `knowledgeSource`    | Indicates that a concept is learned through a specific course or resource.                 |
| `relatedTopic`       | Links a concept to a broader topic category (e.g., Programming, Math, ML).                 |
| `requiresConcept`    | Indicates that a course requires knowledge of certain concepts as prerequisites.           |
| `resourceFor`        | Inverse of `hasResource`; points back from a resource to the lesson/module it supports.    |


## 📁 Project Structure

```
project-root/
|-- web/        # React app (semantic search UI)
|-- api/         # NestJS API (SPARQL endpoints, logic)
|-- ontology/        # Turtle (.ttl) files + imports
|-- scripts/         # SPARQL queries
|-- README.md
```



## 🚧 Setup Instructions

### 1. Clone the repo

```bash
git clone https://github.com/ID-JA/elearn-kit.git
cd elearn-kit
```

### 2. Install Dependencies

> **Before installing dependencies, ensure Node.js is installed on your machine.**
> You can verify it by running the following command in your terminal:
>
> ```bash
> node -v
> ```
>
> If Node.js is not installed, download it from [https://nodejs.org](https://nodejs.org).

#### Backend

```bash
cd api
npm install
```

#### Frontend

```bash
cd ../web
npm install
```

### 3. Start GraphDB Locally

- Download and run [GraphDB Free](https://www.ontotext.com/products/graphdb/)
- run GraphDB Desktop App than click on **"Open Graph Workbench"**
- Create a new repository : Go to `Setup > Repositories > Create new repository` 
  
  ![image](https://github.com/user-attachments/assets/360f7c88-d217-45c9-870e-442fd65f31ca)

- Load the ontology TTL file into the repo : `Import > Upload RFD files` 

  ![image](https://github.com/user-attachments/assets/03838983-1faa-4836-ac3b-266df14c3c87)

- The ontology is already populated with example data, including courses, concepts, topics, lessons, and resources.

- To reload or customize the data:
  - Use the provided Turtle (.ttl) file in the `ontology/` folder, or
  - Run the SPARQL insert script located in the `scripts/populate/` directory of the repository.

  These scripts handle bulk insertion of courses, concepts, their relationships, and full metadata.

### 4. Configure Reasoning
Once the ontology and data are loaded, the next step is to enable GraphDB's reasoning capabilities. This process uses the ontology's structure and custom rules to infer new, implicit relationships from the explicit data.

#### 4.1 Add Custom Inference Rules
We will add the rulesets using a single SPARQL UPDATE query.
  - Navigate to SPARQL in the GraphDB Workbench.
  - Copy the entire query below, paste it into the query editor, ensure the Update option is selected, and run it.
   
#### 4.2 Apply Rules to Existing Data
The rules you just added will only apply to new data by default. To apply them to the data you already loaded, **you must trigger a manual re-inference process**. This will delete all existing inferred statements and regenerate them from scratch using the current set of rules.
  - set our custom rule sets as default:
  ```sparql
PREFIX sys: <http://www.ontotext.com/owlim/system#>
INSERT DATA {
    _:b sys:defaultRuleset "custom"
}
```
- apply the rules on the exsting data:
```sparql
PREFIX sys: <http://www.ontotext.com/owlim/system#>

INSERT DATA {
  [] sys:reinfer []
}
```

### 5. Configure Lucene Connector

* Go to `Plugins > Add Connector > Lucene` in GraphDB and start creating the Lucene configuration
  
* or use SPARQL this script `scripts/create-lucane-connector.sparql` to automatically create the Lucene Connector


### 5. Start Development

```bash
# Backend
cd api
npm run dev

# Frontend
cd ../web
npm run dev
```


## 🔹 Example SPARQL Query

### Full-Text + Semantic Filter

```sparql
  PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
  PREFIX lucene: <http://www.ontotext.com/connectors/lucene#>
  PREFIX luc-index: <http://www.ontotext.com/connectors/lucene/instance#>
  PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
  PREFIX ex: <http://example.org/elearning-onto#>
   SELECT DISTINCT ?resource ?title ?description ?difficultyLevel ?duration ?typeLabel ?score WHERE {
  
  ?search a luc-index:elearnkit_search ;
          lucene:query "Machine Learning" ;
          lucene:entities ?resource .
  ?resource lucene:score ?score .

  VALUES ?topic {  ex:Topic_ML }
  ?concept ex:relatedTopic ?topic .
  ?resource ex:coversConcept ?concept .
  
  OPTIONAL { ?resource ex:title ?title . }
  OPTIONAL { ?resource ex:description ?description . }
  
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
```


## ✨ How the Prerequisite Verification Works
This feature is designed to provide students with immediate, personalized feedback on their readiness for a course.

The workflow can be broken down into four main stages:

1. **Data Retrieval:** Fetching all required knowledge for a target course from GraphDB.
2. **User Interaction:** Presenting this information to the user and capturing their input.
3. **Confidence Calculation:** Processing the user's input to compute a readiness score and identify knowledge gaps.
4. **Result Display:** Showing the user a summary of their readiness with clear, actionable next steps.


## 👨‍💼 Contributors

<table>
  <tbody>
    <tr>
      <td align="center"><a href="https://jamalidaissa.vercel.app"><img src="https://avatars.githubusercontent.com/u/69154853?v=4" width="100px;" alt="Jamal Id Aissa"/><br /><sub><b>Jamal Id Aissa</b></sub></a><br /></td>
    </tr>
  </tbody>
</table>
