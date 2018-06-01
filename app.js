const request = require("request");
const express = require('express');
const bodyParser = require('body-parser');
const { graphqlExpress, graphiqlExpress } = require('apollo-server-express');
const { makeExecutableSchema } = require('graphql-tools');

var livres;

    request({
        url: "http://localhost/GraphQL/GraphqlTp3/api.php/livres/",
        json: true
    }, function(err, res, data) {
        if(err) {
            console.error(err);
        }
        livres = data;
        console.log(livres);
    });    


var auteurs;

    request({
        url: "http://localhost/GraphQL/GraphqlTp3/api.php/auteurs/",
        json: true
    }, function(err, res, data) {
        if(err) {
            console.error(err);
        }
        auteurs = data;
        console.log(livres);
    });    


// The GraphQL schema in string form
const typeDefs = `
  type Query { livres:[Livre], auteurs:[Auteur] }
  type Livre { id: String, titre: String, date_parution: String, genre: String, prix: String, id_auteur: String }
  type Auteur { id: String, nom: String, prenom: String, datenaiss: String }
`;

// The resolvers
const resolvers = {
  Query: { livres: () => livres, auteurs: () => auteurs },
};

// Put together a schema
const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
});

// Initialize the app
const app = express();

// The GraphQL endpoint
app.use('/graphql', bodyParser.json(), graphqlExpress({ schema }));

// GraphiQL, a visual editor for queries
app.use('/graphiql', graphiqlExpress({ endpointURL: '/graphql' }));

// Start the server
app.listen(3000, () => {
  console.log('Go to http://localhost:3000/graphiql to run queries!');
});