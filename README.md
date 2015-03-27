# jQuery Filter JSON

This jQuery plugin is a utility that allows you to filter a JSON based on properties. You can also have a property/value match and only those
property values that match the passed in value will be returned.

However, you can filter the JSON based on various parameters such as startWith or checkContains, matchCase and can either choose to return the 
matched values or the parent object of the matched values. You even have the option of avoiding duplicates if any.

Below is a basic usage:
````javascript
$.fn.filterJSON({ json object }, {
                        property: ["prop1", "prop2", ... n],
                        wrapper: true,
                        value: "user one",
	                    checkContains: false,
	                    startsWith: true,
	                    matchCase: false,
	                    avoidDuplicates: true,
	                    sort: true,
	                    sortOrder: "desc"
                    });
````
### Plugin Properties Explained
Before digging into each property of the plugin lets describe our sample JSON.
````javascript
{
    {
        "id": 12345,
        "name": "User One",
        "email": "user.one@email.com"
    },{
        "id": 23456,
        "name": "User Two",
        "email": "user.two@email.com"
    },{
        "id": 34567,
        "name": "User Three",
        "email": "user.three@email.com"
    }
    .
    .
    .
}
````

* property (mandatory, default is null): This options takes an array of the property or properties that you need to filter the JSON with. For the above sample JSON we can have three properties
id, name and email. So you can have this value set as ["name"] or ["name", "email"]

* wrapper (optional, default is false): If set to true, it will return an array of the parent object of the matched property else will return an array of value itself.
For instance if we are filtering the above sample JSON with 'name' property and wrapper is set to true, then an array of all the Objects which 
have the 'name'property will be returned.
If the wrapper is set to false, then an array of only the values of the property will be returned. For the above sample JSON
["User One", "User Two", "User Three"] would be returned.

* value (optional): An optional value passed in as a string (for a single value match) or as an array to check the matched property value against multiple values.

* checkContains (optional, default is false): Setting this option to true will check if the matched property's value contains the passed in value. However, passing a value becomes mandatory for this to work.
This option will be considered only if it is true and startsWith is not set to true.

* startsWith (optional, default is false): Setting this option to true will check if the matched property's value starts with the passed in value. However, passing a value becomes mandatory for this to work.
This options takes precedence over checkContains if it is set to true.

* matchCase (optional, default is false): If set to true will perform case-sensitive search of values.

* avoidDuplicates (optional, default is false): If set to true will avoid duplicate objects.

* sort (optional, default is false): If set to true will return sorted values.

* sortOrder (optional, default is 'asc'): If sorting is set to true then the default sort order is ascending described by 'asc' value. If you want your sort order to be descending change this value to 'desc' or
for the matter of fact anything else other than 'asc'.

* sortProperty (optional, default is null): The key to be used to sort the objects if sorting is set to true. If not provided then the required property 'property' would be used. In case multiple properties are
given, the first one will be used.

* comparator (optional, default is compare function): A comparator function used for sorting. This is completely optional but can be provided by the user.

### Known Issues

For this plugin to work in IE7 and below, you will have to include JSON2.

You can use: http://ajax.cdnjs.com/ajax/libs/json2/20110223/json2.js

### Licence

Copyright (c) 2012 Kapil Kashyap.
Dual licensed under MIT License and GPL License.