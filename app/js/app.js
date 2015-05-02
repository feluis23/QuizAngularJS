var app = angular.module('myApp',['ngRoute','ngResource']);

//configuración de rutas
app.config(function($routeProvider) {
	$routeProvider
	.when('/', {
		controller: 'loadController',
		templateUrl: 'templates/inicio.html'
	})
	.when('/examen', {
		controller: 'questionController',
		templateUrl: 'templates/examen.html'
	})
	.when('/resultado', {
		controller: 'resultController',
		templateUrl: 'templates/resultado.html'
	})
	.otherwise({
		redirectTo: '/'
	});
});

app.controller('loadController', function ($scope, $location, Preguntas, $http, dataResource) {
	$scope.comenzar = function(){
		//hacemos uso de $http para obtener los datos del json
	    $http.get('js/data.json').success(function (data) {
	        //Convert data to array.
	        //datos lo tenemos disponible en la vista gracias a $scope
	        Preguntas.preguntas = data;
	        console.log("data:" + JSON.parse(data));
	        $location.url('/examen');
	    });
	};
	
});

//controlador de pregunta, que controla toda la lógica
app.controller('questionController', function($scope, Preguntas ,$location, Score) {
    
    $scope.questions = Preguntas;


	$scope.numberQuestion = 1;
	$scope.question = $scope.questions[$scope.numberQuestion-1];
	$scope.checked = false;
	var responses = [];

	$scope.chooseKey = function(){
		angular.forEach($scope.question.keys, function(value, key) {
		  	value.active = false;
		});
		$scope.checked = true;
		this.key.active = true;
	};

	$scope.pass = function() {
		if($scope.numberQuestion < $scope.questions.length){
			$scope.numberQuestion++;
			$scope.question = $scope.questions[$scope.numberQuestion-1];
			$scope.checked = false;
		}
	};

	$scope.qualify = function() {
		angular.forEach($scope.question.keys, function(value, key) {
			if (value.active)
				responses.push({id:$scope.question.id,key:value.id});
		});
		$scope.pass();
	};

	$scope.endExam = function() {
		$scope.qualify();
		angular.forEach($scope.questions, function(question, i) {
			angular.forEach(responses, function(item,j){
				if(question.id == item.id && question.response == item.key){
					Score.score = Score.score + 10;
				}
			});
		});
		
	};
});

//controlador de resultado
app.controller('resultController', function($scope, Score, $http, dataResource) {
	$scope.score = Score.score;
    //datosResource lo tenemos disponible en la vista gracias a $scope
    //$scope.datosResource = dataResource.get();
    //console.log('datosResource:' + $scope.datosResource);
});

//de esta forma tan sencilla consumimos con $resource en AngularJS
app.factory("dataResource", function ($resource) {
    return $resource("http://rest-service.guides.spring.io/greeting", //la url donde queremos consumir
        {}, //aquí podemos pasar variables que queramos pasar a la consulta
        //a la función get le decimos el método, y, si es un array lo que devuelve
        //ponemos isArray en true
        { get: { method: "GET", isArray: false }
    })
});

//servicio que permite psar la variable "score entre el controlador de examen y resultado"
app.factory('Score', function(){
	return {score: 0};
});


app.factory('Preguntas', function () {
	return {
		preguntas:{}
	};
});
//Fabrica que retorna la lista de preguntas
app.factory('Questions', function(){
	return [
		{
			id: 1,
			premise: '¿Cómo se produce la inyección de dependencias en AngularJS?',
			keys: [
				{
					id: 1,
					text: 'La inyección de dependencias solo se produce en los módulos',
					active: false
				},
				{
					id: 2,
					text: 'La inyección de dependencias no existe en angularJS',
					active: false
				},
				{
					id: 3,
					text: 'Cualquier componente de AngularJS puede ser requerido por otro componente como si fuera un parámetro',
					active: false
				},
				{
					id: 4,
					text: 'La inyecciòn de dependencias permite solo inyectar el $scope',
					active: false
				}
			],
			status: true,
			visible: false,
			response: 3
		},
		{
			id: 2,
			premise: '$scope:',
			keys: [
				{
					id: 1,
					text: 'Es el contexto en el que se inicializa una variable, función u objeto',
					active: false
				},
				{
					id: 2,
					text: 'Es un modelo',
					active: false
				},
				{
					id: 3,
					text: 'Es el contexto global de node',
					active: false
				},
				{
					id: 4,
					text: 'Es el ámbito donde no se puede acceder al DOM',
					active: false
				}
			],
			status: true,
			visible: false,
			response: 1
		},
		{
			id: 3,
			premise: 'Un módulo en AngularJS puede ser declarado de las siguientes formas, menos:',
			keys: [
				{
					id: 1,
					text: 'ng-module="app"',
					active: false
				},
				{
					id: 2,
					text: 'angular.module("app",[])',
					active: false
				},
				{
					id: 3,
					text: 'Angular.module("app")',
					active: false
				},
				{
					id: 4,
					text: 'ng-app("app")',
					active: false
				}
			],
			status: true,
			visible: false,
			response: 2
		}
	];
});





