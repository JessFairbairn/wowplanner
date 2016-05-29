describe("Task tags",function(){
	beforeEach(module("wowApp"));

	var scope, createController;

	beforeEach(inject(function ($rootScope,$controller) { 
		scope = $rootScope.$new();

        createController = function() {
            return $controller('wowController', {
                '$scope': scope
            });
        };
    }));

	var WowTask;

	beforeEach(inject(function (_WowTask_) {
	    WowTask = _WowTask_;
  	}));

  	

	//tests
	describe("Collect tags",function(){
		beforeEach(inject(function(){
	  		var controller = createController();

			var task1 = new WowTask();

			task1.tags = ["a"];

			scope.tasks.push(task1);
		}));
		it("will add relevant tags to the tag map", function(){
			scope.collectTags();
			expect(scope.tagMap.a).toEqual(true);
		});
		it("will leave existing tags with their old values intact", function(){
			scope.collectTags();
			scope.tagMap.a = false;
			scope.tasks[0].tags.push("b");
			scope.collectTags();

			expect(scope.tagMap.a).toEqual(false);
		});
	});

	describe("Delete tag function",function(){
		beforeEach(inject(function(){
	  		var controller = createController();

			var task1 = new WowTask();//no tags
			var task2 = new WowTask();
			var task3 = new WowTask();
			var task4 = new WowTask();

			task2.tags = ["a"];
			task3.tags = ["a","b","c","toDelete"];
			task4.tags = ["a","toDelete","b"];

			scope.tasks.push(task1);
			scope.tasks.push(task2);
			scope.tasks.push(task3);
			scope.tasks.push(task4);
		}));
		it("will remove all instances of the tag being deleted", function(){	

			scope.deleteTag("toDelete");

			for (var i = scope.tasks.length - 1; i >= 0; i--) {
				var task = scope.tasks[i];
				expect(task.tags.indexOf("toDelete")).toEqual(-1);
			}
		});
	});

	describe("Adding tag",function(){
		it("won't allow you to add a blank tag via the method parameter", function(){	
			var task1 = new WowTask();
			task1.AddTag("");
			expect(task1.tags.length).toEqual(0);
		});

		it("won't allow you to add a blank tag via the 'new tag' property", function(){	
			var task1 = new WowTask();
			task1.newTag = "";
			task1.AddTag();
			expect(task1.tags.length).toEqual(0);
		});
	});


});