function getAngularScope(){
	return angular.element(document.querySelector("[ng-app]")).scope();
}

function deleteTaskExternal(event){
	var scope = angular.element(event.fromElement).scope();
	var task = scope.task;
	console.log(task);
	scope.$parent.deleteTask(task);
	scope.$apply();
}

function showOnlyThisTagExternal(event){
	var scope = angular.element(event.fromElement).scope();
	var tagKey = scope.key;
	var tagMap = scope.$parent.tagMap;
	
	var tagNames = Object.getOwnPropertyNames(tagMap);
	for (var i = tagNames.length - 1; i >= 0; i--) {
		if(tagNames[i] === tagKey){
			tagMap[tagNames[i]] = true;
		} else {
			tagMap[tagNames[i]] = false;
		}
	}

	scope.$apply();
}

function deleteThisTagExternal(event){
	var scope = angular.element(event.fromElement).scope();
	var tagKey = scope.key;
	
	console.debug("Deleting tag: " + tagKey);
	scope.$parent.deleteTag(tagKey);
	
	// var tagNames = Object.getOwnPropertyNames(tagMap);
	// for (var i = tagNames.length - 1; i >= 0; i--) {
	// 	if(tagNames[i] === tagKey){
	// 		tagMap[tagNames[i]] = true;
	// 	} else {
	// 		tagMap[tagNames[i]] = false;
	// 	}
	// }

	scope.$apply();
}

if ('serviceWorker' in navigator) {
	navigator.serviceWorker.register('serviceworker.js');
	// .then(function(registration) {
	// 	// Registration was successful
	// });
}

function toggleDebugging(){
	var scope = getAngularScope();
	scope.debugMode = !scope.debugMode;
	scope.$apply();
}

console.debug("Run toggleDebugging() to toggle debugging mode.");