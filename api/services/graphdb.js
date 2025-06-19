const { RepositoryClientConfig, RDFRepositoryClient } =
  require("graphdb").repository;
const { RDFMimeType } = require("graphdb").http;
const { SparqlXmlResultParser } = require("graphdb").parser;
const { GetQueryPayload, QueryType } = require("graphdb").query;

const endpoint = "http://localhost:7200";
const readTimeout = 30000;
const writeTimeout = 30000;
const config = new RepositoryClientConfig(endpoint)
  .setEndpoints(["http://localhost:7200/repositories/dama"])
  .setHeaders({
    Accept: RDFMimeType.TURTLE,
  })
  .setReadTimeout(readTimeout)
  .setWriteTimeout(writeTimeout);
const repository = new RDFRepositoryClient(config);

repository.registerParser(new SparqlXmlResultParser());

const searchSparql = async (sparqlQuery) => {
  
  const payload = new GetQueryPayload()
    .setQuery(sparqlQuery)
    .setQueryType(QueryType.SELECT)
    .setResponseType(RDFMimeType.SPARQL_RESULTS_XML)
    .setLimit(100);

  const results = [];
  const stream = await repository.query(payload);

  return new Promise((resolve) => {
      stream.on('data', (bindings) => {
        results.push(bindings);
      });
      stream.on('end', () => resolve(results));
    });
};

module.exports = {
  searchSparql,
};
