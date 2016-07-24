# raml2mocha

Automated mocha.js test generation for RAML API specs.

## Examples
By default the `parse` method will check all secured endpoints for 401s when no authentication has been provided. The `test` directory includes a working example with an express server.

	var raml2mocha = require('raml2mocha');

	raml2mocha.parse({
		'path' : 'api.raml'
	});
	
## Testing

	npm test