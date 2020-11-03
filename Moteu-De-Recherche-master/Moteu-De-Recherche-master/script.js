var singerArr=[];
$( document ).ready(function() {
    function loadAllSingers(){
		
         var singerListSPARQL = "prefix foaf: <http://xmlns.com/foaf/0.1/> prefix dbo: <http://dbpedia.org/ontology/> prefix rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> select distinct ?name Where { ?x rdf:type dbo:MusicalArtist. ?x foaf:name ?name. ?x dbo:birthDate ?birth. filter(?birth >= \"19000101\"^^xsd:date)}";
         var progress=10;
         //Preparing SPARQL query against DBPedia
         var singerNameQuery = "http://dbpedia.org/sparql?default-graph-uri=http%3A%2F%2Fdbpedia.org&query=" + escape(singerListSPARQL) + "&format=json";
         var progress=20;

        $.ajax({
         url: singerNameQuery,
         dataType: 'jsonp',
         jsonp: 'callback',
         success: function(data) {
              //singerArr = [];
            for (var i = 0; i < data.results.bindings.length; i++) {
                singerArr.push(data.results.bindings[i].name.value);
             }
            var progress=30;
            $('#singers').autocomplete({
              source: singerArr,
             delay: 30
            });
            },  
         error: function(e) {
             alert(e);
         }
        });
    }

    loadAllSingers();
      $('#tableResult2').hide();
	  $('#tableResult3').hide();
	  $('#tableResult4').hide();
    
});


    $( "#research" ).click(function(e) {
	
      event.preventDefault();  
      var nbResult=researchSinger($( "#singers" ).val() );
	  console.log(nbResult);
	  
    });


	function researchSingerName(partName){
		console.log(partName);
		if(partName.length>=3){
			 var singerListSPARQL = "prefix foaf: <http://xmlns.com/foaf/0.1/> prefix dbo: <http://dbpedia.org/ontology/> prefix rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> select distinct ?name Where { ?x rdf:type dbo:MusicalArtist. ?x foaf:name ?name. filter contains(?name,\""+ partName +"\").}";
			 var progress=10;
			 //Preparing SPARQL query against DBPedia
			 var singerNameQuery = "http://dbpedia.org/sparql?default-graph-uri=http%3A%2F%2Fdbpedia.org&query=" + escape(singerListSPARQL) + "&format=json";
			 var progress=20;

			$.ajax({
			 url: singerNameQuery,
			 dataType: 'jsonp',
			 jsonp: 'callback',
			 success: function(data) {
				 var singerArrNew = [];
				for (var i = 0; i < data.results.bindings.length; i++) {
					singerArrNew.push(data.results.bindings[i].name.value);
				 }
				var progress=30;
				$('#singers').autocomplete({
				  source: singerArrNew,
				 delay: 30
				});
				},  
			 error: function(e) {
				 alert(e);
			 }
			});
		}else{
			 $('#singers').autocomplete({
              source: singerArr,
             delay: 30
            });
		}
	}

    function researchSinger(singerName) {
         var singerSPARQL = "prefix foaf: <http://xmlns.com/foaf/0.1/> prefix dbo: <http://dbpedia.org/ontology/> prefix rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> select distinct ?name, ?birthName,?birthDate,?deathDate,str(?birthPlace),?spouse,?picture,?description,?gender Where { ?x rdf:type dbo:MusicalArtist. ?x foaf:name ?name.  filter contains(?name,\""+ singerName +"\"). optional{?x foaf:gender ?gender} .optional{?x dbo:birthName ?birthName } optional{?x dbo:birthDate ?birthDate FILTER ( ?birthDate >= \"19000101\"^^xsd:date && ?birthDate <= \"20991231\"^^xsd:date ) } optional{?x dbo:deathDate ?deathDate  FILTER ( ?deathDate >= \"19000101\"^^xsd:date && ?deathDate <= \"20991231\"^^xsd:date )} optional{?x dbo:birthPlace ?birthPlace } optional{?x dbo:spouse ?spouse} optional{?x dbo:thumbnail ?picture} optional{?x dct:description ?description} }";
         var singerNameQuery = "http://dbpedia.org/sparql?default-graph-uri=http%3A%2F%2Fdbpedia.org&query=" + escape(singerSPARQL) + "&format=json&timeout=3000000";
         
         $.ajax({
             url: singerNameQuery,
             dataType: 'jsonp',
             jsonp: 'callback',
             success: function(data) {
                $('#tableResult tbody').empty();
				$('#multipleResult').empty();
                $('#tableResult4 tbody').empty();
				var nbResult=data.results.bindings.length;
				if(nbResult==0){
					$('#multipleResult').append('Désolé,aucun résultat n\'est trouvé');
				}else{
					if(data.results.bindings[0].name != null){
						$('#tableResult').append('<tr><td> <B>Nom</B> </td><td>'+ data.results.bindings[0].name.value +'</td></tr>');
					}
					
					if(data.results.bindings[0].gender != null){
						if(data.results.bindings[0].gender.value=='female'){
							$('#tableResult').append('<tr><td><B>Genre</B> </td><td>'+'Femme'+'</td></tr>');
						}else if(data.results.bindings[0].gender.value=='male'){
							$('#tableResult').append('<tr><td><B>Genre</B> </td><td>'+'Homme'+'</td></tr>');
						} 
					}
					
					if(data.results.bindings[0].description != null){
						$('#tableResult').append('<tr><td><B>Description</B> </td><td>'+ data.results.bindings[0].description.value +'</td></tr>');
					}
									

					if(data.results.bindings[0].birthName != null){
						$('#tableResult').append('<tr><td><B>Nom de naissance</B> </td><td>'+ data.results.bindings[0].birthName.value +'</td></tr>');
					}

					if(data.results.bindings[0].birthDate != null){
						$('#tableResult').append('<tr><td><B>Date de naissance</B> </td><td>'+ data.results.bindings[0].birthDate.value +'</td></tr>');
					}

					if(data.results.bindings[0].deathDate != null){
						$('#tableResult').append('<tr><td><B>Date de decès</B> </td><td>'+ data.results.bindings[0].deathDate.value +'</td></tr>');
					}

					if(data.results.bindings[0].spouse != null){
						$('#tableResult').append('<tr><td><B>Epoux/Epouse</B> </td><td>'+ splitString(data.results.bindings[0].spouse.value) +'</td></tr>');
					}

					if(data.results.bindings[0].picture != null){
						var image = "<img class=\"picture\" src=\""+ data.results.bindings[0].picture.value +"\"  alt=\"photo\">"
						$('#tableResult').append('<tr><td><B>Photo</B> </td><td> '+ image +'</td></tr>');
					}
					
					if(data.results.bindings.length>1&&data.results.bindings[0].name != null&&data.results.bindings[1].name != null&&data.results.bindings[0].description.value != data.results.bindings[1].description.value){
						$('#tableResult4').show();
						$('#multipleResult').append('Plusieurs Résultats sont trouvés:');
						$('#multipleResult').append('1.'+data.results.bindings[0].description.value+' 2.'+data.results.bindings[1].description.value);
						if(data.results.bindings[1].name != null){
						$('#tableResult4').append('<tr><td>Nom </td><td>'+ data.results.bindings[1].name.value +'</td></tr>');
						}
					
						if(data.results.bindings[1].gender != null){
							if(data.results.bindings[1].gender.value=='female'){
								$('#tableResult4').append('<tr><td><B>Genre</B> </td><td>'+'Femme'+'</td></tr>');
							}else if(data.results.bindings[1].gender.value=='male'){
								$('#tableResult4').append('<tr><td><B>Genre</B> </td><td>'+'Homme'+'</td></tr>');
							} 
						}
									
						if(data.results.bindings[1].description != null){
							$('#tableResult4').append('<tr><td><B>Déscription</B> </td><td>'+ data.results.bindings[1].description.value +'</td></tr>');
						}

						if(data.results.bindings[1].birthName != null){
							$('#tableResult4').append('<tr><td><B>Nom de naissance </B></td><td>'+ data.results.bindings[1].birthName.value +'</td></tr>');
						}

						if(data.results.bindings[1].birthDate != null){
							$('#tableResult4').append('<tr><td><B>Date de naissance </B></td><td>'+ data.results.bindings[1].birthDate.value +'</td></tr>');
						}

						if(data.results.bindings[1].deathDate != null){
							$('#tableResult4').append('<tr><td><B>Date de decès</B> </td><td>'+ data.results.bindings[1].deathDate.value +'</td></tr>');
						}

						if(data.results.bindings[1].spouse != null){
							$('#tableResult4').append('<tr><td><B>Epoux/Epouse</B> </td><td>'+ data.results.bindings[1].spouse.value +'</td></tr>');
						}

						if(data.results.bindings[1].picture != null){
							var image = "<img class=\"picture\" src=\""+ data.results.bindings[1].picture.value +"\"  alt=\"photo\">"
							$('#tableResult4').append('<tr><td><B>Photo</B> </td><td> '+ image +'</td></tr>');
						}
						
					}else{
						$('#tableResult4').hide();
					}
					
					
					  var res = $( "#singers" ).val() ;
					  res = res.replace(" ", "_");
					  researchAlbum(res);
					  researchSong(res);
	  
				}
				
				
             },  
            error: function(e) {
              alert(e);
             }
         });
		 
		 
	 }
         
         function researchAlbum(singerName) {
         var singerSPARQL = "prefix foaf: <http://xmlns.com/foaf/0.1/> prefix dbo: <http://dbpedia.org/ontology/> prefix dbp: <http://dbpedia.org/property/> prefix rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> select distinct ?name ?artist ?releaseDate ?company Where { ?x rdf:type dbo:Album. ?x dbo:artist ?artist. filter contains(str(?artist),\""+ singerName +"\"). ?x dbp:thisAlbum ?name. Optional{?x dbo:releaseDate ?releaseDate}. Optional{?x dbo:recordLabel ?company}.}Limit 5.";
         var singerNameQuery = "http://dbpedia.org/sparql?default-graph-uri=http%3A%2F%2Fdbpedia.org&query=" + escape(singerSPARQL) + "&format=json";    
         console.log(singerSPARQL);     
         $.ajax({
             url: singerNameQuery,
             dataType: 'jsonp',
             jsonp: 'callback',
             success: function(data) {
				 console.log(data);
				 $('#tableResult2').show();
                $('#tableResult2 tbody').empty();
				var i=0;
				var albums="";
				var count = data.results.bindings.length;
				console.log(count);
				for(i=0;i<count;i++){
					if(data.results.bindings[i].name != null && data.results.bindings[i].releaseDate != null && data.results.bindings[i].company != null){
						$('#tableResult2').append('<tr><td>'+data.results.bindings[i].name.value +'</td><td>'+ data.results.bindings[i].releaseDate.value +'</td><td>'+ splitString(data.results.bindings[i].company.value) +'</td></tr>');
					}else if(data.results.bindings[i].name != null && data.results.bindings[i].releaseDate != null ){
						$('#tableResult2').append('<tr><td>'+data.results.bindings[i].name.value +'</td><td>'+ data.results.bindings[i].releaseDate.value +'</td><td>'+ 'Inconnu' +'</td></tr>');

					}else{
						break;
					}
				}  
				
				albums = albums.slice(0,-1);
				console.log(albums);
				                                       
             },  
            error: function(e) {
              alert(e);
             }
         });
	 }
         
    function researchSong(singerName) {
	     var Song = "Song";
         var singerSPARQL = "prefix foaf: <http://xmlns.com/foaf/0.1/> prefix dbo: <http://dbpedia.org/ontology/> prefix dbp: <http://dbpedia.org/property/> prefix rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> select distinct ?name ?album Where { ?x rdf:type dbo:MusicalWork. ?x dbo:artist ?artist. filter contains(str(?artist),\""+ singerName +"\"). ?x rdf:type ?type. ?x foaf:name ?name. filter contains(str(?type),\"Song\"). ?x dbo:album ?album. }Limit 5.";
         var singerNameQuery = "http://dbpedia.org/sparql?default-graph-uri=http%3A%2F%2Fdbpedia.org&query=" + escape(singerSPARQL) + "&format=json";    
         console.log(singerSPARQL);     
         $.ajax({
             url: singerNameQuery,
             dataType: 'jsonp',
             jsonp: 'callback',
             success: function(data) {
				 console.log(data);
				 $('#tableResult3').show();
                $('#tableResult3 tbody').empty();
				var i=0;
				var count = data.results.bindings.length;
				console.log(count);
				for(i=0;i<count;i++){
					if(data.results.bindings[i].name != null && data.results.bindings[i].album != null){
						  $('#tableResult3').append('<tr><td>'+data.results.bindings[i].name.value +'</td><td>'+ splitString(data.results.bindings[i].album.value) +'</td></tr>');
					}else{
						break;
					}
				}  
				
				                                       
             },  
            error: function(e) {
              alert(e);
             }
         });
         
    }

	function splitString(str){
		var arr = str.split('/');
		var newStr = arr[arr.length-1];
		newStr = newStr.replace(/_/g,' ');
		return newStr;
	}

