function deleteTaskExternal(event){
	var scope = angular.element(event.fromElement).scope();
	var task = scope.task;
	console.log(task);
	scope.$parent.deleteTask(task);
	scope.$apply();
}