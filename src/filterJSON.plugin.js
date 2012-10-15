/*
 * jQuery Filter JSON Plugin
 * Copyright (c) 2012 Kapil Kashyap
 *
 * Depends:
 *   - jQuery 1.6+
 *
 * Dual licensed under the MIT and GPL licenses:
 *   - http://www.opensource.org/licenses/mit-license.php
 *   - http://www.gnu.org/licenses/gpl.html
 */
(function($) {
	$.extend($.fn, {
		filterJSON: function( json, _config ) {
			var config = {
					property: null,
					value: "",
					wrapper: false,
					checkContains: false,
					startsWith: false,
					matchCase: false,
					avoidDuplicates: false
				},
				filterJSONLoop = function(json, config) {
					var errorMsg = null;
					if($.isEmptyObject( config.property ) || !config.property[0]) {
						errorMsg = "config.property is required to filter the JSON object.";
					}
					if(!$.isEmptyObject(errorMsg)) {
						if(window.console) {
							console.error ? console.error( errorMsg ) : console.log( errorMsg );
						}
						else {
							alert( errorMsg );
						}
						return;
					}

					if(json && typeof json == "object") {
						// iterating through each property in the JSON Object
						$.each(json, function(key, j) {
							// checking to see if current 'key' is one of the properties
							// in the property array passed in the config.
							if($.inArray(key, config.property) != -1) {
								var constructReturnObject = function(wrapperValue, plainValue) {
										var _value = config.wrapper ? wrapperValue : plainValue;
										
										if(config.avoidDuplicates) {
											// avoiding duplicate objects in case of multiple property check.
											if($.inArray(_value, ret.filteredJSON) == -1) {
												ret.filteredJSON.push( _value );
											}
										}
										else {
											ret.filteredJSON.push( _value );
										}
									};

								if(config.value) {
									var internalConfig = {},
										type = Object.prototype.toString.call( j ),
										innerComparo = function(type, originalValue, valueToCompare) {
											if(type === "[object String]") {
												var originalValueLowerCase = originalValue.toLowerCase(),
												valueToCompareLowerCase = valueToCompare.toLowerCase();
												
												if(!config.matchCase) {
													if(originalValueLowerCase == valueToCompareLowerCase || 
														(!config.startsWith && config.checkContains && originalValueLowerCase.indexOf(valueToCompareLowerCase) != -1) ||
														(config.startsWith && originalValueLowerCase.indexOf(valueToCompareLowerCase) == 0)) {
														constructReturnObject(json, originalValue);
													}
												}
												else {
													if(originalValue == valueToCompare ||
														(!config.startsWith && config.checkContains && originalValue.indexOf(valueToCompare) != -1) ||
														(config.startsWith && originalValue.indexOf(valueToCompare) == 0)) {
														constructReturnObject(json, originalValue);
													}
												}
											}
											else if(type === "[object Number]") {
												if(originalValue === parseInt( valueToCompare ) || originalValue === parseFloat( valueToCompare )) {
													constructReturnObject(json, originalValue);
												}
											}
											else if(type === "[object Boolean]") {
												/*
													Note:
													Boolean(anyString other than blankString) is true
													Boolean(anyNumber, even negative number but other than 0) is true
													Boolean(true) is true abd Boolean(false) is false
												 */
												var booleanvalueToCompare = false;
												if(Object.prototype.toString.call( valueToCompare ) === "[object String]") {
													if(valueToCompare.toLowerCase() == "true") {
														booleanvalueToCompare = true;
													}
												}
												if(originalValue === booleanvalueToCompare) {
													constructReturnObject(json, originalValue);
												}
											}
											else if(type === "[object Array]") {
												if(originalValue.length > 0) {
													for(k in originalValue) {
														innerComparo(Object.prototype.toString.call( originalValue[k] ), originalValue[k], valueToCompare);
													}
												}
											}
											else if(type === "[object Object]") {
												$.extend(internalConfig, config, {value: valueToCompare});
												filterJSONLoop(originalValue, internalConfig);
											}
										};

									innerComparo(type, j, config.value);
								}
								else {
									constructReturnObject(json, j);
								}
							}
							filterJSONLoop(j, config);
						});
					}
					return ret;
				},
				ret = {filteredJSON: []},
				returnObject = null,
				filteredJSON = null,
				prop = null;

			// extend the default config with the ones passed in by the user.
			$.extend(config, _config);

			prop = config.property;
			// check to see if the property has been passed as a string.
			if(Object.prototype.toString.call( prop ) === "[object String]") {
				// remove extra spaces if any.
				prop = prop.replace(/\s/g, "");
				// convert the input property string into an array.
				// note: even if it is a single property, this will convert it into an array.
				config.property = prop.split(",");
			}
			prop = null;

			// Setting avoidDuplicates to true in case 
			// - config.wrapper is set to true and
			// - multiple properties in config.property and
			// - config.avoidDuplicates property is not set by the user.
			if(config.wrapper && (config.property && config.property.length > 1) 
					&& _config.avoidDuplicates == undefined) {
				config.avoidDuplicates = true;
			}
			returnObject = filterJSONLoop(json, config);

			if(returnObject && returnObject.filteredJSON) {
				filteredJSON = returnObject.filteredJSON.length > 0 ? returnObject.filteredJSON : returnObject.filteredJSON[0];
			}

			return $(filteredJSON);
		}
	});
})(jQuery);