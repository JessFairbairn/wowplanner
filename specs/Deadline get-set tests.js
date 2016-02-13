describe("WowTask deadline property",function(){
	beforeEach(module("wowApp"));

	var WowTask;

	beforeEach(inject(function (_WowTask_) {
	    WowTask = _WowTask_;
	  }));

	//tests
	it("will throw exception if you try to set it as a stupid string", function(){		
		var task = new WowTask();

		expect(function(){
			task.deadline = "lol";
		}).toThrow();
	});

	it("will throw exception if you try to set it to an object", function(){		
		var task = new WowTask();

		expect(function(){
			task.deadline = {lemon:"gothic"};
		}).toThrow();
	});

	it("will correctly parse English dates", function(){		
		var task = new WowTask();
		task.deadline = "13/2/1991";

		expect(task.deadline).toEqual(new Date(1991,1,13));
	});

	it("will stay null if you set it as such", function(){		
		var task = new WowTask();
		task.deadline = null;

		expect(task.deadline).toBe(null);
	});

	it("will store Date objects", function(){		
		var task = new WowTask();
		task.deadline = new Date(1991,1,13);

		expect(task.deadline).toEqual(new Date(1991,1,13));
	});


});