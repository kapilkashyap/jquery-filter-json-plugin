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
			var typeMap = {
					"STRING": "[object String]",
					"NUMBER": "[object Number]",
					"BOOLEAN": "[object Boolean]",
					"ARRAY": "[object Array]",
					"OBJECT": "[object Object]",
					"FUNCTION": "[object Function]"
				},
				getObjectType = function(o) {
					return Object.prototype.toString.call( o );
				},
				config = {
					property: null, // property used to filter the objects, required.
					value: "", // optional, provide this if we want to search for a particular value
					wrapper: false, // returning the parent object is turned off by default
					checkContains: false, // is required only when we are matching against a value, will match value with in the string
					startsWith: false, // is required only when we are matching against a value, will match value at the beginning of the string
					matchCase: false, // case insensitive matching is on by default
					avoidDuplicates: false, // avoid duplicates is off by default
					sort: false, // sorting is off by default
					sortOrder: "asc", // "desc" is the other value
					sortProperty: null, // optional, if this isn't provided then the property provided in the config would be used.
					comparator: function(a, b) { // optional, default comparator function for sorting
						var order = (config.sortOrder !== "asc") ? -1 : 1,
							p = config.sortProperty || config.property[0] || config.property,
							a = a[p] || a,
							b = b[p] || b;
						
						if(a < b) {
							return -1 * order;
						}
						if(a > b) {
							return 1 * order;
						}
						return 0;
					}
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
							// checking to see if current "key" is one of the properties
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
									var valueArray = $.isArray(config.value) ? config.value : [config.value],
										internalConfig = {},
										type = getObjectType( j ),
										innerComparo = function(type, originalValue, valueToCompare) {
											if(type === typeMap.STRING) {
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
											else if(type === typeMap.NUMBER) {
												if(originalValue === parseInt( valueToCompare ) || originalValue === parseFloat( valueToCompare )) {
													constructReturnObject(json, originalValue);
												}
											}
											else if(type === typeMap.BOOLEAN) {
												/*
													Note:
													Boolean(anyString other than blankString) is true
													Boolean(anyNumber, even negative number but other than 0) is true
													Boolean(true) is true abd Boolean(false) is false
												 */
												var booleanvalueToCompare = false;
												if(getObjectType( valueToCompare ) === typeMap.STRING) {
													if(valueToCompare.toLowerCase() == "true") {
														booleanvalueToCompare = true;
													}
												}
												if(originalValue === booleanvalueToCompare) {
													constructReturnObject(json, originalValue);
												}
											}
											else if(type === typeMap.ARRAY) {
												if(originalValue.length > 0) {
													for(k in originalValue) {
														innerComparo(getObjectType( originalValue[k] ), originalValue[k], valueToCompare);
													}
												}
											}
											else if(type === typeMap.OBJECT) {
												$.extend(internalConfig, config, {value: valueToCompare});
												filterJSONLoop(originalValue, internalConfig);
											}
										};

									// forEach iterates over enumerable properties
									if(valueArray.forEach) {
										valueArray.forEach(function(element, index, array) {
											innerComparo(type, j, element);
										});
									}
									else {
										// fall-back for IE8
										for(k in valueArray) {
											if(valueArray.hasOwnProperty(k)) {
												innerComparo(type, j, valueArray[k]);
											}
										}
									}
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
				prop = null,
				sorted = false;

			// extend the default config with the ones passed in by the user.
			$.extend(config, _config);

			prop = config.property;
			// check to see if the property has been passed as a string.
			if(getObjectType( prop ) === typeMap.STRING) {
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

			if(config.sort && getObjectType( filteredJSON ) === typeMap.ARRAY) {
				if(config.comparator && getObjectType( config.comparator ) === typeMap.FUNCTION) {
					if(getObjectType( filteredJSON[0] ) === typeMap.OBJECT) {
						filteredJSON.sort(config.comparator);
						sorted = true;
					}
				}
				!sorted && filteredJSON.sort(config.comparator);
			}
			return $(filteredJSON);
		}
	});
})(jQuery);