# Introduction

This resource connects big with the gremlin-node project located here <https://github.com/entrendipity/gremlin-node>.


## Installation

Installing is easy, just npm install from your project. Note the dependencies from gremlin-node for node-java and additionally maven.

Maven is not technically required and is used only as a package manager. If you have access to the jars required for your database you don't need maven.


## gremlin-node setup

Once installed browse to gremlin-node/lib/dependencies - this is where all the default jars are located. If you need to change the version of any jar **make sure you delete all other versions of the jar** to prevent unexpected behaviour.

## Example for OrientDB

### Jars you'll need
These instructions are for configuring gremlin-node for orientDB version 1.4.1. You'll need the following jars:

1. blueprints-core-2.4.0-SNAPSHOT
2. blueprints-orient-graph-2.4.0-SNAPSHOT
3. gremlin-groovy-2.4.0-SNAPSHOT
4. gremlin-java-2.4.0-SNAPSHOT
5. groovy-1.8.9
6. pipes-2.4.0-SNAPSHOT
7. orientdb-client-1.4.1
8. orientdb-core-1.4.1
10. orientdb-nativeos-1.4.1
11. orient-commons-1.4.1
12. orientdb-enterprise-1.4.1

Additionally, classes from the following jar are used for json-ing data:

1. blueprints-rexster-graph-2.3.0

### example package.json

First off, package.json dependencies:

	 "dependencies": {
    	"resource-gremlin": "0.1.x",
    	"resource": "0.4.x"
  	}


### example app

	var resource = require('resource');
	resource.use('gremlin');
	
	// Configure connection
	options = {
		javacom: "com.tinkerpop.blueprints.impls.orient.OrientGraph",
		database: "remote:localhost:2424/test",
		username: "admin",
		password: "admin"
	}


	// Connect to database
	resource.gremlin.start(options);


	// Add vertexes
	var mole = resource.gremlin.graphDB.addVertexSync(null);
	mole.setPropertySync( "name", "Mole" );

	var cule = resource.gremlin.graphDB.addVertexSync(null);
	cule.setPropertySync( "name", "Cule" );

	// Connect with an edge
	var molecule = 	resource.gremlin.graphDB.addEdgeSync(null, mole, cule, "completes");

	// get vertexes from resource
	console.log(resource.gremlin.g.V('@class', 'OGraphVertex').range(0,1).toJSON());

	// commit changes and close down db
	resource.gremlin.commit();
	resource.gremlin.disconnect();


Which should produce:

	[ 
		{ name: 'Mole', _id: '#11:-2', _type: 'vertex' },
  		{ name: 'Cule', _id: '#11:-3', _type: 'vertex' } 
  	]
  	
  




