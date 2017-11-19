var config = {
    expressPort: 3000,
    client: {
	mongodb: {
	    defaultDatabase: "BluA",
	    defaultCollection: "simples",
	    defaultUri: "mongodb://localhost:27017"
	},
    }
};

module.exports = config;
