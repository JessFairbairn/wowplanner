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